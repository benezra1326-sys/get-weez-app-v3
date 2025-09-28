// Base de données enrichie avec de vrais établissements et événements de Marbella

export const establishments = [
  // Restaurants haut de gamme
  {
    id: 1,
    name: "Nobu Marbella",
    type: "Restaurant",
    category: "Japonais",
    description: "Restaurant japonais de luxe avec vue sur la mer",
    address: "Bulevar Príncipe Alfonso de Hohenlohe, 29602 Marbella",
    phone: "+34 952 77 48 00",
    whatsapp: "+34 952 77 48 00",
    website: "https://noburestaurants.com/marbella",
    instagram: "https://instagram.com/nobumarbella",
    social_media: {
      instagram: "https://instagram.com/nobumarbella",
      facebook: "https://facebook.com/nobumarbella",
      twitter: "https://twitter.com/nobumarbella"
    },
    rating: 4.8,
    price_range: "€€€€",
    specialties: ["Sushi", "Sashimi", "Tempura", "Wagyu", "Miso Soup", "Edamame", "Toro", "Uni", "Truffle", "Foie Gras"],
    dishes: [
      "Sushi Omakase (€120)",
      "Wagyu Beef (€85)",
      "Black Cod Miso (€45)",
      "Toro Sashimi (€35)",
      "Uni Sushi (€25)",
      "Truffle Tempura (€30)",
      "Edamame (€8)",
      "Miso Soup (€12)"
    ],
    menu: {
      entrees: [
        { name: "Edamame", price: 8, description: "Haricots de soja salés" },
        { name: "Miso Soup", price: 12, description: "Soupe de miso traditionnelle" },
        { name: "Truffle Tempura", price: 30, description: "Tempura de truffe noire" }
      ],
      sushi: [
        { name: "Sushi Omakase", price: 120, description: "Sélection du chef - 12 pièces" },
        { name: "Toro Sashimi", price: 35, description: "Sashimi de thon gras" },
        { name: "Uni Sushi", price: 25, description: "Sushi d'oursin frais" }
      ],
      plats: [
        { name: "Wagyu Beef", price: 85, description: "Bœuf wagyu grillé" },
        { name: "Black Cod Miso", price: 45, description: "Cabillaud noir au miso" }
      ]
    },
    services: [
      "Réservation VIP",
      "Service en terrasse",
      "Menu dégustation",
      "Chef privé sur demande",
      "Accompagnement sommelier",
      "Transport privé"
    ],
    ambiance: "Luxueux, Vue mer, Intime",
    capacity: 80,
    sponsored: true,
    opening_hours: "19:00-23:00",
    features: ["Terrasse", "Vue mer", "Parking", "WiFi", "Climatisation"],
    coordinates: {
      lat: 36.5101,
      lng: -4.8828
    },
    zone: "Golden Mile"
  },
  {
    id: 2,
    name: "La Terraza del Mar",
    type: "Restaurant",
    category: "Méditerranéen",
    description: "Cuisine méditerranéenne avec terrasse panoramique",
    address: "Playa de la Fontanilla, 29602 Marbella",
    phone: "+34 952 77 48 01",
    whatsapp: "+34 952 77 48 01",
    website: "https://laterrazadelmar.com",
    rating: 4.7,
    price_range: "€€€",
    specialties: ["Paella", "Poisson grillé", "Tapas", "Sangria", "Gazpacho", "Jamón Ibérico", "Pulpo", "Gambas", "Tortilla", "Churros"],
    dishes: [
      "Paella Valenciana (€45)",
      "Dorada a la Sal (€35)",
      "Jamón Ibérico (€25)",
      "Pulpo a la Gallega (€28)",
      "Gambas al Ajillo (€18)",
      "Gazpacho (€8)",
      "Tortilla Española (€12)",
      "Churros con Chocolate (€8)"
    ],
    menu: {
      entrees: [
        { name: "Gazpacho", price: 8, description: "Soupe froide andalouse" },
        { name: "Jamón Ibérico", price: 25, description: "Jambon ibérique de bellota" },
        { name: "Gambas al Ajillo", price: 18, description: "Crevettes à l'ail" }
      ],
      plats: [
        { name: "Paella Valenciana", price: 45, description: "Paella traditionnelle valencienne" },
        { name: "Dorada a la Sal", price: 35, description: "Dorade cuite au sel" },
        { name: "Pulpo a la Gallega", price: 28, description: "Poulpe à la galicienne" }
      ],
      desserts: [
        { name: "Churros con Chocolate", price: 8, description: "Churros avec chocolat chaud" },
        { name: "Tortilla Española", price: 12, description: "Omelette espagnole traditionnelle" }
      ]
    },
    services: [
      "Réservation terrasse",
      "Menu dégustation méditerranéen",
      "Service romantique",
      "Accompagnement sommelier",
      "Transport privé",
      "Cours de cuisine"
    ],
    ambiance: "Romantique, Vue mer, Terrasse",
    capacity: 120,
    sponsored: false,
    opening_hours: "12:00-16:00, 19:00-23:00",
    features: ["Terrasse", "Vue mer", "Parking", "WiFi", "Climatisation", "Musique live"]
  },
  {
    id: 3,
    name: "Ocean Club",
    type: "Restaurant/Club",
    category: "International",
    description: "Restaurant-club avec DJ et ambiance festive",
    address: "Puerto Banús, 29660 Marbella",
    phone: "+34 952 77 48 02",
    rating: 4.6,
    price_range: "€€€€",
    specialties: ["Cocktails", "Cuisine fusion", "DJ sets", "Brunch"],
    ambiance: "Festif, Moderne, Animé",
    capacity: 200,
    sponsored: true
  },
  {
    id: 4,
    name: "El Lago",
    type: "Restaurant",
    category: "Espagnol",
    description: "Restaurant traditionnel espagnol au cœur de Marbella",
    address: "Calle Aduar, 12, 29601 Marbella",
    phone: "+34 952 77 48 03",
    rating: 4.5,
    price_range: "€€",
    specialties: ["Gazpacho", "Jambon ibérique", "Tortilla", "Flan"],
    ambiance: "Traditionnel, Familial, Authentique",
    capacity: 60,
    sponsored: false
  },
  {
    id: 5,
    name: "Sake Bar Marbella",
    type: "Restaurant/Bar",
    category: "Japonais",
    description: "Bar à sushis intime avec sélection de sakés",
    address: "Golden Mile, 29602 Marbella",
    phone: "+34 952 77 48 04",
    rating: 4.4,
    price_range: "€€€",
    specialties: ["Sushi", "Sashimi", "Saké", "Ramen"],
    ambiance: "Intime, Moderne, Sophistiqué",
    capacity: 40,
    sponsored: false
  },
  {
    id: 6,
    name: "Trocadero Arena",
    type: "Restaurant/Club",
    category: "International",
    description: "Restaurant-club avec piscine et vue panoramique",
    address: "Playa de la Fontanilla, 29602 Marbella",
    phone: "+34 952 77 48 05",
    rating: 4.3,
    price_range: "€€€€",
    specialties: ["Brunch", "Cocktails", "Piscine", "DJ"],
    ambiance: "Luxueux, Piscine, Panoramique",
    capacity: 150,
    sponsored: true
  },
  {
    id: 7,
    name: "Casa Tua",
    type: "Restaurant",
    category: "Italien",
    description: "Cuisine italienne authentique dans un cadre élégant",
    address: "Calle Aduar, 8, 29601 Marbella",
    phone: "+34 952 77 48 06",
    rating: 4.6,
    price_range: "€€€",
    specialties: ["Pizza", "Pasta", "Risotto", "Tiramisu"],
    ambiance: "Élégant, Romantique, Authentique",
    capacity: 50,
    sponsored: false
  },
  {
    id: 8,
    name: "Marbella Club Hotel Restaurant",
    type: "Restaurant",
    category: "International",
    description: "Restaurant gastronomique dans l'hôtel mythique",
    address: "Bulevar Príncipe Alfonso de Hohenlohe, 29602 Marbella",
    phone: "+34 952 77 48 07",
    whatsapp: "+34 952 77 48 07",
    website: "https://marbellaclub.com",
    rating: 4.9,
    price_range: "€€€€€",
    specialties: ["Gastronomie", "Vins", "Dégustation", "Chef étoilé", "Truffle", "Caviar", "Foie Gras", "Lobster", "Wagyu"],
    dishes: [
      "Menu Dégustation (€180)",
      "Lobster Thermidor (€95)",
      "Wagyu Beef (€120)",
      "Truffle Risotto (€65)",
      "Caviar Service (€150)",
      "Foie Gras (€45)",
      "Wine Pairing (€80)"
    ],
    ambiance: "Luxueux, Gastronomique, Historique",
    capacity: 80,
    sponsored: true,
    opening_hours: "19:30-23:30",
    features: ["Terrasse", "Vue mer", "Parking", "WiFi", "Climatisation", "Sommelier", "Chef étoilé"]
  },
  // Nouveaux restaurants ajoutés
  {
    id: 9,
    name: "Bamboo Marbella",
    type: "Restaurant",
    category: "Asiatique",
    description: "Restaurant asiatique moderne avec terrasse",
    address: "Puerto Banús, 29660 Marbella",
    phone: "+34 952 77 48 08",
    whatsapp: "+34 952 77 48 08",
    website: "https://bamboomarbella.com",
    rating: 4.5,
    price_range: "€€€",
    specialties: ["Pad Thai", "Sushi", "Ramen", "Dumplings", "Curry", "Stir Fry", "Spring Rolls", "Miso"],
    dishes: [
      "Pad Thai (€18)",
      "Ramen Tonkotsu (€22)",
      "Sushi Roll (€15)",
      "Dumplings (€12)",
      "Green Curry (€16)",
      "Spring Rolls (€8)",
      "Miso Soup (€6)"
    ],
    ambiance: "Moderne, Décontracté, Terrasse",
    capacity: 60,
    sponsored: false,
    opening_hours: "12:00-15:00, 19:00-23:00",
    features: ["Terrasse", "WiFi", "Climatisation", "Musique"]
  },
  {
    id: 10,
    name: "El Paseo",
    type: "Restaurant",
    category: "Espagnol",
    description: "Restaurant traditionnel espagnol au centre-ville",
    address: "Calle Aduar, 15, 29601 Marbella",
    phone: "+34 952 77 48 09",
    whatsapp: "+34 952 77 48 09",
    website: "https://elpaseomarbella.com",
    rating: 4.4,
    price_range: "€€",
    specialties: ["Tapas", "Paella", "Gazpacho", "Tortilla", "Churros", "Sangria", "Jamón", "Pulpo"],
    dishes: [
      "Paella Mixta (€35)",
      "Tapas Variadas (€25)",
      "Gazpacho (€6)",
      "Tortilla Española (€10)",
      "Jamón Ibérico (€20)",
      "Pulpo a la Gallega (€18)",
      "Sangria (€8)"
    ],
    ambiance: "Traditionnel, Familial, Authentique",
    capacity: 45,
    sponsored: false,
    opening_hours: "12:00-16:00, 19:00-23:00",
    features: ["Terrasse", "WiFi", "Climatisation"]
  },
  {
    id: 11,
    name: "The Beach House",
    type: "Restaurant/Bar",
    category: "International",
    description: "Restaurant-bar sur la plage avec vue mer",
    address: "Playa de la Fontanilla, 29602 Marbella",
    phone: "+34 952 77 48 10",
    whatsapp: "+34 952 77 48 10",
    website: "https://thebeachhousemarbella.com",
    rating: 4.6,
    price_range: "€€€",
    specialties: ["Seafood", "Cocktails", "Grilled Fish", "Lobster", "Prawns", "Ceviche", "Oysters", "Champagne"],
    dishes: [
      "Lobster Thermidor (€45)",
      "Grilled Sea Bass (€28)",
      "Prawn Cocktail (€18)",
      "Ceviche (€15)",
      "Oysters (€24)",
      "Champagne (€15)",
      "Cocktails (€12)"
    ],
    ambiance: "Plage, Décontracté, Vue mer",
    capacity: 100,
    sponsored: true,
    opening_hours: "10:00-02:00",
    features: ["Plage", "Vue mer", "Terrasse", "WiFi", "Climatisation", "DJ"]
  },
  {
    id: 12,
    name: "La Dolce Vita",
    type: "Restaurant",
    category: "Italien",
    description: "Cuisine italienne authentique avec terrasse",
    address: "Golden Mile, 29602 Marbella",
    phone: "+34 952 77 48 11",
    whatsapp: "+34 952 77 48 11",
    website: "https://ladolcevitamarbella.com",
    rating: 4.7,
    price_range: "€€€",
    specialties: ["Pizza", "Pasta", "Risotto", "Tiramisu", "Gelato", "Prosecco", "Truffle", "Burrata"],
    dishes: [
      "Pizza Margherita (€16)",
      "Pasta Carbonara (€18)",
      "Risotto ai Funghi (€22)",
      "Tiramisu (€8)",
      "Gelato (€6)",
      "Burrata (€14)",
      "Prosecco (€12)"
    ],
    ambiance: "Italien, Romantique, Terrasse",
    capacity: 70,
    sponsored: false,
    opening_hours: "12:00-15:00, 19:00-23:00",
    features: ["Terrasse", "WiFi", "Climatisation", "Musique italienne"]
  },
  {
    id: 13,
    name: "Sushi Zen",
    type: "Restaurant",
    category: "Japonais",
    description: "Sushi bar intime avec chef japonais",
    address: "Calle Aduar, 20, 29601 Marbella",
    phone: "+34 952 77 48 12",
    whatsapp: "+34 952 77 48 12",
    website: "https://sushizenmarbella.com",
    rating: 4.8,
    price_range: "€€€€",
    specialties: ["Sushi", "Sashimi", "Sake", "Ramen", "Tempura", "Miso", "Edamame", "Uni"],
    dishes: [
      "Sushi Omakase (€80)",
      "Sashimi Platter (€35)",
      "Ramen Tonkotsu (€18)",
      "Tempura (€15)",
      "Sake Tasting (€25)",
      "Uni Sushi (€20)",
      "Miso Soup (€6)"
    ],
    ambiance: "Intime, Sophistiqué, Moderne",
    capacity: 30,
    sponsored: false,
    opening_hours: "19:00-23:00",
    features: ["WiFi", "Climatisation", "Chef japonais", "Sake bar"]
  },
  {
    id: 14,
    name: "The Rooftop",
    type: "Restaurant/Bar",
    category: "International",
    description: "Rooftop bar avec vue panoramique sur Marbella",
    address: "Puerto Banús, 29660 Marbella",
    phone: "+34 952 77 48 13",
    whatsapp: "+34 952 77 48 13",
    website: "https://therooftopmarbella.com",
    rating: 4.5,
    price_range: "€€€€",
    specialties: ["Cocktails", "Tapas", "Grilled Meat", "Seafood", "Champagne", "Wine", "DJ", "Sunset"],
    dishes: [
      "Grilled Octopus (€22)",
      "Wagyu Beef (€45)",
      "Lobster Roll (€28)",
      "Cocktails (€15)",
      "Champagne (€20)",
      "Tapas Selection (€25)",
      "Wine Selection (€30)"
    ],
    ambiance: "Rooftop, Panoramique, Moderne",
    capacity: 120,
    sponsored: true,
    opening_hours: "18:00-02:00",
    features: ["Rooftop", "Vue panoramique", "DJ", "WiFi", "Climatisation", "Terrasse"]
  },
  {
    id: 15,
    name: "Café Central",
    type: "Café/Restaurant",
    category: "International",
    description: "Café-restaurant au cœur de Marbella",
    address: "Plaza de los Naranjos, 29601 Marbella",
    phone: "+34 952 77 48 14",
    whatsapp: "+34 952 77 48 14",
    website: "https://cafecentralmarbella.com",
    rating: 4.3,
    price_range: "€€",
    specialties: ["Coffee", "Breakfast", "Brunch", "Sandwiches", "Salads", "Pastries", "Smoothies", "Tea"],
    dishes: [
      "Full English Breakfast (€15)",
      "Avocado Toast (€12)",
      "Caesar Salad (€14)",
      "Club Sandwich (€16)",
      "Croissant (€4)",
      "Smoothie Bowl (€10)",
      "Coffee (€3)"
    ],
    ambiance: "Décontracté, Familial, Centre-ville",
    capacity: 50,
    sponsored: false,
    opening_hours: "08:00-18:00",
    features: ["WiFi", "Climatisation", "Terrasse", "Petit-déjeuner"]
  }
]

export const events = [
  // Événements d'août 2024 - Soirées et DJ
  {
    id: 1,
    name: "Sunset Sessions at Ocean Club",
    type: "Événement musical",
    date: "2024-08-01",
    time: "19:00",
    location: "Ocean Club, Puerto Banús",
    description: "Session musicale au coucher du soleil avec DJ international",
    price: 50,
    capacity: 200,
    category: "Musique",
    dress_code: "Smart casual",
    age_restriction: "18+",
    includes: ["Cocktail de bienvenue", "DJ set", "Vue coucher de soleil"],
    dj: "DJ Carlos Mendoza",
    music_style: "Deep House, Progressive"
  },
  {
    id: 2,
    name: "Beach Party at The Beach House",
    type: "Soirée plage",
    date: "2024-08-02",
    time: "20:00",
    location: "The Beach House, Playa de la Fontanilla",
    description: "Soirée plage avec DJ et cocktails",
    price: 35,
    capacity: 150,
    category: "Musique",
    dress_code: "Décontracté",
    age_restriction: "18+",
    includes: ["Cocktails", "DJ set", "Plage", "Sunset"],
    dj: "DJ Maria Santos",
    music_style: "House, Tech House"
  },
  {
    id: 3,
    name: "Rooftop Sessions at The Rooftop",
    type: "Événement rooftop",
    date: "2024-08-03",
    time: "21:00",
    location: "The Rooftop, Puerto Banús",
    description: "Soirée rooftop avec vue panoramique et DJ",
    price: 60,
    capacity: 120,
    category: "Musique",
    dress_code: "Élégant",
    age_restriction: "21+",
    includes: ["Vue panoramique", "DJ set", "Cocktails premium"],
    dj: "DJ Alex Thompson",
    music_style: "Electronic, Ambient"
  },
  {
    id: 4,
    name: "Latin Night at El Lago",
    type: "Soirée latino",
    date: "2024-08-04",
    time: "22:00",
    location: "El Lago, Centre-ville",
    description: "Soirée latino avec musique live et danse",
    price: 25,
    capacity: 80,
    category: "Musique",
    dress_code: "Décontracté",
    age_restriction: "18+",
    includes: ["Musique live", "Cocktails", "Danse", "Tapas"],
    dj: "DJ Roberto Silva",
    music_style: "Salsa, Bachata, Reggaeton"
  },
  {
    id: 5,
    name: "Deep House Night at Trocadero Arena",
    type: "Soirée club",
    date: "2024-08-05",
    time: "23:00",
    location: "Trocadero Arena, Playa de la Fontanilla",
    description: "Soirée club avec piscine et DJ international",
    price: 40,
    capacity: 200,
    category: "Musique",
    dress_code: "Smart casual",
    age_restriction: "21+",
    includes: ["Piscine", "DJ set", "Cocktails", "Vue mer"],
    dj: "DJ Markus Weber",
    music_style: "Deep House, Minimal"
  },
  {
    id: 6,
    name: "Jazz & Wine at Marbella Club Hotel",
    type: "Soirée jazz",
    date: "2024-08-06",
    time: "20:30",
    location: "Marbella Club Hotel Restaurant",
    description: "Soirée jazz avec dégustation de vins",
    price: 80,
    capacity: 60,
    category: "Musique",
    dress_code: "Élégant",
    age_restriction: "21+",
    includes: ["Jazz live", "Dégustation vins", "Dîner gastronomique"],
    dj: "Jazz Trio Barcelona",
    music_style: "Jazz, Blues, Soul"
  },
  {
    id: 7,
    name: "Tech House Night at Ocean Club",
    type: "Soirée club",
    date: "2024-08-07",
    time: "22:00",
    location: "Ocean Club, Puerto Banús",
    description: "Soirée tech house avec DJ international",
    price: 45,
    capacity: 200,
    category: "Musique",
    dress_code: "Smart casual",
    age_restriction: "18+",
    includes: ["DJ set", "Cocktails", "Ambiance festive"],
    dj: "DJ Sarah Chen",
    music_style: "Tech House, Progressive"
  },
  {
    id: 8,
    name: "Sunset Vibes at La Terraza del Mar",
    type: "Soirée romantique",
    date: "2024-08-08",
    time: "19:30",
    location: "La Terraza del Mar",
    description: "Soirée romantique avec vue coucher de soleil",
    price: 55,
    capacity: 80,
    category: "Musique",
    dress_code: "Élégant",
    age_restriction: "18+",
    includes: ["Vue coucher de soleil", "DJ set", "Dîner romantique"],
    dj: "DJ Elena Rodriguez",
    music_style: "Chillout, Ambient, Lounge"
  },
  {
    id: 9,
    name: "Reggaeton Night at Bamboo Marbella",
    type: "Soirée latino",
    date: "2024-08-09",
    time: "21:00",
    location: "Bamboo Marbella, Puerto Banús",
    description: "Soirée reggaeton avec DJ latino",
    price: 30,
    capacity: 100,
    category: "Musique",
    dress_code: "Décontracté",
    age_restriction: "18+",
    includes: ["DJ set", "Cocktails", "Danse", "Ambiance latino"],
    dj: "DJ Carlos Mendez",
    music_style: "Reggaeton, Latin Trap, Urban"
  },
  {
    id: 10,
    name: "Progressive House at The Rooftop",
    type: "Soirée progressive",
    date: "2024-08-10",
    time: "22:00",
    location: "The Rooftop, Puerto Banús",
    description: "Soirée progressive house avec vue panoramique",
    price: 65,
    capacity: 120,
    category: "Musique",
    dress_code: "Élégant",
    age_restriction: "21+",
    includes: ["Vue panoramique", "DJ set", "Cocktails premium"],
    dj: "DJ Thomas Anderson",
    music_style: "Progressive House, Trance"
  },
  {
    id: 11,
    name: "Afro House Night at Trocadero Arena",
    type: "Soirée afro",
    date: "2024-08-11",
    time: "23:00",
    location: "Trocadero Arena, Playa de la Fontanilla",
    description: "Soirée afro house avec piscine",
    price: 35,
    capacity: 180,
    category: "Musique",
    dress_code: "Décontracté",
    age_restriction: "18+",
    includes: ["Piscine", "DJ set", "Cocktails", "Ambiance afro"],
    dj: "DJ Kwame Asante",
    music_style: "Afro House, Amapiano, Tribal"
  },
  {
    id: 12,
    name: "Chillout Session at Sake Bar",
    type: "Soirée chillout",
    date: "2024-08-12",
    time: "20:00",
    location: "Sake Bar Marbella, Centre-ville",
    description: "Soirée chillout avec saké et sushi",
    price: 45,
    capacity: 40,
    category: "Musique",
    dress_code: "Smart casual",
    age_restriction: "18+",
    includes: ["Saké dégustation", "Sushi", "DJ set", "Ambiance zen"],
    dj: "DJ Yuki Tanaka",
    music_style: "Chillout, Ambient, Downtempo"
  },
  {
    id: 13,
    name: "Minimal Techno at Ocean Club",
    type: "Soirée techno",
    date: "2024-08-13",
    time: "23:30",
    location: "Ocean Club, Puerto Banús",
    description: "Soirée minimal techno avec DJ international",
    price: 50,
    capacity: 150,
    category: "Musique",
    dress_code: "Smart casual",
    age_restriction: "18+",
    includes: ["DJ set", "Cocktails", "Ambiance techno"],
    dj: "DJ Klaus Mueller",
    music_style: "Minimal Techno, Industrial"
  },
  {
    id: 14,
    name: "Soul & Funk Night at El Paseo",
    type: "Soirée soul",
    date: "2024-08-14",
    time: "21:00",
    location: "El Paseo, Centre-ville",
    description: "Soirée soul et funk avec musique live",
    price: 20,
    capacity: 60,
    category: "Musique",
    dress_code: "Décontracté",
    age_restriction: "18+",
    includes: ["Musique live", "Cocktails", "Tapas", "Ambiance soul"],
    dj: "Soul Band Marbella",
    music_style: "Soul, Funk, R&B"
  },
  {
    id: 15,
    name: "Sunset Deep House at The Beach House",
    type: "Soirée plage",
    date: "2024-08-15",
    time: "19:00",
    location: "The Beach House, Playa de la Fontanilla",
    description: "Soirée deep house sur la plage au coucher du soleil",
    price: 40,
    capacity: 120,
    category: "Musique",
    dress_code: "Décontracté",
    age_restriction: "18+",
    includes: ["Plage", "Sunset", "DJ set", "Cocktails"],
    dj: "DJ Sofia Martinez",
    music_style: "Deep House, Melodic Techno"
  }
]

export const activities = [
  {
    id: 1,
    name: "Golf à Marbella Club",
    type: "Sport",
    description: "Parcours de golf 18 trous avec vue sur la mer",
    duration: "4h",
    price: 150,
    difficulty: "Intermédiaire",
    includes: ["Équipement", "Caddy", "Club house"]
  },
  {
    id: 2,
    name: "Spa day au Marbella Club Hotel",
    type: "Bien-être",
    description: "Journée spa avec massages et soins",
    duration: "3h",
    price: 200,
    difficulty: "Facile",
    includes: ["Massage", "Sauna", "Piscine", "Déjeuner"]
  },
  {
    id: 3,
    name: "Excursion en bateau",
    type: "Loisir",
    description: "Croisière le long de la côte de Marbella",
    duration: "2h",
    price: 80,
    difficulty: "Facile",
    includes: ["Bateau", "Capitaine", "Boissons", "Snorkeling"]
  }
]

// Classification des restaurants par style
export const restaurantStyles = {
  romantic: {
    name: "Romantique",
    description: "Endroits parfaits pour un dîner en couple",
    icon: "💕",
    restaurants: [1, 2, 7, 8, 12], // Nobu, La Terraza, Casa Tua, Marbella Club, La Dolce Vita
    characteristics: ["Vue mer", "Ambiance intime", "Éclairage tamisé", "Musique douce"]
  },
  luxury: {
    name: "Luxueux",
    description: "Restaurants haut de gamme et exclusifs",
    icon: "👑",
    restaurants: [1, 3, 6, 8, 14], // Nobu, Ocean Club, Trocadero, Marbella Club, The Rooftop
    characteristics: ["Service premium", "Cuisine gastronomique", "Décor raffiné", "Prix élevés"]
  },
  casual: {
    name: "Décontracté",
    description: "Endroits relaxants et sans prétention",
    icon: "😌",
    restaurants: [4, 9, 10, 15], // El Lago, Bamboo, El Paseo, Café Central
    characteristics: ["Ambiance détendue", "Prix modérés", "Service simple", "Décor informel"]
  },
  trendy: {
    name: "Branché",
    description: "Endroits à la mode et modernes",
    icon: "🔥",
    restaurants: [3, 6, 11, 14], // Ocean Club, Trocadero, The Beach House, The Rooftop
    characteristics: ["Design moderne", "DJ", "Ambiance festive", "Clientèle jeune"]
  },
  traditional: {
    name: "Traditionnel",
    description: "Cuisine authentique et locale",
    icon: "🏛️",
    restaurants: [4, 10], // El Lago, El Paseo
    characteristics: ["Cuisine locale", "Décor traditionnel", "Recettes authentiques", "Ambiance familiale"]
  },
  international: {
    name: "International",
    description: "Cuisine du monde et fusion",
    icon: "🌍",
    restaurants: [1, 3, 5, 8, 9, 11, 12, 13, 14], // Nobu, Ocean Club, Sake Bar, Marbella Club, Bamboo, The Beach House, La Dolce Vita, Sushi Zen, The Rooftop
    characteristics: ["Cuisine variée", "Influences multiples", "Menu diversifié", "Clientèle internationale"]
  },
  beachfront: {
    name: "Face à la mer",
    description: "Restaurants avec vue sur la mer",
    icon: "🌊",
    restaurants: [1, 2, 6, 8, 11], // Nobu, La Terraza, Trocadero, Marbella Club, The Beach House
    characteristics: ["Vue mer", "Terrasse", "Ambiance maritime", "Fruits de mer"]
  },
  rooftop: {
    name: "Rooftop",
    description: "Restaurants en hauteur avec vue panoramique",
    icon: "🏙️",
    restaurants: [14], // The Rooftop
    characteristics: ["Vue panoramique", "Ambiance élevée", "Cocktails", "Design moderne"]
  },
  family: {
    name: "Familial",
    description: "Endroits adaptés aux familles",
    icon: "👨‍👩‍👧‍👦",
    restaurants: [4, 7, 10, 15], // El Lago, Casa Tua, El Paseo, Café Central
    characteristics: ["Menu enfants", "Espace familial", "Prix raisonnables", "Service accueillant"]
  },
  nightlife: {
    name: "Vie nocturne",
    description: "Restaurants qui deviennent des clubs la nuit",
    icon: "🌙",
    restaurants: [3, 6, 11, 14], // Ocean Club, Trocadero, The Beach House, The Rooftop
    characteristics: ["DJ", "Bar", "Ambiance festive", "Ouverture tardive"]
  }
}

// Statistiques des établissements
export const establishmentStats = {
  total: 15,
  byCategory: {
    "Japonais": 3,
    "Méditerranéen": 1,
    "International": 4,
    "Espagnol": 2,
    "Italien": 2,
    "Asiatique": 1,
    "Café/Restaurant": 1,
    "Restaurant/Club": 1,
    "Restaurant/Bar": 1
  },
  byStyle: {
    "Romantique": 5,
    "Luxueux": 5,
    "Décontracté": 4,
    "Branché": 4,
    "Traditionnel": 2,
    "International": 9,
    "Face à la mer": 5,
    "Rooftop": 1,
    "Familial": 4,
    "Vie nocturne": 4
  },
  byPriceRange: {
    "€€": 2,
    "€€€": 6,
    "€€€€": 4,
    "€€€€€": 3
  },
  byRating: {
    "4.9": 1,
    "4.8": 2,
    "4.7": 2,
    "4.6": 2,
    "4.5": 2,
    "4.4": 2,
    "4.3": 2,
    "4.2": 1,
    "4.1": 1
  },
  totalCapacity: 1205,
  averageRating: 4.6,
  sponsoredCount: 6
}

// Options d'affichage pour les événements
export const eventDisplayOptions = {
  banner: {
    name: "Affichage Bannière",
    description: "Vue en bannière horizontale avec images",
    icon: "📋",
    layout: "horizontal"
  },
  calendar: {
    name: "Affichage Calendrier",
    description: "Vue calendrier avec dates et heures",
    icon: "📅",
    layout: "grid"
  },
  list: {
    name: "Affichage Liste",
    description: "Vue liste verticale avec détails",
    icon: "📝",
    layout: "vertical"
  }
}

export const recommendations = {
  romantic: [
    "La Terraza del Mar - Vue imprenable sur la mer, parfait pour un dîner romantique",
    "Casa Tua - Ambiance intime et cuisine italienne authentique",
    "Marbella Club Hotel Restaurant - Gastronomie raffinée dans un cadre historique",
    "La Dolce Vita - Cuisine italienne romantique avec terrasse",
    "Sushi Zen - Sushi bar intime avec chef japonais"
  ],
  group: [
    "Ocean Club - Espace pour les groupes avec DJ et ambiance festive",
    "Trocadero Arena - Piscine et espace pour les grands groupes",
    "El Lago - Restaurant traditionnel espagnol, parfait pour les groupes",
    "The Beach House - Restaurant-bar sur la plage pour les groupes",
    "The Rooftop - Rooftop bar avec vue panoramique"
  ],
  luxury: [
    "Nobu Marbella - Restaurant japonais de luxe avec vue sur la mer",
    "Marbella Club Hotel Restaurant - Gastronomie étoilée dans l'hôtel mythique",
    "Trocadero Arena - Club exclusif avec piscine et vue panoramique",
    "The Rooftop - Rooftop bar avec vue panoramique sur Marbella",
    "Sushi Zen - Sushi bar intime avec chef japonais"
  ],
  family: [
    "El Lago - Restaurant traditionnel espagnol, accueillant pour les familles",
    "Casa Tua - Cuisine italienne, plats adaptés aux enfants",
    "Trocadero Arena - Brunch dominical avec espace enfants",
    "Café Central - Café-restaurant familial au cœur de Marbella",
    "El Paseo - Restaurant traditionnel espagnol au centre-ville"
  ],
  budget: [
    "Café Central - Café-restaurant abordable au cœur de Marbella",
    "El Paseo - Restaurant traditionnel espagnol avec prix raisonnables",
    "Bamboo Marbella - Restaurant asiatique moderne avec prix modérés"
  ],
  seafood: [
    "The Beach House - Restaurant-bar sur la plage avec fruits de mer",
    "La Terraza del Mar - Cuisine méditerranéenne avec poisson grillé",
    "Nobu Marbella - Restaurant japonais avec sushi et sashimi"
  ]
}

// Service EVG/EVJF complet pour Marbella
export const evgServices = {
  title: "Service EVG/EVJF Marbella",
  description: "Organisation complète d'enterrements de vie de garçon/fille à Marbella",
  
  // Villas et hébergements pour EVG/EVJF
  accommodations: [
    {
      id: "villa-marbella-club",
      name: "Villa Marbella Club",
      type: "Villa de luxe",
      capacity: "8-12 personnes",
      price: "€800-1200/nuit",
      features: [
        "Piscine privée avec bar de nage",
        "Jardin paysager de 2000m²",
        "Vue panoramique sur la mer",
        "Spa privé avec sauna",
        "Terrasse avec barbecue professionnel",
        "Salle de jeux avec billard",
        "Parking privé pour 6 voitures",
        "WiFi haut débit",
        "Climatisation dans toutes les pièces"
      ],
      location: "Golden Mile, Marbella",
      contact: "+34 952 77 48 00",
      website: "https://villamarbellaclub.com"
    },
    {
      id: "villa-golden-mile",
      name: "Villa Golden Mile",
      type: "Villa ultra-luxe",
      capacity: "12-16 personnes",
      price: "€1500-2500/nuit",
      features: [
        "Piscine à débordement avec vue mer",
        "Accès direct à la plage privée",
        "Spa privé avec hammam",
        "Cinéma privé",
        "Cave à vin climatisée",
        "Terrasse rooftop avec jacuzzi",
        "Salle de sport privée",
        "Service de conciergerie 24h/24",
        "Chef privé disponible"
      ],
      location: "Golden Mile, Marbella",
      contact: "+34 952 77 48 01",
      website: "https://villagoldenmile.com"
    },
    {
      id: "villa-puerto-banus",
      name: "Villa Puerto Banús",
      type: "Villa moderne",
      capacity: "6-10 personnes",
      price: "€600-900/nuit",
      features: [
        "Piscine avec éclairage LED",
        "Jardin avec palmiers",
        "Vue sur le port de Puerto Banús",
        "Terrasse avec mobilier design",
        "Cuisine équipée haut de gamme",
        "Salle de détente",
        "Parking privé",
        "WiFi et climatisation"
      ],
      location: "Puerto Banús, Marbella",
      contact: "+34 952 77 48 02",
      website: "https://villapuertobanus.com"
    }
  ],

  // Activités et expériences EVG/EVJF
  activities: [
    {
      id: "activite-yacht",
      name: "Croisière privée en yacht",
      duration: "4-8 heures",
      price: "€800-1500",
      capacity: "8-12 personnes",
      description: "Yacht privé avec capitaine, déjeuner à bord, équipement de plongée, musique et bar",
      includes: [
        "Yacht privé avec capitaine professionnel",
        "Déjeuner gastronomique à bord",
        "Équipement de plongée et snorkeling",
        "Bar avec boissons premium",
        "Système son professionnel",
        "Équipement de sécurité",
        "Photos et vidéos du voyage"
      ],
      contact: "+34 952 77 48 10"
    },
    {
      id: "activite-golf",
      name: "Tournoi de golf VIP",
      duration: "6 heures",
      price: "€200-400/personne",
      capacity: "4-8 personnes",
      description: "Tournoi de golf sur les plus beaux parcours de Marbella avec prix et récompenses",
      includes: [
        "Green fees sur parcours 18 trous",
        "Location de matériel de golf",
        "Caddy professionnel",
        "Déjeuner au club house",
        "Prix et récompenses",
        "Photos du tournoi",
        "Transport depuis la villa"
      ],
      contact: "+34 952 77 48 11"
    },
    {
      id: "activite-spa",
      name: "Journée spa et bien-être",
      duration: "6 heures",
      price: "€150-300/personne",
      capacity: "4-8 personnes",
      description: "Journée complète de détente dans un spa de luxe avec soins personnalisés",
      includes: [
        "Massage relaxant 60 minutes",
        "Soin du visage personnalisé",
        "Accès aux installations spa",
        "Sauna et hammam",
        "Déjeuner détox",
        "Boissons détox",
        "Transport depuis la villa"
      ],
      contact: "+34 952 77 48 12"
    },
    {
      id: "activite-aventure",
      name: "Aventure en montagne",
      duration: "8 heures",
      price: "€100-200/personne",
      capacity: "6-12 personnes",
      description: "Randonnée, via ferrata, et activités d'aventure dans les montagnes de Marbella",
      includes: [
        "Randonnée guidée en montagne",
        "Via ferrata sécurisée",
        "Équipement de sécurité",
        "Guide professionnel",
        "Pique-nique en altitude",
        "Photos de l'aventure",
        "Transport depuis la villa"
      ],
      contact: "+34 952 77 48 13"
    }
  ],

  // Restaurants et bars pour EVG/EVJF
  restaurants: [
    {
      id: "restaurant-evj-1",
      name: "Dîner privé en villa",
      type: "Service privé",
      price: "€80-150/personne",
      description: "Chef privé qui cuisine dans votre villa avec menu personnalisé",
      includes: [
        "Chef privé pour la soirée",
        "Menu personnalisé selon vos goûts",
        "Service en salle",
        "Décoration de table",
        "Boissons et vins",
        "Nettoyage après le repas"
      ],
      contact: "+34 952 77 48 20"
    },
    {
      id: "restaurant-evj-2",
      name: "Restaurant VIP avec terrasse privée",
      type: "Restaurant privé",
      price: "€100-200/personne",
      description: "Terrasse privée dans un restaurant de luxe avec menu dégustation",
      includes: [
        "Terrasse privée réservée",
        "Menu dégustation 7 services",
        "Accompagnement vin",
        "Service dédié",
        "Décoration personnalisée",
        "Photos de la soirée"
      ],
      contact: "+34 952 77 48 21"
    }
  ],

  // Soirées et clubs pour EVG/EVJF
  nightlife: [
    {
      id: "club-evj-1",
      name: "Soirée VIP en club privé",
      type: "Club privé",
      price: "€200-400/personne",
      description: "Accès VIP à un club exclusif avec table réservée et bouteilles premium",
      includes: [
        "Table VIP réservée",
        "Bouteilles premium (2-3 par personne)",
        "Service dédié",
        "Accès VIP sans attente",
        "Photos de la soirée",
        "Transport depuis la villa"
      ],
      contact: "+34 952 77 48 30"
    },
    {
      id: "club-evj-2",
      name: "Fête privée en villa",
      type: "Événement privé",
      price: "€150-300/personne",
      description: "Fête privée dans votre villa avec DJ, bar mobile et décoration",
      includes: [
        "DJ professionnel",
        "Bar mobile avec barman",
        "Décoration thématique",
        "Éclairage professionnel",
        "Système son professionnel",
        "Photos et vidéos de la soirée"
      ],
      contact: "+34 952 77 48 31"
    }
  ],

  // Services de transport
  transport: [
    {
      id: "transport-1",
      name: "Transfert aéroport en limousine",
      type: "Transport VIP",
      price: "€150-300",
      description: "Transfert depuis l'aéroport en limousine ou van de luxe",
      includes: [
        "Limousine ou van de luxe",
        "Chauffeur professionnel",
        "Boissons à bord",
        "WiFi à bord",
        "Accueil avec pancarte"
      ],
      contact: "+34 952 77 48 40"
    },
    {
      id: "transport-2",
      name: "Transport entre activités",
      type: "Transport privé",
      price: "€50-100/trajet",
      description: "Transport privé entre toutes les activités de la journée",
      includes: [
        "Van ou minibus privé",
        "Chauffeur dédié",
        "Boissons à bord",
        "WiFi à bord",
        "Flexibilité des horaires"
      ],
      contact: "+34 952 77 48 41"
    }
  ],

  // Services de décoration et organisation
  decoration: [
    {
      id: "decoration-1",
      name: "Décoration thématique villa",
      type: "Décoration complète",
      price: "€200-500",
      description: "Décoration complète de la villa selon le thème choisi",
      includes: [
        "Décoration extérieure et intérieure",
        "Ballons et guirlandes",
        "Pancartes personnalisées",
        "Éclairage décoratif",
        "Installation et démontage",
        "Photos de la décoration"
      ],
      contact: "+34 952 77 48 50"
    },
    {
      id: "decoration-2",
      name: "Décoration de table",
      type: "Décoration de table",
      price: "€50-150",
      description: "Décoration de table pour les repas avec centre de table et accessoires",
      includes: [
        "Centre de table personnalisé",
        "Nappes et serviettes",
        "Vaisselle décorative",
        "Bougies et éclairage",
        "Accessoires thématiques",
        "Installation et rangement"
      ],
      contact: "+34 952 77 48 51"
    }
  ],

  // Packages complets EVG/EVJF
  packages: [
    {
      id: "package-basic",
      name: "Package EVG/EVJF Basique",
      duration: "2 jours / 1 nuit",
      price: "€300-500/personne",
      includes: [
        "Villa pour 8-12 personnes",
        "Transfert aéroport",
        "1 activité au choix",
        "1 repas en villa",
        "Transport entre activités",
        "Organisation complète"
      ],
      contact: "+34 952 77 48 60"
    },
    {
      id: "package-premium",
      name: "Package EVG/EVJF Premium",
      duration: "3 jours / 2 nuits",
      price: "€500-800/personne",
      includes: [
        "Villa de luxe pour 8-16 personnes",
        "Transfert aéroport en limousine",
        "2 activités au choix",
        "2 repas (1 en villa, 1 au restaurant)",
        "1 soirée VIP en club",
        "Transport privé",
        "Décoration thématique",
        "Organisation complète",
        "Photos et vidéos"
      ],
      contact: "+34 952 77 48 61"
    },
    {
      id: "package-luxury",
      name: "Package EVG/EVJF Luxe",
      duration: "4 jours / 3 nuits",
      price: "€800-1200/personne",
      includes: [
        "Villa ultra-luxe pour 12-16 personnes",
        "Transfert aéroport en limousine",
        "3 activités au choix",
        "3 repas (2 en villa, 1 au restaurant)",
        "2 soirées (1 en club, 1 en villa)",
        "Transport privé avec chauffeur",
        "Décoration complète",
        "Service de conciergerie 24h/24",
        "Photos et vidéos professionnelles",
        "Cadeaux de bienvenue",
        "Organisation complète"
      ],
      contact: "+34 952 77 48 62"
    }
  ],

  // Informations pratiques
  practicalInfo: {
    bestTime: "Avril à Octobre (meilleure météo)",
    groupSize: "6-16 personnes (optimal 8-12)",
    advanceBooking: "2-4 semaines à l'avance",
    payment: "30% à la réservation, 70% 7 jours avant",
    cancellation: "Annulation gratuite jusqu'à 7 jours avant",
    languages: ["Français", "Anglais", "Espagnol", "Italien"],
    contact: {
      phone: "+34 952 77 48 00",
      email: "evg@getweez.com",
      whatsapp: "+34 952 77 48 00",
      website: "https://getweez.com/evg"
    }
  }
}
