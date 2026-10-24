const fs=require('node:fs');
const path=require('node:path');
const backup='docs/private/before-anfc-blue';fs.mkdirSync(backup,{recursive:true});
for(const file of ['src/App.jsx','src/styles.css','src/main.jsx','index.html','public/favicon.svg']){
 const target=path.join(backup,file);fs.mkdirSync(path.dirname(target),{recursive:true});if(!fs.existsSync(target))fs.copyFileSync(file,target);
}
let css=fs.readFileSync('src/styles.css','utf8');
css=css.replaceAll('bronze','accent').replaceAll('#f3ede2','#ffffff').replaceAll('#0b0a08','#000000').replaceAll('#b8916a','#6291ff').replaceAll('#b2a79b','#a5adbd').replaceAll('#40372d','#202a3b').replaceAll('rgb(11 10 8 /','rgb(0 0 0 /').replaceAll('#171410','#000000').replaceAll('#0f0d0a','#000000').replaceAll('#1a1712','#000000').replaceAll('serif-label','feature-label');
fs.writeFileSync('src/styles.css',css);
let entry=fs.readFileSync('index.html','utf8').replaceAll('#0b0a08','#000000').replace('Rikelme Batista | Software, interfaces e automação','Rikelme Batista | Desenvolvedor & Fundador da A-NFC').replace('Rikelme Batista | Software com contexto','Rikelme Batista | Desenvolvedor & Fundador da A-NFC');
fs.writeFileSync('index.html',entry);
let icon=fs.readFileSync('public/favicon.svg','utf8').replaceAll('#0b0a08','#000000').replaceAll('#f3ede2','#ffffff').replaceAll('#b8916a','#2563eb');fs.writeFileSync('public/favicon.svg',icon);
fs.mkdirSync('public/assets/brand',{recursive:true});fs.copyFileSync('docs/private/anfc-brand.png','public/assets/brand/anfc-original.png');
const dir='docs/design-references/anfc-blue';fs.mkdirSync(dir,{recursive:true});
const base='C:/Users/User/.codex/generated_images/01a1612e-75e6-7502-92ba-6dbe420114f5';
for(const[name,file]of Object.entries({hero:'exec-b675e56f-3756-4aa0-b45a-c53f6dba6a7d.png',anfc:'exec-c301bc01-5a4d-41ad-84ce-d7e8a047f48b.png',contact:'exec-dce6abe3-67ee-4c85-9916-41ccde378af2.png'}))fs.copyFileSync(path.join(base,file),`${dir}/${name}.png`);
const png=fs.readFileSync('public/assets/brand/anfc-original.png');console.log(JSON.stringify({brandWidth:png.readUInt32BE(16),brandHeight:png.readUInt32BE(20)}));
