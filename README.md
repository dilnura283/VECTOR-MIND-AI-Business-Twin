# AI Business Twin — sof React 18 + Vite (backendsiz)

Bu versiya avvalgi React + Node.js loyihasining **faqat frontend** varianti.
Barcha hisob-kitob (kredit skoring, bank moslashtirish, biznes prognoz)
serverga so'rov yubormasdan, to'g'ridan-to'g'ri brauzerda ishlaydi.

Dizayn (CSS) va komponentlar tuzilishi avvalgi loyiha bilan bir xil —
faqat `src/api.js` endi `fetch("/api/...")` o'rniga `src/lib/` ichidagi
sof JavaScript funksiyalarni chaqiradi.

## Ishga tushirish

```bash
npm install
npm run dev       # http://localhost:5173
```

Server kerak emas — bitta buyruq bilan ishga tushadi.

## Production build

```bash
npm run build      # dist/ papkasida statik fayllar
npm run preview    # build'ni mahalliy tekshirish
```

`dist/` papkasini istalgan statik hosting'ga (Netlify, Vercel, GitHub Pages,
oddiy nginx) joylashtirish mumkin — backend shart emas.

## Papka tuzilishi

```
src/
  lib/
    scoring.js       # kredit skoring formulasi (300-850 shkala)
    banks.js         # 3 ta bank talablari
    projection.js     # 6 oylik daromad/foyda prognoz dvijoki
    roadmap.js         # loyihaning yo'l xaritasi (statik ma'lumot)
  api.js               # yuqoridagi modullarni chaqiruvchi "sun'iy API" qatlami
  components/          # Header, Hero, CreditCalculator, TwinApp, ...
  styles.css           # asl dizayn — o'zgartirilmagan
  App.jsx
```

## Nega `api.js` saqlanib qoldi?

Komponentlar (`CreditCalculator.jsx`, `TwinApp.jsx` va h.k.) `api.getScore()`,
`api.getProjection()` kabi funksiyalarni chaqiradi. `api.js` bu chaqiruvlarni
tarmoq so'rovi o'rniga to'g'ridan-to'g'ri `lib/` funksiyalariga yo'naltiradi —
shu sabab komponentlarning o'zini o'zgartirish shart bo'lmadi. Kelajakda
qayta backend qo'shmoqchi bo'lsangiz, faqat `api.js` faylini `fetch` bilan
almashtirish kifoya.
