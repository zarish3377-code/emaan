/* Birthday popup — fully isolated, scoped under #bd-root.
   Date gate: May 1, 2026 → June 1, 2026 inclusive. */
(function () {
  'use strict'

  // --- Date gate -----------------------------------------------------------
  var today = new Date()
  var y = today.getFullYear()
  var m = today.getMonth() + 1
  var d = today.getDate()
  var inWindow =
    y === 2026 &&
    ((m === 5 && d >= 1) || (m === 6 && d === 1))
  if (!inWindow) return

  // Prevent double-mount
  if (document.getElementById('bd-root')) return

  // --- Fonts ---------------------------------------------------------------
  if (!document.getElementById('bd-fonts')) {
    var fl = document.createElement('link')
    fl.id = 'bd-fonts'
    fl.rel = 'stylesheet'
    fl.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,300&display=swap'
    document.head.appendChild(fl)
  }

  // --- Styles --------------------------------------------------------------
  var STYLE = `
  #bd-root, #bd-root * { box-sizing: border-box; }
  #bd-root {
    position: fixed; inset: 0; z-index: 999999;
    background: radial-gradient(ellipse at 50% 40%,
      #1A0A2E 0%, #0D0518 50%, #050210 100%);
    overflow: hidden;
    transition: opacity 500ms ease;
    font-family: 'Cormorant Garamond', serif;
  }
  .bd-aurora {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }
  @keyframes bd-aurora-1 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(40px,-30px); }
  }
  @keyframes bd-aurora-2 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(-35px,25px); }
  }
  @keyframes bd-aurora-3 {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(30px,30px); }
  }
  @keyframes bd-fall {
    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0.3; }
  }
  .bd-confetti {
    position: fixed; top: -20px; pointer-events: none; will-change: transform;
  }
  .bd-png {
    position: fixed; pointer-events: none;
    transform: scale(0) rotate(0deg); opacity: 0;
    transition: transform 700ms cubic-bezier(0.34,1.6,0.64,1), opacity 500ms ease;
  }
  .bd-png.bd-show { opacity: 1; }
  @keyframes bd-bob {
    0%,100% { translate: 0 0; }
    50% { translate: 0 -10px; }
  }
  @keyframes bd-rock {
    0%,100% { rotate: -3deg; }
    50% { rotate: 3deg; }
  }
  .bd-card {
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%,-50%) scale(0.7) translateY(40px);
    opacity: 0;
    width: min(560px, 90vw);
    padding: 52px 48px 44px;
    background: rgba(255,252,255,0.06);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.05) inset,
      0 32px 100px rgba(0,0,0,0.5),
      0 0 60px rgba(200,80,160,0.15);
    text-align: center; z-index: 10;
    transition: transform 600ms cubic-bezier(0.34,1.4,0.64,1),
                opacity 600ms ease;
  }
  .bd-card.bd-in { transform: translate(-50%,-50%) scale(1) translateY(0); opacity: 1; }
  .bd-label {
    font-style: italic; font-weight: 300;
    font-size: 0.95rem; color: rgba(255,210,240,0.7);
    letter-spacing: 0.2em; opacity: 0;
    transition: opacity 700ms ease;
  }
  .bd-heading-wrap {
    position: relative; margin: 18px 0 8px;
    line-height: 1; opacity: 0; transform: translateY(20px);
    transition: opacity 700ms ease, transform 700ms ease;
  }
  .bd-heading, .bd-heading-glow {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600; font-style: normal;
    font-size: clamp(3.2rem, 9vw, 6rem);
    letter-spacing: 0.12em; line-height: 1;
    margin: 0;
  }
  .bd-heading {
    background: linear-gradient(135deg,
      #FFD700 0%, #FF89AC 35%, #C44DFF 65%, #FFD700 100%);
    background-size: 300% 300%;
    -webkit-background-clip: text; background-clip: text;
    color: transparent;
    animation: bd-shimmer 4s ease infinite;
    position: relative; z-index: 2;
  }
  .bd-heading-glow {
    position: absolute; inset: 0;
    color: #FF89AC; opacity: 0.25;
    filter: blur(12px); pointer-events: none; z-index: 1;
  }
  @keyframes bd-shimmer {
    0%,100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .bd-love {
    font-style: italic; font-weight: 300;
    font-size: clamp(2.4rem, 6vw, 4rem);
    color: #FFD0E8;
    text-shadow: 0 0 30px rgba(255,140,200,0.5);
    letter-spacing: 0.08em;
    opacity: 0; margin: 6px 0;
    transition: opacity 700ms ease;
  }
  .bd-love.bd-in { animation: bd-love-pulse 3s ease-in-out infinite; opacity: 1; }
  @keyframes bd-love-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.02); }
  }
  .bd-sep {
    font-size: 14px; color: rgba(255,180,220,0.6);
    letter-spacing: 0.5em; margin: 16px 0 14px;
    opacity: 0; transition: opacity 700ms ease;
  }
  .bd-msg {
    font-style: italic; font-weight: 300;
    font-size: 1.05rem; color: rgba(255,240,250,0.75);
    line-height: 1.8; letter-spacing: 0.02em;
    max-width: 360px; margin: 0 auto;
    opacity: 0; transition: opacity 700ms ease;
  }
  .bd-btn {
    display: inline-block; margin-top: 32px;
    padding: 12px 36px;
    background: linear-gradient(135deg, #FF89AC, #C44DFF);
    border: none; border-radius: 100px;
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    font-size: 1rem; color: white; letter-spacing: 0.05em;
    cursor: pointer;
    box-shadow: 0 4px 24px rgba(200,80,160,0.35);
    opacity: 0;
    transition: opacity 700ms ease,
                transform 220ms cubic-bezier(0.34,1.4,0.64,1),
                box-shadow 220ms ease;
  }
  .bd-btn:hover {
    transform: scale(1.06) translateY(-2px);
    box-shadow: 0 8px 32px rgba(200,80,160,0.5);
  }
  .bd-in.bd-fade { opacity: 1; }
  .bd-ring {
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%,-50%) scale(0);
    border: 2px solid rgba(255,180,220,0.6);
    border-radius: 50%; pointer-events: none;
    width: 20px; height: 20px;
  }
  @keyframes bd-ring-anim {
    0% { transform: translate(-50%,-50%) scale(0); opacity: 0.8; }
    100% { transform: translate(-50%,-50%) scale(40); opacity: 0; }
  }
  `
  var st = document.createElement('style')
  st.id = 'bd-style'
  st.textContent = STYLE
  document.head.appendChild(st)

  // --- Root ----------------------------------------------------------------
  var root = document.createElement('div')
  root.id = 'bd-root'
  document.body.appendChild(root)

  // Aurora wash
  var auroras = [
    { c: 'rgba(180,80,180,0.12)', w: 500, l: '15%', t: '20%', a: 'bd-aurora-1', d: 10 },
    { c: 'rgba(80,80,220,0.10)',  w: 420, l: '65%', t: '15%', a: 'bd-aurora-2', d: 14 },
    { c: 'rgba(220,80,120,0.10)', w: 460, l: '40%', t: '60%', a: 'bd-aurora-3', d: 8 },
  ]
  auroras.forEach(function (a) {
    var div = document.createElement('div')
    div.className = 'bd-aurora'
    div.style.cssText =
      'background:' + a.c +
      ';width:' + a.w + 'px;height:' + a.w + 'px' +
      ';left:' + a.l + ';top:' + a.t +
      ';animation:' + a.a + ' ' + a.d + 's ease-in-out infinite'
    root.appendChild(div)
  })

  // --- Confetti ------------------------------------------------------------
  var COLORS = ['#FFD700','#FF6B9D','#C44DFF','#4DFFC4','#FF4757','#FFE066','#ffffff']
  var confettiPieces = []
  for (var i = 0; i < 60; i++) {
    var piece = document.createElement('div')
    piece.className = 'bd-confetti'
    var color = COLORS[Math.floor(Math.random() * COLORS.length)]
    var shape = Math.floor(Math.random() * 3) // 0=rect, 1=circle, 2=star
    var dur = 3 + Math.random() * 4
    var del = Math.random() * 4
    var leftPct = Math.random() * 100
    if (shape === 0) {
      piece.style.cssText =
        'left:' + leftPct + 'vw;width:8px;height:16px;background:' + color +
        ';animation: bd-fall ' + dur + 's linear ' + del + 's infinite'
    } else if (shape === 1) {
      piece.style.cssText =
        'left:' + leftPct + 'vw;width:8px;height:8px;background:' + color +
        ';border-radius:50%;animation: bd-fall ' + dur + 's linear ' + del + 's infinite'
    } else {
      piece.innerHTML =
        '<svg width="10" height="10" viewBox="0 0 10 10">' +
        '<polygon points="5,0 6,3.5 10,4 7,6.5 8,10 5,8 2,10 3,6.5 0,4 4,3.5" fill="' + color + '"/>' +
        '</svg>'
      piece.style.cssText =
        'left:' + leftPct + 'vw;width:10px;height:10px' +
        ';animation: bd-fall ' + dur + 's linear ' + del + 's infinite'
    }
    // sine drift via RAF
    confettiPieces.push({
      el: piece,
      amp: 15 + Math.random() * 25,
      freq: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    })
    root.appendChild(piece)
  }
  var driftStart = performance.now()
  var driftRaf = 0
  function driftTick(now) {
    var t = (now - driftStart) / 1000
    for (var k = 0; k < confettiPieces.length; k++) {
      var p = confettiPieces[k]
      var dx = Math.sin(t * p.freq + p.phase) * p.amp
      p.el.style.marginLeft = dx + 'px'
    }
    driftRaf = requestAnimationFrame(driftTick)
  }
  driftRaf = requestAnimationFrame(driftTick)

  // --- PNG decorations (bunnies + flowers) ---------------------------------
  // No PNGs shipped — fallback to inline SVG bunnies/flowers as decorative emoji.
  var pngEls = []
  var BUNNY_SVG =
    '<svg viewBox="0 0 64 64" width="100%" height="100%">' +
      '<ellipse cx="32" cy="44" rx="18" ry="16" fill="#FFE8F0"/>' +
      '<ellipse cx="22" cy="22" rx="6" ry="14" fill="#FFE8F0"/>' +
      '<ellipse cx="42" cy="22" rx="6" ry="14" fill="#FFE8F0"/>' +
      '<ellipse cx="22" cy="22" rx="3" ry="9" fill="#FFB8D0"/>' +
      '<ellipse cx="42" cy="22" rx="3" ry="9" fill="#FFB8D0"/>' +
      '<circle cx="26" cy="42" r="2.2" fill="#2a1a2a"/>' +
      '<circle cx="38" cy="42" r="2.2" fill="#2a1a2a"/>' +
      '<ellipse cx="32" cy="48" rx="2" ry="1.4" fill="#FF8AAC"/>' +
      '<path d="M32 50 Q28 53 26 52 M32 50 Q36 53 38 52" stroke="#2a1a2a" stroke-width="0.8" fill="none"/>' +
    '</svg>'
  var FLOWER_SVG =
    '<svg viewBox="0 0 64 64" width="100%" height="100%">' +
      '<g transform="translate(32 32)">' +
        '<ellipse cx="0" cy="-18" rx="9" ry="14" fill="#FF89AC"/>' +
        '<ellipse cx="17" cy="-6"  rx="9" ry="14" fill="#FFB8D0" transform="rotate(72)"/>' +
        '<ellipse cx="11" cy="14"  rx="9" ry="14" fill="#FF89AC" transform="rotate(144)"/>' +
        '<ellipse cx="-11" cy="14" rx="9" ry="14" fill="#FFB8D0" transform="rotate(216)"/>' +
        '<ellipse cx="-17" cy="-6" rx="9" ry="14" fill="#FF89AC" transform="rotate(288)"/>' +
        '<circle r="7" fill="#FFD700"/>' +
      '</g>' +
    '</svg>'

  function pickZone(i) {
    var zone = i % 4
    var rand = function (lo, hi) { return lo + Math.random() * (hi - lo) }
    if (zone === 0) return { left: rand(2, 12),  top: rand(10, 85) } // left col
    if (zone === 1) return { left: rand(85, 96), top: rand(10, 85) } // right
    if (zone === 2) return { left: rand(15, 80), top: rand(2, 10) }  // top
    return { left: rand(15, 80), top: rand(85, 95) }                 // bottom
  }

  for (var j = 0; j < 14; j++) {
    var isBunny = j % 2 === 0
    var pos = pickZone(j)
    var size = 60 + Math.random() * 50
    var rot = (Math.random() * 30) - 15
    var el = document.createElement('div')
    el.className = 'bd-png'
    el.style.left = pos.left + 'vw'
    el.style.top = pos.top + 'vh'
    el.style.width = size + 'px'
    el.style.height = size + 'px'
    el.dataset.rot = String(rot)
    el.dataset.cx = String(pos.left)
    el.dataset.cy = String(pos.top)
    el.innerHTML = isBunny ? BUNNY_SVG : FLOWER_SVG
    root.appendChild(el)
    pngEls.push({ el: el, isBunny: isBunny, rot: rot, idx: j })
  }

  // Stagger PNG entry
  pngEls.forEach(function (p, i) {
    setTimeout(function () {
      p.el.style.transform =
        'scale(1) rotate(' + p.rot + 'deg)'
      p.el.classList.add('bd-show')
      // idle bob + rock
      setTimeout(function () {
        var bobDur = (2.5 + Math.random() * 1.5).toFixed(2)
        var rockDur = (3 + Math.random() * 1).toFixed(2)
        p.el.style.animation =
          'bd-bob ' + bobDur + 's ease-in-out infinite' +
          (p.isBunny ? ', bd-rock ' + rockDur + 's ease-in-out infinite' : '')
      }, 750)
    }, i * 120)
  })

  // --- Burst rings at 600ms -----------------------------------------------
  setTimeout(function () {
    [1000, 1200, 1400].forEach(function (dur, idx) {
      setTimeout(function () {
        var ring = document.createElement('div')
        ring.className = 'bd-ring'
        ring.style.animation = 'bd-ring-anim ' + dur + 'ms ease-out forwards'
        root.appendChild(ring)
        setTimeout(function () { ring.remove() }, dur + 50)
      }, idx * 200)
    })
  }, 600)

  // --- Card ----------------------------------------------------------------
  var card = document.createElement('div')
  card.className = 'bd-card'
  card.innerHTML =
    '<div class="bd-label">✦  today is yours  ✦</div>' +
    '<div class="bd-heading-wrap">' +
      '<div class="bd-heading-glow">HAPPY BIRTHDAY</div>' +
      '<div class="bd-heading">HAPPY BIRTHDAY</div>' +
    '</div>' +
    '<div class="bd-love">Love</div>' +
    '<div class="bd-sep">♡ &nbsp; ✦ &nbsp; ♡</div>' +
    '<div class="bd-msg">' +
      'Every good thing knows your name.<br>' +
      'Today, the whole world celebrates its beauty (you).' +
    '</div>' +
    '<button class="bd-btn" type="button">Thank you for existing ♡</button>'
  root.appendChild(card)

  // Card spring in
  setTimeout(function () { card.classList.add('bd-in') }, 600)
  setTimeout(function () { card.querySelector('.bd-label').style.opacity = '1' }, 800)
  setTimeout(function () {
    var hw = card.querySelector('.bd-heading-wrap')
    hw.style.opacity = '1'
    hw.style.transform = 'translateY(0)'
  }, 1000)
  setTimeout(function () { card.querySelector('.bd-love').classList.add('bd-in') }, 1300)
  setTimeout(function () { card.querySelector('.bd-sep').style.opacity = '1' }, 1500)
  setTimeout(function () { card.querySelector('.bd-msg').style.opacity = '1' }, 1700)
  setTimeout(function () { card.querySelector('.bd-btn').style.opacity = '1' }, 2500)

  // Dismiss
  card.querySelector('.bd-btn').addEventListener('click', function () {
    card.style.transition = 'transform 350ms ease, opacity 350ms ease'
    card.style.transform = 'translate(-50%,-50%) scale(0.92)'
    card.style.opacity = '0'
    confettiPieces.forEach(function (p) {
      p.el.style.transition = 'opacity 400ms ease'
      p.el.style.opacity = '0'
    })
    pngEls.forEach(function (p) {
      var dx = (p.el.dataset.cx > 50 ? 1 : -1) * 200
      var dy = (p.el.dataset.cy > 50 ? 1 : -1) * 200
      p.el.style.transition = 'transform 500ms ease, opacity 500ms ease'
      p.el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.6)'
      p.el.style.opacity = '0'
    })
    root.style.opacity = '0'
    setTimeout(function () {
      cancelAnimationFrame(driftRaf)
      root.remove()
      var s = document.getElementById('bd-style')
      if (s) s.remove()
    }, 600)
  })
})()
