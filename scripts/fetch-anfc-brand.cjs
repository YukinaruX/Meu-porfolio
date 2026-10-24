const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const endpoint='repos/R-M-Holding-de-negocios/anfc/contents/public/images/brand.png';
const data=JSON.parse(execFileSync('gh',['api',endpoint],{encoding:'utf8',maxBuffer:5e6,timeout:45000}));
fs.mkdirSync('docs/private',{recursive:true});
fs.writeFileSync('docs/private/anfc-brand.png',Buffer.from(data.content,'base64'));
console.log('Marca original A-NFC salva localmente para inspeção.');
