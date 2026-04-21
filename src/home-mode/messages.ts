// Shared message pool for all Home Mode features.
// Use getNextMessage() everywhere — never hardcode strings.

export const HM_MESSAGES: string[] = [
  'You are held, even in your quietest moments. 🌸',
  "You don't have to be okay to be loved by me. 🥀",
  "I hope you're treating your heart gently today. 💮",
  'You are someone worth staying for, always. 🌺',
  'Your heart deserves peace, not pressure. 🌊',
  "You're allowed to be soft and still be strong. 🦢",
  'Even now, you are enough for me. 🌌',
  "You don't have to carry this alone anymore. 🌷",
  'Your existence feels like warmth in my hands. 🔥',
  "It's okay to lean on me. 🫂",
  'You are deeply, quietly cared for. 🌻',
  "Rest for a bit, I'll be right here. 🍃",
  'You are not hard to love, not to me. 🧸',
  'Your feelings are safe with me. 🗝️',
  "You're allowed to need me. 🏹",
  "I won't leave just because you're struggling. ⚓",
  "You are comfort, even when you don't see it. ☁️",
  "You don't have to hide your heart from me. 🔓",
  'You deserve to feel chosen, and I choose you. 💍',
  'You are softer than your fears, I promise. 🌸',
  'Even your silence speaks to me. 🌙',
  "You're allowed to take up space beside me. 🪐',
  'Your heart is not a burden to hold. 🤲',
  "You are loved in ways you can't always see. 🌠",
  "It's okay to pause, I'll wait with you. ⏳",
  "You don't have to prove anything to me. 🎭",
  'You are safe to feel everything here. 🛡️',
  "You're never too much for me. 🌊",
  'Your presence feels quietly beautiful to me. 🎨',
  'You deserve love that feels like home, like this. 🏡',
  'You can rest here, as long as you need. 🛌',
  "Your pain doesn't make me love you less. ❤️‍🩹",
  'You are worthy of steady, patient love. 🕰️',
  'Even on your hardest days, I still choose you. 🌦️',
  "Your heart can heal slowly, I'm not rushing you. 🌱",
  "You are not alone, I'm right here. 📍",
  'My love for you stays soft, even in storms. ⛈️',
  'You deserve warmth without conditions. ☀️',
  'Your soul is easy to hold, not heavy. 🎈',
  'You are allowed to be cared for deeply by me. 🦋',
  "You don't have to earn my gentleness. 🍬",
  'Your existence is something I cherish. 💎',
  'You are someone I want to understand, always. 📚',
  "You can be fragile with me, I won't break you. 🥂",
  'You are held in more ways than you realize. 🧶',
  'Your heart is safe to open with me, slowly. 🐚',
  'You deserve quiet, steady happiness with me. 🌻',
  'You are not forgotten, not by me. 🕯️',
  'You are lovable in every version of yourself. 🎞️',
  "Better days will find you, and I'll be there too. 🌅",
  "You don't have to hide from me, ever. 👁️",
  'I see you, even when you go silent. 🌑',
  "Come closer, you're safe with me. 👣",
  "You can fall apart here, I've got you. 🥀",
  "I'm not going anywhere, not now, not later. 🧱",
  "I'll stay, even on your hardest days. 🖤",
  "You don't have to be strong around me. 🌧️",
  "I love you in ways you don't notice yet. 💌",
  'You can rest your heart with me, always. 🍂',
  "I'm here… and I'm not leaving. 🤍",
]

let used: number[] = []
export function getNextMessage(): string {
  if (used.length >= HM_MESSAGES.length) used = []
  const remaining: number[] = []
  for (let i = 0; i < HM_MESSAGES.length; i++) {
    if (!used.includes(i)) remaining.push(i)
  }
  const pick = remaining[Math.floor(Math.random() * remaining.length)]
  used.push(pick)
  return HM_MESSAGES[pick]
}

// Toast displayer — anchorRect optional, otherwise center-bottom
export function showHMMessage(text: string, anchorRect?: DOMRect | null) {
  const root =
    document.getElementById('hm-root') ||
    document.body

  const el = document.createElement('div')
  el.className = 'hm-message-toast'
  el.textContent = text

  if (anchorRect) {
    el.style.left = `${anchorRect.left + anchorRect.width / 2}px`
    el.style.top = `${anchorRect.top - 20}px`
    el.style.transform = 'translate(-50%, -100%) translateY(10px)'
  } else {
    el.style.left = '50%'
    el.style.bottom = '12%'
    el.style.transform = 'translateX(-50%) translateY(10px)'
  }

  root.appendChild(el)

  requestAnimationFrame(() => {
    el.style.opacity = '1'
    if (anchorRect) {
      el.style.transform = 'translate(-50%, -100%) translateY(0px)'
    } else {
      el.style.transform = 'translateX(-50%) translateY(0px)'
    }
  })

  setTimeout(() => {
    el.style.opacity = '0'
    if (anchorRect) {
      el.style.transform = 'translate(-50%, -100%) translateY(-12px)'
    } else {
      el.style.transform = 'translateX(-50%) translateY(-12px)'
    }
    setTimeout(() => el.remove(), 500)
  }, 3800)
}
