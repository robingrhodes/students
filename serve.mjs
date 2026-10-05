import http from 'http';import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const root=path.dirname(fileURLToPath(import.meta.url)),types={'.html':'text/html','.js':'text/javascript','.json':'application/json'};
http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';
  fs.readFile(path.join(root,p),(e,d)=>{if(e){s.writeHead(404);s.end('nf');return}s.writeHead(200,{'Content-Type':types[path.extname(p)]||'text/plain'});s.end(d)})}).listen(8760);
