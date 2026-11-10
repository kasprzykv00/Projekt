/* =========================================================
   e-spania — sklep, koszyk, rezerwacja, płatność i konto
   Nie ma backendu: dane klienta żyją w pamięci przeglądarki (localStorage).
   Każdy moduł działa tylko na swojej stronie — wybiera go <body data-page="…">.
   Dane produktów i cen są w shop-data.js, pomocnicze funkcje w main.js (window.ES).
   ========================================================= */
(() => {
  'use strict';

  const { qs, qsa, toISO, fromISO, addDays, nightsBetween, notify, t, tn, tw, lang, locale } = window.ES;
  const { products, rooms, extras, excursions, cities, delivery, payments, discountCodes } = window.ES_DATA;

  /* ---------- Pomocnicze ---------- */

  // Wersje językowe: dane w shop-data.js i w localStorage zostają po polsku (od nich zależą ceny
  // i warianty), a tłumaczymy dopiero tekst wyświetlany na stronie — przez t() z main.js.
  // Kwoty zawsze w złotych, w polskim zapisie (jak ceny w HTML).
  const moneyFormat = (fraction) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', minimumFractionDigits: fraction, maximumFractionDigits: 2 });
  const money = (value) => moneyFormat(Number.isInteger(value) ? 0 : 2).format(value);
  const longDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  // Skróty dni tygodnia od poniedziałku (1.01.2024 to poniedziałek)
  const WEEKDAYS_SHORT = lang === 'pl'
    ? ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
    : Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 1 + i)));
  // Sposób płatności zapisany po polsku, np. „Karta •••• 4417” albo „Szybki przelew · mBank”
  const paidWithText = (value) => String(value).replace(/^(Karta płatnicza|Szybki przelew|Karta)(?= |$)/, (name) => t(name));
  const formatDate = (iso) => longDate.format(fromISO(iso));
  const formatStay = (start, end) => `${shortDate.format(fromISO(start))} – ${longDate.format(fromISO(end))}`;
  const round2 = (value) => Math.round(value * 100) / 100;

  // Tekst od użytkownika wstawiany do HTML musi być bezpieczny (imię, adres, uwagi)
  function esc(value) {
    const box = document.createElement('div');
    box.textContent = value == null ? '' : String(value);
    return box.innerHTML;
  }

  const findProduct = (id) => products.find((product) => product.id === id);
  const findRoom = (id) => rooms.find((room) => room.id === id);
  const today = () => toISO(new Date());

  function starsHTML(rating) {
    const full = Math.floor(rating + 0.25);
    const half = rating - full >= 0.25 ? 1 : 0;
    let html = '<span class="product-rating__stars" aria-hidden="true">';
    for (let i = 0; i < 5; i += 1) {
      const icon = i < full ? 'bi-star-fill' : i === full && half ? 'bi-star-half' : 'bi-star';
      html += `<i class="bi ${icon}"></i>`;
    }
    return `${html}</span>`;
  }

  const ratingText = (rating) => rating.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const reviewWord = (count) => tw(count, ['opinia', 'opinie', 'opinii']);

  /* ---------- Pamięć przeglądarki ---------- */
  // Gdy localStorage jest niedostępny (np. tryb prywatny), dane żyją do odświeżenia strony
  const memory = {};
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? (key in memory ? memory[key] : fallback) : JSON.parse(raw);
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set(key, value) {
      memory[key] = value;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) { /* zostaje kopia w pamięci */ }
    },
    remove(key) {
      delete memory[key];
      try {
        localStorage.removeItem(key);
      } catch (e) { /* brak dostępu — nic do usunięcia */ }
    },
  };

  /* ---------- Ceny pobytu ---------- */
  // Wspólne wyliczenie dla formularza rezerwacji, danych startowych i konta
  function priceStay({ roomId, arrival, departure, adults, children, extraIds, trips }) {
    const room = findRoom(roomId);
    const nights = arrival && departure ? nightsBetween(arrival, departure) : 0;
    const guests = adults + children;
    const lines = [];
    if (room && nights > 0) {
      lines.push({ label: `${t(room.name)} · ${tn(nights, ['noc', 'noce', 'nocy'])}`, amount: room.price * nights });
    }
    const chosenExtras = extras.filter((extra) => extraIds.includes(extra.id)).map((extra) => {
      const factor = { 'person-night': guests * nights, night: nights, stay: 1 }[extra.unit];
      return { id: extra.id, name: extra.name, amount: extra.price * factor };
    });
    // Etykiety linii są tekstem do wyświetlenia (podsumowanie, płatność), więc od razu tłumaczone
    chosenExtras.forEach((extra) => lines.push({ label: t(extra.name), amount: extra.amount }));
    trips.forEach((trip) => lines.push({ label: `${t(trip.name)} · ${tn(guests, ['os.', 'os.', 'os.'])}`, amount: trip.price * guests }));
    return { nights, guests, lines, chosenExtras, total: lines.reduce((sum, line) => sum + line.amount, 0) };
  }

  /* ---------- Dane startowe ---------- */
  // Przy pierwszej wizycie koszyk ma 2 produkty, a konto przykładową historię,
  // żeby każdą stronę dało się ocenić od razu po otwarciu.
  const DEFAULT_PROFILE = { firstName: 'Anna', lastName: 'Nowak', email: 'anna.nowak@example.com', phone: '+48 600 100 200', street: 'ul. Słoneczna 12/4', postal: '00-120', city: 'Warszawa', newsletter: true };

  function makeBooking(ref, city, arrival, departure, roomId, extraIds, tripIds, paidWith) {
    const trips = excursions[city].filter((trip) => tripIds.includes(trip.id)).map((trip) => ({ ...trip, date: addDays(arrival, 1) }));
    const priced = priceStay({ roomId, arrival, departure, adults: 2, children: 0, extraIds, trips });
    return {
      ref, city, arrival, departure, roomId, adults: 2, children: 0, paidWith, total: priced.total,
      extras: priced.chosenExtras,
      trips: trips.map(({ id, name, date, price }) => ({ id, name, date, amount: price * 2 })),
      guest: { firstName: DEFAULT_PROFILE.firstName, lastName: DEFAULT_PROFILE.lastName },
    };
  }

  function seed() {
    if (store.get('es-seeded', false)) return;
    const now = today();
    store.set('es-cart', [
      { id: 'costa', variant: 'Niebieski', qty: 1 },
      { id: 'alba', variant: 'Na 1 osobę', qty: 1 },
    ]);
    store.set('es-profile', DEFAULT_PROFILE);
    store.set('es-bookings', [
      makeBooking('REZ-20418', 'malaga', addDays(now, 38), addDays(now, 42), 'deluxe', ['breakfast', 'transfer'], ['agp-alhambra'], 'Karta •••• 4417'),
      makeBooking('REZ-19077', 'barcelona', addDays(now, -70), addDays(now, -66), 'classic', ['breakfast'], [], 'BLIK'),
    ]);
    store.set('es-orders', [
      {
        ref: 'ES-1042', date: addDays(now, -3), status: 'W realizacji', progress: 40, total: 203.9, deliveryName: 'Kurier', deliveryPrice: 14.9, discount: 0, paidWith: 'BLIK',
        address: 'Anna Nowak, ul. Słoneczna 12/4, 00-120 Warszawa',
        items: [{ id: 'oliwa', name: 'Oliwa z oliwek Arbequina', variant: '250 ml', qty: 1, price: 69 }, { id: 'azahar', name: 'Świeca zapachowa Azahar', variant: 'Azahar', qty: 1, price: 119 }],
      },
      {
        ref: 'ES-0987', date: addDays(now, -24), status: 'Wysłane', progress: 80, total: 298.9, deliveryName: 'Paczkomat', deliveryPrice: 9.9, discount: 0, paidWith: 'Karta •••• 4417',
        address: 'Anna Nowak, ul. Słoneczna 12/4, 00-120 Warszawa',
        items: [{ id: 'alba', name: 'Komplet ceramiki Alba', variant: 'Na 1 osobę', qty: 1, price: 289 }],
      },
    ]);
    store.set('es-seeded', true);
  }

  /* ---------- Koszyk ---------- */
  const getCart = () => store.get('es-cart', []).filter((line) => findProduct(line.id));

  function saveCart(cart) {
    store.set('es-cart', cart);
    updateCartBadge();
  }

  function variantPrice(product, variantLabel) {
    const option = product.variant.options.find((item) => item.label === variantLabel);
    return option && option.price ? option.price : product.price;
  }

  function addToCart(id, variant, qty) {
    const cart = getCart();
    const line = cart.find((item) => item.id === id && item.variant === variant);
    if (line) line.qty = Math.min(10, line.qty + qty);
    else cart.push({ id, variant, qty });
    saveCart(cart);
  }

  const cartCount = () => getCart().reduce((sum, line) => sum + line.qty, 0);

  function updateCartBadge() {
    const count = cartCount();
    qsa('[data-cart-count]').forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count === 0;
      const link = badge.closest('a');
      if (link) link.setAttribute('aria-label', window.ES.t('Koszyk, liczba produktów: {n}', { n: count }));
    });
  }

  // Pozycje koszyka z ceną; rabat naliczany jest od wartości produktów
  function cartSummary(deliveryPrice) {
    const lines = getCart().map((line) => {
      const product = findProduct(line.id);
      const price = variantPrice(product, line.variant);
      return { ...line, product, price, total: price * line.qty };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    const code = store.get('es-discount', '');
    const rate = discountCodes[code] || 0;
    const discount = round2(subtotal * rate);
    const shipping = lines.length ? deliveryPrice : 0;
    return { lines, subtotal, code, rate, discount, shipping, total: round2(subtotal - discount + shipping) };
  }

  /* ---------- Karta produktu (sklep, rekomendacje) ---------- */
  function productPriceHTML(product) {
    const from = product.priceFrom ? t('od {price}', { price: '' }) : '';
    if (!product.oldPrice) return `<p class="product-price">${from}${money(product.price)}</p>`;
    return `<p class="product-price product-price--sale">${money(product.price)} <s class="product-price__old"><span class="visually-hidden">${t('Cena regularna:')} </span>${money(product.oldPrice)}</s></p>`;
  }

  function relatedCardHTML(product) {
    const image = product.images[0];
    const name = t(product.name);
    const badge = product.badge ? `<span class="badge product-badge">${t(product.badge)}</span>` : '';
    return `<div class="col-6 col-lg-3">
        <article class="card product-card">
          <figure class="product-card__media media-frame">
            <img src="${image.thumb}" width="800" height="800" loading="lazy" decoding="async" alt="${esc(t(image.alt))}">
            ${badge}
          </figure>
          <div class="card-body product-card__body">
            <h3 class="card-title product-card__title"><a href="produkt.html?id=${product.id}">${name}</a></h3>
            ${productPriceHTML(product)}
            <a class="btn btn-ink product-card__cta" href="produkt.html?id=${product.id}">${t('Zobacz')}<span class="visually-hidden">: ${name}</span></a>
          </div>
        </article>
      </div>`;
  }

  /* ---------- Sklep: filtry, sortowanie, paginacja (sklep.html) ---------- */
  function initCatalog() {
    const PER_PAGE = 6;
    const form = qs('#shopFilterForm');
    const grid = qs('#productGrid');
    const items = qsa('[data-product]', grid);
    const countEl = qs('#productCount');
    const emptyEl = qs('#productEmpty');
    const pagination = qs('#shopPagination');
    const sortEl = qs('#productSort');
    const priceEl = qs('#filterPrice');
    const priceOut = qs('#filterPriceOutput');
    const collator = new Intl.Collator(locale);
    let page = 1;

    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      name: (a, b) => collator.compare(t(a.name), t(b.name)),   // alfabetycznie w wybranym języku
    };
    const checkedValues = (name) => qsa(`input[data-group="${name}"]:checked`, form).map((input) => input.value);

    function matching() {
      const categories = checkedValues('category');
      const colors = checkedValues('color');
      const onlyStock = qs('#filterStock').checked;
      const onlySale = qs('#filterSale').checked;
      const maxPrice = Number(priceEl.value);
      return products
        .filter((p) => (!categories.length || categories.includes(p.category))
          && (!colors.length || p.colors.some((color) => colors.includes(color)))
          && (!onlyStock || p.inStock)
          && (!onlySale || p.oldPrice)
          && p.price <= maxPrice)
        .sort(sorters[sortEl.value]);
    }

    function renderPagination(pages) {
      pagination.hidden = pages < 2;
      if (pages < 2) return;
      const pageItem = (target, label, { active = false, disabled = false, aria = '' } = {}) => `<li class="page-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}">
          <a class="page-link" href="#produkty" data-page="${target}"${active ? ' aria-current="page"' : ''}${disabled ? ' aria-disabled="true" tabindex="-1"' : ''}${aria ? ` aria-label="${aria}"` : ''}>${label}</a>
        </li>`;
      let html = pageItem(page - 1, '<i class="bi bi-arrow-left" aria-hidden="true"></i>', { disabled: page === 1, aria: t('Poprzednia strona') });
      for (let i = 1; i <= pages; i += 1) html += pageItem(i, String(i), { active: i === page });
      html += pageItem(page + 1, '<i class="bi bi-arrow-right" aria-hidden="true"></i>', { disabled: page === pages, aria: t('Następna strona') });
      qs('.pagination', pagination).innerHTML = html;
    }

    function apply() {
      const list = matching();
      const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      page = Math.min(page, pages);
      const visible = list.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => p.id);

      // Kolejność w DOM odpowiada sortowaniu, dzięki czemu tabulacja idzie po kolei
      list.forEach((p) => grid.append(items.find((el) => el.dataset.product === p.id)));
      items.forEach((el) => { el.hidden = !visible.includes(el.dataset.product); });

      countEl.textContent = t('Znaleziono {count}', { count: tn(list.length, ['produkt', 'produkty', 'produktów']) });
      emptyEl.hidden = list.length > 0;
      priceOut.textContent = t('do {price}', { price: money(Number(priceEl.value)) });
      renderPagination(pages);
    }

    form.addEventListener('change', () => { page = 1; apply(); });
    priceEl.addEventListener('input', () => { page = 1; apply(); });
    sortEl.addEventListener('change', () => { page = 1; apply(); });
    form.addEventListener('submit', (event) => event.preventDefault());
    // Przycisk „Wyczyść filtry”: reset formularza zmienia pola dopiero po zdarzeniu
    form.addEventListener('reset', () => window.setTimeout(() => { page = 1; apply(); }, 0));
    qs('#productEmptyReset').addEventListener('click', () => form.reset());

    pagination.addEventListener('click', (event) => {
      const link = event.target.closest('[data-page]');
      if (!link) return;
      event.preventDefault();
      if (link.getAttribute('aria-disabled') === 'true') return;
      page = Number(link.dataset.page);
      apply();
      qs('#produkty').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });

    apply();
  }

  /* ---------- Karta produktu (produkt.html?id=…) ---------- */
  function initProduct() {
    const product = findProduct(new URLSearchParams(window.location.search).get('id')) || products[0];
    const variantEl = qs('#productVariant');
    const qtyEl = qs('#productQty');
    const mainImage = qs('#productImage');
    const thumbs = qs('#productThumbs');

    const name = t(product.name);
    document.title = t('{name} — sklep hotelowy | e-spania', { name });
    qs('meta[name="description"]').content = t(product.lead);
    qs('#crumbProduct').textContent = name;
    qs('#productName').textContent = name;
    qs('#productMeta').textContent = t('{category} · kod {sku}', { category: t(product.categoryLabel), sku: product.sku });
    qs('#productRating').innerHTML = `${starsHTML(product.rating)}<span><span class="visually-hidden">${t('Ocena')} </span>${ratingText(product.rating)}<span class="visually-hidden"> ${t('na 5')}</span> · ${product.reviewsCount} ${reviewWord(product.reviewsCount)}</span>`;
    qs('#productLead').textContent = t(product.lead);
    qs('#productStock').innerHTML = product.inStock
      ? `<i class="bi bi-check-circle" aria-hidden="true"></i> ${t('W magazynie, wysyłka w 24 godziny')}`
      : `<i class="bi bi-hourglass-split" aria-hidden="true"></i> ${t('Na zamówienie, wysyłka do 10 dni')}`;
    qs('#productStock').classList.toggle('product-stock--order', !product.inStock);
    qs('#productDescription').textContent = t(product.description);
    qs('#productSpecs').innerHTML = product.specs.map(([key, value]) => `<tr><th scope="row">${t(key)}</th><td>${t(value)}</td></tr>`).join('');
    qs('#productReviewsSummary').innerHTML = `${starsHTML(product.rating)}<span>${ratingText(product.rating)} ${t('na 5')} · ${product.reviewsCount} ${reviewWord(product.reviewsCount)}</span>`;
    qs('#productReviews').innerHTML = product.reviews.map((review) => `<li class="product-review">
        <p class="product-rating">${starsHTML(review.rating)}<span class="visually-hidden">${t('Ocena {rating} na 5', { rating: review.rating })}</span></p>
        <p class="product-review__text">${t(review.text)}</p>
        <p class="product-review__author">${review.author} · ${t(review.date)}</p>
      </li>`).join('');
    qs('#productVariantLabel').textContent = t(product.variant.label);
    // Wartość opcji zostaje po polsku (od niej zależy cena i zapis w koszyku), tłumaczymy tylko napis
    variantEl.innerHTML = product.variant.options.map((option) => `<option value="${esc(option.label)}">${t(option.label)}</option>`).join('');

    function renderPrice() {
      const price = variantPrice(product, variantEl.value);
      const old = price === product.price && product.oldPrice;
      qs('#productPrice').innerHTML = `${money(price)}${old ? ` <s class="product-price__old"><span class="visually-hidden">${t('Cena regularna:')} </span>${money(product.oldPrice)}</s>` : ''}`;
    }

    function showImage(index) {
      const image = product.images[index];
      mainImage.src = image.src;
      mainImage.alt = t(image.alt);
      qsa('.product-thumb', thumbs).forEach((thumb, i) => {
        thumb.setAttribute('aria-pressed', String(i === index));
      });
    }

    thumbs.innerHTML = product.images.map((image, i) => `<div class="col-4">
        <button class="product-thumb media-frame" type="button" data-thumb="${i}" aria-pressed="${i === 0}" aria-label="${t('Pokaż zdjęcie {n} z {total}', { n: i + 1, total: product.images.length })}">
          <img src="${image.thumb}" width="800" height="800" loading="lazy" decoding="async" alt="">
        </button>
      </div>`).join('');
    thumbs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-thumb]');
      if (button) showImage(Number(button.dataset.thumb));
    });

    showImage(0);
    renderPrice();
    variantEl.addEventListener('change', renderPrice);

    // „Dodaj do koszyka” to zwykły odnośnik do koszyka; JS dokłada wcześniej wybrany produkt
    qs('#addToCart').addEventListener('click', () => {
      const qty = Math.min(10, Math.max(1, Math.round(Number(qtyEl.value)) || 1));
      addToCart(product.id, variantEl.value, qty);
    });

    // Rekomendacje: najpierw ta sama kategoria, potem najpopularniejsze
    const related = products
      .filter((item) => item.id !== product.id)
      .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category) || b.popularity - a.popularity)
      .slice(0, 4);
    qs('#relatedProducts').innerHTML = related.map(relatedCardHTML).join('');

    // Dane strukturalne opisują produkt, który jest aktualnie widoczny
    const schema = JSON.parse(qs('#productSchema').textContent);
    const node = schema['@graph'].find((item) => item['@type'] === 'Product');
    Object.assign(node, {
      name: product.name, sku: product.sku, description: product.lead, category: product.categoryLabel,
      image: product.images.map((image) => image.src),
      aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewsCount },
      offers: { '@type': 'Offer', price: String(product.price), priceCurrency: 'PLN', availability: `https://schema.org/${product.inStock ? 'InStock' : 'PreOrder'}`, url: `produkt.html?id=${product.id}` },
    });
    qs('#productSchema').textContent = JSON.stringify(schema);
  }

  /* ---------- Koszyk (koszyk.html) ---------- */
  function initCart() {
    const body = qs('#cartBody');
    const tableWrap = qs('#cartTableWrap');
    const emptyEl = qs('#cartEmpty');
    const checkoutLink = qs('#goToCheckout');
    const codeForm = qs('#discountForm');
    const codeInput = qs('#discountCode');
    const codeMessage = qs('#discountMessage');
    const estimate = delivery.kurier.price;

    function renderSummary() {
      const sum = cartSummary(estimate);
      qs('#sumSubtotal').textContent = money(sum.subtotal);
      qs('#sumShipping').textContent = money(sum.shipping);
      qs('#sumTotal').textContent = money(sum.total);
      qs('#sumDiscountRow').hidden = !sum.discount;
      qs('#sumDiscount').textContent = `− ${money(sum.discount)}`;
      checkoutLink.classList.toggle('disabled', !sum.lines.length);
      if (sum.lines.length) checkoutLink.removeAttribute('aria-disabled');
      else checkoutLink.setAttribute('aria-disabled', 'true');
      return sum;
    }

    function render() {
      const sum = renderSummary();
      tableWrap.hidden = !sum.lines.length;
      emptyEl.hidden = sum.lines.length > 0;
      body.innerHTML = sum.lines.map((line, i) => {
        const image = line.product.images[0];
        const name = t(line.product.name);
        return `<tr data-line="${i}">
          <td class="cart-table__product" data-label="${t('Produkt')}">
            <a class="cart-item" href="produkt.html?id=${line.id}">
              <img class="cart-item__thumb" src="${image.thumb}" width="800" height="800" loading="lazy" decoding="async" alt="">
              <span><span class="cart-item__name">${name}</span><span class="cart-item__variant">${esc(t(line.variant))}</span></span>
            </a>
          </td>
          <td data-label="${t('Cena jednostkowa')}">${money(line.price)}</td>
          <td data-label="${t('Ilość')}">
            <label class="visually-hidden" for="qty-${i}">${t('Ilość: {name}', { name })}</label>
            <input class="form-control cart-qty" type="number" id="qty-${i}" min="1" max="10" value="${line.qty}" inputmode="numeric">
          </td>
          <td class="cart-table__total" data-label="${t('Wartość łączna')}" data-line-total>${money(line.total)}</td>
          <td class="cart-table__action" data-label="${t('Akcja')}">
            <button class="icon-btn cart-remove" type="button" data-remove="${i}" aria-label="${t('Usuń z koszyka: {name}', { name })}"><i class="bi bi-trash" aria-hidden="true"></i></button>
          </td>
        </tr>`;
      }).join('');
    }

    body.addEventListener('change', (event) => {
      const input = event.target.closest('.cart-qty');
      if (!input) return;
      const row = input.closest('[data-line]');
      const index = Number(row.dataset.line);
      const qty = Math.min(10, Math.max(1, Math.round(Number(input.value)) || 1));
      input.value = qty;
      const cart = getCart();
      cart[index].qty = qty;
      saveCart(cart);
      // Bez przerysowania tabeli — fokus zostaje w polu ilości
      qs('[data-line-total]', row).textContent = money(cartSummary(estimate).lines[index].total);
      renderSummary();
    });

    body.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove]');
      if (!button) return;
      const cart = getCart();
      const [removed] = cart.splice(Number(button.dataset.remove), 1);
      saveCart(cart);
      render();
      notify(t('Usunięto z koszyka'), t(findProduct(removed.id).name));
      const next = qs('.cart-remove', body);
      (next || qs('#cartEmptyLink')).focus();
    });

    // Wyświetla stan kodu rabatowego pod polem
    function showCode(message, ok) {
      codeMessage.textContent = message;
      codeMessage.classList.toggle('discount-form__message--ok', ok);
      codeInput.setAttribute('aria-invalid', String(!ok && Boolean(message)));
    }

    codeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const code = codeInput.value.trim().toUpperCase();
      if (!code) {
        store.remove('es-discount');
        showCode(t('Wpisz kod rabatowy.'), false);
      } else if (discountCodes[code]) {
        store.set('es-discount', code);
        showCode(t('Kod {code} aktywny: rabat {percent}% na produkty.', { code, percent: Math.round(discountCodes[code] * 100) }), true);
      } else {
        store.remove('es-discount');
        showCode(t('Ten kod jest nieprawidłowy lub stracił ważność.'), false);
      }
      renderSummary();
    });

    const savedCode = store.get('es-discount', '');
    if (savedCode) {
      codeInput.value = savedCode;
      showCode(t('Kod {code} aktywny: rabat {percent}% na produkty.', { code: savedCode, percent: Math.round(discountCodes[savedCode] * 100) }), true);
    }
    render();
  }

  /* ---------- Walidacja formularzy ---------- */
  // Komunikaty Bootstrapa przy polach + lista błędów u góry, do której przechodzi fokus
  function showErrors(form, summary) {
    form.classList.add('was-validated');
    const invalid = qsa(':invalid', form).filter((el) => el.tagName !== 'FIELDSET');
    if (summary) {
      const items = invalid.map((el) => {
        const feedback = qs(`[data-feedback="${el.id}"]`, form) || el.parentElement.querySelector('.invalid-feedback');
        return `<li><a href="#${el.id}">${feedback ? esc(feedback.textContent) : t('Uzupełnij to pole.')}</a></li>`;
      }).join('');
      qs('ul', summary).innerHTML = items;
      summary.hidden = false;
      summary.focus();
    } else if (invalid[0]) {
      invalid[0].focus();
    }
  }

  function fillFields(prefix, profile) {
    ['firstName', 'lastName', 'email', 'phone', 'street', 'postal', 'city'].forEach((key) => {
      const field = qs(`#${prefix}${key[0].toUpperCase()}${key.slice(1)}`);
      if (field && !field.value) field.value = profile[key] || '';
    });
  }

  /* ---------- Kasa (zamowienie.html) ---------- */
  function initCheckout() {
    const form = qs('#checkoutForm');
    const summaryBox = qs('#checkoutErrors');
    const invoiceToggle = qs('#wantInvoice');
    const invoiceFields = qs('#invoiceFields');
    const profile = store.get('es-profile', DEFAULT_PROFILE);
    const selectedDelivery = () => qs('input[name="delivery"]:checked', form).value;

    fillFields('co', profile);

    function renderSummary() {
      const sum = cartSummary(delivery[selectedDelivery()].price);
      qs('#checkoutItems').innerHTML = sum.lines.map((line) => `<li class="summary-item">
          <span>${t(line.product.name)}<small>${esc(t(line.variant))} · ${t('{n} szt.', { n: line.qty })}</small></span>
          <span>${money(line.total)}</span>
        </li>`).join('');
      qs('#checkoutSubtotal').textContent = money(sum.subtotal);
      qs('#checkoutDiscountRow').hidden = !sum.discount;
      qs('#checkoutDiscount').textContent = `− ${money(sum.discount)}`;
      qs('#checkoutShippingLabel').textContent = t('Dostawa: {name}', { name: t(delivery[selectedDelivery()].name) });
      qs('#checkoutShipping').textContent = money(sum.shipping);
      qs('#checkoutTotal').textContent = money(sum.total);
      const empty = !sum.lines.length;
      qs('#checkoutEmpty').hidden = !empty;
      qs('#checkoutPay').disabled = empty;
      return sum;
    }

    form.addEventListener('change', (event) => {
      if (event.target.name === 'delivery') renderSummary();
    });

    // Dane firmy są wymagane tylko wtedy, gdy klient chce fakturę
    function syncInvoice() {
      const on = invoiceToggle.checked;
      invoiceFields.hidden = !on;
      qsa('input', invoiceFields).forEach((input) => { input.required = on; });
    }
    invoiceToggle.addEventListener('change', syncInvoice);
    syncInvoice();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        showErrors(form, summaryBox);
        return;
      }
      summaryBox.hidden = true;
      const sum = renderSummary();
      if (!sum.lines.length) return;
      const deliveryKey = selectedDelivery();
      const value = (id) => qs(`#${id}`).value.trim();
      store.set('es-pending', {
        type: 'order',
        method: qs('input[name="payment"]:checked', form).value,
        total: sum.total,
        // Tytuł i linie są tylko do wyświetlenia na stronie płatności — tłumaczone od razu
        title: t('Zamówienie: {count}', { count: tn(sum.lines.length, ['pozycja', 'pozycje', 'pozycji']) }),
        lines: sum.lines.map((line) => ({ label: `${t(line.product.name)} · ${t('{n} szt.', { n: line.qty })}`, amount: line.total }))
          .concat(sum.discount ? [{ label: t('Rabat {code}', { code: sum.code }), amount: -sum.discount }] : [], [{ label: t('Dostawa: {name}', { name: t(delivery[deliveryKey].name) }), amount: sum.shipping }]),
        order: {
          items: sum.lines.map((line) => ({ id: line.id, name: line.product.name, variant: line.variant, qty: line.qty, price: line.price })),
          deliveryName: delivery[deliveryKey].name,
          deliveryPrice: sum.shipping,
          discount: sum.discount,
          address: `${value('coFirstName')} ${value('coLastName')}, ${value('coStreet')}, ${value('coPostal')} ${value('coCity')}`,
          invoice: invoiceToggle.checked ? `${value('coCompany')}, NIP ${value('coNip')}` : '',
        },
      });
      window.location.href = 'platnosc.html';
    });

    renderSummary();
  }

  /* ---------- Rezerwacja pobytu (rezerwacja.html) ---------- */
  function initReservation() {
    const form = qs('#reservationForm');
    const errors = qs('#reservationErrors');
    const cityEl = qs('#resCity');
    const arrivalEl = qs('#resArrival');
    const departureEl = qs('#resDeparture');
    const adultsEl = qs('#resAdults');
    const childrenEl = qs('#resChildren');
    const tripsEl = qs('#tripOptions');
    const MAX_NIGHTS = 30;
    const params = new URLSearchParams(window.location.search);

    const guests = () => Number(adultsEl.value) + Number(childrenEl.value);
    const selectedRoom = () => {
      const input = qs('input[name="room"]:checked', form);
      return input ? input.value : '';
    };
    const selectedExtras = () => qsa('input[data-group="extra"]:checked', form).map((input) => input.value);
    const staysDatesOk = () => arrivalEl.value && departureEl.value && departureEl.value > arrivalEl.value
      && arrivalEl.value >= today() && nightsBetween(arrivalEl.value, departureEl.value) <= MAX_NIGHTS;

    function selectedTrips() {
      const city = cityEl.value;
      return qsa('input[data-group="trip"]:checked', form).map((input) => {
        const trip = excursions[city].find((item) => item.id === input.value);
        return { ...trip, date: qs(`#${input.id}-date`).value };
      }).filter((trip) => trip.id);
    }

    // Lista wycieczek zależy od miasta, a daty w listach od długości pobytu
    function renderTrips() {
      const city = cityEl.value;
      qs('#tripsCity').textContent = t(cities[city].locative);
      tripsEl.innerHTML = excursions[city].map((trip) => `<div class="col-12">
          <div class="option-card">
            <div class="form-check option-card__check">
              <input class="form-check-input" type="checkbox" data-group="trip" id="trip-${trip.id}" value="${trip.id}">
              <label class="form-check-label" for="trip-${trip.id}">
                <span class="option-card__name">${t(trip.name)}</span>
                <span class="option-card__text">${t(trip.text)} ${t('Czas trwania: {time}.', { time: t(trip.duration) })}</span>
              </label>
            </div>
            <div class="option-card__side">
              <span class="option-card__price">${money(trip.price)}<small>${t('os.')}</small></span>
              <label class="visually-hidden" for="trip-${trip.id}-date">${t('Termin: {name}', { name: t(trip.name) })}</label>
              <select class="form-select trip-date" id="trip-${trip.id}-date" disabled></select>
            </div>
          </div>
        </div>`).join('');
      renderTripDates();
    }

    function renderTripDates() {
      const days = [];
      if (staysDatesOk()) {
        for (let d = arrivalEl.value; d < departureEl.value; d = addDays(d, 1)) days.push(d);
      }
      qsa('input[data-group="trip"]', form).forEach((input) => {
        const select = qs(`#${input.id}-date`);
        const current = select.value;
        select.innerHTML = days.length
          ? days.map((day) => `<option value="${day}">${shortDate.format(fromISO(day))}</option>`).join('')
          : `<option value="">${t('Najpierw wybierz daty')}</option>`;
        if (days.includes(current)) select.value = current;
        select.disabled = !input.checked || !days.length;
      });
    }

    // Pokoje za małe dla liczby gości są wyłączone; wybór przechodzi na pierwszy pasujący
    function renderRoomLimits() {
      const total = guests();
      rooms.forEach((room) => {
        const input = qs(`#room-${room.id}`);
        const tooSmall = total > room.capacity;
        input.disabled = tooSmall;
        if (tooSmall) input.checked = false;
        input.closest('.option-card').classList.toggle('is-disabled', tooSmall);
        qs(`#room-${room.id}-limit`).textContent = tooSmall ? t('Maks. {guests}', { guests: tn(room.capacity, ['gość', 'gości', 'gości']) }) : '';
      });
      if (!selectedRoom()) {
        const firstFree = rooms.find((room) => room.capacity >= total);
        if (firstFree) qs(`#room-${firstFree.id}`).checked = true;
      }
    }

    function validateDates() {
      let message = '';
      if (arrivalEl.value && arrivalEl.value < today()) message = t('Data przyjazdu nie może być w przeszłości.');
      else if (arrivalEl.value && departureEl.value && departureEl.value <= arrivalEl.value) message = t('Wyjazd musi być po przyjeździe.');
      else if (arrivalEl.value && departureEl.value && nightsBetween(arrivalEl.value, departureEl.value) > MAX_NIGHTS) message = t('Pobyt może trwać maksymalnie {n} nocy.', { n: MAX_NIGHTS });
      departureEl.setCustomValidity(message);
      qs('#resDepartureFeedback').textContent = message || t('Wybierz datę wyjazdu.');
      // Największy pokój mieści 4 osoby
      adultsEl.setCustomValidity(guests() > 4 ? t('Pokoje mieszczą maksymalnie 4 gości.') : '');
    }

    function stayInput() {
      return {
        roomId: selectedRoom(), arrival: staysDatesOk() ? arrivalEl.value : '', departure: staysDatesOk() ? departureEl.value : '',
        adults: Number(adultsEl.value), children: Number(childrenEl.value), extraIds: selectedExtras(), trips: selectedTrips(),
      };
    }

    function renderSummary() {
      const priced = priceStay(stayInput());
      qs('#resSumHotel').textContent = t(cities[cityEl.value].hotel);
      qs('#resSumDates').textContent = staysDatesOk()
        ? `${formatStay(arrivalEl.value, departureEl.value)} · ${tn(priced.guests, ['gość', 'gości', 'gości'])}`
        : t('Wybierz daty, aby zobaczyć cenę pobytu.');
      qs('#resSumLines').innerHTML = priced.lines.map((line) => `<li class="summary-item"><span>${esc(line.label)}</span><span>${money(line.amount)}</span></li>`).join('');
      qs('#resSumTotal').textContent = money(priced.total);
    }

    function refresh() {
      arrivalEl.min = today();
      departureEl.min = arrivalEl.value ? addDays(arrivalEl.value, 1) : addDays(today(), 1);
      validateDates();
      renderRoomLimits();
      renderTripDates();
      renderSummary();
    }

    // Dane przekazane z paska na stronie głównej
    const paramCity = params.get('miasto');
    let savedCity = null;
    try {
      savedCity = localStorage.getItem('es-city');
    } catch (e) { /* zostaje domyślne miasto */ }
    cityEl.value = cities[paramCity] ? paramCity : cities[savedCity] ? savedCity : 'barcelona';
    const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');
    if (isDate(params.get('przyjazd'))) arrivalEl.value = params.get('przyjazd');
    if (isDate(params.get('wyjazd'))) departureEl.value = params.get('wyjazd');
    const clampCount = (value, input) => Math.min(Number(input.max), Math.max(Number(input.min), Number(value)));
    if (params.get('dorosli')) adultsEl.value = clampCount(params.get('dorosli'), adultsEl) || 2;
    if (params.get('dzieci')) childrenEl.value = clampCount(params.get('dzieci'), childrenEl) || 0;
    if (findRoom(params.get('pokoj'))) qs(`#room-${params.get('pokoj')}`).checked = true;

    fillFields('res', store.get('es-profile', DEFAULT_PROFILE));

    cityEl.addEventListener('change', () => {
      try {
        localStorage.setItem('es-city', cityEl.value);
      } catch (e) { /* wybór obowiązuje tylko na tej stronie */ }
      renderTrips();
    });
    form.addEventListener('change', refresh);
    arrivalEl.addEventListener('input', refresh);
    departureEl.addEventListener('input', refresh);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      validateDates();
      if (!form.checkValidity()) {
        showErrors(form, errors);
        return;
      }
      errors.hidden = true;
      const input = stayInput();
      const priced = priceStay(input);
      const room = findRoom(input.roomId);
      store.set('es-pending', {
        type: 'booking',
        method: 'karta',
        total: priced.total,
        title: `${t(cities[cityEl.value].hotel)} · ${t(room.name)}`,
        subtitle: formatStay(input.arrival, input.departure),
        lines: priced.lines,
        booking: {
          city: cityEl.value, arrival: input.arrival, departure: input.departure, roomId: input.roomId,
          adults: input.adults, children: input.children, total: priced.total,
          extras: priced.chosenExtras,
          trips: input.trips.map((trip) => ({ id: trip.id, name: trip.name, date: trip.date, amount: trip.price * priced.guests })),
          guest: { firstName: qs('#resFirstName').value.trim(), lastName: qs('#resLastName').value.trim(), email: qs('#resEmail').value.trim(), phone: qs('#resPhone').value.trim() },
          notes: qs('#resNotes').value.trim(),
        },
      });
      window.location.href = 'platnosc.html';
    });

    renderTrips();
    refresh();
  }

  /* ---------- Płatność (platnosc.html) ---------- */
  // Nie ma tu żadnej prawdziwej płatności: po sprawdzeniu formatu zapisujemy zakup na koncie.
  // Numer karty nie jest zapisywany ani wysyłany — zostają tylko 4 ostatnie cyfry do opisu.
  function initPayment() {
    const pending = store.get('es-pending', null);
    const form = qs('#paymentForm');
    const noneBox = qs('#paymentNone');

    if (!pending) {
      noneBox.hidden = false;
      return;
    }
    qs('#paymentContent').hidden = false;

    qs('#paymentTitle').textContent = pending.title;
    qs('#paymentSubtitle').textContent = pending.subtitle || '';
    qs('#paymentLines').innerHTML = pending.lines.map((line) => `<li class="summary-item"><span>${esc(line.label)}</span><span>${line.amount < 0 ? '− ' : ''}${money(Math.abs(line.amount))}</span></li>`).join('');
    qs('#paymentTotal').textContent = money(pending.total);
    qs('#paymentButtonAmount').textContent = money(pending.total);
    qs('#paymentBack').href = pending.type === 'order' ? 'zamowienie.html' : 'rezerwacja.html';

    const method = () => qs('input[name="method"]:checked', form).value;

    function syncMethod() {
      ['blik', 'karta', 'przelew'].forEach((key) => {
        const panel = qs(`#panel-${key}`);
        const on = method() === key;
        panel.hidden = !on;
        qsa('input, select', panel).forEach((field) => { field.required = on; });
      });
      form.classList.remove('was-validated');
    }

    qs(`#method-${pending.method}`).checked = true;
    syncMethod();
    qsa('input[name="method"]', form).forEach((input) => input.addEventListener('change', syncMethod));

    // Numer karty: spacje co 4 cyfry podczas pisania
    const cardEl = qs('#cardNumber');
    cardEl.addEventListener('input', () => {
      const digits = cardEl.value.replace(/\D/g, '').slice(0, 16);
      cardEl.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    });

    function paidWithLabel() {
      // Zapisujemy po polsku — na koncie tłumaczy go paidWithText()
      if (method() === 'karta') return `Karta •••• ${cardEl.value.replace(/\D/g, '').slice(-4)}`;
      if (method() === 'przelew') return `Szybki przelew · ${qs('#bankSelect').value}`;
      return payments[method()];
    }

    function finish() {
      const paidWith = paidWithLabel();
      const number = String(Date.now()).slice(-5);
      let ref;
      if (pending.type === 'booking') {
        ref = `REZ-${number}`;
        store.set('es-bookings', [{ ref, paidWith, ...pending.booking }, ...store.get('es-bookings', [])]);
      } else {
        ref = `ES-${number}`;
        store.set('es-orders', [{ ref, date: today(), status: 'W realizacji', progress: 20, total: pending.total, paidWith, ...pending.order }, ...store.get('es-orders', [])]);
        saveCart([]);
        store.remove('es-discount');
      }
      store.remove('es-pending');
      window.location.href = `konto.html?platnosc=${pending.type === 'booking' ? 'rezerwacja' : 'zamowienie'}&nr=${ref}`;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const digits = cardEl.value.replace(/\D/g, '');
      cardEl.setCustomValidity(method() === 'karta' && digits.length !== 16 ? t('Numer karty ma 16 cyfr.') : '');
      if (!form.checkValidity()) {
        showErrors(form, null);
        return;
      }
      const button = qs('#paymentSubmit');
      button.disabled = true;
      qs('#paymentSubmitLabel').textContent = t('Przetwarzanie płatności…');
      qs('#paymentSpinner').hidden = false;
      window.setTimeout(finish, 1200);
    });
  }

  /* ---------- Konto klienta (konto.html) ---------- */
  function initAccount() {
    const ARRIVAL_HOUR = 15;
    const bookings = store.get('es-bookings', []).slice().sort((a, b) => (a.arrival < b.arrival ? 1 : -1));
    const orders = store.get('es-orders', []);
    const isUpcoming = (booking) => booking.departure >= today();
    const upcoming = bookings.filter(isUpcoming).sort((a, b) => (a.arrival < b.arrival ? -1 : 1));

    function countdownParts(booking) {
      const [y, m, d] = booking.arrival.split('-').map(Number);
      const ms = new Date(y, m - 1, d, ARRIVAL_HOUR).getTime() - Date.now();
      if (ms <= 0) return null;
      return { days: Math.floor(ms / 86400000), hours: Math.floor(ms / 3600000) % 24, minutes: Math.floor(ms / 60000) % 60 };
    }

    const countdownHTML = (parts) => [
      [parts.days, tw(parts.days, ['dzień', 'dni', 'dni'])],
      [parts.hours, tw(parts.hours, ['godzina', 'godziny', 'godzin'])],
      [parts.minutes, tw(parts.minutes, ['minuta', 'minuty', 'minut'])],
    ].map(([value, label]) => `<span class="countdown__unit"><strong>${value}</strong>${label}</span>`).join('');

    function monthHTML(start, booking) {
      const offset = (start.getDay() + 6) % 7;
      const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      const tripDays = new Map(booking.trips.map((trip) => [trip.date, t(trip.name)]));
      let cells = '<tr>';
      for (let i = 0; i < offset; i += 1) cells += '<td></td>';
      for (let day = 1; day <= daysInMonth; day += 1) {
        const iso = toISO(new Date(start.getFullYear(), start.getMonth(), day));
        const classes = [];
        if (iso >= booking.arrival && iso <= booking.departure) classes.push('is-stay');
        if (iso === booking.arrival) classes.push('is-first');
        if (iso === booking.departure) classes.push('is-last');
        if (tripDays.has(iso)) classes.push('has-trip');
        const title = tripDays.has(iso) ? ` title="${esc(tripDays.get(iso))}"` : '';
        cells += `<td class="${classes.join(' ')}"${title}>${day}</td>`;
        if ((offset + day) % 7 === 0 && day < daysInMonth) cells += '</tr><tr>';
      }
      const head = WEEKDAYS_SHORT.map((name) => `<th scope="col">${name}</th>`).join('');
      return `<table class="stay-calendar"><caption>${monthName.format(start)}</caption><thead><tr>${head}</tr></thead><tbody>${cells}</tr></tbody></table>`;
    }

    function calendarHTML(booking) {
      const first = fromISO(booking.arrival);
      const last = fromISO(booking.departure);
      let html = monthHTML(new Date(first.getFullYear(), first.getMonth(), 1), booking);
      if (first.getMonth() !== last.getMonth()) html += monthHTML(new Date(last.getFullYear(), last.getMonth(), 1), booking);
      return html;
    }

    function bookingHTML(booking) {
      const room = findRoom(booking.roomId);
      const city = cities[booking.city];
      const nights = nightsBetween(booking.arrival, booking.departure);
      const parts = isUpcoming(booking) ? countdownParts(booking) : null;
      const statusLabel = !isUpcoming(booking) ? t('Zakończona') : parts ? t('Opłacona') : t('Trwa pobyt');
      const extrasList = booking.extras.map((extra) => `<li>${esc(t(extra.name))}</li>`).join('');
      const tripsList = booking.trips.map((trip) => `<li>${esc(t(trip.name))} · ${shortDate.format(fromISO(trip.date))}</li>`).join('');
      return `<article class="booking-card${isUpcoming(booking) ? '' : ' booking-card--past'}">
        <div class="row g-0">
          <div class="col-md-4">
            <figure class="booking-card__media media-frame"><img src="${room.image}" width="1200" height="900" loading="lazy" decoding="async" alt="${esc(t(room.alt))}"></figure>
          </div>
          <div class="col-md-8">
            <div class="booking-card__body">
              <div class="d-flex flex-wrap justify-content-between align-items-start gap-2">
                <div>
                  <h3 class="booking-card__title">${t(city.hotel)}</h3>
                  <p class="booking-card__room">${t(room.name)} · ${tn(nights, ['noc', 'noce', 'nocy'])}</p>
                </div>
                <span class="badge status-badge${isUpcoming(booking) ? ' status-badge--ok' : ''}">${statusLabel}</span>
              </div>
              <p class="booking-card__dates"><i class="bi bi-calendar-event" aria-hidden="true"></i> ${formatStay(booking.arrival, booking.departure)}</p>
              ${parts ? `<div class="countdown" data-countdown="${esc(booking.ref)}"><p class="countdown__label">${t('Do przyjazdu zostało')}</p><p class="countdown__units">${countdownHTML(parts)}</p></div>` : ''}
              <div class="row gy-4 mt-1">
                <div class="col-sm-6">
                  ${extrasList ? `<h4 class="booking-card__subtitle">${t('Dodatki')}</h4><ul class="booking-card__list">${extrasList}</ul>` : ''}
                  ${tripsList ? `<h4 class="booking-card__subtitle">${t('Wycieczki')}</h4><ul class="booking-card__list">${tripsList}</ul>` : ''}
                  <p class="booking-card__meta">${t('Numer:')} ${esc(booking.ref)}<br>${t('Zapłacono:')} ${money(booking.total)}<br>${esc(paidWithText(booking.paidWith))}</p>
                </div>
                <div class="col-sm-6">${calendarHTML(booking)}</div>
              </div>
            </div>
          </div>
        </div>
      </article>`;
    }

    function renderBookings() {
      qs('#accountBookings').innerHTML = bookings.length
        ? [...upcoming, ...bookings.filter((booking) => !isUpcoming(booking))].map(bookingHTML).join('')
        : `<p class="account-empty">${t('Nie masz jeszcze rezerwacji.')}</p>`;
    }

    function renderDashboard() {
      const profile = store.get('es-profile', DEFAULT_PROFILE);
      qs('#accountGreeting').textContent = t('Witaj, {name}', { name: profile.firstName });
      qs('#statBookings').textContent = upcoming.length;
      qs('#statOrders').textContent = orders.filter((order) => order.status !== 'Dostarczone').length;
      const next = upcoming[0];
      const parts = next ? countdownParts(next) : null;
      qs('#statNext').textContent = parts ? tn(parts.days, ['dzień', 'dni', 'dni']) : '—';
      qs('#accountIntro').textContent = next
        ? t('Najbliższy pobyt: {hotel}, {dates}.', { hotel: t(cities[next.city].hotel), dates: formatStay(next.arrival, next.departure) })
        : t('Nie masz zaplanowanych pobytów. Hiszpania czeka.');
    }

    // Status zamówienia jest zapisany po polsku („W realizacji”, „Wysłane”) — tłumaczymy przy wyświetlaniu
    function renderOrders() {
      qs('#ordersBody').innerHTML = orders.map((order) => `<tr>
          <th scope="row" data-label="${t('Numer')}">${esc(order.ref)}</th>
          <td data-label="${t('Data')}">${formatDate(order.date)}</td>
          <td data-label="${t('Kwota')}">${money(order.total)}</td>
          <td data-label="${t('Status')}"><span class="badge status-badge${order.status === 'Wysłane' ? ' status-badge--ok' : ''}">${esc(t(order.status))}</span></td>
          <td data-label="${t('Akcja')}"><button class="btn link-arrow" type="button" data-order="${esc(order.ref)}">${t('Szczegóły')}<span class="visually-hidden"> ${t('zamówienia {ref}', { ref: esc(order.ref) })}</span></button></td>
        </tr>`).join('');
    }

    const orderModalEl = qs('#orderModal');
    qs('#ordersBody').addEventListener('click', (event) => {
      const button = event.target.closest('[data-order]');
      if (!button) return;
      const order = orders.find((item) => item.ref === button.dataset.order);
      qs('#orderModalTitle').textContent = t('Zamówienie {ref}', { ref: order.ref });
      qs('#orderModalBody').innerHTML = `
        <p class="order-progress__label">${t('Status:')} ${esc(t(order.status))}</p>
        <div class="progress order-progress" role="progressbar" aria-label="${t('Postęp realizacji zamówienia')}" aria-valuenow="${order.progress}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width: ${order.progress}%"></div></div>
        <ul class="summary-list">
          ${order.items.map((item) => `<li class="summary-item"><span>${esc(t(item.name))}<small>${esc(t(item.variant))} · ${t('{n} szt.', { n: item.qty })}</small></span><span>${money(item.price * item.qty)}</span></li>`).join('')}
          ${order.discount ? `<li class="summary-item"><span>${t('Rabat')}</span><span>− ${money(order.discount)}</span></li>` : ''}
          <li class="summary-item"><span>${t('Dostawa: {name}', { name: esc(t(order.deliveryName)) })}</span><span>${money(order.deliveryPrice)}</span></li>
        </ul>
        <p class="summary-total"><span>${t('Razem')}</span><strong>${money(order.total)}</strong></p>
        <p class="order-meta">${t('Adres:')} ${esc(order.address)}<br>${t('Płatność:')} ${esc(paidWithText(order.paidWith))}${order.invoice ? `<br>${t('Faktura:')} ${esc(order.invoice)}` : ''}</p>`;
      bootstrap.Modal.getOrCreateInstance(orderModalEl).show();
    });

    /* Adres i ustawienia */
    const addressForm = qs('#addressForm');
    const addressCollapse = qs('#addressEdit');

    function renderAddress() {
      const p = store.get('es-profile', DEFAULT_PROFILE);
      qs('#addressView').innerHTML = `${esc(p.firstName)} ${esc(p.lastName)}<br>${esc(p.street)}<br>${esc(p.postal)} ${esc(p.city)}<br>${esc(p.phone)}`;
      ['Street', 'Postal', 'City', 'Phone'].forEach((key) => { qs(`#addr${key}`).value = p[key.toLowerCase()] || ''; });
    }

    addressForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!addressForm.checkValidity()) {
        showErrors(addressForm, null);
        return;
      }
      addressForm.classList.remove('was-validated');
      const p = store.get('es-profile', DEFAULT_PROFILE);
      store.set('es-profile', { ...p, street: qs('#addrStreet').value.trim(), postal: qs('#addrPostal').value.trim(), city: qs('#addrCity').value.trim(), phone: qs('#addrPhone').value.trim() });
      renderAddress();
      bootstrap.Collapse.getOrCreateInstance(addressCollapse).hide();
      notify(t('Zapisano adres'), t('Użyjemy go przy kolejnych zamówieniach.'));
    });

    const settingsForm = qs('#settingsForm');
    function renderSettings() {
      const p = store.get('es-profile', DEFAULT_PROFILE);
      qs('#setFirstName').value = p.firstName;
      qs('#setLastName').value = p.lastName;
      qs('#setEmail').value = p.email;
      qs('#setNewsletter').checked = Boolean(p.newsletter);
    }

    settingsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!settingsForm.checkValidity()) {
        showErrors(settingsForm, null);
        return;
      }
      settingsForm.classList.remove('was-validated');
      const p = store.get('es-profile', DEFAULT_PROFILE);
      store.set('es-profile', { ...p, firstName: qs('#setFirstName').value.trim(), lastName: qs('#setLastName').value.trim(), email: qs('#setEmail').value.trim(), newsletter: qs('#setNewsletter').checked });
      renderDashboard();
      renderAddress();
      notify(t('Zapisano ustawienia'), t('Twoje dane zostały zaktualizowane.'));
    });

    /* Komunikat po płatności */
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('platnosc');
    const ref = (params.get('nr') || '').replace(/[^A-Z0-9-]/gi, '');
    if (paid === 'rezerwacja' || paid === 'zamowienie') {
      const box = qs('#accountSuccess');
      qs('#accountSuccessTitle').textContent = t('Płatność przyjęta');
      qs('#accountSuccessText').textContent = paid === 'rezerwacja'
        ? t('Rezerwacja {ref} jest opłacona. Szczegóły i odliczanie znajdziesz poniżej.', { ref })
        : t('Zamówienie {ref} jest opłacone i trafiło do realizacji.', { ref });
      box.hidden = false;
      box.focus();
      // Odświeżenie strony nie powinno pokazywać komunikatu ponownie
      window.history.replaceState(null, '', paid === 'rezerwacja' ? 'konto.html#rezerwacje' : 'konto.html#zamowienia');
    }

    renderDashboard();
    renderBookings();
    renderOrders();
    renderAddress();
    renderSettings();

    // Odliczanie odświeżane co minutę
    window.setInterval(() => {
      qsa('[data-countdown]').forEach((box) => {
        const booking = bookings.find((item) => item.ref === box.dataset.countdown);
        const parts = booking && countdownParts(booking);
        if (parts) qs('.countdown__units', box).innerHTML = countdownHTML(parts);
      });
      renderDashboard();
    }, 60000);
  }

  /* ---------- Start ---------- */
  seed();
  updateCartBadge();
  const modules = { sklep: initCatalog, produkt: initProduct, koszyk: initCart, zamowienie: initCheckout, rezerwacja: initReservation, platnosc: initPayment, konto: initAccount };
  const run = modules[document.body.dataset.page];
  if (run) run();
})();
