# ProgressTracking — e-spania

Stan na koniec sesji 2026-10-20.
- Etap 1 RWD (strona główna): zaimplementowany, przetestowany, zrefaktoryzowany. Czeka na formalny odbiór.
- Git: `main` = `origin/main` (github.com/kasprzykv00/Projekt), ostatni commit `ab31f25` „Main page po zredukowaniu kodu”, drzewo czyste.
- W toku: nic. Brak rozpoczętych, niedokończonych zmian w kodzie.

## 1. Nieoczywiste decyzje

- Kod strony w `./site/` (nie w `e-spania/site/`). Dokumenty wymagań w `e-spania/` (`wymagania.md`, `RWD_Projekt.md`); instrukcje agenta w `claude.md` (katalog główny).
- Fonty: Fraunces (nagłówki) + Inter (tekst) zamiast Google Sans / Noto Sans Symbols 2 z `claude.md` / `wymagania.md`. Do ujednolicenia w karcie projektu.
- Przyciski CTA: tło `#C9411D` (biały tekst 4.93:1); `#E34B24` (3.96:1) tylko jako akcent. Hover `#A9361A`. Dodatkowe tokeny: `--color-muted #5F5757`, `--color-primary-deep #EEE6E3`, `--color-ink #1E1C1C`, `--color-accent-on-dark #F0876B`.
- Logo: wygenerowane `logo-dark.png` / `logo-light.png` (przezroczyste tło, kolory #2B2929 / #FFF) z `logo.png`; oryginał zachowany, strona go nie używa. Logo zawiera napis „es hotels” — niepotwierdzone, czy zgodne z nazwą e-spania.
- Zdjęcia i wideo: Pexels (licencja bez atrybucji), lokalnie w WebP/MP4; oznaczone na stronie jako poglądowe. Unsplash niedostępny (blokada anty-bot).
- Wideo hero: własny montaż ffmpeg (5 s/ujęcie, przenikanie 1 s, wyciemnienie na pętli, H.264 CRF 29, bez audio). Osobna wersja pionowa; wybór przez JS (`max-aspect-ratio: 4/5`), nie `<source media>`.
- Wideo gra zawsze od wejścia, także przy `prefers-reduced-motion` (decyzja użytkownika); nie startuje tylko przy Save-Data. Przycisk pauzy (WCAG 2.2.2). Zdjęcie hero pod spodem jako LCP/fallback; wideo ładowane po `load`, pauzowane poza ekranem.
- `prefers-reduced-motion`: zamiast wyłączenia wszystkiego — tylko fade (bez transform/clip/parallax). Na maszynie dewelopera Windows ma wyłączone „Efekty animacji” → przeglądarka zgłasza reduce; pełne animacje widać dopiero po ich włączeniu w systemie.
- Kurtyna intro: czysty CSS, raz na sesję (`sessionStorage 'es-intro'` → klasa `no-intro`), opóźnienia hero przez `--intro-delay`. Działa bez main.js.
- Formularz: hidden inputs `arrival`/`departure` + własny kalendarz (zamiast `input type=date`) — wzór Patina. Pole pokoju zachowane (wymóg 5.4 `wymagania.md`). Maks. 30 nocy, zakres do 365 dni.
- Bootstrap: dropdowny dat/gości z `data-bs-display="static"` (pozycja w CSS nad paskiem). Strzałki w kalendarzu obsługiwane na `window` w fazie capture (Bootstrap przechwytuje je na `document`).
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

## 2. Działa (zweryfikowane testami w przeglądarce)

- Header: logo → góra strony, nawigacja do sekcji, menu mobilne (navbar-toggler → offcanvas), dropdown PL/EN/ES (EN/ES = komunikat), „Rezerwuj” → fokus na kalendarz; tło po przewinięciu, chowanie przy przewijaniu w dół, pasek postępu.
- Hero: wideo (desktop/telefon) z pauzą, kurtyna intro, odsłanianie tytułu słowo po słowie.
- Rezerwacja (demo): kalendarz zakresu (2 miesiące ≥768 px, 1 poniżej; mysz, hover, klawiatura), goście 1–6 dorosłych / 0–4 dzieci, walidacja dat i pojemności pokoju, wynik jako toast z oznaczeniem demo.
- Panel pokoi: lista z podglądem zdjęcia (desktop), blokada pokoi za małych dla liczby gości, wybór wpisywany do paska.
- Sekcje: Hotel, Pokoje (4), Doświadczenia (3), Galeria (8 + lightbox ze strzałkami/klawiaturą), Opinie (3 demo), CTA, stopka.
- Animacje: reveal, clip-reveal zdjęć, parallax, hover przycisków; tryb reduced-motion.
- Jakość: 360/390/768/1200/1440 px bez overflow-x; brak błędów konsoli; 1×H1; alt; label; cele ≥44 px; widoczny fokus na wszystkich 88 elementach Tab; html-validate OK; Lighthouse: dostępność 100, SEO 100, wydajność desktop 87 / mobile 60.

## 3. Najważniejsze pliki

- `site/index.html` — cała strona (jedna podstrona).
- `site/css/styles.css` — style; spis treści na początku pliku.
- `site/js/main.js` — interakcje (sekcje: pomocnicze, nagłówek, wideo, formularz, kalendarz, panel pokoi, galeria, animacje).
- `site/assets/` — `images/` (22 WebP + `og-image.jpg`), `video/` (2 MP4), `logo/`.
- `site/README.md` — uruchomienie (`python -m http.server 5500` w `site/`), struktura, źródła mediów (ID Pexels).
- `e-spania/RWD_Projekt.md` — wymagania prowadzącego (nadrzędne), `e-spania/wymagania.md` — opis projektu.

## 4. Wykonane w sesji 2026-10-20

- Analiza dokumentów i inspiracji (Patina zbadana w przeglądarce), UI UX Pro Max.
- Strona główna: HTML/CSS/JS, zasoby, README.
- Przebudowa hero na wzór Patina (wideo + pasek rezerwacji z kalendarzem), animacje, naprawa linku logo.
- Audyt i refaktor kodu: usunięte martwe atrybuty/klasy/reguły, scalone duplikaty, tokeny (`--tap`, `--radius-pill`, kolory błędów), helpery JS (`onScrollFrame`, `afterMenuClosed`, `closeDropdown`). Naprawione: brak widocznego fokusu (język, menu, „Wybierz”), niedziałający hover-zoom pokoi. Zrzuty przed/po identyczne (0 px, 3 szerokości, oba tryby ruchu, 8 stanów interakcji).
- Commity (wykonane przez użytkownika): `0c4e225` „main page strony”, `ab31f25` „Main page po zredukowaniu kodu”; wypchnięte na `origin/main`.

## 5. Znane problemy i elementy niedokończone

- Wydajność mobile 60 w Lighthouse (lokalny serwer bez HTTPS/kompresji; render-blocking CDN Bootstrap + Google Fonts; waga hero). Best Practices 81–82 przez brak HTTPS (środowisko lokalne).
- Placeholdery: kontakt w stopce, opinie (demo), linki do profili hotelu, wersje EN/ES.
- Ścieżki względne w `og:image` i JSON-LD.
- Niezgodność fontów: kod (Fraunces/Inter) vs `claude.md` / `wymagania.md` (Google Sans / Noto Sans Symbols 2).
- Niepotwierdzone: napis „es hotels” w logo; klip z zachodem słońca w montażu desktop (widoczne bloki hotelowe); długość intro (~1,4 s).
- Skrypty testowe (puppeteer, porównanie zrzutów) istniały tylko w scratchpadzie sesji — nie ma ich w repozytorium.

## 6. Do zrobienia

- Formalny odbiór etapu 1 przez użytkownika.
- Wpisać Fraunces/Inter do karty projektu; ujednolicić `claude.md` i `wymagania.md`.
- Decyzje: logo, klip z zachodem słońca, długość intro.
- Kolejne etapy wg `RWD_Projekt.md`: 2 — blog, 3 — sklep, 4 — brakujące podstrony, 5 — audyt Lighthouse i odbiór. Wytyczne do etapów 2–4 przekazuje prowadzący na zajęciach — jeszcze ich nie ma w projekcie.
- Po publikacji: absolutne URL w OG/JSON-LD, ponowny pomiar wydajności na HTTPS.

## 7. Następny krok

Zaktualizować kartę projektu (fonty Fraunces/Inter) i rozstrzygnąć otwarte decyzje z pkt 5. Etap 2 (blog) zaczynać dopiero po otrzymaniu wytycznych prowadzącego i zgodzie użytkownika (plan → akceptacja → implementacja, zgodnie z `claude.md`).
