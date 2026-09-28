(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var clamp=function(n,a,b){return Math.max(a,Math.min(b,n))};

/* ---------- Settings (override in config.js) ---------- */
var CFG={wishesDb:'',wishesNode:'aleena-sudheesh/wishes',musicVolume:'0.5'};
var user=window.WEDDING_CONFIG||{};
Object.keys(CFG).forEach(function(k){if(typeof user[k]==='string')CFG[k]=user[k]});
if(!/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.(firebasedatabase\.app|firebaseio\.com)$/i.test(CFG.wishesDb))CFG.wishesDb='';
if(!/^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/.test(CFG.wishesNode))CFG.wishesNode='aleena-sudheesh/wishes';
var MVOL=parseFloat(CFG.musicVolume);if(!(MVOL>=.05&&MVOL<=1))MVOL=.5;

var EVENTS={
  rc:{title:'Wedding Reception, Sudheesh & Aleena',start:'20261025T053000Z',end:'20261025T093000Z',loc:'Vyapara Bhavan, Padiyottuchal, Payyannur, Kannur'}
};

/* ---------- Line drawing: measure each line and use its real length (does not rely on SVG pathLength, which Safari handles unevenly) ---------- */
function prep(p){
  var L=0;try{L=p.getTotalLength()}catch(e){}
  if(!L)return 0;
  p.style.strokeDasharray=L+' '+L;p.style.strokeDashoffset=reduce?0:L;return L;
}
var DIAL=2*Math.PI*45;
$$('.arch .tr,.rings .th').forEach(prep);
$$('.dial .arc').forEach(function(a){a.style.strokeDasharray=DIAL+' '+DIAL;a.style.strokeDashoffset=DIAL});

/* ---------- Decorations drawn by script (no user input is ever used here) ---------- */
var NS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}

function flower(g,type){
  if(type===0){          /* marigold */
    for(var i=0;i<8;i++){var a=i*45*Math.PI/180;el('circle',{cx:Math.sin(a)*6.2,cy:-Math.cos(a)*6.2,r:3.7,fill:'#f5a300'},g)}
    el('circle',{r:6.2,fill:'#ffb61f'},g);el('circle',{r:3,fill:'#d97c00'},g);
  }else{                 /* jasmine */
    for(var j=0;j<5;j++)el('ellipse',{cx:0,cy:-5.4,rx:3.4,ry:5.6,fill:'#fffdf3',stroke:'#e3d4a5','stroke-width':.6,transform:'rotate('+(j*72)+')'},g);
    el('circle',{r:2.1,fill:'#f2c14e'},g);
  }
}
function garland(box){
  box.textContent='';
  var W=box.clientWidth||innerWidth,H=box.clientHeight||100;
  var svg=el('svg',{viewBox:'0 0 '+W+' '+H,width:W,height:H,'aria-hidden':'true'},box);
  var plain=box.getAttribute('data-garland')==='plain';        /* plain = one clean flower string, no hanging strands */
  var sag=plain?16:Math.min(34,H*.36),y0=plain?10:8;
  var Y=function(t){return y0+4*sag*t*(1-t)};
  el('path',{d:'M0 '+y0+' Q '+(W/2)+' '+(y0+2*sag)+' '+W+' '+y0,fill:'none',stroke:'#2f6a3f','stroke-width':1.8},svg);
  var n=Math.max(10,Math.round(W/21));
  for(var i=0;i<n;i++){
    var t=(i+.5)/n,x=t*W,y=Y(t);
    var pos=el('g',{transform:'translate('+x+' '+y+')'},svg);
    var sw=el('g',{},pos);sw.style.animation='breeze 3.2s ease-in-out '+(-i*.23)+'s infinite alternate';
    el('ellipse',{cx:-9,cy:3,rx:6,ry:2.6,fill:'#3b7a4a',transform:'rotate(-25 -9 3)'},sw);
    el('ellipse',{cx:9,cy:3,rx:6,ry:2.6,fill:'#3b7a4a',transform:'rotate(25 9 3)'},sw);
    flower(el('g',{},sw),i%2);
  }
  var m=plain?0:Math.max(4,Math.round(W/78));
  for(var k=0;k<m;k++){
    var tt=(k+.5)/m,sx=tt*W,sy=Y(tt),len=26+((k*37)%34);
    var st=el('g',{transform:'translate('+sx+' '+sy+')'},svg),sg=el('g',{},st);
    sg.style.animation='swing '+(2.8+(k%3)*.5)+'s ease-in-out '+(-k*.4)+'s infinite alternate';sg.style.transformOrigin='0 0';
    el('line',{x1:0,y1:0,x2:0,y2:len,stroke:'#2f6a3f','stroke-width':1.2},sg);
    for(var q=8;q<len;q+=9)el('ellipse',{cx:0,cy:q,rx:3,ry:4.3,fill:'#fffdf3',stroke:'#e3d4a5','stroke-width':.6},sg);
    flower(el('g',{transform:'translate(0 '+(len+5)+')'},sg),0);
  }
}
function buildGarlands(){$$('[data-garland]').forEach(garland)}

function mandala(box){
  var svg=el('svg',{viewBox:'-100 -100 200 200','aria-hidden':'true'},box);
  var R=[{n:8,r:24,rx:8,ry:19,c:'#ffb400',sp:90,rev:0},{n:12,r:44,rx:8,ry:20,c:'#f08a9b',sp:120,rev:1},{n:16,r:64,rx:7,ry:20,c:'#fff3d6',sp:150,rev:0},{n:24,r:84,rx:5,ry:13,c:'#dcbb78',sp:180,rev:1},{n:36,r:97,rx:2.6,ry:5,c:'#f4dfa4',sp:210,rev:0}];
  R.forEach(function(g){
    var grp=el('g',{'class':'ring'+(g.rev?' rev':'')},svg);grp.style.setProperty('--sp',g.sp+'s');
    for(var i=0;i<g.n;i++)el('ellipse',{cx:0,cy:-g.r,rx:g.rx,ry:g.ry,fill:g.c,transform:'rotate('+(360/g.n*i)+')'},grp);
  });
}
$$('[data-mandala]').forEach(mandala);
buildGarlands();
(function(){var w=innerWidth,t;addEventListener('resize',function(){clearTimeout(t);t=setTimeout(function(){if(Math.abs(innerWidth-w)>40){w=innerWidth;buildGarlands()}},250)})})();

/* ---------- Falling petals (they fall the full height of the first screen, even when it is tall on a phone) ---------- */
(function(){
  var box=$('#petals'),hero=$('#hero');if(!box||!hero||reduce)return;
  function fall(){box.style.setProperty('--fall',(hero.offsetHeight+60)+'px')}
  fall();addEventListener('resize',fall);addEventListener('load',fall);
  var H=Math.max(hero.offsetHeight,700),types=['j','j','m','r','j','m'];
  for(var i=0;i<24;i++){
    var p=document.createElement('i');p.className='petal '+types[i%types.length];
    var speed=55+Math.random()*50,dur=(H+60)/speed;              /* pixels per second, so the pace looks the same on any height */
    p.style.setProperty('--x',(Math.random()*100)+'%');
    p.style.setProperty('--s',(7+Math.random()*9)+'px');
    p.style.setProperty('--dur',dur+'s');
    p.style.setProperty('--del',(-Math.random()*dur)+'s');
    p.style.setProperty('--dx',((Math.random()*180)-90)+'px');
    box.appendChild(p);
  }
})();

/* ---------- Reveal: gold flourish under titles, rings coming together ---------- */
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.5});
  $$('h2.title,.rings').forEach(function(t){io.observe(t)});
  var gr=$('.gate-rings');if(gr)setTimeout(function(){gr.classList.add('in')},300);
})();

/* ---------- The red thread is tied once the photo is reached (about half in view) ---------- */
var archTie=(function(){
  var arch=$('.arch'),ready=false,seenHalf=false,tied=false;
  function go(){if(tied||!ready||!seenHalf||!arch)return;tied=true;arch.classList.add('tied')}
  if(arch)new IntersectionObserver(function(es){seenHalf=es[0].intersectionRatio>=.5;go()},{threshold:[0,.25,.5,.75,1]}).observe(arch);
  return function(){ready=true;go()};
})();

/* ---------- Wooden door gate ---------- */
var gate=$('#gate'),audio=null,tape=$('#music');
function openGate(){
  gate.classList.add('open');
  document.body.classList.remove('locked');
  document.body.classList.add('is-open');
  startMusic();          /* called inside the tap, so the browser allows the music to start */
  setTimeout(function(){gate.classList.add('fade')},1300);
  setTimeout(function(){gate.style.display='none';archTie()},2300);
}
$('#open').addEventListener('click',openGate);
$('#open').focus({preventScroll:true});

/* ---------- Music: starts when the doors open ----------
   Main file: music/bgm-soft-25s.mp3 already begins at 0:25 of the song with a soft fade-in and fade-out built in,
   so it starts gently from the right place on every device (iPhone Safari cannot change volume or jump around).
   Safety net: if that file is missing, music/bgm.mp3 (the full song) is used instead, jumping to 0:25 and fading in from the page. */
function setPlaying(on){tape.classList.toggle('playing',on);tape.setAttribute('aria-pressed',on?'true':'false')}
var START_AT=25,CB='?v=5',wantPlay=false,srcTry=0,fadeTimer=0,ending=false;
var SRCS=[{u:'music/bgm-soft-25s.mp3',full:false},{u:'bgm-soft-25s.mp3',full:false},{u:'music/bgm.mp3',full:true},{u:'bgm.mp3',full:true}];
function isFull(){return SRCS[srcTry].full}
function fadeTo(v,ms){
  clearInterval(fadeTimer);
  var from=audio.volume,t0=Date.now();
  fadeTimer=setInterval(function(){
    var k=Math.min(1,(Date.now()-t0)/ms);
    try{audio.volume=from+(v-from)*k}catch(e){}
    if(k>=1)clearInterval(fadeTimer);
  },100);
}
function startMusic(){
  if(!audio)return;
  wantPlay=true;
  if(isFull()){                       /* safety net: full song, so start at 0:25 and fade in from the page */
    audio.loop=false;
    try{audio.volume=0}catch(e){}
    if(audio.readyState>=1){try{audio.currentTime=START_AT}catch(e){}}
    else audio.addEventListener('loadedmetadata',function(){try{audio.currentTime=START_AT}catch(e){}},{once:true});
    audio.addEventListener('playing',function(){try{if(audio.currentTime<START_AT-1)audio.currentTime=START_AT}catch(e){}},{once:true});
  }else{                              /* main file: the fades are inside the audio */
    audio.loop=true;
    try{audio.volume=MVOL}catch(e){}
    try{audio.currentTime=0}catch(e){}
  }
  var pr=audio.play();                /* called inside the tap, so the browser allows it */
  if(pr&&pr.then)pr.then(function(){tape.classList.add('show');setPlaying(true);if(isFull())fadeTo(MVOL,6000)}).catch(function(){});
}
try{
  audio=new Audio();audio.loop=true;audio.preload='metadata';audio.src=SRCS[0].u+CB;
  audio.addEventListener('loadedmetadata',function(){tape.classList.add('show')});
  audio.addEventListener('error',function(){
    if(srcTry+1<SRCS.length){srcTry++;audio.src=SRCS[srcTry].u+CB;audio.load();if(wantPlay)startMusic();return}
    tape.classList.remove('show');setPlaying(false);
    if(window.console)console.warn('Music file not found. Keep the music folder next to index.html.');
  });
  /* full-song safety net only: ease out near the end, then come back in softly from 0:25 */
  audio.addEventListener('timeupdate',function(){
    if(isFull()&&audio.duration&&audio.duration-audio.currentTime<3&&!ending){ending=true;fadeTo(0,2600)}
  });
  audio.addEventListener('ended',function(){
    if(!isFull())return;
    ending=false;try{audio.currentTime=START_AT;audio.volume=0}catch(e){}
    audio.play().then(function(){fadeTo(MVOL,4000)}).catch(function(){});
  });
  tape.addEventListener('click',function(){
    if(audio.paused){
      try{audio.volume=isFull()?0:MVOL}catch(e){}
      audio.play().then(function(){setPlaying(true);if(isFull())fadeTo(MVOL,1500)}).catch(function(){})
    }else{audio.pause();setPlaying(false)}
  });
}catch(e){}

/* ---------- Scroll: progress thread, top bar, tilt ---------- */
var bar=$('#bar'),prog=$('#prog'),ticking=false;
function onScroll(){
  if(ticking)return;ticking=true;
  requestAnimationFrame(function(){
    var h=document.documentElement.scrollHeight-innerHeight;
    prog.style.transform='scaleX('+(h>0?clamp(scrollY/h,0,1):0)+')';
    bar.classList.toggle('solid',scrollY>40);
    ticking=false;
  });
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- Hero pointer parallax (desktop) ---------- */
(function(){
  var hero=$('#hero'),arch=$('#archwrap');
  if(reduce||!hero||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  arch.style.transition='transform .25s ease-out';
  hero.addEventListener('pointermove',function(e){
    var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    arch.style.transform='translate('+(x*-14)+'px,'+(y*-10)+'px) rotate('+(x*2)+'deg)';
  });
})();

/* ---------- Events: red thread timeline ---------- */
var tl=$('#tl'),tlsvg=$('#tlsvg'),tlbase=$('#tlbase'),tlfill=$('#tlfill'),tlLen=1;
function buildThread(){
  var h=tl.offsetHeight,step=140,d='M17 0';
  for(var y=0,i=0;y<h;y+=step,i++){
    var dir=i%2?-1:1,y2=Math.min(y+step,h);
    d+=' C '+(17+dir*4)+' '+(y+step*.33)+', '+(17-dir*4)+' '+(y+step*.66)+', 17 '+y2;
  }
  tlsvg.setAttribute('viewBox','0 0 34 '+h);tlsvg.setAttribute('height',h);
  tlbase.setAttribute('d',d);tlfill.setAttribute('d',d);tlLen=prep(tlfill)||1;
  paintThread();
}
function paintThread(){
  var r=tl.getBoundingClientRect(),line=innerHeight*.62;
  var p=clamp((line-r.top)/r.height,0,1);
  tlfill.style.strokeDashoffset=String(reduce?0:(1-p)*tlLen);
  $$('.ev').forEach(function(ev){ev.classList.toggle('lit',ev.getBoundingClientRect().top+40<line)});
}
addEventListener('scroll',function(){paintThread()},{passive:true});
addEventListener('resize',buildThread);
addEventListener('load',buildThread);
buildThread();

/* ---------- Countdown (rings fill as time passes) ---------- */
var target=new Date('2026-10-25T11:00:00+05:30').getTime(),last={};
function pad(n){return n<10?'0'+n:''+n}
function put(id,v,frac){
  var el2=$('#cd-'+id),arc=$('#ar-'+id);if(!el2)return;
  arc.style.strokeDashoffset=String((1-clamp(frac,0,1))*DIAL);
  if(last[id]===v)return;
  el2.textContent=v;
  if(last[id]!==undefined&&!reduce){el2.classList.remove('flip');void el2.offsetWidth;el2.classList.add('flip')}
  last[id]=v;
}
function tick(){
  var d=target-Date.now();
  if(d<=0){put('d','00',0);put('h','00',0);put('m','00',0);put('s','00',0);var note=$('#cd-note');if(note)note.textContent='The celebrations have begun';return}
  var s=Math.floor(d/1000),days=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=s%60;
  put('d',pad(days),days/30);put('h',pad(h),h/24);put('m',pad(m),m/60);put('s',pad(sec),sec/60);
}
tick();setInterval(tick,1000);

/* ---------- Calendar ---------- */
function gcal(k){
  var e=EVENTS[k];
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(e.title)+'&dates='+e.start+'/'+e.end+'&location='+encodeURIComponent(e.loc)+(e.desc?'&details='+encodeURIComponent(e.desc):'')+'&ctz=Asia/Kolkata';
}
$$('[data-cal]').forEach(function(a){var k=a.getAttribute('data-cal');if(EVENTS[k])a.href=gcal(k)});
var icsBtn=$('#ics');
if(icsBtn)icsBtn.addEventListener('click',function(){
  var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aleena and Sudheesh//Wedding//EN'];
  Object.keys(EVENTS).forEach(function(k){
    var e=EVENTS[k];
    L.push('BEGIN:VEVENT','UID:'+k+'-aleena-sudheesh-2026@wedding','DTSTAMP:20260919T000000Z','DTSTART:'+e.start,'DTEND:'+e.end,'SUMMARY:'+e.title,'LOCATION:'+e.loc.replace(/,/g,'\\,'));
    if(e.desc)L.push('DESCRIPTION:'+e.desc);
    L.push('END:VEVENT');
  });
  L.push('END:VCALENDAR');
  var b=new Blob([L.join('\r\n')],{type:'text/calendar'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='Sudheesh-Aleena-Wedding.ics';document.body.appendChild(a);a.click();a.remove();
});

/* ---------- Input hygiene (shared by RSVP and wishes) ---------- */
var BAD_INVIS=/[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g;
function cleanLine(s,max){return String(s==null?'':s).replace(BAD_INVIS,'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max)}
function cleanText(s,max){return String(s==null?'':s).replace(/\r\n?/g,'\n').replace(BAD_INVIS,'').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim().slice(0,max)}
var LINKISH=/https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|in|io|me|ly|xyz|co|info|biz)\b/i;

/* ---------- Wishes wall ---------- */
(function(){
  var DB=CFG.wishesDb,NODE=CFG.wishesNode,PAGE=20;
  var form=$('#wForm'),toast=$('#wToast'),notes=$('#notes'),stat=$('#wStat'),btn=$('#wBtn'),more=$('#more'),cnt=$('#wCount'),flag=$('#demoFlag');
  var seen={},oldest=null,loaded=0,hasMore=false,openedAt=0;
  var COLORS=['#fff1e8','#ffe6ea','#eaf5ee','#fdf3cf','#f0eaff','#e9f2fb'];
  var KEY=/^[-A-Za-z0-9_]{8,40}$/;
  var demo=!DB&&/[?&]demo=1(&|$)/.test(location.search);
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}

  /* Every value is written with textContent, never innerHTML, so a wish can never inject markup or script. */
  function makeNote(k,w,isNew){
    var h=hash(k),el=document.createElement('article'),p=document.createElement('p'),by=document.createElement('span');
    el.className='note'+(isNew?' new':'');
    el.style.setProperty('--nc',COLORS[h%COLORS.length]);
    el.style.setProperty('--r',(((h>>3)%9)-4)*.6+'deg');
    p.textContent=w.msg;by.className='by';by.textContent=w.name;
    el.appendChild(p);el.appendChild(by);return el;
  }
  /* Anything read back (from the database or from this device) is checked again before it is shown. */
  function sane(k,w){
    if(!KEY.test(k)||!w||typeof w!=='object'||typeof w.name!=='string'||typeof w.msg!=='string')return null;
    var name=cleanLine(w.name,60),msg=cleanText(w.msg,400);
    return (name&&msg)?{name:name,msg:msg}:null;
  }
  function status(){
    stat.hidden=false;
    stat.textContent=loaded?loaded+(loaded===1?' wish so far':' wishes so far'):'Be the first to leave a wish.';
    more.hidden=!hasMore;
  }
  function addNotes(pairs,prepend,isNew){
    var frag=document.createDocumentFragment(),added=0;
    pairs.forEach(function(pr){
      if(seen[pr[0]])return;var s=sane(pr[0],pr[1]);if(!s)return;
      seen[pr[0]]=1;frag.appendChild(makeNote(pr[0],s,isNew));added++;
    });
    if(!added)return;
    loaded+=added;
    if(prepend)notes.insertBefore(frag,notes.firstChild);else notes.appendChild(frag);
  }
  function toPairs(obj){
    if(!obj||typeof obj!=='object')return [];
    return Object.keys(obj).filter(function(k){return KEY.test(k)}).sort().map(function(k){return [k,obj[k]]});
  }
  function url(q){return DB+'/'+NODE+'.json'+(q||'')}

  /* ----- shared wall (Firebase Realtime Database over its REST address) ----- */
  function loadFirst(){
    fetch(url('?orderBy=%22%24key%22&limitToLast='+PAGE)).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(o){
      var pairs=toPairs(o);
      if(pairs.length)oldest=pairs[0][0];
      hasMore=pairs.length>=PAGE;
      addNotes(pairs.slice().reverse(),false,false);status();
    }).catch(function(){stat.hidden=false;stat.textContent='The wall could not load just now. Please refresh in a moment.'});
  }
  function loadOlder(){
    if(!oldest)return;more.disabled=true;
    fetch(url('?orderBy=%22%24key%22&endAt='+encodeURIComponent('"'+oldest+'"')+'&limitToLast='+(PAGE+1))).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(o){
      var pairs=toPairs(o).filter(function(p){return p[0]!==oldest});
      hasMore=pairs.length>=PAGE;
      if(pairs.length)oldest=pairs[0][0];
      addNotes(pairs.slice().reverse(),false,false);status();
    }).catch(function(){}).then(function(){more.disabled=false});
  }
  function poll(){
    if(document.hidden)return;
    fetch(url('?orderBy=%22%24key%22&limitToLast=10')).then(function(r){return r.ok?r.json():null}).then(function(o){
      var fresh=toPairs(o).filter(function(p){return !seen[p[0]]});
      if(fresh.length){addNotes(fresh,true,true);status()}
    }).catch(function(){});
  }

  /* ----- preview mode: no database address yet, so wishes stay on this device only ----- */
  function localLoad(){try{var a=JSON.parse(localStorage.getItem('as_local_wishes')||'[]');return Array.isArray(a)?a.slice(-30):[]}catch(e){return []}}
  function localSave(name,msg){
    var a=localLoad(),k='local'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    a.push({k:k,name:name,msg:msg});try{localStorage.setItem('as_local_wishes',JSON.stringify(a.slice(-30)))}catch(e){}
    return k;
  }

  $('#wm').addEventListener('input',function(){cnt.textContent=this.value.length+' / 400'});
  ['wn','wm'].forEach(function(id){$('#'+id).addEventListener('focus',function(){if(!openedAt)openedAt=Date.now()})});

  function say(msg,bad){toast.textContent=msg;toast.className='toast'+(bad?' err':'')}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if($('#wh').value){say('Thank you! Your wishes have been received.');form.reset();return}   /* hidden trap field: only bots fill it */
    var name=cleanLine($('#wn').value,60),msg=cleanText($('#wm').value,400);
    if(!name){say('Please add your name.',true);return}
    if(msg.length<2){say('Please write a short message.',true);return}
    if(LINKISH.test(msg)||LINKISH.test(name)){say('Please leave out web links, so the wall stays friendly.',true);return}
    if(!openedAt||Date.now()-openedAt<2000){say('Please take a moment to write your wishes, then send.',true);return}
    var now=Date.now(),lastT=0,cntSent=0;
    try{lastT=+localStorage.getItem('as_w_t')||0;cntSent=+localStorage.getItem('as_w_n')||0}catch(x){}
    if(now-lastT<30000){say('Lovely! Please wait a few seconds before sending another.',true);return}
    if(cntSent>=5){say('You have sent plenty of wishes already. Thank you so much!',true);return}
    function done(k){
      try{localStorage.setItem('as_w_t',String(now));localStorage.setItem('as_w_n',String(cntSent+1))}catch(x){}
      form.reset();cnt.textContent='0 / 400';openedAt=0;say('Thank you! Your wishes are on the wall.');
      if(k&&KEY.test(k)){addNotes([[k,{name:name,msg:msg}]],true,true);status()}
    }
    if(!DB){done(localSave(name,msg));return}
    btn.disabled=true;say('Sending your wishes...');
    /* sent as plain text so the browser needs no extra permission check with the database */
    fetch(url(),{method:'POST',body:JSON.stringify({name:name,msg:msg,ts:{'.sv':'timestamp'}})})
      .then(function(r){if(!r.ok)throw 0;return r.json()})
      .then(function(o){done(o&&typeof o.name==='string'?o.name:null)})
      .catch(function(){say('That did not go through. Please check your connection and try again.',true)})
      .then(function(){btn.disabled=false});
  });
  more.addEventListener('click',loadOlder);

  if(DB){loadFirst();setInterval(poll,10000);document.addEventListener('visibilitychange',function(){if(!document.hidden)poll()})}
  else{
    flag.hidden=false;flag.textContent='Preview mode: wishes are saved on this device only. Add your Firebase address in config.js to share them with everyone.';
    hasMore=false;
    var L=localLoad().reverse().map(function(w){return [w&&w.k,w]});
    if(demo){
      var S=[['Anitha & Roy','Wishing you a lifetime of love, laughter and good food. Cannot wait to celebrate with you both!'],['The Palathingal family','God bless you both. Two families, one big happy celebration.'],['Meera','Aleena, your voice on the radio made my mornings. Now go make your own happily ever after!'],['Rahul','Congratulations Doc! May every film night and every long journey be a good one.'],['The Mananthavady gang','Cannot wait for Madhuramveppu. See you in Wayanad!']];
      L=L.concat(S.map(function(s,i){return ['demoKey'+i+'abcdef',{name:s[0],msg:s[1]}]}));
    }
    addNotes(L,false,false);status();
  }
})();

})();
