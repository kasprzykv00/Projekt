# ProgressTracking — e-spania

Stan: 2026-10-20. Etap 1 (strona główna) gotowy do akceptacji, bez commita.

## 1. Nieoczywiste decyzje

- Kod strony w `./site/` (nie w `e-spania/site/`). Dokumenty wymagań w `e-spania/`.
- Fonty: Fraunces (nagłówki) + Inter (tekst) zamiast Google Sans / Noto Sans Symbols 2 z `CLAUDE.md` / `wymagania.md`. Do ujednolicenia w karcie projektu.
- Przyciski CTA: tło `#C9411D` (biały tekst 4.93:1); `#E34B24` (3.96:1) tylko jako akcent. Hover `#A9361A`. Dodatkowe tokeny: `--color-muted #5F5757`, `--color-primary-deep #EEE6E3`, `--color-ink #1E1C1C`.
- Logo: wygenerowane `logo-dark.png` / `logo-light.png` (przezroczyste tło, kolory #2B2929 / #FFF) z `logo.png`; oryginał zachowany. Logo zawiera napis „es hotels” — niepotwierdzone, czy zgodne z nazwą e-spania.
- Zdjęcia i wideo: Pexels (licencja bez atrybucji), lokalnie w WebP/MP4; oznaczone na stronie jako poglądowe. Unsplash niedostępny (blokada anty-bot).
- Wideo hero: własny montaż ffmpeg (5 s/ujęcie, przenikanie 1 s, wyciemnienie na pętli, H.264 CRF 29, bez audio). Osobna wersja pionowa; wybór przez JS (`max-aspect-ratio: 4/5`), nie `<source media>`.
- Wideo gra zawsze od wejścia, także przy `prefers-reduced-motion`; nie startuje tylko przy Save-Data. Przycisk pauzy (WCAG 2.2.2). Zdjęcie hero pod spodem jako LCP/fallback; wideo ładowane po `load`, pauzowane poza ekranem.
- `prefers-reduced-motion`: zamiast wyłączenia wszystkiego — tylko fade (bez transform/clip/parallax). Na maszynie dewelopera Windows ma wyłączone „Efekty animacji” → przeglądarka zgłasza reduce.
- Kurtyna intro: czysty CSS, raz na sesję (`sessionStorage 'es-intro'` → klasa `no-intro`), opóźnienia hero przez `--intro-delay`. Działa bez main.js.
- Formularz: hidden inputs `arrival`/`departure` + własny kalendarz (zamiast `input type=date`) — wzór Patina. Pole pokoju zachowane (wymóg 5.4 `wymagania.md`). Maks. 30 nocy, zakres do 365 dni.
- Bootstrap: dropdowny dat/gości z `data-bs-display="staw` w fazie capture (Bootstrap przechwytuje je na `document`).
- Menu mobilne: offcanvas z `data-bs-backdrop="false"` (offcanvas w `fixed-top` trafiał pod backdrop).
- Reveal `clip`: IntersectionObserver obserwuje rodzica (element z `clip-path: inset(100%)` jest niewidoczny dla IO); leniwe obrazy przełączane na `eager` 800 px wcześniej.
- Parallax przez właściwość `translate` (niezależną od `transform`), liczony co klatkę, limit ±8% wysokości rodzica.
- Panel pokoi budowany w JS z kart `.room-card` (treść pokoi tylko w HTML).
- Toast pod nagłówkiem (na dole zasłaniał pasek rezerwacji).
- Logo / „Do góry”: `href="index.html"` + JS scroll do góry (`#top` wskazywał na fixed header).
- Treści bez weryfikacji: opinie oznaczone „Przykład” (bez ocen), linki do stron głównych platform; kontakt „do uzupełnienia”; metraże pokoi przykładowe; JSON-LD bez adresu/kontaktu/ocen; języki EN/ES — tylko toast „wkrótce”.
- `og:image` i JSON-LD `image`/`logo` mają ścieżki względne — do zamiany na absolutne po publikacji.
- Fokus: wspólna reguła `:focus-visible` nadpisuje `outline: 0` Bootstrapa w `.btn`, `.nav-link`, `.navbar-toggler`.
- Kolory przycisków przez zmienne `--bs-btn-*` (bez `!important`).
- Wspólne klasy: `.icon-btn` (okrągły przycisk 44 px), `.text-btn` („Zamknij”), `.media-frame` (zdjęcie cover), `.eyebrow--center`.
- Zoom przy odsłanianiu zdjęć: animacja właściwości `scale`, `fill-mode: backwards` — nie koliduje z `transform` hover.
- CSS i JS celowo w jednym pliku każdy (brak build; `@import`/moduły ES = więcej żądań / nie działa z `file://`); podział sekcjami + spis treści w `styles.css`.

## 2. Wykonane

- Analiza dokumentów, inspiracji (Patina zbadana w przeglądarce), UI UX Pro Max.
- `index.html`: header (logo, nav, PL/EN/ES dropdown, „Rezerwuj”, navbar-toggler → offcanvas), hero (zdjęcie + wideo, H1, „Odkryj”), pasek rezerwacji, sekcje: Hotel, Pokoje (4), Doświadczenia (3), Galeria (8, siatka 4×4 / 2 kol.), Opinie (3 demo), CTA, stopka; panel pokoi (offcanvas), lightbox (modal), toast; SVG sprite; meta, OG, JSON-LD `Hotel` + `WebSite`.
- `css/styles.css`: tokeny, nadpisania Bootstrapa (navbar, offcanvas, dropdown, btn, form-control, modal, toast), sekcje, animacje, reduced-motion.
- `js/main.js`: nagłówek (tło, chowanie, pasek postępu), scroll-top, menu mobilne, język, wideo + pauza, kalendarz zakresu (mysz, hover, klawiatura), goście (stepper), walidacja, panel pokoi (podgląd, limit pojemności), galeria, split słów, reveal, parallax.
- Zasoby: `assets/images` (22 WebP + `og-image.jpg`), `assets/video` (`hero-desktop.mp4` 3 MB, `hero-mobile.mp4` 2 MB), `assets/logo`.
- `README.md`: uruchomienie, struktura, komponenty, treści demo, źródła (ID Pexels).
- Testy (Edge headless + puppeteer, skrypty w scratchpadzie): 360/390/768/1200/1440 px — brak overflow-x, błędów konsoli, 1×H1, alt, label, cele ≥44 px, linki; scenariusze interakcji; html-validate OK.
- Audyt i refaktor kodu: usunięte martwe atrybuty/klasy/reguły, scalone duplikaty, tokeny (`--tap`, `--radius-pill`, kolory błędów), helpery JS (`onScrollFrame`, `afterMenuClosed`, `closeDropdown`). Naprawione: brak widocznego fokusu (język, menu, „Wybierz”), niedziałający hover-zoom pokoi. Weryfikacja: zrzuty przed/po identyczne (0 px, 3 szerokości, oba tryby ruchu, 8 stanów interakcji).
- Lighthouse (lokalny serwer Python): dostępność 100, SEO 100, wydajność desktop 87 / mobile 60, CLS < 0.06. Best Practices obniża brak HTTPS (środowisko lokalne).

## Otwarte

- Akceptacja etapu i commit (brak commitów od `911a8fb`).
- Fonty w karcie projektu; zgodność logo z nazwą.
- Wydajność mobile (render-blocking CDN, fonty, waga hero).
- Ewentualna wymiana klipu z zachodem słońca; długość intro.
