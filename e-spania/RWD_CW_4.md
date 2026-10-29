# Responsive Web Design Ćwiczenia 4: – Moduł Bloga

**Struktura plików:** `index.html` (aktualizacja), `blog.html` (nowy), `single.html` (nowy), `style.css` (aktualizacja)

---

## 1. Cel Zadania

Celem drugiego etapu jest rozbudowa serwisu o pełny moduł publikacyjny (blog / aktualności / baza wiedzy), spójny tematycznie z podmiotem zdefiniowanym w Karcie Projektu.

Prace obejmują wdrożenie strony zestawienia wpisów (`blog.html`), szablonu artykułu szczegółowego (`single.html`) oraz integrację zajawki najnowszych wpisów na istniejącej stronie głównej (`index.html`).

---

## 2. Wymagana Zawartość Merytoryczna i Struktura

### A. Modyfikacja Strony Głównej (`index.html`)

W istniejącym dokumencie należy wprowadzić następujące zmiany:

1. **Pasek Nawigacyjny (`<nav>`):** Dodanie w menu odnośnika prowadzącego bezpośrednio do strony archiwum (`blog.html`).
2. **Nowa Sekcja „Aktualności / Blog” (`<section id="blog">`):**
    * Sekcja umieszczona pomiędzy prezentacją oferty a formularzem kontaktowym.
    * Nagłówek sekcji (`<h2>`) z krótkim wprowadzeniem.
    * Zestawienie 3 kart zajawkowych najnowszych wpisów (miniatura, data, kategoria, tytuł, 2-zdaniowy lead, odnośnik „Czytaj dalej”).
    * Przycisk CTA kierujący do pełnego archiwum wpisów (`blog.html`).



---

### B. Strona Archiwum Wpisów (`blog.html`)

Dedykowana podstrona prezentująca listę wszystkich publikacji:

1. **Pasek Nawigacyjny oraz Stopka:** Komponenty identyczne pod względem układu i stylu jak w pliku `index.html`.
2. **Nagłówek Podstrony (Page Header):** Tytuł sekcji blogowej (`<h1>`) oraz krótki opis tematyczny publikacji.
3. **Układ Główny Dwukolumnowy (`<main>` + `<aside>`):**
    * **Kolumna Treści Głównej (`<main>`):**
        * Siatka kart wpisów (minimum 6 pozycji ułożonych w responsywnym gridzie).
        * Każda karta artykułu zawiera: grafikę tytułową, tag kategorii, datę, tytuł (`<h3>`), zajawkę tekstową oraz odnośnik prowadzący do pliku `single.html`.
        * Statyczny komponent paginacji Bootstrapa (`pagination`) na dole zestawienia (np. przejście pomiędzy stronami 1, 2, 3).


    * **Pasek Boczny (`<aside>`):**
        * Wyszukiwarka tekstowa (pole input z przyciskiem lupy).
        * Lista kategorii tematycznych z licznikiem artykułów w formie komponentu `badge`.
        * Blok „Polecane artykuły” (miniatury z odnośnikami).





---

### C. Szablon Pojedynczego Wpisu (`single.html`)

Podstrona dedykowana prezentacji pełnej treści artykułu:

1. **Nawigacja Okruszkowa (`<nav aria-label="breadcrumb">`):** Ścieżka powrotna: Strona Główna $\rightarrow$ Blog $\rightarrow$ Tytuł bieżącego wpisu.
2. **Struktura Artykułu (`<article>`):**
    * Nagłówek artykułu (`<h1>`).
    * Pasek metadanych wpisu: data publikacji, nazwisko autora, szacowany czas czytania, kategoria.
    * Wiodąca grafika artykułu o pełnej szerokości kolumny treści.
    * Właściwa treść artykułu zawierająca:
        * Wyróżniony lead (paragraf o powiększonej typografii),
        * Śródtytuły (`<h2>`, `<h3>`),
        * Cytat blokowy (`<blockquote class="blockquote">`),
        * Śródtekstową tabelę danych tematycznych lub wypunktowanie,
        * Responsywny element wideo (osadzony komponent embed) lub drugą grafikę z podpisem (`<figure>`, `<figcaption>`).




3. **Stopka Artykułu:**
    * Tagi tematyczne artykułu (zestaw odnośników w formie etykiet).
    * Blok biogramu autora (avatar, imię i nazwisko, krótka notka biograficzna).
    * Przyciski udostępniania w mediach społecznościowych.


4. **Nawigacja Relacyjna i Komentarze:**
    * Odnośniki do poprzedniego oraz następnego artykułu.
    * Statyczna sekcja komentarzy: formularz dodawania opinii oraz makieta minimum 2 opublikowanych wcześniej wypowiedzi.



---

## 3. Organizacja Kodu CSS

Wszelkie reguły stylistyczne wykraczające poza standardowe klasy frameworka Bootstrap 5 podlegają następującym zasadom:

1. **Wspólny arkusz stylów (`style.css`):**
* Wszystkie podstrony (`index.html`, `blog.html`, `single.html`) muszą korzystać z tego samego pliku `style.css`.
* Klasy specyficzne dla modułu bloga (np. stylizacja boksu autora, modyfikacja wyglądu paginacji, dopasowanie proporcji miniatur) należy dopisać do pliku `style.css` w wydzielonej, opatrzonej komentarzem sekcji.


2. **Dopuszczalność stylów liniowych (inline styles):**
* Stosowanie atrybutu `style="..."` w plikach HTML dopuszczalne jest wyłącznie dla parametrów zmiennych lub unikalnych dla pojedynczego węzła (np. dynamicznie przypisywany obraz tła w nagłówku artykułu). Złożone reguły formatowania muszą znajdować się w pliku `style.css`.