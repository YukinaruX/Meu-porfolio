const {execFileSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const dir=path.resolve(__dirname,'../docs/private');
fs.mkdirSync(dir,{recursive:true});
function api(endpoint){return JSON.parse(execFileSync('gh',['api',endpoint],{encoding:'utf8',maxBuffer:20*1024*1024,stdio:['ignore','pipe','pipe']}));}
const repos=[];
for(let page=1;;page++){const batch=api(`user/repos?per_page=100&affiliation=owner,collaborator,organization_member&sort=pushed&page=${page}`);repos.push(...batch);if(batch.length<100)break;}
const data={checkedAt:new Date().toISOString(),user:api('user'),organizations:api('user/orgs'),repositories:[]};
for(const r of repos){
 const item={name:r.full_name,private:r.private,fork:r.fork,description:r.description,homepage:r.homepage,language:r.language,pushedAt:r.pushed_at,defaultBranch:r.default_branch};
 try{const readme=api(`repos/${r.full_name}/readme`);item.readme=Buffer.from(readme.content,'base64').toString('utf8');}catch{item.readme=null;}
 try{item.languages=api(`repos/${r.full_name}/languages`);}catch{item.languages={};}
 try{item.commits=api(`repos/${r.full_name}/commits?author=YukinaruX&per_page=5`).map(c=>({sha:c.sha,date:c.commit.author.date,message:c.commit.message.split('\n')[0]}));}catch{item.commits=[];}
 data.repositories.push(item);
 fs.writeFileSync(path.join(dir,'github-audit.json'),JSON.stringify(data,null,2));
 console.log(`${item.name}: ${item.commits.length} commits recentes vinculados à conta; README ${!!item.readme}`);
}
