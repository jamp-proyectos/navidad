// Carta: genera un PDF muy visual con uno de los cinco diseños seleccionados.
document.getElementById('letterForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const feedback = document.getElementById('letterFeedback');

  if (!window.jspdf || !window.jspdf.jsPDF) {
    feedback.textContent = 'No se ha podido cargar el generador PDF. Comprueba tu conexión a Internet, desactiva bloqueadores de anuncios para esta página e inténtalo de nuevo.';
    return;
  }

  const themes = {
    royal: {name:'Real clásico', sky:[10,42,34], deep:[7,31,26], accent:[212,175,94], accent2:[240,214,158], paper:[252,247,234], ink:[42,52,45], soft:[226,214,184], motif:'crown'},
    parchment: {name:'Pergamino antiguo', sky:[122,85,45], deep:[88,58,28], accent:[166,118,60], accent2:[214,177,117], paper:[248,236,206], ink:[86,58,32], soft:[220,193,146], motif:'scroll'},
    stars: {name:'Noche estrellada', sky:[16,38,74], deep:[10,24,50], accent:[168,199,232], accent2:[236,245,255], paper:[246,249,255], ink:[29,45,73], soft:[186,209,236], motif:'star'},
    elegant: {name:'Elegante dorado', sky:[22,31,52], deep:[14,20,35], accent:[203,168,92], accent2:[241,219,160], paper:[250,248,242], ink:[40,47,60], soft:[214,196,155], motif:'diamond'},
    christmas: {name:'Navidad clásica', sky:[124,36,42], deep:[88,24,30], accent:[224,190,132], accent2:[246,224,178], paper:[255,250,238], ink:[52,66,50], soft:[210,166,132], motif:'holly'}
  };

  const theme = themes[data.get('letterDesign')] || themes.royal;
  const doc = new window.jspdf.jsPDF({orientation:'portrait', unit:'mm', format:'a4'});
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 0;

  function drawMotif(x, y, size, type, color){
    doc.setLineWidth(0.45);
    if(type==='crown'){
      doc.setDrawColor(...color);
      doc.line(x-size,y,x,y-size*0.8);doc.line(x,y-size*0.8,x+size,y);
      doc.line(x-size,y,x-size,y-size*0.35);doc.line(x+size,y,x+size,y-size*0.35);
      doc.setFillColor(...color);doc.circle(x,y-size*0.95,size*0.16,'F');
    } else if(type==='star'){
      doc.setDrawColor(...color);
      for(let i=0;i<5;i++){
        const a=-Math.PI/2+i*2*Math.PI/5,b=a+2*Math.PI/5;
        doc.line(x+Math.cos(a)*size,y+Math.sin(a)*size,x+Math.cos(b)*size,y+Math.sin(b)*size);
      }
    } else if(type==='diamond'){
      doc.setDrawColor(...color);
      doc.line(x,y-size,x-size,y);doc.line(x-size,y,x,y+size);doc.line(x,y+size,x+size,y);doc.line(x+size,y,x,y-size);
    } else if(type==='holly'){
      doc.setFillColor(...color);
      doc.circle(x-size*0.5,y,size*0.32,'F');doc.circle(x+size*0.5,y,size*0.32,'F');
      doc.setDrawColor(...color);doc.line(x,y-size*0.7,x,y+size*0.7);
    } else {
      doc.setDrawColor(...color);
      doc.line(x-size,y,x+size,y);doc.line(x,y-size,x,y+size);
      doc.circle(x,y,size*0.55);
    }
  }

  function drawSnowfield(){
    doc.setFillColor(255,255,255);
    [[24,248,1.1],[45,262,0.8],[68,252,1.3],[94,266,0.9],[120,250,1.1],[148,264,0.8],[172,252,1.2]].forEach(([x,y,r])=>doc.circle(x,y,r,'F'));
  }

  function drawPage(isFirst){
    doc.setFillColor(...theme.paper);doc.rect(0,0,pageW,pageH,'F');
    doc.setDrawColor(...theme.accent);doc.setLineWidth(1.6);doc.rect(8,8,pageW-16,pageH-16);
    doc.setLineWidth(0.4);doc.rect(12,12,pageW-24,pageH-24);

    const headH=isFirst?58:34;
    doc.setFillColor(...theme.sky);doc.rect(13,13,pageW-26,headH,'F');
    doc.setFillColor(...theme.deep);doc.rect(13,13+headH-7,pageW-26,7,'F');

    doc.setDrawColor(...theme.accent2);doc.setLineWidth(0.3);
    for(let i=0;i<16;i++){
      const x=18+i*((pageW-36)/15),yy=18+Math.sin(i*1.3)*4;
      doc.line(x,yy,x+2.5,yy+2.5);doc.line(x+2.5,yy,x,yy+2.5);
    }

    doc.setTextColor(...theme.accent2);doc.setFont('times','bold');doc.setFontSize(isFirst?26:16);
    doc.text('A LOS REYES MAGOS',pageW/2,isFirst?33:27,{align:'center'});

    if(isFirst){
      doc.setFont('times','italic');doc.setFontSize(12);
      doc.text('Melchor  ·  Gaspar  ·  Baltasar',pageW/2,44,{align:'center'});
      drawMotif(pageW/2,52,3.4,theme.motif,theme.accent2);
      doc.setFont('times','bold');doc.setFontSize(8.5);
      doc.text(theme.name.toUpperCase(),pageW/2,61,{align:'center'});
      y=84;
    } else {
      drawMotif(pageW/2,34,2.6,theme.motif,theme.accent2);
      y=58;
    }

    doc.setFillColor(255,255,255);doc.rect(pageW-42,20,24,28,'F');
    doc.setDrawColor(...theme.accent);doc.setLineWidth(0.5);doc.rect(pageW-42,20,24,28);
    doc.setDrawColor(...theme.soft);doc.setLineWidth(0.25);
    for(let i=0;i<6;i++){doc.line(pageW-42,24+i*4,pageW-18,24+i*4);}
    doc.setFont('times','bold');doc.setFontSize(7);doc.setTextColor(...theme.deep);
    doc.text('ORIENTE',pageW-30,40,{align:'center'});
    drawMotif(pageW-30,31,2.4,theme.motif,theme.accent);

    doc.setTextColor(...theme.ink);doc.setFont('times','normal');doc.setFontSize(12.5);
    doc.text('Queridos Reyes Magos:',margin,y);y+=11;
  }

  function ensureSpace(h){
    if(y+h>pageH-30){doc.addPage();drawPage(false);}
  }

  function addBlock(label,value){
    const clean=String(value||'').trim();
    if(!clean)return;
    ensureSpace(18);
    doc.setFillColor(...theme.soft);doc.rect(margin-2,y-5,pageW-margin*2+4,7,'F');
    doc.setFont('times','bold');doc.setFontSize(11.5);doc.setTextColor(...theme.deep);
    doc.text(label,margin,y);y+=9;
    doc.setFont('times','normal');doc.setFontSize(11.5);doc.setTextColor(...theme.ink);
    doc.splitTextToSize(clean,pageW-margin*2).forEach(line=>{ensureSpace(7);doc.text(line,margin,y);y+=6;});
    y+=7;
  }

  drawPage(true);
  const name=String(data.get('childName')||'').trim();
  doc.setFont('times','italic');doc.setFontSize(12);doc.setTextColor(...theme.ink);
  doc.splitTextToSize(`Me llamo ${name} y este año quiero contaros algunas cosas.`,pageW-margin*2).forEach(line=>{ensureSpace(8);doc.text(line,margin,y);y+=6.5;});
  y+=6;

  addBlock('Este año me he portado…',data.get('goodThing'));
  addBlock('Mis deseos para esta Navidad',data.get('wishList'));
  addBlock('Un mensaje para vosotros',data.get('message')||'Gracias por vuestra magia y por repartir ilusión.');

  ensureSpace(42);
  doc.setFont('times','italic');doc.setFontSize(12);doc.setTextColor(...theme.deep);
  doc.text('Con mucho cariño,',margin,y+3);y+=13;
  doc.setFont('times','bold');doc.setFontSize(17);doc.setTextColor(...theme.sky);
  doc.text(name,margin,y+3);
  doc.setDrawColor(...theme.accent);doc.setLineWidth(0.7);
  doc.line(margin,y+9,margin+Math.min(70,name.length*3.4),y+9);

  const pages=doc.getNumberOfPages();
  for(let p=1;p<=pages;p++){
    doc.setPage(p);
    doc.setFillColor(...theme.sky);doc.rect(13,pageH-27,pageW-26,14,'F');
    drawSnowfield();
    doc.setTextColor(...theme.accent2);doc.setFont('times','italic');doc.setFontSize(9.5);
    doc.text('Que la magia de la Navidad os acompañe siempre',pageW/2,pageH-18,{align:'center'});
    drawMotif(24,pageH-20,2.2,theme.motif,theme.accent2);
    drawMotif(pageW-24,pageH-20,2.2,theme.motif,theme.accent2);
  }

  const safeName=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'')||'mi-carta';
  doc.save(`carta-reyes-${safeName}.pdf`);
  feedback.textContent=`¡Tu carta en PDF con el diseño «${theme.name}» se ha generado y descargado! ✨`;
});

// Efectos sonoros del juego.
let audioCtx=null;
function playTone(freq,duration=.13){if(!freq)return;if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const now=audioCtx.currentTime,osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.12,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(now);osc.stop(now+duration+.02);}

// Juego
const stage=document.getElementById('gameStage'),player=document.getElementById('player'),overlay=document.getElementById('gameMessage');
let running=false,score=0,time=30,x=50,gameTimer=null,spawnTimer=null,sound=true,best=Number(localStorage.getItem('navidadBest')||0);
document.getElementById('best').textContent=String(best).padStart(2,'0');
function gameSound(freq=700){if(!sound)return;try{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();playTone(freq,.13);}catch(e){}}
function move(dx){if(!running)return;x=Math.max(5,Math.min(95,x+dx));player.style.left=x+'%';}
function spawnStar(){if(!running)return;const el=document.createElement('span');el.className='falling-star';el.textContent=Math.random()>.18?'★':'❄';el.style.left=(5+Math.random()*90)+'%';const duration=2.4+Math.random()*1.2;el.style.animationDuration=duration+'s';stage.appendChild(el);const born=Date.now();const checker=setInterval(()=>{if(!running||!el.isConnected){clearInterval(checker);return;}const elapsed=(Date.now()-born)/1000;const top=-30+(elapsed/duration)*390;const starX=parseFloat(el.style.left);if(top>220&&top<315&&Math.abs(starX-x)<9){clearInterval(checker);el.remove();score+=el.textContent==='★'?10:5;document.getElementById('score').textContent=String(score).padStart(2,'0');gameSound(el.textContent==='★'?880:580);return;}if(elapsed>=duration){clearInterval(checker);el.remove();}},45);}
function endGame(){running=false;clearInterval(gameTimer);clearInterval(spawnTimer);stage.querySelectorAll('.falling-star').forEach(e=>e.remove());if(score>best){best=score;localStorage.setItem('navidadBest',best);document.getElementById('best').textContent=String(best).padStart(2,'0');}overlay.classList.remove('hidden');overlay.querySelector('strong').textContent=score>=80?'¡Eres una estrella navideña!':'¡Buen trabajo, ayudante de Navidad!';overlay.querySelector('span').textContent=`Has conseguido ${score} puntos. ¿Jugamos otra vez?`;document.getElementById('startGame').textContent='Volver a jugar';}
function startGame(){score=0;time=30;x=50;running=true;player.style.left=x+'%';document.getElementById('score').textContent='00';document.getElementById('time').textContent='30';overlay.classList.add('hidden');gameSound(660);spawnStar();spawnTimer=setInterval(spawnStar,650);gameTimer=setInterval(()=>{time--;document.getElementById('time').textContent=String(time).padStart(2,'0');if(time<=0)endGame();},1000);stage.focus();}
document.getElementById('startGame').addEventListener('click',startGame);
document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','a','A','d','D'].includes(e.key)&&running){e.preventDefault();move(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'?-5:5);}});
document.getElementById('leftBtn').addEventListener('click',()=>move(-7));document.getElementById('rightBtn').addEventListener('click',()=>move(7));
document.getElementById('soundToggle').addEventListener('click',e=>{sound=!sound;e.currentTarget.textContent='♫ Sonido: '+(sound?'sí':'no');e.currentTarget.setAttribute('aria-pressed',String(sound));});
document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));
