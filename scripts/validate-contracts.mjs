import SwaggerParser from '@apidevtools/swagger-parser';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const results = [];
for (const file of readdirSync('contracts').filter((x) => x.endsWith('.json')).sort()) {
  const spec = await SwaggerParser.validate('contracts/' + file);
  const operations = Object.values(spec.paths).reduce((sum, methods) => sum + Object.keys(methods).length, 0);
  results.push({ file, valid: true, operations });
  console.log('VALID', file, operations, 'operations');
}
if (results.length !== 6) throw new Error('Expected six service contracts');
const collection = JSON.parse(readFileSync('postman/LAB3.postman_collection.json'));
mkdirSync('evidence', { recursive: true });
writeFileSync('evidence/contracts-validation.json', JSON.stringify({ at: new Date().toISOString(), results, postmanRequests: collection.item.length }, null, 2));
