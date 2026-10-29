# ProgressTracking — e-spania

Stan na koniec dnia 2026-10-29.
- Etap 1 RWD (strona główna) — gotowy (2026-10-20).
- Etap 2 RWD (blog wg `e-spania/RWD_CW_4.md`) — gotowy, zaakceptowany przez użytkownika.
- Rozbudowa poza harmonogramem: hotele w 3 miastach (Barcelona / Malaga / Madryt) z przełącznikiem na stronie głównej — gotowa, zaakceptowana.
- Ostatnia zmiana: link „Blog” w menu przeniesiony na koniec (po „Kontakt”) i wyróżniony — zaakceptowany; pliki są w indeksie (`git add`), ale NIEZACOMMITOWANE.
- Git: gałąź `main`, ostatni commit `453ca16` „dodanie miast do wyboru”; lokalnie 4 commity przed `origin/main` (niewypchnięte). Commity i push robi wyłącznie użytkownik.
- W toku: nic.

## 1. Nieoczywiste decyzje

### Ogólne (etap 1)
- Kod strony w `./site/`. Dokumenty wymagań w `e-spania/` (`wymagania.md`, `RWD_Projekt.md` — nadrzędny, `RWD_CW_4.md`); instrukcje agenta w `claude.md` (katalog główny).
- Fonty: Fraunces (nagłówki) + Inter (tekst) zamiast Google Sans / Noto Sans Symbols 2 z `claude.md` / `wymagania.md`. Do ujednolicenia w karcie projektu.
- Kolory: CTA tło `#C9411D` (biały tekst 4.93:1); `#E34B24` (3.96:1) tylko jako akcent; hover `#A9361A`. Dodatkowe tokeny: `--color-muted #5F5757`, `--color-primary-deep #EEE6E3`, `--color-ink #1E1C1C`, `--color-accent-on-dark #F0876B`.
- Logo: `logo-dark.png` / `logo-light.png` (przezroczyste tło) wygenerowane z `logo.png` (oryginał nieużywany). Napis „es hotels” — niepotwierdzony.
- Zdjęcia i wideo: Pexels (licencja bez atrybucji), lokalnie WebP/MP4, oznaczone jako poglądowe; ID w `site/README.md`. Wyszukiwarka Pexels blokuje automaty — zdjęcia szukać przez wyszukiwarkę WWW, pobierać z `images.pexels.com`. Unikać zdjęć z szyldami innych hoteli i reklamami.
- Wideo hero: własny montaż (H.264, bez audio), osobna wersja pionowa wybierana w JS (`max-aspect-ratio: 4/5`). Gra zawsze, także przy `prefers-reduced-motion` i dla wszystkich miast (decyzje użytkownika); nie startuje przy Save-Data; przycisk pauzy.
- `prefers-reduced-motion`: tylko fade (bez transform/clip/parallax). Na maszynie dewelopera Windows ma wyłączone „Efekty animacji” → przeglądarka zgłasza reduce.
- Kurtyna intro: czysty CSS, raz na sesję (`sessionStorage 'es-intro'` → klasa `no-intro`), tylko na stronie głównej.
- Formularz rezerwacji (demo): hidden inputs `arrival`/`departure` + własny kalendarz; pole pokoju (wymóg 5.4 `wymagania.md`); maks. 30 nocy, zakres 365 dni. Nic nie jest wysyłane.
- Bootstrap: dropdowny dat/gości z `data-bs-display="static"`; strzałki kalendarza na `window` w fazie capture; menu mobilne = offcanvas z `data-bs-backdrop="false"`.
- Animacje: reveal `clip` obserwuje rodzica (IO nie widzi elementu z `clip-path`); parallax przez `translate` (±8%); zoom przez `scale`.
- Panel pokoi budowany w JS z kart `.room-card`. Toast pod nagłówkiem.
- Treści bez weryfikacji: opinie „Przykład”, kontakt „do uzupełnienia”, metraże przykładowe, EN/ES = toast „wkrótce”.
- Fokus: wspólna reguła `:focus-visible`; Bootstrap zeruje outline w `.btn`, `.nav-link`, `.navbar-toggler`, `.page-link`, `.form-control` — wszędzie przywrócony własnymi regułami.
- CSS i JS celowo w jednym pliku każdy (brak builda); `styles.css` ma spis treści i numerowane sekcje.
- Szkło (glassmorphism): tokeny `--glass-*` w `:root` i JEDNA wspólna reguła `.booking__bar, .city-switch__group` (sekcja 6.1) — tło, ramka, rozmycie, fallback `@supports`; każdy element ma tylko własny promień i cień. Nowy szklany element dopisać do tej reguły.
- Etykieta „Przykład” (treści demo): wspólna klasa `.demo-tag` (sekcja 3.1, obok `.demo-note` / `.demo-banner`), wariant `.demo-tag--sm` w komentarzach; `.review__tag` dodaje tylko położenie w karcie opinii.
- Klasy bez stylów, które zostają celowo: `dropup` (Bootstrap w trybie `static` ustawia dzięki niej kalendarz nad paskiem), `about__figure`, `blog-teaser`, `sidebar-block` (nazwy bloków BEM dla klas `__element`).

### Blog (etap 2) — decyzje uzgodnione z użytkownikiem
- Plik stylów zostaje `css/styles.css` (CW4 mówi `style.css`; liczy się „jeden wspólny arkusz”). Blog = sekcja 14 w `styles.css`.
- Sekcja `#blog` na stronie głównej: między Opiniami a końcowym CTA (na stronie nie ma formularza kontaktowego; kontakt = stopka `#kontakt`).
- Archiwum: `blog.html` (6 wpisów), `blog-2.html` (6), `blog-3.html` (3) = 15 wpisów; paginacja to zwykłe linki `blog-N.html#wpisy`, skrajne strzałki `disabled`. Liczniki kategorii liczą całe archiwum (Planowanie podróży 2, Zwiedzanie 4, Kuchnia 3, Kultura i zwyczaje 2, Praktyczne porady 4) — przy nowym wpisie poprawić we WSZYSTKICH 3 plikach.
- Wszystkie karty → jeden szablon `single.html` (wymóg CW4). Pełną treść ma tylko „Kiedy jechać do Hiszpanii? Pogoda i najlepszy termin na wyjazd” (893 słowa, ok. 5 min).
- Tematy: zapytania turystów przed wyjazdem (SEO); fakty o Hiszpanii ogólne i sprawdzalne, bez faktów o hotelu. Autorzy (od użytkownika): Oskar Kasprzyk, Krystian Jałocha, Dawid Jajko; awatary = inicjały w CSS.
- Demo: komentarze oznaczone „Przykład”; wyszukiwarka i formularz komentarza → walidacja Bootstrapa (`novalidate` + `.was-validated`), potem toast (`data-demo-form`, `data-demo-title`, `data-demo-text`).
- Artykuł: blockquote = prawdziwe przysłowie hiszpańskie; zamiast wideo druga grafika w `figure`; tabela na < 768 px jako bloki z `data-label`; udostępnianie przez `data-share` (`{url}`, `{title}`) + „Kopiuj link”.
- Struktura `blog*.html`: `main.col-lg-8` i `aside.col-lg-4` jako rodzeństwo (aside poza main — a11y); H1 w `section.page-header` przed `main`. `single.html`: wszystko w `main`, breadcrumb przed `article`.
- Podstrony zaczynają się ciemnym tłem (header jest przezroczysty jak na hero); w `<head>` mają `classList.add('js', 'no-intro')`.
- Header, stopka, toast i sprite SVG są skopiowane do 5 plików HTML (brak builda) — zmiana headera/stopki = edycja wszystkich 5 plików. Linki menu na podstronach: `index.html#…`, „Rezerwuj” → `index.html#rezerwacja`; bieżąca sekcja: `aria-current="page"` (`blog.html`) / `"true"` (`blog-2/3`, `single`).
- Link „Blog” w menu stoi OSTATNI (po „Kontakt”), klasa `.site-menu__link--featured` (koniec sekcji 4.3 w `styles.css`). Telefon: kursywa w kolorze `#F0876B`, numer „07” w akcencie. Desktop: ta sama typografia co inne linki (równa linia — wersja z kursywą szeryfową odrzucona), grubość 600, kolor `#F0876B` na przezroczystym headerze / `#A9361A` po przewinięciu, cienka pionowa kreska przed linkiem (`::before`, `--featured-gap`).
- `main.js`: moduły strony głównej uruchamiane tylko gdy istnieje `#rezerwacja` (`if (form)`) — bez tego podstrony rzucały błąd. Menu mobilne przewija płynnie tylko do celu na tej samej stronie. Po wejściu na `index.html#rezerwacja` fokus na polu dat ustawiany po `load`.
- Komponenty Bootstrapa z własnym wyglądem w blogu: card, badge, breadcrumb, pagination, list-group, form-control, table, blockquote, btn (`.share-btn`).
- SEO podstron: unikalne `title`/description, OG (`og-blog.jpg`, `og-pogoda.jpg`), JSON-LD: `Blog` (+ `blogPost`), `CollectionPage` (strony 2–3), `BlogPosting` (artykuł), `BreadcrumbList` wszędzie; `rel="prev/next"` w archiwum.

### Lokalizacje (rozbudowa) — decyzje uzgodnione z użytkownikiem
- e-spania = hotele w Barcelonie, Maladze, Madrycie (pisownia polska; w JSON-LD `addressLocality`: Málaga, Madrid). Domyślnie Barcelona.
- Przełącznik: `fieldset.city-switch` w `#rezerwacja`, radio `.btn-check` + `label.btn.city-switch__option`; komunikat `#cityAnnounce` (aria-live). Styl: sekcja 15 w `styles.css`.
- Dane: `CITIES` w `main.js`; elementy `data-city="klucz"` wypełnia `fillCityText`, wspólne wzory buduje `cityTexts()`. HTML zawiera wersję Barcelony (działa bez JS, SEO) — przy zmianie tekstów Barcelony poprawić HTML **i** `CITIES`.
- Zależne od miasta: hero, sekcja Hotel, Doświadczenia, CTA, nagłówek panelu pokoi, `stayDescription()`. Pokoje wspólne dla 3 hoteli.
- Zapamiętanie: `localStorage 'es-city'` (try/catch; nieznana wartość → Barcelona); `city-pending` w `<head>` ukrywa `[data-city]` do podmiany; teksty podmieniane przed podziałem tytułów na słowa. Zmiana miasta animowana przez Web Animations API.
- Zdjęcia miast: `assets/images/cities/`. SEO: meta i OG o 3 miastach; JSON-LD `Organization` + 3 × `Hotel` + `WebSite`.
- Modal galerii: usunięty statyczny `aria-hidden="true"` (html-validate `hidden-focusable`) — za zgodą użytkownika.

## 2. Zweryfikowane (testy w przeglądarce: Edge headless + puppeteer-core)

- 5 stron (`index`, `blog`, `blog-2`, `blog-3`, `single`) × 360/390/768/1200/1440 px: brak overflow-x, 1×H1, poprawna hierarchia nagłówków, `alt` przy wszystkich `img`, `label` przy polach, cele ≥ 44 px, JSON-LD parsuje się, wszystkie linki wewnętrzne i kotwice istnieją. Menu (7 linków) w jednym rzędzie od 992 px.
- Interakcje bloga 15/15 (menu mobilne między stronami, język, wyszukiwarka, paginacja 1→2→3→2, formularz komentarza, udostępnianie, „Rezerwuj” z podstrony, fokus na 60/60 elementach Tab); lokalizacje 47/47 (zmiana miasta, zapamiętanie, rezerwacja z miastem, reduced-motion). Konsola czysta.
- html-validate (`html-validate:recommended`): wszystkie 5 stron bez błędów.
- Lighthouse (lokalnie, HTTP): Accessibility 100 i SEO 100 na stronach bloga; Performance desktop 94–98, mobile 73–81 (blog), ~60–67 (strona główna). Best Practices 81 = brak HTTPS + skrypty wstrzykiwane przez antywirus Kaspersky (środowisko, nie kod).

## 3. Najważniejsze pliki

- `site/index.html` — strona główna (przełącznik miast w hero, sekcja `#blog` przed CTA).
- `site/blog.html`, `site/blog-2.html`, `site/blog-3.html` — archiwum bloga; `site/single.html` — szablon artykułu.
- `site/css/styles.css` — wspólne style (spis treści na początku; 4.3 menu, 14 blog, 15 lokalizacje).
- `site/js/main.js` — interakcje (nagłówek, wideo, lokalizacje `CITIES`/`initCity`, rezerwacja, kalendarz, panel pokoi, galeria, `initBlog`, animacje).
- `site/assets/` — `images/`, `images/blog/`, `images/cities/`, `video/`, `logo/`.
- `site/README.md` — uruchomienie (`python -m http.server 5500` w `site/`), struktura, komponenty, ID zdjęć Pexels.

## 4. Historia sesji

- 2026-10-20 — etap 1: strona główna (hero z wideo i kalendarzem, sekcje, animacje), audyt i refaktor. Commity `0c4e225`, `ab31f25`, `ad91c04`.
- 2026-10-29 (1) — etap 2: blog (`blog.html`, `single.html`, zajawka na stronie głównej), potem prawdziwe strony 2–3 archiwum. Commity `01db6bd`, `85509ff`, `5feb7b7`.
- 2026-10-29 (2) — lokalizacje: przełącznik Barcelona / Malaga / Madryt. Commit `453ca16`.
- 2026-10-29 (3) — link „Blog” w menu przeniesiony na koniec i wyróżniony; audyt jakości kodu: brak div soup, martwego kodu i stylów inline; usunięte duplikacje (szkło, etykieta „Przykład”, kolor błędu `--color-error-on-light`, komunikat kopiowania w JS), pusta klasa `post-footer__row`. Zrzuty 5 stron × 3 szerokości przed/po identyczne co do piksela. Niezacommitowane.

## 5. Znane problemy i elementy niedokończone

- Wydajność mobile w Lighthouse (render-blocking CDN Bootstrap + Google Fonts, waga hero, lokalny serwer bez HTTPS/kompresji).
- Blog: pełną treść ma tylko `single.html`; wyszukiwarka i komentarze są demonstracyjne.
- Lokalizacje: treści miast podmienia JS — wyszukiwarki widzą głównie Barcelonę; brak osobnych URL miast; zdjęcie Suite wspólne dla 3 hoteli (za zgodą użytkownika).
- Placeholdery: kontakt w stopce, opinie (demo), linki do profili hotelu, wersje EN/ES.
- Ścieżki względne w `og:image`, `og:url` i JSON-LD (wszystkie strony) — do zamiany na absolutne po publikacji.
- Niezgodność fontów: kod (Fraunces/Inter) vs `claude.md` / `wymagania.md`.
- Niepotwierdzone: napis „es hotels” w logo; klip z zachodem słońca w montażu desktop; długość intro (~1,4 s).
- Narzędzia testowe (puppeteer-core + Edge `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, html-validate, Lighthouse, sharp) instalowane tylko w scratchpadzie sesji — nie ma ich w repo. ffmpeg i Pillow nie są zainstalowane.
- Fałszywe alarmy w testach: przerwane żądanie `hero-desktop.mp4` przy 360/390 px (zrzut całej strony zmienia proporcje okna); radio `.btn-check` 13×13 px w przełączniku miast (Bootstrap je ukrywa, klikalne są etykiety).

## 6. Do zrobienia

- Użytkownik: commit zmian menu („Blog” na końcu i wyróżniony — 5 plików HTML, `styles.css`, ten plik) i push 5 commitów na `origin/main`.
- Zaktualizować kartę projektu w Forms (3 miasta, fonty Fraunces/Inter); ujednolicić `claude.md` i `wymagania.md`.
- Decyzje użytkownika: logo, klip z zachodem słońca, długość intro; usunięcie 3 nieużywanych miniatur (`assets/images/blog/sjesta-thumb.webp`, `tapas-thumb.webp`, `zwroty-thumb.webp`).
- Propozycje (nie wdrażać bez zgody): `index.html?miasto=…`, podstrony miast z własnym SEO (etap 4), wpisy bloga o konkretnych miastach, kontakt per hotel.
- Kolejne etapy wg `RWD_Projekt.md`: 3 — sklep, 4 — brakujące podstrony, 5 — audyt Lighthouse i odbiór. Wytyczne przekazuje prowadzący (plik `RWD_CW_N.md` w `e-spania/`).

## 7. Następny krok

Etap 3 (sklep) zaczynać dopiero po otrzymaniu instrukcji prowadzącego i zgodzie użytkownika (plan → akceptacja → implementacja, zgodnie z `claude.md`). Nowe podstrony budować na wzór `blog.html`: skopiowany header/stopka/toast/sprite, `no-intro` w `<head>`, ciemny początek strony pod przezroczystym headerem, link w menu z `aria-current`, style jako kolejna numerowana sekcja `styles.css`, nowy link dodać do menu i stopki we wszystkich plikach HTML.
