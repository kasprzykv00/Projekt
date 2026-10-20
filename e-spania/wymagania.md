# E-SPANIA — WYMAGANIA PROJEKTOWE

## 1. Informacje o projekcie

**Nazwa serwisu:** e-spania  
**Typ projektu:** Responsywna strona internetowa hotelu w Hiszpanii.  
**Charakter:** Projekt semestralny realizowany jako rozbudowa portfolio.  
**Główna konwersja:** Zachęcenie użytkownika do sprawdzenia dostępności i rezerwacji pobytu.

### Cel projektu

Stworzenie nowoczesnej, dopracowanej wizualnie strony hotelowej, która łączy estetykę luksusowych obiektów hotelowych z intuicyjną obsługą i poprawnym działaniem na różnych urządzeniach.

Strona powinna wyglądać jak profesjonalny projekt komercyjny, a nie gotowy, generyczny szablon hotelowy.

Projekt będzie rozwijany etapami. Każdy etap musi zostać sprawdzony i zaakceptowany przed rozpoczęciem kolejnego.

## 2. Najważniejsze zasady realizacji

1. Bezwzględnie przestrzegaj wymagań opisanych w pliku `RWD_Projekt.md`.
2. Stosuj HTML5, CSS3 i Bootstrap 5 ładowany przez CDN.
3. Nie zmieniaj ustalonej identyfikacji wizualnej bez mojej zgody.
4. Nie twórz wszystkich podstron jednocześnie.
5. Na początku wykonaj wyłącznie stronę główną.
6. Przed implementacją przeanalizuj inspiracje wizualne i przedstaw plan.
7. Po każdym etapie uruchom stronę, sprawdź jej działanie i pokaż mi rezultat do akceptacji.
8. Nie przechodź do następnego etapu bez mojej wyraźnej zgody.
9. Nie dodawaj funkcji, które nie są wymagane, jeśli komplikują projekt lub odciągają uwagę od jakości strony.
10. Nie wymyślaj faktów o hotelu, jego lokalizacji, cenach, wyposażeniu, ocenach ani opiniach gości.

## 3. Marka i kierunek wizualny

### Nazwa

e-spania

### Charakter marki

Strona hotelu zlokalizowanego w Hiszpanii. Dokładna lokalizacja, charakter obiektu i grupa docelowa zostaną doprecyzowane na podstawie dalszych informacji.

### Kierunek artystyczny

Projekt powinien być inspirowany estetyką następujących stron:

- Cheval Blanc — https://www.chevalblanc.com/en/
- Patina Maldives — https://patinahotels.com/maldives
- The Calile Hotel — https://thecalilehotel.com/

Szczegółowe referencje, screenshoty i opis poszczególnych elementów znajdują się w `design/references/inspiracje.md`.

Inspiracje należy analizować pod kątem kompozycji, typografii, fotografii, nawigacji, animacji i rozwiązań UX. Nie kopiuj ich bezpośrednio. Opracuj oryginalną stronę e-spania, wykorzystując wskazane elementy jako kierunek projektowy.

### Pożądane cechy

- duże, wysokiej jakości zdjęcia;
- wyrazista, elegancka typografia;
- odpowiednio dużo pustej przestrzeni;
- przemyślana kompozycja sekcji;
- subtelne animacje i przejścia;
- minimalistyczne, ale charakterystyczne komponenty;
- wyraźna hierarchia treści;
- dopracowane detale interfejsu;
- spójność wizualna pomiędzy wszystkimi elementami.

### Czego unikać

- generycznego wyglądu szablonu Bootstrap;
- przypadkowych gradientów;
- nadmiernie zaokrąglonych kart;
- nadmiaru cieni i obramowań;
- przesadnych animacji;
- zbyt dużej liczby przycisków;
- przypadkowych zdjęć i ikon;
- przeładowania strony treścią;
- niepotrzebnych elementów dekoracyjnych.

## 4. Identyfikacja wizualna

### Kolory

| Rola | HEX |
|---|---|
| Primary — kolor podstawowy | `#F7F2F2` |
| Secondary — kolor dodatkowy | `#2B2929` |
| Accent / CTA | `#E34B24` |
| Text — kolor tekstu | `#000000` |

Kolory należy zdefiniować jako zmienne CSS w `:root`.

Przykładowe nazwy zmiennych:

- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-text`

Kolor podstawowy powinien stanowić główne jasne tło strony. Kolor dodatkowy może służyć do budowania kontrastu i ciemniejszych sekcji. Kolor akcentowy powinien wyróżniać najważniejsze akcje, w szczególności rezerwację.

Zachowaj odpowiedni kontrast tekstu i elementów interfejsu. Nie stosuj akcentowego koloru automatycznie do wszystkich elementów.

### Typografia

- Font nagłówków: Google Sans.
- Font tekstu podstawowego: Noto Sans Symbols 2.

Przed implementacją sprawdź dostępność fontów, wymagane warianty oraz obsługę polskich i hiszpańskich znaków.

Noto Sans Symbols 2 jest krojem przeznaczonym przede wszystkim do symboli, dlatego należy sprawdzić, czy rzeczywiście nadaje się do pełnych tekstów. Jeśli nie, poinformuj mnie o ograniczeniu i zaproponuj rozwiązanie przed zmianą.

Google Sans również należy zweryfikować pod kątem możliwości legalnego osadzenia na stronie.

Typografia powinna mieć wyraźną hierarchię:
- duże nagłówki główne;
- zróżnicowane nagłówki sekcji;
- czytelne teksty opisowe;
- spójne etykiety formularzy;
- odpowiednio wystylowane przyciski i nawigację.

### Logo

Gotowe logo e-spania znajduje się lub będzie znajdować się w folderze `design/`.

Wykorzystaj istniejący plik logo. Nie projektuj nowego i nie zmieniaj jego proporcji. Dobierz rozmiar oraz sposób prezentacji do nagłówka i pozostałych elementów strony.

## 5. Etap 1 — strona główna

**Zakres pierwszego etapu obejmuje wyłącznie homepage.**

Pozostałe podstrony i rozbudowane moduły będą tworzone dopiero po zaakceptowaniu strony głównej.

### 5.1. Header i nawigacja

Nagłówek powinien zawierać:
- logo e-spania;
- nawigację prowadzącą do odpowiednich sekcji strony;
- możliwość zmiany języka;
- łatwo dostępny przycisk rezerwacji;
- menu rozwijane lub boczne, zgodne z kierunkiem wizualnym projektu.

Nagłówek powinien być elegancki, czytelny i dobrze zintegrowany z głównym zdjęciem. Należy przeanalizować rozwiązania z dostarczonych referencji i dobrać odpowiednie zachowanie nagłówka podczas przewijania.

Na urządzeniach mobilnych należy zastosować responsywne menu z wykorzystaniem komponentu `navbar-toggler` Bootstrapa.

### 5.2. Hero — pierwszy ekran

Hero jest jednym z najważniejszych elementów strony i powinien zostać dopracowany w pierwszej kolejności.

Wymagania:
- duże zdjęcie hotelu lub otoczenia;
- wyrazisty nagłówek;
- krótki opis;
- subtelne wejście tekstu i elementów interfejsu;
- czytelna nawigacja;
- moduł sprawdzania dostępności pobytu widoczny na pierwszym ekranie.

Nie należy ograniczać hero do standardowego zdjęcia z tekstem pośrodku. Kompozycja powinna być inspirowana luksusowymi stronami referencyjnymi i mieć indywidualny charakter.

### 5.3. Moduł sprawdzania dostępności

Na pierwszym ekranie musi znajdować się elegancki moduł wyszukiwania pobytu inspirowany rozwiązaniami z podanych stron.

**Kierunek wizualny:** glassmorphism — subtelny efekt półprzezroczystej powierzchni, rozmytego tła i delikatnych obramowań, z zachowaniem czytelności.

Moduł powinien zawierać:
- datę przyjazdu;
- datę wyjazdu;
- liczbę gości;
- możliwość przejścia do wyboru pokoju lub sprawdzenia dostępnych opcji;
- wyraźny przycisk wyszukiwania.

Wymagania funkcjonalne:
- pola dat muszą pozwalać na wybór dat;
- data wyjazdu nie może być wcześniejsza niż data przyjazdu;
- liczba gości musi być możliwa do zmiany;
- formularz powinien reagować na nieprawidłowe dane;
- przycisk wyszukiwania musi wywoływać odpowiednią reakcję interfejsu.

Na tym etapie nie ma prawdziwego backendu ani połączenia z systemem rezerwacyjnym. Dostępność i ceny, jeśli będą prezentowane, muszą być wyraźnie traktowane jako demonstracyjne.

Nie wolno sugerować, że termin został rzeczywiście zarezerwowany.

### 5.4. Boczne menu wyboru pokoi

Jednym z ważniejszych elementów UX jest panel wysuwany z boku ekranu, umożliwiający przeglądanie dostępnych typów pokoi.

Panel powinien:
- otwierać się po wybraniu odpowiedniej opcji;
- prezentować listę przykładowych typów pokoi;
- zawierać zdjęcie każdego pokoju;
- wyświetlać nazwę i krótki opis;
- prezentować podstawowe informacje o wyposażeniu;
- umożliwiać wybór pokoju;
- zapewniać łatwe zamknięcie panelu;
- działać poprawnie na desktopie i urządzeniach mobilnych.

Po wyborze pokoju jego nazwa powinna zostać uwzględniona w interfejsie wyszukiwania.

Panel nie może zasłaniać całego interfejsu w niekontrolowany sposób. Powinien mieć odpowiednią hierarchię treści, przewijanie w razie potrzeby oraz dostępne przyciski zamykania.

Na urządzeniach mobilnych dopuszczalne jest dostosowanie panelu do formy wysuwanego pełnoekranowego widoku.

### 5.5. Sekcja prezentująca hotel

Po hero należy przedstawić hotel za pomocą starannie dobranej kompozycji tekstu i fotografii.

Sekcja powinna:
- przedstawiać charakter obiektu;
- zawierać nagłówek i krótki opis;
- wykorzystywać duże zdjęcia;
- mieć indywidualną kompozycję;
- zachować spójność z całą stroną.

Nie twórz fikcyjnych informacji o historii, lokalizacji ani standardzie obiektu. Jeśli nie otrzymałeś odpowiednich danych, użyj neutralnych treści demonstracyjnych lub placeholderów, które później zastąpimy.

### 5.6. Prezentacja pokoi

Homepage powinna zawierać wizualną prezentację przykładowych pokoi lub kategorii zakwaterowania.

Wymagania:
- duże zdjęcia;
- nazwy i krótkie opisy;
- podstawowe informacje o pokojach;
- możliwość przejścia do wyboru pokoju;
- spójna kompozycja, bez konieczności stosowania standardowych kart Bootstrapa.

Nie należy tworzyć osobnych podstron pokoi na tym etapie. Linki mogą prowadzić do odpowiednich sekcji lub otwierać panel boczny.

### 5.7. Udogodnienia i doświadczenia

Przygotuj sekcję przedstawiającą wybrane udogodnienia lub doświadczenia związane z pobytem.

Może zawierać zdjęcia i krótkie opisy, ale jej ostateczna kompozycja powinna wynikać z inspiracji oraz charakteru hotelu.

Nie dodawaj niepotwierdzonych informacji o restauracji, basenie, spa ani innych usługach jako faktów.

### 5.8. Galeria zdjęć

Strona powinna wykorzystywać fotografie jako istotny element narracji wizualnej.

Galeria powinna:
- zawierać zdjęcia o różnych proporcjach;
- być starannie skomponowana;
- wykorzystywać responsywny układ;
- zapewniać poprawne skalowanie obrazów;
- nie powodować poziomego przewijania;
- zachowywać wysoką jakość na dużych ekranach.

Dopuszczalne są subtelne interakcje po najechaniu kursorem. Nie stosuj efektów, które utrudniają oglądanie zdjęć.

### 5.9. Opinie gości

Homepage powinna zawierać sekcję opinii gości z odwołaniami do popularnych platform, takich jak Booking.com, Google lub Tripadvisor, zależnie od dostępności materiałów.

Wymagania:
- czytelna prezentacja opinii;
- nazwa źródła;
- możliwość przejścia do źródłowej platformy;
- spójność wizualna z projektem;
- responsywny układ.

**Nie wymyślaj prawdziwych recenzji, ocen, liczby opinii ani ocen platform.**

Jeśli nie dostarczono zweryfikowanych materiałów, przygotuj komponent demonstracyjny z wyraźnie oznaczonymi przykładowymi danymi. Nie przedstawiaj ich jako rzeczywistych opinii gości.

Linki zewnętrzne muszą prowadzić do właściwych stron hotelu lub odpowiednich profili, jeśli takie profile istnieją i zostały zweryfikowane.

### 5.10. Końcowe CTA i footer

W dolnej części strony umieść sekcję zachęcającą do sprawdzenia dostępności lub rozpoczęcia rezerwacji.

Stopka powinna zawierać:
- logo;
- podstawowe linki nawigacyjne;
- dostępne dane kontaktowe;
- odnośniki do odpowiednich profili zewnętrznych, jeśli istnieją;
- informacje prawne, jeśli zostaną dostarczone.

Nie wymyślaj adresu hotelu, numeru telefonu ani innych danych kontaktowych.

## 6. Animacje i mikrointerakcje

Strona powinna wykorzystywać subtelne animacje, które podnoszą jakość wizualną, a nie odwracają uwagę od treści.

Preferowane rozwiązania:
- łagodne pojawianie się elementów;
- delikatne przesunięcia tekstu;
- subtelne przejścia obrazów;
- animacje otwierania i zamykania panelu bocznego;
- płynne interakcje nawigacji;
- dyskretne reakcje przycisków.

Unikaj nadmiernego parallaxu, animacji ciągłych i efektów obciążających stronę.

Należy respektować ustawienie `prefers-reduced-motion`.

Animacje muszą działać poprawnie na urządzeniach mobilnych i nie mogą powodować przesuwania layoutu podczas ładowania.

## 7. Wymagania techniczne — zgodność z RWD_Projekt.md

Plik `RWD_Projekt.md` jest dokumentem nadrzędnym w zakresie wymagań prowadzącego, kryteriów oceny i etapów semestralnych.

### Technologie

- HTML5;
- CSS3;
- Bootstrap 5 przez CDN;
- JavaScript do interakcji;
- Git i GitHub do kontroli wersji.

Nie wprowadzaj Reacta, Tailwinda ani dodatkowych frameworków bez mojej zgody. Nie zastępuj wymaganego Bootstrapa własnym systemem layoutu.

### Bootstrap 5

Wykorzystuj:
- `container`;
- `row`;
- `col-*`;
- klasy Flexbox;
- responsywne klasy pomocnicze;
- `navbar-toggler`;
- komponenty Bootstrapa tam, gdzie są przydatne.

Co najmniej trzy typy komponentów Bootstrap muszą otrzymać własne klasy CSS istotnie modyfikujące ich domyślny wygląd.

Nie ograniczaj się do domyślnego wyglądu biblioteki.

Główne kontenery muszą skalować się responsywnie. Nie ustawiaj sztywnych szerokości w pikselach dla głównych obszarów układu.

### Mobile First

Strona musi być poprawna na szerokościach:
- 360–390 px;
- 768 px;
- 1200 px i więcej.

Wymagania:
- brak niekontrolowanego przewijania poziomego;
- poprawna responsywność zdjęć;
- prawidłowe działanie nawigacji mobilnej;
- czytelny formularz dostępności;
- prawidłowe działanie panelu bocznego;
- odpowiednie odstępy i rozmiary tekstów;
- minimalny obszar dotykowy elementów interaktywnych 44 × 44 px.

### Semantyka i dostępność

- semantyczne elementy HTML5;
- dokładnie jeden `h1` na stronie;
- poprawna hierarchia nagłówków;
- merytoryczne atrybuty `alt` obrazów;
- powiązane etykiety `label` i pola formularzy;
- dostępna obsługa klawiaturą;
- widoczne stany focus;
- czytelny kontrast;
- poprawne zachowanie panelu bocznego dla technologii asystujących.

W kodzie należy umieścić wymagany znacznik viewport.

### SEO

Dla strony głównej przygotuj:
- unikalny `title`;
- meta description;
- podstawowe metatagi Open Graph;
- semantyczne nagłówki;
- opisy alternatywne zdjęć;
- poprawne linki wewnętrzne;
- dane strukturalne Schema.org w JSON-LD, adekwatne do charakteru projektu.

Nie umieszczaj niezweryfikowanych danych hotelu w danych strukturalnych. Dane demonstracyjne należy wyraźnie odróżnić od informacji rzeczywistych.

### Jakość kodu

- czytelna struktura katalogów;
- logiczny podział HTML, CSS i JavaScript;
- brak niepotrzebnego powielania kodu;
- brak błędów w konsoli;
- brak nieobsługiwanych linków;
- prawidłowe ładowanie zasobów;
- instrukcja uruchomienia projektu w README.

## 8. Plan pracy etapami

### Etap 0 — analiza i przygotowanie

- przeanalizuj `wymagania.md`;
- przeczytaj `RWD_Projekt.md`;
- przeczytaj `design/references/inspiracje.md`;
- zapoznaj się z logo i dostępnymi screenshotami;
- wykorzystaj skill UI UX Pro Max, jeśli jest zainstalowany i dostępny;
- zaproponuj kierunek wizualny, strukturę projektu i plan implementacji;
- wskaż brakujące informacje.

Na tym etapie nie buduj całej strony. Poczekaj na moją akceptację planu.

### Etap 1 — szkielet i design system

Przygotuj podstawową strukturę projektu, zmienne CSS, typografię, konfigurację Bootstrapa i bazowe style.

Nie implementuj jeszcze wszystkich sekcji homepage.

Pokaż rezultat i poczekaj na akceptację.

### Etap 2 — header i hero

Zbuduj nagłówek, nawigację, wybór języka, główne zdjęcie, nagłówek strony i moduł dostępności w stylu glassmorphism.

To kluczowy etap wizualny. Zadbaj o szczegóły i responsywność.

Pokaż rezultat na desktopie i mobile. Nie przechodź dalej bez mojej akceptacji.

### Etap 3 — wyszukiwanie pobytu i panel pokoi

Dopracuj interakcje formularza, walidację dat i liczby gości oraz boczny panel wyboru pokoju z podglądami zdjęć.

Pokaż działające interakcje i poczekaj na akceptację.

### Etap 4 — pozostałe sekcje homepage

Dodaj prezentację hotelu, pokoje, udogodnienia, galerię, opinie, końcowe CTA i stopkę.

Dbaj o spójność kompozycji, fotografii, typografii i animacji.

### Etap 5 — responsywność, SEO i kontrola jakości

Przeprowadź testy przy wymaganych szerokościach. Sprawdź nawigację, formularze, dostępność, metadane, linki, konsolę i strukturę HTML.

Wykonaj audyt Lighthouse i popraw zidentyfikowane problemy.

### Etap 6 — akceptacja i commit

Po zakończeniu testów przedstaw mi rezultat do formalnej akceptacji.

Po akceptacji przygotuj czytelny commit na GitHubie opisujący wykonany etap.

Nie rozpoczynaj bloga, sklepu ani innych podstron bez mojej wyraźnej zgody i bez przeanalizowania kolejnych wytycznych prowadzącego.

## 9. Kryteria odbioru etapu 1

Strona główna zostanie zaakceptowana, jeśli:
- odpowiada ustalonemu kierunkowi wizualnemu;
- wykorzystuje prawidłowe logo, kolory i fonty;
- posiada dopracowany header i hero;
- moduł dostępności jest widoczny na pierwszym ekranie;
- panel wyboru pokoi działa zgodnie z zakresem demonstracyjnym;
- pozostałe zaplanowane sekcje są kompletne;
- animacje są subtelne i nie przeszkadzają w obsłudze;
- strona działa na desktopie, tablecie i telefonie;
- nie występuje poziome przewijanie;
- spełnia wymagania HTML5, Bootstrap 5 i podstawowego SEO;
- nie zawiera istotnych błędów w konsoli;
- została przeze mnie sprawdzona i zaakceptowana.

**Zasada końcowa:** Najważniejsza jest jakość wykonania, spójność z briefem i kontrola nad każdym etapem. Nie twórz kolejnych elementów na zapas. Najpierw zaprojektuj, zaimplementuj i dopracuj dokładnie to, co zostało zaakceptowane.