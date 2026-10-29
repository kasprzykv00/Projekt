# ProgressTracking — e-spania

Stan na koniec drugiej sesji 2026-10-29 (rozbudowa o 3 lokalizacje).
- Etap 1 RWD (strona główna): zaimplementowany, przetestowany, zrefaktoryzowany (sesja 2026-10-20).
- Etap 2 RWD (blog wg `e-spania/RWD_CW_4.md`): zaimplementowany, przetestowany i zacommitowany przez użytkownika (`01db6bd`, `85509ff`, `5feb7b7`).
- Rozbudowa poza harmonogramem: hotele w 3 miastach (Barcelona, Malaga, Madryt) z przełącznikiem na stronie głównej — zaimplementowana, przetestowana, zaakceptowana przez użytkownika. Czeka na commit użytkownika.
- Git: ostatni commit `5feb7b7` „progres tracking 29.10”. Zmiany lokalizacji są NIEZACOMMITOWANE — commity robi wyłącznie użytkownik.
- W toku: nic.

Historia: 2026-10-20 — etap 1 gotowy (`ab31f25`); 2026-10-29 (sesja 1) — etap 2 blog.

## 1. Nieoczywiste decyzje

### Ogólne (etap 1)
- Kod strony w `./site/` (nie w `e-spania/site/`). Dokumenty wymagań w `e-spania/` (`wymagania.md`, `RWD_Projekt.md`, `RWD_CW_4.md`); instrukcje agenta w `claude.md` (katalog główny).
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

### Blog (etap 2, 2026-10-29) — decyzje uzgodnione z użytkownikiem
- Plik stylów zostaje `css/styles.css` (instrukcja CW4 mówi `style.css` — kluczowe jest „jeden wspólny arkusz”). Style bloga w sekcji „14. Moduł bloga” (14.1–14.9) + wpis w spisie treści.
- Sekcja `#blog` na stronie głównej stoi między Opiniami a końcowym CTA („06 — Blog”). Na stronie nie ma formularza kontaktowego (kontakt = stopka `#kontakt`), więc „między ofertą a formularzem kontaktowym” zinterpretowano jako przed CTA/stopką. Formularza kontaktowego nie dodano.
- Archiwum: 3 prawdziwe strony — `blog.html` (6 wpisów), `blog-2.html` (6), `blog-3.html` (3) = 15 wpisów. Paginacja to zwykłe linki do `blog-N.html#wpisy`; na stronie 1 „Poprzednia”, na stronie 3 „Następna” są `disabled` (`<span class="page-link">`). Liczniki kategorii liczą całe archiwum: Planowanie podróży 2, Zwiedzanie 4, Kuchnia 3, Kultura i zwyczaje 2, Praktyczne porady 4 — przy dodawaniu wpisu zaktualizuj liczniki we WSZYSTKICH 3 plikach archiwum.
- Wszystkie karty prowadzą do jednego szablonu `single.html` (wymóg CW4). Pełną treść ma tylko artykuł „Kiedy jechać do Hiszpanii? Pogoda i najlepszy termin na wyjazd” (893 słowa, ok. 5 min). „Poprzedni/następny wpis” też wskazują `single.html`.
- Tematy wpisów: zapytania, które turyści wpisują przed wyjazdem (SEO). Treści o Hiszpanii są ogólne i sprawdzalne (święta, klimat, UNESCO) — bez faktów o samym hotelu. Artykuł kończy nota „charakter poradnikowy”.
- Autorzy (podani przez użytkownika): Oskar Kasprzyk, Krystian Jałocha, Dawid Jajko. Biogram Oskara neutralny („Współtwórca serwisu e-spania…”). Awatary to inicjały w CSS (bez zdjęć osób).
- Komentarze: 2 wpisy oznaczone „Przykład” + baner „Przykładowe komentarze”; formularz komentarza i wyszukiwarka to demo: walidacja Bootstrapa (`novalidate` + `.was-validated`), potem toast (atrybuty `data-demo-form`, `data-demo-title`, `data-demo-text`). Nic nie jest wysyłane.
- Blockquote: prawdziwe przysłowie „Hasta el cuarenta de mayo no te quites el sayo” (bez zmyślonych cytatów osób). Zamiast wideo — druga grafika w `figure` + `figcaption` (dozwolone w CW4, bez iframe zewnętrznego).
- Udostępnianie: linki Facebook / X / LinkedIn, adres wstawia JS (`data-share` z `{url}`, `{title}`) + przycisk „Kopiuj link” (`data-copy-link`, Clipboard API).
- Struktura `blog*.html`: `<main class="col-lg-8">` i `<aside class="col-lg-4">` są rodzeństwem w `.row` (aside poza main — wymóg a11y „complementary top-level”); nagłówek strony (`section.page-header` z H1) jest przed `main`. `single.html`: całość w `main`, breadcrumb (`nav.post-crumbs`) przed `article`.
- Nagłówek strony na podstronach: przezroczysty jak na hero — dlatego podstrony zaczynają się ciemnym tłem (zdjęcie łuku Alhambry na archiwum, ciemny pas `#2B2929` w artykule). Zdjęcie wiodące artykułu nachodzi na ciemny pas (ujemny margines `.post-cover`).
- Kurtyna intro tylko na stronie głównej: podstrony mają w `<head>` `classList.add('js', 'no-intro')` (bez sessionStorage).
- Menu na podstronach: linki `index.html#hotel` itd., „Kontakt” → `#kontakt` (stopka jest na każdej stronie), „Rezerwuj” → `index.html#rezerwacja`. Bieżąca sekcja: `aria-current="page"` na `blog.html`, `aria-current="true"` na `blog-2/3.html` i `single.html` (styl `.site-menu__link[aria-current]`).
- Sprite SVG jest kopiowany do każdej podstrony (tylko potrzebne ikony) — brak builda; header, stopka i toast są powielone w 5 plikach HTML. Zmiana headera/stopki = edycja wszystkich 5 plików.
- `main.js`: moduły strony głównej (`initHeroVideo`, `initRoomPanel`, `initBooking`, `initGallery`) uruchamiane tylko gdy istnieje `#rezerwacja` (`if (form)`); `defaultStatus` i `panel` mają zabezpieczenie na brak elementów. Bez tego podstrony rzucały błąd i padało menu. Link w menu mobilnym przewija płynnie tylko, gdy cel jest na tej samej stronie (`link.pathname === location.pathname`).
- Wejście z podstrony na `index.html#rezerwacja`: fokus na polu dat ustawiany dopiero po `load` (przeglądarka po wczytaniu przewija do kotwicy i zdejmuje fokus).
- Tabela w artykule: na < 768 px wiersze jako bloki z etykietami z `data-label` (bez poziomego przewijania); na większych ekranach `table-responsive`.
- Bootstrap zeruje `outline` w `.page-link:focus` i `.form-control:focus` — przywrócone własnymi regułami `:focus-visible` w sekcji 14. Wyłączona paginacja bez `opacity` (Lighthouse zgłaszał kontrast).
- Komponenty Bootstrapa z własnym wyglądem w blogu: card (`.post-card`), badge (`.post-badge`, `.count-badge`, `.tag-badge`), breadcrumb (`.blog-breadcrumb`), pagination (`.blog-pagination`), list-group (`.category-list`), form-control (`.blog-search__input`, `.comment-form`), table (`.post-table`), blockquote (`.post-quote`), btn (`.share-btn`).
- SEO podstron: unikalne `title` (42–53 zn.) i description (134–157 zn.), OG (`og-blog.jpg`, `og-pogoda.jpg`, 1200×630), JSON-LD: `blog.html` → `Blog` + `blogPost` (6) + `BreadcrumbList`; `blog-2/3.html` → `CollectionPage` (`isPartOf` Blog, `hasPart` wpisy) + `BreadcrumbList`; `single.html` → `BlogPosting` (autor, daty, `wordCount`, `keywords`) + `BreadcrumbList`; `rel="prev/next"` na stronach archiwum. Ścieżki względne (jak na stronie głównej).
- Zdjęcia bloga (Pexels, ID w `site/README.md`): karty 800×600 WebP, miniatury 240×180 (tylko 3 polecane), grafika wiodąca 900/1600 px, nagłówek archiwum 960/1920 px. Zdjęcie do sjesty wymienione — pierwsze miało szyld innego hotelu (na stronie hotelu tego unikamy).
- `blog-2.html` i `blog-3.html` wygenerowano jednorazowo skryptem z `blog.html` (skrypt tylko w scratchpadzie, nie w repo) — dalej edytuje się je ręcznie jak zwykłe pliki.

### Lokalizacje (2026-10-29, sesja 2) — decyzje uzgodnione z użytkownikiem
- e-spania = hotele w 3 miastach. Pisownia polska: Barcelona, Malaga („w Maladze”), Madryt. Domyślna: Barcelona. W JSON-LD `addressLocality` w formie oficjalnej (Málaga, Madrid).
- Przełącznik: `fieldset.city-switch` w formularzu `#rezerwacja`, nad paskiem; radio `.btn-check` + `label.btn.city-switch__option` (komponent Bootstrapa z własnym wyglądem — szklana pigułka jak pasek). `legend` ukryta („Wybierz hotel”), komunikat `#cityAnnounce` (aria-live). Styl: sekcja 15 w `styles.css`.
- Film w hero gra ZAWSZE dla wszystkich miast (decyzja użytkownika) — zdjęcie hero wspólne, miasto pokazują teksty.
- Dane: `CITIES` w `main.js` (moduł „Lokalizacje”), elementy z `data-city="klucz"` wypełnia `fillCityText` (string → tekst; `[tekst, em]` → tytuł z kursywą; `principles`, `experiences`, `{src, alt}` → zdjęcie). Teksty wspólnego wzoru (eyebrow, link „Odkryj hotel w…”, CTA, wstęp Doświadczeń, panel pokoi) buduje `cityTexts()`.
- HTML zawiera wersję Barcelony (działa bez JS, SEO) — przy zmianie tekstów Barcelony popraw HTML **i** `CITIES` (test porównuje oba).
- Zależne od miasta: hero (eyebrow, H1, link), sekcja Hotel (tytuł, 2 akapity, 3 zasady), Doświadczenia (wstęp, 3 karty Poranek/Popołudnie/Wieczór ze zdjęciami), CTA (tekst; zdjęcie: zatoka dla Barcelony i Malagi, panorama dla Madrytu), nagłówek panelu pokoi, `stayDescription()` (status, panel, toasty zaczynają się od nazwy miasta). Pokoje wspólne dla 3 hoteli.
- Zapamiętanie: `localStorage 'es-city'` (try/catch, nieznana wartość → Barcelona). Skrypt w `<head>` dodaje `city-pending` (ukrywa `[data-city]`, awaryjnie widoczne po 1,5 s), `initCity()` podmienia teksty PRZED podziałem tytułów na słowa (`splitTitle`).
- Zmiana miasta: widoczne elementy `[data-city]` gasną/wracają przez Web Animations API (nie koliduje z przejściami `data-reveal`); kolejne kliknięcie anuluje poprzednie przejście. Tytuł hero dostaje `--intro-delay: 0s`, słowa wjeżdżają od nowa.
- Treści o miastach: tylko ogólne, sprawdzalne fakty (zabytki, dzielnice, plaże), bez odległości i udogodnień hotelu; opisy oznaczone jako demonstracyjne. Opis Suite neutralny (bez „widoku na wodę”).
- Zdjęcia miast: `assets/images/cities/` (Pexels, ID w README). Szukane przez wyszukiwarkę (strona wyszukiwania Pexels blokuje automaty — nie obchodzić), pobierane z `images.pexels.com`. Odrzucone: Gran Vía/Carrión (napis Capitol — hotel, reklama Schweppes). Usunięte nieużywane `exp-pool/table/coast.webp`.
- SEO: title/description/OG o 3 miastach; JSON-LD: `Organization` (#e-spania) + 3 × `Hotel` (nazwa „e-spania Miasto”, `addressLocality`, `addressCountry: ES`, `parentOrganization`) + `WebSite`.
- 5 plików HTML: notka menu mobilnego „Barcelona · Malaga · Madryt — strona demonstracyjna”, stopka „Hotele w Barcelonie, Maladze i Madrycie…”.
- Modal galerii: usunięty statyczny `aria-hidden="true"` (html-validate `hidden-focusable`) — za zgodą użytkownika.

## 2. Działa (zweryfikowane testami w przeglądarce)

### Strona główna (etap 1)
- Header: logo → góra strony, nawigacja do sekcji, menu mobilne (navbar-toggler → offcanvas), dropdown PL/EN/ES (EN/ES = komunikat), „Rezerwuj” → fokus na kalendarz; tło po przewinięciu, chowanie przy przewijaniu w dół, pasek postępu.
- Hero: wideo (desktop/telefon) z pauzą, kurtyna intro, odsłanianie tytułu słowo po słowie.
- Rezerwacja (demo): kalendarz zakresu (2 miesiące ≥768 px, 1 poniżej; mysz, hover, klawiatura), goście 1–6 dorosłych / 0–4 dzieci, walidacja dat i pojemności pokoju, wynik jako toast z oznaczeniem demo.
- Panel pokoi: lista z podglądem zdjęcia (desktop), blokada pokoi za małych dla liczby gości, wybór wpisywany do paska.
- Sekcje: Hotel, Pokoje (4), Doświadczenia (3), Galeria (8 + lightbox ze strzałkami/klawiaturą), Opinie (3 demo), Blog (3 zajawki — etap 2), CTA, stopka.
- Animacje: reveal, clip-reveal zdjęć, parallax, hover przycisków; tryb reduced-motion.
- Jakość (2026-10-20): 360/390/768/1200/1440 px bez overflow-x; brak błędów konsoli; 1×H1; alt; label; cele ≥44 px; widoczny fokus na wszystkich 88 elementach Tab; Lighthouse: dostępność 100, SEO 100, wydajność desktop 87 / mobile 60.

### Blog (etap 2, testy 2026-10-29: Edge headless przez puppeteer-core)
- 5 stron (`index`, `blog`, `blog-2`, `blog-3`, `single`) × 360/390/768/1200/1440 px: brak overflow-x, dokładnie 1×H1, brak skoków w hierarchii nagłówków, wszystkie `img` z `alt`, wszystkie pola z `label`, cele dotykowe ≥ 44 px, JSON-LD parsuje się poprawnie.
- Wszystkie linki wewnętrzne (pliki + kotwice) istnieją. Menu z 7 linkami mieści się w jednym rzędzie od 992 px.
- Interakcje (15/15 OK, konsola czysta): menu mobilne na podstronach i przejście do `index.html#hotel`; język → toast; wyszukiwarka (pusta → błąd + fokus, poprawna → toast demo); paginacja 1 → 2 → 3 → 2 („Następna” wyłączona na 3); formularz komentarza (puste pola → 3 błędy i fokus na pierwszym, zły e-mail → fokus na e-mail, poprawny → toast + reset); linki udostępniania z adresem strony; „Rezerwuj” z podstrony → fokus na polu dat; na stronie głównej menu mobilne nadal przewija do sekcji; widoczny fokus na 60/60 elementach Tab.
- html-validate (`html-validate:recommended`): `blog.html`, `blog-2.html`, `blog-3.html`, `single.html` bez błędów.
- Lighthouse (lokalnie, HTTP): `blog.html` desktop — Performance 94, Accessibility 100, SEO 100; `single.html` desktop 98 / 100 / 100, mobile 81 / 100 / 100; `blog.html` mobile 73 / 100 / 100. Best Practices 81 wszędzie = brak HTTPS + skrypty wstrzykiwane przez antywirus Kaspersky (środowisko, nie kod).

### Lokalizacje (testy 2026-10-29, sesja 2: Edge headless przez puppeteer-core, 47/47)
- Domyślnie Barcelona; klik i strzałki zmieniają wszystkie treści i zdjęcia (z `alt`); wybór przetrwa odświeżenie; nieznana wartość w localStorage → Barcelona; szybkie klikanie → spójny stan ostatniego wyboru; Barcelona z JS = Barcelona z HTML.
- Rezerwacja: miasto w statusie, panelu pokoi, toastach; galeria, menu, podstrony bloga bez zmian; reduced-motion OK; konsola czysta.
- 360/390/768/1200/1440 px × 3 miasta: brak overflow-x, pigułka w 1 rzędzie, przyciski ≥ 44 px, 1×H1.
- html-validate: wszystkie 5 stron bez błędów. JSON-LD parsuje się.

## 3. Najważniejsze pliki

- `site/index.html` — strona główna (sekcja `#blog` z 3 zajawkami przed CTA).
- `site/blog.html`, `site/blog-2.html`, `site/blog-3.html` — archiwum bloga (strony 1–3), wspólny pasek boczny.
- `site/single.html` — szablon artykułu (jedyny pełny wpis).
- `site/css/styles.css` — wspólne style; spis treści na początku pliku; blog w sekcji 14.
- `site/js/main.js` — interakcje (pomocnicze, nagłówek, wideo, lokalizacje `CITIES` + `initCity`, formularz, kalendarz, panel pokoi, galeria, `initBlog`, animacje).
- `site/assets/` — `images/` (18 WebP + `og-image.jpg`), `images/cities/` (10 zdjęć miast), `images/blog/` (zdjęcia bloga + `og-blog.jpg`, `og-pogoda.jpg`), `video/` (2 MP4), `logo/`.
- `site/README.md` — uruchomienie (`python -m http.server 5500` w `site/`), struktura, komponenty, źródła mediów (ID Pexels).
- `e-spania/RWD_Projekt.md` — wymagania prowadzącego (nadrzędne), `e-spania/wymagania.md` — opis projektu, `e-spania/RWD_CW_4.md` — instrukcja etapu 2 (blog).

## 4. Wykonane w sesji 2026-10-20

- Analiza dokumentów i inspiracji (Patina zbadana w przeglądarce), UI UX Pro Max.
- Strona główna: HTML/CSS/JS, zasoby, README.
- Przebudowa hero na wzór Patina (wideo + pasek rezerwacji z kalendarzem), animacje, naprawa linku logo.
- Audyt i refaktor kodu: usunięte martwe atrybuty/klasy/reguły, scalone duplikaty, tokeny (`--tap`, `--radius-pill`, kolory błędów), helpery JS (`onScrollFrame`, `afterMenuClosed`, `closeDropdown`). Naprawione: brak widocznego fokusu (język, menu, „Wybierz”), niedziałający hover-zoom pokoi. Zrzuty przed/po identyczne (0 px, 3 szerokości, oba tryby ruchu, 8 stanów interakcji).
- Commity (wykonane przez użytkownika): `0c4e225` „main page strony”, `ab31f25` „Main page po zredukowaniu kodu”, `ad91c04` „Zakończenie main page 20.10”; wypchnięte na `origin/main`.

## 4b. Wykonane w sesji 2026-10-29 (etap 2 — blog)

- Analiza dokumentacji i stanu repo, plan zaakceptowany przez użytkownika (rekomendacje 1–9 z raportu).
- `index.html`: link „Blog” w menu i stopce, sekcja `#blog` (3 karty + CTA do archiwum).
- Nowe: `blog.html`, `blog-2.html`, `blog-3.html`, `single.html`; 30 plików w `assets/images/blog/`.
- `styles.css`: sekcja 14 + drobne zmiany wspólne (jasna ramka fokusu na `.page-header`, `.post-crumbs`, `.post-header`; stan `[aria-current]` w menu).
- `main.js`: warunkowe uruchamianie modułów strony głównej, `initBlog()`, poprawka linków menu mobilnego między stronami, fokus po `index.html#rezerwacja`.
- `README.md`: nowe pliki, komponenty, treści demo, ID zdjęć.
- Na prośbę użytkownika dodano prawdziwe strony 2 i 3 archiwum (wcześniej paginacja pokazywała komunikat demo — ten kod usunięto z JS).

## 5. Znane problemy i elementy niedokończone

- Wydajność mobile w Lighthouse: strona główna ~60–67, `blog.html` 73 (lokalny serwer bez HTTPS/kompresji; render-blocking CDN Bootstrap + Google Fonts; waga hero). Best Practices 81 przez brak HTTPS i wstrzyknięcia antywirusa (środowisko lokalne).
- Lokalizacje: treść miast podmieniana przez JS — wyszukiwarki widzą głównie Barcelonę (meta i JSON-LD obejmują 3 miasta). Zdjęcie Suite (balkon z widokiem na morze) wspólne dla 3 hoteli — zostawione za zgodą użytkownika. Brak osobnych adresów URL miast.
- Blog: pełną treść ma tylko `single.html`; 14 pozostałych wpisów to zajawki prowadzące do tego samego szablonu. Wyszukiwarka i komentarze są demonstracyjne.
- Placeholdery: kontakt w stopce, opinie (demo), linki do profili hotelu, wersje EN/ES.
- Ścieżki względne w `og:image`, `og:url` i JSON-LD (wszystkie strony).
- Niezgodność fontów: kod (Fraunces/Inter) vs `claude.md` / `wymagania.md` (Google Sans / Noto Sans Symbols 2).
- Niepotwierdzone: napis „es hotels” w logo; klip z zachodem słońca w montażu desktop (widoczne bloki hotelowe); długość intro (~1,4 s).
- Skrypty testowe (puppeteer-core + Edge, html-validate, Lighthouse, sharp do konwersji zdjęć, generator stron archiwum) istniały tylko w scratchpadzie sesji — nie ma ich w repozytorium. Edge: `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`; ffmpeg i Pillow nie są zainstalowane.
- W teście przy 360/390 px pojawia się przerwane żądanie `hero-desktop.mp4` — to artefakt zrzutu całej strony (zmienia proporcje okna); przy zwykłym wczytaniu nie występuje (sprawdzone na wersji z commita i obecnej).

## 6. Do zrobienia

- Commit lokalizacji przez użytkownika (`site/` zmienione, nowy katalog `site/assets/images/cities/`, usunięte `exp-*.webp`, ten plik). Proponowany opis: „Lokalizacje: przełącznik Barcelona / Malaga / Madryt — treści hero, sekcji Hotel, Doświadczeń i CTA zależne od miasta, zapamiętanie wyboru, SEO dla 3 hoteli”.
- Zaktualizować kartę projektu w Forms: hotele w Barcelonie, Maladze i Madrycie (zgodność z kartą = 20 pkt) + fonty Fraunces/Inter; ujednolicić `claude.md` i `wymagania.md` (3 miasta, fonty).
- Propozycje (nie wdrażać bez zgody): `index.html?miasto=malaga` (link do konkretnego hotelu); podstrony miast z własnym SEO (pasuje do etapu 4); blog — zajawki/kategoria wg miasta (brak wpisu o Maladze); kontakt per hotel, gdy będą dane.
- Decyzje: logo, klip z zachodem słońca, długość intro.
- Kolejne etapy wg `RWD_Projekt.md`: 3 — sklep, 4 — brakujące podstrony, 5 — audyt Lighthouse i odbiór. Wytyczne przekazuje prowadzący na zajęciach (plik `RWD_CW_N.md` w `e-spania/`).
- Po publikacji: absolutne URL w OG/JSON-LD (5 plików HTML), ponowny pomiar wydajności na HTTPS.

## 7. Następny krok

Użytkownik commituje rozbudowę o lokalizacje. Etap 3 (sklep) zaczynać dopiero po otrzymaniu nowej instrukcji prowadzącego i zgodzie użytkownika (plan → akceptacja → implementacja, zgodnie z `claude.md`). Nowe podstrony budować na wzór `blog.html` (header/stopka/toast/sprite skopiowane, `no-intro` w `<head>`, ciemny początek strony pod przezroczystym headerem, link w menu z `aria-current`), a style dopisywać jako kolejną sekcję `styles.css`.
