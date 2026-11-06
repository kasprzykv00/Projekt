# e-spania — strona hoteli w Barcelonie, Maladze i Madrycie (z blogiem)

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
  blog.html           archiwum bloga, strona 1: 6 najnowszych wpisów, paginacja, pasek boczny
  blog-2.html         archiwum bloga, strona 2 (6 wpisów)
  blog-3.html         archiwum bloga, strona 3 (3 wpisy)
  single.html         szablon artykułu (wpis „Kiedy jechać do Hiszpanii?”)
  sklep.html          katalog: filtry, sortowanie, paginacja
  produkt.html        karta produktu (produkt.html?id=costa — treść wypełnia shop.js)
  koszyk.html         koszyk: ilość, usuwanie, kod rabatowy HOLA10
  zamowienie.html     kasa: dane, dostawa, płatność, faktura, zgody
  rezerwacja.html     rezerwacja: termin, pokój, dodatki, wycieczki zależne od miasta
  platnosc.html       płatność za zamówienie lub rezerwację (BLIK, karta, przelew)
  konto.html          konto: rezerwacje z kalendarzem i odliczaniem, zamówienia, adres, ustawienia
  css/styles.css      wspólny arkusz wszystkich podstron; blog w sekcji 14, sklep w sekcji 16 (MODUŁ E-COMMERCE)
  js/main.js          menu, pasek rezerwacji, panel pokoi, galeria, animacje, formularze bloga
  js/shop-data.js     produkty, ceny, pokoje, dodatki, wycieczki, koszty dostawy
  js/shop.js          koszyk, filtry, rezerwacja, płatność i konto (zapis w localStorage)
  assets/
    logo/             logo.png (oryginał), logo-dark.png i logo-light.png (przezroczyste tło)
    images/           zdjęcia WebP + og-image.jpg
    images/blog/      zdjęcia bloga (karty 800×600, miniatury, grafika wiodąca, nagłówek, OG)
    images/cities/    zdjęcia miast
    images/sklep/     zdjęcia produktów (800 px, ręcznik także 1200 px), nagłówek sklepu, OG
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
przyciski-przełączniki `btn-check` (wybór miasta, `.city-switch`),
przyciski (`.btn-accent`, `.btn-ink`, `.btn-ghost`, `.share-btn`), `form-control` (moduł dostępności, wyszukiwarka, komentarze), modal (podgląd galerii), toast (powiadomienia).
Blog: card (`.post-card`), badge (`.post-badge`, `.count-badge`, `.tag-badge`), breadcrumb (`.blog-breadcrumb`), pagination (`.blog-pagination`),
list-group (`.category-list`), table (`.post-table` — na telefonie wiersze jako bloki), blockquote (`.post-quote`).
Sklep: card (`.product-card`, `.summary-card`), badge (`.product-badge`, `.nav-badge`, `.status-badge`), nav-tabs (`.product-tabs`), offcanvas-lg (`.shop-filters`),
table (`.cart-table`, `.orders-table`, `.spec-table`), list-group (`.account-nav`), progress (`.order-progress`), modal (`.shop-modal`), form (`.shop-form`, `.option-card`).
Ikony nowego modułu: Bootstrap Icons 1.13.2 (CDN).

## O projekcie i danych

e-spania to fikcyjny hotel, projekt na Responsive Web Design (Oskar Kasprzyk, Dawid Jajko, Krystian Jałocha).
Ceny, opinie, oceny i dane kontaktowe są wymyślone. Nie ma backendu ani prawdziwych płatności.

- **Zapis danych:** koszyk, rezerwacje, zamówienia i profil są w `localStorage` tej przeglądarki (klucze `es-*`).
  Przy pierwszym wejściu powstają dane startowe: 2 produkty w koszyku oraz przykładowa historia na koncie.
  Aby zacząć od nowa: DevTools → Application → Local Storage → usuń wpisy `es-*`.
- **Płatność:** formularz sprawdza tylko format danych (np. karta `2222 2222 2222 2222`, ważność `22/2`, BLIK `123456`).
  Numer karty nie jest wysyłany ani zapisywany — na koncie zostają tylko 4 ostatnie cyfry.
- **Wycieczki** wybiera się przy rezerwacji, bo mają termin i miasto. Sklep sprzedaje produkty, które można wysłać.
- **Miasta:** wybór nad paskiem rezerwacji zmienia teksty hero, sekcji „Hotel”, CTA i opis pobytu. Dane są w `js/main.js` (`CITIES`);
  w HTML jest wersja barcelońska (domyślna, działa bez JS). Wybór zapamiętuje `localStorage` (`es-city`).
- **Ceny pokoi** są w dwóch miejscach: `js/shop-data.js` i karty pokoi w `index.html`. Produkty: `shop-data.js` oraz karty w `sklep.html` i `index.html`.
- Przełącznik języka pokazuje komunikat — wersje EN/ES jeszcze nie istnieją.
- Blog: wszystkie karty prowadzą do jednego szablonu `single.html`. Archiwum ma 15 wpisów na 3 stronach.
  Wyszukiwarka i formularz komentarza pokazują tylko komunikat (nic nie jest wysyłane).

## Zdjęcia

Sklep (`assets/images/sklep/`): 30982095, 30982097, 5424905 (ręcznik, nagłówek, OG), 11065504 (ceramika), 13385627 (talerze),
1022385 (oliwa), 6311980 (świeca), 7407315 (świece), 5705991 (voucher), 7410461 (zestaw), 10816681 (kubki), 39166104 (karafki).

Zdjęcia z [Pexels](https://www.pexels.com/) (licencja Pexels — darmowe użycie, także komercyjne, bez wymogu atrybucji).
Nie przedstawiają prawdziwego obiektu. Numery zdjęć: 37911536 (hero, OG), 28243788, 13888606, 18078646, 29086914, 8440280,
30221505, 20975734, 36900313, 37549439, 20852906, 27945047, 19733194, 18355893, 31933142, 12891613, 19075381, 4947223, 12755879.
Blog: 29837765 (wybrzeże, OG artykułu), 33389174 (tapas), 33524255 (Alhambra), 30875644 (ulica w Madrycie), 8212231 (walizka),
18489894 (Marbella), 14797463 (łuk Alhambry — nagłówek bloga, OG), 6603519 (Plaza de España),
998736 (Sagrada Família), 32629172 (paella), 10550304 (Teide), 28603797 (flamenco), 22744005 (dworzec w Madrycie),
35417806 (Gran Vía), 16926806 (winnica), 10293706 (górskie miasteczko), 106052 (La Rambla).

Miasta (`assets/images/cities/`, sekcja „Doświadczenia” i CTA Madrytu): 4947788 (Park Güell), 30838750 (Barceloneta),
29988784 (Dzielnica Gotycka), 16698250 (Alcazaba), 29325353 (katedra w Maladze), 16715772 (La Farola), 14268479 (Retiro),
26755990 (Pałac Królewski), 17198171 (Plaza Mayor), 3757144 (Gran Vía z budynkiem Metropolis — CTA Madrytu).
Dawne zdjęcia sekcji „Doświadczenia” (`exp-pool`, `exp-table`, `exp-coast`) usunięto — są w historii repozytorium.

Wideo w hero to montaż klipów z [Pexels](https://www.pexels.com/videos/) (ta sama licencja), przycięty i skompresowany
(H.264, bez dźwięku). Klipy — desktop: 31978239, 34549899, 18326569, 36229344, 31805421 (Mallorca, Ronda);
telefon: 35675134, 39544848, 37015145, 39243752 (biały dom z basenem, patio, Generalife, Alhambra).

## Po publikacji

We wszystkich plikach HTML podmień względne ścieżki w `og:image`, `og:url` i JSON-LD (`image`, `logo`, `url`, `item`, `@id`)
na pełne adresy URL (`https://...`).
