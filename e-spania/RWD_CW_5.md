# Responsive Web Design Ćwiczenia 5: Moduł sklepu

**Struktura plików:** `index.html` (aktualizacja), `sklep.html` (nowy), `produkt.html` (nowy), `koszyk.html` (nowy), `zamowienie.html` (nowy), `konto.html` (nowy), `style.css` (aktualizacja)

---

## 1. Cel Zadania

Celem trzeciego etapu jest rozbudowa serwisu o kompletny, statyczny moduł e-commerce, zgodny z profilem działalności określonym w Karcie Projektu.

Zadanie obejmuje utworzenie pełnej ścieżki użytkownika (User Journey): od przeglądania katalogu produktów, przez widok szczegółów oferty, koszyk i proces kasy (checkout), aż po panel klienta. Wszystkie widoki łączone są statycznymi odnośnikami HTML (`<a>`), symulującymi przepływ procesów w sklepie internetowym.

Do integracji ikon interfejsu (koszyk, konto użytkownika, wyszukiwarka) należy wykorzystać oficjalną bibliotekę **Bootstrap Icons** (dołączaną przez CDN w sekcji `<head>`).

---

## 2. Wymagana Zawartość Merytoryczna i Struktura

### A. Modyfikacja Strony Głównej (`index.html`) oraz Globalnego Menu

We wszystkich istniejących i nowo tworzonych plikach HTML należy zaktualizować komponent paska nawigacyjnego (`<nav>`):

1. **Ikony Funkcyjne w Menu:**
    * Dodanie odnośnika do katalogu produktów (`sklep.html`) w głównym spisie linków.
    * Dodanie po prawej stronie paska nawigacyjnego dwóch ikon akcji:
    * Ikona konta użytkownika prowadząca do `konto.html`.
    * Ikona koszyka zakupowego prowadząca do `koszyk.html`, zaopatrzona w licznik produktów w formie komponentu `badge` (np. statyczna cyfra „2”).




2. **Sekcja Produktowa na Stronie Głównej (`<section id="sklep">`):**
    * Sekcja prezentująca ofertę sklepową (np. „Bestsellery” lub „Wyróżnione produkty”).
    * Zestawienie 3–4 kart produktowych (zdjęcie, nazwa, cena, ocena w gwiazdkach, przycisk CTA prowadzący do `produkt.html`).
    * Przycisk kierujący do pełnego katalogu (`sklep.html`).



---

### B. Strona Katalogu / Kategorii z Filtrami (`sklep.html`)

Podstrona prezentująca asortyment podmiotu:

1. **Nawigacja Okruszkowa (`breadcrumb`):** Ścieżka powrotna: Strona Główna $\rightarrow$ Sklep.
2. **Układ Główny Dwukolumnowy (`<aside>` + `<main>`):**
    * **Panel Filtrów Bocznych (`<aside>`):**
        * Filtry kategorii (zestaw pól typu `checkbox`).
        * Zakres cenowy (komponent suwaka `<input type="range">` lub dwa pola min/max).
        * Opcje dostępności / cech asortymentu (np. kolor, rozmiar, format, wariant).
        * Przycisk resetowania filtrów.


    * **Obszar Prezentacji Produktów (`<main>`):**
        * Górny pasek narzędziowy: informacja o liczbie znalezionych pozycji oraz lista wyboru sortowania (`<select>`: po cenie, popularności, nazwie).
        * Siatka produktów (minimum 6 pozycji w układzie kafelkowym).
        * Karta produktu zawiera: miniaturę, etykietę promocyjną (`badge`), tytuł (`<h3>`), cenę (w tym przekreśloną cenę regularną przy promocji) oraz przycisk „Zobacz szczegóły” prowadzący do `produkt.html`.
        * Statyczna paginacja na dole strony.





---

### C. Karta Szczegółów Produktu (`produkt.html`)

Szablon prezentacji pojedynczej pozycji asortymentowej:

1. **Układ Prezentacji Głównej (2 kolumny):**
    * **Kolumna Wizualna:** Duże zdjęcie główne produktu oraz rząd 3 miniaturek pod spodem (symulacja galerii).
    * **Kolumna Zakupowa:**
        * Tytuł produktu (`<h1>`) oraz oznaczenie kodu/kategorii.
        * Ocena w gwiazdkach wraz z liczbą opinii.
        * Wyrazista ekspozycja ceny oraz statusu dostępności (np. „W magazynie”).
        * Krótki opis wprowadzający.
        * Formularz wyboru wariantu: pole wyboru cechy (np. rozmiar/kolor) oraz selektor liczby sztuk (`<input type="number" value="1">`).
        * Główny przycisk akcji: „Dodaj do koszyka” (statyczny odnośnik prowadzący do `koszyk.html`).




2. **Sekcja Kart Informacyjnych (Bootstrap Tabs / Accordion):**
    * Przełączane panele z dodatkowymi informacjami: „Pełny opis”, „Specyfikacja techniczna / Parametry”, „Opinie klientów”.


3. **Sekcja Rekomendacji:**
    * Karuzela lub siatka 3–4 powiązanych produktów („Mogą Cię również zainteresować”).



---

### D. Widok Koszyka Zakupowego (`koszyk.html`)

Makieta podsumowania zawartości koszyka:

1. **Tabela Produktów w Koszyku:**
    * Tabela osadzona w klasie responsywnej (`table-responsive`), prezentująca minimum 2 dodane pozycje.


    * Kolumny: Produkt (miniatura + nazwa), Cena jednostkowa, Ilość (pole edycyjne), Wartość łączna, Akcja (ikona kosza na śmieci `bi bi-trash` do usunięcia pozycji).


2. **Strefa Kodów Rabatowych:**
    * Pole wprowadzania kodu promocyjnego z przyciskiem aktywującym.


3. **Karta Podsumowania Zamówienia:**
    * Zestawienie kosztów: suma częściowa, szacowany koszt dostawy, łączna kwota brutto.
    * Przycisk CTA: „Przejdź do kasy” prowadzący do `zamowienie.html`.



---

### E. Ścieżka Kasy i Płatności (`zamowienie.html`)

Formularz realizacji zamówienia:

1. **Układ Kasy:**
    * **Kolumna Formularza Danych:**
        * Sekcja danych bilingowych i adresu dostawy (imię, nazwisko, ulica, kod pocztowy, miasto, telefon, e-mail).
        * Sekcja wyboru metody dostawy (pola `radio`: Kurier, Paczkomat, Odbiór osobisty).
        * Sekcja wyboru metody płatności (pola `radio`: BLIK, Karta płatnicza, Szybki przelew).
        * Opcjonalny checkbox: „Chcę otrzymać fakturę na firmę” (odsłaniający pola NIP i Nazwa firmy).
        * Wymagane checkboxy akceptacji regulaminu.


    * **Kolumna Skróconego Podsumowania Zamówienia:**
        * Skrócona lista zakupów, naliczony koszt wybranej dostawy, kwota całkowita.
        * Główny przycisk finalizacji zakupu: „Kupuję i płacę” (prowadzący z powrotem do `konto.html` z symulacją komunikatu sukcesu lub do strony głównej).





---

### F. Panel / Konto Użytkownika (`konto.html`)

Centrum zarządzania kontem klienta:

1. **Układ Panelu:**
    * **Boczne Menu Nawigacyjne Klienta (`nav-pills` lub `list-group`):**
        * Odnośniki sekcji: „Pulpit”, „Moje zamówienia”, „Adresy dostawy”, „Ustawienia konta”, „Wyloguj”.


    * **Główny Obszar Panelu:**
        * Powitanie użytkownika i syntetyczne podsumowanie statusu konta.
        * Tabela historii zamówień (numer zamówienia, data, kwota, status: „W realizacji”, „Wysłane”, odnośnik „Szczegóły”).
        * Sekcja zapisanego domyślnego adresu wysyłki z możliwością edycji.





---

## 3. Organizacja Kodu CSS

Wszelkie niestandardowe reguły wizualne podlegają centralizacji:

1. **Wspólny arkusz stylów (`style.css`):**
* Wszystkie nowo utworzone pliki HTML muszą być podpięte pod istniejący plik `style.css`.
* Reguły dedykowane dla e-commerce (np. wymiary miniaturek w koszyku, układ sticky dla podsumowania zamówienia, stylizacja badge'a przy ikonie koszyka) należy dopisać do pliku `style.css` w wydzielonym bloku opatrzonym komentarzem `/* MODUŁ E-COMMERCE */`.


2. **Dopuszczalność stylów liniowych (inline styles):**
* Wyłącznie dla parametrów zmiennych lub precyzyjnych wartości unikalnych (np. szerokość paska postępu realizacji zamówienia). Pozostałe formatowania muszą bazować na klasach Bootstrapa lub deklaracjach w pliku `style.css`.