import fs from 'fs';
const rd=f=>JSON.parse(fs.readFileSync(f));
const r5=n=>Math.round(n*1e5)/1e5;
const rg=c=>typeof c[0]==='number'?[r5(c[0]),r5(c[1])]:c.map(rg);
const slim=(f,keep)=>rd(f).features.filter(x=>x.geometry).map(x=>{
  const p={};keep.forEach(k=>p[k]=x.properties[k]);
  return {type:'Feature',properties:p,geometry:{type:x.geometry.type,coordinates:rg(x.geometry.coordinates)}};});
const fc=a=>({type:'FeatureCollection',features:a});
// HIN: keep segments that matter for people on foot
const hin=rd('../hin_segments.geojson').features.filter(f=>f.properties.NumPedestr>=5||f.properties.NumSeriFat>=3)
 .map(f=>({type:'Feature',properties:{n:f.properties.FULLNAME,pe:f.properties.NumPedestr,sf:f.properties.NumSeriFat,bi:f.properties.NumBicycli},geometry:{type:'LineString',coordinates:rg(f.geometry.coordinates)}}));
const D={
 schools:fc(slim('schools.json',['NAME','ADDRESS','CATEGORY','GRADES','TYPE'])),
 bus:fc(slim('busall.json',['stop_name','Rider_Tota','Routes_Ser','Shelter'])),
 rec:fc(slim('rec.json',['NAME','ADDRESS','TYPE'])),
 lib:fc(slim('lib.json',['name','address'])),
 parks:fc(slim('parks.json',['parkName','prkAcreage'])),
 signals:fc(slim('signals.json',['ADDRESS','OBJECT_NAM'])),
 hin:fc(hin)};
fs.writeFileSync('data.js','window.BMORE='+JSON.stringify(D)+';');
for(const k in D)console.log(k,D[k].features.length);
