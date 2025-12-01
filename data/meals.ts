export interface Meal {
  id: string;
  name: string;
  description: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
  categories: string[];
  image?: string;
}

export const meals: Meal[] = [
  {
    id: '1',
    name: 'Izgara Somon & Kinoa Salatası',
    description: 'Omega-3 açısından zengin somon, renkli sebzeler ve kinoa ile hafif ve doyurucu bir öğün',
    kcal: 520,
    protein: 38,
    carbs: 42,
    fat: 18,
    allergens: ['Balık'],
    categories: ['Akdeniz tipi', 'Yüksek protein'],
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg'
  },
  {
    id: '2',
    name: 'Tavuk Göğsü & Tatlı Patates',
    description: 'Fırında marine edilmiş tavuk göğsü, fırın tatlı patates ve mevsim yeşillikleri',
    kcal: 480,
    protein: 42,
    carbs: 38,
    fat: 12,
    allergens: [],
    categories: ['Yüksek protein', 'Kalori kontrollü'],
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg'
  },
  {
    id: '3',
    name: 'Akdeniz Sebze Güveç',
    description: 'Patlıcan, kabak, domates ve nohut ile zengin lif içerikli vejetaryen seçenek',
    kcal: 380,
    protein: 14,
    carbs: 52,
    fat: 14,
    allergens: [],
    categories: ['Akdeniz tipi', 'Clean eating'],
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg'
  },
  {
    id: '4',
    name: 'Hindi Köfte & Bulgur Pilavı',
    description: 'Yağsız hindi köfte, tam buğday bulgur ve közlenmiş sebzeler',
    kcal: 450,
    protein: 36,
    carbs: 44,
    fat: 10,
    allergens: ['Gluten'],
    categories: ['Yüksek protein', 'Kalori kontrollü'],
    image: 'https://images.pexels.com/photos/8753657/pexels-photo-8753657.jpeg'
  },
  {
    id: '5',
    name: 'Levrek & Buharda Sebze',
    description: 'Fırında levrek, buharda brokoli, havuç ve bezelye ile hafif bir akşam yemeği',
    kcal: 420,
    protein: 34,
    carbs: 28,
    fat: 16,
    allergens: ['Balık'],
    categories: ['Akdeniz tipi', 'Kalori kontrollü'],
    image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg'
  },
  {
    id: '6',
    name: 'Mercimek Köfte & Yoğurt',
    description: 'Protein açısından zengin kırmızı mercimek köfte, cacık ve yeşillik',
    kcal: 390,
    protein: 18,
    carbs: 58,
    fat: 8,
    allergens: ['Gluten', 'Süt'],
    categories: ['Clean eating'],
    image: 'https://images.pexels.com/photos/6419720/pexels-photo-6419720.jpeg'
  },
  {
    id: '7',
    name: 'Izgara Tavuk & Avokado Salata',
    description: 'Marine tavuk göğsü, avokado, roka ve nar ekşili sos',
    kcal: 510,
    protein: 40,
    carbs: 24,
    fat: 28,
    allergens: [],
    categories: ['Yüksek protein', 'Clean eating'],
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg'
  },
  {
    id: '8',
    name: 'Ton Balığı Salatası',
    description: 'Konserve ton balığı, yeşillikler, domates, salatalık ve zeytinyağlı sos',
    kcal: 360,
    protein: 32,
    carbs: 18,
    fat: 18,
    allergens: ['Balık'],
    categories: ['Akdeniz tipi', 'Kalori kontrollü'],
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg'
  },
  {
    id: '9',
    name: 'Nohut & Ispanak Yemeği',
    description: 'Protein ve demir açısından zengin nohut, ıspanak ve domates sosu',
    kcal: 410,
    protein: 16,
    carbs: 54,
    fat: 12,
    allergens: [],
    categories: ['Clean eating'],
    image: 'https://images.pexels.com/photos/5938/food-salad-healthy-lunch.jpg'
  },
  {
    id: '10',
    name: 'Izgara Dana & Kinoa',
    description: 'Yağsız dana bonfile, kinoa ve közlenmiş sebzeler',
    kcal: 540,
    protein: 44,
    carbs: 36,
    fat: 20,
    allergens: [],
    categories: ['Yüksek protein'],
    image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg'
  }
];
