/* ══════════════════════════════════════════
   Durga Psychiatric Centre — script.js v5
   Parallax · Carousel · AI Chat Widget
══════════════════════════════════════════ */

/* ─── PARALLAX ──────────────────────────── */
const parallaxLayers = document.querySelectorAll('[data-parallax]');
function runParallax() {
  const sy = window.scrollY;
  parallaxLayers.forEach(el => {
    const sp = parseFloat(el.dataset.parallax || '0.12');
    el.style.transform = `translate3d(0,${sy * sp}px,0)`;
  });
  // Legacy support
  document.querySelectorAll('.parallax-layer[data-speed]').forEach(el => {
    const s = parseFloat(el.dataset.speed || '0.1');
    el.style.transform = `translate3d(0,${sy * s}px,0) scale(1.08)`;
  });
  // Section reveal
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) el.classList.add('visible');
  });
}
window.addEventListener('scroll', runParallax, { passive: true });
window.addEventListener('resize', runParallax);
runParallax();

/* ─── REVIEWS MARQUEE ───────────────────── */
const marquee = document.querySelector('.marquee');
if (marquee) {
  const clone = marquee.cloneNode(true);
  marquee.parentElement.appendChild(clone);
}

/* ─── GALLERY CAROUSEL ──────────────────── */
function initCarousel(root) {
  if (!root) return;
  const track   = root.querySelector('.car-track');
  const slides  = root.querySelectorAll('.car-slide');
  const prevBtn = root.querySelector('.car-prev');
  const nextBtn = root.querySelector('.car-next');
  const dotsBox = root.querySelector('.car-dots');
  if (!track || !slides.length) return;

  let cur = 0, timer, isDragging = false, startX = 0, diffX = 0;
  const total = slides.length;

  // Build dots
  if (dotsBox) {
    dotsBox.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'car-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i+1}`);
      d.addEventListener('click', () => go(i));
      dotsBox.appendChild(d);
    });
  }

  function go(idx) {
    cur = (idx + total) % total;
    track.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    track.style.transform = `translateX(-${cur * 100}%)`;
    root.querySelectorAll('.car-dot').forEach((d, i) =>
      d.classList.toggle('active', i === cur));
    slides.forEach((s, i) => s.classList.toggle('active', i === cur));
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => go(cur + 1), 4500);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => go(cur - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(cur + 1));

  // Touch / mouse drag
  function onStart(x) { isDragging = true; startX = x; diffX = 0; track.style.transition = 'none'; clearInterval(timer); }
  function onMove(x)  { if (!isDragging) return; diffX = x - startX; track.style.transform = `translateX(calc(-${cur*100}% + ${diffX}px))`; }
  function onEnd()    { if (!isDragging) return; isDragging = false; if (Math.abs(diffX) > 50) go(cur + (diffX < 0 ? 1 : -1)); else go(cur); }

  track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  { passive: true });
  track.addEventListener('touchend',   onEnd);
  track.addEventListener('mousedown',  e => onStart(e.clientX));
  track.addEventListener('mousemove',  e => onMove(e.clientX));
  track.addEventListener('mouseup',    onEnd);
  track.addEventListener('mouseleave', onEnd);

  // Keyboard
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(cur - 1);
    if (e.key === 'ArrowRight') go(cur + 1);
  });

  go(0);
}

document.querySelectorAll('.carousel').forEach(initCarousel);

/* ─── AI CHAT WIDGET ────────────────────── */
(function () {
  const QA = [
    { q: ['hello','hi','hey','start','namaste'],
      a: '🙏 Welcome to Durga Psychiatric Centre! I\'m your AI assistant. I can help you with <b>appointments</b>, <b>services</b>, or take the <b>free mental health test</b>. How can I help?' },
    { q: ['appointment','book','booking','consult','session','meet'],
      a: '📅 To book an appointment, please WhatsApp us directly at <b>+91 73959 44527</b> or <b>+91 93422 65841</b>. We offer both in-person (T Nagar, Chennai) and online sessions.' },
    { q: ['test','assessment','screen','check','anxiety','depression','stress','mental health test','free test'],
      a: '🧠 Take our <b>Free AI Mental Health Screening Test</b> now! It covers anxiety, depression, and stress — takes only 3–5 minutes.<br><br><a href="ai-test.html" style="color:#ffd66a;font-weight:700;">👉 Start Free Test</a> or visit <a href="https://ddurga.streamlit.app/" target="_blank" style="color:#ffd66a;font-weight:700;">ddurga.streamlit.app</a>' },
    { q: ['address','location','where','directions','map','place','t nagar','chennai'],
      a: '📍 We are located at:<br><b>Old No.14, New No.29, Srinivasa Nagar,<br>Near Aruna Hotel, T Nagar,<br>Chennai – 600017, Tamil Nadu</b><br><br><a href="contact.html" style="color:#ffd66a;font-weight:700;">View on Map →</a>' },
    { q: ['service','offer','help','provide','treat','therapy','counseling','counselling','psychiatric'],
      a: '💚 We offer:<br>• Individual Counseling<br>• Couples &amp; Family Therapy<br>• Psychiatric Support<br>• Mental Health Workshops<br>• Soft Skills Training<br>• Online Sessions<br><br><a href="services.html" style="color:#ffd66a;font-weight:700;">See All Services →</a>' },
    { q: ['cost','fee','price','charge','rate','affordable','free'],
      a: '💬 Fees vary by service type and session duration. Please WhatsApp us at <b>+91 73959 44527</b> for a personalised quote. We believe mental health care should be accessible.' },
    { q: ['online','virtual','video','remote','zoom','call'],
      a: '🌐 Yes! We offer <b>online consultations</b> for both Indian and international clients via video call. Private, professional, and effective from the comfort of your home.' },
    { q: ['contact','phone','call','number','email','whatsapp'],
      a: '📞 Contact us:<br>• WhatsApp / Call: <b>+91 73959 44527</b><br>• Phone: <b>+91 93422 65841</b><br>• Web: <a href="https://www.durgacounselingcentre.com" target="_blank" style="color:#ffd66a;">durgacounselingcentre.com</a><br><br><a href="contact.html" style="color:#ffd66a;font-weight:700;">Contact Page →</a>' },
    { q: ['about','who','durga','founder','ceo','qualification','credential','degree'],
      a: '👩‍⚕️ <b>D. Durga</b> is Founder &amp; CEO of Durga Psychiatric Centre. Her qualifications: DPN (Nursing), DAHM, BBA (Marketing), MBA (HR), MSW (Medical &amp; Psychiatry).<br><br><a href="about.html" style="color:#ffd66a;font-weight:700;">Full Profile →</a>' },
    { q: ['thank','thanks','bye','goodbye','great','good','ok','okay'],
      a: '🌟 Thank you for reaching out! Remember — seeking help is a sign of strength. We\'re here for you. 💚<br><br>Feel free to <a href="https://wa.me/917395944527" target="_blank" style="color:#ffd66a;font-weight:700;">WhatsApp us</a> anytime.' },
  ];

  const DEFAULT = '🤖 I didn\'t quite catch that. Try asking about our <b>services</b>, <b>appointment booking</b>, <b>location</b>, or the <b>free mental health test</b>. Or <a href="https://wa.me/917395944527" target="_blank" style="color:#ffd66a;">WhatsApp us directly</a>.';

  function getReply(msg) {
    const m = msg.toLowerCase();
    for (const item of QA) {
      if (item.q.some(k => m.includes(k))) return item.a;
    }
    return DEFAULT;
  }

  function buildWidget() {
    const style = document.createElement('style');
    style.textContent = `
      #dpc-chat-bubble{position:fixed;bottom:80px;right:14px;z-index:9999;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6a1b9a,#00897b);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(106,27,154,.45);transition:transform .2s;font-size:22px;color:#fff}
      #dpc-chat-bubble:hover{transform:scale(1.12)}
      #dpc-chat-bubble .notif{position:absolute;top:-3px;right:-3px;width:14px;height:14px;background:#ff4444;border-radius:50%;border:2px solid #fff;animation:pulse2 1.5s infinite}
      @keyframes pulse2{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
      #dpc-chat-box{position:fixed;bottom:140px;right:14px;z-index:9999;width:min(360px,calc(100vw - 28px));max-height:520px;border-radius:24px;background:linear-gradient(180deg,#0d1030,#14183a);border:1px solid rgba(255,255,255,.15);box-shadow:0 20px 60px rgba(0,0,0,.7);display:none;flex-direction:column;overflow:hidden;font-family:inherit}
      #dpc-chat-box.open{display:flex}
      .dpc-chat-head{padding:14px 16px;background:linear-gradient(135deg,#6a1b9a,#00897b);display:flex;align-items:center;gap:10px}
      .dpc-chat-head img{width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.4)}
      .dpc-chat-head .dpc-head-info b{display:block;font-size:13px;color:#fff;font-weight:700}
      .dpc-chat-head .dpc-head-info span{font-size:11px;color:#b9f6ca}
      .dpc-chat-head .dpc-close{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:2px 6px;border-radius:8px;line-height:1}
      .dpc-chat-head .dpc-close:hover{background:rgba(255,255,255,.15)}
      .dpc-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;max-height:300px}
      .dpc-msgs::-webkit-scrollbar{width:4px}
      .dpc-msgs::-webkit-scrollbar-track{background:transparent}
      .dpc-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:2px}
      .dpc-msg{max-width:88%;padding:10px 13px;border-radius:16px;font-size:13px;line-height:1.55;animation:fadeUp .3s ease}
      @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      .dpc-msg.bot{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12);align-self:flex-start;border-bottom-left-radius:4px}
      .dpc-msg.user{background:linear-gradient(135deg,#6a1b9a,#00897b);align-self:flex-end;border-bottom-right-radius:4px;color:#fff}
      .dpc-typing{display:flex;gap:4px;padding:10px 14px;align-self:flex-start}
      .dpc-typing span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.5);animation:bounce .9s infinite}
      .dpc-typing span:nth-child(2){animation-delay:.15s}
      .dpc-typing span:nth-child(3){animation-delay:.3s}
      @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
      .dpc-quick{padding:6px 14px 10px;display:flex;flex-wrap:wrap;gap:6px}
      .dpc-quick button{padding:6px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#fff;font-size:11px;cursor:pointer;white-space:nowrap;transition:background .2s}
      .dpc-quick button:hover{background:rgba(255,255,255,.15)}
      .dpc-input-row{padding:10px 12px;display:flex;gap:8px;border-top:1px solid rgba(255,255,255,.1)}
      .dpc-input-row input{flex:1;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.07);border-radius:999px;padding:9px 14px;color:#fff;font-size:13px;outline:none;min-width:0}
      .dpc-input-row input::placeholder{color:rgba(255,255,255,.45)}
      .dpc-input-row button{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#6a1b9a,#00897b);border:none;color:#fff;font-size:18px;cursor:pointer;flex:0 0 auto;display:flex;align-items:center;justify-content:center}
    `;
    document.head.appendChild(style);

    const bubble = document.createElement('button');
    bubble.id = 'dpc-chat-bubble';
    bubble.innerHTML = '💬<span class="notif"></span>';
    bubble.title = 'Chat with us';

    const box = document.createElement('div');
    box.id = 'dpc-chat-box';
    box.innerHTML = `
      <div class="dpc-chat-head">
        <img src="profile.jpg" alt="D. Durga" onerror="this.style.display='none'">
        <div class="dpc-head-info"><b>DPC Assistant</b><span>🟢 Online • Ask me anything</span></div>
        <button class="dpc-close" id="dpc-close-btn" title="Close">✕</button>
      </div>
      <div class="dpc-msgs" id="dpc-msgs"></div>
      <div class="dpc-quick" id="dpc-quick">
        <button>📅 Book Appointment</button>
        <button>🧠 Free AI Test</button>
        <button>📍 Our Location</button>
        <button>💚 Services</button>
        <button>📞 Contact Us</button>
      </div>
      <div class="dpc-input-row">
        <input id="dpc-input" type="text" placeholder="Type your message…" autocomplete="off">
        <button id="dpc-send">➤</button>
      </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(box);

    const msgs = box.querySelector('#dpc-msgs');

    function addMsg(text, role) {
      const d = document.createElement('div');
      d.className = `dpc-msg ${role}`;
      d.innerHTML = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'dpc-typing'; t.id = 'dpc-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(t); msgs.scrollTop = msgs.scrollHeight;
      return t;
    }

    function respond(userText) {
      addMsg(userText, 'user');
      const t = showTyping();
      setTimeout(() => {
        t.remove();
        addMsg(getReply(userText), 'bot');
      }, 900 + Math.random() * 400);
    }

    // Greeting
    setTimeout(() => addMsg('🙏 Hello! I\'m the DPC AI Assistant. I can help with <b>appointments</b>, <b>services</b>, or our <b>free mental health test</b>. What can I do for you?', 'bot'), 400);

    // Quick buttons
    box.querySelectorAll('.dpc-quick button').forEach(btn => {
      btn.addEventListener('click', () => respond(btn.textContent.trim()));
    });

    // Send
    function send() {
      const inp = box.querySelector('#dpc-input');
      const v = inp.value.trim();
      if (!v) return;
      inp.value = '';
      respond(v);
    }
    box.querySelector('#dpc-send').addEventListener('click', send);
    box.querySelector('#dpc-input').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

    // Toggle
    bubble.addEventListener('click', () => {
      const open = box.classList.toggle('open');
      bubble.querySelector('.notif')?.remove();
      if (open) { box.querySelector('#dpc-input').focus(); msgs.scrollTop = msgs.scrollHeight; }
    });
    box.querySelector('#dpc-close-btn').addEventListener('click', () => box.classList.remove('open'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildWidget);
  else buildWidget();
})();
