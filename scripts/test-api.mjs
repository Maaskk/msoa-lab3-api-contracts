import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import net from 'node:net';
import newman from 'newman';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const names = ['auth', 'catalog', 'inventory', 'orders', 'payments', 'shipping'];
const children = [];
const data = mkdtempSync(join(tmpdir(), 'lab3-api-'));
const key = randomBytes(32).toString('hex');
let logs = '';
mkdirSync('evidence', { recursive: true });
try {
  for (const port of [8081, 8082, 8083, 8084, 8085, 8086]) {
    const probe = net.createServer();
    probe.listen(port, '127.0.0.1');
    await once(probe, 'listening');
    await new Promise((resolve) => probe.close(resolve));
  }
  for (const name of names) {
    const p = spawn(process.execPath, ['backend/services/' + name + '/index.mjs'], {
      env: { ...process.env, HOST: '127.0.0.1', DATA_DIR: data, INTERNAL_KEY: key },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    children.push(p);
    p.stdout.on('data', (x) => { logs += x; });
    p.stderr.on('data', (x) => { logs += x; });
  }
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      await Promise.all(names.map(async (name, i) => {
        const response = await fetch('http://127.0.0.1:' + (8081 + i) + '/health');
        assert.equal((await response.json()).service, name);
      }));
      break;
    } catch {
      if (attempt === 79) throw new Error(logs);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  const catalog = 'http://127.0.0.1:8082';
  const legacy = await (await fetch(catalog + '/products/1')).json();
  const modern = await (await fetch(catalog + '/api/v2/products/1')).json();
  const euro = await (await fetch(catalog + '/api/v2/products/1?currency=EUR')).json();
  const spec = JSON.parse(readFileSync('contracts/catalog.openapi.json'));
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  const validV1 = ajv.compile({ components: spec.components, $ref: '#/components/schemas/ProductV1' });
  const validV2 = ajv.compile({ components: spec.components, $ref: '#/components/schemas/ProductV2' });
  assert.equal(validV1(legacy), true);
  assert.equal(validV2(modern), true);
  assert.equal(validV1(modern), false, 'An object price must break the old schema');
  assert.equal(validV2(legacy), false);
  assert.equal(JSON.parse(JSON.stringify(modern)).price.currency, 'MAD');
  assert.equal(Number.isNaN(modern.price * 2), true);
  assert.throws(() => modern.price.toFixed(2), TypeError);
  assert.equal(legacy.price, 8499);
  assert.equal(legacy.price.toFixed(2), '8499.00');
  assert.equal(modern.price.amount, legacy.price);
  assert.equal(euro.price.currency, 'EUR');
  writeFileSync('evidence/pricing-compatibility.json', JSON.stringify({
    at: new Date().toISOString(), legacy, modern, euro,
    validJsonDoesNotMeanSameContract: true,
    oldSchemaRejectsObjectPrice: true,
    oldNumericConsumerRejectsObjectPrice: true,
    existingNumericConsumerStillWorks: true,
    legacyOrderCurrency: 'MAD',
    foreignPriceLists: 'Fixed demonstration price lists; not live FX and not foreign-currency checkout',
  }, null, 2));
  for (const [contentType, body, code] of [
    ['text/plain', JSON.stringify({ email: 'x@example.test', password: 'test' }), 415],
    ['application/json', '{invalid', 400],
  ]) {
    const res = await fetch('http://127.0.0.1:8081/api/auth/login', { method: 'POST', headers: { 'Content-Type': contentType }, body });
    assert.equal(res.status, code);
    assert.equal(typeof (await res.json()).requestId, 'string');
  }
  const summary = await new Promise((resolve, reject) => newman.run({
    collection: JSON.parse(readFileSync('postman/LAB3.postman_collection.json')),
    reporters: ['cli'], color: 'off', timeoutRequest: 6000,
  }, (error, result) => error ? reject(error) : resolve(result)));
  const result = {
    at: new Date().toISOString(), stats: summary.run.stats,
    failures: summary.run.failures.map((f) => ({ source: f.source?.name, error: f.error?.message })),
    executions: summary.run.executions.map((e) => ({ name: e.item.name, status: e.response?.code,
      assertions: e.assertions.map((a) => ({ assertion: a.assertion, passed: !a.error, ...(a.error ? { error: a.error.message } : {}) })),
    })),
    guardChecks: ['wrong Content-Type rejected with 415', 'invalid JSON rejected with 400'],
  };
  writeFileSync('evidence/postman-results.json', JSON.stringify(result, null, 2));
  assert.equal(summary.run.failures.length, 0, 'Postman assertions failed');
  console.log('POSTMAN SUCCESS:', summary.run.stats.requests.total, 'requests;', summary.run.stats.assertions.total, 'assertions');
} finally {
  await Promise.all(children.map(async (p) => {
    if (p.exitCode !== null) return;
    const done = once(p, 'exit');
    p.kill('SIGTERM');
    await done;
  }));
  writeFileSync('evidence/api-services.log', logs);
  rmSync(data, { recursive: true, force: true });
}
