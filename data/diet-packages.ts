export interface DietPackage {
  id: string;
  dietType: 'akdeniz' | 'yuksek-protein' | 'vegan' | 'anne-mutfagi';
  dietName: string;
  description: string;
  mealConfig: {
    id: string;
    name: string;
    description: string;
    meals: {
      main: number;
      snack: number;
    };
  };
  calorieTiers: {
    calories: number;
    price: number;
  }[];
  sampleMenu: string[];
  features: string[];
  highlight?: boolean;
}

export const dietTypes = [
  {
    id: 'akdeniz',
    name: 'Akdeniz Tipi Beslenme',
    description: 'Zeytinyağı, taze sebze ve balık ağırlıklı, kalp dostu beslenme modeli',
    icon: '🫒'
  },
  {
    id: 'yuksek-protein',
    name: 'Yüksek Protein',
    description: 'Kas gelişimi ve tokluk hissi için protein ağırlıklı menüler',
    icon: '💪'
  },
  {
    id: 'vegan',
    name: 'Vegan / Vejetaryen',
    description: 'Tamamen bitkisel veya lakto-ovo vejetaryen seçenekler',
    icon: '🌱'
  },
  {
    id: 'anne-mutfagi',
    name: 'Anne Mutfağı',
    description: 'Geleneksel Türk mutfağından sağlıklı yorumlar',
    icon: '🏠'
  }
];

export const mealConfigs = [
  {
    id: 'sabah-aksam',
    name: 'Sabah–Akşam',
    description: '3 ana öğün + 2 ara öğün',
    meals: { main: 3, snack: 2 }
  },
  {
    id: 'oglensiz-aksamsiz',
    name: 'Öğlensiz veya Akşamsız',
    description: '2 ana öğün + 2 ara öğün',
    meals: { main: 2, snack: 2 }
  },
  {
    id: 'kahvaltisiz',
    name: 'Kahvaltısız',
    description: '2 ana öğün + 2 ara öğün',
    meals: { main: 2, snack: 2 }
  },
  {
    id: 'gunduz',
    name: 'Gündüz Programı',
    description: 'Öğle yemeği + 2 ara öğün',
    meals: { main: 1, snack: 2 }
  }
];

export const dietPackages: DietPackage[] = [
  // Akdeniz Tipi - Sabah-Akşam
  {
    id: 'akdeniz-sabah-aksam-1200',
    dietType: 'akdeniz',
    dietName: 'Akdeniz Tipi Beslenme',
    description: 'Zeytinyağı, taze sebze ve balık ağırlıklı, kalp dostu beslenme modeli',
    mealConfig: {
      id: 'sabah-aksam',
      name: 'Sabah–Akşam',
      description: '3 ana öğün + 2 ara öğün',
      meals: { main: 3, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 1000 },
      { calories: 1500, price: 1100 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Çin Baharatlarıyla Sebzeli Tavuk Sote; Limonlu Basmati Pilav'
    ],
    features: [
      'Kalp dostu zeytinyağı bazlı',
      'Taze Akdeniz sebzeleri',
      'Omega-3 açısından zengin',
      'Antioksidan yüksek menüler'
    ],
    highlight: true
  },
  // Akdeniz Tipi - Öğlensiz/Akşamsız
  {
    id: 'akdeniz-oglensiz-1200',
    dietType: 'akdeniz',
    dietName: 'Akdeniz Tipi Beslenme',
    description: 'Zeytinyağı, taze sebze ve balık ağırlıklı, kalp dostu beslenme modeli',
    mealConfig: {
      id: 'oglensiz-aksamsiz',
      name: 'Öğlensiz veya Akşamsız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 800 },
      { calories: 1500, price: 900 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Çin Baharatlarıyla Sebzeli Tavuk Sote; Limonlu Basmati Pilav'
    ],
    features: [
      'Kalp dostu zeytinyağı bazlı',
      'Taze Akdeniz sebzeleri',
      'Omega-3 açısından zengin',
      'Antioksidan yüksek menüler'
    ]
  },
  // Akdeniz Tipi - Kahvaltısız
  {
    id: 'akdeniz-kahvaltisiz-1200',
    dietType: 'akdeniz',
    dietName: 'Akdeniz Tipi Beslenme',
    description: 'Zeytinyağı, taze sebze ve balık ağırlıklı, kalp dostu beslenme modeli',
    mealConfig: {
      id: 'kahvaltisiz',
      name: 'Kahvaltısız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 850 },
      { calories: 1500, price: 950 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Çin Baharatlarıyla Sebzeli Tavuk Sote; Limonlu Basmati Pilav'
    ],
    features: [
      'Kalp dostu zeytinyağı bazlı',
      'Taze Akdeniz sebzeleri',
      'Omega-3 açısından zengin',
      'Antioksidan yüksek menüler'
    ]
  },
  // Akdeniz Tipi - Gündüz
  {
    id: 'akdeniz-gunduz-800',
    dietType: 'akdeniz',
    dietName: 'Akdeniz Tipi Beslenme',
    description: 'Zeytinyağı, taze sebze ve balık ağırlıklı, kalp dostu beslenme modeli',
    mealConfig: {
      id: 'gunduz',
      name: 'Gündüz Programı',
      description: 'Öğle yemeği + 2 ara öğün',
      meals: { main: 1, snack: 2 }
    },
    calorieTiers: [
      { calories: 800, price: 700 },
      { calories: 1100, price: 800 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Çin Baharatlarıyla Sebzeli Tavuk Sote; Limonlu Basmati Pilav'
    ],
    features: [
      'Kalp dostu zeytinyağı bazlı',
      'Taze Akdeniz sebzeleri',
      'Omega-3 açısından zengin',
      'Antioksidan yüksek menüler'
    ]
  },

  // Yüksek Protein - Sabah-Akşam
  {
    id: 'protein-sabah-aksam-1300',
    dietType: 'yuksek-protein',
    dietName: 'Yüksek Protein',
    description: 'Kas gelişimi ve tokluk hissi için protein ağırlıklı menüler',
    mealConfig: {
      id: 'sabah-aksam',
      name: 'Sabah–Akşam',
      description: '3 ana öğün + 2 ara öğün',
      meals: { main: 3, snack: 2 }
    },
    calorieTiers: [
      { calories: 1300, price: 1100 },
      { calories: 1800, price: 1250 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Meyve',
      'Nisuaz Salata',
      'Tohumlu & Tahinli Çikolata',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Yüksek protein içeriği',
      'Kas gelişimi destekleyici',
      'Uzun süreli tokluk',
      'Spor yapanlar için ideal'
    ]
  },
  // Yüksek Protein - Öğlensiz/Akşamsız
  {
    id: 'protein-oglensiz-1300',
    dietType: 'yuksek-protein',
    dietName: 'Yüksek Protein',
    description: 'Kas gelişimi ve tokluk hissi için protein ağırlıklı menüler',
    mealConfig: {
      id: 'oglensiz-aksamsiz',
      name: 'Öğlensiz veya Akşamsız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1300, price: 900 },
      { calories: 1800, price: 1000 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Meyve',
      'Nisuaz Salata',
      'Tohumlu & Tahinli Çikolata',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Yüksek protein içeriği',
      'Kas gelişimi destekleyici',
      'Uzun süreli tokluk',
      'Spor yapanlar için ideal'
    ]
  },
  // Yüksek Protein - Kahvaltısız
  {
    id: 'protein-kahvaltisiz-1300',
    dietType: 'yuksek-protein',
    dietName: 'Yüksek Protein',
    description: 'Kas gelişimi ve tokluk hissi için protein ağırlıklı menüler',
    mealConfig: {
      id: 'kahvaltisiz',
      name: 'Kahvaltısız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1300, price: 950 },
      { calories: 1800, price: 1100 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Meyve',
      'Nisuaz Salata',
      'Tohumlu & Tahinli Çikolata',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Yüksek protein içeriği',
      'Kas gelişimi destekleyici',
      'Uzun süreli tokluk',
      'Spor yapanlar için ideal'
    ]
  },
  // Yüksek Protein - Gündüz
  {
    id: 'protein-gunduz-1000',
    dietType: 'yuksek-protein',
    dietName: 'Yüksek Protein',
    description: 'Kas gelişimi ve tokluk hissi için protein ağırlıklı menüler',
    mealConfig: {
      id: 'gunduz',
      name: 'Gündüz Programı',
      description: 'Öğle yemeği + 2 ara öğün',
      meals: { main: 1, snack: 2 }
    },
    calorieTiers: [
      { calories: 1000, price: 800 },
      { calories: 1300, price: 900 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Meyve',
      'Nisuaz Salata',
      'Tohumlu & Tahinli Çikolata',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Yüksek protein içeriği',
      'Kas gelişimi destekleyici',
      'Uzun süreli tokluk',
      'Spor yapanlar için ideal'
    ]
  },

  // Vegan - Sabah-Akşam
  {
    id: 'vegan-sabah-aksam-1200',
    dietType: 'vegan',
    dietName: 'Vegan / Vejetaryen',
    description: 'Tamamen bitkisel veya lakto-ovo vejetaryen seçenekler',
    mealConfig: {
      id: 'sabah-aksam',
      name: 'Sabah–Akşam',
      description: '3 ana öğün + 2 ara öğün',
      meals: { main: 3, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 1000 },
      { calories: 1500, price: 1100 }
    ],
    sampleMenu: [
      'Badem Sütlü Overnight Yulaf',
      'Humus & Çiğ Sebze',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Mantar Sote; Yeşil Salata'
    ],
    features: [
      'Tamamen bitkisel',
      'Yüksek lif içeriği',
      'Çevre dostu',
      'Etik beslenme'
    ]
  },
  // Vegan - Öğlensiz/Akşamsız
  {
    id: 'vegan-oglensiz-1200',
    dietType: 'vegan',
    dietName: 'Vegan / Vejetaryen',
    description: 'Tamamen bitkisel veya lakto-ovo vejetaryen seçenekler',
    mealConfig: {
      id: 'oglensiz-aksamsiz',
      name: 'Öğlensiz veya Akşamsız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 800 },
      { calories: 1500, price: 900 }
    ],
    sampleMenu: [
      'Badem Sütlü Overnight Yulaf',
      'Humus & Çiğ Sebze',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Mantar Sote; Yeşil Salata'
    ],
    features: [
      'Tamamen bitkisel',
      'Yüksek lif içeriği',
      'Çevre dostu',
      'Etik beslenme'
    ]
  },
  // Vegan - Kahvaltısız
  {
    id: 'vegan-kahvaltisiz-1200',
    dietType: 'vegan',
    dietName: 'Vegan / Vejetaryen',
    description: 'Tamamen bitkisel veya lakto-ovo vejetaryen seçenekler',
    mealConfig: {
      id: 'kahvaltisiz',
      name: 'Kahvaltısız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 850 },
      { calories: 1500, price: 950 }
    ],
    sampleMenu: [
      'Badem Sütlü Overnight Yulaf',
      'Humus & Çiğ Sebze',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Mantar Sote; Yeşil Salata'
    ],
    features: [
      'Tamamen bitkisel',
      'Yüksek lif içeriği',
      'Çevre dostu',
      'Etik beslenme'
    ]
  },
  // Vegan - Gündüz
  {
    id: 'vegan-gunduz-800',
    dietType: 'vegan',
    dietName: 'Vegan / Vejetaryen',
    description: 'Tamamen bitkisel veya lakto-ovo vejetaryen seçenekler',
    mealConfig: {
      id: 'gunduz',
      name: 'Gündüz Programı',
      description: 'Öğle yemeği + 2 ara öğün',
      meals: { main: 1, snack: 2 }
    },
    calorieTiers: [
      { calories: 800, price: 700 },
      { calories: 1100, price: 800 }
    ],
    sampleMenu: [
      'Badem Sütlü Overnight Yulaf',
      'Humus & Çiğ Sebze',
      'Nisuaz Salata',
      'Naneli Ananas Çayı',
      'Mantar Sote; Yeşil Salata'
    ],
    features: [
      'Tamamen bitkisel',
      'Yüksek lif içeriği',
      'Çevre dostu',
      'Etik beslenme'
    ]
  },

  // Anne Mutfağı - Sabah-Akşam
  {
    id: 'anne-sabah-aksam-1200',
    dietType: 'anne-mutfagi',
    dietName: 'Anne Mutfağı',
    description: 'Geleneksel Türk mutfağından sağlıklı yorumlar',
    mealConfig: {
      id: 'sabah-aksam',
      name: 'Sabah–Akşam',
      description: '3 ana öğün + 2 ara öğün',
      meals: { main: 3, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 1000 },
      { calories: 1500, price: 1100 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Kıymalı Tarhana Çorbası',
      'Meyve',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Geleneksel lezzetler',
      'Ev yemeği tadı',
      'Nostaljik menüler',
      'Sağlıklı yorumlar'
    ]
  },
  // Anne Mutfağı - Öğlensiz/Akşamsız
  {
    id: 'anne-oglensiz-1200',
    dietType: 'anne-mutfagi',
    dietName: 'Anne Mutfağı',
    description: 'Geleneksel Türk mutfağından sağlıklı yorumlar',
    mealConfig: {
      id: 'oglensiz-aksamsiz',
      name: 'Öğlensiz veya Akşamsız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 800 },
      { calories: 1500, price: 900 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Kıymalı Tarhana Çorbası',
      'Meyve',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Geleneksel lezzetler',
      'Ev yemeği tadı',
      'Nostaljik menüler',
      'Sağlıklı yorumlar'
    ]
  },
  // Anne Mutfağı - Kahvaltısız
  {
    id: 'anne-kahvaltisiz-1200',
    dietType: 'anne-mutfagi',
    dietName: 'Anne Mutfağı',
    description: 'Geleneksel Türk mutfağından sağlıklı yorumlar',
    mealConfig: {
      id: 'kahvaltisiz',
      name: 'Kahvaltısız',
      description: '2 ana öğün + 2 ara öğün',
      meals: { main: 2, snack: 2 }
    },
    calorieTiers: [
      { calories: 1200, price: 850 },
      { calories: 1500, price: 950 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Kıymalı Tarhana Çorbası',
      'Meyve',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Geleneksel lezzetler',
      'Ev yemeği tadı',
      'Nostaljik menüler',
      'Sağlıklı yorumlar'
    ]
  },
  // Anne Mutfağı - Gündüz
  {
    id: 'anne-gunduz-800',
    dietType: 'anne-mutfagi',
    dietName: 'Anne Mutfağı',
    description: 'Geleneksel Türk mutfağından sağlıklı yorumlar',
    mealConfig: {
      id: 'gunduz',
      name: 'Gündüz Programı',
      description: 'Öğle yemeği + 2 ara öğün',
      meals: { main: 1, snack: 2 }
    },
    calorieTiers: [
      { calories: 800, price: 700 },
      { calories: 1100, price: 800 }
    ],
    sampleMenu: [
      'Fırınlanmış Domatesli Menemen',
      'Hindistancevizi Bisküvi',
      'Kıymalı Tarhana Çorbası',
      'Meyve',
      'Kuru Domatesli Tavuk Sarma'
    ],
    features: [
      'Geleneksel lezzetler',
      'Ev yemeği tadı',
      'Nostaljik menüler',
      'Sağlıklı yorumlar'
    ]
  }
];
