/* =========================================================
   e-spania — dane sklepu i rezerwacji (fikcyjny hotel, projekt RWD)
   Tutaj zmieniasz ceny, opisy produktów, dodatki i wycieczki.
   Karty w sklep.html i index.html są zapisane także w HTML — po zmianie
   ceny lub nazwy produktu popraw je również tam.
   ========================================================= */
window.ES_DATA = (() => {
  const shop = 'assets/images/sklep/';
  const photo = {
    costa: { src: `${shop}recznik-costa-1200.webp`, thumb: `${shop}recznik-costa-800.webp`, alt: 'Złożony niebieski ręcznik w białe paski, zakończony frędzlami' },
    costaBeach: { src: `${shop}recznik-costa-plaza-1200.webp`, thumb: `${shop}recznik-costa-plaza-800.webp`, alt: 'Ręcznik w granatowe pasy i okulary przeciwsłoneczne na plaży' },
    costaStack: { src: `${shop}recznik-costa-stos-1200.webp`, thumb: `${shop}recznik-costa-stos-800.webp`, alt: 'Stos złożonych ręczników w piaskowe i granatowe pasy' },
    alba: { src: `${shop}ceramika-alba-800.webp`, thumb: `${shop}ceramika-alba-800.webp`, alt: 'Biała ceramika z drobnymi kropkami: talerz, kubek i miseczka' },
    plates: { src: `${shop}talerze-malowane-800.webp`, thumb: `${shop}talerze-malowane-800.webp`, alt: 'Kolorowe, ręcznie malowane talerze i filiżanki na drewnianych półkach' },
    cups: { src: `${shop}kubki-blanca-800.webp`, thumb: `${shop}kubki-blanca-800.webp`, alt: 'Białe kubki ceramiczne ustawione jeden na drugim' },
    oil: { src: `${shop}oliwa-800.webp`, thumb: `${shop}oliwa-800.webp`, alt: 'Szklana karafka ze złocistą oliwą i oliwkami' },
    carafes: { src: `${shop}karafki-800.webp`, thumb: `${shop}karafki-800.webp`, alt: 'Dwie szklane karafki z korkami na jasnym tle' },
    candle: { src: `${shop}swieca-azahar-800.webp`, thumb: `${shop}swieca-azahar-800.webp`, alt: 'Zapalona świeca w szkle z butelkowej zieleni, obok gałązka bawełny' },
    candles: { src: `${shop}swiece-zestaw-800.webp`, thumb: `${shop}swiece-zestaw-800.webp`, alt: 'Trzy zapalone świece w szklanych naczyniach na ciemnym tle' },
    voucher: { src: `${shop}voucher-800.webp`, thumb: `${shop}voucher-800.webp`, alt: 'Biała karta podarunkowa i małe pudełko z czerwoną kokardą na jasnym tle' },
    gift: { src: `${shop}zestaw-upominkowy-800.webp`, thumb: `${shop}zestaw-upominkowy-800.webp`, alt: 'Dwa pudełka z szarego kartonu przewiązane wstążkami' },
  };

  const products = [
    {
      id: 'costa', name: 'Ręcznik plażowy Costa', sku: 'ESP-REC-01', category: 'plaza', categoryLabel: 'Plaża i lato',
      price: 149, badge: 'Bestseller', rating: 4.8, reviewsCount: 126, popularity: 100, inStock: true, colors: ['niebieski', 'naturalny'],
      images: [photo.costa, photo.costaBeach, photo.costaStack],
      lead: 'Lekki bawełniany ręcznik z frędzlami, ten sam, który czeka na gości w naszych hotelach. Szybko schnie i zajmuje w walizce tyle miejsca, co koszula.',
      description: 'Costa powstaje z długowłóknistej bawełny tkanej płasko, dlatego jest cieńszy od klasycznego frotte, a mimo to dobrze chłonie wodę. Z każdym praniem staje się bardziej miękki. Sprawdzi się na plaży, przy basenie i jako narzuta na wieczór na tarasie.',
      specs: [['Materiał', '100% bawełna'], ['Wymiary', '100 × 180 cm'], ['Gramatura', '220 g/m²'], ['Pranie', '40°C, bez wybielaczy'], ['Pochodzenie', 'Tkane w Walencji']],
      variant: { label: 'Kolor', options: [{ label: 'Niebieski' }, { label: 'Granatowy' }, { label: 'Piaskowy' }] },
      reviews: [
        { author: 'Marta K.', rating: 5, date: 'wrzesień 2026', text: 'Zabrałam go do Malagi i wrócił ze mną do domu jako ulubiony ręcznik. Schnie w godzinę, a piasek po prostu z niego spada.' },
        { author: 'Tomasz W.', rating: 5, date: 'sierpień 2026', text: 'Cienki, ale chłonny. Kolor po kilku praniach nadal wygląda jak nowy.' },
        { author: 'Ola P.', rating: 4, date: 'lipiec 2026', text: 'Piękny i lekki. Dla mnie mógłby być nieco dłuższy, ale do walizki idealny.' },
      ],
    },
    {
      id: 'alba', name: 'Komplet ceramiki Alba', sku: 'ESP-CER-02', category: 'dom', categoryLabel: 'Dom i stół',
      price: 289, badge: 'Nowość', rating: 4.9, reviewsCount: 84, popularity: 92, inStock: true, colors: ['bialy'],
      images: [photo.alba, photo.cups, photo.plates],
      lead: 'Talerz, miseczka i kubek z kamionki o nierównych, ręcznie wykańczanych krawędziach. To na nich podajemy śniadania w naszych hotelach.',
      description: 'Alba to prosta, matowa ceramika toczona w małej pracowni pod Walencją. Każdy element różni się minimalnie od pozostałych, a drobne kropki w szkliwie są naturalnym śladem wypału. Komplet można myć w zmywarce i podgrzewać w piekarniku.',
      specs: [['Materiał', 'Kamionka szkliwiona'], ['Zawartość', 'Talerz, miseczka, kubek'], ['Średnica talerza', '26 cm'], ['Pojemność kubka', '320 ml'], ['Zmywarka', 'Tak']],
      variant: { label: 'Zestaw', options: [{ label: 'Na 1 osobę' }, { label: 'Na 2 osoby', price: 549 }, { label: 'Na 4 osoby', price: 999 }] },
      reviews: [
        { author: 'Karolina S.', rating: 5, date: 'październik 2026', text: 'Na żywo jeszcze ładniejsze niż na zdjęciach. Każdy talerz jest trochę inny i o to właśnie chodzi.' },
        { author: 'Michał D.', rating: 5, date: 'wrzesień 2026', text: 'Solidne i dobrze zapakowane. Kupiłem po pobycie w Barcelonie, żeby mieć w domu te śniadania.' },
      ],
    },
    {
      id: 'azahar', name: 'Świeca zapachowa Azahar', sku: 'ESP-SWI-03', category: 'zapachy', categoryLabel: 'Zapachy',
      price: 119, rating: 4.6, reviewsCount: 203, popularity: 88, inStock: true, colors: ['naturalny'],
      images: [photo.candle, photo.candles, photo.gift],
      lead: 'Zapach kwitnących drzewek pomarańczy z andaluzyjskich patio, zamknięty w szkle z butelkowej zieleni. Pachnie tak samo jak nasze hotelowe lobby.',
      description: 'Azahar to hiszpańska nazwa kwiatu pomarańczy. Świeca z wosku sojowego i bawełnianego knota pali się równo i czysto, a nuty kwiatowe uzupełnia delikatna gorycz skórki i odrobina drewna cedrowego.',
      specs: [['Wosk', 'Sojowy'], ['Knot', 'Bawełniany'], ['Czas palenia', 'ok. 45 godzin'], ['Pojemność', '220 g'], ['Nuty', 'Kwiat pomarańczy, skórka, cedr']],
      variant: { label: 'Zapach', options: [{ label: 'Azahar' }, { label: 'Figa i sól morska' }, { label: 'Drzewo oliwne' }] },
      reviews: [
        { author: 'Natalia R.', rating: 5, date: 'październik 2026', text: 'Zapach wrócił mnie od razu na patio w Maladze. Pali się długo i równo.' },
        { author: 'Piotr G.', rating: 4, date: 'wrzesień 2026', text: 'Bardzo przyjemna, choć w dużym salonie zapach jest subtelny.' },
      ],
    },
    {
      id: 'voucher', name: 'Voucher podarunkowy', sku: 'ESP-VOU-04', category: 'upominki', categoryLabel: 'Upominki',
      price: 500, priceFrom: true, rating: 5, reviewsCount: 41, popularity: 80, inStock: true, colors: ['bialy'],
      images: [photo.voucher, photo.gift, photo.costaBeach],
      lead: 'Drukowana karta w eleganckiej kopercie, do wykorzystania na pobyt lub dodatki w każdym z trzech hoteli. Dobry prezent dla kogoś, kto powinien tu przyjechać.',
      description: 'Voucher jest ważny 24 miesiące od daty zakupu i można go wykorzystać w Barcelonie, Maladze i Madrycie. Wysyłamy go w kopercie z ręcznie pisaną dedykacją, którą możesz podać w uwagach do zamówienia.',
      specs: [['Ważność', '24 miesiące'], ['Hotele', 'Barcelona, Malaga, Madryt'], ['Forma', 'Drukowana karta w kopercie'], ['Dedykacja', 'Gratis']],
      variant: { label: 'Wartość', options: [{ label: '500 zł' }, { label: '1000 zł', price: 1000 }, { label: '2000 zł', price: 2000 }] },
      reviews: [
        { author: 'Agnieszka M.', rating: 5, date: 'wrzesień 2026', text: 'Prezent na rocznicę rodziców. Koperta wyglądała pięknie, a wykorzystanie vouchera przy rezerwacji poszło bez problemu.' },
      ],
    },
    {
      id: 'oliwa', name: 'Oliwa z oliwek Arbequina', sku: 'ESP-OLI-05', category: 'smaki', categoryLabel: 'Smaki Hiszpanii',
      price: 69, oldPrice: 85, badge: 'Promocja', rating: 4.7, reviewsCount: 312, popularity: 96, inStock: true, colors: ['naturalny'],
      images: [photo.oil, photo.carafes, photo.gift],
      lead: 'Oliwa extra virgin tłoczona na zimno z oliwek arbequina. Łagodna, z nutą migdałów i świeżej trawy, idealna do pomidorów i chleba.',
      description: 'Wybieramy ją z małej tłoczni w Katalonii i podajemy do śniadań w naszych hotelach. Arbequina jest jedną z najłagodniejszych odmian, więc dobrze smakuje także osobom, które nie przepadają za goryczą oliwy.',
      specs: [['Odmiana', 'Arbequina'], ['Klasa', 'Extra virgin'], ['Tłoczenie', 'Na zimno'], ['Pochodzenie', 'Katalonia'], ['Przechowywanie', 'W ciemnym, chłodnym miejscu']],
      variant: { label: 'Pojemność', options: [{ label: '250 ml' }, { label: '500 ml', price: 109 }] },
      reviews: [
        { author: 'Bartek L.', rating: 5, date: 'październik 2026', text: 'Łagodna i aromatyczna. Znika u nas w tydzień.' },
        { author: 'Ewa J.', rating: 4, date: 'sierpień 2026', text: 'Świetna do sałatek. Butelka dotarła porządnie zapakowana.' },
      ],
    },
    {
      id: 'noche', name: 'Zestaw świec Noche', sku: 'ESP-SWI-06', category: 'zapachy', categoryLabel: 'Zapachy',
      price: 179, oldPrice: 219, badge: 'Promocja', rating: 4.5, reviewsCount: 58, popularity: 64, inStock: true, colors: ['naturalny'],
      images: [photo.candles, photo.candle, photo.gift],
      lead: 'Trzy niewielkie świece na hiszpańskie wieczory: bursztyn, tytoń i dojrzała figa. Razem tworzą ciepły, nieoczywisty nastrój.',
      description: 'Noche to zestaw na długie kolacje i późne rozmowy. Każda świeca pali się około 20 godzin, a szkło po wypaleniu można wykorzystać jako szklankę lub doniczkę na zioła.',
      specs: [['Zawartość', '3 świece po 90 g'], ['Wosk', 'Sojowy'], ['Czas palenia', 'ok. 20 godzin każda'], ['Nuty', 'Bursztyn, tytoń, figa']],
      variant: { label: 'Opakowanie', options: [{ label: 'Pudełko kartonowe' }, { label: 'Pudełko prezentowe', price: 199 }] },
      reviews: [
        { author: 'Julia T.', rating: 5, date: 'wrzesień 2026', text: 'Kupione na prezent, a skończyło się tak, że zostały u mnie.' },
        { author: 'Adam B.', rating: 4, date: 'lipiec 2026', text: 'Ładny zapach, tytoniowa najlepsza. Figa dość słodka.' },
      ],
    },
    {
      id: 'regalo', name: 'Zestaw upominkowy Regalo', sku: 'ESP-UPO-07', category: 'upominki', categoryLabel: 'Upominki',
      price: 249, rating: 4.8, reviewsCount: 97, popularity: 76, inStock: true, colors: ['naturalny'],
      images: [photo.gift, photo.oil, photo.candle],
      lead: 'Gotowy prezent z Hiszpanii: oliwa arbequina, świeca Azahar i słoik migdałów marcona, zapakowane w kartonowe pudełko ze wstążką.',
      description: 'Regalo pakujemy ręcznie i wysyłamy z miejscem na krótką dedykację. Nie trzeba niczego dobierać ani owijać, wystarczy podać adres obdarowanej osoby.',
      specs: [['Zawartość', 'Oliwa 250 ml, świeca 220 g, migdały 150 g'], ['Opakowanie', 'Karton ze wstążką'], ['Dedykacja', 'Gratis']],
      variant: { label: 'Wstążka', options: [{ label: 'Różowa' }, { label: 'Zielona' }] },
      reviews: [
        { author: 'Dominika H.', rating: 5, date: 'październik 2026', text: 'Elegancko zapakowane i od razu gotowe do wręczenia.' },
        { author: 'Krzysztof N.', rating: 5, date: 'wrzesień 2026', text: 'Trafiony prezent dla teściów, oliwa zniknęła pierwsza.' },
      ],
    },
    {
      id: 'blanca', name: 'Kubki Blanca, 2 szt.', sku: 'ESP-CER-08', category: 'dom', categoryLabel: 'Dom i stół',
      price: 99, oldPrice: 129, badge: 'Promocja', rating: 4.4, reviewsCount: 73, popularity: 58, inStock: true, colors: ['bialy'],
      images: [photo.cups, photo.alba, photo.plates],
      lead: 'Dwa smukłe kubki z białej porcelany o gładkim, matowym wykończeniu. Na kawę z mlekiem pitą bez pośpiechu.',
      description: 'Blanca to prosty kształt z wygodnym uchem, który dobrze leży w dłoni. Grube ścianki długo trzymają ciepło, a matowe szkliwo nie zostawia śladów po kawie.',
      specs: [['Materiał', 'Porcelana'], ['Zawartość', '2 kubki'], ['Pojemność', '300 ml'], ['Zmywarka', 'Tak'], ['Mikrofalówka', 'Tak']],
      variant: { label: 'Zestaw', options: [{ label: '2 sztuki' }, { label: '4 sztuki', price: 189 }] },
      reviews: [
        { author: 'Weronika Z.', rating: 4, date: 'wrzesień 2026', text: 'Ładne i proste. Trochę cięższe, niż się spodziewałam.' },
        { author: 'Paweł C.', rating: 5, date: 'czerwiec 2026', text: 'Kawa długo pozostaje w nich gorąca. Polecam.' },
      ],
    },
    {
      id: 'karafki', name: 'Karafki do oliwy i octu', sku: 'ESP-SZK-09', category: 'smaki', categoryLabel: 'Smaki Hiszpanii',
      price: 139, rating: 4.3, reviewsCount: 39, popularity: 42, inStock: false, colors: ['naturalny'],
      images: [photo.carafes, photo.oil, photo.alba],
      lead: 'Dwie dmuchane karafki ze szklanymi korkami, które na stole wyglądają jak mała rzeźba. Wykonywane na zamówienie, wysyłamy w ciągu 10 dni.',
      description: 'Każdą parę wykonuje rzemieślnik z Katalonii, dlatego drobne pęcherzyki w szkle są zupełnie naturalne. Wąska szyjka pozwala nalewać oliwę cienkim strumieniem.',
      specs: [['Materiał', 'Szkło dmuchane'], ['Zawartość', '2 karafki z korkami'], ['Pojemność', '250 ml każda'], ['Realizacja', 'Na zamówienie, do 10 dni']],
      variant: { label: 'Zestaw', options: [{ label: 'Para karafek' }] },
      reviews: [
        { author: 'Monika F.', rating: 4, date: 'sierpień 2026', text: 'Piękne na stole, ale korki wymagają delikatnego traktowania.' },
      ],
    },
    {
      id: 'sol', name: 'Talerze malowane Sol', sku: 'ESP-CER-10', category: 'dom', categoryLabel: 'Dom i stół',
      price: 199, badge: 'Nowość', rating: 4.7, reviewsCount: 66, popularity: 70, inStock: true, colors: ['wielokolorowy'],
      images: [photo.plates, photo.alba, photo.cups],
      lead: 'Dwa ręcznie malowane talerze w kolorach południa. Każdy powstaje osobno, więc nigdy nie dostaniesz dwóch identycznych.',
      description: 'Sol powstają w rodzinnej pracowni ceramicznej, która maluje je pędzlem na surowym szkliwie. Świetnie wyglądają zarówno na stole, jak i na ścianie, a szkliwo jest bezpieczne w kontakcie z żywnością.',
      specs: [['Materiał', 'Ceramika szkliwiona'], ['Zawartość', '2 talerze'], ['Średnica', '24 cm'], ['Mycie', 'Zalecane ręczne']],
      variant: { label: 'Paleta', options: [{ label: 'Słońce i terakota' }, { label: 'Morze i oliwka' }] },
      reviews: [
        { author: 'Iga W.', rating: 5, date: 'październik 2026', text: 'Kolory są intensywniejsze niż na zdjęciu. Wiszą u nas w kuchni.' },
        { author: 'Rafał S.', rating: 4, date: 'wrzesień 2026', text: 'Ładne rzemiosło, a różnice między talerzami dodają im uroku.' },
      ],
    },
  ];

  const rooms = [
    { id: 'classic', name: 'Pokój Classic', capacity: 2, price: 420, area: 'ok. 22 m²', bed: 'łóżko podwójne', image: 'assets/images/room-classic.webp', alt: 'Jasny pokój z podwójnym łóżkiem i białą pościelą', text: 'Jasne wnętrze z naturalnymi tkaninami i rękodziełem.' },
    { id: 'deluxe', name: 'Pokój Deluxe', capacity: 2, price: 560, area: 'ok. 30 m²', bed: 'łóżko king-size', image: 'assets/images/room-deluxe.webp', alt: 'Przestronny pokój z lnianą pościelą i rzeźbionym panelem nad łóżkiem', text: 'Więcej przestrzeni, rzeźbione detale i len w odcieniach piasku.' },
    { id: 'junior', name: 'Junior Suite', capacity: 3, price: 720, area: 'ok. 38 m²', bed: 'king-size + sofa', image: 'assets/images/room-junior.webp', alt: 'Sypialnia z łukowymi oknami wychodzącymi na zieleń', text: 'Łukowe okna, grube ściany i strefa wypoczynku.' },
    { id: 'suite', name: 'Suite z balkonem', capacity: 4, price: 980, area: 'ok. 48 m²', bed: 'balkon', image: 'assets/images/room-suite.webp', alt: 'Otwarte drzwi balkonowe z widokiem na morze o zmierzchu', text: 'Prywatny balkon i najwięcej przestrzeni.' },
  ];

  // unit: person-night = za osobę za noc, night = za noc, stay = jednorazowo
  const extras = [
    { id: 'breakfast', name: 'Śniadanie w patio', text: 'Świeże pieczywo, owoce, oliwa i kawa podawane do 11:00.', price: 59, unit: 'person-night', unitLabel: 'os. / noc', icon: 'bi-cup-hot' },
    { id: 'transfer', name: 'Transfer z lotniska', text: 'Kierowca czeka w hali przylotów z tabliczką.', price: 180, unit: 'stay', unitLabel: 'za przejazd', icon: 'bi-car-front' },
    { id: 'late', name: 'Późne wymeldowanie', text: 'Pokój zostaje Twój do 16:00 w dniu wyjazdu.', price: 90, unit: 'stay', unitLabel: 'jednorazowo', icon: 'bi-clock' },
    { id: 'parking', name: 'Miejsce parkingowe', text: 'Strzeżony parking w garażu hotelu.', price: 70, unit: 'night', unitLabel: 'za noc', icon: 'bi-p-square' },
    { id: 'cava', name: 'Cava i owoce w pokoju', text: 'Czekają schłodzone na Twój przyjazd.', price: 120, unit: 'stay', unitLabel: 'jednorazowo', icon: 'bi-gift' },
  ];

  // Wycieczki zależą od miasta — mają termin, dlatego wybiera się je przy rezerwacji, a nie w sklepie
  const excursions = {
    barcelona: [
      { id: 'bcn-gaudi', name: 'Sagrada Família i Park Güell', text: 'Pół dnia z przewodnikiem, bilety bez kolejki.', price: 249, duration: '5 godzin' },
      { id: 'bcn-rejs', name: 'Rejs o zachodzie słońca', text: 'Katamaran wzdłuż wybrzeża, kieliszek cavy na pokładzie.', price: 199, duration: '2 godziny' },
      { id: 'bcn-tapas', name: 'Warsztaty tapas w Dzielnicy Gotyckiej', text: 'Zakupy na targu La Boqueria i wspólne gotowanie.', price: 229, duration: '3 godziny' },
    ],
    malaga: [
      { id: 'agp-alhambra', name: 'Alhambra w Granadzie', text: 'Całodniowa wycieczka autokarem z biletami wstępu.', price: 389, duration: '10 godzin' },
      { id: 'agp-caminito', name: 'Szlak Caminito del Rey', text: 'Kładki nad wąwozem z transferem i przewodnikiem.', price: 299, duration: '6 godzin' },
      { id: 'agp-ronda', name: 'Ronda i degustacja win', text: 'Miasto nad przepaścią i wizyta w lokalnej winnicy.', price: 269, duration: '8 godzin' },
    ],
    madryt: [
      { id: 'mad-prado', name: 'Prado z przewodnikiem', text: 'Velázquez, Goya i El Greco w małej grupie.', price: 179, duration: '2,5 godziny' },
      { id: 'mad-toledo', name: 'Toledo w jeden dzień', text: 'Średniowieczne miasto trzech kultur z transferem.', price: 279, duration: '8 godzin' },
      { id: 'mad-flamenco', name: 'Wieczór flamenco', text: 'Kameralny występ w tablao i kolacja z tapas.', price: 219, duration: '3 godziny' },
    ],
  };

  const cities = {
    barcelona: { name: 'Barcelona', hotel: 'e-spania Barcelona', locative: 'w Barcelonie' },
    malaga: { name: 'Malaga', hotel: 'e-spania Malaga', locative: 'w Maladze' },
    madryt: { name: 'Madryt', hotel: 'e-spania Madryt', locative: 'w Madrycie' },
  };

  const delivery = {
    kurier: { name: 'Kurier', price: 14.9 },
    paczkomat: { name: 'Paczkomat', price: 9.9 },
    odbior: { name: 'Odbiór osobisty', price: 0 },
  };

  const payments = { blik: 'BLIK', karta: 'Karta płatnicza', przelew: 'Szybki przelew' };

  const discountCodes = { HOLA10: 0.1 };

  return { products, rooms, extras, excursions, cities, delivery, payments, discountCodes };
})();
