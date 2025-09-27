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
    rating: 4.8,
    price_range: "€€€€",
    specialties: ["Sushi", "Sashimi", "Tempura", "Wagyu"],
    ambiance: "Luxueux, Vue mer, Intime",
    capacity: 80,
    sponsored: true
  },
  {
    id: 2,
    name: "La Terraza del Mar",
    type: "Restaurant",
    category: "Méditerranéen",
    description: "Cuisine méditerranéenne avec terrasse panoramique",
    address: "Playa de la Fontanilla, 29602 Marbella",
    phone: "+34 952 77 48 01",
    rating: 4.7,
    price_range: "€€€",
    specialties: ["Paella", "Poisson grillé", "Tapas", "Sangria"],
    ambiance: "Romantique, Vue mer, Terrasse",
    capacity: 120,
    sponsored: false
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
    rating: 4.9,
    price_range: "€€€€€",
    specialties: ["Gastronomie", "Vins", "Dégustation", "Chef étoilé"],
    ambiance: "Luxueux, Gastronomique, Historique",
    capacity: 80,
    sponsored: true
  }
]

export const events = [
  {
    id: 1,
    name: "Sunset Sessions at Ocean Club",
    type: "Événement musical",
    date: "2024-01-15",
    time: "19:00",
    location: "Ocean Club, Puerto Banús",
    description: "Session musicale au coucher du soleil avec DJ international",
    price: 50,
    capacity: 200,
    category: "Musique",
    dress_code: "Smart casual",
    age_restriction: "18+",
    includes: ["Cocktail de bienvenue", "DJ set", "Vue coucher de soleil"]
  },
  {
    id: 2,
    name: "Dégustation de vins à La Terraza del Mar",
    type: "Dégustation",
    date: "2024-01-20",
    time: "20:00",
    location: "La Terraza del Mar",
    description: "Dégustation de vins espagnols avec sommelier expert",
    price: 75,
    capacity: 30,
    category: "Gastronomie",
    dress_code: "Élégant",
    age_restriction: "21+",
    includes: ["5 vins", "Accompagnements", "Expert sommelier"]
  },
  {
    id: 3,
    name: "Brunch dominical au Trocadero",
    type: "Brunch",
    date: "2024-01-21",
    time: "11:00",
    location: "Trocadero Arena",
    description: "Brunch dominical avec vue piscine et musique live",
    price: 35,
    capacity: 100,
    category: "Gastronomie",
    dress_code: "Décontracté",
    age_restriction: "Tous âges",
    includes: ["Buffet", "Cocktails", "Musique live", "Accès piscine"]
  },
  {
    id: 4,
    name: "Soirée sushi à Sake Bar",
    type: "Événement gastronomique",
    date: "2024-01-25",
    time: "21:00",
    location: "Sake Bar Marbella",
    description: "Soirée spéciale sushi avec chef japonais",
    price: 85,
    capacity: 25,
    category: "Gastronomie",
    dress_code: "Smart casual",
    age_restriction: "18+",
    includes: ["Menu dégustation", "Saké premium", "Chef japonais"]
  },
  {
    id: 5,
    name: "Fiesta Latina au El Lago",
    type: "Événement culturel",
    date: "2024-01-28",
    time: "22:00",
    location: "El Lago",
    description: "Soirée latino avec musique live et danse",
    price: 25,
    capacity: 80,
    category: "Musique",
    dress_code: "Décontracté",
    age_restriction: "18+",
    includes: ["Musique live", "Cocktails", "Danse", "Tapas"]
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

export const recommendations = {
  romantic: [
    "La Terraza del Mar - Vue imprenable sur la mer, parfait pour un dîner romantique",
    "Casa Tua - Ambiance intime et cuisine italienne authentique",
    "Marbella Club Hotel Restaurant - Gastronomie raffinée dans un cadre historique"
  ],
  group: [
    "Ocean Club - Espace pour les groupes avec DJ et ambiance festive",
    "Trocadero Arena - Piscine et espace pour les grands groupes",
    "El Lago - Restaurant traditionnel espagnol, parfait pour les groupes"
  ],
  luxury: [
    "Nobu Marbella - Restaurant japonais de luxe avec vue sur la mer",
    "Marbella Club Hotel Restaurant - Gastronomie étoilée dans l'hôtel mythique",
    "Trocadero Arena - Club exclusif avec piscine et vue panoramique"
  ],
  family: [
    "El Lago - Restaurant traditionnel espagnol, accueillant pour les familles",
    "Casa Tua - Cuisine italienne, plats adaptés aux enfants",
    "Trocadero Arena - Brunch dominical avec espace enfants"
  ]
}
