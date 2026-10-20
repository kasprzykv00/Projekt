# e-spania — strona główna hotelu

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
  index.html          strona główna
  css/styles.css      zmienne (design tokens), nadpisania Bootstrapa, sekcje, animacje
  js/main.js          menu, formularz dostępności, panel pokoi, galeria, animacje
  assets/
    logo/             logo.png (oryginał), logo-dark.png i logo-light.png (przezroczyste tło)
    images/           zdjęcia WebP + og-image.jpg
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
przyciski (`.btn-accent`, `.btn-ink`, `.btn-ghost`), `form-control` (moduł dostępności), modal (podgląd galerii), toast (powiadomienia).

## Treści demonstracyjne

- Rezerwacja nie łączy się z żadnym systemem — wynik wyszukiwania jest demonstracyjny.
- Nazwy, metraże i wyposażenie pokoi są przykładowe.
- Opinie są oznaczone jako przykładowe; linki prowadzą do stron głównych platform, nie do profilu hotelu.
- Adres, telefon i e-mail w stopce czekają na uzupełnienie.
- Przełącznik języka pokazuje komunikat — wersje EN/ES nie istnieją jeszcze.

## Zdjęcia

Zdjęcia poglądowe z [Pexels](https://www.pexels.com/) (licencja Pexels — darmowe użycie, także komercyjne, bez wymogu atrybucji).
Nie przedstawiają prawdziwego obiektu. Numery zdjęć: 37911536 (hero, OG), 28243788, 13888606, 18078646, 29086914, 8440280,
30221505, 20975734, 36900313, 37549439, 20852906, 27945047, 19733194, 18355893, 31933142, 12891613, 19075381, 4947223, 12755879.

Wideo w hero to montaż klipów z [Pexels](https://www.pexels.com/videos/) (ta sama licencja), przycięty i skompresowany
(H.264, bez dźwięku). Klipy — desktop: 31978239, 34549899, 18326569, 36229344, 31805421 (Mallorca, Ronda);
telefon: 35675134, 39544848, 37015145, 39243752 (biały dom z basenem, patio, Generalife, Alhambra).

## Po publikacji

W `index.html` podmień względne ścieżki w `og:image` i JSON-LD (`image`, `logo`) na pełne adresy URL (`https://...`).
