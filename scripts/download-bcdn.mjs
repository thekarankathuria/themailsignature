import fs from 'node:fs'; import path from 'node:path';
const RAW='docs/research/raw';
const src=['home.html',...fs.readdirSync(RAW+'/pages').map(f=>'pages/'+f)].map(f=>fs.readFileSync(path.join(RAW,f),'utf8')).join('\n');
// The four 9x16 UGC testimonial clips total ~560 MB and are used only by
// /design-concepts, a Webflow scratch page we do not clone. Skipped on purpose.
const SKIP = /9x16_/;
const urls=[...new Set([...src.matchAll(/https:\/\/[a-z0-9.-]*b-cdn\.net\/[^"'\s<>)]+/gi)].map(m=>m[0]))].filter(u=>!SKIP.test(u));
const map=JSON.parse(fs.readFileSync(path.join(RAW,'asset-map.json'),'utf8'));
const dir='public/ces/video'; fs.mkdirSync(dir,{recursive:true});
let ok=0;
for(const u of urls){
  const name=decodeURIComponent(u.split('/').pop()).replace(/[^A-Za-z0-9._-]+/g,'-');
  const file=path.join(dir,name); map[u]='/ces/video/'+name;
  if(fs.existsSync(file)&&fs.statSync(file).size>0){ok++;continue}
  try{const r=await fetch(u,{headers:{'user-agent':'Mozilla/5.0'}}); if(!r.ok)throw new Error(r.status);
    fs.writeFileSync(file,Buffer.from(await r.arrayBuffer())); ok++; console.log('ok',name,(fs.statSync(file).size/1e6).toFixed(1)+'MB');
  }catch(e){console.error('FAIL',u,e.message)}
}
fs.writeFileSync(path.join(RAW,'asset-map.json'),JSON.stringify(map,null,2));
console.log(`${ok}/${urls.length} videos`);
