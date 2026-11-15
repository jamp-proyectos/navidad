// Carta: genera un PDF con uno de los cinco diseños seleccionados.
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
    royal: {name:'Real clásico', bg:[17,58,46], accent:[190,151,76], paper:[250,247,236], ink:[47,57,46], border:[190,151,76]},
    parchment: {name:'Pergamino', bg:[113,78,43], accent:[157,112,59], paper:[247,235,205], ink:[91,64,39], border:[177,137,83]},
    stars: {name:'Noche estrellada', bg:[24,55,94], accent:[194,216,240], paper:[246,249,255], ink:[35,54,79], border:[137,174,216]},
    elegant: {name:'Elegante', bg:[23,34,56], accent:[211,180,103], paper:[250,249,245], ink:[43,49,60], border:[181,148,78]},
    christmas: {name:'Navidad', bg:[132,43,49], accent:[221,190,135], paper:[255,249,237], ink:[55,68,51], border:[39,100,69]}
  };
  const theme = themes[data.get('letterDesign')] || themes.royal;
  const doc = new window.jspdf.jsPDF({orientation:'portrait', unit:'mm', format:'a4'});
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 22;
  let y = 0;

  function drawPage(isFirst) {
    doc.setFillColor(...theme.paper);
    doc.rect(0, 0, pageW, pageH, 'F');
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(0.8);
    doc.rect(9, 9, pageW - 18, pageH - 18);
    doc.setLineWidth(0.25);
    doc.rect(12, 12, pageW - 24, pageH - 24);

    doc.setFillColor(...theme.bg);
    doc.rect(13, 13, pageW - 26, isFirst ? 42 : 25, 'F');
    doc.setTextColor(...theme.accent);
    doc.setFont('times', 'bold');
    doc.setFontSize(isFirst ? 22 : 15);
    doc.text('A LOS REYES MAGOS', pageW / 2, isFirst ? 31 : 29, {align:'center'});
    if (isFirst) {
      doc.setFont('times', 'italic');
      doc.setFontSize(11);
      doc.text('Melchor · Gaspar · Baltasar', pageW / 2, 44, {align:'center'});
      doc.setFontSize(9);
      doc.text(theme.name.toUpperCase(), pageW / 2, 51, {align:'center'});
      y = 72;
    } else {
      y = 51;
    }
    doc.setTextColor(...theme.ink);
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text('Queridos Reyes Magos:', margin, y);
    y += 11;
  }

  function ensureSpace(height) {
    if (y + height > pageH - 28) {
      doc.addPage();
      drawPage(false);
    }
  }

  function addBlock(label, value) {
    const clean = String(value || '').trim();
    if (!clean) return;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    ensureSpace(12);
    doc.setTextColor(...theme.bg);
    doc.text(label, margin, y);
    y += 6;
    doc.setFont('times', 'normal');
    doc.setFontSize(11.5);
    doc.setTextColor(...theme.ink);
    const lines = doc.splitTextToSize(clean, pageW - margin * 2);
    lines.forEach(line => {
      ensureSpace(6);
      doc.text(line, margin, y);
      y += 5.8;
    });
    y += 6;
  }

  drawPage(true);
  const name = String(data.get('childName') || '').trim();
  doc.setFont('times', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(...theme.ink);
  const opening = doc.splitTextToSize(`Me llamo ${name} y este año quiero contaros algunas cosas.`, pageW - margin * 2);
  opening.forEach(line => { ensureSpace(7); doc.text(line, margin, y); y += 6; });
  y += 5;

  addBlock('Este año me he portado…', data.get('goodThing'));
  addBlock('Mis deseos para esta Navidad', data.get('wishList'));
  addBlock('Un mensaje para vosotros', data.get('message') || 'Gracias por vuestra magia y por repartir ilusión.');

  ensureSpace(35);
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(...theme.bg);
  doc.text('Con mucho cariño,', margin, y + 2);
  y += 12;
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.text(name, margin, y + 2);

  // Pie decorativo en todas las páginas.
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.setDrawColor(...theme.border);
    doc.line(25, pageH - 21, pageW - 25, pageH - 21);
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...theme.bg);
    doc.text('Que la magia de la Navidad os acompañe', pageW / 2, pageH - 15, {align:'center'});
  }

  const safeName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'mi-carta';
  doc.save(`carta-reyes-${safeName}.pdf`);
  feedback.textContent = `¡Tu carta en PDF con el diseño «${theme.name}» se ha generado y descargado! ✨`;
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
