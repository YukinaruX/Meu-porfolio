const {spawn, execFileSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const cli=path.resolve('node_modules/playwright/cli.js');
const session='rikelme-check';
const run=args=>execFileSync(process.execPath,[cli,'cli',`-s=${session}`,...args],{encoding:'utf8',maxBuffer:5e6,timeout:240000});
(async()=>{
  fs.mkdirSync('docs/private',{recursive:true});
  // Run against a production build. Use a dedicated local port; never attach to a user's browser.
  const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4183','--strictPort'],{stdio:'pipe',windowsHide:true});
  let serverError='';server.stderr.on('data',data=>{serverError+=data;});
  let opened=false;
  try{
    let ready=false;
    for(let attempt=0;attempt<40;attempt++){
      if(server.exitCode!==null)throw new Error('Preview failed: '+serverError);
      try{const response=await fetch('http://127.0.0.1:4183/');if(response.ok){ready=true;break;}}catch{}
      await new Promise(resolve=>setTimeout(resolve,250));
    }
    if(!ready)throw new Error('Preview did not start');
    console.log(run(['open','http://127.0.0.1:4183/','--browser=chrome']));opened=true;
    const output=run(['run-code','--filename=scripts/portfolio-browser-check.js']);
    fs.writeFileSync('docs/private/react-browser-check.log',output);
    const result=output.match(/### Result\s*\n(\{[^\n]+\})/);
    if(!result)throw new Error('Browser check did not return a result; inspect docs/private/react-browser-check.log');
    const parsed=JSON.parse(result[1]);
    if(parsed.accessibility.length||parsed.pageErrors.length)throw new Error('Browser or accessibility violations: '+JSON.stringify(parsed));
    fs.writeFileSync('docs/private/react-qa.json',JSON.stringify(parsed,null,2));
    console.log(JSON.stringify(parsed,null,2));
  }finally{
    if(opened)try{run(['close']);}catch{}
    server.kill();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
