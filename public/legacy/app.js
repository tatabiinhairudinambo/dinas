/* eslint-disable */
/* ===========================================================================
   MESIN LEGACY "WEB KEDINASAN" (rev4-rev74, part74)
   ---------------------------------------------------------------------------
   File ini hasil gabungan utuh 21 blok <script> dari archive/original.html.
   Dimuat sebagai CLASSIC SCRIPT (bukan ES module) oleh src/lib/legacyBridge.js,
   setelah React memasang <div id="app"> dan <div id="m">.
   - Jangan di-import lewat `import`/bundler: binding global & onclick inline
     akan hilang dan seluruh layar mati.
   - CSS-nya sudah dipindah ke src/styles/*.css (urutan cascade dipertahankan).
   - render() saat load ditunda satu microtask supaya deklarasi let/const dari
     blok-blok akhir (rev58+) sudah siap; lihat catatan di tools/extract-legacy.mjs
   - Regenerasi file ini: node tools/extract-legacy.mjs
   =========================================================================== */

function __legacyRender() {
  try {
    render();
  } catch (err) {
    console.error('[WebKedinasan] render gagal:', err);
  }
}

/* ================= blok 1 / 23 (baris 88) ================= */
const K='kedinasan_v2',$=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),rp=n=>'Rp'+Number(n||0).toLocaleString('id-ID');
const NEED={SKD:110,TWK:30,TIU:35,TKP:45},OFF={SKD:0,TWK:0,TIU:30,TKP:65},TH={TWK:65,TIU:80,TKP:166};
const qType=(p,i)=>p.type=='SKD'?(i<30?'TWK':i<65?'TIU':'TKP'):p.type,numOf=(p,i)=>OFF[p.type]+i+1;
const empty=()=>({t:'',o:['','','','',''],a:null,w:[null,null,null,null,null],pem:'',oi:[]});
function gen(t){return Array.from({length:NEED[t]},(_,i)=>({t:`Contoh soal ${t} ke-${i+1}. (Edit lewat Bank Soal operator)`,o:['A','B','C','D','E'].map(x=>'Opsi '+x),a:i%5,w:[5,4,3,2,1],pem:'Pembahasan contoh.',oi:[]}))}
let S;try{S=JSON.parse(localStorage.getItem(K))}catch(e){}
if(!S)S={users:[],me:null,packages:[{id:1,name:'Try Out SKD Perdana',type:'SKD',price:25000,promo:0,desc:'',pub:1,hidden:0,qs:gen('SKD')},{id:2,name:'Latihan TWK Dasar',type:'TWK',price:10000,promo:0,desc:'',pub:1,hidden:0,qs:gen('TWK')}],owned:{},banner:'📢 Selamat datang! Try Out SKD terbaru sudah tersedia.',logo:'',promos:[],logs:[],pay:{},res:{},exam:null,seq:3};
const save=()=>{try{(S.packages||[]).forEach(p=>{if(p.promoCut==null)p.promoCut=p.promoPrice>0?Math.max(0,(p.promo||p.price)-p.promoPrice):0;p.promoPrice=p.promoCut>0?Math.max(0,(p.promo||p.price)-p.promoCut):0});localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
let V='auth',AM='login',OP=false,Q='',TAB='SKD',CUR=null,E=null,TI=null,CL=[],MSG='',PROMO=null,NAVOPEN=false,ED=null,SEL=null,STAR=false,PT='beli',PTAB='Projekku',F='q',PAYEND=0,VA='';
const P=id=>S.packages.find(p=>p.id==id),log=(t,x)=>{S.logs.unshift({t,x,d:new Date().toLocaleString('id-ID')});save()};
const NAVH=[],ROOT=['home','paket','profil'];
const snapNav=()=>{let s={v:V,y:window.scrollY||0};try{s.TAB=TAB;s.CUR=CUR;s.Q=Q;s.Q2=Q2}catch(e){}return s};
const go=v=>{if(V!==v){if(ROOT.includes(v))NAVH.length=0;else if(V!=='exam'&&V!=='auth'&&V)NAVH.push(snapNav())}clearInterval(TI);V=v;MSG='';closeM();render();scrollTo(0,0)};
function goBack(fb){if(V==='exam')return;if(['buy','qris','va'].includes(V)&&CUR!=null&&S.owned[CUR]){NAVH.length=0;return go('home')}const s=NAVH.pop();if(!s||s.v===V)return go(fb||(typeof PAR!=='undefined'&&PAR[V])||'home');clearInterval(TI);if(s.TAB!=null)TAB=s.TAB;if(s.CUR!=null)CUR=s.CUR;if(s.Q!=null)Q=s.Q;if(s.Q2!=null)Q2=s.Q2;V=s.v;MSG='';closeM();window.BACKING=1;try{render()}finally{window.BACKING=0}const y=s.y||0;scrollTo(0,y);setTimeout(()=>scrollTo(0,y),30);setTimeout(()=>scrollTo(0,y),120)}
const closeM=()=>$('#m').innerHTML='';
const modal=h=>$('#m').innerHTML=`<div class=ov onclick="closeM()"></div><div class=mod>${h}</div>`;
const sheet=h=>$('#m').innerHTML=`<div class=ov onclick="closeM()"></div><div class=sheet>${h}</div>`;
const price=p=>p.promo?`<s class=mu>${rp(p.price)}</s> <b>${rp(p.promo)}</b>`:`<b>${rp(p.price)}</b>`;
function file(cb){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{const r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(i.files[0])};i.click()}
/* ---------- AUTH ---------- */
function auth(){
 if(AM=='daftar')return`<div class=box><h2 style="color:var(--ac)">Daftar Akun</h2><input id=n placeholder="Nama Lengkap"><input id=e type=email placeholder="Email (Gmail)"><input id=p type=password placeholder="Buat Kunci Akun (min. 6 digit)"><input id=p2 type=password placeholder="Konfirmasi Kunci Akun"><div class=er>${MSG}</div><button class=pm onclick=reg()>Daftar Sekarang</button><div class=mu style="text-align:center;cursor:pointer" onclick="AM='login';MSG='';render()">Sudah punya akun? Masuk</div></div>`;
 if(AM=='sent')return`<div class=box><h2>Cek Email Kamu</h2><p>Link konfirmasi sekali pakai dikirim ke <b>${esc(MSG)}</b>.</p><button class=pm onclick=verify()>Buka Link Konfirmasi (simulasi)</button></div>`;
 return`<div class=box><h2 style="color:var(--ac)">Masuk — Web Kedinasan</h2>${MSG&&MSG[0]=='✔'?`<div class=ok>${MSG}</div>`:`<div class=er>${MSG}</div>`}<input id=e type=email placeholder="Email"><input id=p type=password placeholder="Kunci Akun"><button class=pm onclick=login()>Masuk</button><div style="margin-top:-8px"><span style="font-size:12px;color:var(--mu);cursor:pointer" onclick=lupa()>Lupa Kunci Akun?</span></div><div id=lp></div><div class=mu style="text-align:center;cursor:pointer" onclick="AM='daftar';MSG='';render()">Belum punya akun? Daftar</div></div>`}
function lupa(){$('#lp').innerHTML=`<input id=re placeholder=Email style="margin-bottom:16px"><input id=rp1 type=password placeholder="Kunci Baru" style="margin-bottom:16px"><input id=rp2 type=password placeholder="Konfirmasi Kunci Baru" style="margin-bottom:16px"><button class=pm onclick=reset()>Pulihkan Akun</button>`}
function randomHex(len){const b=new Uint8Array(len);crypto.getRandomValues(b);return [...b].map(x=>x.toString(16).padStart(2,'0')).join('')}
function hexToBytes(hex){return Uint8Array.from(String(hex).match(/.{2}/g).map(b=>parseInt(b,16)))}
function bitsHex(bits){return [...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function pwHash(password,saltHex){
  saltHex=saltHex||randomHex(16);
  const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(password)),{name:'PBKDF2'},false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:hexToBytes(saltHex),iterations:100000},k,256);
  return 'pbk:'+saltHex+bitsHex(bits);
}
async function pwCheck(u,password){
  const stored=u&&u.p;
  if(typeof stored==='string'&&stored.startsWith('pbk:'))return pwHash(password,stored.slice(4,36)).then(h=>h.slice(36)===stored.slice(36));
  if(stored===password&&password){u.p=await pwHash(password);save();return true}
  return false;
}
async function reset(){
  const u=S.users.find(u=>u.e==$('#re').value.trim());
  if(!u||$('#rp1').value.length<6||$('#rp1').value!=$('#rp2').value){MSG='Data pemulihan tidak valid';return render()}
  try{u.p=await pwHash($('#rp1').value)}catch(e){u.p=$('#rp1').value}
  save();MSG='✔ Kunci akun berhasil diganti';render()
}
function reg(){
  const n=$('#n').value.trim(),e=$('#e').value.trim(),p=$('#p').value;
  if(!n||!e)MSG='Lengkapi semua kolom';
  else if(p.length<6)MSG='Kunci minimal 6 digit';
  else if(p!=$('#p2').value)MSG='Konfirmasi kunci tidak cocok';
  else if(S.users.find(u=>u.e==e))MSG='Email sudah terdaftar';
  else{
    const u={n,e,v:0,pic:''};
    S.users.push(u);
    pwHash(p).then(h=>{u.p=h;save()}).catch(()=>{u.p=p;save()});
    save();MSG=e;AM='sent';return render()
  }
  render()
}
function verify(){const u=S.users.find(u=>u.e==MSG);if(u)u.v=1;save();AM='login';MSG='✔ Verifikasi berhasil! Silakan masuk.';render()}
async function login(){
  const u=S.users.find(u=>u.e==$('#e').value.trim());
  const ok=u?await pwCheck(u,$('#p').value):false;
  if(!ok)MSG='Email atau kunci salah';
  else if(!u.v)MSG='Email belum diverifikasi';
  else{S.me=u;save();return go('home')}
  render()
}
/* ---------- SISWA / OPERATOR HOME ---------- */
function logoClick(){if(OP){return file(d=>{S.logo=d;save();render()})}const n=Date.now();CL=CL.filter(t=>n-t<1500);CL.push(n);if(CL.length>=12){CL=[];OP=true;go('home')}}
function home(){const ps=S.packages.filter(p=>p.pub&&!p.hidden&&p.name.toLowerCase().includes(Q.toLowerCase())).slice(0,7);
return`<div class=hd><div class=who onclick="go('edit')"><span class=av style="background-image:url(${S.me.pic||''})">${S.me.pic?'':'👤'}</span><b style="font-size:16px">${esc(S.me.n)}</b></div><div class=lg><div id=logo onclick=logoClick()>${S.logo?`<img src="${S.logo}">`:'LOGO'}</div>${OP?`<div class=ham onclick=side()>☰</div>`:''}</div></div>
${OP?'<div class=mu style="font-size:12px;text-align:center;margin-top:6px">MODE OPERATOR — ketuk banner/logo untuk mengedit</div>':''}
<div class=ban ${OP?'style="cursor:pointer" onclick=banner()':''}>${esc(S.banner)}${OP?' ✎':''}</div>
<button class=big onclick="TAB='SKD';go('paket')">YANG 110 SOAL</button>
<div class=g3>${['TWK','TIU','TKP'].map(t=>`<button onclick="TAB='${t}';go('paket')">TO ${t}</button>`).join('')}</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px"><b style="font-size:20px">Terbaru</b><input style="width:250px" placeholder="Cari paket…" value="${esc(Q)}" oninput="Q=this.value;list()"></div><div id=ls>${lst(ps)}</div>`}
const lst=ps=>ps.length?ps.map(p=>`<div class=row><div class=th style="background-image:url(${p.thumb||''})">${p.thumb?'':'📘'}</div><div class=dt><b>${esc(p.name)}</b><div class=mu>${p.type}</div><div>${price(p)}</div><div class=b><button style="background:var(--cd);color:var(--ac)" onclick=desc(${p.id})>Deskripsi</button><button style="background:var(--yl)" onclick="CUR=${p.id};PROMO=null;go('buy')">Beli</button></div></div></div>`).join(''):'<p class=mu>Belum ada paket.</p>';
function list(){$('#ls').innerHTML=lst(S.packages.filter(p=>p.pub&&!p.hidden&&p.name.toLowerCase().includes(Q.toLowerCase())).slice(0,7))}
function desc(id){const p=P(id);sheet(`<div style="display:flex;gap:10px"><div class=th style="background-image:url(${p.thumb||''})">${p.thumb?'':'📘'}</div><b>${esc(p.name)}</b></div><div style="font-size:28px;font-weight:700;color:${p.desc?'var(--tx)':'#999'};margin:14px 0;min-height:80px">${esc(p.desc)||'Kosong'}</div>`)}
function banner(){const t=prompt('Teks spanduk pengumuman:',S.banner);if(t!=null){S.banner=t;save();render()}}
function navbar(){const t=[['home','Beranda'],['paket','Daftar Paket'],['profil','Profil']];return`<div class=nav>${t.map(x=>`<div class="${V==x[0]?'on':''}" onclick="go('${x[0]}')">${x[0]=='home'?'🏠':x[0]=='paket'?'📚':'👤'}<span>${x[1]}</span></div>`).join('')}</div>`}
function paket(){const own=S.packages.filter(p=>S.owned[p.id]);
 if(!own.length)return`<div style="height:70vh;display:grid;place-items:center;color:#999;font-size:18px">Kamu belum membeli paket</div>`;
 return`<div class=tabs>${['SKD','TWK','TIU','TKP'].map(t=>`<button class="${TAB==t?'on':''}" onclick="TAB='${t}';render()">${t}</button>`).join('')}</div>`+(own.filter(p=>p.type==TAB).map(p=>{const r=S.res[p.id];return`<div class=row><div class=th>📘</div><div class=dt><b>${esc(p.name)}</b><div class=mu>${r?'Nilai terakhir: '+r.tot:'Belum dikerjakan'}</div><div class=b><button style="background:var(--ac);color:#fff;width:100%" onclick=mulai(${p.id})>MULAI</button></div></div></div>`}).join('')||'<p class=mu>Tidak ada paket di kategori ini.</p>')}
function mulai(id){const old=S.res[id];sheet(`<b>Pilih Mode Waktu</b>${old?'<p class=mu style="font-size:12px">Hasil lama tetap tersimpan di riwayat.</p>':''}${[30,40,50,0].map(t=>`<button style="width:100%;height:45px;margin-top:8px;background:var(--cd);color:var(--tx)" onclick=start(${id},${t})>${t?t+' menit':'Belajar tanpa waktu'}</button>`).join('')}`)}
function profil(){return`<div style="text-align:center;margin-top:30px"><span class=av style="width:96px;height:96px;margin:auto;background-image:url(${S.me.pic||''})">${S.me.pic?'':'👤'}</span><h3>${esc(S.me.n)}</h3><div class=mu>${esc(S.me.e)}</div><button style="height:44px;width:200px;margin:16px 4px;background:var(--ac);color:#fff" onclick="go('edit')">Edit Profil</button><br><button style="height:44px;width:200px;background:var(--cd);color:var(--tx)" onclick="S.me=null;OP=false;S.exam=null;save();AM='login';go('auth')">Keluar</button></div>`}
let IMG=null,ZM=1;
function edit(){return`<h3>Edit Profil</h3><p class=mu>Foto dipotong lingkaran 300px agar tidak lonjong.</p><div style="width:300px;height:300px;border-radius:50%;margin:auto;overflow:hidden;background:var(--cd);display:grid;place-items:center;border:3px solid var(--ac)">${IMG||S.me.pic?`<img id=pv src="${IMG||S.me.pic}" style="width:300px;height:300px;object-fit:cover;transform:scale(${ZM})">`:'👤'}</div><div style="width:300px;margin:12px auto"><input type=range min=1 max=3 step=.1 value=${ZM} oninput="ZM=+this.value;$('#pv')&&($('#pv').style.transform='scale('+ZM+')')"><button style="width:100%;height:42px;margin-top:10px;background:var(--cd);color:var(--tx)" onclick="file(d=>{IMG=d;ZM=1;render()})">Pilih Foto</button><button style="width:100%;height:42px;margin-top:10px;background:var(--ac);color:#fff" onclick=saveProf()>Simpan</button><button style="width:100%;height:42px;margin-top:10px;background:none;color:var(--mu)" onclick="IMG=null;go('home')">Batal</button></div>`}
function saveProf(){const src=IMG||S.me.pic;if(!src)return go('home');const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=300;const x=c.getContext('2d'),m=Math.min(im.width,im.height)/ZM,sx=(im.width-m)/2,sy=(im.height-m)/2;x.drawImage(im,sx,sy,m,m,0,0,300,300);S.me.pic=c.toDataURL('image/jpeg',.8);IMG=null;ZM=1;save();go('home')};im.src=src}
/* ---------- BELI ---------- */
function buy(){const p=P(CUR),base=p.promo||p.price,fin=PROMO?Math.round(base*.9):base;return`<div style="font-size:24px;cursor:pointer" onclick="go('home')">←</div><div style="height:150px;background:var(--cd);border-radius:12px;padding:14px"><b>${esc(p.name)}</b><div class=mu>${p.type} • ${NEED[p.type]} soal</div><div>${esc(p.desc)||''}</div></div><div style="font-size:22px;font-weight:700;margin:14px 0">HARGA: ${rp(fin)}</div><div style="display:flex;gap:5%"><input style="width:70%" id=kp placeholder="KODE PROMO" maxlength=6 value="${PROMO?PROMO.code:''}"><button style="width:25%;background:var(--yl)" onclick=cekPromo()>CEK PROMO</button></div><div class=${PROMO?'ok':'er'}>${MSG}</div><button style="width:100%;height:55px;margin-top:14px;background:var(--ac);color:#fff;font-weight:700" onclick=payPop()>BELI PAKET</button>`}
function cekPromo(){const c=$('#kp').value.trim(),pr=S.promos.find(x=>x.code==c&&x.on);PROMO=pr||null;MSG=pr?'✔ Promo '+pr.name+' aktif (diskon 10%)':'Kode promo tidak valid / nonaktif';render()}
function payPop(){sheet(`<div style="height:300px"><span style="font-size:20px;cursor:pointer" onclick=closeM()>✕</span><b style="margin-left:12px">Pilih Pembayaran</b>${['QRIS','BCA','BRI','MANDIRI'].map(b=>`<button style="width:100%;height:45px;margin-top:10px;background:var(--cd);color:var(--tx)" onclick="payGo('${b}')">${b}</button>`).join('')}</div>`)}
let BANK='';
function payGo(b){BANK=b;closeM();PAYEND=Date.now()+15*60000;VA='8800'+Array.from({length:12},()=>Math.floor(Math.random()*10)).join('');go(b=='QRIS'?'qris':'va');TI=setInterval(()=>{const s=Math.max(0,Math.round((PAYEND-Date.now())/1000)),e=$('#ptm');if(e)e.textContent='Batas waktu '+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},1000)}
function paid(){const p=P(CUR);S.owned[p.id]=1;log('beli',`${S.me.n} membeli ${p.name} via ${BANK}${PROMO?' (promo '+PROMO.code+')':''}`);PROMO=null;alert('Pembayaran diterima! Paket masuk ke Daftar Paket.');go('home')}
function qris(){let c='',h=Math.random;for(let y=0;y<25;y++)for(let x=0;x<25;x++){const f=(x<7&&y<7)||(x>17&&y<7)||(x<7&&y>17);if(f?!((x%18<7)&&(y%18<7)&&((x%18==0||x%18==6||y%18==0||y%18==6)||(x%18>1&&x%18<5&&y%18>1&&y%18<5))):h()>.5)continue;c+=`<rect x=${x*10} y=${y*10} width=10 height=10 fill=#000 />`}
 return`<div style="font-size:24px;cursor:pointer" onclick="go('buy')">←</div><div id=ptm style="color:#d22;font-size:14px;text-align:center;margin:12px">Batas waktu 15:00</div><div style="width:250px;height:250px;margin:auto;background:#fff;padding:5px;border:1px solid var(--bd)"><svg viewBox="0 0 250 250" width=240 height=240>${c}</svg></div><p class=mu style="text-align:center">QRIS dinamis sekali pakai</p><button style="display:block;margin:20px auto;height:44px;background:var(--ac);color:#fff" onclick=paid()>Simulasikan Transfer Berhasil</button>`}
function va(){const lg=S.pay[BANK];return`<div style="font-size:24px;cursor:pointer" onclick="go('buy')">←</div><div id=ptm style="color:#d22;font-size:14px;text-align:center;margin:12px">Batas waktu 15:00</div><div style="width:120px;height:60px;margin:auto;border:2px dashed orange;display:grid;place-items:center;font-weight:700;overflow:hidden">${lg?`<img src="${lg}" style="width:120px;height:60px;object-fit:contain">`:BANK}</div><div style="width:300px;height:50px;margin:16px auto;border:2px solid #d22;border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 10px"><b>${VA}</b><button style="background:var(--ac);color:#fff;height:30px" onclick="navigator.clipboard&&navigator.clipboard.writeText('${VA}');this.textContent='Tersalin'">Salin</button></div><button style="display:block;margin:20px auto;height:44px;background:var(--ac);color:#fff" onclick=paid()>Simulasikan Transfer Berhasil</button>`}
/* ---------- UJIAN ---------- */
function start(id,t){closeM();const p=P(id);E={id,i:0,ans:{},sk:{},sel:null,end:t?Date.now()+t*60000:0};S.exam=E;save();go('exam');tick()}
function tick(){clearInterval(TI);TI=setInterval(()=>{if(!E||!E.end)return;const s=Math.max(0,Math.round((E.end-Date.now())/1000)),e=$('#tm');if(e)e.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(!s)finish()},500)}
function exam(){const p=P(E.id),q=p.qs[E.i],n=p.qs.length,sel=E.sel??E.ans[E.i];
 return`<div style="display:flex;align-items:center;gap:8px"><button title=Refresh onclick="location.reload()" style="background:var(--cd);color:var(--tx);height:35px">⟳</button><b>Soal ${E.i+1}/${n}</b><span class=mu style="flex:1;text-align:center">${qType(p,E.i)}</span><span style="cursor:pointer;font-size:22px" onclick="NAVOPEN=true;render()">▦</span></div>
<div style="display:flex;gap:8px;margin-top:8px"><div id=tm style="width:80px;height:35px;background:#000;color:var(--yl);display:grid;place-items:center;border-radius:6px;font-weight:700">${E.end?'--:--':'∞'}</div><button style="flex:1;height:35px;background:#d22;color:#fff;font-weight:700" onclick="confirm('Akhiri ujian?')&&finish()">AKHIRI UJIAN</button></div>
<div class=sh style="margin:20px;background:var(--bg)"><div style="font-size:16px;margin-bottom:12px">${numOf(p,E.i)}. ${esc(q.t)}</div>${q.img?`<img src="${q.img}" style="max-width:100%">`:''}${q.o.map((o,j)=>`<button class="opt ${sel===j?'on':''}" style="font-size:14px" onclick="E.sel=${j};render()">${'ABCDE'[j]}. ${esc(o)}${q.oi&&q.oi[j]?`<br><img src="${q.oi[j]}" style="max-width:100%">`:''}</button>`).join('')}</div>
${NAVOPEN?navp(p):`<div class=fx><div style="display:flex;justify-content:space-between"><button style="width:48%;height:45px;background:var(--yl);font-weight:700" onclick=saveAns()>Simpan Jawaban</button><button style="width:48%;height:45px;background:#7ba5ff;color:#fff;font-weight:700" onclick=skip()>Lewati</button></div><button style="width:100%;height:40px;margin-top:8px;background:var(--bg);color:var(--tx);border:2px solid var(--tx)" onclick=prev()>Soal Sebelumnya</button></div>`}`}
function navp(p){return`<div class=sheet style="top:0;bottom:0;left:auto;right:max(0px,calc(50% - 240px));transform:none;width:min(80%,384px);border-radius:0;overflow:auto"><div style="display:flex;justify-content:space-between"><span style="font-size:22px;color:#888;cursor:pointer" onclick="NAVOPEN=false;render()">✕</span><button style="background:var(--cd);color:var(--tx)" onclick="location.reload()">⟳</button></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px">${p.qs.map((_,i)=>`<div class=nm style="background:${E.ans[i]!=null?'#1a9a3a':E.sk[i]?'#e0a800':'#d22'}" onclick="E.i=${i};E.sel=null;NAVOPEN=false;render()">${numOf(p,i)}</div>`).join('')}</div></div>`}
function nxt(){const n=P(E.id).qs.length;if(E.i<n-1)E.i++;E.sel=null;S.exam=E;save();render()}
function saveAns(){if(E.sel!=null){E.ans[E.i]=E.sel;delete E.sk[E.i]}nxt()}
function skip(){if(E.ans[E.i]==null)E.sk[E.i]=1;nxt()}
function prev(){if(E.i>0)E.i--;E.sel=null;render()}
function finish(){clearInterval(TI);const p=P(E.id);let sc={TWK:0,TIU:0,TKP:0},b=0,s=0,k=0,det=[];p.qs.forEach((q,i)=>{const t=qType(p,i),a=E.ans[i];if(a==null){k++;det.push({i,st:'kosong'});return}if(t=='TKP'){sc.TKP+=q.w[a]||0;b++;det.push({i,st:'jawab',a})}else if(a===q.a){sc.TWK+=t=='TWK'?5:0;sc.TIU+=t=='TIU'?5:0;b++;det.push({i,st:'benar',a})}else{s++;det.push({i,st:'salah',a})}});
 const inc=p.type=='SKD'?['TWK','TIU','TKP']:[p.type],ok=inc.every(t=>sc[t]>=TH[t]);S.res[p.id]={sc,inc,ok,b,s,k,det,tot:inc.reduce((a,t)=>a+sc[t],0)};log('kerja',`${S.me.n} menyelesaikan ${p.name}: ${S.res[p.id].tot} poin`);S.exam=null;E=null;NAVOPEN=false;save();CUR=p.id;go('result')}
function result(){const p=P(CUR),r=S.res[CUR];return`<div style="height:4px;background:var(--ac);margin:0 -14px 14px"></div><div style="display:flex;justify-content:space-between"><div style="font-size:14px;line-height:2"><div><b>${esc(p.name)}</b></div>${['TWK','TIU','TKP'].map(t=>`<div>${t}: ${r.inc.includes(t)?r.sc[t]+' / min '+TH[t]:'-'}</div>`).join('')}<div>Total: ${r.tot}</div></div><div style="width:90px;height:135px;border-radius:6px;background:var(--cd) center/cover;background-image:url(${S.me.pic||''});display:grid;place-items:center">${S.me.pic?'':'👤'}</div></div><div style="font-size:32px;font-weight:800;text-align:center;margin:60px 0;color:${r.ok?'#1a9a3a':'#d22'}">${r.ok?'KAMU LULUS':'KAMU TIDAK LULUS'}</div><div style="display:flex;gap:10px"><button style="flex:1;height:50px;background:var(--yl);font-weight:700" onclick=detail()>LIHAT HASIL</button><button style="flex:1;height:50px;background:var(--ac);color:#fff;font-weight:700" onclick="TAB='${p.type}';go('paket')">SELANJUTNYA</button></div>`}
function detail(){const p=P(CUR),r=S.res[CUR];$('#m').innerHTML=`<div class=ov onclick=closeM()></div><div style="position:fixed;z-index:40;right:max(0px,calc(50% - 240px));top:0;bottom:0;width:min(92%,440px);background:var(--bg);overflow:auto;padding:14px"><span style="cursor:pointer;font-size:20px" onclick=closeM()>✕</span><div style="height:120px;background:orange;color:#fff;border-radius:10px;padding:14px;margin:10px 0;font-weight:700">Rangkuman<br>Benar/terjawab: ${r.b}<br>Salah: ${r.s} • Kosong: ${r.k}</div><div style="font-size:13px;line-height:1.7">${r.inc.map(t=>`${t}: ${r.sc[t]} poin`).join('<br>')}</div><hr>${r.det.map(d=>{const q=p.qs[d.i];return`<div style="border-bottom:2px solid #bbb;padding:10px 0"><b>${numOf(p,d.i)}. ${esc(q.t)}</b> <span style="cursor:pointer;font-size:20px" onclick="this.nextElementSibling.hidden=!this.nextElementSibling.hidden">👁</span><div hidden class=mu>Status: ${d.st}${d.a!=null?' • pilihanmu '+'ABCDE'[d.a]:''}${q.a!=null&&qType(p,d.i)!='TKP'?' • kunci '+'ABCDE'[q.a]:''}<br>${esc(q.pem)||'(Belum ada pembahasan)'}</div></div>`}).join('')}</div>`}
/* ---------- OPERATOR ---------- */
function side(){$('#m').innerHTML=`<div class=ov onclick=closeM()></div><div class=side><b style="color:var(--ac)">DAPUR OPERATOR</b>${[['Panel Admin',"location.href='/admin'"],['Keluar Mode Operator',"OP=false;go('home')"]].map(x=>`<div onclick="${x[1]}">${x[0]}</div>`).join('')}</div>`}
const back=()=>`<div style="font-size:24px;cursor:pointer;margin-bottom:8px" onclick="go('home')">←</div>`;
function proj(){const L=S.packages.filter(p=>PTAB=='Projekku'?!p.pub:p.pub);return back()+`<button style="width:100px;height:100px;font-size:48px;background:var(--cd);color:var(--ac);display:block;margin:10px auto" onclick=newPkg()>+</button><div class=tabs>${['Projekku','Paket'].map(t=>`<button style="height:45px" class="${PTAB==t?'on':''}" onclick="PTAB='${t}';render()">${t}</button>`).join('')}</div>`+(L.map(p=>`<div class=row style="align-items:center"><div style="flex:1"><b>${esc(p.name)}</b><div class=mu>${p.type} • ${rp(p.price)} ${p.hidden?'• disembunyikan':''}</div></div><button style="height:35px" onclick="ED=${p.id};SEL=null;go('bank')">✏️</button><button style="height:35px;background:var(--ac);color:#fff" onclick=publish(${p.id})>${p.pub?'Simpan Perubahan':'Publikasikan'}</button>${p.pub?`<span style="width:20px;cursor:pointer" onclick=hide(${p.id})>${p.hidden?'🙈':'👁'}</span>`:''}</div>`).join('')||'<p class=mu>Kosong.</p>')}
function newPkg(){modal(`<b>Paket Baru</b><input id=nn placeholder="Nama paket" style="margin:8px 0"><select id=nt style="margin:8px 0"><option>SKD</option><option>TWK</option><option>TIU</option><option>TKP</option></select><input id=np type=number placeholder="Harga (Rp)" style="margin:8px 0"><button class=pm style="width:100%;height:42px;background:var(--ac);color:#fff" onclick=mk()>Buat Draf</button>`)}
function mk(){const t=$('#nt').value;S.packages.unshift({id:S.seq++,name:$('#nn').value||'Paket Baru',type:t,price:+$('#np').value||0,promo:0,desc:'',pub:0,hidden:0,qs:Array.from({length:NEED[t]},empty)});save();closeM();PTAB='Projekku';render()}
function errBox(l){modal(`<div style="width:100%;height:250px;overflow:auto"><b class=er>⚠ Pemindaian menemukan ${l.length} masalah</b><div style="font-size:13px;line-height:1.7;margin-top:8px">${l.slice(0,40).map(esc).join('<br>')}</div></div>`)}
function validate(p){const e=[];p.qs.forEach((q,i)=>{const n=numOf(p,i),t=qType(p,i);if(!q.t.trim())e.push(`Nomor ${n}: teks soal kosong`);q.o.forEach((o,j)=>{if(!o.trim())e.push(`Nomor ${n}: opsi ${'ABCDE'[j]} kosong`)});if(t!='TKP'&&q.a==null)e.push(`Nomor ${n}: kunci jawaban belum dipilih`);if(t=='TKP'&&q.w.includes(null))e.push(`Nomor ${n}: bobot poin TKP (5-1) belum lengkap`)});return e}
function publish(id){const p=P(id),e=validate(p);if(e.length)return errBox(e);S.packages=[p,...S.packages.filter(x=>x.id!=id)];p.pub=1;save();PTAB='Paket';render();scrollTo(0,0)}
function hide(id){const p=P(id);if(confirm(p.hidden?'Tayangkan paket ini?':'Sembunyikan paket dari siswa?')){p.hidden=!p.hidden;save();render()}}
const PROMPT_AI='Ubah soal berikut ke format teks: pisahkan tiap soal dengan ///, pisahkan pertanyaan dan tiap opsi (A-E) dengan ||, awali opsi kunci jawaban dengan tanda * (untuk TKP urutan opsi = bobot 5,4,3,2,1), dan tulis pembahasan setelah ||| (hilangkan ||| bila tidak ada pembahasan). Pastikan ada spasi di sekitar tanda pembatas. Contoh: Pertanyaan?|| Opsi A|| *Opsi B|| Opsi C|| Opsi D|| Opsi E ||| Pembahasan ///';
function bank(){const p=P(ED),q=SEL!=null?p.qs[SEL]:null,t=SEL!=null?qType(p,SEL):'';const cam=(f)=>`<span style="width:20px;cursor:pointer;font-size:20px" onclick="cam('${f}')">📷</span>`;
 return`<div style="font-size:24px;cursor:pointer" onclick="go('proj')">←</div><b>${esc(p.name)}</b> <span class=mu>${p.type}</span>
<div style="display:flex;gap:8px;align-items:center;margin:10px 0"><span style="font-size:30px;cursor:pointer;color:var(--yl)" onclick="STAR=!STAR;render()">★</span><textarea rows=1 placeholder="Deskripsi paket (kosong = 'Kosong')" oninput="P(ED).desc=this.value;save()">${esc(p.desc)}</textarea><button style="height:42px;flex:none;background:var(--ac);color:#fff" onclick="navigator.clipboard&&navigator.clipboard.writeText(PROMPT_AI);this.textContent='Tersalin ✔'">Prompt Format AI</button></div>
${STAR?`<div style="display:flex;gap:8px"><input type=number placeholder="Harga normal (dicoret)" value="${p.promo?p.price:''}" oninput="P(ED).price=+this.value;save()"><input type=number placeholder="Harga promo" value="${p.promo||''}" oninput="P(ED).promo=+this.value;save()"></div><p class=mu style="font-size:12px">Isi harga normal & harga promo; kosongkan promo untuk harga tunggal.</p>`:''}
<button style="height:36px;background:var(--cd);color:var(--tx)" onclick="file(d=>{P(ED).thumb=d;save();alert('Thumbnail diperbarui')})">Unggah Thumbnail</button>
<b style="display:block;margin-top:12px">Fitur Cepat: Tempel Massal</b><textarea id=bulk style="height:150px" placeholder="Soal ?|| A|| *B|| C|| D|| E ||| pembahasan /// soal berikut…"></textarea><button style="width:100%;height:40px;margin:6px 0;background:var(--yl);font-weight:700" onclick=bulk()>Proses Tempel Massal</button>
<div style="display:flex;flex-wrap:wrap;gap:6px;margin:12px 0">${p.qs.map((x,i)=>`<div class="sq ${x.t&&validate1(p,i)?'f':''} ${SEL==i?'s':''}" onclick="SEL=${i};render()">${numOf(p,i)}</div>`).join('')}</div>
${q?`<div style="background:var(--cd);padding:12px;border-radius:10px"><b>Soal ${numOf(p,SEL)} • ${t}</b><div style="display:flex;gap:6px;margin:8px 0"><textarea rows=3 data-f=q oninput="P(ED).qs[SEL].t=this.value;save()" onfocus="F='q'">${esc(q.t)}</textarea>${cam('q')}</div>${q.img?`<img src="${q.img}" style="max-width:100%">`:''}
${q.o.map((o,j)=>`<div style="display:flex;gap:6px;align-items:center;margin:6px 0"><b>${'ABCDE'[j]}</b><input value="${esc(o)}" onfocus="F='o${j}'" oninput="P(ED).qs[SEL].o[${j}]=this.value;save()">${cam('o'+j)}${t=='TKP'?`<span class=cr style="width:26px;height:26px;background:${q.w[j]!=null?['','#d22','#f0802a','#e0b800','#5cc15c','#0b7a2f'][q.w[j]]:'transparent'};color:${q.w[j]!=null?'#fff':'var(--mu)'}" onclick="tkp(${j})">${q.w[j]??'·'}</span>`:`<span class=cr style="width:22px;height:22px;background:${q.a===j?'var(--ac)':'transparent'}" onclick="P(ED).qs[SEL].a=${j};save();render()">${q.a===j?'✔':''}</span>`}</div>`).join('')}
${t=='TKP'?`<button style="height:30px" onclick="P(ED).qs[SEL].w=[null,null,null,null,null];save();render()">Reset bobot</button> <span class=mu style="font-size:12px">klik opsi berurutan: 5→1</span>`:''}
<b style="display:block;margin-top:10px">Pembahasan</b><textarea rows=3 oninput="P(ED).qs[SEL].pem=this.value;save()">${esc(q.pem)}</textarea></div>`:''}`}
const validate1=(p,i)=>{const q=p.qs[i],t=qType(p,i);return q.o.every(o=>o.trim())&&(t=='TKP'?!q.w.includes(null):q.a!=null)};
function tkp(j){const q=P(ED).qs[SEL];if(q.w[j]!=null)return;const used=q.w.filter(x=>x!=null).length;q.w[j]=5-used;save();render()}
function cam(f){file(d=>{const q=P(ED).qs[SEL];if(f=='q')q.img=d;else{q.oi=q.oi||[];q.oi[+f[1]]=d}save();render()})}
document.addEventListener('paste',e=>{if(V!='bank'||SEL==null)return;const it=[...(e.clipboardData?.items||[])].find(i=>i.type.startsWith('image/'));if(!it)return;const r=new FileReader();r.onload=()=>{const q=P(ED).qs[SEL];if(F=='q')q.img=r.result;else{q.oi=q.oi||[];q.oi[+F[1]]=r.result}save();render()};r.readAsDataURL(it.getAsFile())});
function bulk(){const p=P(ED),n=p.qs.length,e=[],nq=p.qs.map(q=>({...q}));$('#bulk').value.split('///').map(s=>s.trim()).filter(Boolean).forEach((blk,i)=>{if(i>=n)return e.push(`Soal ke-${i+1}: melebihi kapasitas paket (${n} soal)`);const num=numOf(p,i),t=qType(p,i),[m,pem]=blk.split('|||'),pt=m.split('||').map(s=>s.trim());if(pt.length<6)e.push(`Nomor ${num}: butuh 1 pertanyaan + 5 opsi, ditemukan ${pt.length} bagian`);const a=pt.slice(1,6).findIndex(s=>s.startsWith('*'));if(t!='TKP'&&a<0&&pt.length>=6)e.push(`Nomor ${num}: kunci jawaban belum ditandai dengan *`);nq[i]={...nq[i],t:pt[0],o:Array.from({length:5},(_,j)=>(pt[j+1]||'').replace(/^\*/,'')),a:t=='TKP'?null:(a<0?null:a),w:t=='TKP'?[5,4,3,2,1]:[null,null,null,null,null],pem:pem?pem.trim():''}});
 if(e.length)return errBox(e);p.qs=nq;save();alert('Tempel massal berhasil diproses.');render()}
function payv(){return back()+`<h3>Edit Pembayaran</h3>${['QRIS','BCA','BRI','MANDIRI'].map(b=>`<div style="display:flex;align-items:center;gap:12px;margin:12px 0"><div style="width:120px;height:60px;border:1px solid var(--bd);display:grid;place-items:center;overflow:hidden">${S.pay[b]?`<img src="${S.pay[b]}" style="width:120px;height:60px;object-fit:contain">`:b}</div><button style="height:40px;background:var(--ac);color:#fff" onclick="file(d=>{S.pay['${b}']=d;save();render()})">Unggah Gambar Logo</button></div>`).join('')}<p class=mu style="font-size:12px">Dana transaksi dikumpulkan ke satu rekening BNI operator (diatur di backend).</p>`}
function promo(){return back()+`<button style="width:150px;height:45px;background:var(--ac);color:#fff" onclick=newPromo()>+ Promo</button>`+(S.promos.map((x,i)=>`<div class=row style="align-items:center"><div style="flex:1"><b>${esc(x.name)}</b> <code>${x.code}</code><div class=mu>${esc(x.bank)}</div></div><input type=checkbox class=sw style="width:24px" ${x.on?'checked':''} onchange="S.promos[${i}].on=this.checked;save()"></div>`).join('')||'<p class=mu>Belum ada promo.</p>')}
function newPromo(){modal(`<b>Promo Kreator</b><input id=pn placeholder="Nama Kreator" style="margin:8px 0"><input id=pc placeholder="Kode 6 digit" maxlength=6 style="margin:8px 0"><input id=pb placeholder="Bank & Rekening Kreator" style="margin:8px 0"><button class=pm style="width:100%;height:42px;background:var(--ac);color:#fff" onclick=addPromo()>Simpan</button>`)}
function addPromo(){const c=$('#pc').value.trim();if(!/^\d{6}$/.test(c)||!$('#pn').value)return alert('Nama wajib & kode harus 6 digit angka');S.promos.unshift({name:$('#pn').value,code:c,bank:$('#pb').value,on:1});save();closeM();render()}
function notif(){return back()+'<div id="view-notif"></div>'}
/* ---------- RENDER ---------- */
function render(){if(!S.me&&V!='auth')V='auth';const main={auth,home,paket,profil,edit,buy,qris,va,exam,result,proj,pay:payv,promo,notif,bank}[V]();const showNav=['home','paket','profil'].includes(V);$('#app').innerHTML=main+(showNav?navbar():'');if(V=='home'&&OP)document.title='Operator'}
/* ===== REVISI ===== */
const DB='📢 Selamat datang! Try Out SKD terbaru sudah tersedia.',TODAY=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
S.packages.forEach(p=>{if(p.pub&&!p.rel)p.rel=TODAY});
let PX=.5,PY=.5,IM=null;
function logoClick(){if(OP)return file(d=>{S.logo=d;save();render()});const n=Date.now();CL=CL.filter(t=>n-t<9000);CL.push(n);if(CL.length>=12){CL=[];OP=true;go('home')}}
const lst2=ps=>ps.map(p=>`<div class=row style="border:1px solid var(--bd);border-radius:12px;padding:12px;margin:16px 0"><div class=th style="background-image:url(${p.thumb||''})"></div><div class=dt><b style="font-size:16px">${esc(p.name)}</b><div class=mu style="margin:4px 0">${p.rel?'Rilis: '+p.rel:''}</div><div>${price(p)}</div><div class=b><button style="background:#012AAB;color:#fff" onclick=desc(${p.id})>Deskripsi</button><button style="background:var(--yl)" onclick="CUR=${p.id};PROMO=null;go('buy')">Beli</button></div></div></div>`).join('')||'<p class=mu>Belum ada paket.</p>';
function list(){$('#ls').innerHTML=lst2(S.packages.filter(p=>p.pub&&!p.hidden&&p.name.toLowerCase().includes(Q.toLowerCase())).slice(0,7))}
function home(){const ps=S.packages.filter(p=>p.pub&&!p.hidden&&p.name.toLowerCase().includes(Q.toLowerCase())).slice(0,7),bt=S.banner==DB?'':S.banner;
return`<div class=hd><div><div style="font-size:30px;font-weight:800">Halo,</div><div style="font-size:20px;margin-top:6px">${esc(S.me.n)}</div><div style="font-size:14px;color:var(--ac);cursor:pointer;margin-top:6px" onclick="go('edit')">Edit Foto</div></div><div class=lg><div id=logo onclick=logoClick()>${S.logo?`<img src="${S.logo}">`:''}</div>${OP?`<div class=ham onclick=side()>☰</div>`:''}</div></div>${OP?'<div class=mu style="font-size:12px;text-align:center;margin-top:14px">MODE OPERATOR: ketuk banner atau area logo (kanan atas) untuk mengubah</div>':''}
<div class=ban style="min-height:190px;display:grid;place-items:center;text-align:center;margin:28px 0;font-size:18px;${OP?'cursor:pointer':''}" ${OP?'onclick=banner()':''}>${esc(bt)}${OP&&!bt?'<span style="opacity:.7;font-size:13px">Ketuk untuk mengisi banner</span>':''}</div>
<button class=big style="border-radius:12px" onclick="TAB='SKD';go('paket')">TRY OUT SKD 110 SOAL</button>
<div class=g3 style="margin:18px 0 36px">${['TWK','TIU','TKP'].map(t=>`<button style="background:var(--bg);color:var(--ac);border:2px solid var(--ac);height:50px;border-radius:12px" onclick="TAB='${t}';go('paket')">TO ${t}</button>`).join('')}</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><b style="font-size:20px">Terbaru</b><input style="width:250px" placeholder="Cari judul paket..." value="${esc(Q)}" oninput="Q=this.value;list()"></div><div id=ls>${lst2(ps)}</div><div style="margin:18px 0"><button style="height:46px;width:100%;background:var(--cd);color:var(--ac);font-weight:700" onclick="go('semua')">Lihat Lainnya</button></div>`}
function semua(){return`<div style="font-size:24px;cursor:pointer;margin-bottom:8px" onclick="go('home')">←</div><b style="font-size:20px">Semua Paket</b>`+lst2(S.packages.filter(p=>p.pub&&!p.hidden))}
function desc(id){const p=P(id);sheet(`<div style="display:flex;gap:10px"><div class=th style="background-image:url(${p.thumb||''})"></div><b>${esc(p.name)}</b></div><div style="font-size:28px;font-weight:700;color:${p.desc?'var(--tx)':'#999'};margin:14px 0;min-height:80px">${esc(p.desc)||'Kosong'}</div>`)}
function navbar(){return`<div class=nav>${[['home','Beranda'],['paket','Daftar Paket'],['profil','Profil']].map(x=>`<div class="${V==x[0]||(x[0]=='home'&&V=='semua')?'on':''}" onclick="go('${x[0]}')">${x[1]}</div>`).join('')}</div>`}
function profil(){const u=S.me,j=u.j?new Date(u.j).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'-';return`<div style="background:var(--ac);color:#fff;border-radius:24px;padding:22px;margin-top:10px"><div style="display:flex;gap:16px"><div style="width:110px;height:165px;border-radius:12px;background:var(--nv) center/cover;flex:none;background-image:url(${u.pic||''})"></div><div style="font-size:13px;line-height:1.5">*Kamu dapat mengedit foto di halaman utama (Beranda). Foto yang diunggah akan muncul di tampilan hasil ujian Try Out.</div></div><div style="font-size:24px;font-weight:700;margin:24px 0 6px">${esc(u.n)}</div><div style="font-size:14px;opacity:.9">${esc(u.e)}</div><div style="font-size:14px;margin-top:24px;opacity:.9">Bergabung: ${j}</div></div><div style="text-align:center;margin-top:44px"><button style="height:44px;width:200px;background:none;border:2px solid var(--tx);color:var(--tx);font-size:16px" onclick=konfKeluar()>Keluar</button></div>`}
function konfKeluar(){modal(`<b style="font-size:18px">Yakin ingin keluar?</b><p style="line-height:1.6">Kamu akan kembali ke halaman masuk. Tenang, semua datamu tetap aman: akun, paket yang sudah dibeli, riwayat nilai, dan pas foto akan muncul lagi saat kamu masuk kembali.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=keluar()>Ya, Keluar</button></div>`)}
function keluar(){const u=S.users.find(x=>x.e==S.me.e);if(u)Object.assign(u,S.me);S.me=null;OP=false;S.exam=null;save();AM='login';go('auth')}
function drawC(c,w=240,h=360){c=c||$('#cv');if(!c)return;const x=c.getContext('2d');x.clearRect(0,0,w,h);if(!IM||!IM.width)return;const a=IM.width/IM.height;let cw=a>2/3?IM.height*2/3:IM.width;cw/=ZM;const ch=cw*1.5;x.drawImage(IM,(IM.width-cw)*PX,(IM.height-ch)*PY,cw,ch,0,0,w,h)}
function loadIm(){const s=IMG||S.me.pic;if(!s){IM=null;return drawC()}const i=new Image();i.onload=()=>{IM=i;drawC()};i.src=s}
function edit(){setTimeout(loadIm,0);return`<div style="font-size:24px;cursor:pointer" onclick="IMG=null;IM=null;go('home')">←</div><h3>Edit Foto</h3><p class=mu style="font-size:13px">Pas foto 4x6 (vertikal). Foto ini muncul di halaman hasil ujian.</p><canvas id=cv width=240 height=360 style="display:block;margin:auto;background:var(--cd);border-radius:6px"></canvas><div style="width:240px;margin:16px auto"><div class=mu style="font-size:12px">Zoom</div><input type=range min=1 max=3 step=.05 value=${ZM} oninput="ZM=+this.value;drawC()"><div class=mu style="font-size:12px;margin-top:8px">Geser kiri-kanan</div><input type=range min=0 max=1 step=.01 value=${PX} oninput="PX=+this.value;drawC()"><div class=mu style="font-size:12px;margin-top:8px">Geser atas-bawah</div><input type=range min=0 max=1 step=.01 value=${PY} oninput="PY=+this.value;drawC()"><button style="width:100%;height:42px;margin-top:14px;background:var(--cd);color:var(--tx)" onclick="file(d=>{IMG=d;ZM=1;PX=PY=.5;loadIm()})">Pilih Foto</button><button style="width:100%;height:42px;margin-top:10px;background:var(--ac);color:#fff;font-weight:700" onclick=saveProf()>Simpan</button></div>`}
function saveProf(){if(!IM)return go('home');const t=document.createElement('canvas');t.width=400;t.height=600;drawC(t,400,600);S.me.pic=t.toDataURL('image/jpeg',.85);const u=S.users.find(x=>x.e==S.me.e);if(u)u.pic=S.me.pic;IMG=null;IM=null;ZM=1;PX=PY=.5;save();go('home')}
const _pb=publish;publish=function(id){const w=!P(id).pub;_pb(id);const p=P(id);if(w&&p.pub&&!p.rel){p.rel=TODAY;save();render()}};
const _rg=reg;reg=function(){const c=S.users.length;_rg();if(S.users.length>c){S.users[S.users.length-1].j=new Date().toISOString();save()}};
const _pk=paket;paket=function(){return _pk().replace(/📘/g,'')};
const _rs=result;result=function(){return _rs().replace('👤','')};
function render(){if(!S.me&&V!='auth')V='auth';const m={auth,home,paket,profil,edit,buy,qris,va,exam,result,proj,pay:payv,promo,notif,bank,semua}[V]();$('#app').innerHTML=m+(['home','paket','profil','semua'].includes(V)?navbar():'')}
/* ===== REVISI 2 ===== */
if(!S.seed4){const nm={SKD:'Try Out SKD Lengkap 110 Soal',TWK:'Latihan TWK Dasar',TIU:'Latihan TIU Intensif',TKP:'Latihan TKP Intensif'};['SKD','TWK','TIU','TKP'].forEach(t=>{if(!S.packages.some(p=>p.type==t))S.packages.push({id:S.seq++,name:nm[t],type:t,price:t=='SKD'?25000:10000,promo:0,desc:'',pub:1,hidden:0,rel:TODAY,qs:gen(t)})});S.seed4=1;save()}
let Q2='';
function crop(ratio,outW,fmt,title,cb){file(src=>{const im=new Image();im.onload=()=>{const vw=Math.min(300,Math.round(330*ratio)),vh=Math.round(vw/ratio);let z=1,cx=.5,cy=.5,dn=null;
const dr=(c,w,h,g)=>{const x=c.getContext('2d');x.clearRect(0,0,w,h);if(g||fmt!='png'){x.fillStyle=g?'#e5e7eb':'#fff';x.fillRect(0,0,w,h)}const b=Math.max(w/im.width,h/im.height)*z,dw=im.width*b,dh=im.height*b;x.drawImage(im,(w-dw)*cx,(h-dh)*cy,dw,dh);if(g){x.strokeStyle='#fffc';x.lineWidth=1;x.beginPath();for(let i=1;i<3;i++){x.moveTo(w*i/3,0);x.lineTo(w*i/3,h);x.moveTo(0,h*i/3);x.lineTo(w,h*i/3)}x.stroke();x.lineWidth=3;x.strokeRect(1,1,w-2,h-2)}};
modal(`<b>${title}</b><p class=mu style="font-size:12px;margin:4px 0">Geser gambar dan atur zoom agar pas di dalam garis, lalu potong.</p><canvas id=cc width=${vw} height=${vh} style="display:block;margin:10px auto;touch-action:none;border-radius:6px"></canvas><div class=mu style="font-size:12px">Zoom</div><input type=range id=cz min=${fmt=='png'?0.3:1} max=4 step=.02 value=1><div style="display:flex;gap:10px;margin-top:12px"><button id=cb1 style="flex:1;height:42px;background:var(--cd);color:var(--tx)">Batal</button><button id=cb2 style="flex:1;height:42px;background:var(--ac);color:#fff;font-weight:700">Potong dan Simpan</button></div>`);
const c=$('#cc'),rd=()=>dr(c,vw,vh,1);rd();$('#cz').oninput=e=>{z=+e.target.value;rd()};
c.onpointerdown=e=>{dn=[e.clientX,e.clientY];c.setPointerCapture(e.pointerId)};c.onpointerup=()=>dn=null;
c.onpointermove=e=>{if(!dn)return;const b=Math.max(vw/im.width,vh/im.height)*z,dw=im.width*b,dh=im.height*b;if(dw>vw)cx=Math.min(1,Math.max(0,((vw-dw)*cx+e.clientX-dn[0])/(vw-dw)));if(dh>vh)cy=Math.min(1,Math.max(0,((vh-dh)*cy+e.clientY-dn[1])/(vh-dh)));dn=[e.clientX,e.clientY];rd()};
$('#cb1').onclick=closeM;$('#cb2').onclick=()=>{const o=document.createElement('canvas');o.width=outW;o.height=Math.round(outW/ratio);dr(o,o.width,o.height,0);closeM();cb(o.toDataURL('image/'+fmt,.88))}};im.src=src})}
function logoClick(){if(OP)return crop(3.3,660,'png','Potong Logo (area 3,3:1)',d=>{S.logo=d;save();render()});const n=Date.now();CL=CL.filter(t=>n-t<9000);CL.push(n);if(CL.length>=12){CL=[];OP=true;go('home')}}
function editFoto(){crop(2/3,400,'jpeg','Potong Pas Foto 4x6',d=>{S.me.pic=d;const u=S.users.find(x=>x.e==S.me.e);if(u)u.pic=d;save();render()})}
function banner(){modal(`<b>Edit Banner</b><button style="width:100%;height:44px;margin-top:12px;background:var(--ac);color:#fff" onclick=bnImg()>Unggah Gambar Banner</button><button style="width:100%;height:44px;margin-top:8px;background:var(--cd);color:var(--tx)" onclick=bnTxt()>Isi Teks Banner</button><button style="width:100%;height:44px;margin-top:8px;background:none;color:#d22" onclick=bnDel()>Kosongkan Banner</button>`)}
function bnImg(){closeM();crop(113/30,904,'jpeg','Potong Banner',d=>{S.bannerImg=d;save();render()})}
function bnTxt(){closeM();const t=prompt('Teks banner:',S.banner==DB?'':S.banner);if(t!=null){S.banner=t;save();render()}}
function bnDel(){S.bannerImg='';S.banner='';save();closeM();render()}
const lst3=ps=>ps.map(p=>`<div class=row style="border:1px solid var(--bd);border-radius:12px;padding:12px;margin:16px 0"><div class=th style="background-image:url(${p.thumb||''})"></div><div class=dt><b style="font-size:16px">${esc(p.name)}</b><div class=mu style="margin:4px 0">${p.rel?'Rilis: '+p.rel:''}</div><div>${price(p)}</div><div class=b><button style="background:#012AAB;color:#fff" onclick=desc(${p.id})>Deskripsi</button>${S.owned[p.id]?'<button disabled style="background:var(--cd);color:var(--mu)">Dimiliki</button>':`<button style="background:var(--yl)" onclick="CUR=${p.id};PROMO=null;go('buy')">Beli</button>`}</div></div></div>`).join('')||'<p class=mu>Belum ada paket.</p>';
const vis=()=>S.packages.filter(p=>p.pub&&!p.hidden&&!S.owned[p.id]),hit=(a,q)=>a.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
function list(){const ps=Q?hit(vis(),Q):vis().slice(0,PN());$('#ls').innerHTML=lst3(ps);const l=$('#lm');if(l)l.style.display=Q?'none':'block'}
function home(){const ps=Q?hit(vis(),Q):vis().slice(0,PN()),bt=S.banner==DB?'':S.banner;
return`<div class=hd><div><div style="font-size:15px;color:var(--ac);font-weight:600;letter-spacing:.5px">Halo,</div><div style="font-size:26px;font-weight:800;line-height:1.15;background:linear-gradient(90deg,var(--ac),#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent;max-width:230px;word-break:break-word">${esc(S.me.n)}</div><div style="width:40px;height:4px;border-radius:4px;background:var(--yl);margin:8px 0 12px"></div><button style="height:32px;padding:0 18px;border-radius:16px;background:#7c3aed;color:#fff;font-weight:600;font-size:13px" onclick=editFoto()>Edit Foto</button></div><div class=lg><div id=logo onclick=logoClick()>${S.logo?`<img src="${S.logo}">`:''}</div>${OP?`<div class=ham onclick=side()>☰</div>`:''}</div></div>${OP?'<div class=mu style="font-size:12px;text-align:center;margin-top:14px">MODE OPERATOR: ketuk banner atau area logo (kanan atas) untuk mengubah</div>':''}
<div class=ban style="height:120px;min-height:0;padding:10px;margin:26px 0;display:grid;place-items:center;text-align:center;font-size:16px;${S.bannerImg?`background:url(${S.bannerImg}) center/cover;`:''}${OP?'cursor:pointer':''}" ${OP?'onclick=banner()':''}>${esc(bt)}${OP&&!bt&&!S.bannerImg?'<span style="opacity:.7;font-size:13px">Ketuk untuk mengisi banner</span>':''}</div>
<button class=big style="border-radius:12px" onclick="TAB='SKD';go('kat')">TRY OUT SKD 110 SOAL</button>
<div class=g3 style="margin:18px 0 36px">${['TWK','TIU','TKP'].map(t=>`<button style="background:var(--bg);color:var(--ac);border:2px solid var(--ac);height:50px;border-radius:12px" onclick="TAB='${t}';go('kat')">TO ${t}</button>`).join('')}</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><b style="font-size:20px">Terbaru</b><input style="width:250px" placeholder="Cari judul paket..." value="${esc(Q)}" oninput="Q=this.value;list()"></div><div id=ls>${lst3(ps)}</div><div id=lm style="margin:18px 0;display:${Q?'none':'block'}"><button style="height:46px;width:100%;background:var(--cd);color:var(--ac);font-weight:700" onclick="Q2='';go('semua')">Lihat Lainnya</button></div>`}
function semua(){return`<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="font-size:24px;cursor:pointer" onclick="go('home')">←</span><input placeholder="Cari semua paket..." value="${esc(Q2)}" oninput="Q2=this.value;$('#sl').innerHTML=lst3(hit(vis(),Q2))"></div><div id=sl>${lst3(hit(vis(),Q2))}</div>`}
function kat(){const nm={SKD:'Try Out SKD 110 Soal',TWK:'Try Out TWK',TIU:'Try Out TIU',TKP:'Try Out TKP'}[TAB],rg={SKD:'Simulasi penuh nomor 1-110 (TWK 1-30, TIU 31-65, TKP 66-110)',TWK:'30 soal, nomor 1-30',TIU:'35 soal, nomor 31-65',TKP:'45 soal, nomor 66-110'}[TAB];return`<div style="display:flex;align-items:center;gap:12px"><span style="font-size:24px;cursor:pointer" onclick="go('home')">←</span><b style="font-size:20px">${nm}</b></div><p class=mu style="font-size:13px;margin:8px 0 0">${rg}</p>`+lst3(vis().filter(p=>p.type==TAB))}
function navbar(){return`<div class=nav>${[['home','Beranda'],['paket','Daftar Paket'],['profil','Profil']].map(x=>`<div class="${V==x[0]||(x[0]=='home'&&(V=='semua'||V=='kat'))?'on':''}" onclick="go('${x[0]}')">${x[1]}</div>`).join('')}</div>`}
function profil(){const u=S.me,j=u.j?new Date(u.j).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'-',rs=Object.values(S.res),own=Object.keys(S.owned).length,best=rs.length?Math.max(...rs.map(r=>r.tot)):'-';
return`<div style="position:relative;overflow:hidden;background:linear-gradient(135deg,var(--nv),var(--ac) 70%,#7c3aed);color:#fff;border-radius:24px;padding:22px;margin-top:10px;box-shadow:0 10px 28px #346ef355"><div style="position:absolute;right:-40px;top:-40px;width:140px;height:140px;border-radius:50%;background:#ffffff1f"></div><div style="position:absolute;left:-30px;bottom:-50px;width:120px;height:120px;border-radius:50%;background:#ffc6192e"></div><div style="position:relative;display:flex;gap:16px;align-items:flex-end"><div style="width:110px;height:165px;border-radius:14px;border:3px solid #fff;background:#012AAB center/cover;flex:none;background-image:url(${u.pic||''})"></div><div><div style="display:inline-block;background:var(--yl);color:#111;font-weight:700;font-size:11px;padding:4px 10px;border-radius:12px">PAS FOTO UJIAN</div><div style="font-size:14px;line-height:1.55;margin-top:10px">Wajahmu tampil di kartu hasil Try Out, seperti ujian sungguhan. Ganti kapan saja lewat tombol <b>Edit Foto</b> di Beranda.</div></div></div><div style="position:relative;font-size:24px;font-weight:800;margin:26px 0 4px">${esc(u.n)}</div><div style="position:relative;opacity:.92;font-size:14px">${esc(u.e)}</div><div style="position:relative;opacity:.8;font-size:13px;margin-top:14px">Bergabung sejak ${j}</div></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px">${[['Paket dimiliki',own],['Try Out selesai',rs.length],['Nilai tertinggi',best]].map(x=>`<div style="background:var(--cd);border-radius:14px;padding:14px 8px;text-align:center"><div style="font-size:22px;font-weight:800;color:var(--ac)">${x[1]}</div><div class=mu style="font-size:11px;margin-top:2px">${x[0]}</div></div>`).join('')}</div><div style="text-align:center;margin-top:36px"><button style="height:44px;width:200px;background:none;border:2px solid var(--tx);color:var(--tx);font-size:16px;border-radius:22px" onclick=konfKeluar()>Keluar</button></div>`}
const _pv=payv;payv=function(){return _pv().replace(/file\(d=>\{S\.pay\['(\w+)'\]=d;save\(\);render\(\)\}\)/g,(m,b)=>`crop(2,240,'png','Potong Logo ${b} (120x60)',d=>{S.pay['${b}']=d;save();render()})`)};
const _bk=bank;bank=function(){return _bk().replace("file(d=>{P(ED).thumb=d;save();alert('Thumbnail diperbarui')})","crop(1.5,360,'jpeg','Potong Thumbnail (120x80)',d=>{P(ED).thumb=d;save();alert('Thumbnail diperbarui')})")};
function render(){if(!S.me&&V!='auth')V='auth';const m={auth,home,paket,profil,edit,buy,qris,va,exam,result,proj,pay:payv,promo,notif,bank,semua,kat}[V]();$('#app').innerHTML=m+(['home','paket','profil','semua','kat'].includes(V)?navbar():'')}
/* ===== REVISI 3 ===== */
const PEN='<svg width=18 height=18 viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>';
const greet=()=>{const h=new Date().getHours();return h<11?'Selamat pagi,':h<15?'Selamat siang,':h<18?'Selamat sore,':'Selamat malam,'};
function nameEdit(){const now=Date.now(),W=15*864e5,ne=(S.me.ne||[]).filter(t=>now-t<W),left=2-ne.length;
if(left<=0){const nx=new Date(Math.min(...ne)+W).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});return modal(`<b style="font-size:18px">Nama belum bisa diganti</b><p style="line-height:1.6">Nama hanya bisa diubah 2 kali dalam 15 hari, dan jatahmu sudah terpakai. Kamu bisa mengubahnya lagi mulai ${nx}.</p><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=closeM()>Mengerti</button>`)}
modal(`<b style="font-size:18px">Ubah Nama Lengkap</b><p class=mu style="font-size:13px;line-height:1.6">Nama hanya bisa diubah 2 kali dalam 15 hari. Sisa jatahmu: <b>${left} kali</b>. Pastikan penulisannya benar karena nama ini akan tampil di hasil ujianmu.</p><input id=nn2 maxlength=40 value="${esc(S.me.n)}" style="margin-bottom:14px"><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=saveName()>Simpan Nama</button>`)}
function saveName(){const v=$('#nn2').value.trim();if(!v)return;if(v==S.me.n)return closeM();const now=Date.now();S.me.ne=(S.me.ne||[]).filter(t=>now-t<15*864e5);if(S.me.ne.length>=2)return nameEdit();S.me.ne.push(now);S.me.n=v;const u=S.users.find(x=>x.e==S.me.e);if(u){u.n=v;u.ne=S.me.ne}save();closeM();render()}
function home(){const ps=Q?hit(vis(),Q):vis().slice(0,PN()),bt=S.banner==DB?'':S.banner;
return`<div style="position:relative;display:flex;justify-content:center;padding-top:6px"><div id=logo onclick=logoClick() style="width:112px;height:34px">${S.logo?`<img src="${S.logo}">`:''}</div>${OP?`<div class=ham onclick=side() style="position:absolute;right:0;top:0">☰</div>`:''}</div>
<div style="margin-top:22px"><div style="font-size:34px;font-weight:800;line-height:1.1;letter-spacing:-.5px;background:linear-gradient(90deg,var(--ac),#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent">${greet()}</div><div style="display:flex;align-items:center;gap:10px;margin-top:10px"><div style="font-size:28px;font-weight:700;line-height:1.2;word-break:break-word">${esc(S.me.n)}</div><span style="cursor:pointer;color:var(--ac);flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--cd)" onclick=nameEdit()>${PEN}</span></div><div style="width:48px;height:4px;border-radius:4px;background:var(--yl);margin:16px 0 20px"></div><button style="height:36px;padding:0 22px;border-radius:18px;background:#7c3aed;color:#fff;font-weight:600;font-size:13px" onclick=editFoto()>Edit Foto</button></div>${OP?'<div class=mu style="font-size:12px;text-align:center;margin-top:22px">MODE OPERATOR: ketuk banner atau area logo (tengah atas) untuk mengubah</div>':''}
<div class=ban style="height:120px;min-height:0;padding:10px;margin:40px 0 32px;display:grid;place-items:center;text-align:center;font-size:16px;${S.bannerImg?`background:url(${S.bannerImg}) center/cover;`:''}${OP?'cursor:pointer':''}" ${OP?'onclick=banner()':''}>${esc(bt)}${OP&&!bt&&!S.bannerImg?'<span style="opacity:.7;font-size:13px">Ketuk untuk mengisi banner</span>':''}</div>
<button class=big style="border-radius:12px" onclick="TAB='SKD';go('kat')">TRY OUT SKD 110 SOAL</button>
<div class=g3 style="gap:14px;margin:20px 0 52px">${['TWK','TIU','TKP'].map(t=>`<button style="background:var(--bg);color:var(--ac);border:2px solid var(--ac);height:50px;border-radius:12px" onclick="TAB='${t}';go('kat')">TO ${t}</button>`).join('')}</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px"><b style="font-size:20px">Terbaru</b><input style="width:250px" placeholder="Cari judul paket..." value="${esc(Q)}" oninput="Q=this.value;list()"></div><div id=ls>${lst3(ps)}</div><div id=lm style="margin:24px 0;display:${Q?'none':'block'}"><button style="height:46px;width:100%;background:var(--cd);color:var(--ac);font-weight:700" onclick="Q2='';go('semua')">Lihat Lainnya</button></div>`}
/* ===== REVISI 4 ===== */
const tm=()=>{if(!E)return'00:00';const t=Date.now(),s=E.end?Math.max(0,Math.round((E.end-t)/1000)):Math.round((t-E.st)/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const nextT=()=>{const n=P(E.id).qs.length;for(let k=1;k<n;k++){const j=(E.i+k)%n;if(E.ans[j]==null)return j}return -1};
function tick(){clearInterval(TI);const u=()=>{if(!E)return;const e=$('#tm');if(e)e.textContent=tm();const b=$('#bk');if(b&&Date.now()-E.st>=60000){b.disabled=true;b.classList.add('dis')}if(E.end&&E.end-Date.now()<=0)finish()};u();TI=setInterval(u,500)}
function mulai(id){const p=P(id),old=S.res[id];if(p.type=='SKD')return sheet(`<b style="font-size:18px">Try Out SKD 110 Soal</b><p class=mu style="line-height:1.6;font-size:13px">Simulasi lengkap 110 soal (TWK 1-30, TIU 31-65, TKP 66-110) dengan waktu standar 110 menit, hitung mundur. Waktu pada SKD tidak bisa diatur.${old?' Hasil lama tetap tersimpan di riwayat.':''}</p><button style="width:100%;height:46px;background:var(--ac);color:#fff;font-weight:700" onclick="start(${id},110)">Mulai Sekarang</button>`);
sheet(`<b style="font-size:18px">Pengaturan Waktu ${p.type}</b>${old?'<p class=mu style="font-size:12px">Hasil lama tetap tersimpan di riwayat.</p>':''}${[30,40,50,0].map(t=>`<button style="width:100%;height:46px;margin-top:8px;background:var(--cd);color:var(--tx)" onclick=start(${id},${t})>${t?t+' menit':'Belajar tanpa waktu'}</button>`).join('')}`)}
function start(id,t){closeM();if(P(id).type=='SKD')t=110;E={id,i:0,ans:{},sel:null,st:Date.now(),end:t?Date.now()+t*60000:0};S.exam=E;save();NAVOPEN=false;go('exam');tick()}
function pick(j){E.sel=j;render()}
function saveAns(){if(E.sel==null||E.sel===E.ans[E.i])return;E.ans[E.i]=E.sel;E.sel=null;if(E.i<P(E.id).qs.length-1)E.i++;S.exam=E;save();render();scrollTo(0,0)}
function skip(){const t=nextT();if(t<0||(E.sel!=null&&E.sel!==E.ans[E.i]))return;E.i=t;E.sel=null;S.exam=E;save();render();scrollTo(0,0)}
function prev(){if(E.i>0){E.i--;E.sel=null;S.exam=E;save();render();scrollTo(0,0)}}
function akhiri(){const n=P(E.id).qs.length,a=Object.keys(E.ans).length;modal(`<b style="font-size:18px">Akhiri ujian sekarang?</b><p style="line-height:1.6">Terjawab <b>${a}</b> dari ${n} soal. ${n-a?`Masih ada <b>${n-a}</b> soal yang belum dijawab.`:'Semua soal sudah terjawab.'} Nilai dihitung dari jawaban yang sudah kamu simpan. Setelah diakhiri, ujian tidak bisa dilanjutkan.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Lanjut Mengerjakan</button><button style="flex:1;height:44px;background:#e11d48;color:#fff;font-weight:700" onclick=finish()>Akhiri Ujian</button></div>`)}
function cancelEx(){if(Date.now()-E.st>=60000)return;modal(`<b style="font-size:18px">Batalkan ujian?</b><p style="line-height:1.6">Kamu akan kembali ke Beranda dan ujian ini tidak dinilai. Tombol kembali hanya aktif selama 1 menit pertama; setelah itu ujian hanya bisa diselesaikan lewat tombol AKHIRI.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Lanjut</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=doCancel()>Ya, Batalkan</button></div>`)}
function doCancel(){E=null;S.exam=null;save();closeM();go('home')}
function navPanel(p){const o=OFF[p.type],len=p.qs.length,lg=(c,t)=>`<span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c}"></i> ${t}</span>`;
return`<div class=ov style="z-index:45" onclick="NAVOPEN=false;render()"></div><div style="position:fixed;z-index:50;top:0;bottom:0;right:max(0px,calc(50% - 240px));width:min(86%,410px);background:var(--bg);padding:18px;overflow:auto;animation:inR .3s ease-out;box-shadow:-6px 0 24px #0006"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:18px">Daftar Nomor</b><button style="background:var(--cd);color:var(--tx);height:34px" onclick="NAVOPEN=false;render()">Tutup</button></div><div class=mu style="font-size:11px;margin:12px 0 16px;display:flex;flex-wrap:wrap;gap:10px">${lg('#d22','Belum')}${lg('#1a9a3a','Terjawab')}${lg('#ffc619','Sedang dikerjakan')}${p.type!='SKD'?lg('#d5d8de','Nonaktif'):''}</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">${Array.from({length:110},(_,k)=>{const n=k+1,i=n-1-o,on=i>=0&&i<len,c=!on?'#d5d8de':i==E.i?'#ffc619':E.ans[i]!=null?'#1a9a3a':'#d22',t=!on?'#888':'#fff';return`<div class=dc style="background:${c};color:${t};animation-delay:${(k%15)*25}ms;${on?'cursor:pointer':''}" ${on?`onclick="E.i=${i};E.sel=null;NAVOPEN=false;S.exam=E;save();render()"`:''}>${n}</div>`}).join('')}</div></div>`}
function exam(){const p=P(E.id),q=p.qs[E.i],tp=qType(p,E.i),cur=E.sel??E.ans[E.i],sv=E.ans[E.i],pend=E.sel!=null&&E.sel!==sv,tg=nextT(),early=Date.now()-E.st<60000,LB={TWK:'Tes Wawasan Kebangsaan (TWK)',TIU:'Tes Intelegensia Umum (TIU)',TKP:'Tes Karakteristik Pribadi (TKP)'};
return`<div style="margin:-14px -14px 0;padding:12px 16px;background:#012AAB;display:flex;align-items:center;justify-content:space-between"><button id=bk class="${early?'':'dis'}" ${early?'':'disabled'} style="background:none;color:#fff;font-size:30px;width:44px;height:40px;padding:0" onclick=cancelEx()>←</button><b id=tm style="color:var(--yl);font-size:24px;letter-spacing:1px">${tm()}</b><button style="background:#fff;color:#e11d48;font-weight:700;height:36px;padding:0 16px" onclick=akhiri()>AKHIRI</button></div>
<div style="display:flex;gap:12px;margin:24px 0 20px"><div style="flex:1;min-width:0;border:2px solid #012AAB;border-radius:12px;padding:0 14px;height:50px;display:flex;align-items:center;font-weight:700;color:#012AAB;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${esc(p.name.toUpperCase())}</div><button style="background:#012AAB;color:#fff;font-weight:700;height:50px;border-radius:12px;padding:0 16px" onclick="NAVOPEN=true;render()">DAFTAR NOMOR</button></div>
<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:16px"><b style="font-size:17px">SOAL NOMOR: ${numOf(p,E.i)}</b><span style="color:var(--ac);font-weight:700;font-size:13px;text-align:right">${LB[tp]}</span></div>
<div style="border:2px solid #012AAB;border-radius:20px;padding:20px;font-size:16px;line-height:1.7;margin-bottom:22px">${esc(q.t)}${q.img?`<img src="${q.img}" style="max-width:100%;display:block;margin-top:12px">`:''}</div>
${q.o.map((o,j)=>{const on=cur===j;return`<div onclick="pick(${j})" style="display:flex;align-items:center;gap:14px;padding:16px;margin:14px 0;border-radius:14px;border:1.5px solid ${on?'#346ef3':'var(--bd)'};background:${on?'var(--cd)':'var(--bg)'};cursor:pointer;font-size:14px"><span style="width:34px;height:34px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;border:2px solid ${on?'#012AAB':'#999'};background:${on?'#012AAB':'var(--bg)'};color:${on?'#fff':'var(--tx)'}">${'ABCDE'[j]}</span><span style="flex:1">${esc(o)}${q.oi&&q.oi[j]?`<br><img src="${q.oi[j]}" style="max-width:100%">`:''}</span>${sv===j?'<span style="font-size:11px;font-weight:700;color:#1a9a3a">Tersimpan</span>':''}</div>`}).join('')}<div style="height:150px"></div>
<div class=fx style="padding-top:10px"><div style="display:flex;justify-content:space-between"><button ${pend?'':'disabled'} style="width:48%;height:50px;background:var(--yl);color:#111;font-weight:700;border-radius:12px" onclick=saveAns()>SIMPAN JAWABAN</button><button ${tg>=0&&!pend?'':'disabled'} style="width:48%;height:50px;background:#346ef3;color:#fff;font-weight:700;border-radius:12px" onclick=skip()>LEWATI</button></div><button ${E.i>0?'':'disabled'} style="width:100%;height:46px;margin-top:10px;background:var(--bg);color:#555;border:2px solid #555;border-radius:12px;font-weight:700" onclick=prev()>SOAL SEBELUMNYA</button></div>${NAVOPEN?navPanel(p):''}`}
function paid(){const p=P(CUR);S.owned[p.id]=1;log('beli',`${S.me.n} membeli ${p.name} via ${BANK}${PROMO?' (promo '+PROMO.code+')':''}`);PROMO=null;TAB=p.type;alert('Pembayaran berhasil! Paketmu sudah pindah ke menu Daftar Paket. Silakan cek di sana untuk memulai.');go('paket')}
paren=0;paket=function(){const own=S.packages.filter(p=>S.owned[p.id]);if(!own.length)return`<div style="height:75vh;display:grid;place-items:center;text-align:center;padding:0 20px"><div><div style="font-size:18px;color:#999;font-weight:600">Kamu belum membeli paket</div><p class=mu style="font-size:13px;line-height:1.6;margin-top:10px">Paket yang sudah kamu beli akan muncul di sini. Pilih paket di Beranda, lalu cek menu ini setelah pembayaran berhasil.</p></div></div>`;return _pk()};
/* ===== REVISI 5 ===== */
const KISI={TWK:['Nasionalisme','Integritas','Bela Negara','Pilar Negara','Bahasa Indonesia'],TIU:['Verbal (Analogi)','Verbal (Silogisme)','Verbal (Analitis)','Numerik (Berhitung)','Numerik (Deret Angka)','Numerik (Perbandingan)','Numerik (Soal Cerita)','Figural (Analogi)','Figural (Ketidaksamaan)','Figural (Serial)'],TKP:['Pelayanan Publik','Jejaring Kerja','Sosial Budaya','Teknologi Informasi dan Komunikasi','Profesionalisme','Anti Radikalisme']};
S.packages.forEach(p=>p.qs.forEach((q,i)=>{if(q.kisi===undefined&&/^Contoh soal/.test(q.t)){const k=KISI[qType(p,i)];q.kisi=k[i%k.length]}}));save();
const _bk2=bank;bank=function(){const h=_bk2();if(SEL==null)return h;const p=P(ED),q=p.qs[SEL],t=qType(p,SEL);return h.replace('<b style="display:block;margin-top:10px">Pembahasan</b>',`<b style="display:block;margin-top:10px">Kisi-kisi (opsional)</b><select onchange="P(ED).qs[SEL].kisi=this.value;save()"><option value="">Tanpa kisi-kisi</option>${KISI[t].map(k=>`<option ${q.kisi==k?'selected':''}>${k}</option>`).join('')}</select><b style="display:block;margin-top:10px">Pembahasan</b>`)};
const _ex=exam;exam=function(){const h=_ex(),q=P(E.id).qs[E.i];return h.replace('<b style="font-size:17px">SOAL NOMOR:','<b style="font-size:17px;white-space:nowrap;flex:none">SOAL NOMOR:').replace('</div>\n<div onclick="pick(0)"',(q.kisi?`<div style="color:#012AAB;font-weight:700;font-size:14px;margin-top:18px">${esc(q.kisi)}</div>`:'')+'</div>\n<div onclick="pick(0)"')};
function akhiri(){const n=P(E.id).qs.length,a=Object.keys(E.ans).length;modal(`<b style="font-size:18px">Apakah Anda yakin ingin mengakhiri ujian?</b><p style="line-height:1.6">Nilai Anda akan mulai dihitung dari jawaban yang sudah disimpan. Terjawab <b>${a}</b> dari ${n} soal${n-a?`, masih ada <b>${n-a}</b> soal yang belum dijawab`:''}. Setelah diakhiri, ujian tidak dapat dilanjutkan.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Lanjut Mengerjakan</button><button style="flex:1;height:44px;background:#e11d48;color:#fff;font-weight:700" onclick=finish()>Ya, Akhiri Ujian</button></div>`)}
function cancelEx(){if(Date.now()-E.st>=60000)return;modal(`<b style="font-size:18px">Apakah Anda yakin ingin membatalkan ujian?</b><p style="line-height:1.6">Semua jawaban tidak akan dihitung dan waktu ujian berhenti. Pembatalan hanya bisa dilakukan pada 1 menit pertama dan sebelum soal ke-3 tampil; setelah itu ujian hanya bisa diselesaikan lewat tombol AKHIRI.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Lanjut Mengerjakan</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=doCancel()>Ya, Batalkan</button></div>`)}
const _st=start;start=function(id,t){_st(id,t);try{history.pushState({ex:1},'')}catch(e){}};
try{window.addEventListener('popstate',()=>{if(V=='exam'&&E){history.pushState({ex:1},'');akhiri()}});window.addEventListener('beforeunload',e=>{if(V=='exam'&&E){e.preventDefault();e.returnValue=''}});if(S.me&&S.exam)history.pushState({ex:1},'')}catch(e){}
/* ===== REVISI 6 ===== */
const _hm=home;home=function(){return _hm().replace(/border-radius:12px/g,'border-radius:8px').replace(/height:50px;border-radius:8px/g,'height:42px;border-radius:8px')};
const _pk2=paket;paket=function(){return _pk2().replace(/<button style="background:var\(--ac\);color:#fff;width:100%" onclick=mulai\((\d+)\)>MULAI<\/button>/g,'<button style="background:var(--ac);color:#fff;width:90px" onclick=mulai($1)>MULAI</button><button style="background:#012AAB;color:#fff;width:90px" onclick=desc($1)>Deskripsi</button>')};
function skip(){const t=nextT();if(t<0)return;E.i=t;E.sel=null;S.exam=E;save();render();scrollTo(0,0)}
exam=function(){const p=P(E.id),q=p.qs[E.i],tp=qType(p,E.i),cur=E.sel??E.ans[E.i],sv=E.ans[E.i],pend=E.sel!=null&&E.sel!==sv,tg=nextT(),early=Date.now()-E.st<60000,LB={TWK:'Tes Wawasan Kebangsaan (TWK)',TIU:'Tes Intelegensia Umum (TIU)',TKP:'Tes Karakteristik Pribadi (TKP)'},bt=(c,f,x)=>`height:42px;border-radius:6px;font-size:12.5px;font-weight:700;background:${c};color:${f};${x||''}`;
return`<div style="padding:0 2px"><div style="margin:-14px -16px 0;height:60px;padding:0 16px;background:#012AAB;display:flex;align-items:center;justify-content:space-between"><button id=bk class="${early?'':'dis'}" ${early?'':'disabled'} style="height:24px;padding:0 10px 0 6px;display:flex;align-items:center;gap:4px;background:none;border:1.5px solid #fff;color:#fff;font-size:11px;font-weight:700;border-radius:4px" onclick=cancelEx()><svg width=14 height=14 viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=3 stroke-linecap=round stroke-linejoin=round><path d="M15 18l-6-6 6-6"/></svg>BATAL</button><b id=tm style="color:#ffc619;font-size:17px;letter-spacing:.5px">${tm()}</b><button style="height:24px;padding:0 12px;background:#fff;color:#e11d48;font-weight:700;font-size:11px;border-radius:4px" onclick=akhiri()>AKHIRI</button></div>
<div style="display:flex;gap:12px;margin-top:16px"><div style="flex:1;min-width:0;height:40px;border:1.5px solid #012AAB;border-radius:6px;padding:0 12px;display:flex;align-items:center;font-size:12px;font-weight:700;color:#012AAB;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name.toUpperCase())}</div><button style="height:40px;padding:0 14px;background:#012AAB;color:#fff;font-size:12px;font-weight:700;border-radius:6px" onclick="NAVOPEN=true;render()">DAFTAR NOMOR</button></div>
<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:18px 0 10px"><b style="font-size:14px;white-space:nowrap;flex:none">SOAL NOMOR: ${numOf(p,E.i)}</b><span style="color:#346ef3;font-weight:700;font-size:12px;text-align:right">${LB[tp]}</span></div>
<div style="border:1.5px solid #012AAB;border-radius:10px;padding:16px 18px;font-size:14px;line-height:1.55">${esc(q.t)}${q.img?`<img src="${q.img}" style="max-width:100%;display:block;margin-top:10px">`:''}${q.kisi?`<div style="color:#012AAB;font-weight:700;font-size:12px;margin-top:16px">${esc(q.kisi)}</div>`:''}</div><div style="margin-top:20px">${q.o.map((o,j)=>{const on=cur===j;return`<div onclick="pick(${j})" style="display:flex;align-items:center;gap:12px;padding:0 14px;min-height:47px;margin-bottom:12px;border-radius:6px;border:1px solid ${on?'#346ef3':'var(--bd)'};background:${on?'#eef3ff':'var(--bg)'};box-shadow:0 1px 3px #0001;cursor:pointer;font-size:13px;color:${on?'#111':'var(--tx)'}"><span style="width:22px;height:22px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:11px;border:1.5px solid ${on?'#012AAB':'#888'};background:${on?'#012AAB':'var(--bg)'};color:${on?'#fff':'var(--tx)'}">${'ABCDE'[j]}</span><span style="flex:1;padding:8px 0">${esc(o)}${q.oi&&q.oi[j]?`<br><img src="${q.oi[j]}" style="max-width:100%">`:''}</span>${sv===j?CHK:''}</div>`}).join('')}</div><div style="height:120px"></div></div>
<div class=fx style="padding:6px 16px 12px"><div style="display:flex;gap:8px"><button ${pend?'':'disabled'} style="flex:1;${bt('#ffc619','#111')}" onclick=saveAns()>SIMPAN JAWABAN</button><button ${tg>=0?'':'disabled'} style="flex:1;${bt('#346ef3','#fff')}" onclick=skip()>LEWATI</button></div><button ${E.i>0?'':'disabled'} style="width:100%;margin-top:8px;${bt('var(--bg)','#666','border:1.5px solid #777')}" onclick=prev()>SOAL SEBELUMNYA</button></div>${NAVOPEN?navPanel(p):''}`};
/* ===== REVISI 7 ===== */
let SORT='new',MENU=null,RV={i:0,open:{}},RNAV=false;
const DOT='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',CHV=o=>`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(${o?180:0}deg)"><path d="M6 9l6 6 6-6"/></svg>`,LBL={TWK:'Tes Wawasan Kebangsaan (TWK)',TIU:'Tes Intelegensia Umum (TIU)',TKP:'Tes Karakteristik Pribadi (TKP)'},bt2=(c,f,x)=>`height:42px;border-radius:6px;font-size:12.5px;font-weight:700;background:${c};color:${f};${x||''}`,hit2=(a,q)=>a.filter(p=>(p.name+' '+p.type+' '+(p.desc||'')).toLowerCase().includes(q.toLowerCase().trim()));
function srch(){const ps=Q.trim()?hit2(vis(),Q):vis().slice(0,PN());$('#ls').innerHTML=lst3(ps);const l=$('#lm');if(l)l.style.display=Q.trim()?'none':'block'}
const _hm2=home;home=function(){return _hm2().replace('oninput="Q=this.value;list()"','oninput="Q=this.value;srch()"')};
function paid(){const p=P(CUR);S.owned[p.id]=Date.now();log('beli',`${S.me.n} membeli ${p.name} via ${BANK}${PROMO?' (promo '+PROMO.code+')':''}`);PROMO=null;TAB=p.type;SORT='new';alert('Pembayaran berhasil! Paketmu sudah pindah ke menu Daftar Paket. Silakan cek di sana untuk memulai.');go('paket')}
paket=function(){const own=S.packages.filter(p=>S.owned[p.id]);if(!own.length)return`<div style="height:75vh;display:grid;place-items:center;text-align:center;padding:0 20px"><div><div style="font-size:18px;color:#999;font-weight:600">Kamu belum membeli paket</div><p class=mu style="font-size:13px;line-height:1.6;margin-top:10px">Paket yang sudah kamu beli akan muncul di sini. Pilih paket di Beranda, lalu cek menu ini setelah pembayaran berhasil.</p></div></div>`;
let L=own.filter(p=>p.type==TAB);if(SORT=='done')L=L.filter(p=>S.res[p.id]);if(SORT=='todo')L=L.filter(p=>!S.res[p.id]);L.sort((a,b)=>SORT=='old'?S.owned[a.id]-S.owned[b.id]:S.owned[b.id]-S.owned[a.id]);
return`<div class=tabs>${['SKD','TWK','TIU','TKP'].map(t=>`<button class="${TAB==t?'on':''}" onclick="TAB='${t}';MENU=null;render()">${t}</button>`).join('')}</div><select style="margin:4px 0 8px;height:38px" onchange="SORT=this.value;render()">${[['new','Terbaru ke terlama'],['old','Terlama ke terbaru'],['done','Sudah dikerjakan'],['todo','Belum dikerjakan']].map(o=>`<option value="${o[0]}" ${SORT==o[0]?'selected':''}>${o[1]}</option>`).join('')}</select>`+(L.map(p=>{const r=S.res[p.id];return`<div class=row style="position:relative;border:1px solid var(--bd);border-radius:8px;padding:12px;margin:14px 0"><div class=th style="background-image:url(${p.thumb||''})"></div><div class=dt><b style="font-size:14px;display:block;padding-right:22px">${esc(p.name)}</b><div class=mu style="margin:3px 0 8px;font-size:12px">${p.type} • Nilai terakhir ${r?r.tot:'-'}</div><div class=b><button style="background:#012AAB;color:#fff" onclick=desc(${p.id})>Deskripsi</button><button style="background:var(--ac);color:#fff" onclick=mulai(${p.id})>MULAI</button></div>${r?`<button style="width:100%;height:32px;margin-top:6px;background:var(--bg);color:#555;border:1.5px solid #777" onclick="CUR=${p.id};go('result')">Hasil Ujian</button>`:''}</div><span style="position:absolute;right:8px;top:8px;cursor:pointer;color:var(--mu)" onclick="MENU=MENU==${p.id}?null:${p.id};render()">${DOT}</span>${MENU==p.id?`<div style="position:absolute;right:8px;top:32px;background:var(--bg);border:1px solid var(--bd);border-radius:6px;box-shadow:0 4px 14px #0003;z-index:5"><div style="padding:10px 16px;color:#e11d48;font-weight:600;cursor:pointer" onclick="hapusPkt(${p.id})">Hapus Paket</div></div>`:''}</div>`}).join('')||'<p class=mu>Tidak ada paket yang sesuai.</p>')};
function hapusPkt(id){MENU=null;render();modal(`<b style="font-size:18px">Hapus paket ini?</b><p style="line-height:1.6">${esc(P(id).name)} beserta riwayat nilainya akan dihapus dari Daftar Paket. Jika ingin mengerjakannya lagi, kamu perlu membeli ulang.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:#e11d48;color:#fff;font-weight:700" onclick=doHapus(${id})>Ya, Hapus</button></div>`)}
function doHapus(id){delete S.owned[id];delete S.res[id];save();closeM();render()}
result=function(){const p=P(CUR),r=S.res[CUR],row=(l,v,b)=>`<tr style="${b?'color:var(--tx);font-weight:700':'color:var(--mu)'}"><td style="width:72px;padding:0">${l}</td><td style="width:16px;padding:0">:</td><td style="padding:0"><div style="max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--tx)">${v}</div></td></tr>`;
return`<div style="margin:-14px -14px 0;height:65px;background:#346ef3;color:#fff;display:grid;place-items:center;font-size:15px;padding:0 12px;text-align:center">${esc(p.name.toUpperCase())}</div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:24px;padding:0 6px"><table style="border-collapse:collapse;font-size:14px;line-height:22px">${row('NAMA',esc(S.me.n))}${['TWK','TIU','TKP'].map(t=>row(t,r.inc.includes(t)?r.sc[t]:'-')).join('')}${row('TOTAL',r.tot,1)}</table><div style="width:73px;height:110px;border-radius:4px;background:#e5e7eb center/cover;flex:none;background-image:url(${S.me.pic||''})"></div></div><div style="text-align:center;font-size:19px;font-weight:800;margin-top:56px;color:${r.ok?'#00c46a':'#e11d48'}">${r.ok?'SELAMAT ANDA LULUS':'ANDA TIDAK LULUS'}</div><div style="position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:100%;max-width:480px;background:var(--bg);border-top:1px solid var(--bd);padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));display:flex;gap:12px"><button style="flex:1;${bt2('#346ef3','#fff','box-shadow:0 3px 10px #0002')}" onclick=openReview()>LIHAT HASIL</button><button style="flex:1;${bt2('#ffc619','#111','box-shadow:0 3px 10px #0002')}" onclick="go('home')">SELANJUTNYA</button></div>`};
function openReview(){RV={i:0,open:{}};RNAV=false;go('review')}
const colR=(p,r,i)=>{const d=r.det[i];if(d.st=='kosong')return'#d22';if(qType(p,i)=='TKP')return{5:'#1a9a3a',4:'#5cc15c',3:'#e0b800',2:'#f0802a',1:'#d22'}[p.qs[i].w[d.a]]||'#d22';return d.st=='benar'?'#1a9a3a':'#d22'};
function summ(p,r){const c=t=>r.det.filter((d,i)=>qType(p,i)==t&&d.st=='benar').length,w=k=>r.det.filter((d,i)=>d.st=='jawab'&&p.qs[i].w[d.a]===k).length,row=(l,v,x)=>`<tr${x?` style="color:${x}"`:''}><td style="padding:3px 0">${l}</td><td style="width:14px">:</td><td style="text-align:right;white-space:nowrap">${v} SOAL</td></tr>`;
return`<table style="width:100%;border-collapse:collapse;font-size:12px;font-weight:600">${r.inc.includes('TWK')?row('TWK BENAR',c('TWK')):''}${r.inc.includes('TIU')?row('TIU BENAR',c('TIU')):''}${r.inc.includes('TKP')?[5,4,3,2,1].map(k=>row('TKP (POIN '+k+')',w(k))).join(''):''}</table><div style="border-top:1.5px dashed #bbb;margin:8px 0"></div><table style="width:100%;border-collapse:collapse;font-size:12px;font-weight:700">${row('BELUM TERJAWAB',r.det.filter(d=>d.st=='kosong').length,'#e11d48')}</table>`}
function rPanel(p,r){const o=OFF[p.type],len=p.qs.length;return`<div class=ov style="z-index:45" onclick="RNAV=false;render()"></div><div style="position:fixed;z-index:50;top:0;bottom:0;right:max(0px,calc(50% - 240px));width:min(86%,410px);background:var(--bg);padding:16px;overflow:auto;animation:inR .3s ease-out;box-shadow:-6px 0 24px #0006"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b style="font-size:15px">Daftar Nomor</b><button style="background:var(--cd);color:var(--tx);height:30px;font-size:12px" onclick="RNAV=false;render()">Tutup</button></div><div style="background:var(--cd);border-radius:8px;padding:12px;margin-bottom:16px">${summ(p,r)}</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">${Array.from({length:110},(_,k)=>{const n=k+1,i=n-1-o;return i>=0&&i<len?`<div class=dc style="background:${colR(p,r,i)};color:#fff;animation-delay:${(k%15)*25}ms;cursor:pointer;${i==RV.i?'box-shadow:0 0 0 3px #ffc619,inset 0 -4px 0 #0004':''}" onclick="RV.i=${i};RNAV=false;render();scrollTo(0,0)">${n}</div>`:`<div class=dc style="background:#d5d8de;color:#888;animation-delay:${(k%15)*25}ms">${n}</div>`}).join('')}</div></div>`}
function review(){const p=P(CUR),r=S.res[CUR],i=RV.i,q=p.qs[i],tp=qType(p,i),d=r.det[i],a=d.a,n=p.qs.length,W=q.w||[],key=j=>tp=='TKP'?W[j]===5:q.a===j,has=!!(q.pem&&q.pem.trim()),open=RV.open[i]!==undefined?RV.open[i]:has;
return`<div style="padding:0 2px"><div style="margin:-14px -16px 0;height:60px;padding:0 16px;background:#012AAB;display:flex;align-items:center;justify-content:space-between"><button style="height:24px;padding:0 10px 0 6px;display:flex;align-items:center;gap:4px;background:none;border:1.5px solid #fff;color:#fff;font-size:11px;font-weight:700;border-radius:4px" onclick="go('result')"><svg width=14 height=14 viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=3 stroke-linecap=round stroke-linejoin=round><path d="M15 18l-6-6 6-6"/></svg>KEMBALI</button><b style="color:${r.ok?'#00e676':'#ff5a6e'};font-size:17px;letter-spacing:.5px">${r.ok?'LULUS':'TIDAK LULUS'}</b><div style="height:24px;padding:0 12px;background:#fff;color:#e11d48;font-weight:800;font-size:13px;border-radius:4px;display:flex;align-items:center">${r.tot}</div></div>
<div style="display:flex;gap:12px;margin-top:16px"><div style="flex:1;min-width:0;height:40px;border:1.5px solid #012AAB;border-radius:6px;padding:0 12px;display:flex;align-items:center;font-size:12px;font-weight:700;color:#012AAB;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name.toUpperCase())}</div><button style="height:40px;padding:0 14px;background:#012AAB;color:#fff;font-size:12px;font-weight:700;border-radius:6px" onclick="RNAV=true;render()">DAFTAR NOMOR</button></div>
<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:18px 0 10px"><b style="font-size:14px;white-space:nowrap;flex:none">SOAL NOMOR: ${numOf(p,i)}</b><span style="color:#346ef3;font-weight:700;font-size:12px;text-align:right">${LBL[tp]}</span></div>
<div style="border:1.5px solid #012AAB;border-radius:10px;padding:16px 18px;font-size:14px;line-height:1.55">${esc(q.t)}${q.img?`<img src="${q.img}" style="max-width:100%;display:block;margin-top:10px">`:''}${q.kisi?`<div style="color:#012AAB;font-weight:700;font-size:12px;margin-top:16px">${esc(q.kisi)}</div>`:''}</div>
<div style="font-size:13px;font-weight:700;margin:20px 0 10px">Jawabanmu: ${a!=null?'ABCDE'[a]:'-'}</div>${q.o.map((o,j)=>{const k=key(j),ch=a===j,st=k?'g':ch?'r':'n',C={g:['#16a34a','#ecfdf3'],r:tp=='TKP'?[WC[W[j]]||'#dc2626','#fff7ed']:['#dc2626','#fef2f2'],n:['var(--bd)','var(--bg)']}[st],tag='';return`<div style="display:flex;align-items:center;gap:12px;padding:0 14px;min-height:47px;margin-bottom:12px;border-radius:6px;border:1.5px solid ${C[0]};background:${C[1]};color:${st=='n'?'var(--tx)':'#111'};font-size:13px"><span style="width:22px;height:22px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:11px;border:1.5px solid ${st=='n'?'#888':C[0]};background:${st=='n'?'var(--bg)':C[0]};color:${st=='n'?'var(--tx)':'#fff'}">${'ABCDE'[j]}</span><span style="flex:1;padding:8px 0">${esc(o)}${q.oi&&q.oi[j]?`<br><img src="${q.oi[j]}" style="max-width:100%">`:''}</span>${tp=='TKP'&&W[j]!=null?`<span style="align-self:stretch;display:flex;align-items:center;justify-content:center;width:42px;margin-right:-14px;border-left:1.5px solid ${WC[W[j]]};color:${TXC[W[j]]};font-weight:800;font-size:16px">${W[j]}</span>`:''}${tag?`<span style="font-size:10px;font-weight:700;color:${st=='g'?'#16a34a':st=='r'?'#dc2626':'#888'}">${tag}</span>`:''}</div>`}).join('')}
<div onclick="RV.open[${i}]=${!open};render()" style="margin-top:20px;border-left:4px solid #346ef3;background:var(--cd);border-radius:0 8px 8px 0;padding:0 14px;height:44px;display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:13px;color:#346ef3;cursor:pointer">Pembahasan${CHV(open)}</div>${open?`<div style="border-left:4px solid #346ef3;background:var(--cd);border-radius:0 8px 8px 0;padding:14px;margin-top:8px;font-size:13px;line-height:1.6;color:${has?'var(--tx)':'#999'}">${has?esc(q.pem):'Kosong'}</div>`:''}<div style="height:120px"></div></div>
<div class=fx style="padding:6px 16px 12px"><div style="display:flex;gap:8px"><button ${i>0?'':'disabled'} style="flex:1;${bt2('var(--bg)','#666','border:1.5px solid #777')}" onclick="RV.i--;render();scrollTo(0,0)">SOAL SEBELUMNYA</button><button ${i<n-1?'':'disabled'} style="flex:1;${bt2('#ffc619','#111')}" onclick="RV.i++;render();scrollTo(0,0)">SELANJUTNYA</button></div></div>${RNAV?rPanel(p,r):''}`}
function render(){if(!S.me&&V!='auth')V='auth';const m={auth,home,paket,profil,edit,buy,qris,va,exam,result,proj,pay:payv,promo,notif,bank,semua,kat,review}[V]();$('#app').innerHTML=m+(['home','paket','profil','semua','kat'].includes(V)?navbar():'')}
/* ===== REVISI 8 ===== */
const ARR='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',CHK='<svg width="18" height="18" viewBox="0 0 24 24" style="flex:none"><circle cx="12" cy="12" r="11" fill="#1a9a3a"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',WC={5:'#1a9a3a',4:'#5cc15c',3:'#e0b800',2:'#f0802a',1:'#d22'};
const BN={QRIS:'QRIS',BCA:'Bank Central Asia (BCA)',BRI:'Bank Rakyat Indonesia (BRI)',MANDIRI:'Bank Mandiri'},PRE='Paket simulasi ini berisi kumpulan soal pengerjaan berstandar CAT yang diambil langsung dari database materi ujian SKD sebelumnya. Pilihan pendaftaran ini dirancang ',
CATDESC={TWK:PRE+'khusus untuk mematangkan kesiapan Anda melalui pengerjaan materi khusus Tes Wawasan Kebangsaan secara fokus, lengkap dengan kisi-kisi terupdate.',TIU:PRE+'khusus untuk mematangkan kesiapan Anda melalui pengerjaan materi khusus Tes Intelegensi Umum secara fokus, lengkap dengan kisi-kisi terupdate.',TKP:PRE+'khusus untuk mematangkan kesiapan Anda melalui pengerjaan materi khusus Tes Karakteristik Pribadi secara fokus, lengkap dengan kisi-kisi terupdate.',SKD:PRE+'untuk mematangkan kesiapan Anda melalui simulasi lengkap 110 soal yang mencakup Tes Wawasan Kebangsaan, Tes Intelegensi Umum, dan Tes Karakteristik Pribadi, lengkap dengan kisi-kisi terupdate.'},
GUIDE={QRIS:['Buka aplikasi mobile banking atau e-wallet apa pun yang mendukung QRIS.','Pilih menu Scan atau Bayar, lalu scan kode QR di atas.','Pastikan nominal sesuai, lalu konfirmasi pembayaran.','Tekan Cek Status Pembayaran setelah selesai.'],VA:['Buka aplikasi mobile banking, ATM, atau internet banking bank kamu.','Pilih menu Transfer atau Bayar, lalu pilih Virtual Account.','Masukkan nomor virtual account di atas dan pastikan nominal sesuai.','Konfirmasi pembayaran, lalu tekan Cek Status Pembayaran.']},
PAR={result:'paket',review:'result',buy:'home',qris:'buy',va:'buy',kat:'home',semua:'home',paket:'home',profil:'home',edit:'home',proj:'home',pay:'home',promo:'home',notif:'home',bank:'proj'};
let LV='',BF='home';
const bar=(t,fn)=>`<div style="margin:-14px -14px 0;height:65px;background:#346ef3;color:#fff;display:flex;align-items:center;gap:14px;padding:0 16px"><button class=bkc onclick="${fn}" style="width:38px;height:38px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center;flex:none">${ARR}</button><b style="font-size:17px">${t}</b></div>`,fin=p=>{const b=p.promo||p.price;return Math.max(0,b-(PROMO?Math.min(PROMO.amt||0,b):0))};
function buy(){const p=P(CUR),base=p.promo||p.price,f=fin(p),own=!!S.owned[p.id],nm=p.name.toUpperCase();
return bar('Pembelian Paket',`go('${BF||'home'}')`)+`<div style="margin:24px 10px 0;border:1.5px solid var(--bd);border-radius:12px;padding:16px"><div style="height:130px;border:1.5px dashed #ccc;border-radius:8px;background:var(--cd) center/cover;display:grid;place-items:center;color:var(--mu);font-weight:700;font-size:12px;text-align:center;padding:0 10px;background-image:url(${p.thumb||''})">${p.thumb?'':'THUMBNAIL - '+esc(nm)}</div><div style="font-size:15px;font-weight:800;margin:14px 0 8px">${esc(nm)}</div><div style="font-size:12.5px;line-height:1.6;color:var(--mu)">${CATDESC[p.type]}</div><div style="font-size:11.5px;color:var(--mu);margin-top:10px">Rilis: ${p.rel||'-'}</div></div>
<div style="margin:22px 12px 0;font-size:17px;font-weight:800">HARGA : <span style="color:#e11d48">${rp(f)}</span>${f<base?` <s class=mu style="font-size:12px;font-weight:400">${rp(base)}</s>`:''}</div>
<div style="display:flex;gap:10px;margin:16px 10px 0"><input id=kp placeholder="Masukkan kode promo..." maxlength=8 value="${PROMO?PROMO.code:''}" ${own?'disabled':''} style="flex:1;height:40px;text-transform:uppercase"><button ${own?'disabled':''} style="width:96px;height:40px;background:#346ef3;color:#fff;font-size:12px;font-weight:700;line-height:1.25" onclick=cekPromo()>CEK<br>PROMO</button></div>${MSG?`<div class="${PROMO?'ok':'er'}" style="margin:8px 12px 0;font-size:12px">${MSG}</div>`:''}
<button ${own?'disabled':''} style="display:block;width:calc(100% - 20px);margin:14px 10px 0;height:44px;background:#ffc619;color:#111;font-weight:800;font-size:15px;box-shadow:0 3px 10px #0002" onclick=payPop()>${own?'PAKET SUDAH DIMILIKI':'BELI PAKET'}</button><p style="margin:18px 12px;font-size:12px;line-height:1.6;color:var(--mu)">Gunakan kode untuk mendapatkan potongan harga pendaftaran paket simulasi Anda sebelum memilih metode pembayaran.</p>`}
function cekPromo(){const c=$('#kp').value.trim().toUpperCase(),pr=S.promos.find(x=>x.code.toUpperCase()==c&&x.on);PROMO=pr||null;MSG=pr?'Promo berhasil! Potongan '+rp(pr.amt||0):'Kode promo tidak valid atau sudah nonaktif';render()}
function payPop(){if(S.owned[CUR])return;sheet(`<div style="padding-bottom:6px"><div style="display:flex;align-items:center;gap:10px;cursor:pointer;margin:6px 0 20px" onclick=closeM()><span style="width:34px;height:34px;border:2.5px solid #e11d48;border-radius:50%;display:grid;place-items:center;color:#e11d48"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></span><b style="color:#e11d48;font-size:14px;letter-spacing:.5px">TUTUP</b></div>${['QRIS','BCA','BRI','MANDIRI'].map(k=>`<div onclick="payGo('${k}')" style="height:50px;border:1.5px solid var(--bd);border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;margin-bottom:12px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 1px 3px #0001">${BN[k]}${S.pay[k]?`<img src="${S.pay[k]}" style="height:30px;width:60px;object-fit:contain">`:''}</div>`).join('')}</div>`)}
function payGo(b){BANK=b;closeM();PAYEND=Date.now()+15*60000;go(b=='QRIS'?'qris':'va');TI=setInterval(()=>{const e=$('#ptm');if(!e)return;const s=Math.max(0,Math.round((PAYEND-Date.now())/1000));e.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(!s){clearInterval(TI);render()}},1000)}
function payBody(slot,g){const p=P(CUR);if(S.owned[p.id])return`<div style="margin:34px 6px;text-align:center"><b style="font-size:16px">Paket ini sudah dimiliki</b><p class=mu style="font-size:13px;line-height:1.6">Kode pembayaran dinonaktifkan agar tidak terjadi pembayaran ganda.</p><button style="width:100%;height:44px;background:#346ef3;color:#fff;font-weight:700" onclick="TAB='${p.type}';go('paket')">Buka Daftar Paket</button></div>`;
const s=Math.max(0,Math.round((PAYEND-Date.now())/1000));if(!s)return`<div style="margin:34px 6px;text-align:center"><b style="font-size:16px;color:#e11d48">Waktu pembayaran habis</b><p class=mu style="font-size:13px;line-height:1.6">Kode pembayaran ini sudah tidak berlaku. Buat pembayaran baru untuk melanjutkan.</p><button style="width:100%;height:44px;background:#ffc619;color:#111;font-weight:700" onclick="go('buy')">Buat Pembayaran Baru</button></div>`;
return`<div style="margin:22px 6px 0;border:1.5px solid var(--bd);border-radius:12px;padding:16px;text-align:center"><div class=mu style="font-size:12px">${esc(p.name)}</div><div style="font-size:12px;margin-top:10px">Total Pembayaran</div><div style="font-size:24px;font-weight:800;color:#e11d48">${rp(fin(p))}</div><div class=mu style="font-size:12px;margin-top:10px">Selesaikan pembayaran dalam</div><b id=ptm style="font-size:20px;color:#e11d48">${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}</b></div>${slot}<button style="display:block;width:calc(100% - 12px);margin:20px 6px 0;height:44px;background:var(--bg);color:#346ef3;border:1.5px solid #346ef3;font-weight:700" onclick=cekStatus()>Cek Status Pembayaran</button><div style="text-align:center;margin:10px 0"><span style="font-size:11px;color:var(--mu);text-decoration:underline;cursor:pointer" onclick=paid()>Simulasi prototipe: anggap pembayaran berhasil</span></div><div style="margin:18px 6px;font-size:12px;line-height:1.7;color:var(--mu)"><b>Panduan Pembayaran</b><ol style="padding-left:18px;margin:6px 0 0">${GUIDE[g].map(x=>`<li>${x}</li>`).join('')}</ol></div>`}
function cekStatus(){if(S.owned[CUR])return go('paket');modal(`<b style="font-size:18px">Pembayaran belum terdeteksi</b><p style="line-height:1.6">Jika kamu sudah membayar, tunggu 1-2 menit lalu cek lagi. Pembayaran yang berhasil akan otomatis memasukkan paket ke Daftar Paket.</p><button style="width:100%;height:44px;background:#346ef3;color:#fff;font-weight:700" onclick=closeM()>Mengerti</button>`)}
function qris(){return bar('Pembayaran QRIS',"go('buy')")+payBody(`<div id=qr-slot style="width:250px;height:250px;margin:20px auto 0;border:2px dashed #bbb;border-radius:10px;display:grid;place-items:center;text-align:center;color:var(--mu);font-size:12px;padding:20px;background:var(--cd)">Area kode QR QRIS<br>(dipasang setelah pembayaran terhubung)</div>`,'QRIS')}
function va(){const lg=S.pay[BANK];return bar('Virtual Account',"go('buy')")+payBody(`<div style="margin:22px auto 0;width:120px;height:60px;border:1.5px solid var(--bd);border-radius:8px;display:grid;place-items:center;overflow:hidden;font-weight:700;font-size:12px;text-align:center">${lg?`<img src="${lg}" style="width:120px;height:60px;object-fit:contain">`:BANK}</div><div style="text-align:center;font-weight:700;margin-top:8px;font-size:14px">${BN[BANK]}</div><div class=mu style="font-size:12px;margin:18px 6px 6px">Nomor Virtual Account</div><div id=va-slot style="margin:0 6px;height:50px;border:2px dashed #bbb;border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;color:var(--mu);font-size:13px;background:var(--cd)"><span>Nomor VA tampil di sini</span><button disabled style="background:#346ef3;color:#fff;height:30px;padding:0 14px">Salin</button></div>`,'VA')}
function newPromo(){modal(`<b>Promo Kreator</b><input id=pn placeholder="Nama Kreator" style="margin:8px 0"><input id=pc placeholder="Kode promo 6-8 karakter" maxlength=8 style="margin:8px 0;text-transform:uppercase"><input id=pa type=number placeholder="Potongan harga (Rp)" style="margin:8px 0"><input id=pb placeholder="Bank & Rekening Kreator" style="margin:8px 0"><button class=pm style="width:100%;height:42px;background:var(--ac);color:#fff" onclick=addPromo()>Simpan</button>`)}
function addPromo(){const c=$('#pc').value.trim().toUpperCase(),a=+$('#pa').value;if(!/^[A-Z0-9]{6,8}$/.test(c)||!$('#pn').value||!(a>0))return alert('Nama wajib, kode 6-8 huruf/angka, dan potongan harus lebih dari 0');if(S.promos.some(x=>x.code==c))return alert('Kode sudah dipakai');S.promos.unshift({name:$('#pn').value,code:c,amt:a,bank:$('#pb').value,on:1});save();closeM();render()}
const _pm=promo;promo=function(){return _pm().replace(/<code>(\w+)<\/code>/g,(m,c)=>{const x=S.promos.find(y=>y.code==c);return m+(x&&x.amt?` <span class=mu>potongan ${rp(x.amt)}</span>`:'')})};
const _r7=result;result=function(){return _r7().replace('<div style="margin:-14px -14px 0;height:65px;background:#346ef3;color:#fff;display:grid;place-items:center;','<div style="position:relative;margin:-14px -14px 0;height:65px;background:#346ef3;color:#fff;display:grid;place-items:center;').replace('text-align:center">','text-align:center"><button class=bkc onclick="TAB=P(CUR).type;go(\'paket\')" style="position:absolute;left:14px;top:13px;width:38px;height:38px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center">'+ARR+'</button>')};
function render(){if(!S.me&&V!='auth')V='auth';if(V!=LV){if(V=='buy'&&LV!='qris'&&LV!='va')BF=LV||'home';LV=V;if(PAR[V]&&!window.BACKING){try{history.pushState({v:V},'')}catch(e){}}}
let m=({auth,home,paket,profil,edit,buy,qris,va,exam,result,proj,pay:payv,promo,notif,bank,semua,kat,review,riwayat,grup63:window.grup63})[V]();m=m.replace(/<(span|div) style="font-size:24px;cursor:pointer[^"]*" onclick="([^"]+)">←<\/\1>/g,(x,t,fn)=>`<button class=bkc onclick="${fn}" style="width:38px;height:38px;border-radius:50%;background:#346ef3;color:#fff;padding:0;display:grid;place-items:center;margin-bottom:8px;box-shadow:0 3px 8px #346ef355">${ARR}</button>`);$('#app').innerHTML=m+(['home','paket','profil','semua','kat'].includes(V)?navbar():'')}
try{window.addEventListener('popstate',()=>{if(!S.me||['exam','auth','home'].includes(V))return;closeM();if(V=='result'&&CUR)TAB=P(CUR).type;clearInterval(TI);goBack(PAR[V]||'home')})}catch(e){}
/* ===== REVISI 9 ===== */
/* SIMULASI-HAPUS: 14 paket bertanda sim:1 dan wrapper paid() di bawah HARUS dihapus saat finishing akhir */
if(!S.sim14){const T=['SKD','SKD','SKD','SKD','TWK','TWK','TWK','TWK','TIU','TIU','TIU','TKP','TKP','TKP'];T.forEach((t,i)=>S.packages.push({id:S.seq++,name:'Simulasi '+t+' '+T.slice(0,i+1).filter(x=>x==t).length,type:t,price:t=='SKD'?25000:t=='TKP'?12000:10000,promo:0,desc:'',pub:1,hidden:0,rel:TODAY,sim:1,qs:[]}));S.sim14=1;save()}
const _pd=paid;paid=function(){return _pd()};
/* akhir SIMULASI-HAPUS */
const _hm3=home;home=function(){return _hm3().replace('style="width:250px" placeholder','style="width:50%" placeholder')};
const _ex2=exam;exam=function(){const early=E&&Date.now()-E.st<60000;return _ex2().replace(/<button id=bk[^>]*>[\s\S]*?BATAL<\/button>/,`<button id=bk class="${early?'':'dis'} bkc" ${early?'':'disabled'} onclick=cancelEx() style="width:36px;height:36px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center">${ARR}</button>`)};
const _rv=review;review=function(){return _rv().replace(/<button style="[^"]*" onclick="go\('result'\)">[\s\S]*?KEMBALI<\/button>/,`<button class=bkc onclick="go('result')" style="width:36px;height:36px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center">${ARR}</button>`)};
/* ===== REVISI 10 ===== */
let PAYOK=false,PSTAT='';
const PCHK='<svg width="56" height="56" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1a9a3a"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:20;stroke-dashoffset:20;animation:dr .5s .1s forwards"/></svg>';
GUIDE.QRIS=['Buka aplikasi mobile banking atau e-wallet apa pun yang mendukung QRIS.','Pilih menu Scan atau Bayar, lalu scan kode QR di atas.','Nominal terisi otomatis sesuai harga di atas, tidak perlu diketik manual. Konfirmasi pembayaran.','Setelah berhasil, paket otomatis masuk ke menu Daftar Paket.'];
GUIDE.VA=['Buka aplikasi mobile banking, ATM, atau internet banking bank kamu.','Pilih menu Transfer atau Bayar, lalu pilih Virtual Account.','Masukkan nomor virtual account di atas. Nominal terisi otomatis sesuai harga di atas, tidak perlu diketik manual.','Setelah berhasil, paket otomatis masuk ke menu Daftar Paket.'];
function payGo(b){BANK=b;closeM();PAYEND=Date.now()+15*60000;PAYOK=false;PSTAT='';go(b=='QRIS'?'qris':'va');TI=setInterval(()=>{if(PAYOK&&PSTAT!='ok'){PSTAT='ok';clearInterval(TI);render();setTimeout(()=>{PSTAT='';PAYOK=false;paid()},1700);return}const e=$('#ptm');if(!e)return;const s=Math.max(0,Math.round((PAYEND-Date.now())/1000));e.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(!s){clearInterval(TI);render()}},500)}
function payBody(slot,g){const p=P(CUR);
if(PSTAT=='ok')return`<div style="margin:60px 6px;text-align:center;display:grid;justify-items:center">${PCHK}<div style="font-size:18px;font-weight:800;margin-top:14px">Pembayaran diterima</div><p class=mu style="font-size:13px;line-height:1.6">Terima kasih! Paketmu sedang dimasukkan ke menu Daftar Paket.</p></div>`;
if(S.owned[p.id])return`<div style="margin:34px 6px;text-align:center"><b style="font-size:16px">Paket ini sudah dimiliki</b><p class=mu style="font-size:13px;line-height:1.6">Kode pembayaran dinonaktifkan agar tidak terjadi pembayaran ganda.</p><button style="width:100%;height:44px;background:#346ef3;color:#fff;font-weight:700" onclick="TAB='${p.type}';go('paket')">Buka Daftar Paket</button></div>`;
const s=Math.max(0,Math.round((PAYEND-Date.now())/1000));if(!s)return`<div style="margin:34px 6px;text-align:center"><b style="font-size:16px;color:#e11d48">Waktu pembayaran habis</b><p class=mu style="font-size:13px;line-height:1.6">Kode pembayaran ini sudah tidak berlaku. Buat pembayaran baru untuk melanjutkan.</p><button style="width:100%;height:44px;background:#ffc619;color:#111;font-weight:700" onclick="go('buy')">Buat Pembayaran Baru</button></div>`;
return`<div style="margin:26px 6px 0;text-align:center"><div style="font-size:19px;font-weight:800;line-height:1.3">${esc(p.name)}</div><div style="font-size:17px;margin-top:10px"><span style="font-weight:600">Nominal:</span> <b style="color:#e11d48;font-size:22px">${rp(fin(p))}</b></div></div>${slot}<div style="text-align:center;margin-top:14px;font-size:12px;color:var(--mu)">Selesaikan dalam <b id=ptm style="font-size:14px;color:#d97706">${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}</b></div>
<div id=pst style="margin:16px 6px 0;text-align:center;font-size:12.5px;color:var(--mu)"><span class=pd></span>Menunggu pembayaran...</div>
<div style="text-align:center;margin-top:12px"><button style="height:36px;padding:0 18px;background:var(--bg);color:#346ef3;border:1.5px solid #346ef3;font-weight:700;font-size:12.5px" onclick=cekStatus()>Cek Status Pembayaran</button><div style="font-size:11px;color:var(--mu);margin:6px 12px 0">Opsional. Pembayaran yang berhasil otomatis tercatat walaupun kamu tidak menekan tombol ini.</div></div>
<div style="text-align:center;margin:12px 0"><span style="font-size:11px;color:var(--mu);text-decoration:underline;cursor:pointer" onclick=simBayar()>Simulasi prototipe: anggap pembayaran berhasil</span></div>
<div style="margin:18px 6px;font-size:12px;line-height:1.7;color:var(--mu)"><b>Panduan Pembayaran</b><ol style="padding-left:18px;margin:6px 0 0">${GUIDE[g].map(x=>`<li>${x}</li>`).join('')}</ol></div>`}
function simBayar(){PAYOK=true}
function cekStatus(){const e=$('#pst');if(!e)return;e.innerHTML='<span class=pd></span>Memeriksa...';setTimeout(()=>{const f=$('#pst');if(f&&!PAYOK&&PSTAT!='ok')f.innerHTML='Belum ada pembayaran masuk. Dicek pukul '+new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'})},500)}
function va(){return bar('Virtual Account',"go('buy')")+payBody(`<div style="text-align:center;font-weight:800;font-size:15px;margin-top:22px">${BN[BANK]}</div><div class=mu style="font-size:12px;margin:16px 6px 6px">Nomor Virtual Account</div><div id=va-slot style="margin:0 6px;height:50px;border:2px dashed #bbb;border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;color:var(--mu);font-size:13px;background:var(--cd)"><span>Nomor VA tampil di sini</span><button disabled style="background:#346ef3;color:#fff;height:30px;padding:0 14px">Salin</button></div>`,'VA')}
/* ===== REVISI 11 ===== */
CATDESC.SKD='Paket simulasi SKD standar 110 soal (TWK, TIU, TKP) dengan materi yang mengikuti kisi-kisi terbaru.';
CATDESC.TWK='Paket latihan Tes Wawasan Kebangsaan, 30 soal, materi mengikuti kisi-kisi terbaru.';
CATDESC.TIU='Paket latihan Tes Intelegensia Umum, 35 soal, materi mengikuti kisi-kisi terbaru.';
CATDESC.TKP='Paket latihan Tes Karakteristik Pribadi, 45 soal, materi mengikuti kisi-kisi terbaru.';
const DISC='<p style="text-align:center;font-size:11px;line-height:1.6;color:var(--mu);margin:24px 12px 8px">Platform ini adalah sarana latihan mandiri dan tidak berafiliasi dengan BKN atau instansi pemerintah mana pun.</p>';
const _hm5=home;home=function(){return _hm5()+DISC};
const _by=buy;buy=function(){return _by()+DISC};
const _rs9=result;result=function(){return _rs9().replace(/(SELAMAT ANDA LULUS|ANDA TIDAK LULUS)<\/div>/,'$1</div><div style="text-align:center;font-size:11.5px;color:var(--mu);margin-top:6px">Berdasarkan ambang batas simulasi</div>')};
/* ===== REVISI 12 ===== */
const _by2=buy;buy=function(){return _by2().replace(DISC,'')};
const _rs10=result;result=function(){return _rs10().replace(/<div style="text-align:center;font-size:11.5px;color:var\(--mu\);margin-top:6px">Berdasarkan ambang batas simulasi<\/div>/,'')};
const swt=(c,t,b)=>`<span style="display:inline-flex;align-items:center;gap:6px"><i style="width:12px;height:12px;border-radius:3px;flex:none;background:${c};${b||''}"></i>${t}</span>`;
function LEG(p,r){const w=r.inc.filter(t=>t!='TKP'),row=(h,x)=>`<div><b>${h}</b><div style="display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:3px">${x}</div></div>`;
return`<div style="margin:0 0 14px;font-size:11px;line-height:1.5;display:grid;gap:8px">${w.length?row(w.join(' & '),swt('#1a9a3a','Benar')+swt('#d22','Salah / belum dijawab')):''}${r.inc.includes('TKP')?row('TKP',[5,4,3,2].map(k=>swt(WC[k],'Poin '+k)).join('')+swt(WC[1],'Poin 1 / belum dijawab')):''}${row('Penanda',swt('transparent','Garis kuning: soal yang sedang dibuka','border:2px solid #ffc619')+(p.type!='SKD'?swt('#d5d8de','Abu-abu: di luar paket ini'):''))}</div>`}
const _rp=rPanel;rPanel=function(p,r){const g='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">';return _rp(p,r).replace(g,LEG(p,r)+g)};
/* ===== REVISI 13 ===== */
KISI.TWK=['Nasionalisme','Integritas','Bela Negara','Pilar Negara','Bahasa Negara'];
KISI.TIU=['Kemampuan Verbal: Analogi','Kemampuan Verbal: Silogisme','Kemampuan Verbal: Analitis','Kemampuan Numerik: Berhitung','Kemampuan Numerik: Deret Angka','Kemampuan Numerik: Perbandingan Kuantitatif','Kemampuan Numerik: Soal Cerita','Kemampuan Figural: Analogi','Kemampuan Figural: Ketidaksamaan','Kemampuan Figural: Serial'];
const KM={'Bahasa Indonesia':'Bahasa Negara','Verbal (Analogi)':KISI.TIU[0],'Verbal (Silogisme)':KISI.TIU[1],'Verbal (Analitis)':KISI.TIU[2],'Numerik (Berhitung)':KISI.TIU[3],'Numerik (Deret Angka)':KISI.TIU[4],'Numerik (Perbandingan)':KISI.TIU[5],'Numerik (Soal Cerita)':KISI.TIU[6],'Figural (Analogi)':KISI.TIU[7],'Figural (Ketidaksamaan)':KISI.TIU[8],'Figural (Serial)':KISI.TIU[9]};
S.packages.forEach(p=>p.qs.forEach(q=>{if(KM[q.kisi])q.kisi=KM[q.kisi]}));save();
const PC={5:'#1a9a3a',4:'#8ab800',3:'#f2c200',2:'#f58220',1:'#e8431f',0:'#b3122e'};Object.assign(WC,PC);
const ptsOf=(p,r,i)=>{const d=r.det[i];if(d.st=='kosong')return 0;if(qType(p,i)=='TKP')return p.qs[i].w[d.a]??0;return d.st=='benar'?5:0};
rPanel=function(p,r){const o=OFF[p.type],len=p.qs.length,chip=k=>`<span style="width:24px;height:24px;border-radius:6px;background:${PC[k]};color:#fff;text-shadow:0 1px 2px #0006;display:inline-grid;place-items:center;font-weight:800;font-size:12px">${k}</span>`,ks=(p.type=='TWK'||p.type=='TIU')?[5,0]:[5,4,3,2,1,0];
return`<div class=ov style="z-index:45" onclick="RNAV=false;render()"></div><div style="position:fixed;z-index:50;top:0;bottom:0;right:max(0px,calc(50% - 240px));width:min(86%,410px);background:var(--bg);padding:16px;overflow:auto;animation:inR .3s ease-out;box-shadow:-6px 0 24px #0006"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b style="font-size:15px">Daftar Nomor</b><button style="background:var(--cd);color:var(--tx);height:30px;font-size:12px" onclick="RNAV=false;render()">Tutup</button></div><div style="background:var(--cd);border-radius:8px;padding:12px;margin-bottom:16px">${summ(p,r)}</div><div style="margin:0 0 14px;font-size:11px;display:flex;align-items:center;flex-wrap:wrap;gap:6px"><b style="margin-right:4px">Poin</b>${ks.map(chip).join('')}${p.type!='SKD'?'<span style="margin-left:8px;display:inline-flex;align-items:center;gap:6px"><i style="width:12px;height:12px;border-radius:3px;background:#d5d8de"></i>Abu-abu: di luar paket</span>':''}</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">${Array.from({length:110},(_,k)=>{const n=k+1,i=n-1-o;if(!(i>=0&&i<len))return`<div class=dc style="background:#d5d8de;color:#888;animation-delay:${(k%15)*25}ms">${n}</div>`;const pt=ptsOf(p,r,i);return`<div class=dc style="background:${PC[pt]};color:#fff;animation-delay:${(k%15)*25}ms;cursor:pointer;${i==RV.i?'box-shadow:0 0 0 3px #ffc619,inset 0 -4px 0 #0004':''}" onclick="RV.i=${i};RNAV=false;render();scrollTo(0,0)">${n}</div>`}).join('')}</div></div>`};
/* ===== REVISI 14: RESPONSIF ===== */
const NAR=['buy','qris','va','profil','edit','result'],fixW=h=>h.split('max-width:480px').join('max-width:var(--W)').split('calc(50% - 240px)').join('calc(50% - var(--W) / 2)');
const toSide=h=>h.replace(/^<div class=ov[^>]*><\/div>/,'').replace(/<div style="position:fixed;z-index:50;[^"]*">/,'<div class=sidep>').replace(/<div style="display:flex;justify-content:space-between;align-items:center[^"]*"><b style="font-size:1[58]px">Daftar Nomor<\/b><button[^>]*>Tutup<\/button><\/div>/,'<b style="font-size:15px;display:block;margin-bottom:12px">Daftar Nomor</b>'),DNB='<button style="height:40px;padding:0 14px;background:#012AAB';
const _np=navPanel;navPanel=function(p){return fixW(_np(p))};
const _rp2=rPanel;rPanel=function(p,r){return fixW(_rp2(p,r))};
const _rs11=result;result=function(){return fixW(_rs11())};
const _ex3=exam;exam=function(){const h=_ex3(),p=P(E.id);return h.replace('<div style="padding:0 2px">','<div class=exw style="padding:0 2px">').replace(DNB,'<button class=dn style="height:40px;padding:0 14px;background:#012AAB')+toSide(navPanel(p))};
const _rv2=review;review=function(){const h=_rv2(),p=P(CUR),r=S.res[CUR];return h.replace('<div style="padding:0 2px">','<div class=exw style="padding:0 2px">').replace(DNB,'<button class=dn style="height:40px;padding:0 14px;background:#012AAB')+toSide(rPanel(p,r))};
function gridify(){const seen=new Set();[...document.querySelectorAll('#app .row')].forEach(r=>{const pa=r.parentElement;if(seen.has(r)||pa.id=='ls'||pa.id=='sl'||pa.classList.contains('cg'))return;const run=[r];let n=r.nextElementSibling;while(n&&n.classList.contains('row')){run.push(n);n=n.nextElementSibling}const g=document.createElement('div');g.className='cg';pa.insertBefore(g,r);run.forEach(x=>{g.appendChild(x);seen.add(x)})})}
const _rd=render;render=function(){_rd();try{const a=$('#app');a.className=NAR.includes(V)?'nar':'';$('#m').className=a.className;if(document.querySelectorAll)gridify()}catch(e){}};
/* ===== REVISI 15: PALET POIN ===== */
Object.assign(PC,{5:'#1a9a3a',4:'#6cc000',3:'#ffe500',2:'#ff8a00',1:'#d97757',0:'#dd2222'});Object.assign(WC,PC);
const TXC={5:'#1a9a3a',4:'#4f8a00',3:'#a68900',2:'#d46a00',1:'#c0583c',0:'#dd2222'};
/* ===== REVISI 16 ===== */
/* ===== REVISI 17: STATUS PENILAIAN ===== */
TH.TKP=156;
const LIMIT30=true; /* siswa dibatasi 1x tiap 30 hari; mode operator (OP) bebas limit */
function stdInfo(p){const a=(S.me&&S.me.std)=='afirmasi',t=p.type;let h='Ambang batas '+(a?'Afirmasi':'Nasional'),x;
if(!a)x=(t=='SKD'?['TWK','TIU','TKP']:[t]).map(k=>k+' '+TH[k]).join(' · ');else if(t=='SKD')x='Total nilai SKD minimal 281 · TIU minimal 55';else if(t=='TIU')x='TIU minimal 55';else x='Tidak ada ambang batas per materi untuk '+t;
return`<div style="margin-top:12px;font-size:12.5px;line-height:1.6"><b>${h}</b><br>${x}</div><div style="font-size:11.5px;color:var(--mu);margin-top:6px">Status penilaian bisa diatur di Profil.</div>`}
function calcOk(p,r,std){const sc=r.sc;if(std=='afirmasi'){if(p.type=='SKD')return r.tot>=281&&sc.TIU>=55;if(p.type=='TIU')return sc.TIU>=55;return null}return r.inc.every(t=>sc[t]>=TH[t])}
function applyStd(v){S.me.std=v;S.me.stdAt=Date.now();const u=S.users.find(x=>x.e==S.me.e);if(u){u.std=v;u.stdAt=S.me.stdAt}closeM();save();render()}
function setStd(v){const u=S.me;if((u.std||'nasional')==v)return;if(LIMIT30){if(u.stdAt&&Date.now()-u.stdAt<30*864e5){const nx=new Date(u.stdAt+30*864e5).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});return modal(`<b style="font-size:18px">Status belum bisa diganti</b><p style="line-height:1.6">Status penilaian hanya bisa diganti 1 kali dalam 30 hari. Kamu bisa mengubahnya lagi mulai ${nx}.</p><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=closeM()>Mengerti</button>`)}return modal(`<b style="font-size:18px">Ganti status ke ${v=='afirmasi'?'Afirmasi':'Nasional'}?</b><p style="line-height:1.6">Status hanya bisa diganti 1 kali dalam 30 hari. Setelah diganti, kamu baru bisa mengubahnya lagi 30 hari kemudian.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="applyStd('${v}')">Ya, Ganti</button></div>`)}applyStd(v)}
const _by3=buy;buy=function(){const p=P(CUR);return _by3().replace(CATDESC[p.type]+'</div>',CATDESC[p.type]+'</div>'+stdInfo(p))};
const _fn=finish;finish=function(){const id=E?E.id:null;_fn();if(id==null||!S.res[id])return;const p=P(id),r=S.res[id],std=S.me.std||'nasional';r.std=std;r.ok=calcOk(p,r,std);save();render()};
const _rs12=result;result=function(){const r=S.res[CUR];let h=_rs12();if(r&&r.ok===null)h=h.replace(/<div style="text-align:center;font-size:19px;font-weight:800;margin-top:56px;color:[^"]*">(SELAMAT ANDA LULUS|ANDA TIDAK LULUS)<\/div>/,'<div style="text-align:center;font-size:13px;color:var(--mu);margin-top:56px">Tidak ada ambang batas untuk materi ini</div>');return h};
const _rv3=review;review=function(){const r=S.res[CUR];let h=_rv3();if(r&&r.ok===null)h=h.replace(/<b style="color:#ff5a6e;font-size:17px;letter-spacing:.5px">TIDAK LULUS<\/b>/,'<b style="color:#fff;font-size:17px;letter-spacing:.5px">SELESAI</b>');return h};
const _pf=profil;profil=function(){const cs=S.me.std||'nasional',a=cs=='afirmasi',btn=(v,t)=>`<button style="flex:1;height:40px;font-weight:700;font-size:13px;border-radius:8px;${cs==v?'background:#346ef3;color:#fff':'background:var(--cd);color:var(--tx)'}" onclick="setStd('${v}')">${t}</button>`,d=a?'Ambang batas SKD: total nilai minimal 281 dan TIU minimal 55. TWK dan TKP tidak punya batas sendiri.':'Ambang batas SKD: TWK '+TH.TWK+', TIU '+TH.TIU+', TKP '+TH.TKP+'. Nilai tiap materi harus mencapai batasnya.',card=`<div style="margin-top:28px;border:1.5px solid var(--bd);border-radius:12px;padding:16px"><b style="font-size:14px">Status Penilaian</b><div style="display:flex;gap:8px;margin:12px 0">${btn('nasional','Nasional')}${btn('afirmasi','Afirmasi')}</div><div style="font-size:12px;line-height:1.6;color:var(--mu)">${d}${LIMIT30?' Status hanya bisa diganti 1 kali tiap 30 hari.':''}</div></div>`;return _pf().replace('<div style="text-align:center;margin-top:36px"><button',card+'<div style="text-align:center;margin-top:28px"><button')};
summ=function(p,r){const c=t=>r.det.filter((d,i)=>qType(p,i)==t&&d.st=='benar').length,w=k=>r.det.filter((d,i)=>d.st=='jawab'&&p.qs[i].w[d.a]===k).length,row=(l,v,x)=>`<tr${x?` style="color:${x};font-weight:700"`:''}><td style="padding:3px 0">${l}</td><td style="width:14px;text-align:center">:</td><td style="width:72px;text-align:right;white-space:nowrap">${v} SOAL</td></tr>`;
return`<table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:12px;font-weight:600">${r.inc.includes('TWK')?row('TWK BENAR',c('TWK')):''}${r.inc.includes('TIU')?row('TIU BENAR',c('TIU')):''}${r.inc.includes('TKP')?[5,4,3,2,1].map(k=>row('TKP (POIN '+k+')',w(k))).join(''):''}<tr><td colspan=3 style="padding:6px 0"><div style="border-top:1.5px dashed #bbb"></div></td></tr>${row('BELUM TERJAWAB',r.det.filter(d=>d.st=='kosong').length,'#e11d48')}</table>`};
/* ===== REVISI 18 ===== */
const INFO='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#346ef3" stroke-width="2" stroke-linecap="round" style="flex:none"><circle cx="12" cy="12" r="10"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r=".9" fill="#346ef3"/></svg>';
function syncOk(id){const p=P(id),r=S.res[id];if(p&&r){r.std=S.me.std||'nasional';r.ok=calcOk(p,r,r.std)}}
function descStd(p){const a=(S.me.std||'nasional')=='afirmasi',t=p.type;let L=[];if(!a)L=(t=='SKD'?['TWK','TIU','TKP']:[t]).map(k=>k+': '+TH[k]);else if(t=='SKD')L=['Total nilai SKD: minimal 281','TIU: minimal 55'];else if(t=='TIU')L=['TIU: minimal 55'];
return`<div style="margin-top:16px;border-top:1px solid var(--bd);padding-top:14px"><div style="font-size:12px;color:var(--mu)">Kamu mendaftar sebagai</div><div style="font-size:15px;font-weight:800">${a?'Afirmasi':'Nasional'}</div>${L.length?`<div style="font-size:12px;color:var(--mu);margin-top:10px">Ambang batas</div><div style="font-size:14px;font-weight:700;line-height:1.7">${L.join('<br>')}</div>`:''}<div style="display:flex;align-items:center;gap:8px;margin-top:14px;font-size:12px;color:var(--mu);line-height:1.5">${INFO}<span>Kamu dapat mengganti status ini di menu Profil.</span></div></div>`}
function desc(id){const p=P(id);sheet(`<div style="display:flex;gap:10px"><div class=th style="background-image:url(${p.thumb||''})"></div><b>${esc(p.name)}</b></div><div style="font-size:28px;font-weight:700;color:${p.desc?'var(--tx)':'#999'};margin:14px 0;min-height:80px">${esc(p.desc)||'Kosong'}</div>${S.owned[id]?descStd(p):''}`)}
const _by4=buy;buy=function(){const p=P(CUR);return _by4().replace(stdInfo(p),'')};
function applyStd(v){S.me.std=v;if(!OP)S.me.stdAt=Date.now();const u=S.users.find(x=>x.e==S.me.e);if(u){u.std=v;u.stdAt=S.me.stdAt}Object.keys(S.res).forEach(k=>syncOk(k));closeM();save();render()}
function setStd(v){const u=S.me,cur=u.std||'nasional';if(cur==v)return;const nm=v=='afirmasi'?'Afirmasi':'Nasional',lim=LIMIT30&&!OP;
if(lim&&u.stdAt&&Date.now()-u.stdAt<30*864e5){const nx=new Date(u.stdAt+30*864e5).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});return modal(`<b style="font-size:18px">Status belum bisa diganti</b><p style="line-height:1.6">Status penilaian hanya bisa diganti 1 kali dalam 30 hari. Kamu bisa mengubahnya lagi mulai ${nx}.</p><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=closeM()>Mengerti</button>`)}
const thr=v=='afirmasi'?'total nilai SKD minimal 281 dan TIU minimal 55':'TWK '+TH.TWK+', TIU '+TH.TIU+', TKP '+TH.TKP;
modal(`<b style="font-size:18px">Ganti status ke ${nm}?</b><p style="line-height:1.6">Nilai ambang batasmu akan berubah menjadi: ${thr}.</p><p style="line-height:1.6">Semua hasil ujian sebelumnya ikut dinilai ulang otomatis dengan status baru.</p>${lim?'<p style="line-height:1.6"><b>Kamu hanya dapat mengganti status 1 kali dalam 30 hari.</b> Setelah diganti, kamu baru bisa mengubahnya lagi 30 hari kemudian.</p>':''}<div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="applyStd('${v}')">Ya, Ganti</button></div>`)}
const _rs13=result;result=function(){if(S.res[CUR])syncOk(CUR);return _rs13()};
const _rv4=review;review=function(){if(S.res[CUR])syncOk(CUR);return _rv4()};
profil=function(){const cs=S.me.std||'nasional',a=cs=='afirmasi',lim=LIMIT30&&!OP,btn=(v,t)=>`<button style="flex:1;height:40px;font-weight:700;font-size:13px;border-radius:8px;${cs==v?'background:#346ef3;color:#fff':'background:var(--cd);color:var(--tx)'}" onclick="setStd('${v}')">${t}</button>`,d=a?'Ambang batas: total nilai SKD minimal 281 dan TIU minimal 55. TWK dan TKP tidak punya batas sendiri.':'Ambang batas: TWK '+TH.TWK+', TIU '+TH.TIU+', TKP '+TH.TKP+'. Nilai tiap materi harus mencapai batasnya.',card=`<div style="margin-top:28px;border:1.5px solid var(--bd);border-radius:12px;padding:16px"><b style="font-size:14px">Status Penilaian</b><div style="display:flex;gap:8px;margin:12px 0">${btn('nasional','Nasional')}${btn('afirmasi','Afirmasi')}</div><div style="font-size:12px;line-height:1.6;color:var(--mu)">${d}</div><div style="font-size:12px;line-height:1.6;color:var(--mu);margin-top:8px">Saat kamu mengganti status, nilai ambang batas ikut berubah dan semua hasil ujianmu sebelumnya otomatis dinilai ulang dengan status baru.${lim?' Status hanya bisa diganti 1 kali dalam 30 hari.':''}</div></div>`;return _pf().replace('<div style="text-align:center;margin-top:36px"><button',card+'<div style="text-align:center;margin-top:28px"><button')};
/* ===== REVISI 19 ===== */
function desc(id){const p=P(id);sheet(`<div style="display:flex;gap:10px"><div class=th style="background-image:url(${p.thumb||''})"></div><b>${esc(p.name)}</b></div><div style="font-size:28px;font-weight:700;color:${p.desc?'var(--tx)':'#999'};margin:14px 0;min-height:80px">${esc(p.desc)||'Kosong'}</div>${descStd(p)}`)}
let MT=null;
function mtBody(id){return[30,40,50,0].map(t=>{const on=MT===t;return`<div onclick="pickMT(${id},${t})" style="display:flex;align-items:center;gap:12px;height:48px;padding:0 14px;margin-top:10px;border-radius:8px;border:1.5px solid ${on?'#346ef3':'var(--bd)'};background:${on?'var(--cd)':'var(--bg)'};cursor:pointer;font-weight:${on?700:500};font-size:14px"><span style="width:18px;height:18px;border-radius:50%;border:2px solid ${on?'#346ef3':'#999'};display:grid;place-items:center">${on?'<i style="width:8px;height:8px;border-radius:50%;background:#346ef3"></i>':''}</span>${t?t+' menit':'Belajar tanpa waktu'}</div>`}).join('')+`<button ${MT===null?'disabled':''} style="width:100%;height:46px;margin-top:16px;background:#346ef3;color:#fff;font-weight:700" onclick="start(${id},${MT})">MULAI</button>`}
function pickMT(id,t){MT=t;const e=$('#mt');if(e)e.innerHTML=mtBody(id)}
function mulai(id){const p=P(id),old=S.res[id];MT=null;if(p.type=='SKD')return sheet(`<b style="font-size:18px">Try Out SKD 110 Soal</b><p class=mu style="line-height:1.6;font-size:13px">Simulasi lengkap 110 soal (TWK 1-30, TIU 31-65, TKP 66-110) dengan waktu standar 110 menit, hitung mundur. Waktu pada SKD tidak bisa diatur.${old?' Hasil lama tetap tersimpan di riwayat.':''}</p><button style="width:100%;height:46px;background:var(--ac);color:#fff;font-weight:700" onclick="start(${id},110)">Mulai Sekarang</button>`);
sheet(`<b style="font-size:18px">Pengaturan Waktu ${p.type}</b><p class=mu style="font-size:12px;line-height:1.6;margin:6px 0 0">Pilih durasi, lalu tekan MULAI.${old?' Hasil lama tetap tersimpan di riwayat.':''}</p><div id=mt>${mtBody(id)}</div>`)}
const _sm=semua;semua=function(){return _sm().replace('<input placeholder="Cari semua paket..."','<input style="width:50%;margin-left:auto" placeholder="Cari semua paket..."')};
let OPCRED=null; /* null = belum ada kredensial, masuk langsung. JANGAN simpan kata sandi di HTML/JS; verifikasi harus di server */
function opLoginForm(){modal(`<b style="font-size:18px">Masuk Operator</b><input id=opu placeholder="Username" autocomplete=off style="margin-top:14px"><input id=opp type=password placeholder="Password" autocomplete=off style="margin-top:12px"><input id=opk type=password placeholder="Kode Unik" autocomplete=off style="margin-top:12px"><div id=ope class=er style="font-size:12px;margin-top:8px;min-height:16px"></div><div style="display:flex;gap:10px;margin-top:6px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=opLogin()>Masuk</button></div>`)}
function opLogin(){const u=$('#opu').value.trim(),p=$('#opp').value,k=$('#opk').value;if(OPCRED&&!(u===OPCRED.u&&p===OPCRED.p&&k===OPCRED.k)){$('#ope').textContent='Username, password, atau kode unik salah';return}OP=true;closeM();go('home')}
function logoClick(){if(OP)return crop(3.3,660,'png','Potong Logo (area 3,3:1)',d=>{S.logo=d;save();render()});const n=Date.now();CL=CL.filter(t=>n-t<9000);CL.push(n);if(CL.length>=12){CL=[];opLoginForm()}}
/* ===== REVISI 20: EDITOR PAKET OPERATOR (TAHAP 1) ===== */
let BV='star';
const SVG=(d,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${d}</svg>`,CPY=SVG('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>',20),CKO='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',CKN=CHK.replace('width="18" height="18"','width="28" height="28"'),CAMS=SVG('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',20),PLUS=SVG('<path d="M12 5v14M5 12h14"/>',36);
const toast=m=>{try{const d=document.createElement('div');d.textContent=m;d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#111;color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;z-index:99';document.body.appendChild(d);setTimeout(()=>d.remove(),1600)}catch(e){}};
const todayStr=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function expireCheck(){const t=todayStr();let c=0;S.packages.forEach(p=>{if(p.pub&&p.exp&&t>p.exp){p.pub=0;c=1}});if(c)save()}
const _rd3=render;render=function(){expireCheck();_rd3()};
function cekPromo(){const p=P(CUR),c=$('#kp').value.trim().toUpperCase(),pr=S.promos.find(x=>x.code.toUpperCase()==c&&x.on);
if(!pr){PROMO=null;MSG='Kode promo tidak valid atau sudah nonaktif'}else if(!p.promoOn||!(p.promoPrice>0)){PROMO=null;MSG='Kode promo tidak berlaku untuk paket ini'}else{const b=p.promo||p.price;PROMO=Object.assign({},pr,{amt:Math.max(0,b-p.promoPrice)});MSG='Promo berhasil! Harga promo '+rp(Math.min(b,p.promoPrice))}render()}
const addDots=h=>h.replace(/<div class=row style="([^"]*)">([\s\S]*?)onclick=desc\((\d+)\)/g,(m,s,mid,id)=>`<div class=row style="${s};position:relative"><span onclick="opCard(${id})" style="position:absolute;right:8px;top:8px;padding:6px;cursor:pointer;color:var(--mu)">${DOT}</span>${mid}onclick=desc(${id})`);
function srch(){const ps=Q.trim()?hit2(vis(),Q):vis().slice(0,PN());let h=lst3(ps);if(OP)h=addDots(h);$('#ls').innerHTML=h;const l=$('#lm');if(l)l.style.display=Q.trim()?'none':'block'}
function list(){srch()}
const _hm6=home;home=function(){const h=_hm6();return OP?addDots(h):h};
const _sm2=semua;semua=function(){const h=_sm2();return OP?addDots(h):h};
const _kt=kat;kat=function(){const h=_kt();return OP?addDots(h):h};
function opCard(id){const p=P(id);sheet(`<b style="font-size:16px">${esc(p.name)}</b><div onclick="closeM();toDraft(${id})" style="padding:14px 4px;border-bottom:1px solid var(--bd);cursor:pointer">Simpan ke draf</div><div onclick="closeM();ED=${id};BV='star';go('bank')" style="padding:14px 4px;cursor:pointer">Edit</div>`)}
function toDraft(id){P(id).pub=0;save();closeM();render()}
function newPkgCat(){sheet(`<b style="font-size:16px">Pilih Kategori Paket</b>${[['SKD','SKD (110 soal)'],['TWK','TWK (30 soal)'],['TIU','TIU (35 soal)'],['TKP','TKP (45 soal)']].map(x=>`<div onclick="mkPkg2('${x[0]}')" style="height:48px;margin-top:10px;border:1.5px solid var(--bd);border-radius:8px;display:flex;align-items:center;padding:0 16px;font-weight:700;cursor:pointer">${x[1]}</div>`).join('')}`)}
function mkPkg2(t){const p={id:S.seq++,name:'Paket Baru',type:t,price:0,promo:0,desc:'',pub:0,hidden:0,promoOn:0,promoPrice:0,exp:'',qs:Array.from({length:NEED[t]},empty)};S.packages.unshift(p);save();closeM();ED=p.id;BV='star';PTAB='Projekku';go('bank')}
function pkMenu(id){const p=P(id),it=(t,f,c)=>`<div onclick="closeM();${f}" style="padding:14px 4px;border-bottom:1px solid var(--bd);font-size:14px;cursor:pointer;${c?'color:'+c:''}">${t}</div>`,ed=it('Edit',`ED=${id};BV='star';go('bank')`);
sheet(`<b style="font-size:16px">${esc(p.name)}</b>${p.pub?ed+it('Simpan ke draf',`toDraft(${id})`)+it(p.hidden?'Tayangkan':'Sembunyikan',`hide(${id})`):it('Publish',`publish(${id})`)+ed+it('Hapus',`hapusPk(${id})`,'#e11d48')}`)}
function hapusPk(id){modal(`<b style="font-size:18px">Hapus paket ini?</b><p style="line-height:1.6">${esc(P(id).name)} beserta seluruh soalnya akan dihapus permanen.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:#e11d48;color:#fff;font-weight:700" onclick=doHapusPk(${id})>Ya, Hapus</button></div>`)}
function doHapusPk(id){S.packages=S.packages.filter(p=>p.id!=id);delete S.owned[id];delete S.res[id];save();closeM();render()}
function proj(){const L=S.packages.filter(p=>!p.sim&&(PTAB=='Projekku'?!p.pub:p.pub));
return back()+`<button onclick=newPkgCat() style="width:100px;height:100px;display:grid;place-items:center;margin:10px auto 4px;background:var(--cd);color:#346ef3;border-radius:12px">${PLUS}</button><div style="text-align:center;font-size:12px;color:var(--mu);margin-bottom:8px">Buat paket baru</div><div class=tabs>${['Projekku','Paket'].map(t=>`<button style="height:45px" class="${PTAB==t?'on':''}" onclick="PTAB='${t}';render()">${t}</button>`).join('')}</div>`+(L.map(p=>`<div class=row style="position:relative;align-items:center;gap:12px;border:1px solid var(--bd);border-radius:8px;padding:12px;margin:12px 0"><div class=th style="width:72px;height:48px;background-image:url(${p.thumb||''})"></div><div style="flex:1;min-width:0"><b style="font-size:14px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</b><div class=mu style="font-size:12px">${p.type} • ${rp(p.promo||p.price)}${p.hidden?' • disembunyikan':''}${p.exp?' • sampai '+p.exp:''}</div></div><span onclick="pkMenu(${p.id})" style="cursor:pointer;padding:6px;color:var(--mu)">${DOT}</span></div>`).join('')||'<p class=mu>Belum ada paket di sini.</p>')}
function diskonBoard(){const p=P(ED);modal(`<b style="font-size:18px">Beri Diskon</b><div style="margin-top:14px;font-size:12px;color:var(--mu)">Kolom 1: Harga awal</div><div style="height:44px;margin-top:4px;border:1px solid var(--bd);border-radius:6px;display:flex;align-items:center;padding:0 12px;background:var(--cd);font-weight:700">${rp(p.price)}</div><div style="margin-top:12px;font-size:12px;color:var(--mu)">Kolom 2: Harga setelah diskon</div><div style="display:flex;align-items:center;border:1px solid var(--bd);border-radius:6px;padding-left:12px;margin-top:4px"><b style="margin-right:8px">Rp</b><input id=dk type=number min=0 value="${p.promo||''}" style="border:0;padding-left:0"></div><div id=dke class=er style="font-size:12px;min-height:16px;margin-top:6px"></div><div style="display:flex;gap:8px;margin-top:6px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=hapusDiskon()>Hapus Diskon</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=simpanDiskon()>Simpan</button></div>`)}
function simpanDiskon(){const p=P(ED),v=+$('#dk').value;if(!(v>0&&v<p.price)){$('#dke').textContent='Harga setelah diskon harus lebih kecil dari harga awal';return}p.promo=v;save();closeM();render()}
function hapusDiskon(){P(ED).promo=0;save();closeM();render()}
function togglePromo(){const p=P(ED);if(!p.promoOn&&!(p.promoPrice>0))return toast('Isi nominal promo dulu');modal(`<b style="font-size:18px">${p.promoOn?'Matikan promo?':'Aktifkan promo?'}</b><p style="line-height:1.6">${p.promoOn?'Kode promo tidak akan berlaku untuk paket ini.':'Paket ini mengaktifkan promo jika kode dipakai.'}</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="setPromo(${p.promoOn?0:1})">Ya</button></div>`)}
function setPromo(v){P(ED).promoOn=v;save();closeM();render()}
function salinPrompt(){try{navigator.clipboard.writeText(S.prompt||PROMPT_AI)}catch(e){}toast('Prompt tersalin')}
function editPrompt(){modal(`<b style="font-size:18px">Edit Prompt</b><p class=mu style="font-size:12px;line-height:1.5">Perubahan berlaku untuk semua salinan prompt berikutnya.</p><textarea id=pt rows=12 style="font-size:12px">${esc(S.prompt||PROMPT_AI)}</textarea><div style="display:flex;gap:8px;margin-top:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick="S.prompt='';save();closeM();toast('Prompt dikembalikan')">Bawaan</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=simpanPrompt()>Simpan</button></div>`)}
function simpanPrompt(){S.prompt=$('#pt').value;save();closeM();toast('Prompt disimpan')}
function pkgPage(){const p=P(ED),lb=t=>`<div style="font-size:12px;color:var(--mu);margin:18px 0 6px">${t}</div>`,rpi=(v,o)=>`<div style="display:flex;align-items:center;border:1px solid var(--bd);border-radius:6px;padding-left:12px;flex:1;min-width:0"><b style="margin-right:8px">Rp</b><input type=number min=0 value="${v||''}" oninput="${o}" style="border:0;padding-left:0"></div>`;
return bar('Halaman Utama Paket',"go('proj')")+`<div style="padding:0 6px 40px">${lb('Thumbnail (120 x 80)')}<div onclick="crop(1.5,360,'jpeg','Potong Thumbnail (120x80)',d=>{P(ED).thumb=d;save();render()})" style="width:120px;height:80px;border:1.5px dashed #bbb;border-radius:8px;background:var(--cd) center/cover;background-image:url(${p.thumb||''});display:grid;place-items:center;color:var(--mu);font-size:11px;cursor:pointer;text-align:center">${p.thumb?'':'Ketuk untuk unggah'}</div>
<input placeholder="Judul paket" value="${esc(p.name)}" oninput="P(ED).name=this.value;save()" style="margin-top:16px"><textarea rows=3 placeholder="Deskripsi paket" oninput="P(ED).desc=this.value;save()" style="margin-top:12px">${esc(p.desc)}</textarea>
${lb('Harga')}<div style="display:flex;gap:10px">${rpi(p.price,'P(ED).price=+this.value;save()')}<button style="padding:0 16px;background:#346ef3;color:#fff;font-weight:700;font-size:13px;flex:none" onclick=diskonBoard()>Beri Diskon</button></div>${p.promo?`<div style="font-size:12px;margin-top:8px;color:var(--mu)">Diskon aktif: <s>${rp(p.price)}</s> <b style="color:#e11d48">${rp(p.promo)}</b></div>`:''}
${lb('Nominal promo (harga saat kode promo dipakai)')}<div style="display:flex;gap:12px;align-items:center">${rpi(p.promoPrice,'P(ED).promoPrice=+this.value;save()')}<span onclick=togglePromo() style="cursor:pointer;display:grid;place-items:center;width:36px;height:36px">${p.promoOn?CKN:CKO}</span></div><div class=mu style="font-size:11.5px;margin-top:6px">Satu harga untuk semua kode promo di paket ini. ${p.promoOn?'Promo aktif.':'Promo nonaktif.'}</div>
${lb('Tanggal kadaluarsa')}<input type=date value="${p.exp||''}" onchange="P(ED).exp=this.value;save()"><div class=mu style="font-size:11.5px;margin-top:6px">Lewat tanggal ini, paket otomatis masuk ke draf.</div>
<div style="display:flex;align-items:center;justify-content:space-between;margin-top:22px;padding:12px 14px;border:1px solid var(--bd);border-radius:8px"><b style="font-size:13px">Prompt Format AI</b><span style="display:flex;gap:16px;color:var(--mu)"><span onclick=salinPrompt() style="cursor:pointer">${CPY}</span><span onclick=editPrompt() style="cursor:pointer">${PEN}</span></span></div>
<button style="width:100%;height:46px;margin-top:22px;background:#346ef3;color:#fff;font-weight:700" onclick="BV='soal';render()">Buka Daftar Soal (1-${NEED[p.type]+OFF[p.type]})</button><div class=mu style="font-size:12px;text-align:center;margin-top:10px">Status: ${p.pub?'Tayang':'Draf'} • Perubahan tersimpan otomatis</div></div>`}
const _bk3=bank;bank=function(){if(!P(ED))return proj();if(BV!='soal')return pkgPage();return _bk3().replace("onclick=\"go('proj')\">\u2190","onclick=\"BV='star';render()\">\u2190").replace('writeText(PROMPT_AI)','writeText(S.prompt||PROMPT_AI)').split('\ud83d\udcf7').join(CAMS).split('\u2714').join('\u2713').split('Tersalin \u2713').join('Tersalin')};
const _eb=errBox;errBox=function(l){_eb(l);const m=$('#m');m.innerHTML=m.innerHTML.replace('\u26a0 ','')};
/* ===== REVISI 21: EDITOR SOAL SATU HALAMAN (TAHAP 2) ===== */
const NL=String.fromCharCode(10);
const RST=SVG('<path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8"/><path d="M3 3v5h5"/>',18),CKW='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',STR=SVG('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',20);
const QS=i=>P(ED).qs[i],qHas=(t,im)=>!!((t||'').trim()||im),ag=el=>{el.style.height='auto';el.style.height=el.scrollHeight+'px'};
const qDone=(p,i)=>{const q=p.qs[i],t=qType(p,i);return qHas(q.t,q.img)&&q.o.every((o,j)=>qHas(o,(q.oi||[])[j]))&&(t=='TKP'?!q.w.includes(null):q.a!=null)};
function validate(p){const e=[];p.qs.forEach((q,i)=>{const n=numOf(p,i),t=qType(p,i);if(!qHas(q.t,q.img))e.push('Nomor '+n+': soal belum diisi');q.o.forEach((o,j)=>{if(!qHas(o,(q.oi||[])[j]))e.push('Nomor '+n+': opsi '+'ABCDE'[j]+' kosong')});if(t!='TKP'&&q.a==null)e.push('Nomor '+n+': kunci jawaban belum dipilih');if(t=='TKP'&&q.w.includes(null))e.push('Nomor '+n+': bobot poin TKP belum lengkap')});return e}
/* ---- gambar ---- */
function shrink(src,cb){const im=new Image();im.onload=()=>{const s=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.8))};im.onerror=()=>cb(src);im.src=src}
function pickImg(cb){file(d=>shrink(d,out=>{cb(out);const k=Math.round(JSON.stringify(S).length/104857.6)/10;if(k>4)toast('Penyimpanan browser hampir penuh ('+k+' MB dari sekitar 5 MB)')}))}
function setImg(i,f,d){const q=QS(i);if(f=='q')q.img=d;else if(f=='p')q.pimg=d;else{q.oi=q.oi||[];q.oi[+f.slice(1)]=d}save()}
function refreshQ(i){const e=document.getElementById&&document.getElementById('qsec'+i);if(e){e.innerHTML=qInner(P(ED),i);if(e.querySelectorAll)e.querySelectorAll('textarea.ag').forEach(ag)}}
function qPic(i,f){pickImg(d=>{setImg(i,f,d);refreshQ(i)})}
function qDel(i,f){setImg(i,f,'');refreshQ(i)}
/* ---- kunci jawaban ---- */
function keyTap(i,j){const p=P(ED),q=QS(i),tp=qType(p,i);if(tp!='TKP'){if(q.a!=null)return toast('Tekan tombol reset untuk mengubah jawaban');q.a=j}else{if(q.w[j]!=null)return toast('Tekan tombol reset untuk mengulang urutan poin');const u=q.w.filter(x=>x!=null).length;if(u>=5)return;q.w[j]=5-u}save();refreshQ(i)}
function keyReset(i){const q=QS(i);q.a=null;q.w=[null,null,null,null,null];save();refreshQ(i)}
/* ---- kisi-kisi ---- */
function kisiMenu(i){const p=P(ED),q=QS(i),L=KISI[qType(p,i)],it=(t,k,on)=>'<div onclick="setKisi('+i+','+k+')" style="padding:13px 6px;border-bottom:1px solid var(--bd);font-size:14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;'+(on?'font-weight:700;color:#346ef3':'')+'">'+t+(on?CHK:'')+'</div>';
sheet('<b style="font-size:16px">Kisi-kisi '+qType(p,i)+' nomor '+numOf(p,i)+'</b><div style="max-height:55vh;overflow:auto;margin-top:6px">'+it('Default (tanpa kisi-kisi)',-1,!q.kisi)+L.map((k,x)=>it(esc(k),x,q.kisi==k)).join('')+'</div>')}
function setKisi(i,k){const p=P(ED);QS(i).kisi=k<0?'':KISI[qType(p,i)][k];save();closeM();refreshQ(i)}
/* ---- prompt + tempel di kolom soal ---- */
const PROMPT2=['Ubah soal-soal yang saya berikan menjadi SATU teks dengan format ketat berikut.','','Aturan:','1. Tulis tanpa nomor soal.','2. Pisahkan setiap soal dengan [[SOAL]].','3. Di dalam satu soal, tulis teks pertanyaan dulu, lalu setiap opsi diawali [[OPSI]] (harus tepat 5 opsi, A sampai E).','4. Soal TWK dan TIU: tulis [[KUNCI]] tepat sebelum teks opsi yang benar.','5. Soal TKP: tulis [[P5]], [[P4]], [[P3]], [[P2]], atau [[P1]] tepat sebelum teks tiap opsi sesuai bobot poinnya; tiap bobot dipakai sekali.','6. Pembahasan (jika ada) ditulis setelah [[BAHAS]] di akhir soal. Jika tidak ada pembahasan, jangan tulis [[BAHAS]].','7. Untuk ganti baris di dalam teks, tulis [[BARIS]]. Jangan menekan Enter.','8. Jangan mengakhiri teks soal dan teks opsi dengan tanda baca titik, koma, tanda tanya, atau tanda seru.','9. Jangan menambah penjelasan lain di luar format.','','Contoh:','Ibu kota Indonesia saat ini adalah[[OPSI]]Bandung[[OPSI]][[KUNCI]]Jakarta[[OPSI]]Surabaya[[OPSI]]Medan[[OPSI]]Makassar[[BAHAS]]Jakarta adalah ibu kota negara saat ini[[SOAL]]Soal berikutnya dan seterusnya'].join(NL);
function salinPrompt(){try{navigator.clipboard.writeText(S.prompt||PROMPT2)}catch(e){}toast('Prompt tersalin')}
function editPrompt(){modal('<b style="font-size:18px">Edit Prompt</b><p class=mu style="font-size:12px;line-height:1.5">Perubahan berlaku untuk semua salinan prompt berikutnya.</p><textarea id=pt rows=12 style="font-size:12px">'+esc(S.prompt||PROMPT2)+'</textarea><div style="display:flex;gap:8px;margin-top:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick="S.prompt=\'\';save();closeM();toast(\'Prompt dikembalikan\')">Bawaan</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=simpanPrompt()>Simpan</button></div>')}
const unBR=s=>(s||'').split('[[BARIS]]').join(NL).trim();
function parseSoal(txt){return txt.split('[[SOAL]]').map(s=>s.trim()).filter(Boolean).map(b=>{const sp=b.split('[[BAHAS]]'),m=sp.shift(),pt=m.split('[[OPSI]]'),q={t:unBR(pt[0]),o:[],a:null,w:[null,null,null,null,null],pem:unBR(sp.join('[[BAHAS]]')),errs:[]};
pt.slice(1).forEach((s,j)=>{let x=s.trim(),w=null,key=false;const mm=x.match(/^(\[\[(KUNCI|P[1-5])\]\]\s*)+/);if(mm){key=mm[0].indexOf('[[KUNCI]]')>=0;const pw=mm[0].match(/\[\[P([1-5])\]\]/);if(pw)w=+pw[1];x=x.slice(mm[0].length)}q.o.push(unBR(x));if(key)q.a=j;if(w!=null&&j<5)q.w[j]=w});
if(q.o.length!=5)q.errs.push('jumlah opsi '+q.o.length+' (harus 5)');q.o=q.o.slice(0,5);while(q.o.length<5)q.o.push('');return q})}
function fillFrom(i,txt){const p=P(ED),items=parseSoal(txt),err=[];let n=0;items.forEach((it,k)=>{const idx=i+k;if(idx>=p.qs.length){err.push('Soal ke-'+(k+1)+' dari teks melebihi jumlah soal paket ('+p.qs.length+')');return}const q=p.qs[idx],tp=qType(p,idx),no=numOf(p,idx);it.errs.forEach(e=>err.push('Nomor '+no+': '+e));q.t=it.t;q.o=it.o;q.pem=it.pem;
if(tp=='TKP'){q.a=null;q.w=it.w;if([1,2,3,4,5].some(v=>it.w.filter(x=>x===v).length!=1))err.push('Nomor '+no+': bobot poin harus lengkap 5,4,3,2,1 masing-masing sekali')}else{q.a=it.a;q.w=[null,null,null,null,null];if(it.a==null)err.push('Nomor '+no+': kunci belum ditandai ([[KUNCI]])')}n++});
save();const y=window.scrollY||0;render();scrollTo(0,y);toast(n+' soal terisi mulai nomor '+numOf(p,i));if(err.length)errBox(err);return n}
function qPaste(e,i){const t=(e.clipboardData||window.clipboardData).getData('text');if(!/\[\[(SOAL|OPSI|BAHAS|KUNCI|BARIS|P[1-5])\]\]/.test(t))return;e.preventDefault();fillFrom(i,t)}
/* ---- tampilan editor ---- */
const ta=(i,f,v,ph)=>'<textarea class=ag rows='+Math.max(2,(v||'').split(NL).length)+' placeholder="'+ph+'" oninput="QS('+i+').'+f+'=this.value;save();ag(this)"'+(f=='t'?' onpaste="qPaste(event,'+i+')"':'')+' style="border:0;padding:0;background:none;resize:none;overflow:hidden;font:inherit;line-height:1.55;width:100%;color:inherit">'+esc(v)+'</textarea>';
const imgBlk=(i,f,src)=>(src?'<div style="position:relative;margin-top:8px"><img src="'+src+'" style="max-width:100%;display:block;border-radius:6px"><span onclick="qDel('+i+',\''+f+'\')" style="position:absolute;top:6px;right:6px;background:#000a;color:#fff;border-radius:50%;width:24px;height:24px;display:grid;place-items:center;cursor:pointer;font-size:14px">x</span></div>':'')+'<span onclick="qPic('+i+',\''+f+'\')" style="cursor:pointer;color:var(--mu);display:inline-flex;align-items:center;gap:6px;font-size:12px;margin-top:8px">'+CAMS+(src?' Ganti foto':' Tambah foto')+'</span>';
function qInner(p,i){const q=p.qs[i],tp=qType(p,i),n=numOf(p,i),used=q.w.filter(x=>x!=null).length;
return '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin:28px 0 10px"><b style="font-size:14px;white-space:nowrap">SOAL NOMOR: '+n+'</b><span style="color:#346ef3;font-weight:700;font-size:12px;text-align:right">'+LBL[tp]+'</span></div>'
+'<div style="border:1.5px solid #012AAB;border-radius:10px;padding:16px 18px;font-size:14px;line-height:1.55">'+ta(i,'t',q.t,'Tulis soal di sini')+imgBlk(i,'q',q.img)+'<div style="margin-top:10px">'+ta(i,'t2',q.t2,'Teks pendukung (opsional, tampil di bawah gambar)')+'</div><div onclick="kisiMenu('+i+')" style="margin-top:14px;color:#012AAB;font-weight:700;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px">'+(q.kisi?esc(q.kisi):'Kisi-kisi: Default')+CHV(0)+'</div></div>'
+'<div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;margin:20px 0 10px">'+(tp=='TKP'?'Poin terisi: '+used+' dari 5':'Jawaban benar: '+(q.a!=null?'ABCDE'[q.a]:'-'))+'<span onclick="keyReset('+i+')" style="cursor:pointer;color:#346ef3;display:inline-flex" title="Reset jawaban">'+RST+'</span></div>'
+q.o.map((o,j)=>{const w=q.w[j],on=tp=='TKP'?w!=null:q.a===j,circ=tp=='TKP'?'<span onclick="keyTap('+i+','+j+')" style="width:30px;height:30px;border-radius:50%;flex:none;display:grid;place-items:center;cursor:pointer;color:#fff;font-weight:800;font-size:13px;border:2px solid '+(w!=null?WC[w]:'#999')+';background:'+(w!=null?WC[w]:'transparent')+'">'+(w!=null?w:'')+'</span>':'<span onclick="keyTap('+i+','+j+')" style="width:28px;height:28px;border-radius:50%;flex:none;display:grid;place-items:center;cursor:pointer;border:2px solid '+(on?'#346ef3':'#999')+';background:'+(on?'#346ef3':'transparent')+'">'+(on?CKW:'')+'</span>';
return '<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;margin-bottom:12px;border-radius:6px;border:1px solid var(--bd);box-shadow:0 1px 3px #0001"><span style="width:22px;height:22px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:11px;border:1.5px solid #888;margin-top:2px">'+'ABCDE'[j]+'</span><div style="flex:1;min-width:0;font-size:13px">'+ta(i,'o['+j+']',o,'Opsi '+'ABCDE'[j])+imgBlk(i,'o'+j,(q.oi||[])[j])+'</div>'+circ+'</div>'}).join('')
+'<div style="margin-top:22px;border-left:4px solid #346ef3;background:var(--cd);border-radius:0 8px 8px 0;padding:12px 14px"><div style="font-weight:700;font-size:13px;color:#346ef3;margin-bottom:6px">Pembahasan</div><div style="font-size:13px">'+ta(i,'pem',q.pem,'Tulis pembahasan (opsional)')+imgBlk(i,'p',q.pimg)+'<div style="margin-top:8px">'+ta(i,'pem2',q.pem2,'Teks pendukung pembahasan (opsional)')+'</div></div></div><hr style="border:0;border-top:1px solid var(--bd);margin:30px 0 0">'}
function starHtml(p){const lb=t=>'<div style="font-size:12px;color:var(--mu);margin:18px 0 6px">'+t+'</div>',rpi=(v,o)=>'<div style="display:flex;align-items:center;border:1px solid var(--bd);border-radius:6px;padding-left:12px;flex:1;min-width:0"><b style="margin-right:8px">Rp</b><input type=number min=0 value="'+(v||'')+'" oninput="'+o+'" style="border:0;padding-left:0"></div>',done=p.qs.filter((q,i)=>qDone(p,i)).length;
return '<div style="padding:18px 6px 6px"><div style="display:flex;align-items:center;gap:8px;color:#012AAB;font-weight:800;font-size:15px">'+STR+' Halaman Utama Paket</div>'+lb('Thumbnail (120 x 80)')+'<div onclick="crop(1.5,360,\'jpeg\',\'Potong Thumbnail (120x80)\',d=>{P(ED).thumb=d;save();render()})" style="width:120px;height:80px;border:1.5px dashed #bbb;border-radius:8px;background:var(--cd) center/cover;background-image:url('+(p.thumb||'')+');display:grid;place-items:center;color:var(--mu);font-size:11px;cursor:pointer;text-align:center">'+(p.thumb?'':'Ketuk untuk unggah')+'</div>'
+'<input placeholder="Judul paket" value="'+esc(p.name)+'" oninput="P(ED).name=this.value;save()" style="margin-top:16px"><textarea rows=3 placeholder="Deskripsi paket" oninput="P(ED).desc=this.value;save()" style="margin-top:12px">'+esc(p.desc)+'</textarea>'
+lb('Harga')+'<div style="display:flex;gap:10px">'+rpi(p.price,'P(ED).price=+this.value;save()')+'<button style="padding:0 16px;background:#346ef3;color:#fff;font-weight:700;font-size:13px;flex:none" onclick=diskonBoard()>Beri Diskon</button></div>'+(p.promo?'<div style="font-size:12px;margin-top:8px;color:var(--mu)">Diskon aktif: <s>'+rp(p.price)+'</s> <b style="color:#e11d48">'+rp(p.promo)+'</b></div>':'')
+lb('Nominal promo (harga saat kode promo dipakai)')+'<div style="display:flex;gap:12px;align-items:center">'+rpi(p.promoPrice,'P(ED).promoPrice=+this.value;save()')+'<span onclick=togglePromo() style="cursor:pointer;display:grid;place-items:center;width:36px;height:36px">'+(p.promoOn?CKN:CKO)+'</span></div><div class=mu style="font-size:11.5px;margin-top:6px">Satu harga untuk semua kode promo di paket ini. '+(p.promoOn?'Promo aktif.':'Promo nonaktif.')+'</div>'
+lb('Tanggal kadaluarsa')+'<input type=date value="'+(p.exp||'')+'" onchange="P(ED).exp=this.value;save()"><div class=mu style="font-size:11.5px;margin-top:6px">Lewat tanggal ini, paket otomatis masuk ke draf.</div>'
+'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:22px;padding:12px 14px;border:1px solid var(--bd);border-radius:8px"><b style="font-size:13px">Prompt Format AI</b><span style="display:flex;gap:16px;color:var(--mu)"><span onclick=salinPrompt() style="cursor:pointer">'+CPY+'</span><span onclick=editPrompt() style="cursor:pointer">'+PEN+'</span></span></div>'
+'<div class=mu style="font-size:12px;margin-top:14px">Status: '+(p.pub?'Tayang':'Draf')+' \u2022 Soal lengkap: '+done+' dari '+p.qs.length+' \u2022 Perubahan tersimpan otomatis. Scroll ke bawah untuk mengisi soal.</div></div>'}
function edPage(){const p=P(ED);
return '<div style="position:sticky;top:0;z-index:8;margin:-14px -14px 0;height:60px;padding:0 16px;background:#012AAB;display:flex;align-items:center;gap:10px"><button class=bkc onclick="go(\'proj\')" style="width:38px;height:38px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center">'+ARR+'</button><b style="color:#fff;font-size:14px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(p.name)+'</b><button onclick=opNav() style="height:34px;padding:0 14px;background:#fff;color:#012AAB;font-weight:700;font-size:12px;border-radius:6px">DAFTAR NOMOR</button></div>'
+'<div id=qsec-star class=qsec>'+starHtml(p)+'</div>'+p.qs.map((q,i)=>'<div id="qsec'+i+'" class=qsec>'+qInner(p,i)+'</div>').join('')+'<div style="height:120px"></div><div class=fxo><button style="background:#fff;color:#666;border:1.5px solid #777" onclick=stepQ(-1)>SEBELUMNYA</button><button style="background:#ffc619;color:#111" onclick=stepQ(1)>SELANJUTNYA</button></div>'}
bank=function(){if(!P(ED))return proj();return edPage()};
function goQ(i){const e=document.getElementById&&document.getElementById(i==='star'?'qsec-star':'qsec'+i);if(e&&e.scrollIntoView)e.scrollIntoView({behavior:'smooth',block:'start'})}
function stepQ(d){const p=P(ED),secs=['star'].concat(p.qs.map((_,i)=>i));let cur=0;secs.forEach((s,k)=>{const e=document.getElementById&&document.getElementById(s==='star'?'qsec-star':'qsec'+s);if(e&&e.getBoundingClientRect().top<=90)cur=k});goQ(secs[Math.min(secs.length-1,Math.max(0,cur+d))])}
function opNav(){const p=P(ED),o=OFF[p.type],len=p.qs.length,
tile=n=>{const i=n-1-o,dl='animation-delay:'+(n%15)*25+'ms';if(!(i>=0&&i<len))return '<div class=dc style="background:#d5d8de;color:#888;'+dl+'">'+n+'</div>';const q=p.qs[i],tp=qType(p,i),L=tp=='TKP'?(q.w.indexOf(5)>=0?'ABCDE'[q.w.indexOf(5)]:''):(q.a!=null?'ABCDE'[q.a]:'');return '<div class=dc style="position:relative;background:'+(qDone(p,i)?'#1a9a3a':'#d22')+';color:#fff;cursor:pointer;'+dl+'" onclick="closeM();goQ('+i+')">'+n+(L?'<span style="position:absolute;top:3px;right:5px;font-size:9px;font-weight:800;line-height:1">'+L+'</span>':'')+'</div>'},
grp=(t,a,b)=>'<div style="margin:18px 0 8px;font-size:12px;font-weight:700;color:var(--mu)">'+t+'</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">'+Array.from({length:b-a+1},(_,k)=>tile(a+k)).join('')+'</div>';
$('#m').innerHTML='<div class=ov style="z-index:45" onclick=closeM()></div><div style="position:fixed;z-index:50;top:0;bottom:0;right:max(0px,calc(50% - var(--W) / 2));width:min(86%,410px);background:var(--bg);padding:16px;overflow:auto;animation:inR .3s ease-out;box-shadow:-6px 0 24px #0006"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:16px">Daftar Nomor</b><button style="background:var(--cd);color:var(--tx);height:30px;font-size:12px" onclick=closeM()>Tutup</button></div><div onclick="closeM();goQ(\'star\')" style="display:flex;align-items:center;gap:10px;margin-top:14px;padding:12px 14px;border:1.5px solid #012AAB;border-radius:8px;color:#012AAB;font-weight:700;cursor:pointer">'+STR+'<span>Halaman Utama Paket</span></div><div style="margin-top:12px;font-size:11.5px;line-height:1.6;color:var(--mu)">Hijau: soal lengkap. Merah: belum lengkap. Huruf di sudut nomor: kunci jawaban (TKP: opsi poin 5).</div>'+grp('TWK (nomor 1-30)',1,30)+grp('TIU (nomor 31-65)',31,65)+grp('TKP (nomor 66-110)',66,110)+'</div>'}
const _rd4=render;render=function(){_rd4();if(V=='bank'){try{document.querySelectorAll('textarea.ag').forEach(ag)}catch(e){}}};
/* ---- tampilan siswa: teks pendukung, baris baru, gambar pembahasan ---- */
const CARD='<div style="border:1.5px solid #012AAB;border-radius:10px;padding:16px 18px;font-size:14px;line-height:1.55">';
const cardInner=q=>'<div>'+esc(q.t)+'</div>'+(q.img?'<img src="'+q.img+'" style="max-width:100%;display:block;margin-top:10px">':'')+(q.t2?'<div style="margin-top:10px">'+esc(q.t2)+'</div>':'')+(q.kisi?'<div style="color:#012AAB;font-weight:700;font-size:12px;margin-top:16px">'+esc(q.kisi)+'</div>':'');
function fixCard(h,q){const s=h.indexOf(CARD);if(s<0)return h;const a=s+CARD.length;let e=h.indexOf('</div><div style="margin-top:20px">',a);if(e<0)e=h.indexOf('</div>'+NL+'<div style="font-size:13px;font-weight:700;margin:20px 0 10px">',a);return e<0?h:h.slice(0,a)+cardInner(q)+h.slice(e)}
const pemHtml=q=>{const h=((q.pem&&q.pem.trim())?'<div style="white-space:pre-line">'+esc(q.pem)+'</div>':'')+(q.pimg?'<img src="'+q.pimg+'" style="max-width:100%;display:block;margin-top:8px;border-radius:6px">':'')+(q.pem2?'<div style="margin-top:8px;white-space:pre-line">'+esc(q.pem2)+'</div>':'');return h||'Kosong'};
const _ex6=exam;exam=function(){const h=_ex6();return fixCard(h,P(E.id).qs[E.i])};
const _rv5=review;review=function(){const q=P(CUR).qs[RV.i],orig=q.pem;let tmp=false;if(!(q.pem&&q.pem.trim())&&(q.pimg||q.pem2)){q.pem=String.fromCharCode(8203);tmp=true}let h=_rv5();if(tmp)q.pem=orig;h=fixCard(h,q);return h.replace(/(<div style="border-left:4px solid #346ef3;background:var\(--cd\);border-radius:0 8px 8px 0;padding:14px;margin-top:8px;font-size:13px;line-height:1\.6;color:[^"]*">)([\s\S]*?)(<\/div>)/,(m,a,b,c)=>a+pemHtml(q)+c)};
/* ===== REVISI 22: EDITOR RINGKAS + FORMAT TEMPEL SEDERHANA ===== */
const SQ=String.fromCharCode(167),SO=String.fromCharCode(166),SB=String.fromCharCode(182);
const BIN=SVG('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',16);
const PROMPT3=['Ubah soal-soal yang saya berikan menjadi SATU teks dengan format berikut.','','1. Pisahkan setiap soal dengan simbol '+SQ+' .','2. Di dalam satu soal, urutannya: teks soal, opsi A, opsi B, opsi C, opsi D, opsi E, lalu pembahasan (jika ada). Pisahkan masing-masing bagian dengan simbol '+SO+' .','3. Untuk ganti baris di dalam teks, gunakan simbol '+SB+' . Jangan menekan Enter.','4. Tulis tanpa nomor soal dan tanpa huruf A, B, C, D, E di depan opsi.','5. Jangan mengakhiri teks soal dan teks opsi dengan tanda baca titik, koma, tanda tanya, atau tanda seru.','6. Jangan menandai jawaban benar.','7. Jangan menambah penjelasan lain di luar format.','','Contoh:','Ibu kota Indonesia saat ini adalah'+SO+'Bandung'+SO+'Jakarta'+SO+'Surabaya'+SO+'Medan'+SO+'Makassar'+SO+'Jakarta adalah ibu kota negara saat ini'+SQ+'Soal berikutnya'+SO+'opsi A'+SO+'opsi B'+SO+'opsi C'+SO+'opsi D'+SO+'opsi E'].join(NL);
function salinPrompt(){try{navigator.clipboard.writeText(S.prompt||PROMPT3)}catch(e){}toast('Prompt tersalin')}
function editPrompt(){modal('<b style="font-size:18px">Edit Prompt</b><p class=mu style="font-size:12px;line-height:1.5">Perubahan berlaku untuk semua salinan prompt berikutnya.</p><textarea id=pt rows=12 style="font-size:12px">'+esc(S.prompt||PROMPT3)+'</textarea><div style="display:flex;gap:8px;margin-top:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick="S.prompt=\'\';save();closeM();toast(\'Prompt dikembalikan\')">Bawaan</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=simpanPrompt()>Simpan</button></div>')}
const unBR2=s=>(s||'').split(SB).join(NL).trim();
function parseSoal(txt){return txt.split(SQ).map(s=>s.trim()).filter(Boolean).map(b=>{const sg=b.split(SO);return {t:unBR2(sg[0]),o:[1,2,3,4,5].map(k=>unBR2(sg[k])),pem:unBR2(sg[6]),extra:sg.length>7}})}
function fillFrom(i,txt){const p=P(ED),items=parseSoal(txt),err=[];let n=0;items.forEach((it,k)=>{const idx=i+k;if(idx>=p.qs.length){err.push('Soal ke-'+(k+1)+' dari teks melebihi jumlah soal paket ('+p.qs.length+')');return}const q=p.qs[idx],no=numOf(p,idx);if(!it.t)err.push('Nomor '+no+': teks soal kosong');if(it.extra)err.push('Nomor '+no+': ada bagian berlebih setelah pembahasan, diabaikan');q.t=it.t;q.o=it.o;q.pem=it.pem;n++});
save();const y=window.scrollY||0;render();scrollTo(0,y);toast(n+' soal terisi mulai nomor '+numOf(p,i));if(err.length)errBox(err);return n}
function qPaste(e,i){const t=(e.clipboardData||window.clipboardData).getData('text');if(t.indexOf(SQ)<0&&t.indexOf(SO)<0)return;e.preventDefault();fillFrom(i,t)}
/* ---- reset & mode ---- */
function qReset(i){const q=QS(i);q.t='';q.img='';q.t2='';save();refreshQ(i);toast('Soal nomor '+numOf(P(ED),i)+' dikosongkan')}
function optReset(i,j){const q=QS(i);q.o[j]='';q.oi=q.oi||[];q.oi[j]='';save();refreshQ(i)}
function toggleMode(){S.opv=S.opv=='lengkap'?'ringkas':'lengkap';save();const y=window.scrollY||0;render();scrollTo(0,y);toast(S.opv=='lengkap'?'Tampilan lengkap: foto dan teks pendukung tampil':'Tampilan ringkas')}
/* ---- tampilan kompak ---- */
const ta2=(i,f,v,ph)=>'<textarea class=ag rows='+Math.max(1,(v||'').split(NL).length)+' placeholder="'+ph+'" oninput="QS('+i+').'+f+'=this.value;save();ag(this)"'+(f=='t'?' onpaste="qPaste(event,'+i+')"':'')+' style="border:0;padding:2px 0;background:none;resize:none;overflow:hidden;font:inherit;line-height:1.45;width:100%;color:inherit;display:block">'+esc(v)+'</textarea>';
const imgBlk2=(i,f,src,full)=>{const z=src?zGet(P(ED),i,f):10;return (src?'<div style="position:relative;margin-top:6px"><img id="zi'+i+'_'+f+'" src="'+src+'" style="max-width:'+(z*10)+'%;display:block;border-radius:6px"><span onclick="qDel('+i+',\''+f+'\')" style="position:absolute;top:4px;right:4px;background:#000a;color:#fff;border-radius:50%;width:22px;height:22px;display:grid;place-items:center;cursor:pointer;font-size:13px">x</span></div>':'')+((full||src)?'<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:6px">'+(full?'<span onclick="qPic('+i+',\''+f+'\')" style="cursor:pointer;color:var(--mu);display:inline-flex;align-items:center;gap:6px;font-size:12px">'+CAMS+(src?' Ganti':' Foto')+'</span>':'')+(src?zctl(i,f,z):'')+'</div>':'')};
function qInner(p,i){const q=p.qs[i],tp=qType(p,i),n=numOf(p,i),full=S.opv=='lengkap',used=q.w.filter(x=>x!=null).length,rs=(f,t)=>'<span onclick="'+f+'" title="'+t+'" style="cursor:pointer;color:var(--mu);display:inline-flex;flex:none">'+BIN+'</span>';
return '<div style="display:flex;align-items:center;gap:8px;margin:20px 0 6px">'+rs('qReset('+i+')','Kosongkan soal')+'<b style="font-size:13px;white-space:nowrap">SOAL NOMOR: '+n+'</b><span style="margin-left:auto;color:#346ef3;font-weight:700;font-size:11.5px;text-align:right">'+LBL[tp]+'</span></div>'
+'<div style="border:1.5px solid #012AAB;border-radius:8px;padding:10px 12px;font-size:13px;line-height:1.45">'+ta2(i,'t',q.t,'Tulis soal di sini')+imgBlk2(i,'q',q.img,full)+(full||q.t2?'<div style="margin-top:6px;border-top:1px dashed var(--bd);padding-top:4px">'+ta2(i,'t2',q.t2,'Teks pendukung (opsional)')+'</div>':'')+'<div onclick="kisiMenu('+i+')" style="margin-top:6px;color:#012AAB;font-weight:700;font-size:11.5px;cursor:pointer;display:inline-flex;align-items:center;gap:4px">'+(q.kisi?esc(q.kisi):'Kisi-kisi: Default')+CHV(0)+'</div></div>'
+'<div style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;margin:12px 0 6px">'+(tp=='TKP'?'Poin terisi: '+used+' dari 5':'Jawaban benar: '+(q.a!=null?'ABCDE'[q.a]:'-'))+'<span onclick="keyReset('+i+')" style="cursor:pointer;color:#346ef3;display:inline-flex" title="Reset jawaban">'+RST+'</span></div>'
+q.o.map((o,j)=>{const w=q.w[j],on=tp=='TKP'?w!=null:q.a===j,circ=tp=='TKP'?'<span onclick="keyTap('+i+','+j+')" style="width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;cursor:pointer;color:#fff;font-weight:800;font-size:12px;border:2px solid '+(w!=null?WC[w]:'#999')+';background:'+(w!=null?WC[w]:'transparent')+'">'+(w!=null?w:'')+'</span>':'<span onclick="keyTap('+i+','+j+')" style="width:24px;height:24px;border-radius:50%;flex:none;display:grid;place-items:center;cursor:pointer;border:2px solid '+(on?'#346ef3':'#999')+';background:'+(on?'#346ef3':'transparent')+'">'+(on?CKW:'')+'</span>';
return '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;margin-bottom:6px;border-radius:6px;border:1px solid var(--bd)">'+rs('optReset('+i+','+j+')','Kosongkan opsi')+'<span style="width:20px;height:20px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:10.5px;border:1.5px solid #888">'+'ABCDE'[j]+'</span><div style="flex:1;min-width:0;font-size:13px">'+ta2(i,'o['+j+']',o,'Opsi '+'ABCDE'[j])+imgBlk2(i,'o'+j,(q.oi||[])[j],full)+'</div>'+circ+'</div>'}).join('')
+'<div style="margin-top:10px;border-left:3px solid #346ef3;background:var(--cd);border-radius:0 6px 6px 0;padding:8px 10px;font-size:13px"><b style="font-size:11.5px;color:#346ef3">Pembahasan</b>'+ta2(i,'pem',q.pem,'Pembahasan (opsional)')+imgBlk2(i,'p',q.pimg,full)+(full||q.pem2?'<div style="margin-top:4px">'+ta2(i,'pem2',q.pem2,'Teks pendukung pembahasan (opsional)')+'</div>':'')+'</div><hr style="border:0;border-top:1px solid var(--bd);margin:18px 0 0">'}
function edPage(){const p=P(ED),full=S.opv=='lengkap';
return '<div style="position:sticky;top:0;z-index:8;margin:-14px -14px 0;height:56px;padding:0 14px;background:#012AAB;display:flex;align-items:center;justify-content:space-between"><button class=bkc onclick="go(\'proj\')" style="width:36px;height:36px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center">'+ARR+'</button><button onclick=toggleMode() title="Tampilkan atau sembunyikan foto dan teks pendukung" style="position:absolute;left:50%;transform:translateX(-50%);width:46px;height:32px;background:#ffffff2e;color:#fff;border-radius:16px;padding:0;display:grid;place-items:center">'+CHV(full?1:0)+'</button><button onclick=opNav() style="height:32px;padding:0 12px;background:#fff;color:#012AAB;font-weight:700;font-size:12px;border-radius:6px">DAFTAR NOMOR</button></div>'
+'<div id=qsec-star class=qsec>'+starHtml(p)+'</div>'+p.qs.map((q,i)=>'<div id="qsec'+i+'" class=qsec>'+qInner(p,i)+'</div>').join('')+'<div style="height:120px"></div><div class=fxo><button style="background:#fff;color:#666;border:1.5px solid #777" onclick=stepQ(-1)>SEBELUMNYA</button><button style="background:#ffc619;color:#111" onclick=stepQ(1)>SELANJUTNYA</button></div>'}
/* ===== REVISI 23: TOMBOL ATUR (SUSUN SOAL DARI TEKS YANG SUDAH DITEMPEL) ===== */
function qAtur(i){const q=QS(i);let v=q.t||'';if(v.indexOf(SQ)<0&&v.indexOf(SO)<0){if(v.indexOf('|')>=0){v=v.split('|').join(SO);toast('Simbol | dikenali sebagai pemisah bagian')}else{toast('Simbol '+SQ+' dan '+SO+' tidak ditemukan di kolom soal ini. Pastikan hasil AI memakai simbol dari prompt');return 0}}return fillFrom(i,v)}
function qDetect(el,i){const v=el.value||'',has=v.indexOf(SQ)>=0||v.indexOf(SO)>=0;if(!el.dataset)return;if(has&&el.dataset.sym!=='1'){el.dataset.sym='1';toast('Format terdeteksi. Tekan tombol Atur untuk menyusun soal')}if(!has)el.dataset.sym=''}
const _qi=qInner;qInner=function(p,i){return _qi(p,i).replace('QS('+i+').t=this.value;save();ag(this)"','QS('+i+').t=this.value;save();ag(this);qDetect(this,'+i+')"').replace('<span style="margin-left:auto;color:#346ef3;font-weight:700;font-size:11.5px;text-align:right">','<button onclick="qAtur('+i+')" title="Susun soal dari teks yang ditempel di kolom soal" style="margin-left:auto;height:24px;padding:0 12px;background:#012AAB;color:#fff;font-size:11px;font-weight:700;border-radius:5px">Atur</button><span style="margin-left:8px;color:#346ef3;font-weight:700;font-size:11.5px;text-align:right">')};
/* ===== REVISI 24A: UNDO/REDO, TEMPEL AMAN, KUNCI OTOMATIS, TAMPILAN SISWA, REVIEW ===== */
const PLS=SVG('<path d="M12 5v14M5 12h14"/>',16),UND=SVG('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',18),REDO=SVG('<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 000 12h3"/>',18);
/* ---- undo / redo ---- */
let HU=[],HR=[],HE=null,TS={i:-1,t:0,e:null};
const snapQ=i=>JSON.stringify(P(ED).qs[i]);
function hReset(){if(HE!==ED){HU=[];HR=[];TS={i:-1,t:0,e:null};HE=ED}}
function hflush(){if(TS.e&&TS.e.ch[0].a===null)TS.e.ch[0].a=snapQ(TS.e.ch[0].i);TS={i:-1,t:0,e:null}}
function hbtn(){try{const u=document.getElementById('b-undo'),r=document.getElementById('b-redo');if(u)u.style.opacity=HU.length?1:.4;if(r)r.style.opacity=HR.length?1:.4}catch(e){}}
function tmark(i){hReset();const n=Date.now();if(TS.e&&TS.i===i&&n-TS.t<1500&&HU[HU.length-1]===TS.e){TS.t=n;return}hflush();const e={ch:[{i,b:snapQ(i),a:null}]};HU.push(e);if(HU.length>60)HU.shift();HR=[];TS={i,t:n,e};hbtn()}
function withHist(idx,fn){hReset();hflush();const b=idx.map(snapQ),r=fn(),ch=[];idx.forEach((i,k)=>{const a=snapQ(i);if(a!==b[k])ch.push({i,b:b[k],a})});if(ch.length){HU.push({ch});if(HU.length>60)HU.shift();HR=[]}hbtn();return r}
function applyH(e,k){e.ch.forEach(c=>{P(ED).qs[c.i]=JSON.parse(c[k])});save();if(e.ch.length==1)refreshQ(e.ch[0].i);else{const y=window.scrollY||0;render();scrollTo(0,y)}}
function undoEd(){hReset();hflush();const e=HU.pop();if(!e)return toast('Tidak ada yang bisa dibatalkan');applyH(e,'b');HR.push(e);hbtn();toast('Dibatalkan')}
function redoEd(){hReset();const e=HR.pop();if(!e)return toast('Tidak ada yang bisa diulangi');applyH(e,'a');HU.push(e);hbtn();toast('Diulangi')}
const _kt24=keyTap;keyTap=function(i,j){return withHist([i],()=>_kt24(i,j))};
const _kr24=keyReset;keyReset=function(i){return withHist([i],()=>_kr24(i))};
const _qr24=qReset;qReset=function(i){return withHist([i],()=>_qr24(i))};
const _or24=optReset;optReset=function(i,j){return withHist([i],()=>_or24(i,j))};
const _si24=setImg;setImg=function(i,f,d){return withHist([i],()=>_si24(i,f,d))};
const _sk24=setKisi;setKisi=function(i,k){return withHist([i],()=>_sk24(i,k))};
const _qi24=qInner;qInner=function(p,i){return _qi24(p,i).replace(/oninput="QS\((\d+)\)\./g,'oninput="tmark($1);QS($1).')};
function edPage(){hReset();const p=P(ED),full=S.opv=='lengkap',ib=(id,fn,svg,t,on)=>'<button id="'+id+'" onclick="'+fn+'" title="'+t+'" style="width:34px;height:34px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center;opacity:'+(on?1:.4)+'">'+svg+'</button>';
return '<div style="position:sticky;top:0;z-index:8;margin:-14px -14px 0;height:56px;padding:0 14px;background:#012AAB;display:flex;align-items:center;justify-content:space-between"><div style="display:flex;gap:8px;align-items:center"><button class=bkc onclick="go(\'proj\')" style="width:36px;height:36px;border-radius:50%;background:#ffffff2e;color:#fff;padding:0;display:grid;place-items:center">'+ARR+'</button>'+ib('b-undo','undoEd()',UND,'Undo (batalkan)',HU.length)+ib('b-redo','redoEd()',REDO,'Redo (ulangi)',HR.length)+'</div><button onclick=toggleMode() title="Tampilkan atau sembunyikan foto dan teks pendukung" style="position:absolute;left:50%;transform:translateX(-50%);width:46px;height:32px;background:#ffffff2e;color:#fff;border-radius:16px;padding:0;display:grid;place-items:center">'+CHV(full?1:0)+'</button><button onclick=opNav() style="height:32px;padding:0 12px;background:#fff;color:#012AAB;font-weight:700;font-size:12px;border-radius:6px">DAFTAR NOMOR</button></div>'
+'<div id=qsec-star class=qsec>'+starHtml(p)+'</div>'+p.qs.map((q,i)=>'<div id="qsec'+i+'" class=qsec>'+qInner(p,i)+'</div>').join('')+'<div style="height:120px"></div><div class=fxo><button style="background:#fff;color:#666;border:1.5px solid #777" onclick=stepQ(-1)>SEBELUMNYA</button><button style="background:#ffc619;color:#111" onclick=stepQ(1)>SELANJUTNYA</button></div>'}
/* ---- prompt + tempel (tidak menimpa soal yang sudah terisi; kunci opsional dari AI) ---- */
const PROMPT4=['Ubah soal-soal yang saya berikan menjadi SATU teks dengan format berikut.','','1. Pisahkan setiap soal dengan simbol '+SQ+' .','2. Di dalam satu soal, urutannya: teks soal, opsi A, opsi B, opsi C, opsi D, opsi E, pembahasan, lalu kunci. Pisahkan masing-masing bagian dengan simbol '+SO+' .','3. Pembahasan boleh dikosongkan, tetapi simbol '+SO+' tetap ditulis supaya urutannya tidak bergeser.','4. Kunci (bagian terakhir): untuk soal yang hanya punya satu jawaban benar, tulis satu huruf A sampai E. Untuk soal yang setiap opsinya bernilai poin 1 sampai 5, tulis lima angka poin untuk opsi A sampai E secara berurutan, contoh 35142. Jika tidak yakin, kosongkan bagian kunci dan jangan menebak.','5. Untuk ganti baris di dalam teks, gunakan simbol '+SB+' . Jangan menekan Enter.','6. Tulis tanpa nomor soal dan tanpa huruf A, B, C, D, E di depan opsi.','7. Jangan mengakhiri teks soal dan teks opsi dengan tanda baca titik, koma, tanda tanya, atau tanda seru.','8. Jangan menambah penjelasan lain di luar format.','','Contoh:','Ibu kota Indonesia saat ini adalah'+SO+'Bandung'+SO+'Jakarta'+SO+'Surabaya'+SO+'Medan'+SO+'Makassar'+SO+'Jakarta adalah ibu kota negara saat ini'+SO+'B'+SQ+'Soal berikutnya'+SO+'opsi A'+SO+'opsi B'+SO+'opsi C'+SO+'opsi D'+SO+'opsi E'+SO+SO+'C'].join(NL);
function salinPrompt(){try{navigator.clipboard.writeText(S.prompt||PROMPT4)}catch(e){}toast('Prompt tersalin')}
function editPrompt(){modal('<b style="font-size:18px">Edit Prompt</b><p class=mu style="font-size:12px;line-height:1.5">Perubahan berlaku untuk semua salinan prompt berikutnya.</p><textarea id=pt rows=12 style="font-size:12px">'+esc(S.prompt||PROMPT4)+'</textarea><div style="display:flex;gap:8px;margin-top:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick="S.prompt=\'\';save();closeM();toast(\'Prompt dikembalikan\')">Bawaan</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=simpanPrompt()>Simpan</button></div>')}
function parseSoal(txt){return txt.split(SQ).map(s=>s.trim()).filter(Boolean).map(b=>{const sg=b.split(SO);return{t:unBR2(sg[0]),o:[1,2,3,4,5].map(k=>unBR2(sg[k])),pem:unBR2(sg[6]),key:unBR2(sg[7]),extra:sg.length>8}})}
const qFilled=q=>!!((q.t||'').trim()||q.img||(q.o||[]).some(o=>(o||'').trim())||(q.oi||[]).some(Boolean)||(q.pem||'').trim()||q.pimg);
const serialSoal=it=>[it.t].concat(it.o).concat([it.pem||'',it.key||'']).map(s=>(s||'').split(NL).join(SB)).join(SO).replace(new RegExp(SO+'+$'),'');
function fillFrom(i,txt){const p=P(ED),items=parseSoal(txt),err=[];let n=0,stop=-1;
for(let k=0;k<items.length;k++){const idx=i+k;if(idx>=p.qs.length){stop=k;err.push('Soal ke-'+(k+1)+' dari teks melebihi jumlah soal paket ('+p.qs.length+'), '+(items.length-k)+' soal sisanya tidak dimasukkan');break}
const q=p.qs[idx],no=numOf(p,idx),it=items[k];if(k>0&&qFilled(q)){stop=k;err.push('Nomor '+no+' sudah terisi, jadi tidak ditimpa. '+(items.length-k)+' soal sisanya tidak dimasukkan');break}
if(!it.t)err.push('Nomor '+no+': teks soal kosong');if(it.extra)err.push('Nomor '+no+': ada bagian berlebih setelah kunci, diabaikan');q.t=it.t;q.o=it.o;q.pem=it.pem;
const kt=(it.key||'').trim().toUpperCase();if(kt){const tp=qType(p,idx);if(tp!='TKP'){const j='ABCDE'.indexOf(kt);if(kt.length==1&&j>=0){q.a=j;q.w=[null,null,null,null,null]}else err.push('Nomor '+no+': kunci "'+kt+'" tidak valid (harus satu huruf A sampai E)')}else{const d=kt.replace(/[^1-5]/g,'');if(d.length==5&&[1,2,3,4,5].every(v=>d.split(String(v)).length==2)){q.w=d.split('').map(Number);q.a=null}else err.push('Nomor '+no+': poin "'+kt+'" tidak valid (harus 5 angka 1 sampai 5, masing-masing sekali)')}}n++}
if(stop>=0){const rest=items.slice(stop).map(serialSoal).join(SQ);try{navigator.clipboard.writeText(rest)}catch(e){}err.push('Sisa soal sudah disalin ke papan klip. Tempel di nomor kosong lain, lalu tekan Atur')}
save();const y=window.scrollY||0;render();scrollTo(0,y);toast(n+' soal terisi mulai nomor '+numOf(p,i));if(err.length)errBox(err);return n}
const _ff24=fillFrom;fillFrom=function(i,t){const c=parseSoal(t).length,idx=[];for(let k=0;k<c&&i+k<P(ED).qs.length;k++)idx.push(i+k);return withHist(idx,()=>_ff24(i,t))};
/* ---- tampilan siswa ---- */
function descStd(p){const a=(S.me.std||'nasional')=='afirmasi',t=p.type;let L=[];if(!a)L=(t=='SKD'?['TWK','TIU','TKP']:[t]).map(k=>k+': '+TH[k]);else if(t=='SKD')L=['Total nilai SKD: minimal 281','TIU: minimal 55'];else if(t=='TIU')L=['TIU: minimal 55'];
return '<div style="margin-top:14px;border-top:1px solid var(--bd);padding-top:12px"><div style="font-size:11.5px;color:var(--mu)">Kamu mendaftar sebagai</div><div style="font-size:13px;font-weight:600">'+(a?'Afirmasi':'Nasional')+'</div>'+(L.length?'<div style="font-size:11.5px;color:var(--mu);margin-top:8px">Ambang batas</div><div style="font-size:13px;font-weight:600;line-height:1.6">'+L.join('<br>')+'</div>':'')+'<div style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:11.5px;color:var(--mu);line-height:1.5">'+INFO+'<span>Kamu dapat mengganti status ini di menu Profil.</span></div></div>'}
function desc(id){const p=P(id);sheet('<div style="display:flex;align-items:center;gap:10px"><div class=th style="width:72px;height:48px;background-image:url('+(p.thumb||'')+')"></div><b style="font-size:15px">'+esc(p.name)+'</b></div><div style="font-size:13px;line-height:1.6;font-weight:400;color:var(--mu);margin:12px 0;white-space:pre-line">'+(esc(p.desc)||'Kosong')+'</div>'+descStd(p))}
const fixPrice=h=>h.replace(/<s class=mu>([^<]*)<\/s> <b>([^<]*)<\/b>/g,(m,a,b)=>'<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><s class=mu style="font-size:12px">'+a+'</s><b style="color:#16a34a">'+b+'</b></div>');
function srch(){const ps=Q.trim()?hit2(vis(),Q):vis().slice(0,PN());let h=lst3(ps);if(OP)h=addDots(h);$('#ls').innerHTML=fixPrice(h);const l=$('#lm');if(l)l.style.display=Q.trim()?'none':'block'}
function list(){srch()}
const _hm24=home;home=function(){return fixPrice(_hm24())};
const _kt25=kat;kat=function(){return fixPrice(_kt25())};
const _sm24=semua;semua=function(){return fixPrice(_sm24()).replace("$('#sl').innerHTML=lst3(hit(vis(),Q2))",()=>"$('#sl').innerHTML=fixPrice(lst3(hit(vis(),Q2)))")};
const payLogo=(k,mt)=>{const lg=S.pay&&S.pay[k];return lg?'<div style="display:grid;place-items:center;margin:'+mt+'"><img src="'+lg+'" style="width:160px;height:80px;object-fit:contain"></div>':''};
const fixSim=h=>{h=h.replace('>Nominal:</span>','>HARGA:</span>');
if(V==='va'){const lg=payLogo(BANK,'22px auto 0');if(lg)h=h.replace(/<div style="text-align:center;font-weight:800;font-size:15px;margin-top:22px">[^<]*<\/div>/,lg)}
if(V==='qris'){h=h.replace('<div id=qr-slot',payLogo('QRIS','20px auto -8px')+'<div id=qr-slot')}
const re=/<div style="text-align:center;margin:12px 0"><span([^>]*)onclick=simBayar\(\)>[^<]*<\/span><\/div>/;return OP?h.replace(re,(m,a)=>'<div style="text-align:center;margin:12px 0"><span'+a+'onclick=simBayar()>Mode operator: tandai pembayaran berhasil (uji coba)</span></div>'):h.replace(re,'')};
const _qr25=qris;qris=function(){return fixSim(_qr25())};
const _va24=va;va=function(){return fixSim(_va24())};
/* ---- menu operator: Review ---- */
function pkMenu(id){const p=P(id),it=(t,f,c)=>'<div onclick="closeM();'+f+'" style="padding:14px 4px;border-bottom:1px solid var(--bd);font-size:14px;cursor:pointer;'+(c?'color:'+c:'')+'">'+t+'</div>',ed=it('Edit',"ED="+id+";BV='star';go('bank')"),rv=it('Review','mulai('+id+')');
sheet('<b style="font-size:16px">'+esc(p.name)+'</b>'+(p.pub?ed+rv+it('Simpan ke draf','toDraft('+id+')')+it(p.hidden?'Tayangkan':'Sembunyikan','hide('+id+')'):it('Publish','publish('+id+')')+ed+rv+it('Hapus','hapusPk('+id+')','#e11d48')))}
function opCard(id){const p=P(id),it=(t,f)=>'<div onclick="closeM();'+f+'" style="padding:14px 4px;border-bottom:1px solid var(--bd);cursor:pointer">'+t+'</div>';sheet('<b style="font-size:16px">'+esc(p.name)+'</b>'+it('Review','mulai('+id+')')+it('Simpan ke draf','toDraft('+id+')')+it('Edit',"ED="+id+";BV='star';go('bank')"))}
/* ===== REVISI 24B: MENU PROMO (DAFTAR PROMO, TOTAL PENGHASILAN, STATISTIK) ===== */
const _sh24=starHtml;starHtml=function(p){const m='<div style="font-size:12px;color:var(--mu);margin:18px 0 6px">Tanggal kadaluarsa</div>',f='<div style="font-size:12px;color:var(--mu);margin:18px 0 6px">Pendapatan kreator dari promo (wajib diisi jika promo nyala)</div><div style="display:flex;align-items:center;border:1px solid var(--bd);border-radius:6px;padding-left:12px"><b style="margin-right:8px">Rp</b><input type=number min=0 value="'+(p.promoEarn||'')+'" oninput="P(ED).promoEarn=+this.value;save()" style="border:0;padding-left:0"></div><div class=mu style="font-size:11.5px;margin-top:6px">Dipakai untuk menghitung total penghasilan kreator setiap kali kode promo dipakai.</div>';return _sh24(p).replace(m,()=>f+m)};
const _tp24=togglePromo;togglePromo=function(){const p=P(ED);if(!p.promoOn&&!(p.promoEarn>0))return toast('Isi pendapatan kreator dulu');_tp24()};
const PRC=c=>S.promos.find(x=>x.code===c),usesOf=c=>(S.promoUse||[]).filter(u=>u.code===c),unpaid=c=>{const x=PRC(c),m=(x&&x.paidAt)||0;return usesOf(c).filter(u=>u.t>m)},pname=id=>(P(id)||{name:'(paket dihapus)'}).name,mKey=t=>{const d=new Date(t);return d.getFullYear()*12+d.getMonth()},mLbl=k=>new Date(Math.floor(k/12),k%12,1).toLocaleDateString('id-ID',{month:'long',year:'numeric'}),dLbl=t=>new Date(t).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
const ask=(t,b,y,fn,dg)=>modal('<b style="font-size:18px">'+t+'</b><p style="line-height:1.6">'+b+'</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:'+(dg?'#e11d48':'var(--ac)')+';color:#fff;font-weight:700" onclick="'+fn+'">'+y+'</button></div>');
const _pd24=paid;paid=function(){const pr=PROMO,p=CUR?P(CUR):null;_pd24();if(pr&&p&&!p.sim){S.promoUse=S.promoUse||[];S.promoUse.push({code:String(pr.code).toUpperCase(),t:Date.now(),pid:p.id,earn:p.promoEarn||0});save()}};
promo=function(){return back()+'<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin:4px 0 16px"><div style="font-size:20px;font-weight:800">Daftar Promo</div><button onclick="promoForm()" style="height:40px;padding:0 14px;background:#346ef3;color:#fff;font-weight:700;display:flex;align-items:center;gap:6px;border-radius:8px">'+PLS+' Tambah Promo</button></div>'
+(S.promos.length?S.promos.map(x=>'<div class=row style="position:relative;align-items:center;gap:12px;border:1px solid var(--bd);border-radius:10px;padding:14px;margin:12px 0"><div style="flex:1;min-width:0"><b style="font-size:15px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(x.name)+'</b><span style="display:inline-block;margin-top:6px;padding:3px 10px;border-radius:6px;background:var(--cd);font-family:monospace;letter-spacing:2px;font-weight:700;font-size:13px">'+esc(x.code)+'</span>'+(x.on?'':' <span class=mu style="font-size:11px">nonaktif</span>')+(x.email&&!x.ver?' <span style="font-size:11px;color:#d97706">email belum diverifikasi</span>':'')+'</div><div style="display:flex;flex-direction:column;align-items:center;gap:6px"><span onclick="prMenu(\''+x.code+'\')" style="cursor:pointer;padding:4px;color:var(--mu)">'+DOT+'</span><span onclick="prToggle(\''+x.code+'\')" style="cursor:pointer;display:grid">'+(x.on?CKN:CKO)+'</span></div></div>').join(''):'<div style="text-align:center;padding:50px 20px;color:var(--mu);font-size:13px;line-height:1.6">Belum ada kode promo.<br>Tekan Tambah Promo untuk membuat yang pertama.</div>')};
function promoForm(c){const x=c?PRC(c):null,v=k=>esc(x?x[k]:'');modal('<b style="font-size:18px">'+(x?'Edit Promo':'Tambah Promo')+'</b><input id=pf1 placeholder="Nama kreator" value="'+v('name')+'" style="margin-top:14px"><input id=pf2 placeholder="Kode promo (6-8 huruf atau angka)" maxlength=8 value="'+v('code')+'" style="margin-top:10px;text-transform:uppercase"><input id=pf3 type=email placeholder="Alamat Gmail" value="'+v('email')+'" style="margin-top:10px"><input id=pf4 placeholder="Nomor WhatsApp" value="'+v('wa')+'" style="margin-top:10px"><textarea id=pf5 rows=6 placeholder="Catatan bebas tanpa format: nama TikTok, nomor rekening, alamat, atau apa pun yang penting" style="margin-top:10px">'+v('note')+'</textarea><div id=pfe class=er style="font-size:12px;min-height:16px;margin-top:6px"></div><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batal</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="promoSave(\''+(x?x.code:'')+'\')">'+(x?'Simpan':'Buat Promo')+'</button></div>')}
function promoSave(old){const n=$('#pf1').value.trim(),c=$('#pf2').value.trim().toUpperCase(),em=$('#pf3').value.trim(),wa=$('#pf4').value.trim(),nt=$('#pf5').value,er=m=>{$('#pfe').textContent=m};
if(!n)return er('Nama kreator wajib diisi');if(!/^[A-Z0-9]{6,8}$/.test(c))return er('Kode promo harus 6 sampai 8 huruf atau angka');if(S.promos.some(x=>x.code===c&&x.code!==old))return er('Kode ini sudah dipakai');if(em&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return er('Format alamat Gmail tidak valid');
if(old){const x=PRC(old);if(em!==x.email)x.ver=false;x.name=n;x.email=em;x.wa=wa;x.note=nt;if(c!==old){(S.promoUse||[]).forEach(u=>{if(u.code===old)u.code=c});(S.payouts||[]).forEach(u=>{if(u.code===old)u.code=c});x.code=c}}else S.promos.unshift({name:n,code:c,email:em,wa:wa,note:nt,on:1,ver:false,paidAt:0});
save();closeM();render();toast(old?'Promo disimpan':'Promo dibuat dan langsung aktif')}
function prMenu(c){const x=PRC(c),it=(t,f,cl)=>'<div onclick="closeM();'+f+'" style="padding:14px 4px;border-bottom:1px solid var(--bd);font-size:14px;cursor:pointer;'+(cl?'color:'+cl:'')+'">'+t+'</div>';
sheet('<b style="font-size:16px">'+esc(x.name)+'</b>'+it('Edit',"promoForm('"+c+"')")+it('Lihat total penghasilan',"prEarn('"+c+"')")+it('Statistik',"prStat('"+c+"')")+(x.email&&!x.ver?it('Verifikasi email',"pvStart('"+c+"')"):'')+it('Hapus',"prDel('"+c+"')",'#e11d48'))}
function prToggle(c){const x=PRC(c);ask(x.on?'Matikan promo '+c+'?':'Aktifkan promo '+c+'?',x.on?'Kode promo akan nonaktif dan tidak berlaku untuk pembelian baru.':'Kode promo akan aktif dan langsung berlaku di paket yang promonya menyala.',x.on?'Ya, matikan':'Ya, aktifkan',"prDoToggle('"+c+"')")}
function prDoToggle(c){const x=PRC(c);x.on=!x.on;save();closeM();render()}
function prDel(c){ask('Hapus promo '+c+'?','Kode promo ini akan dihapus permanen. Data pemakaiannya tetap tersimpan.','Ya, hapus',"prDoDel('"+c+"')",1)}
function prDoDel(c){S.promos=S.promos.filter(x=>x.code!==c);save();closeM();render()}
/* ---- total penghasilan (kalkulator) ---- */
function earnBody(c){const u=unpaid(c),g={};u.forEach(r=>{g[r.pid]=g[r.pid]||{n:0,s:0};g[r.pid].n++;g[r.pid].s+=r.earn||0});const tot=u.reduce((a,r)=>a+(r.earn||0),0),ks=Object.keys(g);return{tot,n:u.length,html:ks.length?ks.map(id=>'<div style="display:flex;justify-content:space-between;gap:10px;padding:12px 4px;border-bottom:1px solid var(--bd);font-size:13px"><div style="min-width:0"><b style="display:block">'+esc(pname(+id))+'</b><span class=mu style="font-size:12px">'+g[id].n+' orang</span></div><b style="white-space:nowrap">'+rp(g[id].s)+'</b></div>').join(''):'<div class=mu style="padding:24px 0;text-align:center;font-size:13px">Belum ada pemakaian kode yang perlu dibayar</div>'}}
function prEarn(c){const x=PRC(c),b=earnBody(c);sheet('<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><b style="font-size:16px">Total Penghasilan</b><div class=mu style="font-size:12px">'+esc(x.name)+' \u2022 '+x.code+'</div></div><div style="text-align:right"><div class=mu style="font-size:11px">Yang harus dibayar</div><b id=prt style="font-size:20px;color:#16a34a">'+rp(b.tot)+'</b></div></div><div style="display:flex;justify-content:flex-end;margin:10px 0 4px"><button id=prb '+(b.tot?'':'disabled')+' onclick="prPaid(\''+c+'\')" style="height:36px;padding:0 14px;background:#346ef3;color:#fff;font-weight:700;font-size:12.5px;border-radius:8px">Saya telah bayar kreator</button></div><div id=prl style="max-height:45vh;overflow:auto">'+b.html+'</div>');
const iv=setInterval(()=>{if(!document.getElementById('prt')){clearInterval(iv);return}const n=earnBody(c),a=$('#prt'),l=$('#prl'),bt=$('#prb');if(a)a.textContent=rp(n.tot);if(l)l.innerHTML=n.html;if(bt)bt.disabled=!n.tot},3000)}
function prPaid(c){const b=earnBody(c);if(!b.tot)return;ask('Sudah transfer ke kreator?','Total '+rp(b.tot)+' untuk '+esc(PRC(c).name)+' akan ditandai sudah dibayar. Angka dan daftar penghasilan kembali ke nol dan mulai dihitung dari awal.','Ya, sudah saya bayar',"prDoPaid('"+c+"')")}
function prDoPaid(c){const x=PRC(c),u=unpaid(c),amt=u.reduce((a,r)=>a+(r.earn||0),0);x.paidAt=Date.now();S.payouts=S.payouts||[];S.payouts.push({code:c,t:x.paidAt,amount:amt,n:u.length});save();toast('Total penghasilan kembali ke nol');prEarn(c)}
/* ---- statistik (rekap) ---- */
function statHtml(c){const u=usesOf(c).slice().sort((a,b)=>b.t-a.t),sec=t=>'<div style="margin:18px 0 6px;font-size:12px;font-weight:700;color:var(--mu)">'+t+'</div>',row=(a,b,d)=>'<div style="display:flex;justify-content:space-between;gap:10px;padding:10px 4px;border-bottom:1px solid var(--bd);font-size:13px"><span style="min-width:0">'+a+'</span><span style="white-space:nowrap;text-align:right">'+b+(d?'<br><span class=mu style="font-size:11px">'+d+'</span>':'')+'</span></div>',none='<div class=mu style="font-size:13px;padding:8px 4px">Belum ada pemakaian</div>';
const mo={};u.forEach(r=>{const k=mKey(r.t);mo[k]=(mo[k]||0)+1});mo[mKey(Date.now())]=mo[mKey(Date.now())]||0;let acc=0;const mrows=Object.keys(mo).map(Number).sort((a,b)=>a-b).map(k=>{acc+=mo[k];return{k,n:mo[k],acc}}).reverse();
const bp={},lg={};u.forEach(r=>{bp[r.pid]=(bp[r.pid]||0)+1;const d=new Date(r.t),k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+'|'+r.pid;lg[k]=lg[k]||{t:r.t,pid:r.pid,n:0};lg[k].n++});
return{total:u.length,html:sec('REKAP PER BULAN')+mrows.map(m=>row(mLbl(m.k),m.n+' orang','akumulatif '+m.acc+' orang')).join('')+sec('PER PAKET (SELAMA INI)')+(Object.keys(bp).length?Object.keys(bp).map(id=>row(esc(pname(+id)),bp[id]+' orang')).join(''):none)+sec('RIWAYAT PEMAKAIAN')+(Object.keys(lg).length?Object.keys(lg).map(k=>lg[k]).sort((a,b)=>b.t-a.t).map(l=>row(dLbl(l.t)+' \u2022 '+esc(pname(l.pid)),l.n+' orang')).join(''):none)}}
function prStat(c){const x=PRC(c),s=statHtml(c);sheet('<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><b style="font-size:16px">Statistik</b><div class=mu style="font-size:12px">'+esc(x.name)+' \u2022 '+x.code+'</div></div><div style="text-align:right"><div class=mu style="font-size:11px">Total pengguna yang pakai</div><b id=pstt style="font-size:20px;color:#346ef3">'+s.total+'</b></div></div><div id=pstl style="max-height:55vh;overflow:auto">'+s.html+'</div>');
const iv=setInterval(()=>{if(!document.getElementById('pstt')){clearInterval(iv);return}const n=statHtml(c),a=$('#pstt'),l=$('#pstl');if(a)a.textContent=n.total;if(l)l.innerHTML=n.html},3000)}
/* ---- verifikasi email (opsional, dikirim manual oleh operator) ---- */
function pvMsg(x){return 'Halo '+x.name+', kode verifikasi promo Web Kedinasan kamu: '+x.v.code+'. Berlaku 15 menit. Sebutkan kode ini ke admin untuk memastikan email ini aktif. Jangan bagikan ke orang lain.'}
function pvStart(c){const x=PRC(c);x.v={code:String(Math.floor(100000+Math.random()*900000)),exp:Date.now()+15*60000,tries:0};save();
modal('<b style="font-size:18px">Verifikasi Email Kreator</b><p class=mu style="font-size:12.5px;line-height:1.6">Kirim kode ini ke <b>'+esc(x.email)+'</b>, lalu minta kreator menyebutkan kode yang mereka terima.</p><div style="text-align:center;font-size:28px;font-weight:800;letter-spacing:6px;margin:8px 0">'+x.v.code+'</div><div class=mu style="text-align:center;font-size:11px">Berlaku 15 menit</div><div style="display:flex;gap:8px;margin-top:12px"><button style="flex:1;height:40px;background:var(--cd);color:var(--tx);font-size:12.5px" onclick="pvCopy(\''+c+'\')">Salin pesan</button><a href="mailto:'+x.email+'?subject='+encodeURIComponent('Kode verifikasi promo Web Kedinasan')+'&body='+encodeURIComponent(pvMsg(x))+'" target="_blank" style="flex:1;height:40px;background:var(--ac);color:#fff;font-size:12.5px;font-weight:700;border-radius:6px;display:grid;place-items:center;text-decoration:none">Buka Gmail</a></div><input id=pvk placeholder="Kode dari kreator" maxlength=6 inputmode=numeric style="margin-top:14px"><div id=pve class=er style="font-size:12px;min-height:16px;margin-top:6px"></div><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Nanti</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="pvCheck(\''+c+'\')">Verifikasi</button></div>')}
function pvCopy(c){try{navigator.clipboard.writeText(pvMsg(PRC(c)))}catch(e){}toast('Pesan tersalin')}
function pvCheck(c){const x=PRC(c),v=$('#pvk').value.trim(),er=m=>{$('#pve').textContent=m};if(!x.v)return er('Minta kode baru');if(Date.now()>x.v.exp)return er('Kode kedaluwarsa. Tutup lalu pilih Verifikasi email lagi');if(v!==x.v.code){x.v.tries++;save();if(x.v.tries>=5){closeM();return pvStart(c)}return er('Kode salah')}x.ver=true;x.v=null;save();closeM();render();toast('Email terverifikasi')}
/* ===== REVISI 25 (TAHAP 1): ULANGI, PERCOBAAN, DESKRIPSI, FOTO BAWAAN ===== */
const WORD_ULANG='ULANGI',ORD=['','pertama','kedua','ketiga','keempat','kelima','keenam','ketujuh','kedelapan','kesembilan','kesepuluh'];
const DEFPIC='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 60"><rect width="40" height="60" fill="#cfd6e4"/><circle cx="20" cy="22" r="8" fill="#9aa6bd"/><path d="M4 60c0-14 7-22 16-22s16 8 16 22z" fill="#9aa6bd"/></svg>');
const noPic=h=>h.split('background-image:url()').join('background-image:url('+DEFPIC+')');
/* tombol MULAI berubah setelah paket pernah dikerjakan */
const _pk25=paket;paket=function(){return _pk25().replace(/onclick=mulai\((\d+)\)>MULAI</g,(m,id)=>'onclick=mulai('+id+')>'+(S.res[id]?WORD_ULANG:'MULAI')+'<')};
/* hitung percobaan */
const _fn25=finish;finish=function(){const id=E?E.id:null,old=id!=null?S.res[id]:null;_fn25();if(id!=null&&S.res[id]&&!S.res[id].n){S.res[id].n=(old?(old.n||1):0)+1;save();render()}};
const _rs25=result;result=function(){const r=S.res[CUR],n=r&&r.n||1;let h=noPic(_rs25());if(n>1)h=h.replace('</div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:24px','</div><div style="text-align:center;font-size:12.5px;font-weight:600;color:var(--mu);margin-top:12px">Pengerjaan '+(ORD[n]||'ke-'+n)+'</div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:12px');return h};
/* profil */
const _pf25=profil;profil=function(){return noPic(_pf25()).replace('PAS FOTO UJIAN','FOTO ANDA').replace(/Wajahmu tampil di kartu hasil[^<]*Ganti kapan saja/,'Foto ini muncul di halaman hasil ujian. Ganti kapan saja')};
editFoto=function(){crop(2/3,400,'jpeg','Potong Foto 4x6',d=>{S.me.pic=d;const u=S.users.find(x=>x.e==S.me.e);if(u)u.pic=d;save();render()})};
/* deskripsi: ambang batas di bawah judul, ikon i kecil */
const INFO2='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#346ef3" stroke-width="2" stroke-linecap="round" style="flex:none"><circle cx="12" cy="12" r="10"/><path d="M12 11v5"/><circle cx="12" cy="7.5" r="1" fill="#346ef3" stroke="none"/></svg>';
descStd=function(p){const a=(S.me.std||'nasional')=='afirmasi',t=p.type;let L=[];if(!a)L=(t=='SKD'?['TWK','TIU','TKP']:[t]).map(k=>k+': '+TH[k]);else if(t=='SKD')L=['Total nilai SKD: minimal 281','TIU: minimal 55'];else if(t=='TIU')L=['TIU: minimal 55'];
return '<div style="margin-top:6px;font-size:11.5px;color:var(--mu)">Ambang batas ('+(a?'Afirmasi':'Nasional')+')</div><div style="font-size:12.5px;font-weight:700;line-height:1.5">'+(L.length?L.join('<br>'):'<span style="font-weight:400;color:var(--mu)">Tidak ada</span>')+'</div><div style="display:flex;align-items:flex-start;gap:6px;margin-top:8px;font-size:11px;color:var(--mu);line-height:1.4">'+INFO2+'<span>Kamu dapat mengganti status ini di menu Profil.</span></div>'};
desc=function(id){const p=P(id);sheet('<div style="display:flex;gap:12px;align-items:flex-start"><div class=th style="width:96px;height:64px;flex:none;background-image:url('+(p.thumb||'')+')"></div><div style="flex:1;min-width:0"><b style="font-size:15px;display:block;line-height:1.3">'+esc(p.name)+'</b>'+descStd(p)+'</div></div><div style="font-size:13px;line-height:1.6;color:var(--mu);margin:16px 0 8px;white-space:pre-line;border-top:1px solid var(--bd);padding-top:12px">'+(esc(p.desc)||'Kosong')+'</div>')};
/* ===== REVISI 26 (TAHAP 2): OPERATOR ===== */
logoClick=function(){if(OP)return crop(3.3,660,'png','Potong Logo (area 3,3:1)',d=>{S.logo=d;save();render()});const n=Date.now();CL=CL.filter(t=>n-t<4000);CL.push(n);if(CL.length>=12){CL=[];opLoginForm()}};
const _olf=opLoginForm;opLoginForm=function(){_olf();const m=$('#m'),ov=m.querySelector('.ov'),md=m.querySelector('.mod');if(ov)ov.removeAttribute('onclick');if(md)md.insertAdjacentHTML('afterbegin','<span onclick=closeM() title="Tutup" style="position:absolute;top:10px;right:10px;cursor:pointer;padding:6px;color:var(--mu);display:grid">'+SVG('<path d="M6 6l12 12M18 6L6 18"/>',22)+'</span>')};
/* ganti nama operator tanpa batas */
const _ne26=nameEdit;nameEdit=function(){if(!OP)return _ne26();modal('<b style="font-size:18px">Ubah Nama Lengkap</b><p class=mu style="font-size:13px;line-height:1.6">Mode operator: tanpa batas pergantian.</p><input id=nn2 maxlength=40 value="'+esc(S.me.n)+'" style="margin-bottom:14px"><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick=saveName()>Simpan Nama</button>')};
const _sn26=saveName;saveName=function(){if(!OP)return _sn26();const v=$('#nn2').value.trim();if(!v)return;S.me.n=v;const u=S.users.find(x=>x.e==S.me.e);if(u)u.n=v;save();closeM();render()};
/* beli paket tanpa bayar (operator, simulasi uji coba) */
function opLunas(){BANK='simulasi operator';paid()}
const _by26=buy;buy=function(){const h=_by26(),p=P(CUR);if(!OP||S.owned[p.id]||p.sim)return h;return h.replace('BELI PAKET</button><p style="margin:18px 12px','BELI PAKET</button><div style="margin:12px 10px 0;text-align:center"><span onclick=opLunas() style="font-size:11.5px;color:var(--mu);text-decoration:underline;cursor:pointer">Mode operator: anggap paket terbayar lunas (simulasi uji coba)</span></div><p style="margin:18px 12px')};
/* zoom gambar di editor soal */
const zbtn='width:30px;height:30px;background:var(--cd);color:var(--tx);font-weight:800;font-size:16px;padding:0';
const zbar=()=>S.imzHide?'<div style="text-align:right;padding:6px 0"><span onclick=imzHide() style="font-size:11.5px;color:#346ef3;cursor:pointer;font-weight:700">Tampilkan zoom gambar</span></div>':'<div style="position:sticky;top:56px;z-index:7;background:var(--bg);display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--bd);font-size:12px"><b>Ukuran gambar</b><button onclick=imzSet(-1) style="'+zbtn+'">\u2212</button><b id=imzn style="min-width:20px;text-align:center;font-size:14px">'+(S.imz||5)+'</b><button onclick=imzSet(1) style="'+zbtn+'">+</button><span onclick=imzHide() style="margin-left:auto;color:var(--mu);cursor:pointer">Sembunyikan</span></div>';
function imzSet(d){S.imz=Math.min(10,Math.max(1,(S.imz||5)+d));save();const e=document.querySelector('.edz'),n=document.getElementById('imzn');if(e)e.style.setProperty('--iz',S.imz);if(n)n.textContent=S.imz}
function imzHide(){S.imzHide=!S.imzHide;save();const y=window.scrollY||0;render();scrollTo(0,y)}
const _bk26=bank;bank=function(){const h=_bk26();if(!P(ED))return h;return'<div class=edz style="--iz:'+(S.imz||5)+'">'+h.replace('<div id=qsec-star',zbar()+'<div id=qsec-star')+'</div>'};
/* undo/redo juga untuk kolom Halaman Utama Paket (judul, deskripsi, harga) */
const snapX=i=>i==='p'?JSON.stringify(['name','desc','price','promoPrice','promoEarn'].reduce((o,k)=>(o[k]=P(ED)[k],o),{})):snapQ(i);
hflush=function(){if(TS.e&&TS.e.ch[0].a===null)TS.e.ch[0].a=snapX(TS.e.ch[0].i);TS={i:-1,t:0,e:null}};
tmark=function(i){hReset();const n=Date.now();if(TS.e&&TS.i===i&&n-TS.t<1500&&HU[HU.length-1]===TS.e){TS.t=n;return}hflush();const e={ch:[{i,b:snapX(i),a:null}]};HU.push(e);if(HU.length>60)HU.shift();HR=[];TS={i,t:n,e};hbtn()};
applyH=function(e,k){e.ch.forEach(c=>{if(c.i==='p')Object.assign(P(ED),JSON.parse(c[k]));else P(ED).qs[c.i]=JSON.parse(c[k])});save();const x=e.ch[0].i;if(e.ch.length==1&&x!=='p')refreshQ(x);else{const y=window.scrollY||0;render();scrollTo(0,y)}};
const _sh26=starHtml;starHtml=function(p){return _sh26(p).split('oninput="P(ED).').join('oninput="tmark(\'p\');P(ED).')};
/* ===== REVISI 27: ZOOM GAMBAR PER SOAL (BERANTAI KE BAWAH), AMBANG BATAS SEJAJAR ===== */
const zEff=(p,i)=>{let v=10;for(let j=0;j<=i;j++)if(p.zm&&p.zm[j]!=null)v=p.zm[j];return v};
const zGet=(p,i,f)=>{const q=p.qs[i];const v=f=='q'?q.zq:f=='p'?q.zp:(q.zo||[])[+f.slice(1)];return v!=null?v:zEff(p,i)};
const zbS='width:26px;height:26px;background:var(--cd);color:var(--tx);font-weight:800;font-size:15px;padding:0';
const zctl=(i,f,z)=>'<span style="display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:var(--mu)"><button onclick="zImgSet('+i+',\''+f+'\',-1)" title="Perkecil gambar" style="'+zbS+'">\u2212</button><b id="zn'+i+'_'+f+'" style="min-width:16px;text-align:center;color:var(--tx);font-size:13px">'+z+'</b><button onclick="zImgSet('+i+',\''+f+'\',1)" title="Perbesar gambar" style="'+zbS+'">+</button></span>';
function zImgSet(i,f,d){const p=P(ED),q=p.qs[i],v=Math.min(10,Math.max(1,zGet(p,i,f)+d));if(f=='q')q.zq=v;else if(f=='p')q.zp=v;else{q.zo=q.zo||[];q.zo[+f.slice(1)]=v}save();const im=document.getElementById('zi'+i+'_'+f),n=document.getElementById('zn'+i+'_'+f);if(im)im.style.maxWidth=(v*10)+'%';if(n)n.textContent=v}
const zrow=i=>'';
/* zoom global per soal dihapus: zoom kini per gambar (soal, tiap opsi, pembahasan) */
bank=function(){return _bk26()};
/* ambang batas: titik dua sejajar */
descStd=function(p){const a=(S.me.std||'nasional')=='afirmasi',t=p.type;let L=[];if(!a)L=(t=='SKD'?['TWK','TIU','TKP']:[t]).map(k=>[k,TH[k]]);else if(t=='SKD')L=[['Total nilai SKD','minimal 281'],['TIU','minimal 55']];else if(t=='TIU')L=[['TIU','minimal 55']];
return '<div style="margin-top:6px;font-size:11.5px;color:var(--mu)">Ambang batas ('+(a?'Afirmasi':'Nasional')+')</div>'+(L.length?'<div style="display:grid;grid-template-columns:max-content 12px auto;font-size:12.5px;font-weight:700;line-height:1.6">'+L.map(x=>'<span>'+x[0]+'</span><span>:</span><span>'+x[1]+'</span>').join('')+'</div>':'<div style="font-size:12.5px;color:var(--mu)">Tidak ada</div>')+'<div style="display:flex;align-items:flex-start;gap:6px;margin-top:8px;font-size:11px;color:var(--mu);line-height:1.4">'+INFO2+'<span>Kamu dapat mengganti status ini di menu Profil.</span></div>'};
/* ===== REVISI 29: TAMPILAN LAPTOP HALAMAN UJIAN (layar >= 1100px, HP tidak berubah) ===== */
const KD={'Nasionalisme':'mengukur rasa cinta tanah air dan semangat kebangsaan','Integritas':'mengukur kejujuran, tanggung jawab, dan sikap antikorupsi','Bela Negara':'mengukur kesiapan menjaga dan membela negara','Pilar Negara':'mengukur pemahaman Pancasila, UUD 1945, NKRI, dan Bhinneka Tunggal Ika','Bahasa Indonesia':'mengukur kemampuan berbahasa Indonesia yang baik dan benar','Verbal (Analogi)':'melatih menemukan hubungan antar kata','Verbal (Silogisme)':'melatih menarik kesimpulan dari premis','Verbal (Analitis)':'melatih penalaran logis dari informasi','Numerik (Berhitung)':'melatih operasi hitung dengan cepat dan tepat','Numerik (Deret Angka)':'melatih mencari pola deret angka','Numerik (Perbandingan)':'melatih membandingkan dua besaran','Numerik (Soal Cerita)':'melatih mengubah cerita menjadi hitungan','Figural (Analogi)':'melatih mengenali pola hubungan gambar','Figural (Ketidaksamaan)':'melatih menemukan gambar yang berbeda','Figural (Serial)':'melatih mengenali urutan pola gambar','Pelayanan Publik':'mengukur sikap melayani masyarakat dengan baik','Jejaring Kerja':'mengukur kemampuan bekerja sama dan membangun relasi','Sosial Budaya':'mengukur kepekaan terhadap keberagaman','Teknologi Informasi dan Komunikasi':'mengukur pemanfaatan teknologi dalam bekerja','Profesionalisme':'mengukur sikap kerja yang profesional dan bertanggung jawab','Anti Radikalisme':'mengukur sikap menolak paham radikal'};
const wide=()=>matchMedia('(min-width:700px) and (orientation:landscape)').matches;
function lap(){try{const x=document.querySelector('.exw #tm'),on=!!(x&&E&&wide());document.body.classList.toggle('lapx',on);const a=document.querySelector('.exw>div:first-child>button:not(#bk)');if(a)a.textContent=on?'AKHIRI UJIAN':'AKHIRI';if(!on||document.querySelector('.kisi'))return;const t=qType(P(E.id),E.i);document.querySelector('.exw>div:nth-child(2)').insertAdjacentHTML('beforeend','<div class=kisi>Kisi-kisi: '+KISI[t].map(k=>'<b>'+k+'</b>: '+KD[k]).join(' / ')+'</div>');x.parentNode.insertAdjacentHTML('beforeend','<div class="tgl on" onclick="this.classList.toggle(\'on\')"><i></i></div>')}catch(e){}}
const _rd29=render;render=function(){_rd29();lap()};
addEventListener('resize',()=>{clearTimeout(window._rz);window._rz=setTimeout(lap,150)});
/* ===== REVISI 30: LAPTOP - NAVIGASI 6 KOLOM, KISI 2 BARIS, TIMER BESAR, MODE FOKUS ===== */
const KD2={"Nasionalisme":"Mengukur rasa cinta tanah air, semangat kebangsaan, dan kesediaan mengutamakan kepentingan bangsa di atas kepentingan pribadi atau golongan / menilai kesadaran peserta dalam menjaga persatuan dan keutuhan negara.","Integritas":"Menguji kejujuran, tanggung jawab, dan konsistensi dalam bertindak ketika menghadapi dilema / menilai kemampuan peserta menghindari tindakan korupsi dan penyalahgunaan wewenang.","Bela Negara":"Mengukur pemahaman mengenai hak dan kewajiban warga negara dalam menjaga negara serta menghadapi ancaman militer maupun nonmiliter.","Pilar Negara":"Menguji pemahaman tentang Pancasila, UUD 1945, NKRI, dan Bhinneka Tunggal Ika / menilai kemampuan menerapkan nilai-nilai kebangsaan dalam kehidupan sehari-hari / mengukur pemahaman peserta terhadap dasar kehidupan bernegara.","Bahasa Indonesia":"Mengukur kemampuan menggunakan bahasa Indonesia yang baik dan benar, meliputi ejaan, kalimat efektif, dan pemahaman isi bacaan.","Kemampuan Verbal: Analogi":"Menguji kemampuan memahami hubungan antara dua kata dan menerapkannya pada pasangan kata lainnya.","Kemampuan Verbal: Silogisme":"Mengukur kemampuan menarik kesimpulan secara logis berdasarkan dua atau lebih pernyataan / menilai ketepatan peserta dalam menggunakan informasi untuk menentukan kesimpulan.","Kemampuan Verbal: Analitis":"Menguji kemampuan menganalisis informasi, menyusun urutan, menentukan posisi, dan membuat pengelompokan berdasarkan sejumlah ketentuan.","Kemampuan Numerik: Berhitung":"Mengukur kemampuan melakukan operasi hitung dasar, pecahan, persentase, dan akar / menguji ketepatan serta kecepatan dalam menyelesaikan perhitungan matematis.","Kemampuan Numerik: Deret Angka":"Menguji kemampuan menemukan pola bilangan dan menentukan angka berikutnya dalam suatu barisan / menilai ketelitian dalam mengenali perubahan pola angka.","Kemampuan Numerik: Perbandingan Kuantitatif":"Mengukur kemampuan membandingkan dua nilai untuk menentukan hubungan lebih besar, lebih kecil, sama, atau tidak dapat ditentukan.","Kemampuan Numerik: Soal Cerita":"Menguji kemampuan memahami permasalahan berbentuk cerita dan mengubahnya menjadi perhitungan matematis, seperti persoalan usia, jarak, kecepatan, dan harga.","Kemampuan Figural: Analogi":"Mengukur kemampuan mengenali hubungan atau perubahan pola pada gambar dan menerapkannya pada pasangan gambar lainnya / menilai ketepatan dalam memahami hubungan antarobjek visual.","Kemampuan Figural: Ketidaksamaan":"Menguji ketelitian dalam menemukan gambar yang berbeda berdasarkan bentuk, arah, jumlah, atau warna.","Kemampuan Figural: Serial":"Mengukur kemampuan mengenali pola perubahan gambar dan menentukan kelanjutan dari suatu rangkaian / menguji ketajaman pengamatan terhadap urutan bentuk dan pola visual.","Pelayanan Publik":"Mengukur kemampuan memberikan pelayanan secara ramah, cepat, adil, dan mengutamakan kebutuhan masyarakat / menilai kesadaran peserta dalam menjalankan tugas pelayanan secara bertanggung jawab.","Jejaring Kerja":"Menguji kemampuan membangun hubungan, bekerja sama, dan berkoordinasi dengan rekan kerja, atasan, maupun instansi lain.","Sosial Budaya":"Menilai kepekaan dalam menghadapi perbedaan suku, agama, dan budaya serta kemampuan beradaptasi dan menghargai keberagaman / mengukur sikap toleransi dalam lingkungan masyarakat yang majemuk.","Teknologi Informasi dan Komunikasi":"Menguji kemampuan memanfaatkan teknologi, mempelajari hal baru, serta menggunakan dan menjaga informasi secara bijak / menilai kesiapan peserta menghadapi perkembangan teknologi dalam lingkungan kerja.","Profesionalisme":"Menilai kedisiplinan, tanggung jawab, konsistensi, dan kemampuan mengutamakan mutu pekerjaan serta kepentingan organisasi.","Anti Radikalisme":"Mengukur sikap dalam menolak paham yang mengancam persatuan bangsa serta mengutamakan toleransi dan dialog dalam menghadapi perbedaan."};
KISI.TWK=KISI.TWK.map(k=>k=='Bahasa Negara'?'Bahasa Indonesia':k);S.packages.forEach(p=>(p.qs||[]).forEach(q=>{if(q.kisi=='Bahasa Negara')q.kisi='Bahasa Indonesia'}));
function PN(){return wide()?8:7}
const TN={TWK:'Tes Wawasan Kebangsaan',TIU:'Tes Intelegensi Umum',TKP:'Tes Karakteristik Pribadi'};
let FOK=false,FZ=1;
function fmtT(el){const m=/^(\d+):(\d\d)$/.exec(el.textContent.trim());if(m){const t=+m[1]*60+ +m[2],z=n=>String(n).padStart(2,'0');el.textContent=z(Math.floor(t/3600))+':'+z(Math.floor(t%3600/60))+':'+z(t%60)}}
let FL=5;const zs=l=>l<=5?.6+(l-1)*.1:1+(l-5)*.2;
function zmv(d){FL=Math.min(10,Math.max(1,FL+d));document.body.style.setProperty('--fz',zs(FL));const n=document.getElementById('fzn');if(n)n.textContent=FL}
lap=function(){try{const x=document.querySelector('.exw #tm'),on=!!(x&&E&&wide());document.body.classList.toggle('lapx',on);document.body.classList.toggle('fok',on&&FOK);const a=document.querySelector('.exw>div:first-child>button:not(#bk)');if(a)a.textContent=on?'AKHIRI UJIAN':'AKHIRI';if(!on)return;if(!x._o){x._o=new MutationObserver(()=>fmtT(x));x._o.observe(x,{childList:true,characterData:true,subtree:true})}fmtT(x);const p=P(E.id),q=p.qs[E.i];if(!document.querySelector('.kisi')){const k=q.kisi;document.querySelector('.exw>div:nth-child(2)').insertAdjacentHTML('beforeend','<div class=kisi>'+TN[qType(p,E.i)]+(k?': '+k.replace(/^Kemampuan /,'')+': '+(KD2[k]||''):'')+'</div>')}if(!document.querySelector('.tgl'))x.parentNode.insertAdjacentHTML('beforeend','<div class=tgl onclick="FOK=!FOK;lap()"><i></i></div><div class=fzm><button onclick="zmv(-1)">\u2212</button><b id=fzn>'+FL+'</b><button onclick="zmv(1)">+</button></div>'.replace('></div><div class=fzm','><i></i></div><div class=fzm'));document.querySelector('.tgl').classList.toggle('on',FOK);document.body.style.setProperty('--fz',zs(FL))}catch(e){}};
const _lap31=lap;let _wl=wide();lap=function(){document.body.classList.toggle('lapw',wide());_lap31()};
addEventListener('resize',()=>{setTimeout(()=>{const w=wide();if(w!==_wl){_wl=w;if(document.querySelector('.exw #tm')){rotNote();render()}else if(typeof V!=='undefined'&&V=='home')render()}},200)});
/* ===== REVISI 32: DUA TAMPILAN SAJA (vertikal = format HP yang lebih luas, horizontal = laptop); ZOOM SATU LEMBAR SOAL ===== */
function rotNote(){let n=document.getElementById('rtn');if(n)n.remove();n=document.createElement('div');n.id='rtn';n.style.cssText='position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#012AAB;color:#fff;padding:10px 18px;border-radius:10px;font-size:13px;z-index:10000;box-shadow:0 4px 16px #0004;text-align:center;max-width:90vw';n.textContent='Layar diputar. Tampilan ujian akan menyesuaikan dengan posisi layar.';document.body.appendChild(n);setTimeout(()=>n.remove(),3500)}
const _lap32=lap;lap=function(){_lap32();try{if(document.body.classList.contains('lapx')&&!document.getElementById('lz')){const ex=document.querySelector('.exw'),k=[...ex.children].slice(2);if(k.length){const z=document.createElement('div');z.id='lz';ex.insertBefore(z,k[0]);k.forEach(c=>z.appendChild(c))}}}catch(e){}};
/* ===== REVISI 33: BERANDA - KARTU HORIZONTAL MENGIKUTI ISI; VERTIKAL: PAKET TERBARU + CARI DI KIRI, KATEGORI DI KANAN ===== */
function homeV(){return;try{if(V!='home'||!wide()||document.getElementById('hv'))return;const big=document.querySelector('#app>button.big'),g3=document.querySelector('#app>.g3'),ls=document.getElementById('ls');if(!big||!g3||!ls)return;const hd=ls.previousElementSibling,t=hd&&hd.querySelector('b');if(!hd||!t)return;t.textContent='Paket Terbaru';const hv=document.createElement('div'),L=document.createElement('div'),R=document.createElement('div');hv.id='hv';L.id='hvl';R.id='hvr';L.appendChild(hd);R.appendChild(big);R.appendChild(g3);hv.appendChild(L);hv.appendChild(R);ls.parentNode.insertBefore(hv,ls)}catch(e){}}
const _lap33=lap;lap=function(){_lap33();homeV()};
/* ===== REVISI 36: WARNA ASLI KEMBALI (tanpa gradasi); bingkai tetap di layar, sudut sangat tumpul, agak pipih; beranda asli; tombol pendek; rapor besar; tombol Akhiri ===== */
const _lap34=lap;lap=function(){_lap34();try{const app=document.getElementById('app'),on=wide();if(window._lv!==V){window._lv=V;if(app)app.scrollTop=0}const rb=document.querySelector('.exw>div:first-child>button.bkc:not(#bk)');if(rb&&on&&rb.textContent.trim().toUpperCase()==='AKHIRI')rb.innerHTML=ARW;document.body.classList.toggle('rsx',!!(on&&document.querySelector('[onclick="openReview()"]')));if(false)document.querySelectorAll('#app>button,#app .g3 button').forEach(b=>{if(b.closest('.exw,.nav'))return;if(b.textContent.trim().length<=24){b.style.width='fit-content';b.style.padding='0 34px';b.style.display='inline-flex';b.style.justifyContent='center';b.style.alignItems='center'}})}catch(e){}};
/* ===== REVISI 37: panel vertikal di laptop (selain ujian/rapor/hasil), status besar, kisi miring, panah saja ===== */
const _lap35=lap;lap=function(){_lap35();try{const on=wide(),lx=document.body.classList.contains('lapx'),rs=document.body.classList.contains('rsx'),rv=!!(document.querySelector('.exw')&&!document.querySelector('.exw #tm'));document.body.classList.toggle('pnl',!!(on&&!lx&&!rs&&!rv&&V!='auth'));const rb=document.querySelector('.exw>div:first-child>button.bkc:not(#bk)');if(rb&&rb.textContent.trim().length>0&&!rb.querySelector('svg'))rb.innerHTML=ARW}catch(e){}};
/* ===== REVISI 38: BERANDA KIRI + PROFIL KANAN (laptop), kartu pas, tombol Daftar Paket, rapor proporsional, panah default ===== */
const ARW='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
function fitCards(){return;try{const ls=document.getElementById('ls');if(!ls||!document.body.classList.contains('hm'))return;const rows=[...ls.querySelectorAll('.row')];if(!rows.length)return;rows.forEach(r=>{r.style.zoom=1});const nat=Math.max(...rows.map(r=>{const cs=getComputedStyle(r),g=parseFloat(cs.columnGap)||0,pd=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),bd=parseFloat(cs.borderLeftWidth)+parseFloat(cs.borderRightWidth);return [...r.children].reduce((t,c)=>t+c.offsetWidth,0)+g*(r.children.length-1)+pd+bd}));const col=(ls.clientWidth-16)/2,z=Math.min(1.8,Math.max(.6,col/nat));rows.forEach(r=>r.style.zoom=z)}catch(e){}}
function homeP(){try{const app=document.getElementById('app');if(!app||!PANE.includes(V)||document.getElementById('bdp'))return;const ef=app.querySelector('button[onclick="editFoto()"]');if(ef){const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;align-items:center';ef.parentNode.insertBefore(row,ef);row.appendChild(ef);row.insertAdjacentHTML('beforeend','<button id=dpk onclick="go(\'paket\')" style="height:40px;padding:0 18px 0 24px;border-radius:10px;background:var(--ac);color:#fff;font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:8px">Daftar Paket<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>')}const L=document.createElement('div');L.id='bdp';[...app.children].forEach(c=>L.appendChild(c));if(V=='paket')L.insertAdjacentHTML('afterbegin','<button onclick="go(\'home\')" style="display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 18px 0 12px;border-radius:999px;background:var(--cd);color:var(--tx);font-weight:700;font-size:13px;margin-bottom:10px">'+ARW+'<span>Beranda</span></button>');app.appendChild(L);const R=document.createElement('div');R.id='pfp';R.innerHTML=profil();pfEnh(R);app.appendChild(R)}catch(e){}}
const _lap36=lap;lap=function(){_lap36();try{const on=wide(),lx=document.body.classList.contains('lapx'),rs=document.body.classList.contains('rsx'),rv=!!(document.querySelector('.exw')&&!document.querySelector('.exw #tm')),hm=!!(on&&PANE.includes(V)&&!lx&&!rs&&!rv);document.body.classList.toggle('hm',hm);if(hm){document.body.classList.remove('pnl');homeP();fitCards()}const rb=document.querySelector('.exw>div:first-child>button.bkc:not(#bk)');if(rb&&rb.textContent.trim().length>0&&!rb.querySelector('svg'))rb.innerHTML=ARW;const app=document.getElementById('app');if(rs&&app)[...app.children].forEach(c=>{const t=c.textContent.trim();if(c===app.firstElementChild)c.classList.add('rs-top');else if(/^Percobaan/.test(t)&&t.length<40)c.classList.add('rs-lbl');else if(c.querySelector('table'))c.classList.add('rs-info');else if(/LULUS/.test(t)&&t.length<40)c.classList.add('rs-st')})}catch(e){}};
addEventListener('resize',()=>setTimeout(fitCards,250));
if(typeof srch==='function'){const _sr=srch;srch=function(){_sr.apply(this,arguments);fitCards()}}
/* ===== REVISI 39 (LH = layar horizontal): tanpa bar bawah, panel kiri berganti + profil tetap, Beli jadi panel melayang, koreksi LH, judul pil, mata privasi, wallpaper beranda, panel mengapung vertikal lebar ===== */
const PANE=['home','paket','semua','kat'],OVL=['buy','qris','va'];
const _rd39=render;render=function(){if(PANE.includes(V))window._pp=V;_rd39()};
const EYE=o=>'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(o?'<path d="M17.9 17.9A10.5 10.5 0 0 1 12 20c-7 0-10-8-10-8a18 18 0 0 1 4.2-5.3M9.9 4.2A9.7 9.7 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.2 3.2M14.1 14.1a3 3 0 0 1-4.2-4.2M2 2l20 20"/>':'<path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z"/><circle cx="12" cy="12" r="3"/>')+'</svg>';
function pfAsk(k,sh){const n=k=='e'?'alamat email':'foto';modal('<div style="padding:6px"><b style="font-size:17px">'+(sh?'Tampilkan kembali ':'Sembunyikan ')+n+'?</b><p class="mu" style="font-size:13px;line-height:1.6;margin:10px 0 16px">'+(sh?'Hanya ditampilkan di layar ini. Pastikan tidak ada orang lain yang melihat.':'Disembunyikan demi privasi. Datanya tidak dihapus dan bisa ditampilkan lagi kapan saja.')+'</p><div style="display:flex;gap:10px;justify-content:flex-end"><button onclick="closeM()" style="height:40px;padding:0 20px;border:1.5px solid var(--bd);background:#fff;color:var(--tx);border-radius:8px;font-weight:700">Batal</button><button onclick="pfDo(\''+k+'\','+(sh?1:0)+')" style="height:40px;padding:0 20px;background:#012AAB;color:#fff;border-radius:8px;font-weight:700">'+(sh?'Tampilkan':'Sembunyikan')+'</button></div></div>')}
function pfDo(k,sh){if(k=='e')S.hideE=!sh;else S.hideP=!sh;save();closeM();render()}
function pfShow(k){pfAsk(k,1)}
function pfEnh(R){try{const em=[...R.querySelectorAll('div')].find(d=>d.children.length==0&&d.textContent.trim()===S.me.e);if(em){em.style.display='flex';em.style.alignItems='center';em.style.gap='8px';em.textContent=S.hideE?'\u2022'.repeat(Math.min(S.me.e.length,16)):S.me.e;em.insertAdjacentHTML('beforeend','<button onclick="'+(S.hideE?"pfShow('e')":"pfAsk('e')")+'" style="background:none;color:inherit;padding:2px;display:grid;place-items:center">'+EYE(S.hideE)+'</button>')}const ph=R.querySelector('div[style*="width:110px"]');if(ph){ph.style.position='relative';ph.style.marginRight='46px';if(S.hideP)ph.insertAdjacentHTML('beforeend','<div style="position:absolute;inset:0;border-radius:11px;background:#cfd6e4"></div>');ph.insertAdjacentHTML('beforeend','<button onclick="'+(S.hideP?"pfShow('p')":"pfAsk('p')")+'" style="position:absolute;right:-40px;top:calc(50% - 16px);width:32px;height:32px;border-radius:50%;background:#ffffff33;color:#fff;display:grid;place-items:center;padding:0;z-index:2">'+EYE(S.hideP)+'</button>')}}catch(e){}}
let _wm=null;function wallMask(){if(_wm)return _wm;const W=360,H=180,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),im=x.createImageData(W,H),ph=[0,1,2,3,4].map(()=>Math.random()*6.28),fr=[2,3.7,6.1,9.3,14.7];for(let i=0;i<W;i++){let n=0;for(let k=0;k<5;k++)n+=Math.sin(i/W*fr[k]*6.28+ph[k])/(k+1.5);const s=.55+n/2.2*.09;for(let j=0;j<H;j++){let a=1-(j/H-s)/.34;a=Math.max(0,Math.min(1,a));a=a*a*(3-2*a);a+=(Math.random()-.5)*.1*Math.sin(a*3.14);a=Math.max(0,Math.min(1,a));const o=(j*W+i)*4;im.data[o]=im.data[o+1]=im.data[o+2]=255;im.data[o+3]=Math.round(a*255)}}x.putImageData(im,0,0);return _wm=c.toDataURL('image/png')}
function wallPick(){crop(1.6,1600,'jpeg','Ganti Wallpaper Beranda (1600x1000)',d=>{S.wall=d;save();render()})}
function wallDel(){S.wall='';save();render()}
function wallpaper(){try{if(V!='home')return;const h=document.getElementById('bdp')||document.getElementById('app');if(!h||document.getElementById('wall'))return;if(!S.wall&&!OP)return;const m=wallMask(),w=document.createElement('div');w.id='wall';w.style.cssText='position:absolute;left:0;right:0;top:0;height:62vh;z-index:0;pointer-events:none;background:'+(S.wall?'url('+S.wall+') center/cover no-repeat':'transparent')+';-webkit-mask:url('+m+') 0 0/100% 100% no-repeat;mask:url('+m+') 0 0/100% 100% no-repeat';h.style.position='relative';h.insertBefore(w,h.firstChild);if(OP)h.insertAdjacentHTML('afterbegin','<div style="position:absolute;left:50%;top:26vh;transform:translate(-50%,-50%);z-index:5;display:flex;flex-direction:column;align-items:center;gap:8px"><button onclick="wallPick()" title="Ganti wallpaper" style="width:54px;height:54px;border-radius:50%;background:#fff;color:#012AAB;box-shadow:0 4px 16px #0003;display:grid;place-items:center;padding:0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button><span style="background:#fff;border-radius:999px;padding:4px 12px;font-size:12px;font-weight:700;box-shadow:0 2px 8px #0002">Ganti wallpaper'+(S.wall?' \u00b7 <u onclick="event.stopPropagation();wallDel()" style="cursor:pointer;color:#e11d48">Hapus</u>':'')+'</span></div>')}catch(e){}}
function payOv(){try{const on=wide(),isO=OVL.includes(V);let o=document.getElementById('ovl');if(!(on&&isO)){if(o)o.remove();return}const app=document.getElementById('app'),kids=[...app.children];if(o)o.remove();o=document.createElement('div');o.id='ovl';const pn=document.createElement('div');pn.id='ovp';kids.forEach(k=>pn.appendChild(k));o.appendChild(pn);document.body.appendChild(o);const keep=V,pv=window._pp||'home';if(keep=='buy'){const bk=pn.querySelector('.bkc');if(bk)bk.setAttribute('onclick',"go('"+pv+"')")}V=pv;try{app.innerHTML=window[pv]();document.body.classList.add('hm');document.body.classList.remove('pnl');homeP();wallpaper();logoFix()}finally{V=keep}}catch(e){}}
const _lap39=lap;lap=function(){_lap39();try{const on=wide(),lx=document.body.classList.contains('lapx'),rv=!!(document.querySelector('.exw')&&!document.querySelector('.exw #tm')),app=document.getElementById('app');if(OVL.includes(V)&&on)document.body.classList.remove('pnl');document.body.classList.toggle('rvx',!!(on&&V=='review'&&rv));if((lx||document.body.classList.contains('rvx'))&&!document.getElementById('lz')){const ex=document.querySelector('.exw'),k=[...ex.children].slice(2);if(k.length){const z=document.createElement('div');z.id='lz';ex.insertBefore(z,k[0]);k.forEach(c=>z.appendChild(c))}}let tp=document.getElementById('tpill');if(lx&&on&&E){if(!tp){tp=document.createElement('div');tp.id='tpill';document.body.appendChild(tp)}tp.textContent=P(E.id).name}else if(tp)tp.remove();payOv();if(!OVL.includes(V))wallpaper()}catch(e){}};
/* ===== REVISI 40: logo sejajar Selamat di atas Daftar Paket, mata foto di luar bingkai + konfirmasi nyalakan lagi, panel bayar = HP diskalakan, thumbnail 3:2 konsisten ===== */
function logoFix(){try{const bd=document.getElementById('bdp');if(!bd||V!='home')return;const lg=bd.querySelector('#logo'),dp=document.getElementById('dpk');if(!lg||!dp)return;const wr=lg.parentElement,gb=dp.parentElement.parentElement;gb.style.position='relative';if(wr.parentElement!==gb)gb.appendChild(wr);wr.classList.add('lgw');const sel=[...gb.querySelectorAll('*')].find(x=>x.children.length==0&&/^Selamat/.test(x.textContent.trim()))||gb.firstElementChild;wr.style.setProperty('--lt','0px');const sr=sel.getBoundingClientRect(),lr=lg.getBoundingClientRect();wr.style.setProperty('--lt',((sr.top+sr.height/2)-(lr.top+lr.height/2))+'px')}catch(e){}}
function thumbFix(){try{document.querySelectorAll('#app div,#ovp div').forEach(d=>{if(d.children.length==0&&/^THUMBNAIL - /.test(d.textContent.trim())){d.style.height='auto';d.style.aspectRatio='3/2'}})}catch(e){}}
const _lapQ1=lap;lap=function(){_lapQ1();logoFix();thumbFix()};
/* ===== REVISI 40: vertikal = skala HP; logo di beranda; mata di samping foto + konfirmasi; panel bayar/deskripsi naik dari bawah berskala; daftar paket pas (2 kolom, Daftar Paket 3 kolom); scroll terjaga ===== */
const CLOSEI='<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>';
function pfAskShow(k){modal('<div style="padding:6px"><b style="font-size:17px">Tampilkan '+(k=='e'?'alamat email':'foto')+' kembali?</b><p class="mu" style="font-size:13px;line-height:1.6;margin:10px 0 16px">'+(k=='e'?'Alamat email akan terlihat lagi di layar ini.':'Foto akan terlihat lagi di layar ini.')+'</p><div style="display:flex;gap:10px;justify-content:flex-end"><button onclick="closeM()" style="height:40px;padding:0 20px;border:1.5px solid var(--bd);background:#fff;color:var(--tx);border-radius:8px;font-weight:700">Batal</button><button onclick="pfShow2(\''+k+'\')" style="height:40px;padding:0 20px;background:#012AAB;color:#fff;border-radius:8px;font-weight:700">Tampilkan</button></div></div>')}
function pfShow2(k){if(k=='e')S.hideE=false;else S.hideP=false;save();closeM();render()}
pfEnh=function(R){try{const lg=R.querySelector('#logo');if(lg&&lg.parentElement!==R)lg.parentElement.remove();const em=[...R.querySelectorAll('div')].find(d=>d.children.length==0&&d.textContent.trim()===S.me.e);if(em){em.style.display='flex';em.style.alignItems='center';em.style.gap='8px';em.textContent=S.hideE?'\u2022'.repeat(Math.min(S.me.e.length,16)):S.me.e;em.insertAdjacentHTML('beforeend','<button onclick="'+(S.hideE?"pfAskShow('e')":"pfAsk('e')")+'" style="background:none;color:inherit;padding:2px;display:grid;place-items:center">'+EYE(S.hideE)+'</button>')}const ph=R.querySelector('div[style*="width:110px"]');if(ph){ph.style.position='relative';if(S.hideP)ph.insertAdjacentHTML('beforeend','<div style="position:absolute;inset:0;border-radius:11px;background:#cfd6e4"></div>');const bd=[...R.querySelectorAll('div,span')].find(d=>d.children.length==0&&/FOTO ANDA/i.test(d.textContent));if(bd)bd.insertAdjacentHTML('beforebegin','<div style="margin-bottom:8px"><button onclick="'+(S.hideP?"pfAskShow('p')":"pfAsk('p')")+'" title="Sembunyikan foto" style="background:#ffffff2e;color:#fff;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;padding:0">'+EYE(S.hideP)+'</button></div>')}}catch(e){}};
fitCards=function(){try{const hm=document.body.classList.contains('hm');if(!hm)return;document.querySelectorAll('#bdp #ls,#bdp .cg,#bdp #sl').forEach(g=>{const n=V=='paket'?3:2;g.style.setProperty('--n',n);const rows=[...g.querySelectorAll('.row')];if(!rows.length)return;rows.forEach(r=>{r.style.zoom=1});const nat=Math.max(...rows.map(r=>{const cs=getComputedStyle(r),gp=parseFloat(cs.columnGap)||0,pd=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),bd=parseFloat(cs.borderLeftWidth)+parseFloat(cs.borderRightWidth);return [...r.children].reduce((t,c)=>t+c.offsetWidth,0)+gp*(r.children.length-1)+pd+bd})),col=(g.clientWidth-16*(n-1))/n,z=Math.min(2.4,Math.max(.6,col/nat));rows.forEach(r=>r.style.zoom=z)})}catch(e){}};
function restoreScroll(){try{const b=document.getElementById('bdp'),p=document.getElementById('pfp');if(b&&window._st&&window._st.v===window._pp)b.scrollTop=window._st.t;if(p&&window._sp)p.scrollTop=window._sp.t}catch(e){}}
document.addEventListener('scroll',e=>{const t=e.target;if(t&&t.id=='bdp')window._st={v:window._pp,t:t.scrollTop};if(t&&t.id=='pfp')window._sp={t:t.scrollTop}},true);
const _rdR2=render;render=function(){if(PANE.includes(V)&&window._pp&&window._pp!==V)window._st=null;_rdR2()};
payOv=function(){try{const on=wide(),isO=OVL.includes(V);let o=document.getElementById('ovl');if(!(on&&isO)){if(o)o.remove();return}const app=document.getElementById('app'),kids=[...app.children];if(o)o.remove();o=document.createElement('div');o.id='ovl';const pn=document.createElement('div');pn.id='ovp';kids.forEach(k=>pn.appendChild(k));o.appendChild(pn);document.body.appendChild(o);const keep=V,pv=window._pp||'home';const bk=pn.querySelector('.bkc');if(bk){bk.setAttribute('onclick',"go('"+pv+"')");bk.innerHTML=CLOSEI;bk.style.background='none';bk.style.width='40px';bk.style.height='40px'}o.addEventListener('click',e=>{if(e.target===o)go(pv)});V=pv;try{app.innerHTML=window[pv]();document.body.classList.add('hm');document.body.classList.remove('pnl');homeP();wallpaper();fitCards();restoreScroll()}finally{V=keep}}catch(e){}};
const _lapR2=lap;lap=function(){_lapR2();try{const on=wide();document.documentElement.style.setProperty('--pz',Math.max(1.25,Math.min(2,innerWidth/760)).toFixed(2));if(document.body.classList.contains('hm')&&!OVL.includes(V)){fitCards();restoreScroll()}const pr=!on&&matchMedia('(orientation:portrait)').matches&&innerWidth>480;document.documentElement.style.zoom=pr?(innerWidth/480).toFixed(3):'';}catch(e){}};
if(S.me){V='home';if(S.exam){E=S.exam;V='exam';setTimeout(tick,0)}}
/* ===== REVISI 28 ===== */
/* zoom foto dari editor ikut berlaku di lembar soal siswa & review */
const zFix=(h,p,i,q,withP)=>{const rep=(src,z)=>{if(!src)return;h=h.split('<img src="'+src+'" style="max-width:100%').join('<img src="'+src+'" style="max-width:'+(z*10)+'%')};rep(q.img,zGet(p,i,'q'));(q.oi||[]).forEach((s,j)=>rep(s,zGet(p,i,'o'+j)));if(withP)rep(q.pimg,zGet(p,i,'p'));return h};
const _ex28=exam;exam=function(){const h=_ex28();try{const p=P(E.id);return zFix(h,p,E.i,p.qs[E.i],false)}catch(e){return h}};
const _rv28=review;review=function(){const h=_rv28();try{const p=P(CUR);return zFix(h,p,RV.i,p.qs[RV.i],true)}catch(e){return h}};
/* tombol kembali (panah) = kembali ke halaman sebelumnya di posisi scroll yang sama */
const _rd28=render;render=function(){_rd28();try{if(V!=='exam')document.querySelectorAll('#app .bkc').forEach(b=>{const o=b.getAttribute('onclick')||'',m=o.match(/go\('(\w+)'\)/);if(m)b.setAttribute('onclick',"goBack('"+m[1]+"')")})}catch(e){}};
/* ===== REVISI 29: HALAMAN LOGIN ===== */
const lgIn='width:100%;height:42px;padding:0 14px;border:1px solid #cfd3da;border-radius:8px;font-size:15px;background:var(--bg);color:var(--tx);margin:8px 0 18px',lgLb='font-size:14px;font-weight:700;display:block;margin-top:4px';
const lgTab=(on,t,f)=>'<div onclick="'+f+'" style="flex:1;text-align:center;padding:14px 0 12px;font-size:16px;font-weight:700;cursor:pointer;color:'+(on?'#346ef3':'#888')+';border-bottom:3px solid '+(on?'#346ef3':'#e3e5ea')+'">'+t+'</div>';
const lgWrap=(on,body)=>'<div style="max-width:420px;margin:0 auto;padding-top:34px"><div style="display:grid;place-items:center;margin-bottom:26px"><div style="width:112px;height:34px;display:grid;place-items:center">'+(S.loginLogo?'<img src="'+S.loginLogo+'" style="max-width:100%;max-height:100%;object-fit:contain">':'')+'</div></div><div style="border:1px solid var(--bd);border-radius:22px;padding:8px 24px 28px;box-shadow:0 6px 24px #0000000d;background:var(--bg)"><div style="display:flex;margin-bottom:26px">'+lgTab(on=='login','MASUK AKUN',"AM='login';MSG='';render()")+lgTab(on=='daftar','DAFTAR BARU',"AM='daftar';MSG='';render()")+'</div>'+body+'</div></div>';
const lgBtn=(t,f)=>'<button onclick="'+f+'" style="width:100%;height:46px;margin-top:22px;background:#346ef3;color:#fff;font-weight:700;font-size:16px;border-radius:10px">'+t+'</button>';
const _au29=auth;auth=function(){
if(AM=='daftar')return lgWrap('daftar','<label style="'+lgLb+'">Nama Lengkap</label><input id=n placeholder="Nama Lengkap" style="'+lgIn+'"><label style="'+lgLb+'">Email</label><input id=e type=email placeholder="Alamat email aktif" style="'+lgIn+'"><label style="'+lgLb+'">Buat Kunci Akun (Minimal 6 Digit)</label><input id=p type=password placeholder="Buat kunci rahasia" style="'+lgIn+'"><label style="'+lgLb+'">Konfirmasi Kunci Akun</label><input id=p2 type=password placeholder="Ketik ulang kunci rahasia" style="'+lgIn+'"><div class=er style="font-size:13px;min-height:4px">'+MSG+'</div>'+lgBtn('Daftar Sekarang','reg()'));
if(AM=='login')return lgWrap('login','<label style="'+lgLb+'">Email yang Terdaftar</label><input id=e type=email placeholder="contoh@email.com" style="'+lgIn+'"><label style="'+lgLb+'">Kunci Akun</label><input id=p type=password placeholder="Masukkan 6 digit kunci" style="'+lgIn+';margin-bottom:8px"><div onclick="lupa()" style="font-size:13.5px;color:var(--mu);cursor:pointer">Lupa Kunci Akun?</div><div id=lp style="margin-top:14px"></div><div class=er style="font-size:13px;min-height:4px;margin-top:8px">'+MSG+'</div>'+lgBtn('Masuk','login()'));
return _au29()};
function loginLogoModal(){closeM();modal('<b style="font-size:18px">Logo Halaman Login</b><p class=mu style="font-size:12.5px;line-height:1.6">Logo ini tampil kecil di atas formulir Masuk dan Daftar.</p><div style="height:70px;border:1.5px dashed var(--bd);border-radius:8px;display:grid;place-items:center;margin:10px 0">'+(S.loginLogo?'<img src="'+S.loginLogo+'" style="max-width:112px;max-height:40px;object-fit:contain">':'<span class=mu style="font-size:12px">Belum ada logo</span>')+'</div><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="upLoginLogo()">Unggah Logo</button><button style="width:100%;height:40px;margin-top:8px;background:var(--cd);color:var(--tx)" onclick="closeM()">Tutup</button>')}
function upLoginLogo(){closeM();crop(3.3,660,'png','Potong Logo Login',d=>{S.loginLogo=d;save();loginLogoModal()})}
/* ===== REVISI 30: RIWAYAT PENGERJAAN (TIDAK DITIMPA) ===== */
PAR.riwayat='paket';let RQ='';
S.hist=S.hist||{};Object.keys(S.res||{}).forEach(id=>{if(!S.hist[id])S.hist[id]=[JSON.parse(JSON.stringify(S.res[id]))]});
const _fn30=finish;finish=function(){const id=E?E.id:null;_fn30();if(id!=null&&S.res[id]){const r=S.res[id];r.at=r.at||Date.now();const h=S.hist[id]=S.hist[id]||[],last=h[h.length-1];if(!last||last.n!==r.n||last.at!==r.at){if(!last||last.n!==r.n)h.push(JSON.parse(JSON.stringify(r)));else h[h.length-1]=JSON.parse(JSON.stringify(r))}save()}};
const _dh30=doHapus;doHapus=function(id){delete S.hist[id];_dh30(id)};
const _dp30=doHapusPk;doHapusPk=function(id){delete S.hist[id];_dp30(id)};
function hasilUjian(id){CUR=id;const h=S.hist[id]||[];if(h.length<2){S.res[id]=h[0]||S.res[id];go('result')}else{RQ='';go('riwayat')}}
function bukaPeng(k){S.res[CUR]=S.hist[CUR][k];go('result')}
const tglF=t=>t?new Date(t).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})+', '+new Date(t).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}):'-';
function riwList(){const p=P(CUR),h=(S.hist[CUR]||[]).map((r,k)=>({r,k})).filter(x=>!RQ||String(x.r.tot).includes(RQ)).reverse();const e=document.getElementById('riw');if(!e)return;e.innerHTML=h.map(({r,k})=>'<div onclick="bukaPeng('+k+')" style="border:1.5px solid var(--bd);border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer;box-shadow:0 1px 4px #0001"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:14px">Pengerjaan ke-'+(k+1)+'</b><span style="font-size:11.5px;color:var(--mu)">'+tglF(r.at)+'</span></div><div style="display:flex;gap:14px;margin-top:8px;font-size:13px;flex-wrap:wrap">'+['TWK','TIU','TKP'].map(t=>'<span style="color:var(--mu)">'+t+' <b style="color:var(--tx)">'+(r.inc&&r.inc.includes(t)?r.sc[t]:'-')+'</b></span>').join('')+'<span style="margin-left:auto">Total <b style="color:#346ef3;font-size:15px">'+r.tot+'</b></span></div></div>').join('')||'<p class=mu style="text-align:center;font-size:13px;margin-top:30px">Tidak ada nilai total yang cocok</p>'}
function riwayat(){setTimeout(riwList,0);const p=P(CUR);return bar(esc(p.name),"go('paket')")+'<div style="margin:18px 2px 12px"><input inputmode="numeric" pattern="[0-9]*" placeholder="Cari nilai total (angka)..." value="'+RQ+'" oninput="RQ=this.value.replace(/\\D/g,\'\');this.value=RQ;riwList()" style="width:100%;height:42px;padding:0 14px;border:1px solid #cfd3da;border-radius:10px;font-size:15px"></div><div id=riw></div>'}
const _pk30=paket;paket=function(){return _pk30().replace(/onclick="CUR=(\d+);go\('result'\)"/g,'onclick="hasilUjian($1)"')};
const _rs30=result;result=function(){let h=_rs30();const m=h.match(/<div style="text-align:center;font-size:12\.5px;font-weight:600;color:var\(--mu\);margin-top:12px">(Pengerjaan [^<]*)<\/div>/);if(m){h=h.replace(m[0],'').replace(/(<div style="position:relative;margin:-14px -14px 0;height:65px;[^"]*">)(<button[\s\S]*?<\/button>)([^<]*)<\/div>/,(x,a,b,c)=>a+b+'<div style="text-align:center;line-height:1.3"><div>'+c+'</div><div style="font-size:12px;font-weight:600;margin-top:4px;opacity:.92">'+m[1]+'</div></div></div>')}return h};
const _rd30=render;render=function(){if(!['result','review','riwayat'].includes(V))Object.keys(S.hist).forEach(id=>{const h=S.hist[id];if(h&&h.length&&S.res[id]!==h[h.length-1])S.res[id]=h[h.length-1]});_rd30()};
/* ===== REVISI 31: PERLINDUNGAN HAK CIPTA (hanya siswa; hanya layar ujian & Lihat Hasil/review) ===== */
const SG=()=>!OP&&(V==='exam'||V==='review');
function shotApply(){try{document.body.classList.toggle('sg',SG())}catch(e){}}
try{['contextmenu','copy','cut','dragstart','selectstart'].forEach(ev=>document.addEventListener(ev,e=>{if(SG())e.preventDefault()}))}catch(e){}
const _rd31=render;render=function(){_rd31();shotApply()};
queueMicrotask(__legacyRender);

/* ================= blok 2 / 23 (baris 926) ================= */
const _lapKisiLengkap=lap;
lap=function(){
  _lapKisiLengkap();
  try{
    const x=document.querySelector('.exw #tm');
    const on=!!(x&&E&&wide());
    if(!on)return;
    const p=P(E.id),q=p.qs[E.i],t=qType(p,E.i);
    const old=document.querySelector('.exw .kisi');
    if(old)old.remove();
    const raw=q.kisi||'';
    const k=raw==='Bahasa Negara'?'Bahasa Indonesia':raw;
    if(!k)return;
    const label=t==='TIU'?k.replace(/^Kemampuan /,''):k;
    const title=TN[t]+' – '+label;
    const desc=KD2[k]||KD2[raw]||'';
    const target=document.querySelector('.exw>div:nth-child(2)');
    if(target)target.insertAdjacentHTML('beforeend','<div class="kisi">'+esc(title)+': '+esc(desc)+'</div>');
  }catch(e){}
};

/* ================= blok 3 / 23 (baris 971) ================= */
(function(){
  function ipadPanelFix(){
    const tablet=matchMedia('(orientation:portrait) and (min-width:600px)').matches;
    const app=document.getElementById('app'), nav=document.querySelector('.nav');
    if(app){
      app.style.zoom=tablet?'1.18':'';
      app.style.transform='';
      app.style.transformOrigin='';
      app.style.marginBottom='';
    }
    if(nav){
      nav.style.transform='';
      nav.style.transformOrigin='';
    }
  }
  const oldRender=window.render;
  if(typeof oldRender==='function')window.render=function(){oldRender();ipadPanelFix()};
  addEventListener('resize',ipadPanelFix);
  addEventListener('orientationchange',ipadPanelFix);
  addEventListener('load',ipadPanelFix);
  setTimeout(ipadPanelFix,0);
})();

/* ================= blok 4 / 23 (baris 1030) ================= */
/* REVISI: status kelulusan koreksi LH dipindah ke tengah atas soal */
const _lapStatus=lap;
lap=function(){
  _lapStatus();
  try{
    if(document.body.classList.contains('rvx')){
      const top=document.querySelector('.exw>div:nth-child(1)'),lz=document.getElementById('lz');
      if(top&&lz&&!document.getElementById('stl')){
        const b=top.querySelector('b');
        if(b&&/LULUS/i.test(b.textContent)){
          const t=b.textContent.trim(),ok=!/^TIDAK/i.test(t),s=document.createElement('div');
          s.id='stl';s.textContent=t;
          s.style.cssText='text-align:center;font-weight:800;font-size:22px;letter-spacing:.5px;margin:0 0 16px;color:'+(ok?'#16a34a':'#e11d48');
          lz.insertBefore(s,lz.firstChild);b.style.display='none';
        }
      }
    }else{
      const s=document.getElementById('stl');
      if(s){s.remove();const b=document.querySelector('.exw>div:nth-child(1) b');if(b)b.style.display='';}
    }
  }catch(e){}
};
queueMicrotask(__legacyRender);

/* ================= blok 5 / 23 (baris 1170) ================= */
/* Kisi-kisi standar: satu isi lengkap untuk tiap materi, maksimal 315 karakter. */
const KISI_STANDAR44 = {
  "Nasionalisme":"Tes Wawasan Kebangsaan – Nasionalisme: Mengukur cinta tanah air, semangat kebangsaan, dan mengutamakan kepentingan bangsa di atas pribadi atau golongan / menjaga persatuan dan keutuhan negara / memahami sejarah perjuangan, identitas nasional, serta nilai kebangsaan / menumbuhkan kebanggaan terhadap bangsa kini",
  "Integritas":"Tes Wawasan Kebangsaan – Integritas: Menguji kejujuran, tanggung jawab, dan konsistensi / menghindari korupsi serta penyalahgunaan wewenang / menyelaraskan perkataan, tindakan, dan nilai moral / bersikap amanah, disiplin, serta berani mempertahankan kebenaran meski menghadapi tekanan dalam kehidupan sehari-hari",
  "Bela Negara":"Tes Wawasan Kebangsaan – Bela Negara: Mengukur hak dan kewajiban warga menjaga negara dari ancaman militer maupun nonmiliter / memahami ancaman terhadap kedaulatan dan keutuhan Indonesia / mengenali peran masyarakat menjaga ketertiban dan persatuan / mencintai tanah air serta berkontribusi sesuai nilai kebangsaan",
  "Pilar Negara":"Tes Wawasan Kebangsaan – Pilar Negara: Menguji pemahaman Pancasila, UUD 1945, NKRI, dan Bhinneka Tunggal Ika / menerapkan nilai kebangsaan / memahami Pancasila sebagai dasar negara dan ideologi bangsa / memahami konstitusi, bentuk negara, sistem pemerintahan, persatuan dalam keberagaman sesuai nilai kebangsaan",
  "Bahasa Indonesia":"Tes Wawasan Kebangsaan – Bahasa Indonesia: Mengukur kemampuan berbahasa Indonesia, meliputi ejaan, kalimat efektif, dan pemahaman bacaan / mengenali kata baku, tanda baca, serta struktur kalimat / memahami hubungan antarkalimat dan paragraf / menentukan gagasan utama dan informasi tersurat maupun tersirat tepat",
  "Verbal":"Tes Intelegensi Umum – Verbal: Menentukan hubungan makna dua kata melalui analogi / menarik kesimpulan logis dari beberapa pernyataan melalui silogisme / menganalisis informasi dan menghubungkan kondisi nyata untuk menentukan urutan, posisi, atau pengelompokan melalui penalaran analitis secara tepat dan cermat",
  "Numerik":"Tes Intelegensi Umum – Numerik: Menyelesaikan perhitungan / mengenali pola bilangan dalam deret angka untuk menentukan kelanjutannya / menyelesaikan perbandingan senilai, berbalik nilai, dan kuantitatif / menerapkan penalaran matematis untuk menyelesaikan soal cerita dalam konteks kehidupan sehari-hari logis",
  "Figural":"Tes Intelegensi Umum – Figural: Menentukan hubungan atau perubahan pola dua gambar melalui analogi / mengidentifikasi gambar berbeda berdasarkan karakteristik visual melalui ketidaksamaan / mengenali perubahan bentuk dan pola gambar untuk menentukan kelanjutan rangkaian melalui serial secara cermat dan teliti",
  "Pelayanan Publik":"Tes Karakteristik Pribadi – Pelayanan Publik: Mengukur kemampuan memberi pelayanan ramah, cepat, adil, dan mengutamakan kebutuhan masyarakat / bertugas dengan tanggung jawab / menentukan tindakan tepat menghadapi kebutuhan berbeda / menyelesaikan keluhan secara profesional tanpa diskriminasi serta menaati aturan",
  "Jejaring Kerja":"Tes Karakteristik Pribadi – Jejaring Kerja: Menguji kemampuan membangun hubungan, bekerja sama, dan berkoordinasi dengan rekan, atasan, atau instansi lain / bertukar informasi demi tujuan bersama / menyikapi perbedaan pendapat atau konflik / membantu rekan dan berbagi pengetahuan untuk kerja sama yang efektif",
  "Sosial Budaya":"Tes Karakteristik Pribadi – Sosial Budaya: Menilai kepekaan terhadap perbedaan suku, agama, dan budaya serta kemampuan menghargai keberagaman / mengukur toleransi dalam masyarakat majemuk / menentukan tindakan tepat menghadapi perbedaan kebiasaan, pandangan, dan latar belakang / berinteraksi tanpa diskriminasi",
  "Teknologi Informasi dan Komunikasi":"Tes Karakteristik Pribadi – Teknologi Informasi dan Komunikasi: Menguji kemampuan memanfaatkan teknologi dan mempelajari hal baru / menggunakan informasi secara bijak serta beradaptasi dengan perkembangan teknologi / memilih aplikasi digital untuk mendukung tugas / menjaga keamanan data dan kerahasiaan informasi",
  "Profesionalisme":"Tes Karakteristik Pribadi – Profesionalisme: Menilai disiplin, tanggung jawab, dan konsistensi menjaga mutu pekerjaan / menyelesaikan tugas sesuai standar dan waktu / menentukan prioritas / menerima evaluasi, memperbaiki kekurangan, meningkatkan kompetensi, serta menaati aturan dan etika kerja secara konsisten",
  "Anti Radikalisme":"Tes Karakteristik Pribadi – Anti Radikalisme: Menolak paham yang mengancam persatuan dan mengutamakan toleransi / mengenali sikap intoleran, ekstrem, serta tindakan bertentangan dengan Pancasila / merespons ajakan kekerasan atau perpecahan / menghargai perbedaan tanpa memaksakan kehendak / menjaga persatuan"
};

function kisiKey44(p,i,q){
  const tp=qType(p,i), raw=String(q.kisi||"").toLowerCase();
  if(tp==="TWK"){
    const keys=["Nasionalisme","Integritas","Bela Negara","Pilar Negara","Bahasa Indonesia"];
    return keys.find(k=>raw.includes(k.toLowerCase())) || keys[i%5];
  }
  if(tp==="TIU"){
    if(/figural|ketidaksamaan|serial/.test(raw)) return "Figural";
    if(/numerik|berhitung|deret|perbandingan|soal cerita/.test(raw)) return "Numerik";
    if(/verbal|analogi|silogisme|analitis/.test(raw)) return "Verbal";
    return i<3?"Verbal":i<7?"Numerik":"Figural";
  }
  const keys=["Pelayanan Publik","Jejaring Kerja","Sosial Budaya","Teknologi Informasi dan Komunikasi","Profesionalisme","Anti Radikalisme"];
  return keys.find(k=>raw.includes(k.toLowerCase())) || keys[i%6];
}
function tigaBarisKisi44(text){
  const words=String(text).trim().split(/\s+/), lines=[];
  let line="";
  for(const word of words){
    const next=line?line+" "+word:word;
    if(next.length>115 && line){lines.push(line);line=word;}
    else line=next;
  }
  if(line)lines.push(line);
  while(lines.length<3)lines.push("");
  if(lines.length>3)throw new Error("Teks kisi-kisi melewati batas tiga baris");
  if(lines.some((x,i)=>i<2&&x.length>115))throw new Error("Batas 115 karakter terlampaui");
  return lines.join("\n");
}
function renderKisiStandar44(){
  try{
    if(!document.body.classList.contains("lapx") || !E || !P(E.id)) return;
    const p=P(E.id),q=p.qs[E.i],key=kisiKey44(p,E.i,q),txt=KISI_STANDAR44[key];
    let node=document.querySelector(".exw .kisi");
    if(!node){
      const target=document.querySelector(".exw>div:nth-child(2)");
      if(target){node=document.createElement("div");node.className="kisi";target.appendChild(node);}
    }
    if(node)node.textContent=tigaBarisKisi44(txt);
  }catch(e){console.error("Kisi-kisi LH:",e)}
}
const _lapPart44=lap;
lap=function(){_lapPart44();renderKisiStandar44()};

/* ================= blok 6 / 23 (baris 1277) ================= */
/* (A) Menu titik tiga: panel tidak perlu mengecil. Popup "Hapus Paket" (absolute) jangan ikut dihitung saat skala kartu dihitung. */
fitCards=function(){try{const hm=document.body.classList.contains('hm');if(!hm)return;document.querySelectorAll('#bdp #ls,#bdp .cg,#bdp #sl').forEach(g=>{const n=V=='paket'?3:2;g.style.setProperty('--n',n);const rows=[...g.querySelectorAll('.row')];if(!rows.length)return;rows.forEach(r=>{r.style.zoom=1});const nat=Math.max(...rows.map(r=>{const cs=getComputedStyle(r),gp=parseFloat(cs.columnGap)||0,pd=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),bd=parseFloat(cs.borderLeftWidth)+parseFloat(cs.borderRightWidth);const kids=[...r.children].filter(c=>!(getComputedStyle(c).position=='absolute'&&/Hapus Paket/.test(c.textContent)));return kids.reduce((t,c)=>t+c.offsetWidth,0)+gp*(kids.length-1)+pd+bd})),col=(g.clientWidth-16*(n-1))/n,z=Math.min(2.4,Math.max(.6,col/nat));rows.forEach(r=>r.style.zoom=z)})}catch(e){}};

/* (B) Panah kembali di halaman hasil (LH): kembali ke tempat ujian dibuka (halaman + tab + posisi scroll), bukan Beranda */
(function(){
  const _st46=start;
  start=function(id,t){try{window._rsFrom=null;window._org={v:V,TAB:TAB,Q:(typeof Q!='undefined'?Q:null),Q2:(typeof Q2!='undefined'?Q2:null),st:window._st?Object.assign({},window._st):null,sp:window._sp?Object.assign({},window._sp):null}}catch(e){}return _st46.apply(this,arguments)};
  const _fn46=finish;
  finish=function(){const r=_fn46.apply(this,arguments);try{window._rsFrom=window._org||null}catch(e){}return r};
  const _gb46=goBack;
  goBack=function(fb){const o=window._rsFrom;
    if(V==='result'&&o&&wide()){
      window._rsFrom=null;
      const top=NAVH[NAVH.length-1];if(top&&top.v===o.v)NAVH.pop();
      clearInterval(TI);
      try{if(o.TAB!=null)TAB=o.TAB;if(o.Q!=null)Q=o.Q;if(o.Q2!=null)Q2=o.Q2}catch(e){}
      window._st=o.st;window._sp=o.sp;
      if(typeof PANE!='undefined'&&PANE.includes(o.v))window._pp=o.v;
      V=o.v;MSG='';closeM();window.BACKING=1;try{render()}finally{window.BACKING=0}
      return}
    return _gb46.apply(this,arguments)};
  const _rd46=render;
  render=function(){if(V!=='result'&&V!=='review')window._rsFrom=null;return _rd46.apply(this,arguments)};
})();

/* (C) Urutkan paket (LH): tombol bertema + panel naik dari bawah, menggantikan dropdown bawaan */
const SORTL={new:['Terbaru ke terlama','Paket yang paling baru dibeli di atas'],old:['Terlama ke terbaru','Paket yang paling lama dibeli di atas'],done:['Sudah dikerjakan','Hanya paket yang sudah pernah dikerjakan'],todo:['Belum dikerjakan','Hanya paket yang belum pernah dikerjakan']};
function sortSheet(){sheet('<div style="display:flex;align-items:center;gap:12px;margin:4px 0 16px"><span onclick=closeM() style="width:34px;height:34px;border-radius:50%;border:2px solid #012AAB;color:#012AAB;display:grid;place-items:center;font-weight:800;cursor:pointer">✕</span><b style="font-size:17px;color:#012AAB">Urutkan Paket</b></div>'+Object.keys(SORTL).map(k=>'<button class="srto'+(SORT==k?' on':'')+'" onclick="SORT=\''+k+'\';closeM();render()"><i></i><span><b>'+SORTL[k][0]+'</b><small>'+SORTL[k][1]+'</small></span></button>').join(''))}
const _pk46=paket;
paket=function(){const h=_pk46.apply(this,arguments);if(!wide())return h;
  const btn='<button class="srtb" onclick="sortSheet()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M7 12h10M10 17h4"/></svg><span>'+(SORTL[SORT]||SORTL.new)[0]+'</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>';
  return h.replace(/<select[\s\S]*?<\/select>/,btn)};

/* (D) Lihat hasil (LH): riwayat nilai muncul dari bawah seperti Deskripsi, bukan membuka halaman baru */
const _hu46=hasilUjian;
hasilUjian=function(id){window._rsFrom=null;const h=S.hist[id]||[];if(!wide()||h.length<2)return _hu46.apply(this,arguments);
  CUR=id;RQ='';const p=P(id);
  sheet('<div style="display:flex;align-items:center;gap:12px;margin:4px 0 12px"><span onclick=closeM() style="width:34px;height:34px;border-radius:50%;border:2px solid #012AAB;color:#012AAB;display:grid;place-items:center;font-weight:800;cursor:pointer;flex:none">✕</span><div style="min-width:0"><b style="font-size:16px;color:#012AAB;display:block">Riwayat Nilai</b><span class="mu" style="font-size:12px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(p.name)+'</span></div></div><input inputmode="numeric" pattern="[0-9]*" placeholder="Cari nilai total (angka)..." oninput="RQ=this.value.replace(/\\D/g,\'\');this.value=RQ;riwList()" style="width:100%;height:42px;padding:0 14px;border:1.5px solid #cfd3da;border-radius:10px;font-size:15px;margin-bottom:12px;box-sizing:border-box"><div id=riw></div>');
  riwList()};

/* ================= blok 7 / 23 (baris 1331) ================= */
/* (A) Tombol soal sebelumnya / simpan / lewati bisa di-spam: save() menulis seluruh data (soal bergambar bisa beberapa MB)
   ke localStorage di setiap klik. Selama ujian/koreksi penulisan ditunda & digabung, dan dipaksa tulis saat tab ditutup/disembunyikan. */
(function(){
  const _js=JSON.stringify,_si=Storage.prototype.setItem;let t=null;
  const flush=()=>{if(t===null)return;clearTimeout(t);t=null;try{_si.call(localStorage,K,_js(S))}catch(e){}};
  JSON.stringify=function(v){if(v===S&&arguments.length===1&&(V==='exam'||V==='review'))return '__DEFER_SAVE__';return _js.apply(this,arguments)};
  Storage.prototype.setItem=function(k,v){if(k===K&&v==='__DEFER_SAVE__'){if(t===null)t=setTimeout(flush,800);return}return _si.apply(this,arguments)};
  addEventListener('pagehide',flush);addEventListener('beforeunload',flush);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
  window._flushSave=flush;
})();

/* (B) Urutkan paket: desain sama dengan sheet "Pengaturan Waktu" (pilih opsi, lalu tombol konfirmasi) */
let SORTP=null;
function sortBody(){return Object.keys(SORTL).map(k=>{const on=SORTP===k;return '<div onclick="SORTP=\''+k+'\';document.getElementById(\'sm\').innerHTML=sortBody()" style="display:flex;align-items:center;gap:12px;height:48px;padding:0 14px;margin-top:10px;border-radius:8px;border:1.5px solid '+(on?'#346ef3':'var(--bd)')+';background:'+(on?'var(--cd)':'var(--bg)')+';cursor:pointer;font-weight:'+(on?700:500)+';font-size:14px"><span style="width:18px;height:18px;border-radius:50%;border:2px solid '+(on?'#346ef3':'#999')+';display:grid;place-items:center">'+(on?'<i style="width:8px;height:8px;border-radius:50%;background:#346ef3"></i>':'')+'</span>'+SORTL[k][0]+'</div>'}).join('')+'<button style="width:100%;height:46px;margin-top:16px;background:#346ef3;color:#fff;font-weight:700" onclick="SORT=SORTP;closeM();render()">TERAPKAN</button>'}
function sortSheet(){SORTP=SORT;sheet('<b style="font-size:18px">Urutkan Paket</b><p class="mu" style="font-size:12px;line-height:1.6;margin:6px 0 0">Pilih urutan, lalu tekan TERAPKAN.</p><div id="sm">'+sortBody()+'</div>')}

/* (C) Lihat hasil: sheet dari bawah berformat sama dengan Deskripsi (thumbnail + nama paket), tanpa tombol X */
const _hu47=hasilUjian;
hasilUjian=function(id){const h=S.hist[id]||[];if(!wide()||h.length<2)return _hu47.apply(this,arguments);
  window._rsFrom=null;CUR=id;RQ='';const p=P(id);
  sheet('<div style="display:flex;align-items:center;gap:10px"><div class=th style="width:72px;height:48px;background-image:url('+(p.thumb||'')+')"></div><div style="min-width:0"><b style="font-size:15px;display:block">'+esc(p.name)+'</b><span class="mu" style="font-size:12px">Riwayat nilai pengerjaan</span></div></div><input inputmode="numeric" pattern="[0-9]*" placeholder="Cari nilai total (angka)..." oninput="RQ=this.value.replace(/\\D/g,\'\');this.value=RQ;riwList()" style="width:100%;height:42px;padding:0 14px;border:1.5px solid #cfd3da;border-radius:10px;font-size:15px;margin:12px 0;box-sizing:border-box"><div id=riw style="max-height:300px;overflow-y:auto"></div>');
  riwList()};

/* ================= blok 8 / 23 (baris 1362) ================= */
const _ex48=exam;
exam=function(){
  const h=_ex48.apply(this,arguments);
  try{
    if(wide())return h;
    const t=document.createElement('template');t.innerHTML=h;
    const exw=t.content.querySelector('.exw'),fx=t.content.querySelector('.fx');
    if(!exw||!fx||exw.children.length<6)return h;
    const k=[...exw.children],p=P(E.id),n=p.qs.length,tp=qType(p,E.i);
    const kisiEl=k[3].children[1],kisi=kisiEl?kisiEl.textContent:'';
    const dn=k[1].querySelector('button');
    const pct=Math.round((E.i+1)/n*100);
    const head=document.createElement('div');head.style.cssText='margin-top:14px;width:100%;box-sizing:border-box';
    head.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%!important;max-width:none!important;flex:1 1 auto!important"><div style="min-width:0;flex:1"><div style="font-size:11px;font-weight:700;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(p.name.toUpperCase())+'</div><div style="font-size:15px;font-weight:700;white-space:nowrap">SOAL NOMOR: '+numOf(p,E.i)+' <span style="font-weight:500;color:var(--mu);font-size:12px">dari '+n+'</span></div></div></div><div style="height:4px;background:var(--cd);border-radius:4px;margin-top:10px;overflow:hidden"><div style="width:'+pct+'%;height:100%;background:#346ef3;border-radius:4px"></div></div>';
    dn.style.cssText='height:38px;padding:0 12px;background:var(--cd);color:#012AAB;font-size:12px;font-weight:700;border-radius:8px;white-space:nowrap;flex:none';
    head.firstChild.appendChild(dn);
    k[1].replaceWith(head);k[2].remove();
    if(kisiEl)kisiEl.remove();
    k[3].style.cssText='background:var(--cd);border:0;border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.55;margin-top:12px';
    k[3].insertAdjacentHTML('afterbegin','<div style="display:inline-block;font-size:11px;font-weight:700;color:#012AAB;background:#e6edff;padding:3px 8px;border-radius:6px;margin-bottom:8px">'+tp+(kisi?' · '+esc(kisi):'')+'</div>');
    k[4].style.marginTop='12px';
    [...k[4].children].forEach(o=>{o.style.minHeight='44px';o.style.marginBottom='8px';o.style.borderRadius='10px';o.style.padding='0 12px';const c=o.firstElementChild;if(c&&c.tagName=='SPAN'){c.style.width='24px';c.style.height='24px'}});
    k[5].style.height='96px';
    const bs=[...fx.querySelectorAll('button')],sv=bs[0],sk=bs[1],pv=bs[2];
    if(bs.length===3){
      const row=document.createElement('div');row.style.cssText='display:flex;gap:8px;align-items:center';
      pv.setAttribute('aria-label','Soal sebelumnya');
      pv.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
      pv.style.cssText='flex:none;width:44px;height:44px;border-radius:10px;border:1.5px solid #777;background:var(--bg);color:#444;padding:0;display:grid;place-items:center';
      sv.style.cssText='flex:1;height:44px;border-radius:10px;font-size:12.5px;font-weight:700;background:#ffc619;color:#111';
      sk.style.cssText='flex:none;height:44px;padding:0 20px;border-radius:10px;font-size:12.5px;font-weight:700;background:#346ef3;color:#fff';
      row.append(pv,sv,sk);fx.innerHTML='';fx.appendChild(row);
      fx.className='fx fxe';fx.style.cssText='padding:10px 14px 14px';
    }
    return t.innerHTML;
  }catch(e){return h}
};

/* ================= blok 9 / 23 (baris 1441) ================= */
const GRID4='<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>';
const CLK2='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const dnStyle50=b=>{const l=(b.textContent||'DAFTAR NOMOR').trim();b.innerHTML=GRID4+'<span>'+l+'</span>';b.style.cssText='height:38px;padding:0 14px;background:#012AAB;color:#fff;font-size:12px;font-weight:700;border-radius:6px;white-space:nowrap;flex:none'};
const ttl50=n=>{const d=document.createElement('div');d.style.cssText='flex:1;min-width:0;padding:0 12px 0 40px;text-align:center;color:#fff;font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';d.textContent=n.toUpperCase();return d};
const _ex50=exam;
exam=function(){
  const h=_ex50.apply(this,arguments);
  try{
    if(wide())return h;
    const t=document.createElement('template');t.innerHTML=h;
    const exw=t.content.querySelector('.exw'),fx=t.content.querySelector('.fx');
    if(!exw||!fx)return h;
    const p=P(E.id),k=[...exw.children],bar=k[0],tmEl=bar.querySelector('#tm'),fin=[...bar.querySelectorAll('button')].find(b=>b.id!=='bk');
    if(!tmEl||!fin||k.length<5)return h;
    tmEl.replaceWith(ttl50(p.name));
    fin.style.cssText='height:34px;padding:0 16px;background:#e11d48;color:#fff;font-weight:700;font-size:12px;letter-spacing:.3px;border-radius:6px;flex:none';
    const lab=k[1].querySelector('div[style*="font-size:11px"]');if(lab)lab.remove();
    const dn=k[1].querySelector('button.dn');if(dn)dnStyle50(dn);
    [...k[3].children].forEach(o=>{o.style.borderRadius='8px';o.style.boxShadow='none'});
    k[4].style.height='150px';
    const tr=document.createElement('div');tr.className='tmr';
    tr.innerHTML=CLK2+'<span class="tl">'+(E.end?'Sisa waktu':'Waktu berjalan')+'</span><b id="tm">'+tm()+'</b>';
    exw.appendChild(tr);
    fx.querySelectorAll('button').forEach(b=>{b.style.borderRadius='6px'});
    fx.style.borderTop='0';
    return t.innerHTML;
  }catch(e){return h}
};
const _rv50=review;
review=function(){
  const h=_rv50.apply(this,arguments);
  try{
    if(wide())return h;
    const t=document.createElement('template');t.innerHTML=h;
    const exw=t.content.querySelector('.exw');
    if(!exw)return h;
    const k=[...exw.children],bar=k[0],st=bar.querySelector('b'),row=k[1],box=row&&row.firstElementChild,dn=row&&row.querySelector('button.dn');
    if(!st||!box||!dn)return h;
    const stText=st.textContent.trim(),p=P(CUR);
    st.replaceWith(ttl50(p.name));
    const sc=bar.lastElementChild;if(sc&&sc.tagName!=='BUTTON'){sc.style.height='30px';sc.style.borderRadius='6px';sc.style.minWidth='34px';sc.style.justifyContent='center'}
    box.textContent=stText;box.style.cssText='flex:1;min-width:0;display:flex;align-items:center;font-weight:800;font-size:15px;letter-spacing:.3px;color:'+(/^TIDAK/i.test(stText)?'#e11d48':'#16a34a');
    dnStyle50(dn);
    [...exw.children].filter(e=>/min-height:47px/.test(e.getAttribute('style')||'')).forEach(o=>{o.style.borderRadius='8px'});
    return t.innerHTML;
  }catch(e){return h}
};
queueMicrotask(__legacyRender);

/* ================= blok 10 / 23 (baris 1503) ================= */
/* (1) Bug: kembali dari kategori memunculkan tombol beli berulang. Di LH tombol kembali panel beli memakai go('kat'),
   sehingga halaman beli ikut tercatat di riwayat. Setelah keluar dari alur beli, catatan itu dibuang. */
(function(){
  const _rd51=render;
  render=function(){
    try{
      if(!['buy','qris','va'].includes(V)){
        for(let i=NAVH.length-1;i>=0;i--)if(['buy','qris','va'].includes(NAVH[i].v))NAVH.splice(i,1);
        const t=NAVH[NAVH.length-1];if(t&&t.v===V)NAVH.pop();
      }
      if(V!=='paket'&&window._sortTmp){window._sortTmp=false;let p=null;try{p=localStorage.getItem('kd_sort')}catch(e){}SORT=(p&&SORTL51[p])?p:'new'}
    }catch(e){}
    return _rd51.apply(this,arguments);
  };
})();

/* (2) Urutkan paket: kosong saat dibuka, dua tombol (selalu / kali ini saja) */
const SORTL51={new:'Terbaru dibeli',old:'Terlama dibeli',done:'Sudah dikerjakan',todo:'Belum dikerjakan'};
try{const p=localStorage.getItem('kd_sort');if(p&&SORTL51[p])SORT=p}catch(e){}
const sortSaved=()=>{try{const p=localStorage.getItem('kd_sort');return(p&&SORTL51[p])?p:null}catch(e){return null}};
function sortBody(){
  const d=SORTP?'':' disabled';
  return Object.keys(SORTL51).map(k=>{const on=SORTP===k;return '<div onclick="SORTP=\''+k+'\';document.getElementById(\'sm\').innerHTML=sortBody()" style="display:flex;align-items:center;gap:12px;height:48px;padding:0 14px;margin-top:10px;border-radius:8px;border:1.5px solid '+(on?'#346ef3':'var(--bd)')+';background:'+(on?'var(--cd)':'var(--bg)')+';cursor:pointer;font-weight:'+(on?700:500)+';font-size:14px"><span style="width:18px;height:18px;border-radius:50%;border:2px solid '+(on?'#346ef3':'#999')+';display:grid;place-items:center">'+(on?'<i style="width:8px;height:8px;border-radius:50%;background:#346ef3"></i>':'')+'</span>'+SORTL51[k]+'</div>'}).join('')
  +'<button'+d+' style="width:100%;height:46px;margin-top:16px;background:#346ef3;color:#fff;font-weight:700" onclick="sortApply(true)">TERAPKAN SELALU</button>'
  +'<button'+d+' style="width:100%;height:46px;margin-top:8px;background:var(--bg);color:#346ef3;border:1.5px solid #346ef3;font-weight:700" onclick="sortApply(false)">KALI INI SAJA</button>'
  +'<p class="mu" style="font-size:11.5px;line-height:1.6;margin:10px 0 0">Selalu: tetap berlaku walau web ditutup. Kali ini saja: hilang saat kamu keluar dari Daftar Paket.</p>'
  +(sortSaved()?'<button style="width:100%;height:40px;margin-top:6px;background:none;color:#e11d48;font-weight:700;font-size:12px" onclick="sortClear()">HAPUS URUTAN TERSIMPAN</button>':'');
}
function sortSheet(){SORTP=null;sheet('<b style="font-size:18px">Urutkan Paket</b><p class="mu" style="font-size:12px;line-height:1.6;margin:6px 0 0">Pilih satu urutan, lalu tekan tombol di bawah.</p><div id="sm">'+sortBody()+'</div>')}
function sortApply(always){if(!SORTP)return;SORT=SORTP;if(always){try{localStorage.setItem('kd_sort',SORTP)}catch(e){}window._sortTmp=false}else{window._sortTmp=true}closeM();render()}
function sortClear(){try{localStorage.removeItem('kd_sort')}catch(e){}SORT='new';window._sortTmp=false;closeM();render()}
const FILT51='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>';
const _pk51=paket;
paket=function(){
  const h=_pk51.apply(this,arguments);
  try{
    const act=!!(sortSaved()||window._sortTmp);
    const t=document.createElement('template');t.innerHTML=h;const r=t.content;
    const old=r.querySelector('.srtb')||r.querySelector('select');
    if(wide()){
      if(old)old.remove();
      const back=r.querySelector('button[onclick*="go(\'home\')"]');
      if(back){
        const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
        back.style.marginBottom='0';back.replaceWith(row);row.appendChild(back);
        const b=document.createElement('button');b.className='srti';b.setAttribute('onclick','sortSheet()');b.setAttribute('aria-label','Urutkan paket');b.title='Urutkan paket';
        b.innerHTML=FILT51+(act?'<i></i>':'');row.appendChild(b);
      }
    }else if(old){
      const b=document.createElement('button');b.className='srtb';b.setAttribute('onclick','sortSheet()');
      b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M7 12h10M10 17h4"/></svg><span>'+(act?SORTL51[SORT]:'Urutkan paket')+'</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
      old.replaceWith(b);
    }
    return t.innerHTML;
  }catch(e){return h}
};

/* (3) Layar potret: ujian & koreksi */
const GAP51=(p)=>numOf(p,p.qs.length-1);
function drw51(t){/* panel Daftar Nomor kembali ke setelan awal */}
function fxRow51(fx,hugLabelIdx){
  const row=fx.firstElementChild;if(!row)return;
  row.style.cssText='display:flex;gap:8px;align-items:center;justify-content:center';
  fx.className='fx fxe';fx.style.cssText='padding:10px 14px 14px';
}
const _ex51=exam;
exam=function(){
  const h=_ex51.apply(this,arguments);
  try{
    if(wide())return h;
    const t=document.createElement('template');t.innerHTML=h;
    const exw=t.content.querySelector('.exw'),fx=t.content.querySelector('.fx');
    if(!exw||!fx)return h;
    const p=P(E.id),k=[...exw.children],bar=k[0];
    const fin=[...bar.querySelectorAll('button')].find(b=>b.id!=='bk');
    if(fin)fin.style.cssText='height:36px;padding:0 4px;background:none;color:#ff5a72;font-size:13px;font-weight:700;letter-spacing:.3px;border-radius:0;flex:none;min-width:36px';
    const sp=k[1]&&[...k[1].querySelectorAll('span')].find(s=>/^dari/.test(s.textContent));
    if(sp)sp.textContent='dari '+GAP51(p);
    const tmr=exw.querySelector('.tmr');if(tmr)tmr.remove();
    const tm=document.createElement('div');tm.style.cssText='display:flex;align-items:center;justify-content:center;gap:8px;margin:16px 0 10px;color:var(--ac)';
    tm.innerHTML=CLK2+'<span style="font-size:12px;font-weight:600;color:var(--mu)">'+(E.end?'Sisa waktu':'Waktu berjalan')+'</span><b id="tm" style="font-size:18px;font-weight:800;letter-spacing:1px;color:var(--ac)">'+tm_()+'</b>';
    if(k[2])k[2].after(tm);
    if(k[3])k[3].style.marginTop='4px';
    if(k[4]&&/height/.test(k[4].getAttribute('style')||''))k[4].style.height='96px';
    const bs=[...fx.querySelectorAll('button')];
    if(bs.length===3){fxRow51(fx);bs[1].style.flex='none';bs[1].style.padding='0 22px';bs[2].style.padding='0 22px'}
    drw51(t);
    return t.innerHTML;
  }catch(e){return h}
};
const tm_=()=>{try{return tm()}catch(e){return ''}};

const _rv51=review;
review=function(){
  const h=_rv51.apply(this,arguments);
  try{
    const t=document.createElement('template');t.innerHTML=h;
    /* tanpa status kelulusan (LH & potret) */
    [...t.content.querySelectorAll('div,span,b')].filter(e=>e.children.length==0&&/^(TIDAK )?LULUS$/i.test(e.textContent.trim())&&!e.closest('button')).forEach(e=>{if(wide())e.remove()});
    if(wide())return t.innerHTML;
    const exw=t.content.querySelector('.exw'),fx=t.content.querySelector('.fx');
    if(!exw||!fx)return h;
    const p=P(CUR),k=[...exw.children],bar=k[0],n=p.qs.length,tp=qType(p,RV.i);
    const sc=bar.lastElementChild;if(sc&&sc.tagName!=='BUTTON'&&bar.children.length>2){sc.innerHTML='';sc.style.cssText='width:36px;height:36px;visibility:hidden;flex:none'}
    const dn=k[1].querySelector('button.dn');
    const card=k[3],kisiEl=card&&card.children[1],kisi=kisiEl?kisiEl.textContent:'';
    const head=document.createElement('div');head.style.cssText='margin-top:14px;width:100%;box-sizing:border-box';
    head.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%!important;max-width:none!important;flex:1 1 auto!important"><div style="min-width:0;flex:1"><div style="font-size:15px;font-weight:700;white-space:nowrap">SOAL NOMOR: '+numOf(p,RV.i)+' <span style="font-weight:500;color:var(--mu);font-size:12px">dari '+GAP51(p)+'</span></div></div></div><div style="height:4px;background:var(--cd);border-radius:4px;margin-top:10px;overflow:hidden"><div style="width:'+Math.round((RV.i+1)/n*100)+'%;height:100%;background:#346ef3;border-radius:4px"></div></div>';
    if(dn)head.firstChild.appendChild(dn);
    k[1].replaceWith(head);k[2].remove();
    if(kisiEl)kisiEl.remove();
    card.style.cssText='background:var(--cd);border:0;border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.55;margin-top:12px';
    card.insertAdjacentHTML('afterbegin','<div style="display:inline-block;font-size:11px;font-weight:700;color:#012AAB;background:#e6edff;padding:3px 8px;border-radius:6px;margin-bottom:8px">'+tp+(kisi?' · '+esc(kisi):'')+'</div>');
    if(k[4])k[4].style.margin='16px 0 10px';
    const bs=[...fx.querySelectorAll('button')];
    if(bs.length===2){
      const pv=bs[0],nx=bs[1];
      pv.setAttribute('aria-label','Soal sebelumnya');
      pv.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
      pv.style.cssText='flex:0 0 auto;width:44px;height:44px;border-radius:6px;border:1.5px solid #777;background:var(--bg);color:#444;padding:0;display:grid;place-items:center';
      nx.style.cssText='flex:none;height:44px;padding:0 22px;border-radius:6px;font-size:12.5px;font-weight:700;background:#ffc619;color:#111';
      fxRow51(fx);
    }
    drw51(t);
    return t.innerHTML;
  }catch(e){return h}
};

/* LH: ikon urutkan ungu di kanan atas Daftar Paket, sejajar tombol Beranda (tombol ini dibuat setelah render, jadi dipasang di sini) */
const _lap51=lap;
lap=function(){
  _lap51.apply(this,arguments);
  try{
    if(!wide()||V!=='paket'||document.querySelector('.srti'))return;
    const root=document.getElementById('bdp')||document.getElementById('pfp')||document.getElementById('app');
    const back=[...root.querySelectorAll('button')].find(b=>/go\('home'\)/.test(b.getAttribute('onclick')||''));
    if(!back||back.parentElement.dataset.srow)return;
    const row=document.createElement('div');row.dataset.srow='1';row.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';
    back.style.marginBottom='0';back.replaceWith(row);row.appendChild(back);
    const act=!!(sortSaved()||window._sortTmp);
    const b=document.createElement('button');b.className='srti';b.setAttribute('onclick','sortSheet()');b.setAttribute('aria-label','Urutkan paket');b.title='Urutkan paket';
    b.innerHTML=FILT51+(act?'<i></i>':'');row.appendChild(b);
  }catch(e){}
};
queueMicrotask(__legacyRender);

/* ================= blok 11 / 23 (baris 1656) ================= */
(function(){
  const REF=360;
  const isPortrait=()=>matchMedia('(orientation:portrait)').matches;
  /* 1) Potret: matikan semua aturan "lebar minimum" (penyesuaian tablet/desktop) agar tampilan = standar HP.
        Di layar horizontal aturan itu dikembalikan seperti semula. */
  const ORIG=new WeakMap();
  function tabletRules(portrait){
    try{
      for(const ss of document.styleSheets){
        let rules;try{rules=ss.cssRules}catch(e){continue}
        for(const r of rules){
          if(r.type!==4)continue;
          if(!ORIG.has(r))ORIG.set(r,r.media.mediaText);
          const o=ORIG.get(r),kill=portrait&&/min-width/.test(o)&&!/landscape/.test(o);
          const want=kill?'not all':o;
          if(r.media.mediaText!==want)r.media.mediaText=want;
        }
      }
    }catch(e){}
  }
  /* 2) Skala serentak: lebar virtual selalu REF px, lalu diperbesar sebesar lebar layar / REF. */
  function applyScale(){
    const por=isPortrait();
    tabletRules(por);
    const de=document.documentElement;
    let z=1;
    if(por){z=innerWidth/REF;if(Math.abs(z-1)<0.03)z=1}
    de.style.setProperty('--zz',String(z));
    window._z=z;
  }
  const _rd52=render;
  render=function(){applyScale();return _rd52.apply(this,arguments)};
  addEventListener('resize',()=>{applyScale();try{fitCards()}catch(e){}});
  addEventListener('orientationchange',()=>setTimeout(()=>{applyScale();try{render()}catch(e){}},200));
  applyScale();queueMicrotask(__legacyRender);
})();

/* ================= blok 12 / 23 (baris 1700) ================= */
(function(){
  const REF=360;
  const isPortrait=()=>matchMedia('(orientation:portrait)').matches;
  /* 1) Potret: matikan semua aturan "lebar minimum" (penyesuaian tablet/desktop) agar tampilan = standar HP.
        Di layar horizontal aturan itu dikembalikan seperti semula. */
  const ORIG=new WeakMap();
  function tabletRules(portrait){
    try{
      for(const ss of document.styleSheets){
        let rules;try{rules=ss.cssRules}catch(e){continue}
        for(const r of rules){
          if(r.type!==4)continue;
          if(!ORIG.has(r))ORIG.set(r,r.media.mediaText);
          const o=ORIG.get(r),kill=portrait&&/min-width/.test(o)&&!/landscape/.test(o);
          const want=kill?'not all':o;
          if(r.media.mediaText!==want)r.media.mediaText=want;
        }
      }
    }catch(e){}
  }
  /* 2) Skala serentak: lebar virtual selalu REF px, lalu diperbesar sebesar lebar layar / REF. */
  function applyScale(){
    const por=isPortrait();
    tabletRules(por);
    const de=document.documentElement;
    let z=1;
    if(por){z=innerWidth/REF;if(Math.abs(z-1)<0.03)z=1}
    de.style.setProperty('--zz',String(z));
    window._z=z;
  }
  const _rd52=render;
  render=function(){applyScale();return _rd52.apply(this,arguments)};
  addEventListener('resize',()=>{applyScale();try{fitCards()}catch(e){}});
  addEventListener('orientationchange',()=>setTimeout(()=>{applyScale();try{render()}catch(e){}},200));
  applyScale();queueMicrotask(__legacyRender);
})();

/* ================= blok 13 / 23 (baris 1749) ================= */
const DNST53='height:36px;padding:0 12px;background:#e6edff;color:#012AAB;font-size:12px;font-weight:700;border-radius:8px;white-space:nowrap;flex:none';
function catx53(root,txt){if(!txt)return;const d=document.createElement('div');d.className='catx';d.textContent=txt;root.appendChild(d)}
function chipOut53(scope){
  const chip=[...scope.querySelectorAll('div')].find(d=>/e6edff/.test(d.getAttribute('style')||'')&&/inline-block/.test(d.getAttribute('style')||''));
  if(!chip)return '';const tx=chip.textContent.trim();chip.remove();return tx;
}
const _ex53=exam;
exam=function(){
  const h=_ex53.apply(this,arguments);
  try{
    if(wide()){const tw=document.createElement('template');tw.innerHTML=h;catx53(tw.content,P(E.id).name);return tw.innerHTML}
    const t=document.createElement('template');t.innerHTML=h;
    const exw=t.content.querySelector('.exw');if(!exw)return h;
    const k=[...exw.children],bar=k[0];
    const head=k.find(c=>/^SOAL NOMOR/.test(c.textContent.trim()));
    const tmEl=exw.querySelector('#tm'),tmd=tmEl&&tmEl.parentElement;
    const dn=head&&head.querySelector('button.dn');
    const fin=[...bar.querySelectorAll('button')].find(b=>b.id!=='bk');
    if(!head||!dn||!tmd||!fin)return h;
    /* Akhiri -> baris nomor soal (tempat awal Daftar Nomor), tetap berupa teks merah */
    fin.style.cssText='height:36px;padding:0 2px;background:none;color:#e11d48;font-size:13px;font-weight:700;letter-spacing:.3px;border-radius:0;flex:none;white-space:nowrap';
    const sp=document.createElement('div');sp.style.cssText='width:36px;height:36px;flex:none;visibility:hidden';
    fin.replaceWith(sp);
    head.firstElementChild.appendChild(fin);
    /* Daftar Nomor -> sebelah timer, sejajar */
    dn.style.cssText=DNST53;
    const grp=document.createElement('div');grp.style.cssText='display:flex;align-items:center;gap:8px;min-width:0';
    while(tmd.firstChild)grp.appendChild(tmd.firstChild);
    tmd.appendChild(grp);tmd.appendChild(dn);
    tmd.style.justifyContent='space-between';
    /* bar progres: awalnya merah semua (belum terjawab), hijau di nomor yang sudah dijawab; yang dilewati tetap merah */
    return t.innerHTML;
  }catch(e){return h}
};
const _rv53=review;
review=function(){
  const h=_rv53.apply(this,arguments);
  try{
    const t=document.createElement('template');t.innerHTML=h;
    const exw=t.content.querySelector('.exw');if(!exw)return h;
    const k=[...exw.children];
    if(wide()){catx53(t.content,P(CUR).name);return t.innerHTML}
    const head=k.find(c=>/^SOAL NOMOR/.test(c.textContent.trim()));
    const dn=head&&head.querySelector('button.dn');
    const jw=k.find(c=>/^Jawabanmu/.test(c.textContent.trim()));
    if(!head||!dn||!jw)return h;
    dn.style.cssText=DNST53;
    const keepMargin=jw.getAttribute('style')||'';
    const lab=document.createElement('div');lab.style.cssText='font-weight:700;font-size:13px';lab.textContent=jw.textContent.trim();
    jw.innerHTML='';jw.appendChild(lab);jw.appendChild(dn);
    jw.style.cssText=keepMargin+';display:flex;align-items:center;justify-content:space-between;gap:10px';
    return t.innerHTML;
  }catch(e){return h}
};
queueMicrotask(__legacyRender);

/* ================= blok 14 / 23 (baris 1831) ================= */
const SV54=(d,s)=>'<svg width="'+(s||24)+'" height="'+(s||24)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
const IC54={
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  paket:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  profil:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  skd:'<path d="M9 4h6v3H9z"/><path d="M7 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"/><path d="M8 12h8M8 16h5"/>',
  twk:'<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  tiu:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  tkp:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4 2 4 5"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5L5 20"/>',
  moon:'<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  star:'<path d="M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.7z"/>'
};
function post54(){
  try{
    const app=document.getElementById('app');if(!app)return;
    /* ikon tombol Lihat Lainnya & Keluar (semua layar) */
    const lm=app.querySelector('#lm button');
    if(lm&&!lm.dataset.ic){lm.dataset.ic='1';lm.style.cssText+=';display:flex;align-items:center;justify-content:center;gap:8px';lm.innerHTML=SV54('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',18)+'<span>'+lm.textContent.trim()+'</span>'}
    const kb=[...app.querySelectorAll('button,[onclick]')].find(e=>e.children.length<=1&&/^Keluar/i.test(e.textContent.trim())&&!e.dataset.ic);
    if(kb){kb.dataset.ic='1';kb.style.display='flex';kb.style.margin='0 auto';kb.style.alignItems='center';kb.style.justifyContent='center';kb.style.gap='8px';kb.innerHTML='<span style="color:#e11d48;display:grid">'+SV54('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',18)+'</span><span>'+kb.textContent.trim()+'</span>'}
    if(wide())return;
    /* menu bawah: ikon di atas setiap judul */
    app.querySelectorAll('.nav>div:not(.nv54)').forEach(d=>{
      const oc=d.getAttribute('onclick')||'';const k=/'paket'/.test(oc)?'paket':/'profil'/.test(oc)?'profil':'home';
      d.classList.add('nv54');d.innerHTML=SV54(IC54[k],22)+'<span>'+d.textContent.trim()+'</span>';
    });
    if(V==='home'){
      const ef=[...app.querySelectorAll('button')].find(b=>/Edit Foto/.test(b.textContent));
      if(ef&&!ef.parentElement.dataset.wp54){
        const row=document.createElement('div');row.dataset.wp54='1';
        row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px';
        ef.replaceWith(row);row.appendChild(ef);
        const dk=isDark54();
        const bs='height:36px;border-radius:18px;border:1.5px solid #7c3aed;color:#7c3aed;background:var(--bg);display:flex;align-items:center;justify-content:center;gap:6px;font-size:13px;font-weight:600;padding:0';
        const g=document.createElement('div');g.style.cssText='display:flex;align-items:center;gap:8px';
        g.innerHTML='<button onclick="wpSheet()" aria-label="Wallpaper" style="'+bs+';padding:0 12px">'+SV54(IC54.img,18)+'<span>Wallpaper</span></button>'
          +'<button onclick="toggleDark54()" aria-label="'+(dk?'Mode terang':'Mode gelap')+'" style="'+bs+';width:36px">'+SV54(dk?IC54.sun:IC54.moon,18)+'</button>';
        row.appendChild(g);
      }
      /* kategori try out: 4 kotak ikon ringkas, banner tetap dominan */
      const big=app.querySelector('button.big'),g3=app.querySelector('.g3');
      if(big&&g3&&!app.querySelector('.tiles54')){
        const w=document.createElement('div');w.className='tiles54';
        const tl=(k,t)=>'<button class="tile54" onclick="TAB=\''+k.toUpperCase()+'\';go(\'kat\')"><span class="ic54">'+SV54(IC54.skd,22)+'</span><b>'+t+'</b></button>';
        w.innerHTML='<div style="margin:22px 0 10px"><b style="font-size:18px">Pilih Try Out</b></div><div class="g4t">'+tl('skd','SKD')+tl('twk','TWK')+tl('tiu','TIU')+tl('tkp','TKP')+'</div>';
        big.replaceWith(w);g3.remove();
      }
    }
  }catch(e){}
}
const _rd54=render;
render=function(){const r=_rd54.apply(this,arguments);post54();return r};
queueMicrotask(__legacyRender);

/* ================= blok 15 / 23 (baris 1900) ================= */
/* mode gelap */
function isDark54(){const t=document.documentElement.dataset.theme;return t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches)}
function toggleDark54(){try{localStorage.setItem('kd_dark',isDark54()?'0':'1')}catch(e){}applyTheme54();render()}
function applyTheme54(){let d=null;try{d=localStorage.getItem('kd_dark')}catch(e){}if(d==='1')document.documentElement.dataset.theme='dark';else if(d==='0')document.documentElement.dataset.theme='light'}
/* wallpaper siswa: disimpan per akun di perangkat */
const wpKey54=()=>'kd_wp:'+((S.me&&S.me.e)||'');
function getWp54(){try{return S.me?localStorage.getItem(wpKey54()):null}catch(e){return null}}
function wpSheet(){
  const has=!!getWp54();
  sheet('<b style="font-size:18px">Wallpaper</b><p class="mu" style="font-size:12px;line-height:1.6;margin:6px 0 0">Pasang foto dari galeri sebagai latar aplikasi. Foto dipotong otomatis sesuai ukuran layar. Wallpaper tidak tampil di halaman soal, koreksi, dan hasil.</p>'
   +'<button style="width:100%;height:46px;margin-top:16px;background:#346ef3;color:#fff;font-weight:700" onclick="wpPick()">PILIH DARI GALERI</button>'
   +(has?'<button style="width:100%;height:46px;margin-top:8px;background:var(--bg);color:#e11d48;border:1.5px solid #e11d48;font-weight:700" onclick="wpDel()">HAPUS WALLPAPER</button>':''));
}
function wpPick(){closeM();crop(Math.min(.62,innerWidth/innerHeight),720,'jpeg','Potong Wallpaper',d=>{try{localStorage.setItem(wpKey54(),d)}catch(e){toast('Wallpaper terlalu besar untuk disimpan')}render()})}
function wpDel(){try{localStorage.removeItem(wpKey54())}catch(e){}closeM();render()}
function applyWp54(){
  try{
    const wp=getWp54(),por=matchMedia('(orientation:portrait)').matches&&!wide();
    const hide=['exam','review','result','auth'].includes(V)||!por;
    let el=document.getElementById('cwp');
    if(wp&&!hide){
      if(!el){el=document.createElement('div');el.id='cwp';document.body.appendChild(el)}
      if(el.dataset.src!==wp){el.dataset.src=wp;el.style.backgroundImage='url('+wp+')'}
      document.body.classList.add('wp54');
    }else{if(el)el.remove();document.body.classList.remove('wp54')}
  }catch(e){}
}
applyTheme54();
const _rd57=render;
render=function(){applyTheme54();const r=_rd57.apply(this,arguments);applyWp54();return r};
/* tombol bawah (soal sebelumnya/simpan/lewati/selanjutnya): bereaksi saat disentuh agar bisa di-spam cepat walau layar dirender ulang */
(function(){
  let t=0;
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest&&e.target.closest('.fx button');
    if(!b||b.disabled||e.button>0)return;
    t=Date.now();b.click();
  },true);
  document.addEventListener('click',e=>{
    if(Date.now()-t<600&&e.isTrusted&&e.target.closest&&e.target.closest('.fx button')){e.stopPropagation();e.preventDefault()}
  },true);
})();
queueMicrotask(__legacyRender);

/* ================= blok 16 / 23 (baris 1977) ================= */
/* ===== Mode gelap: garis, bukan blok warna ===== */

function lines58(){
  try{
    if(!isDark54())return;
    document.querySelectorAll('.exw [onclick*="pick"],.exw [style*="min-height"],#lz [onclick*="pick"],#lz [style*="min-height"]').forEach(e=>{
      if(e.classList.contains('ln58'))return;
      const cs=getComputedStyle(e);
      if(cs.display!=='flex'||parseFloat(cs.minHeight)<40||!e.querySelector('div,span'))return;
      if(/var\(--bd\)/.test(e.getAttribute('style')||''))return;
      e.classList.add('ln58');
    });
  }catch(e){}
}

/* ===== Arena beranda (potret) ===== */
const isPor58=()=>matchMedia('(orientation:portrait)').matches&&!wide();
function arena58(){
  try{
    const app=document.getElementById('app');
    if(!app||V!=='home'||!isPor58()){return}
    let a=app.querySelector('#arena58');
    if(!a){
      const t=app.querySelector('.tiles54');if(!t)return;
      const last=app.querySelector('#lm')||app.querySelector('#ls');if(!last)return;
      a=document.createElement('div');a.id='arena58';t.before(a);
      const nodes=[];for(let e=t;e;e=e.nextElementSibling){if(e===a)continue;nodes.push(e);if(e===last)break}
      nodes.forEach(n=>a.appendChild(n));
    }
    const wp=getWp54();let w=a.querySelector('.wpin58');
    if(wp){if(!w){w=document.createElement('div');w.className='wpin58';a.insertBefore(w,a.firstChild)}
      if(w.dataset.src!==wp){w.dataset.src=wp;w.style.backgroundImage='url('+wp+')'}}
    else if(w)w.remove();
  }catch(e){}
}

/* ===== Kaca pada elemen berlatar solid ===== */
function glass58(){
  try{
    const app=document.getElementById('app');if(!app)return;
    const on=document.body.classList.contains('wp54');
    if(!on){app.querySelectorAll('[data-g58]').forEach(e=>{e.removeAttribute('data-g58');e.classList.remove('gl58w','gl58k','gl58c','wh58');e.style.removeProperty('--gc')});return}
    const dk=isDark54(),vh=innerHeight;
    app.querySelectorAll('.th').forEach(e=>{
      if(e.dataset.g58)return;
      const st=e.getAttribute('style')||'';
      if(/url\(\s*\)/.test(st)||!/url\([^)]+\)/.test(st)){e.dataset.g58='1';e.classList.add(dk?'gl58k':'gl58w')}
    });
    app.querySelectorAll('.row,input,.tile54').forEach(e=>{
      if(e.dataset.g58)return;e.dataset.g58='1';
      e.classList.add(dk?'gl58k':'gl58w');
      if(dk)e.classList.add('wh58');
    });
    app.querySelectorAll('*').forEach(e=>{
      if(e.dataset.g58)return;e.dataset.g58='1';
      if(e.closest('svg')||e.tagName==='IMG'||e.id==='arena58'||e.classList.contains('wpin58'))return;
      const cs=getComputedStyle(e);if(cs.backgroundImage!=='none')return;
      const m=cs.backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);if(!m)return;
      const al=m[4]==null?1:parseFloat(m[4]);if(al<.5)return;
      if(e.getBoundingClientRect().height>vh*.8)return;
      const r=+m[1],g=+m[2],b=+m[3],lum=(r+g+b)/3,sat=Math.max(r,g,b)-Math.min(r,g,b);
      const neutral=sat<40;
      if(dk&&neutral){
        e.classList.add('gl58k');
        const tc=cs.color.match(/[\d.]+/g)||[255,255,255],tl=(+tc[0]+ +tc[1]+ +tc[2])/3;
        if(tl<150||(e.tagName==='BUTTON'&&tl<200))e.classList.add('wh58');
      }else if(!dk&&neutral&&lum>200){e.classList.add('gl58w')}
      else{e.style.setProperty('--gc',r+','+g+','+b);e.classList.add('gl58c')}
    });
  }catch(e){}
}

/* ===== Penyatuan ===== */
function post58(){
  document.body.classList.toggle('home58',!!(document.body.classList.contains('wp54')&&V==='home'&&isPor58()));
  arena58();glass58();lines58();
}
(function(){
  const _w=applyWp54;
  applyWp54=function(){
    /* wallpaper tidak tampil di soal, koreksi, hasil, riwayat */
    const keep=V;
    if(V==='riwayat'){V='result';try{_w()}finally{V=keep}}else _w();
  };
})();
const _rd58=render;
render=function(){const r=_rd58.apply(this,arguments);post58();return r};
(function(){
  let q=0;
  const go=()=>{cancelAnimationFrame(q);q=requestAnimationFrame(post58)};
  const app=document.getElementById('app');
  if(app)new MutationObserver(go).observe(app,{childList:true,subtree:true});
  addEventListener('resize',go);
})();
queueMicrotask(__legacyRender);

/* ================= blok 17 / 23 (baris 2101) ================= */
/* Mode gelap: tombol Daftar Nomor & label kisi-kisi jadi outline tembus */

function tg58(){
  try{
    if(!isDark54())return;
    document.querySelectorAll('.exw div').forEach(e=>{
      if(e.children.length||e.classList.contains('tg58')||!e.textContent.trim())return;
      if(getComputedStyle(e).backgroundColor==='rgb(230, 237, 255)')e.classList.add('tg58');
    });
  }catch(e){}
}
/* Mode gelap: kotak nomor & legenda = garis hitam, angka berwarna */
function tiles58(){
  try{
    if(!isDark54())return;
    document.querySelectorAll('.dc,span[style*="width:24px"][style*="border-radius:6px"]').forEach(e=>{
      let c=e.dataset.c58;if(c==='x')return;
      if(!c){const bg=getComputedStyle(e).backgroundColor;
        if(bg==='rgb(213, 216, 222)'||bg==='transparent'||/^rgba\(.*,\s*0\)$/.test(bg)){e.dataset.c58='x';return}
        c=bg;e.dataset.c58=c}
      [['background','transparent'],['border','2px solid #000'],['color',c],['box-shadow','none'],['text-shadow','none'],['box-sizing','border-box']].forEach(a=>e.style.setProperty(a[0],a[1],'important'));
    });
  }catch(e){}
}
/* Kaca hanya untuk LATAR (kartu, kolom, menu bawah). Tombol (Beli, Deskripsi, Lihat Lainnya, dll) tetap warna asli */
function glass58(){
  try{
    const app=document.getElementById('app');if(!app)return;
    const on=document.body.classList.contains('wp54');
    if(!on){app.querySelectorAll('[data-g58]').forEach(e=>{e.removeAttribute('data-g58');e.classList.remove('gl58w','gl58k','gl58c','wh58');e.style.removeProperty('--gc')});return}
    const dk=isDark54(),vh=innerHeight;
    app.querySelectorAll('.th,.row,input,.tile54').forEach(e=>{
      if(e.dataset.g58)return;
      if(e.classList.contains('th')){const st=e.getAttribute('style')||'';if(!(/url\(\s*\)/.test(st)||!/url\([^)]+\)/.test(st)))return}
      e.dataset.g58='1';e.classList.add(dk?'gl58k':'gl58w');if(dk)e.classList.add('wh58');
    });
    app.querySelectorAll('*').forEach(e=>{
      if(e.dataset.g58)return;e.dataset.g58='1';
      if(e.tagName==='BUTTON'||e.closest('button')||e.closest('svg')||e.tagName==='IMG'||e.id==='arena58'||e.classList.contains('wpin58'))return;
      const cs=getComputedStyle(e);if(cs.backgroundImage!=='none')return;
      const m=cs.backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);if(!m)return;
      if((m[4]==null?1:parseFloat(m[4]))<.5)return;
      if(e.getBoundingClientRect().height>vh*.8)return;
      const r=+m[1],g=+m[2],b=+m[3],lum=(r+g+b)/3,sat=Math.max(r,g,b)-Math.min(r,g,b);
      if(sat>=40)return;
      if(dk){e.classList.add('gl58k');const tc=cs.color.match(/[\d.]+/g)||[255,255,255];if((+tc[0]+ +tc[1]+ +tc[2])/3<150)e.classList.add('wh58')}
      else if(lum>200)e.classList.add('gl58w');
    });
  }catch(e){}
}
function post58(){
  const wp=document.body.classList.contains('wp54');
  document.body.classList.toggle('dk58',isDark54());
  document.body.classList.toggle('home58',!!(wp&&V==='home'&&isPor58()));
  arena58();glass58();lines58();tiles58();tg58();
}
/* Transisi antar menu utama (potret) */
let _pv59=V;
const TABS59=['home','paket','profil'];
const _rd59=render;
render=function(){
  const from=_pv59;
  const r=_rd59.apply(this,arguments);
  _pv59=V;
  try{
    if(from!==V&&TABS59.includes(from)&&TABS59.includes(V)&&isPor58()&&!matchMedia('(prefers-reduced-motion:reduce)').matches)slide59(TABS59.indexOf(V)>TABS59.indexOf(from)?1:-1);
  }catch(e){}
  return r;
};

/* ===== Tema gelap & wallpaper hanya untuk potret; layar horizontal selalu default (terang) ===== */
function applyTheme54(){
  let d=null;try{d=localStorage.getItem('kd_dark')}catch(e){}
  const por=matchMedia('(orientation:portrait)').matches;
  document.documentElement.dataset.theme=(por&&d==='1')?'dark':(!por||d==='0')?'light':(document.documentElement.dataset.theme||'');
  if(por&&d!=='1'&&d!=='0')delete document.documentElement.dataset.theme;
}
matchMedia('(orientation:portrait)').addEventListener('change',()=>{applyTheme54();try{post58()}catch(e){}});
applyTheme54();

/* ===== Transisi geser ke samping (cepat) antar menu utama ===== */
function slide59(dir){
  const a=document.getElementById('app');if(!a||!a.animate)return;
  const els=[...a.children].filter(c=>!c.classList.contains('nav')&&c.id!=='cwp'&&['static','relative'].includes(getComputedStyle(c).position));
  const hs=[document.documentElement,document.body];
  hs.forEach(h=>h.style.overflowX='hidden');
  let left=els.length;
  const done=()=>{if(--left<=0)hs.forEach(h=>h.style.removeProperty('overflow-x'))};
  if(!els.length){hs.forEach(h=>h.style.removeProperty('overflow-x'));return}
  els.forEach(el=>{
    const wasStatic=getComputedStyle(el).position==='static';
    if(wasStatic)el.style.position='relative';
    const an=el.animate([{left:(dir*100)+'%',opacity:.4},{left:'0%',opacity:1}],{duration:240,easing:'cubic-bezier(.22,.9,.3,1)'});
    const end=()=>{if(wasStatic)el.style.removeProperty('position');done()};
    an.onfinish=end;an.oncancel=end;
  });
}
queueMicrotask(__legacyRender);

/* ================= blok 18 / 23 (baris 2232) ================= */
/* ===== Wallpaper: sembunyikan sementara + level blur ===== */
const wpHK59=()=>'kd_wph:'+((S.me&&S.me.e)||''),wpBK59=()=>'kd_wpb:'+((S.me&&S.me.e)||'');
const wpRaw59=()=>{try{return S.me?localStorage.getItem(wpKey54()):null}catch(e){return null}};
const wpHid59=()=>{try{return localStorage.getItem(wpHK59())==='1'}catch(e){return false}};
const wpLvl59=()=>{try{const v=parseInt(localStorage.getItem(wpBK59()),10);return v>=1&&v<=5?v:5}catch(e){return 5}};
getWp54=function(){return wpHid59()?null:wpRaw59()};
function applyLvl59(){document.body.style.setProperty('--wbl',((wpLvl59()-1)/4).toFixed(2))}
function wpBlur59(v){try{localStorage.setItem(wpBK59(),String(v))}catch(e){}applyLvl59()}
function wpToggle59(){try{localStorage.setItem(wpHK59(),wpHid59()?'0':'1')}catch(e){}closeM();render();wpSheet()}
wpDel=function(){try{localStorage.removeItem(wpKey54());localStorage.removeItem(wpHK59())}catch(e){}closeM();render()};
wpSheet=function(){
  const raw=!!wpRaw59(),hid=wpHid59(),L=wpLvl59();
  const bt='height:46px;font-weight:700;font-size:13px;';
  sheet('<b style="font-size:18px">Wallpaper</b><p class="mu" style="font-size:12px;line-height:1.6;margin:6px 0 0">Pasang foto dari galeri sebagai latar aplikasi. Foto dipotong otomatis sesuai ukuran layar. Wallpaper tidak tampil di halaman soal, koreksi, dan hasil.</p>'
   +'<button style="width:100%;margin-top:16px;background:#346ef3;color:#fff;'+bt+'" onclick="wpPick()">PILIH DARI GALERI</button>'
   +(raw?'<div style="display:flex;gap:8px;margin-top:8px"><button style="flex:1;background:var(--bg);color:#e11d48;border:1.5px solid #e11d48;'+bt+'" onclick="wpDel()">HAPUS</button><button style="flex:1;background:var(--bg);color:#7c3aed;border:1.5px solid #7c3aed;'+bt+'" onclick="wpToggle59()">'+(hid?'TAMPILKAN':'SEMBUNYIKAN')+'</button></div>'
   +'<div style="margin-top:20px;font-size:12px;font-weight:700">Blur di luar kotak</div><div style="position:relative;margin-top:8px;height:34px"><input class="wprg59" type="range" min="1" max="5" step="1" value="'+L+'" oninput="wpBlur59(this.value)"><div class="wptk59"><i></i><i></i><i></i><i></i><i></i></div></div>':''));
};

/* ===== Aturan batal ujian: maks. 1 menit DAN maks. 2 soal sebelum soal ke-3 tampil ===== */
const seen59=()=>E&&E.seen?Object.keys(E.seen).length:0;
const _ce59=cancelEx;
cancelEx=function(){if(E&&seen59()>=3)return;return _ce59.apply(this,arguments)};
function cancelGuard59(){
  try{
    if(V!=='exam'||!E)return;
    E.seen=E.seen||{};
    if(!E.seen[E.i]){E.seen[E.i]=1;save()}
    if(seen59()>=3){const b=document.getElementById('bk');if(b){b.disabled=true;b.classList.add('dis')}}
  }catch(e){}
}

/* ===== Teleport bagian (TWK/TIU/TKP) di panel Daftar Nomor, hanya potret ===== */
const SEC59=[['TWK',0],['TIU',30],['TKP',65]];
function tp59go(n){const t=[...document.querySelectorAll('.dc')].find(e=>e.textContent.trim()===String(n));if(t)t.click()}
function tele59(){
  try{
    if(!isPor58()||document.getElementById('tp59'))return;
    const b=[...document.querySelectorAll('#app b')].find(x=>x.textContent.trim()==='Daftar Nomor');if(!b)return;
    const hd=b.parentElement;if(!hd||!hd.querySelector('button'))return;
    const id=V==='exam'&&E?E.id:CUR,p=id!=null?P(id):null;if(!p)return;
    const skd=p.type==='SKD',ci=V==='exam'&&E?E.i:(typeof RV!=='undefined'&&RV?RV.i:0),cur=skd?qType(p,ci):null;
    const row=document.createElement('div');row.id='tp59';
    row.innerHTML=SEC59.map(x=>'<button '+(skd?'':'disabled ')+'class="'+(cur===x[0]?'on':'')+'" onclick="tp59go('+(x[1]+1)+')">'+x[0]+'</button>').join('');
    hd.before(row);
  }catch(e){}
}

/* ===== Promo: nilai POTONGAN harga (bukan harga akhir) ===== */
function setCut59(v){const p=P(ED);p.promoCut=Math.max(0,+v||0);save();const e=document.getElementById('cut59');if(e){const b=p.promo||p.price;e.textContent='Harga akhir dengan kode promo: '+rp(Math.max(0,b-p.promoCut))}}
const _pp59=pkgPage;
pkgPage=function(){
  let h=_pp59.apply(this,arguments);
  try{
    const p=P(ED),b=p.promo||p.price,cut=p.promoCut!=null?p.promoCut:(p.promoPrice>0?Math.max(0,b-p.promoPrice):0);
    h=h.replace('Nominal promo (harga saat kode promo dipakai)','Potongan harga saat kode promo dipakai (Rp)')
       .replace(/value="[^"]*" oninput="P\(ED\)\.promoPrice=\+this\.value;save\(\)"/,'value="'+(cut||'')+'" oninput="setCut59(this.value)"')
       .replace('Satu harga untuk semua kode promo di paket ini.','<span id="cut59">Harga akhir dengan kode promo: '+rp(Math.max(0,b-cut))+'</span>. Dikurangkan dari harga yang berlaku (setelah diskon bila ada). Berlaku untuk semua kode promo di paket ini.');
  }catch(e){}
  return h;
};
const _tgp59=togglePromo;
togglePromo=function(){const p=P(ED);
  try{const inp=document.querySelector('input[oninput*="setCut59"]');if(inp&&inp.value!==''){const v=Math.abs(+inp.value||0);if(v!==p.promoCut){p.promoCut=v;save()}}}catch(e){}
  if(!p.promoOn&&!(p.promoCut>0))return toast('Isi potongan promo dulu');
  return _tgp59.apply(this,arguments)};

/* ===== Penjualan: hanya pembelian nyata (bukan simulasi/operator) ===== */
const _pd59=paid;
paid=function(){
  const p=CUR!=null?P(CUR):null,real=!!(p&&!OP&&!p.sim),had=!!(p&&S.owned[p.id]);
  const r=_pd59.apply(this,arguments);
  try{if(p&&real&&!had&&S.owned[p.id]){S.sales=S.sales||[];S.sales.push({pid:p.id,t:Date.now(),u:S.me&&S.me.e||''});save()}}catch(e){}
  return r;
};
function badges59(){
  try{
    if(!OP)return;
    document.querySelectorAll('#app .row').forEach(r=>{
      if(r.querySelector('.sold59'))return;
      const m=(r.innerHTML.match(/desc\((\d+)\)/)||[])[1];if(!m)return;
      const price=[...r.querySelectorAll('b')].reverse().find(x=>/^Rp/.test(x.textContent.trim()))||r.querySelector('.mu');if(!price)return;
      const n=(S.sales||[]).filter(x=>String(x.pid)===m).length;
      const sp=document.createElement('span');sp.className='sold59';const pk=P(m),am=pk&&pk.amal,au=(S.amalU&&S.amalU[m]||[]).length,useA=!!(am&&(am.on||(am.users&&am.users.length)||(am.groups&&am.groups.length)||am.min))||au>0;sp.textContent=n+'\u00d7 dibeli'+(useA?' \u00b7 '+au+' amal':'');price.after(sp);
    });
  }catch(e){}
}

/* ===== Profil: Try Out selesai = jumlah pengerjaan (termasuk ulang & diakhiri lebih awal) ===== */
const doneKey59=()=>(S.me&&S.me.e)||'';
const doneCnt59=()=>{S.done=S.done||{};const k=doneKey59();if(S.done[k]!=null)return S.done[k];return Object.values(S.hist||{}).reduce((a,h)=>a+(h?h.length:0),0)};
const _fn59=finish;
finish=function(){const ok=!!E,base=ok?doneCnt59():0;_fn59.apply(this,arguments);if(ok){S.done=S.done||{};S.done[doneKey59()]=base+1;save()}};
function doneFix59(){
  try{
    if(V!=='profil'&&V!=='profile')return;
    document.querySelectorAll('#app .mu,#app div').forEach(e=>{
      if(e.children.length||e.textContent.trim()!=='Try Out selesai')return;
      const n=e.previousElementSibling;if(n&&String(n.textContent).trim()!==String(doneCnt59()))n.textContent=doneCnt59();
    });
  }catch(e){}
}

function post58(){
  const wp=document.body.classList.contains('wp54');
  document.body.classList.toggle('dk58',isDark54());
  document.body.classList.toggle('home58',!!(wp&&V==='home'&&isPor58()));
  applyLvl59();
  arena58();glass58();lines58();tiles58();tg58();
  cancelGuard59();tele59();badges59();doneFix59();
}
queueMicrotask(__legacyRender);

/* ================= blok 19 / 23 (baris 2362) ================= */
/* ===== Paket simulasi harus punya soal agar bisa dimainkan ===== */
function fixSim62(){try{let ch=0;(S.packages||[]).forEach(p=>{if(p.sim&&(!p.qs||!p.qs.length)){p.qs=gen(p.type);ch=1}});if(ch)save()}catch(e){}}
fixSim62();

/* ===== Potongan promo berawalan "Rp −" ===== */
setCut59=function(v){const p=P(ED);p.promoCut=Math.abs(+v||0);save();const e=document.getElementById('cut59');if(e){const b=p.promo||p.price;e.textContent='Harga akhir dengan kode promo: '+rp(Math.max(0,b-p.promoCut))}};
const _pp62=pkgPage;
pkgPage=function(){
  let h=_pp62.apply(this,arguments);
  try{h=h.replace(/<b style="margin-right:8px">Rp<\/b>(<input type=number min=0 value="[^"]*" oninput="setCut59)/,'<b style="margin-right:8px;white-space:nowrap">Rp \u2212</b>$1').replace('Potongan harga saat kode promo dipakai (Rp)','Potongan harga promo (dikurangkan dari harga)').replace(/<input type=number min=0 (value="[^"]*" oninput="setCut59)/,'<input type=number placeholder="4000" $1')}catch(e){}
  return h;
};


/* ===== rev63: kolom promo = potongan (Rp −), diatur per paket ===== */
const _sh63=starHtml;
starHtml=function(p){
  let h=_sh63.apply(this,arguments);
  try{
    const b=p.promo||p.price;
    const cut=p.promoCut!=null?p.promoCut:(p.promoPrice>0?Math.max(0,b-p.promoPrice):0);
    h=h.replace('Nominal promo (harga saat kode promo dipakai)','Potongan harga promo (minus dari harga)');
    h=h.replace(/<b style="margin-right:8px">Rp<\/b><input type=number min=0 value="[^"]*" oninput="((?:tmark\('p'\);)?)P\(ED\)\.promoPrice=\+this\.value;save\(\)"/,
      (m,t)=>'<b style="margin-right:8px;white-space:nowrap">Rp \u2212</b><input type=number min=0 placeholder="4000" value="'+(cut||'')+'" oninput="'+t+'setCut59(this.value)"');
    h=h.replace('Satu harga untuk semua kode promo di paket ini.','Potongan ini hanya berlaku untuk paket ini; setiap paket bisa punya potongan berbeda.');
  }catch(e){}
  return h;
};


/* ===== rev65: tanggal kadaluarsa terlihat jelas + info kadaluarsa di deskripsi ===== */
const BLN65=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const tgl65=v=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?(+m[3])+' '+BLN65[+m[2]-1]+' '+m[1]:''};
function setExp65(v){const p=P(ED);if(!p)return;p.exp=v||'';save();const l=document.getElementById('exp65');if(l)l.textContent=v?'Dipilih: '+tgl65(v):'Belum ada tanggal dipilih'}
const _sh65=starHtml;
starHtml=function(p){
  let h=_sh65.apply(this,arguments);
  try{
    h=h.replace(/<input type=date value="[^"]*" onchange="P\(ED\)\.exp=this\.value;save\(\)">/,
      '<input type=date value="'+(p.exp||'')+'" oninput="setExp65(this.value)" onchange="setExp65(this.value)"><div id=exp65 style="font-size:13px;font-weight:700;margin-top:6px">'+(p.exp?'Dipilih: '+tgl65(p.exp):'Belum ada tanggal dipilih')+'</div>');
  }catch(e){}
  return h;
};
const _d65=desc;
desc=function(id){
  _d65.apply(this,arguments);
  try{
    const p=P(id),sh=document.querySelector('#m .sheet');
    if(p&&p.pub&&p.exp&&sh&&!sh.querySelector('#kdl65'))
      sh.insertAdjacentHTML('beforeend','<div id=kdl65 style="text-align:right;font-size:11.5px;color:#9aa0a6;margin-top:14px">Paket ini kadaluarsa pada '+tgl65(p.exp)+'</div>');
  }catch(e){}
};

/* ===== Panel Daftar Nomor: judul teleportasi + tombol Tutup sejajar ===== */
tele59=function(){
  try{
    if(!isPor58()||document.getElementById('tp59'))return;
    const b=[...document.querySelectorAll('#app b')].find(x=>x.textContent.trim()==='Daftar Nomor');if(!b)return;
    const hd=b.parentElement,close=hd&&hd.querySelector('button');if(!hd||!close)return;
    const id=V==='exam'&&E?E.id:CUR,p=id!=null?P(id):null;if(!p)return;
    const skd=p.type==='SKD',ci=V==='exam'&&E?E.i:(typeof RV!=='undefined'&&RV?RV.i:0),cur=skd?qType(p,ci):null;
    const wrap=document.createElement('div');wrap.id='tp59';wrap.style.cssText='display:block;margin-bottom:14px';
    const top=document.createElement('div');top.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px';
    const t=document.createElement('b');t.style.fontSize=getComputedStyle(b).fontSize;t.textContent='Lompat ke bagian:';
    top.appendChild(t);top.appendChild(close);
    const row=document.createElement('div');row.style.cssText='display:flex;gap:8px';
    row.innerHTML=SEC59.map(x=>'<button '+(skd?'':'disabled ')+'class="'+(cur===x[0]?'on':'')+'" onclick="tp59go('+(x[1]+1)+')">'+x[0]+'</button>').join('');
    wrap.appendChild(top);wrap.appendChild(row);hd.before(wrap);
  }catch(e){}
};

/* ===== Beranda layar horizontal: kategori bergaya potret ===== */
function tilesLH62(){
  try{
    return; /* rev63: layar horizontal kembali ke tombol kategori semula */
    if(!wide()||V!=='home')return;
    const app=document.getElementById('app');
    const big=app.querySelector('button.big'),g3=app.querySelector('.g3');
    if(!big||!g3||app.querySelector('.tiles54'))return;
    const w=document.createElement('div');w.className='tiles54';
    const tl=(k,t)=>'<button class="tile54" onclick="TAB=\''+k.toUpperCase()+'\';go(\'kat\')"><span class="ic54">'+SV54(IC54.skd,22)+'</span><b>'+t+'</b></button>';
    w.innerHTML='<div style="margin:22px 0 10px"><b style="font-size:18px">Pilih Try Out</b></div><div class="g4t">'+tl('skd','SKD')+tl('twk','TWK')+tl('tiu','TIU')+tl('tkp','TKP')+'</div>';
    big.replaceWith(w);g3.remove();
  }catch(e){}
}

/* ===== Notifikasi paket baru (badge oranye berdenyut) ===== */
const _pd62=paid;
paid=function(){
  const p=CUR!=null?P(CUR):null,had=!!(p&&S.owned[p.id]);
  window._inPaid62=1;let r;try{r=_pd62.apply(this,arguments)}finally{window._inPaid62=0}
  try{if(p&&!had&&S.owned[p.id]){S.newPk=S.newPk||[];if(!S.newPk.includes(p.id))S.newPk.push(p.id);save();if(V==='paket')go('home')}}catch(e){}
  return r;
};
function badge62(){
  try{
    const app=document.getElementById('app');if(!app)return;
    if(V==='paket'&&!window._inPaid62&&(S.newPk||[]).length){S.newPk=[];save()}
    const n=(S.newPk||[]).filter(id=>S.owned[id]).length;
    app.querySelectorAll('.nb62').forEach(e=>e.remove());
    /* ikon Daftar Paket pada tombol layar horizontal */
    const lb=[...app.querySelectorAll('button')].find(b=>!b.closest('.nav')&&/^\s*Daftar Paket\s*$/.test(b.textContent)&&/paket/.test(b.getAttribute('onclick')||''));
    if(lb&&wide()){
      if(!lb.dataset.ic62){lb.dataset.ic62='1';lb.style.cssText+=';display:inline-flex;align-items:center;gap:8px;position:relative';lb.insertAdjacentHTML('afterbegin',SV54(IC54.paket,18))}
      if(n)lb.insertAdjacentHTML('beforeend','<i class="nb62">'+n+'</i>');
    }
    const nv=[...app.querySelectorAll('.nav>div')].find(d=>/'paket'/.test(d.getAttribute('onclick')||''));
    if(nv&&n){nv.style.position='relative';const ic=nv.querySelector('svg');if(ic){ic.style.position='relative';nv.insertAdjacentHTML('beforeend','<i class="nb62" style="top:2px;right:calc(50% - 22px)">'+n+'</i>')}}
  }catch(e){}
}

/* ===== Logo: normal + tema gelap ===== */
const _lc62=logoClick;
logoClick=function(){
  if(OP)return modal('<b style="font-size:18px">Ubah Logo</b><p class="mu" style="font-size:12.5px;line-height:1.6">Pilih logo yang mau diganti. Logo tema gelap dipakai otomatis saat tampilan gelap (unggah versi putih).</p>'
    +'<button style="width:100%;height:46px;margin-top:10px;background:var(--ac);color:#fff;font-weight:700" onclick="logoUp62(0)">Logo Normal</button>'
    +'<button style="width:100%;height:46px;margin-top:8px;background:#012AAB;color:#fff;font-weight:700" onclick="logoUp62(1)">Logo Tema Gelap (putih)</button>'
    +(S.logoDark?'<button style="width:100%;height:40px;margin-top:8px;background:var(--cd);color:var(--tx)" onclick="S.logoDark=\'\';save();closeM();render()">Hapus Logo Tema Gelap</button>':'')
    +'<button style="width:100%;height:40px;margin-top:8px;background:var(--cd);color:var(--tx)" onclick="closeM()">Tutup</button>');
  return _lc62.apply(this,arguments);
};
function logoUp62(d){closeM();crop(3.3,660,'png',d?'Potong Logo Tema Gelap (area 3,3:1)':'Potong Logo (area 3,3:1)',x=>{if(d)S.logoDark=x;else S.logo=x;save();render()})}
loginLogoModal=function(){closeM();modal('<b style="font-size:18px">Logo Halaman Login</b><p class=mu style="font-size:12.5px;line-height:1.6">Logo ini tampil kecil di atas formulir Masuk dan Daftar. Unggah juga versi putih untuk tema gelap.</p><div style="height:70px;border:1.5px dashed var(--bd);border-radius:8px;display:grid;place-items:center;margin:10px 0">'+(S.loginLogo?'<img src="'+S.loginLogo+'" style="max-width:112px;max-height:40px;object-fit:contain">':'<span class=mu style="font-size:12px">Belum ada logo</span>')+'</div><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="upLoginLogo()">Unggah Logo Normal</button><button style="width:100%;height:44px;margin-top:8px;background:#012AAB;color:#fff;font-weight:700" onclick="upLoginLogoDark62()">Unggah Logo Tema Gelap (putih)</button><button style="width:100%;height:40px;margin-top:8px;background:var(--cd);color:var(--tx)" onclick="closeM()">Tutup</button>')};
function upLoginLogoDark62(){closeM();crop(3.3,660,'png','Potong Logo Login Tema Gelap',d=>{S.loginLogoDark=d;save();loginLogoModal()})}
function logoDark62(){
  try{
    if(!isDark54())return;
    document.querySelectorAll('img').forEach(i=>{
      if(S.logoDark&&S.logo&&i.getAttribute('src')===S.logo&&i.getAttribute('src')!==S.logoDark)i.src=S.logoDark;
      else if(S.loginLogoDark&&S.loginLogo&&i.getAttribute('src')===S.loginLogo)i.src=S.loginLogoDark;
    });
  }catch(e){}
}

function post58(){
  const wp=document.body.classList.contains('wp54');
  document.body.classList.toggle('dk58',isDark54());
  document.body.classList.toggle('home58',!!(wp&&V==='home'&&isPor58()));
  applyLvl59();
  tilesLH62();arena58();glass58();lines58();tiles58();tg58();
  cancelGuard59();tele59();badges59();doneFix59();badge62();logoDark62();
}
queueMicrotask(__legacyRender);

/* ================= blok 20 / 23 (baris 2507) ================= */
/* rev68: isi thumbnail kosong dengan tulisan "Kosong" + ukuran standar, lebar tulisan ukuran = lebar tulisan Kosong */
(function(){let t=0;function inj(){t=0;try{
 document.querySelectorAll('.row>.th').forEach(e=>{if((e.getAttribute('style')||'').indexOf('url()')>-1&&!e.querySelector('.ph'))e.innerHTML='<div class=ph><b>Kosong</b><span>120 \u00d7 80</span></div>'});
 document.querySelectorAll('.row .b button[onclick^="desc("]').forEach(e=>{if(!e.getAttribute('aria-label'))e.setAttribute('aria-label','Deskripsi')});
}catch(e){}}
new MutationObserver(()=>{if(!t)t=requestAnimationFrame(inj)}).observe(document.documentElement,{childList:true,subtree:true});inj()})();

/* rev72: dialog Hapus Paket dengan peringatan + centang wajib */
function hpOk(c){const b=document.getElementById('hpb');if(!b)return;b.disabled=!c;b.style.opacity=c?1:.4}
hapusPkt=function(id){MENU=null;render();const p=P(id),n=(S.hist&&S.hist[id]&&S.hist[id].length)||(S.res[id]?1:0),fr=!!(wasClaimed63(id)&&elig63(p));
 const warn=n>0?'Kamu sudah mengerjakan paket ini <b>'+n+' kali</b>. Seluruh nilai dan riwayat dari <b>'+n+' kali pengerjaan</b> tersebut akan hilang dan tidak bisa dikembalikan.':'Paket ini belum pernah kamu kerjakan, tetapi akses paketnya akan hilang dari akunmu.';
 modal('<b style="font-size:18px">Hapus paket ini?</b><p style="line-height:1.6;margin:10px 0">'+esc(p.name)+' akan dihapus dari Daftar Paket. '+warn+(fr?' Jika ingin mengerjakannya lagi, kamu cukup <b>mengklaim ulang</b> paket ini di Pasar Paket. Program gratisnya masih berjalan, jadi tanpa membayar.':(wasClaimed63(id)?' Program gratis paket ini sudah berakhir, jadi jika ingin mengerjakannya lagi kamu harus <b>membeli paket ini kembali</b>.':' Jika ingin mengerjakannya lagi, kamu harus membeli paket ini kembali.'))+'</p>'
 +'<label style="display:flex;gap:10px;align-items:flex-start;margin:0 0 16px;cursor:pointer"><input type=checkbox id=hpc onchange="hpOk(this.checked)" style="width:20px;height:20px;min-width:20px;padding:0;margin:2px 0 0;flex:none"><span>Saya telah membaca peringatan ini.</span></label>'
 +'<div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick=closeM()>Batalkan</button><button id=hpb disabled style="flex:1;height:44px;background:#e11d48;color:#fff;font-weight:700;opacity:.4" onclick="doHapus('+id+')">Ya, Hapus</button></div>')};

/* ================= blok 21 / 23 (baris 2533) ================= */
S.groups=S.groups||[];S.gseq=S.gseq||1;S.claimed=S.claimed||{};
const em63=x=>String(x||'').trim().toLowerCase();
const meEm63=()=>em63(S.me&&S.me.e);
function amal63(p){p.amal=p.amal||{on:false,users:[],groups:[],min:null};p.amal.users=p.amal.users||[];p.amal.groups=p.amal.groups||[];return p.amal}
PAR.grup63='home';

/* ===== Kelayakan klaim gratis ===== */
function elig63(p){
  const a=p&&p.amal;if(!a||!a.on)return null;
  const e=meEm63();if(!e)return null;
  if(a.min){
    const others=S.packages.filter(x=>x.id!==p.id&&!x.sim);
    const owned=others.filter(x=>S.owned[x.id]).length;
    if(a.min.n==='all'){const all=others.filter(x=>x.pub&&!x.hidden).length;if(all>0&&owned>=all)return{t:'cust',n:'all'}}
    else if(owned>=a.min.n)return{t:'cust',n:a.min.n}
  }
  if((a.users||[]).map(em63).includes(e))return{t:'user'};
  for(const gid of a.groups||[]){const g=S.groups.find(x=>x.id===gid);if(g&&g.members.some(m=>em63(m.user)===e))return{t:'group',g:g.name}}
  return null;
}
const wasClaimed63=id=>!!(S.claimed[meEm63()]&&S.claimed[meEm63()][id]);

/* ===== Alur klaim (siswa) ===== */
function claim63(id){
  const p=P(id),r=elig63(p);if(!r){CUR=id;PROMO=null;return go('buy')}
  const why=r.t==='cust'
    ?'Anda <b>diperuntukkan mendapatkan paket ini secara gratis</b>, karena Anda telah memenuhi ketentuan sebagai <b>pelanggan dengan jumlah minimal paket</b> ('+(r.n==='all'?'memiliki <b>semua paket</b>':'memiliki minimal <b>'+r.n+' paket</b>')+'). Itulah sebabnya paket ini gratis untuk Anda, tanpa pembayaran apa pun.'
    :'Anda <b>ditunjuk secara khusus oleh operator untuk mendapatkan paket ini secara gratis</b>. Jadi Anda tidak perlu membayar apa pun untuk memilikinya.';
  modal('<b style="font-size:18px">Klaim Paket Gratis</b><div class="mu" style="margin:4px 0 10px;font-size:13px">'+esc(p.name)+'</div><p style="line-height:1.65;font-size:14px;margin:0 0 14px">'+why+'<br><br>Setelah Anda memilih <b>Saya sudah baca</b> dan menekan <b>Tambahkan ke Daftar Paket</b>, paket akan langsung masuk ke menu Daftar Paket dan siap dikerjakan lewat tombol Mulai.</p>'
   +'<label style="display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer;margin-bottom:16px"><input type="checkbox" id="cl63" style="width:20px;height:20px;flex:none;margin:0" onchange="clOk63()"> Saya sudah baca</label>'
   +'<div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick="closeM()">Batal</button><button id="cl63b" disabled style="flex:1.6;height:44px;background:var(--yl);color:#111;font-weight:700;opacity:.4" onclick="claimDo63('+id+')">Tambahkan ke Daftar Paket</button></div>');
}
function clOk63(){const c=document.getElementById('cl63'),b=document.getElementById('cl63b');if(c&&b){b.disabled=!c.checked;b.style.opacity=c.checked?1:.4}}
function claimDo63(id){
  const c=document.getElementById('cl63');if(!c||!c.checked)return;
  const p=P(id);if(!elig63(p))return;
  S.owned[id]=Date.now();const k=meEm63();S.claimed[k]=S.claimed[k]||{};S.claimed[k][id]=1;S.amalU=S.amalU||{};S.amalU[id]=S.amalU[id]||[];if(!S.amalU[id].includes(k))S.amalU[id].push(k);
  S.newPk=S.newPk||[];if(!S.newPk.includes(id))S.newPk.push(id);
  try{log('beli',S.me.n+' mengklaim '+p.name+' (gratis)')}catch(e){}
  save();closeM();go('home');
}
function claimConv63(){
  try{
    document.querySelectorAll('#app button[onclick*="go(\'buy\')"]').forEach(b=>{
      if(b.dataset.cl63)return;
      const m=(b.getAttribute('onclick')||'').match(/CUR=(\d+);PROMO=null/);if(!m)return;
      const id=+m[1],p=P(id),r=elig63(p);if(!r)return;
      b.dataset.cl63='1';
      b.textContent='Klaim';b.setAttribute('onclick','claim63('+id+')');
      /* label FREE! merah di posisi label diskon, harga dasar dicoret */
      const dt=b.closest('.dt')||b.parentElement;
      const pd=dt&&[...dt.children].find(c=>c.tagName==='DIV'&&!c.classList.contains('mu')&&!c.classList.contains('b'));
      if(pd&&!pd.querySelector('.free74')){
        let fx=pd.querySelector(':scope>div[style*="flex"]');
        if(!fx){const old=pd.querySelector(':scope>b');fx=document.createElement('div');fx.style.cssText='display:flex;justify-content:space-between;align-items:baseline;gap:8px';fx.innerHTML='<s class="mu" style="font-size:12px"></s><b></b>';if(old)old.replaceWith(fx);else pd.prepend(fx)}
        const sx=fx.querySelector('s'),bx=fx.querySelector('b');
        if(sx)sx.textContent=rp(p.price);
        if(bx){bx.textContent='FREE!';bx.className='free74';bx.style.color='#e11d48'}
      }
    });
  }catch(e){}
}

/* ===== Operator: tombol Amal di bawah Beri Diskon ===== */
let AM63={mode:null};
function amalToggle63(){const a=amal63(P(ED));a.on=!a.on;save();render()}
function amalIns63(){
  try{
    if(V!=='bank'||document.getElementById('am63'))return;
    const bt=[...document.querySelectorAll('button')].find(x=>/diskonBoard/.test(x.getAttribute('onclick')||''));if(!bt)return;
    const row=bt.parentElement,a=amal63(P(ED));
    const n=(a.users||[]).length+(a.groups||[]).reduce((t,g)=>{const x=S.groups.find(y=>y.id===g);return t+(x?x.members.length:0)},0)+(a.min?1:0);
    const d=document.createElement('div');d.id='am63';d.style.cssText='display:flex;gap:12px;align-items:center;margin-top:10px';
    d.innerHTML='<button onclick="amalSheet63()" style="flex:1;height:40px;background:#7c3aed;color:#fff;font-weight:700;font-size:13px">Amal'+(n?' \u00b7 '+n+' penerima':'')+'</button>'
      +'<span onclick="amalToggle63()" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:12.5px;font-weight:700;color:var(--mu)"><span style="width:46px;height:26px;border-radius:13px;background:'+(a.on?'#16a34a':'#c4cad6')+';position:relative;display:inline-block"><i style="position:absolute;top:3px;left:'+(a.on?23:3)+'px;width:20px;height:20px;border-radius:50%;background:#fff"></i></span>'+(a.on?'Aktif':'Nonaktif')+'</span>';
    row.after(d);
  }catch(e){}
}
function amalSheet63(){AM63.mode=null;sheet('<div id="am63s">'+amalBody63()+'</div>')}
function amalRef63(){const e=document.getElementById('am63s');if(e)e.innerHTML=amalBody63()}
function amalBody63(){
  const p=P(ED),a=amal63(p),m=AM63.mode;
  const opt=(k,t)=>'<button class="am63opt'+(m===k?' on':'')+'" onclick="AM63.mode=\''+k+'\';amalRef63()">'+t+'</button>';
  const dsc='font-size:12.5px;line-height:1.6;color:var(--mu);margin:10px 0 0';
  let f='';
  if(m==='u')f='<p style="'+dsc+'">Akun dengan username/email ini mendapat paket gratis dan bisa mengklaimnya.</p><input id="am63u" class="am63in" placeholder="username / email akun" onkeydown="if(event.key===\'Enter\')amalAddU63()"><button style="width:100%;height:42px;margin-top:8px;background:#346ef3;color:#fff;font-weight:700" onclick="amalAddU63()">Tambah Username</button>';
  else if(m==='g')f='<p style="'+dsc+'">Semua anggota grup yang dipilih mendapat paket gratis. Grup dibuat di menu Daftar Grup.</p>'+(S.groups.length?S.groups.map(g=>{const on=a.groups.includes(g.id);return '<div onclick="amalGrp63('+g.id+')" style="display:flex;justify-content:space-between;align-items:center;height:44px;padding:0 12px;margin-top:8px;border-radius:8px;border:1.5px solid '+(on?'#7c3aed':'var(--bd)')+';cursor:pointer;font-weight:'+(on?700:500)+'"><span>'+esc(g.name)+' <span class="mu" style="font-size:12px">\u00b7 '+g.members.length+' orang</span></span><span>'+(on?'\u2713':'')+'</span></div>'}).join(''):'<p class="mu" style="font-size:13px;margin-top:10px">Belum ada grup. Buat dulu lewat menu Daftar Grup.</p>');
  else if(m==='c')f='<p style="'+dsc+'">Untuk pelanggan dengan jumlah paket tertentu: pelanggan yang sudah memiliki paket sebanyak itu (atau lebih) mendapat paket ini gratis.</p><div style="display:flex;align-items:center;gap:8px;margin-top:8px"><span style="font-size:13px;white-space:nowrap">Minimal mempunyai</span><input id="am63n" type="number" min="1" class="am63in" style="margin-top:0;flex:1;min-width:0" placeholder="5" value="'+(a.min&&a.min.n!=='all'?a.min.n:'')+'"><span style="font-size:13px">paket</span></div><div style="display:flex;gap:8px;margin-top:8px"><button style="flex:1;height:42px;background:#346ef3;color:#fff;font-weight:700" onclick="amalMin63()">Simpan</button><button style="flex:1;height:42px;background:var(--cd);color:var(--tx);font-weight:700" onclick="amalMin63(1)">Semua paket</button></div>';
  const us=a.users.map((u,i)=>'<span class="am63chip">'+esc(u)+' <b onclick="amalDelU63('+i+')">\u00d7</b></span>').join('');
  const gs=a.groups.map(id=>{const g=S.groups.find(x=>x.id===id);return g?'<span class="am63chip">'+esc(g.name)+' \u00b7 '+g.members.length+' <b onclick="amalGrp63('+id+')">\u00d7</b></span>':''}).join('');
  const cs=a.min?'<span class="am63chip">Pelanggan: minimal '+(a.min.n==='all'?'semua paket':a.min.n+' paket')+' <b onclick="amalMin63(-1)">\u00d7</b></span>':'';
  const lst=(us||gs||cs)?(us?'<div class="mu" style="font-size:12px;margin:14px 0 6px">Username</div>'+us:'')+(gs?'<div class="mu" style="font-size:12px;margin:10px 0 6px">Grup</div>'+gs:'')+(cs?'<div class="mu" style="font-size:12px;margin:10px 0 6px">Pelanggan</div>'+cs:''):'<p class="mu" style="font-size:12.5px;margin:14px 0 0">Belum ada penerima.</p>';
  return '<b style="font-size:18px">Amal \u2014 paket gratis</b><p style="'+dsc+'">Tentukan siapa yang mendapat paket ini gratis. Bagi mereka, tombol Beli berubah jadi Klaim. Aturan hanya berlaku saat tombol di sebelah Amal Aktif; daftar di bawah tetap tersimpan walau Nonaktif.</p>'
   +'<div style="display:flex;gap:8px;margin-top:14px">'+opt('u','Username')+opt('g','Grup')+opt('c','Pelanggan')+'</div>'+f
   +'<div style="margin-top:6px;border-top:1px solid var(--bd);padding-top:2px">'+lst+'</div>'
   +'<button style="width:100%;height:42px;margin-top:14px;background:var(--cd);color:var(--tx)" onclick="closeM();render()">Selesai</button>';
}
function amalAddU63(){const e=document.getElementById('am63u'),v=em63(e&&e.value);if(!v)return toast('Isi username/email dulu');const a=amal63(P(ED));if(!a.users.map(em63).includes(v))a.users.push(v);save();amalRef63();setTimeout(()=>{const x=document.getElementById('am63u');x&&x.focus()},30)}
function amalDelU63(i){amal63(P(ED)).users.splice(i,1);save();amalRef63()}
function amalGrp63(id){const a=amal63(P(ED)),i=a.groups.indexOf(id);if(i>=0)a.groups.splice(i,1);else a.groups.push(id);save();amalRef63()}
function amalMin63(x){const a=amal63(P(ED));if(x===-1)a.min=null;else if(x===1)a.min={n:'all'};else{const n=parseInt((document.getElementById('am63n')||{}).value,10);if(!(n>0))return toast('Isi jumlah paket');a.min={n}}save();amalRef63()}

/* ===== Operator: Daftar Grup ===== */
let GSEL63=null,GADD63=false;
function openGrup63(){GSEL63=null;GADD63=false;closeM();go('grup63')}
function grup63(){
  let h=back();
  if(GSEL63==null){
    h+='<div style="display:flex;align-items:center;justify-content:space-between;margin:6px 0 14px"><b style="font-size:20px">Daftar Grup</b><button style="height:38px;padding:0 16px;background:#346ef3;color:#fff;font-weight:700" onclick="GADD63=true;render();setTimeout(()=>{const e=document.getElementById(\'g63n\');e&&e.focus()},30)">+ Tambah Grup</button></div>';
    if(GADD63)h+='<div style="border:1.5px solid #346ef3;border-radius:12px;padding:14px;margin-bottom:14px"><div style="font-size:13px;font-weight:700">Nama grup</div><input id="g63n" class="am63in" placeholder="mis. Siswa Beasiswa" onkeydown="if(event.key===\'Enter\')gSave63()"><div style="display:flex;gap:8px;margin-top:10px"><button style="flex:1;height:42px;background:var(--cd);color:var(--tx)" onclick="GADD63=false;render()">Batal</button><button style="flex:1;height:42px;background:#346ef3;color:#fff;font-weight:700" onclick="gSave63()">Simpan</button></div></div>';
    h+=S.groups.length?S.groups.map(g=>'<div onclick="gOpen63('+g.id+')" style="display:flex;justify-content:space-between;align-items:center;border:1px solid var(--bd);border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer"><div><b style="font-size:15px">'+esc(g.name)+'</b><div class="mu" style="font-size:12.5px;margin-top:3px">'+g.members.length+' orang</div></div><span style="font-size:20px;color:var(--mu)">\u203a</span></div>').join(''):(GADD63?'':'<p class="mu" style="line-height:1.6">Belum ada grup. Tekan <b>+ Tambah Grup</b> untuk membuat grup, lalu isi nama dan username anggotanya.</p>');
  }else{
    const g=S.groups.find(x=>x.id===GSEL63);if(!g){GSEL63=null;return grup63()}
    const n=g.members.length;
    h+='<div style="margin:6px 0 4px;color:#346ef3;font-weight:700;font-size:13px;cursor:pointer" onclick="GSEL63=null;render()">\u2039 Semua grup</div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><div><b style="font-size:20px">'+esc(g.name)+'</b><div class="mu" style="font-size:12.5px;margin-top:2px">'+n+' orang</div></div><button style="height:36px;padding:0 14px;background:var(--bg);color:#e11d48;border:1.5px solid #e11d48;font-weight:700;font-size:12px" onclick="gDel63()">Hapus Grup</button></div>';
    h+=g.members.map((m,i)=>'<div style="display:flex;align-items:center;gap:10px;border:1px solid var(--bd);border-radius:8px;padding:10px 12px;margin-bottom:8px"><b style="width:22px;color:var(--mu)">'+(i+1)+'.</b><div style="flex:1;min-width:0"><div style="font-weight:700;font-size:14px">'+esc(m.name||'-')+'</div><div class="mu" style="font-size:12.5px;overflow:hidden;text-overflow:ellipsis">'+esc(m.user)+'</div></div><span onclick="mDel63('+i+')" style="color:#e11d48;font-size:20px;cursor:pointer;padding:0 6px">\u00d7</span></div>').join('');
    h+='<div style="border:1.5px dashed #346ef3;border-radius:12px;padding:14px;margin-top:6px"><b style="font-size:14px">'+(n+1)+'. Tambah anggota</b><input id="g63name" class="am63in" placeholder="Nama"><input id="g63user" class="am63in" placeholder="Username / email akun" onkeydown="if(event.key===\'Enter\')mSave63()"><button style="width:100%;height:42px;margin-top:10px;background:#346ef3;color:#fff;font-weight:700" onclick="mSave63()">Simpan</button></div>';
  }
  return h;
}
function gSave63(){const v=((document.getElementById('g63n')||{}).value||'').trim();if(!v)return toast('Isi nama grup');const g={id:S.gseq++,name:v,members:[]};S.groups.push(g);GADD63=false;GSEL63=g.id;save();render();setTimeout(()=>{const e=document.getElementById('g63name');e&&e.focus()},40)}
function gOpen63(id){GSEL63=id;render()}
function gDel63(){if(!confirm('Hapus grup ini beserta daftar anggotanya?'))return;const id=GSEL63;S.groups=S.groups.filter(x=>x.id!==id);S.packages.forEach(p=>{if(p.amal&&p.amal.groups)p.amal.groups=p.amal.groups.filter(x=>x!==id)});GSEL63=null;save();render()}
function mSave63(){const g=S.groups.find(x=>x.id===GSEL63);if(!g)return;const name=((document.getElementById('g63name')||{}).value||'').trim(),user=((document.getElementById('g63user')||{}).value||'').trim();if(!user)return toast('Isi username/email akun');if(g.members.some(m=>em63(m.user)===em63(user)))return toast('Username sudah ada di grup ini');g.members.push({name:name||'-',user});save();render();setTimeout(()=>{const e=document.getElementById('g63name');e&&e.focus()},40)}
function mDel63(i){const g=S.groups.find(x=>x.id===GSEL63);if(!g)return;g.members.splice(i,1);save();render()}

/* ===== Aturan batal ujian: mati bila waktu > 1 menit ATAU sudah menjawab >= 3 soal ===== */
const seenN74=()=>E&&E.seen?Object.keys(E.seen).length:0;
const cx74=()=>E?{time:Date.now()-E.st>=60000,ans:seenN74()>=3}:null;
const blocked63=()=>{const c=cx74();return !!c&&(c.time||c.ans)};
function warn63(){modal('<b style="font-size:18px">Ujian tidak bisa dibatalkan lagi</b><p style="line-height:1.65;font-size:14px;margin:10px 0 16px">Pembatalan tidak dapat dilakukan karena waktu pengerjaan sudah melewati <b>1 menit</b> atau kamu sudah membuka <b>3 halaman soal</b>. Ujian hanya bisa diselesaikan lewat tombol <b>AKHIRI</b>. Tekan Oke untuk melanjutkan mengerjakan soal.</p><button style="width:100%;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="closeM()">Oke</button>')}
cancelEx=function(){
  if(!E)return;
  if(blocked63()){upd74();return warn63()}
  modal('<b style="font-size:18px">Apakah Anda yakin ingin membatalkan ujian?</b><p style="line-height:1.6">Semua jawaban tidak akan dihitung dan waktu ujian berhenti. Pembatalan hanya bisa dilakukan sebelum waktu pengerjaan melewati 1 menit dan sebelum kamu membuka 3 halaman soal; setelah itu ujian hanya bisa diselesaikan lewat tombol AKHIRI.</p><div style="display:flex;gap:10px"><button style="flex:1;height:44px;background:var(--cd);color:var(--tx)" onclick="closeM()">Lanjut Mengerjakan</button><button style="flex:1;height:44px;background:var(--ac);color:#fff;font-weight:700" onclick="doCancel()">Ya, Batalkan</button></div>');
};
tick=function(){clearInterval(TI);const u=()=>{if(!E)return;const e=$('#tm');if(e)e.textContent=tm();upd74();if(E.end&&E.end-Date.now()<=0)finish()};u();TI=setInterval(u,500)};
function upd74(){
  try{
    if(V!=='exam'||!E)return;
    E.seen=E.seen||{};if(!E.seen[E.i]){E.seen[E.i]=1;save()}
    const b=document.getElementById('bk');if(!b)return;
    const c=cx74(),bl=c.time||c.ans;
    b.removeAttribute('disabled');b.classList.toggle('dis',bl);b.setAttribute('aria-disabled',bl?'true':'false');
    const cp=document.getElementById('cap74');if(cp)cp.remove();
  }catch(e){}
}
cancelGuard59=function(){upd74()};

/* ===== Penyatuan ===== */
const _post73=post58;
post58=function(){_post73();amalIns63();claimConv63();upd74();mountNotif74()};

/* ===== Layar titipan React =====
   Notifikasi digambar oleh src/views/NotifView.jsx. Mesin legacy tetap pemilik
   data: S.logs untuk isi, PT untuk tab aktif. Dipasang ulang tiap render karena
   render() menimpa seluruh isi #app. Kode ini sengaja diletakkan di akhir file
   supaya nomor baris blok CSS di atas tidak bergeser — tools/extract-legacy.mjs
   memisahkan file CSS berdasarkan nomor baris. */
function mountNotif74(){
  try{
    const el=document.getElementById('view-notif');
    if(!el||el.dataset.react==='1')return;
    if(!window.mountReactView||!window.Views||!window.Views.NotifView)return;
    el.dataset.react='1';
    window.mountReactView(el,window.Views.NotifView,{
      tab:PT,
      logs:S.logs||[],
      // Ditunda: unmount root lama tidak boleh terjadi di tengah event React.
      onTab:t=>{PT=t;setTimeout(render,0)}
    });
  }catch(e){console.error('[WebKedinasan] mount notif gagal:',e)}
}
queueMicrotask(__legacyRender);

/* ================= blok 22 / 23 (baris 2709) ================= */
/* rev75: sapaan pagi/siang/sore/malam ikut jam tanpa perlu muat ulang.
   Hanya teks sapaan yang diganti; tidak memicu render ulang layar. */
(function(){
  const VARIANTS=['Selamat pagi,','Selamat siang,','Selamat sore,','Selamat malam,'];
  let last='';
  function greetTick(){
    if(typeof greet!=='function')return;
    const g=greet();
    if(g===last)return;
    last=g;
    const host=document.getElementById('app');
    if(!host)return;
    const el=[...host.querySelectorAll('div')].find(d=>d.children.length===0&&VARIANTS.includes(d.textContent.trim()));
    if(el)el.textContent=g;
  }
  setInterval(greetTick,20000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)greetTick()});
}());

/* ================= blok 23 / 23 (baris 2729) ================= */
/* rev76: nomor rekening operator (S.payAcc[k]={no,name}, diisi dari panel CMS)
   tampil di layar transfer siswa menggantikan placeholder "Nomor VA tampil di
   sini". Tanpa data, layar tetap persis seperti sebelumnya. */
const _va76=va;
va=function(){
  let html=_va76();
  const acc=(S.payAcc||{})[BANK];
  if(!acc||!String(acc.no||'').trim())return html;
  const no=esc(String(acc.no).trim()),name=acc.name?esc(String(acc.name).trim()):'';
  const digits=String(acc.no).replace(/[^\d]/g,'');
  html=html.replace('Nomor Virtual Account','Nomor Rekening');
  html=html.replace('<span>Nomor VA tampil di sini</span>',
    `<span style="display:flex;flex-direction:column;gap:2px;line-height:1.3;min-width:0"><b style="font-size:15px;color:var(--tx);letter-spacing:.4px">${no}</b>${name?`<small style="font-size:11.5px">a.n. ${name}</small>`:''}</span>`);
  html=html.replace('<button disabled style="background:#346ef3;color:#fff;height:30px;padding:0 14px">Salin</button>',
    `<button data-no="${digits}" style="background:#346ef3;color:#fff;height:30px;padding:0 14px;flex:none" onclick="navigator.clipboard&&navigator.clipboard.writeText(this.dataset.no);this.textContent='Tersalin'">Salin</button>`);
  html=html.replace('Masukkan nomor virtual account di atas','Masukkan nomor rekening di atas');
  return html;
};
