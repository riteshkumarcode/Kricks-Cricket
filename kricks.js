/* Krickscricket shared script: drawings, catalogue, header, footer, cart, currency, reveals. */
(function(){
document.documentElement.classList.add('js');
const K = window.K = {};
const esc = K.esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = {
  get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
K.store = store;

/* ---------- colour helper ---------- */
function shade(hex,amt){
  const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;
  const f=v=>Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)));
  return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
K.shade = shade;

/* ---------- drawings: flat, one graphic language ---------- */
const BLADE='M48 186 C48 202 20 206 16 224 L14 482 Q14 508 40 510 L80 510 Q106 508 106 482 L104 224 C100 206 72 202 72 186 Z';
function handle(grip){
  let ribs='';for(let y=16;y<192;y+=9)ribs+=`<path d="M49 ${y+7} L71 ${y}" stroke="${shade(grip,-.28)}" stroke-width="2.6"/>`;
  return `<rect x="49" y="6" width="22" height="188" fill="${grip}"/>${ribs}<rect x="49" y="6" width="5" height="188" fill="${shade(grip,-.22)}"/><rect x="47" y="2" width="26" height="10" fill="${shade(grip,-.15)}"/>`;
}
K.bat = function(o={}){
  const blade=o.blade||'#E3C78E', grip=o.grip||'#C3262C', st=o.sticker||'#0A0A0A', stInk=o.stickerInk||'#F0E3C3';
  const view=o.view||'face', grains=o.grains||9;
  const head=`<svg viewBox="0 0 120 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.label||'Cricket bat')}">`;
  if(view==='edge'){
    return head+handle(grip)+`<path d="M49 186 C52 214 50 236 48 260 C44 330 42 420 46 478 Q48 506 60 510 L66 510 Q78 500 78 470 C80 400 74 300 70 250 C68 226 70 206 71 186 Z" fill="${blade}"/><path d="M60 510 Q48 506 46 478 C42 420 44 330 48 260 L54 260 C51 330 50 420 53 478 Q55 504 62 510 Z" fill="${shade(blade,-.16)}"/><path d="M46 492 Q48 508 60 512 L66 512 Q76 506 78 492" fill="${shade(blade,-.45)}"/></svg>`;
  }
  let g='';
  if(view==='face'){for(let i=0;i<grains;i++){const x=24+i*(72/(grains-1));g+=`<path d="M${x} 236 C${x+1.4} 320 ${x-1.4} 420 ${x} 500" stroke="${shade(blade,-.3)}" stroke-width="1"/>`}}
  const edges=`<path d="M16 224 L14 482 Q14 508 40 510 L30 509 Q22 500 22 482 L23 226 Z" fill="${shade(blade,-.18)}"/><path d="M104 224 L106 482 Q106 508 80 510 L90 509 Q98 500 98 482 L97 226 Z" fill="${shade(blade,-.18)}"/>`;
  let face='';
  if(view==='face'){
    face=`<rect x="20" y="232" width="80" height="58" fill="${st}"/><text x="60" y="275" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="34" fill="${stInk}">KRICKS</text>
    <rect x="20" y="454" width="80" height="20" fill="${st}"/><text x="60" y="469" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="11.5" letter-spacing=".5" fill="${stInk}">${esc(o.grade||'ENGLISH WILLOW')}</text>`;
    if(o.name) face+=`<text transform="translate(70 446) rotate(-90)" font-family="Bebas Neue,Impact,sans-serif" font-size="36" fill="${shade(blade,-.5)}">${esc(String(o.name).toUpperCase().slice(0,10))}</text>`;
    if(o.num) face+=`<text x="38" y="312" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="22" fill="${shade(blade,-.5)}">${esc(String(o.num).slice(0,3))}</text>`;
  } else { // back
    face=`<path d="M52 214 C56 300 56 400 54 500 L66 500 C64 400 64 300 68 214 Z" fill="${shade(blade,.18)}"/><rect x="40" y="240" width="40" height="30" fill="${st}"/><text x="60" y="262" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="18" fill="${stInk}">KRICKS</text>`;
  }
  const toe=`<path d="M14 490 Q14 508 40 510 L80 510 Q106 508 106 490 L106 500 Q102 514 80 515 L40 515 Q18 514 14 500 Z" fill="${shade(blade,-.45)}"/>`;
  return head+handle(grip)+`<path d="${BLADE}" fill="${blade}"/>`+edges+g+face+toe+'</svg>';
};
K.ball = function(type='leather'){
  if(type==='tennis') return `<svg viewBox="0 0 100 100" role="img" aria-label="Tennis ball"><circle cx="50" cy="50" r="46" fill="#D5E04A"/><path d="M50 4a46 46 0 0 1 0 92a52 52 0 0 0 0-92z" fill="#B9C42F"/><path d="M14 22c18 14 18 42 0 56M86 22c-18 14-18 42 0 56" stroke="#F7F4E8" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
  const c = type==='white'?'#F2EEE4':'#B8202A', d = type==='white'?'#D9D2C2':'#8E1520', s = type==='white'?'#0A0A0A':'#F2E3CC';
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${type==='white'?'White':'Red'} leather ball"><circle cx="50" cy="50" r="46" fill="${c}"/><path d="M50 4a46 46 0 0 1 0 92a52 52 0 0 0 0-92z" fill="${d}"/><path d="M34 6c-9 27-9 61 0 88" stroke="${d}" stroke-width="6" fill="none"/><path d="M30 7c-8.5 27-8.5 59 0 86M38 5c-8.5 28-8.5 62 0 90" stroke="${s}" stroke-width="1.8" stroke-dasharray="3 3" fill="none"/></svg>`;
};
K.item = function(kind,c1='#F3EEE3',c2='#C3262C'){
  const d={
   gloves:`<svg viewBox="0 0 200 240" role="img" aria-label="Batting glove"><rect x="40" y="150" width="110" height="74" fill="${c2}"/><rect x="40" y="150" width="110" height="14" fill="${shade(c2,-.25)}"/>${[0,1,2,3].map(i=>`<rect x="${44+i*26}" y="${36+(i%3===0?14:0)}" width="24" height="${120-(i%3===0?14:0)}" rx="12" fill="${c1}"/>${[0,1,2,3,4].map(j=>`<rect x="${44+i*26}" y="${56+(i%3===0?8:0)+j*19}" width="24" height="5" fill="${shade(c1,-.12)}"/>`).join('')}`).join('')}<rect x="10" y="118" width="40" height="22" rx="11" transform="rotate(-38 30 129)" fill="${c1}"/><rect x="60" y="182" width="72" height="24" fill="${c1}"/><text x="96" y="200" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="20" fill="${c2}">KRICKS</text></svg>`,
   pads:`<svg viewBox="0 0 200 240" role="img" aria-label="Batting pads">${[22,108].map(x=>`<rect x="${x}" y="20" width="72" height="206" rx="30" fill="${c1}"/>${[0,1,2].map(i=>`<rect x="${x+10+i*19}" y="60" width="14" height="150" rx="7" fill="${shade(c1,-.1)}"/>`).join('')}<rect x="${x}" y="20" width="72" height="44" rx="22" fill="${shade(c1,-.06)}"/><rect x="${x-6}" y="96" width="84" height="12" fill="${c2}"/><rect x="${x-6}" y="160" width="84" height="12" fill="${c2}"/>`).join('')}</svg>`,
   kitbag:`<svg viewBox="0 0 240 200" role="img" aria-label="Kit bag"><path d="M70 60 C70 28 170 28 170 60" stroke="${shade(c2,-.3)}" stroke-width="10" fill="none"/><rect x="16" y="56" width="208" height="110" fill="${c2}"/><rect x="16" y="56" width="208" height="20" fill="${shade(c2,-.22)}"/><rect x="30" y="96" width="120" height="50" fill="${shade(c2,-.12)}"/><text x="90" y="131" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="30" fill="${c1}">KRICKS</text><circle cx="196" cy="172" r="16" fill="#0E1729"/><circle cx="196" cy="172" r="6" fill="${c1}"/><rect x="170" y="90" width="38" height="56" fill="${shade(c2,-.12)}"/></svg>`,
   helmet:`<svg viewBox="0 0 220 220" role="img" aria-label="Batting helmet"><path d="M30 120 C30 50 80 24 120 24 C170 24 200 60 200 112 L200 128 L30 128 Z" fill="${c2}"/><path d="M120 24 C170 24 200 60 200 112 L200 128 L170 128 C176 80 160 40 120 24Z" fill="${shade(c2,-.22)}"/><rect x="20" y="122" width="150" height="16" fill="${shade(c2,-.35)}"/>${[0,1,2,3].map(i=>`<path d="M${70+i*28} 140 L${74+i*28} 200" stroke="#C9CDD4" stroke-width="5"/>`).join('')}<path d="M60 150 L176 150 M64 176 L172 176 M70 200 L168 200" stroke="#C9CDD4" stroke-width="5" fill="none"/><rect x="40" y="70" width="70" height="24" fill="${c1}"/><text x="75" y="88" text-anchor="middle" font-family="Bebas Neue,Impact,sans-serif" font-size="20" fill="${c2}">KRICKS</text></svg>`,
   grips:`<svg viewBox="0 0 220 220" role="img" aria-label="Bat grips">${[[30,'#C3262C'],[90,'#F3EEE3'],[150,'#3A3A3A']].map(([x,c])=>`<rect x="${x}" y="24" width="44" height="176" rx="22" fill="${c}"/>${Array.from({length:14},(_,j)=>`<path d="M${x+2} ${40+j*11} L${x+42} ${32+j*11}" stroke="${shade(c,-.25)}" stroke-width="3"/>`).join('')}`).join('')}</svg>`,
   toeguard:`<svg viewBox="0 0 220 160" role="img" aria-label="Toe guard"><path d="M30 30 L30 96 Q30 130 70 130 L150 130 Q190 130 190 96 L190 30 L172 30 L172 92 Q172 112 148 112 L72 112 Q48 112 48 92 L48 30 Z" fill="${c2}"/><path d="M30 96 Q30 130 70 130 L150 130 Q190 130 190 96 L190 112 Q186 144 150 144 L70 144 Q34 144 30 112Z" fill="${shade(c2,-.3)}"/></svg>`,
   balls:`<svg viewBox="0 0 220 200" role="img" aria-label="Six leather balls">${[[20,96],[80,96],[140,96],[50,40],[110,40],[80,140]].map(([x,y],i)=>`<svg x="${x}" y="${y-36}" width="64" height="64" viewBox="0 0 100 100">${K.ball(i===4?'white':'leather').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`).join('')}</svg>`,
   tballs:`<svg viewBox="0 0 220 200" role="img" aria-label="Six tennis balls">${[[20,96],[80,96],[140,96],[50,40],[110,40],[80,140]].map(([x,y])=>`<svg x="${x}" y="${y-36}" width="64" height="64" viewBox="0 0 100 100">${K.ball('tennis').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`).join('')}</svg>`
  };
  return d[kind]||'';
};

/* ---------- catalogue (sample content — confirm with client) ---------- */
K.products = [
 {id:'pro-edition',cat:'leather',name:'Pro Edition',sub:'Grade 1 English willow',price:24999,was:27999,tag:'Bestseller',grade:1,grains:'10–12',weight:'2lb 8oz – 2lb 11oz',edge:'40 mm',profile:'Mid-low middle, full spine',
  blurb:'Our top cut. Straight, tight grains, big edges and a middle that sits where most of your drives are struck. Pressed by hand and finished with a light linseed coat.',bat:{blade:'#E8CE95',grip:'#C3262C',sticker:'#0A0A0A',grains:11}},
 {id:'players',cat:'leather',name:'Players',sub:'Grade 1 English willow',price:16999,grade:1,grains:'8–10',weight:'2lb 8oz – 2lb 10oz',edge:'38 mm',profile:'Mid middle, high spine',
  blurb:'Match-grade willow with a slightly wider grain. Picks up lighter than it weighs, which suits front-foot players.',bat:{blade:'#E3C78E',grip:'#0A0A0A',sticker:'#C3262C',grains:9}},
 {id:'club',cat:'leather',name:'Club',sub:'Grade 2 English willow',price:10999,grade:2,grains:'7–9',weight:'2lb 9oz – 2lb 11oz',edge:'36 mm',profile:'Mid middle, rounded spine',
  blurb:'Grade 2 willow with a few cosmetic marks and the same press and shaping as our top bats. The weekend-league favourite.',bat:{blade:'#DEBE82',grip:'#3A3A3A',sticker:'#F3EEE3',stickerInk:'#0A0A0A',grains:8,grade:'ENGLISH WILLOW · G2'}},
 {id:'academy',cat:'leather',name:'Academy',sub:'Grade 3 English willow',price:7499,tag:'New',grade:3,grains:'6–8',weight:'2lb 9oz – 2lb 12oz',edge:'34 mm',profile:'Mid middle, flat face',
  blurb:'Honest English willow for players moving up from tennis-ball cricket to the hard ball. Knocking-in recommended.',bat:{blade:'#D9B97C',grip:'#F3EEE3',sticker:'#0A0A0A',grains:7,grade:'ENGLISH WILLOW · G3'}},
 {id:'junior-harrow',cat:'leather',name:'Junior Harrow',sub:'Grade 2 English willow',price:5999,grade:2,grains:'6–8',weight:'2lb 3oz – 2lb 5oz',edge:'32 mm',profile:'Light pick-up, Harrow size',
  blurb:'Sized for players between 5\'6" and 5\'8". Shorter blade and handle, same willow as our Club bat.',bat:{blade:'#E3C78E',grip:'#C3262C',sticker:'#3A3A3A',grains:7}},
 {id:'kashmir-match',cat:'leather',name:'Kashmir Match',sub:'Kashmir willow',price:3499,grade:4,grains:'5–7',weight:'2lb 10oz – 2lb 13oz',edge:'32 mm',profile:'Mid middle',
  blurb:'Kashmir willow pressed for the leather ball. Heavier and harder than English willow, and very hard-wearing for net sessions.',bat:{blade:'#EAD6A8',grip:'#0A0A0A',sticker:'#C3262C',grains:6,grade:'KASHMIR WILLOW'}},

 {id:'street',cat:'tennis',name:'Street',sub:'Kashmir willow tennis bat',price:2499,was:2999,tag:'Bestseller',grains:'5–7',weight:'950 – 1050 g',edge:'28 mm',profile:'Thin handle, scooped back',
  blurb:'Light, whippy and built for the tennis ball. A thin handle and scooped back so you can swing hard in gully and box cricket.',bat:{blade:'#EED9AB',grip:'#F3EEE3',sticker:'#C8501A',grains:6,grade:'KASHMIR WILLOW'}},
 {id:'tape-ball',cat:'tennis',name:'Tape Ball Special',sub:'Kashmir willow',price:1899,grains:'4–6',weight:'900 – 1000 g',edge:'26 mm',profile:'Low middle, flat face',
  blurb:'A low middle and a flat face for the skidding tape ball. Light enough to swing through the line all evening.',bat:{blade:'#EBD3A0',grip:'#C3262C',sticker:'#0A0A0A',grains:5,grade:'KASHMIR WILLOW'}},
 {id:'box-lite',cat:'tennis',name:'Box Cricket Lite',sub:'Popular willow',price:1499,tag:'New',grains:'—',weight:'850 – 950 g',edge:'24 mm',profile:'Very light pick-up',
  blurb:'Our lightest bat, for indoor box cricket and younger players. Popular willow with a full cane handle.',bat:{blade:'#F0E0BC',grip:'#3A3A3A',sticker:'#C3262C',grains:5,grade:'POPULAR WILLOW'}},
 {id:'full-cane',cat:'tennis',name:'Full Cane Tennis',sub:'Kashmir willow',price:3299,grains:'6–8',weight:'1000 – 1100 g',edge:'30 mm',profile:'Mid middle, cane handle',
  blurb:'Twelve-piece cane handle for a softer feel off the bat. Our heaviest tennis bat, for players who like a bit of weight behind the shot.',bat:{blade:'#E5CB94',grip:'#0A0A0A',sticker:'#F3EEE3',stickerInk:'#0A0A0A',grains:7,grade:'KASHMIR WILLOW'}},

 {id:'gloves',cat:'acc',kind:'gloves',name:'Batting Gloves',sub:'Sausage-finger, men\'s and youth',price:2299,tag:'Bestseller',blurb:'Split-finger sausage rolls with a sheep-leather palm. Right- and left-handed.',c1:'#F3EEE3',c2:'#C3262C'},
 {id:'pads',cat:'acc',kind:'pads',name:'Batting Pads',sub:'Lightweight, three-strap',price:3499,blurb:'Cane-reinforced bolsters with a moulded knee roll and three straps.',c1:'#F3EEE3',c2:'#0A0A0A'},
 {id:'helmet',cat:'acc',kind:'helmet',name:'Batting Helmet',sub:'Steel grille',price:3999,blurb:'Adjustable fit with a steel grille and removable sweatband.',c1:'#F3EEE3',c2:'#C8501A'},
 {id:'kitbag',cat:'acc',kind:'kitbag',name:'Wheelie Kit Bag',sub:'Holds four bats',price:4999,tag:'New',blurb:'Separate bat sleeve for four bats, a shoe pocket and sturdy wheels for the walk to the ground.',c1:'#F3EEE3',c2:'#C3262C'},
 {id:'leather-balls',cat:'acc',kind:'balls',name:'Club Leather Balls',sub:'Pack of 6 · 156 g',price:2999,blurb:'Four-piece, hand-stitched alum-tanned leather balls. Five red and one white.'},
 {id:'tennis-balls',cat:'acc',kind:'tballs',name:'Heavy Tennis Balls',sub:'Pack of 6',price:899,blurb:'Hard felt tennis balls that hold their bounce for tape-ball and box cricket.'},
 {id:'grips',cat:'acc',kind:'grips',name:'Bat Grips',sub:'Pack of 3',price:599,blurb:'Ribbed rubber grips in red, white and green. Fits any standard handle.'},
 {id:'toe-guard',cat:'acc',kind:'toeguard',name:'Toe Guard',sub:'Fits any adult bat',price:299,blurb:'Rubber toe guard that stops the toe from soaking up moisture and splitting.',c2:'#C3262C'}
];
K.byId = id => K.products.find(p=>p.id===id);
K.art = (p,o={}) => p.cat==='acc' ? K.item(p.kind,p.c1,p.c2) : K.bat(Object.assign({label:p.name+' cricket bat'},p.bat,o));
K.url = p => 'product.html#'+p.id;

/* ---------- currency ---------- */
const RATES={INR:1,USD:1/88,GBP:1/116,AUD:1/57,AED:1/24,ZAR:1/5};
K.cur = store.get('kricks-cur','INR');
K.money = inr => {
  const c=K.cur, v=inr*RATES[c];
  return new Intl.NumberFormat(c==='INR'?'en-IN':'en-GB',{style:'currency',currency:c,maximumFractionDigits:0}).format(c==='INR'?v:Math.ceil(v));
};
K.paint = (root=document) => root.querySelectorAll('[data-inr]').forEach(el=>el.textContent=K.money(+el.dataset.inr));

/* ---------- cart ---------- */
K.cart = store.get('kricks-cart',[]);
K.saveCart = () => {store.set('kricks-cart',K.cart);K.updateCount();};
K.count = () => K.cart.reduce((n,l)=>n+l.qty,0);
K.add = (line) => {
  const key = line.id+'|'+(line.opts||'');
  const ex = K.cart.find(l=>l.id+'|'+(l.opts||'')===key);
  if(ex) ex.qty += line.qty||1; else K.cart.push(Object.assign({qty:1},line));
  K.saveCart();
  const b=document.querySelector('.cartbtn b'); if(b){b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}
  K.toast(`${esc(line.name)} is in your cart.`, '<a href="cart.html">View cart</a>');
};
K.updateCount = () => {const b=document.querySelector('.cartbtn b'); if(b) b.textContent=K.count();};

let tt; K.toast = (msg,extra='') => {
  let t=document.querySelector('.toast'); if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.innerHTML=`<span>${msg}</span>${extra}`; requestAnimationFrame(()=>t.classList.add('show'));
  clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),3200);
};

/* ---------- header + footer ---------- */
const page = document.body.dataset.page;
const links = [['home','index.html','Home'],['custom','custom-bat.html','Customised Bat'],['leather','leather-bats.html','Leather Bats'],['tennis','tennis-bats.html','Tennis Bats'],['acc','accessories.html','Accessories'],['contact','contact.html','Contact Us'],['bulk','bulk-enquiry.html','Bulk Enquiry']];
const accSub = K.products.filter(p=>p.cat==='acc').map(p=>`<li><a href="${K.url(p)}">${p.name}</a></li>`).join('');
const ball = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#C8501A"/><path d="M30 7c-8.5 27-8.5 59 0 86M38 5c-8.5 28-8.5 62 0 90" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="6 6" fill="none"/></svg>`;
const hdr = document.getElementById('hdr');
const MEGA = {
  leather:{title:'Leather bats',href:'leather-bats.html',img:'img/ball.jpg',line:'English & Kashmir willow, pressed by hand.'},
  tennis:{title:'Tennis bats',href:'tennis-bats.html',img:'img/redsky.jpg',line:'Light bats for tape ball & box cricket.'},
  acc:{title:'Accessories',href:'accessories.html',img:'img/stumps.jpg',line:'Everything you carry to the crease.'}
};
const roll = t => `<span class="roll"><span data-t="${t}">${t}</span></span>`;
if(hdr){
  hdr.className='bar';
  const megaPanels = Object.entries(MEGA).map(([k,m])=>{
    const ps=K.products.filter(p=>p.cat===k);
    return `<div class="mp" data-k="${k}">
      <div class="mp-list"><h3>${m.title}</h3><ul>${ps.map(p=>`<li><a href="${K.url(p)}"><span>${p.name}</span><span class="price" data-inr="${p.price}"></span></a></li>`).join('')}</ul><a class="tlink" href="${m.href}">Shop all ${m.title.toLowerCase()} →</a></div>
      <div class="mp-tiles">${ps.slice(0,3).map(p=>`<a class="mp-t" href="${K.url(p)}"><span class="pic${p.cat==='acc'?' acc':''}">${K.art(p)}</span><b>${p.name}</b><span class="price" data-inr="${p.price}"></span></a>`).join('')}</div>
      <a class="mp-promo" href="${m.href}"><img src="${m.img}" alt="" loading="lazy"><span><b>${m.title}</b><small>${m.line}</small><em>Explore →</em></span></a>
    </div>`}).join('');
  hdr.innerHTML = `<div class="annc">Free name engraving on every custom bat · <b>Shipping worldwide</b></div>
  <div class="frame bar-in">
    <a class="word" href="index.html" aria-label="Krickscricket home">${ball}Kricks</a>
    <ul class="nav">${links.map(([k,h,t])=>`<li${MEGA[k]?` data-mega="${k}"`:''}><a href="${h}"${page===k?' aria-current="page"':''}>${roll(t)}${MEGA[k]?'<svg class="chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>':''}</a></li>`).join('')}</ul>
    <div class="tools">
      <label class="sr" for="cur">Currency</label>
      <select class="cur" id="cur">${Object.keys(RATES).map(c=>`<option${c===K.cur?' selected':''}>${c}</option>`).join('')}</select>
      <a class="cartbtn" href="cart.html">${roll('Cart')} <b>0</b></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu"><i></i><i></i></button>
    </div></div>
  <div class="mega" id="mega" aria-hidden="true"><div class="frame">${megaPanels}</div></div>`;

  /* ---- desktop mega menu ---- */
  const mega=hdr.querySelector('#mega'); let mt;
  const openMega=k=>{clearTimeout(mt);hdr.classList.add('mega-on');mega.setAttribute('aria-hidden','false');
    mega.querySelectorAll('.mp').forEach(p=>p.classList.toggle('on',p.dataset.k===k));
    hdr.querySelectorAll('.nav li').forEach(l=>l.classList.toggle('hot',l.dataset.mega===k))};
  const closeMega=()=>{mt=setTimeout(()=>{hdr.classList.remove('mega-on');mega.setAttribute('aria-hidden','true');hdr.querySelectorAll('.nav li').forEach(l=>l.classList.remove('hot'))},140)};
  hdr.querySelectorAll('.nav li').forEach(li=>{
    li.addEventListener('mouseenter',()=>li.dataset.mega?openMega(li.dataset.mega):closeMega());
    li.addEventListener('focusin',()=>li.dataset.mega?openMega(li.dataset.mega):closeMega());
  });
  mega.addEventListener('mouseenter',()=>clearTimeout(mt));
  hdr.addEventListener('mouseleave',closeMega);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMega();closeNav()}});

  /* ---- smart header: hide on scroll down, show on scroll up ---- */
  let ly=scrollY;
  addEventListener('scroll',()=>{const y=scrollY;hdr.classList.toggle('scrolled',y>8);
    if(!document.body.classList.contains('nav-open')&&!hdr.classList.contains('mega-on')) hdr.classList.toggle('tuck',y>ly&&y>220);
    ly=y},{passive:true});

  /* ---- mobile full-screen menu ---- */
  const mn=document.createElement('nav');mn.className='mnav';mn.id='mnav';mn.setAttribute('aria-label','Menu');mn.setAttribute('aria-hidden','true');
  mn.innerHTML=`<div class="mnav-in frame">
    <ul class="mlinks">${links.map(([k,h,t],i)=>`<li style="--i:${i}"><div class="mrow"><a href="${h}"${page===k?' aria-current="page"':''}><span class="mi">0${i+1}</span><span class="mt">${t}</span></a>${MEGA[k]?`<button class="mx" type="button" aria-expanded="false" aria-label="Show ${t}">+</button>`:'<span class="ma">→</span>'}</div>
      ${MEGA[k]?`<ul class="msub">${K.products.filter(p=>p.cat===k).map(p=>`<li><a href="${K.url(p)}"><span>${p.name}</span><span class="price" data-inr="${p.price}"></span></a></li>`).join('')}</ul>`:''}</li>`).join('')}</ul>
    <div class="mcards" style="--i:8">${Object.values(MEGA).map(m=>`<a href="${m.href}"><img src="${m.img}" alt="" loading="lazy"><b>${m.title}</b></a>`).join('')}</div>
    <div class="mfoot" style="--i:9"><label for="cur2">Prices in</label> <select class="cur" id="cur2">${Object.keys(RATES).map(c=>`<option${c===K.cur?' selected':''}>${c}</option>`).join('')}</select><span>Free engraving · Shipping worldwide</span></div>
  </div>`;
  document.body.appendChild(mn);
  const bg=hdr.querySelector('.burger');
  function openNav(){document.body.classList.add('nav-open');hdr.classList.remove('tuck');bg.setAttribute('aria-expanded','true');bg.setAttribute('aria-label','Close menu');mn.setAttribute('aria-hidden','false');
    mn.style.paddingTop=(hdr.getBoundingClientRect().bottom+12)+'px';const r=bg.getBoundingClientRect();mn.style.setProperty('--cx',(r.left+r.width/2)+'px');mn.style.setProperty('--cy',(r.top+r.height/2)+'px')}
  function closeNav(){document.body.classList.remove('nav-open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Open menu');mn.setAttribute('aria-hidden','true')}
  window.closeNav=closeNav;
  bg.onclick=()=>document.body.classList.contains('nav-open')?closeNav():openNav();
  mn.addEventListener('click',e=>{const x=e.target.closest('.mx');if(x){const li=x.closest('li');const o=li.classList.toggle('open');x.setAttribute('aria-expanded',o);x.textContent=o?'−':'+';return}if(e.target.closest('a'))closeNav()});
  addEventListener('resize',()=>{if(innerWidth>1100)closeNav()});

  const setCur=v=>{K.cur=v;store.set('kricks-cur',v);document.querySelectorAll('.cur').forEach(s=>s.value=v);K.paint();document.dispatchEvent(new CustomEvent('kricks:cur'))};
  document.querySelectorAll('.cur').forEach(s=>s.addEventListener('change',e=>setCur(e.target.value)));
}

const ftr = document.getElementById('ftr');
if(ftr){
  ftr.className='foot';
  ftr.innerHTML=`<div class="frame"><div class="f-top">
   <div><h2>Join the Kricks club</h2><p>New bats, limited willow drops and knocking-in tips. One email a month.</p>
    <form class="f-news" id="fnews"><label class="sr" for="fmail">Email</label><input id="fmail" type="email" placeholder="Your email address" required><button class="btn" type="submit">Join</button></form></div>
   <div class="f-col"><h3>Shop</h3><ul><li><a href="leather-bats.html">Leather bats</a></li><li><a href="tennis-bats.html">Tennis bats</a></li><li><a href="custom-bat.html">Customised bat</a></li><li><a href="accessories.html">Accessories</a></li></ul></div>
   <div class="f-col"><h3>Help</h3><ul><li><a href="contact.html">Contact us</a></li><li><a href="contact.html">Shipping &amp; returns</a></li><li><a href="index.html#size">Bat size guide</a></li><li><a href="product.html#pro-edition">Knocking-in guide</a></li></ul></div>
   <div class="f-col"><h3>Company</h3><ul><li><a href="index.html#craft">How we make bats</a></li><li><a href="bulk-enquiry.html">Clubs &amp; bulk orders</a></li><li><a href="contact.html">Privacy</a></li><li><a href="contact.html">Terms</a></li></ul></div>
  </div>
  <div class="f-word" aria-hidden="true">KRICKS<span>.</span></div>
  <div class="f-legal"><span>© 2026 Krickscricket. Cricket bats made by hand, shipped worldwide.</span><span>Prices shown in ${K.cur}</span></div></div>`;
  ftr.querySelector('#fnews').addEventListener('submit',e=>{e.preventDefault();K.toast('You’re in. Watch your inbox for the next willow drop.');e.target.reset()});
}

/* ---------- tiles ---------- */
K.tile = p => `<a class="tile rv" href="${K.url(p)}">
  <div class="pic${p.cat==='acc'?' acc':''}">${p.tag?`<span class="tag">${p.tag}</span>`:''}${K.art(p)}</div>
  <h3>${p.name}</h3>
  <div class="meta"><span class="soft">${p.sub}</span><span class="price"><span data-inr="${p.price}"></span>${p.was?`<s data-inr="${p.was}"></s>`:''}</span></div></a>`;

/* ---------- reveals ---------- */
K.reveal = (root=document) => {
  const els=[...root.querySelectorAll('.rv:not(.in)')];
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const sib=[...e.target.parentElement.children].filter(c=>c.classList.contains('rv'));e.target.style.transitionDelay=Math.min(sib.indexOf(e.target),6)*70+'ms';e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(e=>io.observe(e));
};
document.addEventListener('DOMContentLoaded',()=>{K.paint();K.updateCount();K.reveal()});
if(document.readyState!=='loading'){setTimeout(()=>{K.paint();K.updateCount();K.reveal()})}
})();
