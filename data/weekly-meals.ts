export interface WeeklyMeal {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  allergens: string[];
  week: string; // Format: "2025-W01"
  day?: string; // Format: "monday", "tuesday", etc. (optional for backward compatibility)
}

export interface WeekOption {
  weekNumber: string; // Format: "2025-W01"
  startDate: string; // Format: "Oca 06-12"
  label: string; // Format: "Oca" or "Oca-Şub"
}

export interface DayOption {
  id: string; // "monday", "tuesday", etc.
  name: string; // "Pazartesi", "Salı", etc.
  shortName: string; // "Pzt", "Sal", etc.
  date: string; // "06", "07", etc.
}

// Get current week number
export const getCurrentWeekNumber = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  
  // Find Monday of current week
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  
  // Calculate week number
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (monday.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
};

// Generate next 8 weeks starting from current week
export const generateWeekOptions = (): WeekOption[] => {
  const weeks: WeekOption[] = [];
  const today = new Date();
  
  // Find the Monday of current week
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  
  for (let i = 0; i < 8; i++) {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() + (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const startMonth = monthNames[weekStart.getMonth()];
    const endMonth = monthNames[weekEnd.getMonth()];
    const startDay = String(weekStart.getDate()).padStart(2, '0');
    const endDay = String(weekEnd.getDate()).padStart(2, '0');
    
    const year = weekStart.getFullYear();
    
    // Calculate week number properly
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (weekStart.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    const weekNumber = `${year}-W${String(weekNum).padStart(2, '0')}`;
    
    weeks.push({
      weekNumber,
      startDate: `${startMonth} ${startDay}-${endDay}`,
      label: startMonth === endMonth ? startMonth : `${startMonth}-${endMonth}`
    });
  }
  
  return weeks;
};

// Generate days for a specific week
export const generateDaysForWeek = (weekNumber: string): DayOption[] => {
  const days: DayOption[] = [];
  const dayNames = [
    { id: 'monday', name: 'Pazartesi', shortName: 'Pzt' },
    { id: 'tuesday', name: 'Salı', shortName: 'Sal' },
    { id: 'wednesday', name: 'Çarşamba', shortName: 'Çar' },
    { id: 'thursday', name: 'Perşembe', shortName: 'Per' },
    { id: 'friday', name: 'Cuma', shortName: 'Cum' },
    { id: 'saturday', name: 'Cumartesi', shortName: 'Cmt' },
    { id: 'sunday', name: 'Pazar', shortName: 'Paz' }
  ];
  
  // Parse week number (format: "2025-W01")
  const [year, weekPart] = weekNumber.split('-W');
  const weekNum = parseInt(weekPart, 10);
  
  // Calculate Monday of the week
  const firstDayOfYear = new Date(parseInt(year), 0, 1);
  const daysOffset = (weekNum - 1) * 7;
  const monday = new Date(firstDayOfYear);
  monday.setDate(firstDayOfYear.getDate() + daysOffset - firstDayOfYear.getDay() + 1);
  
  // Generate days
  dayNames.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    
    days.push({
      id: day.id,
      name: day.name,
      shortName: day.shortName,
      date: String(date.getDate()).padStart(2, '0')
    });
  });
  
  return days;
};

export const mealCategories = [
  {
    id: 'ready-made',
    name: 'Hazır Yemekler',
    description: 'Dakikalar içinde ısıtıp yiyebileceğiniz taze yemekler. Her biri restoran kalitesinde hazırlanmış, dengeli ve lezzetli öğünler.',
    icon: '🍽️'
  },
  {
    id: 'breakfast',
    name: 'Kahvaltılar',
    description: 'Güne enerjik başlamak için besleyici kahvaltılar. Protein, lif ve sağlıklı yağlar ile dolu.',
    icon: '🥐'
  },
  {
    id: 'salads',
    name: 'Salatalar',
    description: 'Taze ve renkli salata seçenekleri. Hafif ama doyurucu, vitamin ve mineral açısından zengin.',
    icon: '🥗'
  },
  {
    id: 'snacks',
    name: 'Ara Öğünler',
    description: 'Sağlıklı atıştırmalıklar ve ara öğünler. Enerji seviyenizi dengede tutmak için ideal.',
    icon: '🥙'
  }
];

// Generate meals for all 8 weeks dynamically
const generateMealsForWeek = (weekNumber: string): WeeklyMeal[] => {
  const meals: WeeklyMeal[] = [];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  const mealTemplates = {
    'ready-made': [
      {
        name: 'Sarımsaklı Fırın Tavuk',
        description: 'Patates püresi ve taze fasulye ile',
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
        kcal: 520, protein: 42, carbs: 38, fat: 18, fiber: 6, allergens: []
      },
      {
        name: 'Közlenmiş Domatesli Tavuk',
        description: 'Ancho biber, peynirli makarna ve kabak ile',
        image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg',
        kcal: 480, protein: 38, carbs: 42, fat: 16, fiber: 5, allergens: ['Süt', 'Gluten']
      },
      {
        name: 'Izgara Somon & Kinoa',
        description: 'Limonlu kinoa ve mevsim sebzeleri ile',
        image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
        kcal: 490, protein: 36, carbs: 38, fat: 20, fiber: 7, allergens: ['Balık']
      },
      {
        name: 'Akdeniz Köfte',
        description: 'Taze salata ve bulgur pilavı ile',
        image: 'https://images.pexels.com/photos/8753657/pexels-photo-8753657.jpeg',
        kcal: 460, protein: 34, carbs: 40, fat: 16, fiber: 8, allergens: ['Gluten']
      },
      {
        name: 'Sebzeli Tavuk Sote',
        description: 'Çin baharatları ve basmati pilav ile',
        image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
        kcal: 500, protein: 39, carbs: 44, fat: 17, fiber: 6, allergens: []
      },
      {
        name: 'Fırın Levrek & Sebzeler',
        description: 'Zeytinyağlı fırın sebzeleri ile',
        image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg',
        kcal: 420, protein: 38, carbs: 28, fat: 18, fiber: 7, allergens: ['Balık']
      },
      {
        name: 'Mantarlı Tavuk Risotto',
        description: 'Parmesan ve taze kekik ile',
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
        kcal: 495, protein: 35, carbs: 48, fat: 16, fiber: 5, allergens: ['Süt', 'Gluten']
      },
      {
        name: 'Izgara Dana & Tatlı Patates',
        description: 'Buharda brokoli ve havuç ile',
        image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg',
        kcal: 540, protein: 44, carbs: 42, fat: 20, fiber: 9, allergens: []
      },
      {
        name: 'Teriyaki Tavuk Bowl',
        description: 'Esmer pirinç ve wok sebzeleri ile',
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
        kcal: 510, protein: 40, carbs: 46, fat: 15, fiber: 6, allergens: ['Soya']
      },
      {
        name: 'Fırın Hindi & Kinoa',
        description: 'Közlenmiş sebzeler ve yoğurt sosu ile',
        image: 'https://images.pexels.com/photos/8753657/pexels-photo-8753657.jpeg',
        kcal: 470, protein: 38, carbs: 40, fat: 14, fiber: 8, allergens: ['Süt']
      }
    ],
    'breakfast': [
      {
        name: 'Fırınlanmış Domatesli Menemen',
        description: 'Tam buğday ekmeği ile',
        image: 'https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg',
        kcal: 320, protein: 18, carbs: 28, fat: 14, fiber: 5, allergens: ['Yumurta', 'Gluten']
      },
      {
        name: 'Badem Sütlü Overnight Yulaf',
        description: 'Taze meyveler ve chia tohumu ile',
        image: 'https://images.pexels.com/photos/704971/pexels-photo-704971.jpeg',
        kcal: 280, protein: 12, carbs: 38, fat: 10, fiber: 8, allergens: ['Fındık']
      },
      {
        name: 'Protein Pancake',
        description: 'Muz ve fıstık ezmesi ile',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        kcal: 340, protein: 22, carbs: 36, fat: 12, fiber: 6, allergens: ['Yumurta', 'Gluten', 'Fındık']
      },
      {
        name: 'Avokadolu Yumurta Toast',
        description: 'Tam tahıllı ekmek ve poşe yumurta',
        image: 'https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg',
        kcal: 350, protein: 16, carbs: 32, fat: 18, fiber: 7, allergens: ['Yumurta', 'Gluten']
      },
      {
        name: 'Yaban Mersinli Smoothie Bowl',
        description: 'Granola ve taze meyveler ile',
        image: 'https://images.pexels.com/photos/704971/pexels-photo-704971.jpeg',
        kcal: 310, protein: 14, carbs: 42, fat: 11, fiber: 9, allergens: ['Fındık']
      },
      {
        name: 'Peynirli Omlet & Avokado',
        description: 'Tam buğday ekmeği ile',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        kcal: 365, protein: 24, carbs: 28, fat: 19, fiber: 6, allergens: ['Yumurta', 'Süt', 'Gluten']
      },
      {
        name: 'Çilekli Fransız Tostu',
        description: 'Akçaağaç şurubu ve badem ile',
        image: 'https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg',
        kcal: 380, protein: 16, carbs: 48, fat: 15, fiber: 5, allergens: ['Yumurta', 'Gluten', 'Süt', 'Fındık']
      },
      {
        name: 'Yunan Yoğurtlu Bowl',
        description: 'Bal, ceviz ve taze meyveler ile',
        image: 'https://images.pexels.com/photos/704971/pexels-photo-704971.jpeg',
        kcal: 290, protein: 18, carbs: 34, fat: 12, fiber: 6, allergens: ['Süt', 'Fındık']
      }
    ],
    'salads': [
      {
        name: 'Nisuaz Salata',
        description: 'Ton balığı, yumurta, zeytin ve taze sebzeler',
        image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
        kcal: 380, protein: 28, carbs: 22, fat: 20, fiber: 6, allergens: ['Balık', 'Yumurta']
      },
      {
        name: 'Izgara Tavuklu Caesar',
        description: 'Parmesan, kruton ve özel sos ile',
        image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
        kcal: 420, protein: 36, carbs: 24, fat: 22, fiber: 4, allergens: ['Süt', 'Gluten']
      },
      {
        name: 'Akdeniz Kinoa Salatası',
        description: 'Kinoa, nohut, domates ve feta peyniri',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        kcal: 360, protein: 16, carbs: 42, fat: 16, fiber: 8, allergens: ['Süt']
      },
      {
        name: 'Izgara Hellim Salatası',
        description: 'Roka, nar ve ceviz ile',
        image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
        kcal: 390, protein: 18, carbs: 28, fat: 24, fiber: 6, allergens: ['Süt', 'Fındık']
      },
      {
        name: 'Ton Balıklı Nohut Salatası',
        description: 'Akdeniz yeşillikleri ve limon sosu',
        image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
        kcal: 395, protein: 32, carbs: 30, fat: 18, fiber: 9, allergens: ['Balık']
      },
      {
        name: 'Kırmızı Mercimek Salatası',
        description: 'Nar ekşisi ve taze nane ile',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        kcal: 340, protein: 14, carbs: 48, fat: 12, fiber: 10, allergens: []
      },
      {
        name: 'Izgara Sebze Salatası',
        description: 'Balsamik sos ve keçi peyniri',
        image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
        kcal: 355, protein: 14, carbs: 32, fat: 20, fiber: 8, allergens: ['Süt']
      }
    ],
    'snacks': [
      {
        name: 'Hindistancevizi Bisküvi',
        description: 'Glutensiz, şekersiz atıştırmalık',
        image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
        kcal: 180, protein: 4, carbs: 22, fat: 9, fiber: 3, allergens: []
      },
      {
        name: 'Tohumlu & Tahinli Çikolata',
        description: 'Protein açısından zengin enerji topu',
        image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg',
        kcal: 220, protein: 8, carbs: 18, fat: 14, fiber: 4, allergens: ['Susam']
      },
      {
        name: 'Humus & Çiğ Sebze',
        description: 'Taze havuç, kereviz ve salatalık ile',
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
        kcal: 160, protein: 6, carbs: 20, fat: 7, fiber: 5, allergens: ['Susam']
      },
      {
        name: 'Naneli Ananas Çayı',
        description: 'Ferahlatıcı ve antioksidan yüksek',
        image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
        kcal: 45, protein: 0, carbs: 11, fat: 0, fiber: 1, allergens: []
      },
      {
        name: 'Badem Ezmesi & Elma',
        description: 'Protein ve lif açısından zengin',
        image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg',
        kcal: 195, protein: 7, carbs: 20, fat: 11, fiber: 5, allergens: ['Fındık']
      },
      {
        name: 'Protein Bar',
        description: 'Çikolata ve fındık aromalı',
        image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
        kcal: 210, protein: 12, carbs: 22, fat: 9, fiber: 4, allergens: ['Fındık', 'Süt']
      },
      {
        name: 'Yeşil Detoks Smoothie',
        description: 'Ispanak, muz ve chia tohumu',
        image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
        kcal: 165, protein: 6, carbs: 28, fat: 5, fiber: 6, allergens: []
      }
    ]
  };
  
  // Generate meals for each day
  days.forEach((day, dayIndex) => {
    // 2 ready-made meals per day
    for (let i = 0; i < 2; i++) {
      const template = mealTemplates['ready-made'][(dayIndex * 2 + i) % mealTemplates['ready-made'].length];
      meals.push({
        id: `${weekNumber}-${day}-rm-${i + 1}`,
        category: 'ready-made',
        week: weekNumber,
        day: day,
        ...template
      });
    }
    
    // 1 breakfast per day
    const breakfastTemplate = mealTemplates['breakfast'][dayIndex % mealTemplates['breakfast'].length];
    meals.push({
      id: `${weekNumber}-${day}-bf`,
      category: 'breakfast',
      week: weekNumber,
      day: day,
      ...breakfastTemplate
    });
    
    // 1 salad per day
    const saladTemplate = mealTemplates['salads'][dayIndex % mealTemplates['salads'].length];
    meals.push({
      id: `${weekNumber}-${day}-sl`,
      category: 'salads',
      week: weekNumber,
      day: day,
      ...saladTemplate
    });
    
    // 1 snack per day
    const snackTemplate = mealTemplates['snacks'][dayIndex % mealTemplates['snacks'].length];
    meals.push({
      id: `${weekNumber}-${day}-sn`,
      category: 'snacks',
      week: weekNumber,
      day: day,
      ...snackTemplate
    });
  });
  
  return meals;
};

// Generate meals for all 8 weeks
export const weeklyMeals: WeeklyMeal[] = (() => {
  const allMeals: WeeklyMeal[] = [];
  const weekOptions = generateWeekOptions();
  
  weekOptions.forEach(week => {
    allMeals.push(...generateMealsForWeek(week.weekNumber));
  });
  
  return allMeals;
})();
