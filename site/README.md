# e-spania — strona hotelu z blogiem

Strona statyczna: HTML5 + CSS3 + Bootstrap 5.3.3 (CDN) + czysty JavaScript. Bez backendu i bez kroku budowania.

## Uruchomienie lokalnie

**Opcja A — VS Code Live Server**
1. Zainstaluj rozszerzenie "Live Server" (Ritwick Dey).
2. Kliknij prawym przyciskiem na `index.html` → "Open with Live Server".

**Opcja B — Python** (w folderze `site/`)
```
python -m http.server 5500
```
i otwórz `http://localhost:5500`.

**Opcja C — Node.js**
```
npx serve .
```

Plik `index.html` można też otworzyć bezpośrednio z dysku, ale zalecany jest serwer lokalny.

## Struktura

```
site/
  index.html          strona główna (z zajawką 3 najnowszych wpisów)
  blog.html           archiwum bloga: 6 wpisów, paginacja, pasek boczny
  single.html         szablon artykułu (wpis „Kiedy jechać do Hiszpanii?”)
  css/styles.css      wspólny arkusz wszystkich podstron; style bloga w sekcji 14
  js/main.js          menu, formularz dostępności, panel pokoi, galeria, animacje, elementy demo bloga
  assets/
    logo/             logo.png (oryginał), logo-dark.png i logo-light.png (przezroczyste tło)
    images/           zdjęcia WebP + og-image.jpg
    images/blog/      zdjęcia bloga (karty 800×600, miniatury, grafika wiodąca, nagłówek, OG)
    video/            hero-desktop.mp4 (poziomy, 3 MB), hero-mobile.mp4 (pionowy, 2 MB)
```

## Animacje i ograniczenie ruchu

Kurtyna z logo przy pierwszym wejściu (raz na sesję), tytuły odsłaniane słowo po słowie, zdjęcia odsłaniane „kurtyną”,
parallax, chowający się nagłówek, pasek postępu przewijania, animowane przyciski, film w tle hero.

Jeśli system ma włączone ograniczenie ruchu (np. Windows: Ustawienia → Ułatwienia dostępu → Efekty wizualne →
„Efekty animacji” wyłączone), strona pokazuje tylko łagodne pojawianie się. Film w hero gra zawsze od wejścia
(można go zatrzymać przyciskiem pauzy); nie startuje sam tylko w trybie oszczędzania danych.

## Komponenty Bootstrapa z własnym wyglądem

Navbar + offcanvas (menu mobilne), offcanvas (panel wyboru pokoi), dropdown (język, liczba gości),
przyciski (`.btn-accent`, `.btn-ink`, `.btn-ghost`, `.share-btn`), `form-control` (moduł dostępności, wyszukiwarka, komentarze), modal (podgląd galerii), toast (powiadomienia).
Blog: card (`.post-card`), badge (`.post-badge`, `.count-badge`, `.tag-badge`), breadcrumb (`.blog-breadcrumb`), pagination (`.blog-pagination`),
list-group (`.category-list`), table (`.post-table` — na telefonie wiersze jako bloki), blockquote (`.post-quote`).

## Treści demonstracyjne

- Rezerwacja nie łączy się z żadnym systemem — wynik wyszukiwania jest demonstracyjny.
- Nazwy, metraże i wyposażenie pokoi są przykładowe.
- Opinie są oznaczone jako przykładowe; linki prowadzą do stron głównych platform, nie do profilu hotelu.
- Adres, telefon i e-mail w stopce czekają na uzupełnienie.
- Przełącznik języka pokazuje komunikat — wersje EN/ES nie istnieją jeszcze.
- Blog: wszystkie karty prowadzą do jednego szablonu `single.html`. Wyszukiwarka, strony 2–3 paginacji i formularz komentarza
  pokazują komunikat demo (nic nie jest wysyłane). Komentarze są oznaczone jako przykładowe.

## Zdjęcia

Zdjęcia poglądowe z [Pexels](https://www.pexels.com/) (licencja Pexels — darmowe użycie, także komercyjne, bez wymogu atrybucji).
Nie przedstawiają prawdziwego obiektu. Numery zdjęć: 37911536 (hero, OG), 28243788, 13888606, 18078646, 29086914, 8440280,
30221505, 20975734, 36900313, 37549439, 20852906, 27945047, 19733194, 18355893, 31933142, 12891613, 19075381, 4947223, 12755879.
Blog: 29837765 (wybrzeże, OG artykułu), 33389174 (tapas), 33524255 (Alhambra), 30875644 (ulica w Madrycie), 8212231 (walizka),
18489894 (Marbella), 14797463 (łuk Alhambry — nagłówek bloga, OG), 6603519 (Plaza de España).

Wideo w hero to montaż klipów z [Pexels](https://www.pexels.com/videos/) (ta sama licencja), przycięty i skompresowany
(H.264, bez dźwięku). Klipy — desktop: 31978239, 34549899, 18326569, 36229344, 31805421 (Mallorca, Ronda);
telefon: 35675134, 39544848, 37015145, 39243752 (biały dom z basenem, patio, Generalife, Alhambra).

## Po publikacji

W `index.html`, `blog.html` i `single.html` podmień względne ścieżki w `og:image`, `og:url` i JSON-LD (`image`, `logo`, `url`, `item`, `@id`)
na pełne adresy URL (`https://...`).
