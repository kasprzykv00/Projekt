/* =========================================================
   e-spania — interakcje (strona główna i blog)
   Bez frameworków: czysty JavaScript + komponenty Bootstrap 5.
   Rezerwacja jest demonstracyjna — nic nie jest wysyłane.
   ========================================================= */
(() => {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reduceMotion.matches ? 'auto' : 'smooth');

  /* ---------- Pomocnicze: polska odmiana i daty ---------- */

  // plural(5, ['noc', 'noce', 'nocy']) -> "nocy"
  function plural(n, [one, few, many]) {
    if (n === 1) return one;
    const lastDigit = n % 10;
    const lastTwo = n % 100;
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
    return many;
  }

  // Data w formacie RRRR-MM-DD w lokalnej strefie czasowej (bez przesunięć UTC)
  function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function fromISO(value) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function addDays(value, days) {
    const date = fromISO(value);
    date.setDate(date.getDate() + days);
    return toISO(date);
  }

  function nightsBetween(start, end) {
    return Math.round((fromISO(end) - fromISO(start)) / 86400000);
  }

  const dateFormat = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short' });
  const formatRange = (start, end) => `${dateFormat.format(fromISO(start))} – ${dateFormat.format(fromISO(end))}`;

  /* ---------- Pomocnicze: przewijanie i dropdowny ---------- */

  // Wywołuje fn przy przewijaniu, najwyżej raz na klatkę animacji
  function onScrollFrame(fn) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
    }, { passive: true });
  }

  // Zamyka dropdown (kalendarz, goście) i oddaje fokus przyciskowi, który go otworzył
  function closeDropdown(toggle) {
    bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
    toggle.focus();
  }

  /* ---------- Powiadomienia (Bootstrap Toast) ---------- */
  const toastEl = qs('#appToast');
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 7000 });

  function notify(title, text) {
    qs('#appToastTitle').textContent = title;
    qs('#appToastText').textContent = text;
    toast.show();
  }

  /* ---------- Nagłówek i menu ---------- */
  const header = qs('.site-header');
  const menuEl = qs('#siteMenu');
  const menu = bootstrap.Offcanvas.getOrCreateInstance(menuEl);

  // Na telefonie najpierw zamyka menu, a dopiero potem wykonuje akcję (przewinięcie, fokus)
  function afterMenuClosed(action) {
    if (!menuEl.classList.contains('show')) {
      action();
      return;
    }
    menuEl.addEventListener('hidden.bs.offcanvas', action, { once: true });
    menu.hide();
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  function initHeader() {
    const progress = qs('.scroll-progress');
    let lastY = window.scrollY;

    // Nagłówek: tło po zjechaniu z hero, chowanie przy przewijaniu w dół, pasek postępu
    function update() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const somethingOpen = menuEl.classList.contains('show') || qs('.dropdown-menu.show', header);
      header.classList.toggle('is-scrolled', y > 24);
      header.classList.toggle('is-hidden', !somethingOpen && y > window.innerHeight * 0.6 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove('is-hidden');
      progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
      lastY = y;
    }

    update();
    onScrollFrame(update);

    // Fokus klawiatury w nagłówku zawsze go pokazuje
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

    // Logo i „Do góry”: na stronie głównej płynnie przewijamy na samą górę
    qsa('[data-action="scroll-top"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        afterMenuClosed(scrollToTop);
      });
    });

    // Link w otwartym menu mobilnym: przewijamy dopiero po zamknięciu panelu
    // (na desktopie menu nie jest panelem — działa zwykły link #sekcja).
    // Linki do innej podstrony (np. blog.html, index.html#hotel) działają zwyczajnie.
    qsa('.site-menu__link', menuEl).forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = link.pathname === window.location.pathname && link.hash ? qs(link.hash) : null;
        if (!menuEl.classList.contains('show') || !target) return;
        event.preventDefault();
        afterMenuClosed(() => {
          target.scrollIntoView({ behavior: scrollBehavior() });
          history.pushState(null, '', link.hash);
        });
      });
    });
  }

  /* ---------- Wybór języka (wersja demonstracyjna) ---------- */
  function initLanguage() {
    qsa('.lang-switch__item').forEach((item) => {
      item.addEventListener('click', () => {
        if (item.dataset.lang === 'pl') return;
        const name = item.textContent.trim();
        notify(`${name} — wkrótce`, 'Ta wersja językowa zostanie dodana w kolejnym etapie. Strona pozostaje w języku polskim.');
      });
    });
  }

  /* ---------- Film w tle hero ---------- */
  function initHeroVideo() {
    const hero = qs('.hero');
    const video = qs('#heroVideo');
    const toggle = qs('#heroVideoToggle');
    const portrait = window.matchMedia('(max-aspect-ratio: 4/5)');
    const saveData = navigator.connection && navigator.connection.saveData;

    // Film startuje od razu (decyzja projektowa, także przy ograniczeniu ruchu) — przycisk pozwala go zatrzymać.
    // Wyjątek: tryb oszczędzania danych — wtedy zostaje zdjęcie, a film można włączyć przyciskiem.
    let pausedByUser = Boolean(saveData);

    const play = () => {
      const attempt = video.play();
      if (attempt) attempt.catch(() => { /* autoodtwarzanie zablokowane — zostaje zdjęcie */ });
    };

    function load() {
      const src = portrait.matches ? video.dataset.srcPortrait : video.dataset.srcLandscape;
      if (video.getAttribute('src') === src) return;
      hero.classList.remove('is-video-playing');
      video.src = src;
      video.load();
      if (!pausedByUser) play();
    }

    video.addEventListener('playing', () => hero.classList.add('is-video-playing'));
    toggle.hidden = false;
    toggle.setAttribute('aria-pressed', String(pausedByUser));

    toggle.addEventListener('click', () => {
      pausedByUser = !pausedByUser;
      if (pausedByUser) {
        video.pause();
      } else if (!video.getAttribute('src')) {
        load();
      } else {
        play();
      }
      toggle.setAttribute('aria-pressed', String(pausedByUser));
    });

    // Film nie gra, gdy hero jest poza ekranem (oszczędza baterię i procesor)
    new IntersectionObserver(([entry]) => {
      if (!video.getAttribute('src')) return;
      if (entry.isIntersecting && !pausedByUser) play();
      else video.pause();
    }).observe(hero);

    portrait.addEventListener('change', () => {
      if (video.getAttribute('src')) load();
    });
    if (pausedByUser) return;
    // Film ładujemy dopiero po załadowaniu strony, żeby nie spowalniał pierwszego wyświetlenia
    if (document.readyState === 'complete') load();
    else window.addEventListener('load', load, { once: true });
  }

  /* ---------- Formularz dostępności (tylko strona główna) ---------- */
  const form = qs('#rezerwacja');
  const arrival = qs('#arrival');
  const departure = qs('#departure');
  const datesToggle = qs('#datesToggle');
  const adults = qs('#adults');
  const children = qs('#children');
  const roomInput = qs('#roomInput');
  const roomTrigger = qs('#roomTrigger');
  const status = qs('#bookingStatus');
  const defaultStatus = status ? status.textContent : '';
  const MAX_NIGHTS = 30;

  const rooms = new Map(); // id -> dane pokoju (wypełniane w initRoomPanel)

  const guestsTotal = () => Number(adults.value) + Number(children.value);

  function setError(control, message) {
    const field = control.closest('.booking__field');
    const error = qs('.booking__error', field);
    field.classList.toggle('is-invalid', Boolean(message));
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message;
    form.classList.toggle('has-errors', Boolean(qs('.booking__field.is-invalid', form)));
  }

  function hasValidDates() {
    const today = toISO(new Date());
    return Boolean(arrival.value && departure.value && arrival.value >= today && departure.value > arrival.value
      && nightsBetween(arrival.value, departure.value) <= MAX_NIGHTS);
  }

  function validateDates() {
    if (!arrival.value) return setError(datesToggle, 'Wybierz datę przyjazdu i wyjazdu.'), false;
    if (!departure.value) return setError(datesToggle, 'Wybierz jeszcze datę wyjazdu.'), false;
    if (!hasValidDates()) return setError(datesToggle, 'Sprawdź daty — wyjazd musi być po przyjeździe.'), false;
    setError(datesToggle, '');
    return true;
  }

  function validateRoom() {
    const room = rooms.get(roomInput.value);
    if (room && guestsTotal() > room.capacity) {
      setError(roomTrigger, `${room.name} mieści maks. ${room.capacity} ${plural(room.capacity, ['gościa', 'gości', 'gości'])}.`);
      return false;
    }
    setError(roomTrigger, '');
    return true;
  }

  // Krótki opis wybranego pobytu, np. "12 lis – 15 lis · 3 noce · 2 gości"
  function stayDescription() {
    const parts = [];
    if (hasValidDates()) {
      const nights = nightsBetween(arrival.value, departure.value);
      parts.push(formatRange(arrival.value, departure.value), `${nights} ${plural(nights, ['noc', 'noce', 'nocy'])}`);
    }
    const total = guestsTotal();
    parts.push(`${total} ${plural(total, ['gość', 'gości', 'gości'])}`);
    return parts.join(' · ');
  }

  function updateStatus() {
    status.textContent = hasValidDates() ? `${stayDescription()} — wersja demonstracyjna` : defaultStatus;
  }

  function updateGuests() {
    const a = Number(adults.value);
    const c = Number(children.value);
    // Krótki opis mieści się w polu także na telefonie; szczegóły są w rozwijanym okienku
    const total = a + c;
    qs('#guestsSummary').textContent = c > 0
      ? `${total} ${plural(total, ['gość', 'gości', 'gości'])}`
      : `${a} ${plural(a, ['dorosły', 'dorosłych', 'dorosłych'])}`;

    qsa('.stepper__btn').forEach((btn) => {
      const input = qs(`#${btn.dataset.target}`);
      const step = Number(btn.dataset.step);
      btn.disabled = step < 0 ? Number(input.value) <= Number(input.min) : Number(input.value) >= Number(input.max);
    });

    if (roomInput.value) validateRoom();
    updateStatus();
  }

  function clampInput(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Math.round(Number(input.value));
    input.value = Number.isNaN(value) ? min : Math.min(max, Math.max(min, value));
  }

  function setRoom(id) {
    const room = rooms.get(id);
    roomInput.value = room ? id : '';
    qs('#roomSummary').textContent = room ? room.name : 'Dowolny pokój';
    validateRoom();
  }

  function focusBooking() {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    datesToggle.focus({ preventScroll: true });
  }

  /* ---------- Kalendarz zakresu dat (okienko nad paskiem) ---------- */
  const calendar = {
    el: qs('#calendar'),
    months: qs('#calendarMonths'),
    hint: qs('#calendarHint'),
    view: null,     // pierwszy dzień pierwszego wyświetlanego miesiąca
    focus: null,    // data (ISO) przycisku, który ma fokus klawiatury
    hover: null,    // data pod kursorem — podgląd zakresu przed wybraniem wyjazdu
  };
  const twoMonths = window.matchMedia('(min-width: 768px)');
  const monthTitle = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' });
  const dayLabel = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const WEEKDAYS = [['Pn', 'poniedziałek'], ['Wt', 'wtorek'], ['Śr', 'środa'], ['Cz', 'czwartek'], ['Pt', 'piątek'], ['So', 'sobota'], ['Nd', 'niedziela']];

  const firstOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const lastBookable = () => addDays(toISO(new Date()), 365);

  function renderMonth(start) {
    const today = toISO(new Date());
    const last = lastBookable();
    const offset = (start.getDay() + 6) % 7; // tydzień zaczyna się w poniedziałek
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const end = departure.value || (arrival.value && calendar.hover > arrival.value ? calendar.hover : '');

    let cells = '';
    for (let i = 0; i < offset; i += 1) cells += '<td></td>';
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(start.getFullYear(), start.getMonth(), day);
      const iso = toISO(date);
      const classes = ['calendar__day'];
      if (iso === today) classes.push('is-today');
      if (iso === arrival.value) classes.push('is-start');
      if (iso === departure.value) classes.push('is-end');
      if (arrival.value && end && iso > arrival.value && iso < end) classes.push('in-range');
      const disabled = iso < today || iso > last;
      const selected = iso === arrival.value || iso === departure.value;
      cells += `<td><button type="button" class="${classes.join(' ')}" data-date="${iso}" tabindex="${iso === calendar.focus ? 0 : -1}"`
        + ` aria-label="${dayLabel.format(date)}" aria-pressed="${selected}"${disabled ? ' disabled' : ''}>${day}</button></td>`;
      if ((offset + day) % 7 === 0 && day < daysInMonth) cells += '</tr><tr>';
    }

    const head = WEEKDAYS.map(([short, full]) => `<th scope="col"><abbr title="${full}">${short}</abbr></th>`).join('');
    return `<div class="calendar__month">
        <p class="calendar__title">${monthTitle.format(start)}</p>
        <table class="calendar__grid"><thead><tr>${head}</tr></thead><tbody><tr>${cells}</tr></tbody></table>
      </div>`;
  }

  function renderCalendar() {
    const count = twoMonths.matches ? 2 : 1;
    let html = '';
    for (let i = 0; i < count; i += 1) {
      html += renderMonth(new Date(calendar.view.getFullYear(), calendar.view.getMonth() + i, 1));
    }
    calendar.months.innerHTML = html;
    qs('[data-cal-step="-1"]', calendar.el).disabled = calendar.view <= firstOfMonth(new Date());
  }

  function updateHint() {
    if (!arrival.value) calendar.hint.textContent = 'Wybierz datę przyjazdu';
    else if (!departure.value) calendar.hint.textContent = 'Teraz wybierz datę wyjazdu';
    else {
      const nights = nightsBetween(arrival.value, departure.value);
      calendar.hint.textContent = `${formatRange(arrival.value, departure.value)} · ${nights} ${plural(nights, ['noc', 'noce', 'nocy'])}`;
    }
  }

  function updateDatesSummary() {
    qs('#datesSummary').textContent = arrival.value && departure.value
      ? formatRange(arrival.value, departure.value)
      : arrival.value ? `${dateFormat.format(fromISO(arrival.value))} – …` : 'Przyjazd / Wyjazd';
  }

  // Przesuwa widok tak, by wskazana data była widoczna, i ustawia na niej fokus
  function focusDay(iso) {
    const today = toISO(new Date());
    const clamped = iso < today ? today : iso > lastBookable() ? lastBookable() : iso;
    const date = fromISO(clamped);
    const count = twoMonths.matches ? 2 : 1;
    const lastShown = new Date(calendar.view.getFullYear(), calendar.view.getMonth() + count, 0);
    if (date < calendar.view) calendar.view = firstOfMonth(date);
    if (date > lastShown) calendar.view = new Date(date.getFullYear(), date.getMonth() - count + 1, 1);
    calendar.focus = clamped;
    renderCalendar();
    const button = qs(`[data-date="${clamped}"]`, calendar.months);
    if (button) button.focus();
  }

  function pickDate(iso) {
    if (!arrival.value || departure.value || iso <= arrival.value) {
      arrival.value = iso;
      departure.value = '';
    } else if (nightsBetween(arrival.value, iso) > MAX_NIGHTS) {
      calendar.hint.textContent = `W wersji demo pobyt może trwać maks. ${MAX_NIGHTS} nocy.`;
      return;
    } else {
      departure.value = iso;
    }
    calendar.focus = iso;
    calendar.hover = null;
    renderCalendar();
    updateHint();
    updateDatesSummary();
    updateStatus();
    if (departure.value) {
      validateDates();
      // Po wybraniu wyjazdu okienko zamyka się samo — jak w kalendarzach rezerwacyjnych
      window.setTimeout(() => closeDropdown(datesToggle), reduceMotion.matches ? 0 : 350);
    } else {
      // Jeśli wcześniej był błąd, podpowiadamy kolejny krok zamiast starego komunikatu
      if (datesToggle.closest('.booking__field').classList.contains('is-invalid')) validateDates();
      const button = qs(`[data-date="${iso}"]`, calendar.months);
      if (button) button.focus();
    }
  }

  function initCalendar() {
    calendar.view = firstOfMonth(new Date());
    calendar.focus = toISO(new Date());
    renderCalendar();

    calendar.months.addEventListener('click', (event) => {
      const button = event.target.closest('.calendar__day');
      if (button && !button.disabled) pickDate(button.dataset.date);
    });

    // Podgląd zakresu pod kursorem
    calendar.months.addEventListener('mouseover', (event) => {
      const button = event.target.closest('.calendar__day');
      if (!button || !arrival.value || departure.value || button.dataset.date === calendar.hover) return;
      calendar.hover = button.dataset.date;
      qsa('.calendar__day', calendar.months).forEach((day) => {
        const iso = day.dataset.date;
        day.classList.toggle('in-range', iso > arrival.value && iso < calendar.hover);
      });
    });

    // Klawiatura: strzałki ±1 dzień / ±1 tydzień, PageUp/PageDown ±1 miesiąc.
    // Nasłuch na window w fazie przechwytywania — Bootstrap przejmuje strzałki
    // w dropdownach na poziomie document, więc musimy zareagować przed nim.
    window.addEventListener('keydown', (event) => {
      const button = event.target.closest && event.target.closest('#calendarMonths .calendar__day');
      if (!button) return;
      const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      const current = button.dataset.date;
      let next = null;
      if (event.key in steps) next = addDays(current, steps[event.key]);
      if (event.key === 'PageUp' || event.key === 'PageDown') {
        const d = fromISO(current);
        d.setMonth(d.getMonth() + (event.key === 'PageUp' ? -1 : 1));
        next = toISO(d);
      }
      if (!next) return;
      event.preventDefault();
      event.stopPropagation();
      focusDay(next);
    }, true);

    qsa('[data-cal-step]', calendar.el).forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = Number(btn.dataset.calStep);
        calendar.view = new Date(calendar.view.getFullYear(), calendar.view.getMonth() + step, 1);
        renderCalendar();
      });
    });

    qs('#calendarClear').addEventListener('click', () => {
      arrival.value = '';
      departure.value = '';
      calendar.hover = null;
      renderCalendar();
      updateHint();
      updateDatesSummary();
      updateStatus();
    });

    qs('#calendarDone').addEventListener('click', () => {
      closeDropdown(datesToggle);
      if (arrival.value) validateDates();
    });

    // Po otwarciu fokus trafia na wybraną datę (albo dzisiejszą)
    datesToggle.addEventListener('shown.bs.dropdown', () => {
      focusDay(arrival.value && !departure.value ? arrival.value : arrival.value || toISO(new Date()));
      header.classList.remove('is-hidden');
    });

    twoMonths.addEventListener('change', renderCalendar);
  }

  function initBooking() {
    initCalendar();

    qsa('.stepper__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = qs(`#${btn.dataset.target}`);
        input.value = Number(input.value) + Number(btn.dataset.step);
        clampInput(input);
        updateGuests();
      });
    });

    [adults, children].forEach((input) => {
      input.addEventListener('change', () => {
        clampInput(input);
        updateGuests();
      });
    });

    qs('.guests__done').addEventListener('click', () => closeDropdown(qs('#guestsToggle')));

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const results = [validateDates(), validateRoom()];
      if (results.includes(false)) {
        const firstInvalid = qs('[aria-invalid="true"]', form);
        if (firstInvalid === datesToggle) bootstrap.Dropdown.getOrCreateInstance(datesToggle).show();
        else if (firstInvalid) firstInvalid.focus();
        return;
      }

      const room = rooms.get(roomInput.value);
      if (!room) {
        // Bez wybranego pokoju pokazujemy panel z pokojami pasującymi do liczby gości
        openRoomPanel({ fromSearch: true });
        return;
      }
      notify('Wynik wyszukiwania (demo)', `${room.name} · ${stayDescription()}. W gotowym serwisie pojawi się tu realna dostępność i cena — nie dokonano rezerwacji.`);
    });

    qsa('[data-action="focus-booking"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        afterMenuClosed(focusBooking);
      });
    });

    updateGuests();

    // Przycisk „Rezerwuj” z podstron prowadzi do index.html#rezerwacja.
    // Po wczytaniu przeglądarka sama przewija do kotwicy (i zdejmuje fokus), więc czekamy na „load”.
    if (window.location.hash === '#rezerwacja') {
      window.addEventListener('load', () => window.setTimeout(focusBooking, 0), { once: true });
    }
  }

  /* ---------- Panel wyboru pokoi (Bootstrap Offcanvas, tylko strona główna) ---------- */
  const panelEl = qs('#roomPanel');
  const panel = panelEl ? bootstrap.Offcanvas.getOrCreateInstance(panelEl) : null;
  const list = qs('#roomList');
  const previewImage = qs('#roomPreviewImage');
  let panelContext = { fromSearch: false, focusId: null, returnFocus: null };

  function showPreview(id) {
    const room = rooms.get(id);
    if (!room) return;
    qsa('.room-option', list).forEach((option) => option.classList.toggle('is-active', option.dataset.roomId === id));
    qs('#roomPreviewName').textContent = room.name;
    qs('#roomPreviewText').textContent = room.text;
    if (previewImage.getAttribute('src') === room.image) {
      previewImage.alt = room.alt;
      return;
    }

    previewImage.classList.add('is-changing');
    window.setTimeout(() => {
      previewImage.src = room.image;
      previewImage.alt = room.alt;
      previewImage.addEventListener('load', () => previewImage.classList.remove('is-changing'), { once: true });
      if (previewImage.complete) previewImage.classList.remove('is-changing');
    }, reduceMotion.matches ? 0 : 180);
  }

  function refreshPanel() {
    const total = guestsTotal();
    qs('#roomPanelSummary').textContent = hasValidDates()
      ? `${stayDescription()}. Dostępność demonstracyjna.`
      : `${stayDescription()}. Wybierz pokój, a dodamy go do wyszukiwania.`;

    qsa('.room-option', list).forEach((option) => {
      const room = rooms.get(option.dataset.roomId);
      const tooSmall = total > room.capacity;
      const selected = roomInput.value === room.id;
      const button = qs('.room-option__select', option);
      option.classList.toggle('is-unavailable', tooSmall);
      option.classList.toggle('is-selected', selected);
      qs('.room-option__limit', option).textContent = tooSmall
        ? `Za mały dla ${total} ${plural(total, ['gościa', 'gości', 'gości'])} — maks. ${room.capacity}.`
        : '';
      button.disabled = tooSmall;
      button.setAttribute('aria-pressed', String(selected));
      qs('.room-option__select-label', button).textContent = selected ? 'Wybrano' : 'Wybierz';
    });
  }

  function openRoomPanel(context = {}) {
    panelContext = { fromSearch: false, focusId: null, returnFocus: document.activeElement, ...context };
    panel.show();
  }

  function buildRoomOption(room) {
    const item = document.createElement('li');
    item.className = 'room-option';
    item.dataset.roomId = room.id;
    item.innerHTML = `
      <img class="room-option__thumb" src="${room.image}" alt="" width="1200" height="900" loading="lazy" decoding="async">
      <div>
        <h3 class="room-option__name"></h3>
        <p class="room-option__text"></p>
        <p class="room-option__limit"></p>
        <button class="btn btn-ink room-option__select" type="button" aria-pressed="false">
          <svg class="icon icon--sm" aria-hidden="true"><use href="#i-check"/></svg>
          <span class="room-option__select-label">Wybierz</span>
          <span class="visually-hidden"> — ${room.name}</span>
        </button>
      </div>`;
    qs('.room-option__name', item).textContent = room.name;
    qs('.room-option__text', item).textContent = room.text;
    qs('.room-option__limit', item).before(room.meta.cloneNode(true));

    item.addEventListener('mouseenter', () => showPreview(room.id));
    item.addEventListener('focusin', () => showPreview(room.id));

    qs('.room-option__select', item).addEventListener('click', () => {
      const fromSearch = panelContext.fromSearch;
      setRoom(room.id);
      refreshPanel();
      panelContext.returnFocus = roomTrigger;
      panel.hide();
      if (fromSearch && hasValidDates()) {
        notify(`Wybrano: ${room.name}`, `${stayDescription()}. Wersja demonstracyjna — nie sprawdzono realnej dostępności i nie dokonano rezerwacji.`);
      } else if (!hasValidDates()) {
        notify(`Dodano: ${room.name}`, 'Wybierz daty przyjazdu i wyjazdu, a następnie kliknij „Sprawdź dostępność”.');
      }
    });
    return item;
  }

  function initRoomPanel() {
    // Dane pokoi pochodzą z sekcji #pokoje — treść jest w HTML tylko raz
    qsa('.room-card').forEach((card) => {
      const img = qs('img', card);
      rooms.set(card.dataset.roomId, {
        id: card.dataset.roomId,
        name: qs('.room-card__title', card).textContent.trim(),
        text: qs('.room-card__text', card).textContent.trim(),
        capacity: Number(card.dataset.roomCapacity),
        image: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        meta: qs('.room-meta', card),
      });
    });
    rooms.forEach((room) => list.append(buildRoomOption(room)));

    // Przyciski „Wybierz” w sekcji pokoi otwierają panel z podglądem danego pokoju
    qsa('[data-open-room]').forEach((btn) => {
      btn.addEventListener('click', () => openRoomPanel({ focusId: btn.dataset.openRoom }));
    });

    // Przycisk w formularzu otwiera panel przez data-bs-toggle — zapamiętujemy, gdzie wrócić
    roomTrigger.addEventListener('click', () => {
      panelContext = { fromSearch: false, focusId: null, returnFocus: roomTrigger };
    });

    panelEl.addEventListener('show.bs.offcanvas', () => {
      refreshPanel();
      const firstAvailable = qs('.room-option:not(.is-unavailable)', list);
      const id = panelContext.focusId || roomInput.value || (firstAvailable && firstAvailable.dataset.roomId) || rooms.keys().next().value;
      showPreview(id);
    });

    panelEl.addEventListener('shown.bs.offcanvas', () => {
      const id = panelContext.focusId || roomInput.value;
      const option = id ? qs(`.room-option[data-room-id="${id}"]`, list) : null;
      if (option) {
        option.scrollIntoView({ block: 'nearest' });
        const button = qs('.room-option__select', option);
        if (!button.disabled) button.focus();
      }
    });

    panelEl.addEventListener('hidden.bs.offcanvas', () => {
      const target = panelContext.returnFocus;
      if (target && document.contains(target)) target.focus({ preventScroll: target !== roomTrigger });
    });
  }

  /* ---------- Galeria z podglądem (Bootstrap Modal) ---------- */
  function initGallery() {
    const buttons = qsa('.gallery__button');
    const modalEl = qs('#galleryModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const image = qs('#lightboxImage');
    const caption = qs('#lightboxCaption');
    let index = 0;

    function render() {
      const source = qs('img', buttons[index]);
      image.src = source.getAttribute('src');
      image.alt = source.alt;
      caption.textContent = `${source.alt} (${index + 1} / ${buttons.length})`;
    }

    function step(delta) {
      index = (index + delta + buttons.length) % buttons.length;
      render();
    }

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        index = i;
        render();
        modal.show(btn);
      });
    });

    qsa('[data-gallery-step]', modalEl).forEach((btn) => {
      btn.addEventListener('click', () => step(Number(btn.dataset.galleryStep)));
    });

    modalEl.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    });

    // Po zamknięciu wracamy fokusem do miniatury, którą oglądano jako ostatnią
    modalEl.addEventListener('hidden.bs.modal', () => buttons[index].focus());
  }

  /* ---------- Blog (blog.html, single.html) — elementy demonstracyjne ---------- */
  function initBlog() {
    // Wyszukiwarka i formularz komentarza: walidacja Bootstrapa, potem komunikat demo (nic nie jest wysyłane)
    qsa('[data-demo-form]').forEach((demoForm) => {
      demoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!demoForm.checkValidity()) {
          demoForm.classList.add('was-validated');
          qs(':invalid', demoForm).focus();
          return;
        }
        demoForm.classList.remove('was-validated');
        notify(demoForm.dataset.demoTitle, demoForm.dataset.demoText);
        demoForm.reset();
      });
    });

    // Udostępnianie: adres i tytuł bieżącej strony wstawiamy do linków serwisów
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    qsa('[data-share]').forEach((link) => {
      link.href = link.dataset.share.replace('{url}', url).replace('{title}', title);
    });

    qsa('[data-copy-link]').forEach((button) => {
      button.addEventListener('click', () => {
        const copied = () => notify('Skopiowano link', 'Adres artykułu jest w schowku — możesz go wkleić w wiadomości.');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(copied, () => notify('Nie udało się skopiować', 'Skopiuj adres z paska przeglądarki.'));
        } else {
          notify('Nie udało się skopiować', 'Skopiuj adres z paska przeglądarki.');
        }
      });
    });
  }

  /* ---------- Animacje ---------- */

  // Dzieli tytuły na słowa (maska + przesunięcie). Kursywa <em> zostaje zachowana.
  function splitWords() {
    qsa('[data-split]').forEach((title) => {
      let index = 0;
      const wrapText = (node) => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(' '));
            return;
          }
          const word = document.createElement('span');
          const inner = document.createElement('span');
          word.className = 'word';
          inner.className = 'word__inner';
          inner.style.setProperty('--i', index);
          index += 1;
          inner.textContent = part;
          word.append(inner);
          fragment.append(word);
        });
        node.replaceWith(fragment);
      };
      const walk = (parent) => [...parent.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) wrapText(node);
        else if (node.nodeType === Node.ELEMENT_NODE) walk(node);
      });
      walk(title);
    });
  }

  // Łagodne pojawianie się elementów przy przewijaniu
  function initReveal() {
    const elements = qsa('[data-reveal]');
    // Przy ograniczonym ruchu CSS zamienia animację na samo rozjaśnienie, więc obserwator nadal działa
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Elementy w tym samym kontenerze pojawiają się kolejno, z niewielkim opóźnieniem
    const groups = new Map();
    elements.forEach((el) => {
      const group = el.closest('.row, .container, ul') || el.parentElement;
      const position = groups.get(group) || 0;
      el.style.setProperty('--reveal-delay', `${Math.min(position * 90, 450)}ms`);
      groups.set(group, position + 1);
    });

    // Element ukryty przez clip-path jest dla obserwatora „niewidoczny”,
    // dlatego przy odsłanianiu kurtyną obserwujemy jego rodzica.
    const targets = new Map(); // obserwowany element -> elementy do pokazania
    elements.forEach((el) => {
      const target = el.dataset.reveal === 'clip' ? el.parentElement : el;
      if (!targets.has(target)) targets.set(target, []);
      targets.get(target).push(el);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        targets.get(entry.target).forEach((el) => el.classList.add('is-visible'));
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    targets.forEach((_, target) => observer.observe(target));

    // Przeglądarka nie ładuje leniwych zdjęć schowanych pod clip-path,
    // więc dociągamy je wcześniej — ok. 800 px przed dojściem do sekcji
    const preloader = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        qsa('img[loading="lazy"]', entry.target).forEach((img) => { img.loading = 'eager'; });
        preloader.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 800px 0px' });
    qsa('[data-reveal="clip"]').forEach((el) => preloader.observe(el.parentElement));
  }

  // Delikatny parallax: element przesuwa się wolniej lub szybciej niż strona
  function initParallax() {
    if (reduceMotion.matches) return;
    const items = qsa('[data-parallax]').map((el) => ({ el, speed: Number(el.dataset.parallax) }));
    if (!items.length) return;

    function update() {
      const viewport = window.innerHeight;
      items.forEach(({ el, speed }) => {
        const parent = el.parentElement.getBoundingClientRect();
        if (parent.bottom < -viewport * 0.2 || parent.top > viewport * 1.2) return; // poza ekranem
        // Przesunięcie rośnie z odległością od środka ekranu, ale nigdy nie przekracza 8% wysokości
        const limit = parent.height * 0.08;
        const offset = Math.max(-limit, Math.min(limit, (parent.top + parent.height / 2 - viewport / 2) * speed));
        el.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
      });
    }

    update();
    onScrollFrame(update);
  }

  splitWords();
  initHeader();
  initLanguage();
  // Hero, rezerwacja, panel pokoi i galeria istnieją tylko na stronie głównej
  if (form) {
    initHeroVideo();
    initRoomPanel();
    initBooking();
    initGallery();
  }
  initBlog();
  initReveal();
  initParallax();
})();
