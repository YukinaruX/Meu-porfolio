const fs = require('node:fs');
const crypto = require('node:crypto');
const root = 'C:/Riclick/public/';
const staged = 'C:/my-portfolio/docs/private/riclick-responsive/';
const baseline = JSON.parse(fs.readFileSync(staged + 'baseline.json', 'utf8'));
for (const file of ['index.html', 'styles.css']) {
  const current = crypto.createHash('sha256').update(fs.readFileSync(root + file)).digest('hex');
  if (current !== baseline[file]) throw new Error(`Source changed since review: ${file}`);
}
for (const file of ['index.html', 'styles.css']) fs.copyFileSync(staged + file, root + file);
console.log('Applied responsive layout changes to Riclick index.html and styles.css. Backups retained in portfolio docs/private.');
