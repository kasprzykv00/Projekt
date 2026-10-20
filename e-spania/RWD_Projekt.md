# Projekt Semestralny: Responsywny Serwis WWW

**Forma realizacji:** Praca w parach lub grupach 3-osobowych

**Technologia bazowa:** HTML5, CSS3, Bootstrap 5 (wersja CDN)

**Karta projektu w forms**: https://forms.cloud.microsoft/e/XWUxML5L0t

---

## 1. Założenia Ogólne i Metodyka Pracy

Celem zadania semestralnego jest zaprojektowanie oraz wdrożenie funkcjonalnego serwisu internetowego dla fikcyjnego lub prawdziwego podmiotu (przedsiębiorstwa, instytucji kultury, organizacji pozarządowej lub inicjatywy społecznej).

Prace nad projektem prowadzone są w **modelu przyrostowym**. Oznacza to sukcesywną rozbudowę bazy kodu podczas kolejnych ćwiczeń, zgodnie z harmonogramem:

1. **Etap 1 (Inicjalizacja):** Strona wizytówka
2. **Etap 2 (Moduł informacyjny):** Blog firmowy
3. **Etap 3 (Moduł sprzedażowy):** Sklep internetowy
4. **Etap 4 (Domknięcie Architektury Serwisu):** Brakujące podstrony
5. **Etap 5 (Optymalizacja i Ocena Końcowa):** Przeprowadzenie audytu w środowisku DevTools (Lighthouse), eliminacja zidentyfikowanych błędów dostępności (a11y) i responsywności oraz formalny odbiór projektu w sali laboratoryjnej.



Szczegółowe wytyczne techniczne oraz funkcjonalne dla poszczególnych podstron będą przekazywane **sukcesywnie na początku każdych zajęć**.

---

## 2. Standardy Jakościowe i Wymagania Techniczne

Każdy komponent oraz podstrona wchodząca w skład serwisu musi spełniać poniższe kryteria techniczne:

* **Siatka i komponenty biblioteki Bootstrap 5:**
    * Konstrukcja układu w oparciu o kontenery, wiersze i kolumny frameworka (`container`, `row`, `col-*`) oraz klasy pomocnicze Flexbox (`d-flex`, `justify-content-*`, `align-items-*`).

    * Wykorzystanie natywnego skalowania Bootstrapa opartego na jednostkach `rem` oraz wartościach relatywnych (zakaz wprowadzania sztywnych szerokości w pikselach dla głównych kontenerów układu).
* **Własny kod CSS:**
    * Kluczowe komponenty Bootstrapa powinny posiadać dedykowane klasy CSS nadpisujące ich domyślny bootstrapowy wygląd - należy wystylować w ten sposób minimum 3 użyte typy komponentów


* **Responsywność i Punkty Przełamania (Mobile First):**
    * Obecność wymaganego znacznika w nagłówku: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.

    * Prawidłowe zachowanie interfejsu na trzech obligatoryjnych szerokościach testowych w DevTools: **360–390 px** (smartfon), **768 px** (tablet) oraz **1200+ px** (desktop).


    * Bezwzględny brak niekontrolowanego przewijania poziomego (`overflow-x`).
    * Implementacja zwijanego menu nawigacyjnego dla widoków wąskoekranowych (`navbar-toggler`).


* **Semantyka HTML5 oraz Dostępność Cyfrowa (WCAG / a11y):**
    * Zastosowanie semantycznych elementów strukturalnych (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
    * Prawidłowa hierarchia nagłówków (dokładnie jeden znacznik `<h1>` na podstronę, zachowanie relacji `<h2>`–`<h3>`).
    * Obowiązkowa obecność merytorycznych atrybutów `alt` dla wszystkich znaczników graficznych `<img>`.
    * Powiązanie etykiet `<label>` z polami formularzy poprzez atrybuty `for` oraz `id`.
    * Zapewnienie minimalnego obszaru dotykowego dla elementów klikalnych na ekranach dotykowych ($44 \times 44\text{ px}$).


* **Optymalizacja dla Wyszukiwarek (SEO) i Metadane:**
    * Unikalne znaczniki `<title>` oraz `<meta name="description">` zdefiniowane dla każdego pliku HTML.
    * Zestaw podstawowych metatagów Open Graph (`og:title`, `og:description`, `og:image`).
    * Implementacja poprawnych składniowo danych strukturalnych **Schema.org w formacie JSON-LD**, adekwatnych do charakteru danej podstrony (`Organization` / `LocalBusiness`, `Article`, `Product`).


---

## 3. Formularz Karty Projektu (Brief Projektowy)

Dokument stanowi formalną deklarację założeń realizacyjnych i podlega rozliczeniu podczas końcowego odbioru prac laboratoryjnych.

**Rozliczenie kolejnych etapów odbywa się poprzez dodanie commita do wskazanego w karcie repozytorium na githubie**

---

### KARTA PROJEKTU: RESPONSIVE WEB DESIGN

#### 1. Skład Zespołu Projektowego

* **Imiona i nazwiska autorów:**
* **Robocza nazwa serwisu / marki:**

#### 2. Profil Działalności i Kontekst Użytkowy

* **Charakter podmiotu:** *(Komercyjny / Instytucja publiczna / Organizacja pozarządowa / Inicjatywa społeczna)*
* **Zakres działalności podmiotu (2–3 zdania):**
* **Profil grupy docelowej oraz dominujące urządzenia dostępowe:**
* **Główny cel konwersji serwisu:** *(np. sprzedaż produktu, pozyskanie leadu kontaktowego, subskrypcja, rezerwacja)*

#### 3. Wytyczne Identyfikacji Wizualnej (Style Guide)

* **Zestawienie barw (kody HEX):**
    * Kolor wiodący (Primary): `#______`
    * Kolor pomocniczy (Secondary): `#______`
    * Kolor akcentu / CTA: `#______`
    * Tekst podstawowy (Text): `#______`


* **Dobór krojów pism (Google Fonts lub typografia natywna frameworka):**
    * Krój nagłówków (`<h1>`–`<h3>`): `...`
    * Krój tekstu podstawowego: `...`

---

## 4. Kryteria Oceny i Skala Punktowa

Projekt końcowy stanowi kluczowy element oceny efektów kształcenia w ramach modułu laboratoryjnego **(łączna pula:100 punktów z wagą 70%)**.

| Obszar weryfikacji | Zakres kryteriów | Maksymalna liczba punktów |
| --- | --- | --- |
| **Zgodność z Kartą Projektu** | Zachowanie zadeklarowanej identyfikacji wizualnej (kolorystyka, typografia), spójność tematyczna oraz kompletność przewidzianych w briefie sekcji i modułów. | **20 pkt** |
| **Własne ulepszenia CSS/JS** | Dodanie klas CSS, które istotnie zmieniają wygląd domyślny wygląd komponentów Boostrapa | **10 pkt** |
| **Poprawność RWD i implementacja Bootstrap 5**<br> | Prawidłowe zastosowanie systemu siatki (`container`, `row`, `col-*`); brak poziomego paska przewijania na szerokościach 360 px, 768 px oraz 1200 px; prawidłowe funkcjonowanie responsywnego menu nawigacyjnego; elastyczność multimediów i tabel.| **40 pkt** |
| **Semantyka HTML5 i standardy Dostępności (a11y)**<br> | Poprawne użycie znaczników strukturalnych; hierarchia nagłówków; kompletność opisów alternatywnych w grafice; prawidłowa konstrukcja formularzy (`label` – `input`); zachowanie minimalnych wymiarów elementów dotykowych. | **10 pkt** |
| **Optymalizacja SEO i Dane Strukturalne** | Kompletność metadanych technicznych i opisowych; poprawne wdrożenie oraz bezbłędna walidacja bloków JSON-LD Schema.org adekwatnych do zawartości podstron. | **10 pkt** |
| **Architektura Informacji i Integralność Serwisu**<br> | Poprawność działania powiązań hipertekstowych pomiędzy wszystkimi podstronami serwisu; brak nieobsługiwanych odnośników w obrębie nawigacji i stopki. | **10 pkt** |
| **ŁĄCZNIE** |  | **100 pkt**<br> |