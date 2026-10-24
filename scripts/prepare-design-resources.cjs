const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const api = endpoint => JSON.parse(execFileSync('gh', ['api', endpoint], { encoding: 'utf8', maxBuffer: 5e6, timeout: 45000 }));
const base = 'docs/private/skills';
fs.mkdirSync(base, { recursive: true });
const history = api('repos/Leonxlnx/taste-skill/commits/825e306497883c421c541b167e106b243e0ca2e7');
const oldRef = history.parents[0].sha;
const specs = [
 ['taste-v1', 'Leonxlnx/taste-skill', 'skills/taste-skill-v1/SKILL.md', oldRef],
 ['image-to-code', 'Leonxlnx/imagegen-skills', 'skills/image-to-code/SKILL.md', 'main'],
 ['professional', 'bergside/awesome-design-skills', 'skills/professional/SKILL.md', 'main'],
 ['professional', 'bergside/awesome-design-skills', 'skills/professional/DESIGN.md', 'main'],
 ['web-design-guidelines', 'vercel-labs/agent-skills', 'skills/web-design-guidelines/SKILL.md', 'main'],
 ['playwright-cli', 'microsoft/playwright-cli', 'skills/playwright-cli/SKILL.md', 'main'],
];
for (const [name, repo, path, ref] of specs) {
 const data = api(`repos/${repo}/contents/${path}?ref=${ref}`);
 fs.mkdirSync(`${base}/${name}`, { recursive: true });
 fs.writeFileSync(`${base}/${name}/${path.split('/').pop()}`, Buffer.from(data.content, 'base64'));
 console.log(`${name}: ${data.html_url}`);
}
