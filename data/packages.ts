export interface Package {
  id: string;
  name: string;
  days: number;
  description: string;
  price: string;
  highlight: boolean;
  features: string[];
  meals: {
    main: number;
    snack: number;
  };
}

export const packages: Package[] = [
  {
    id: '5-gun',
    name: '5 Gün Paketi',
    days: 5,
    description: 'Hafta içi tam gün beslenme paketi. Yoğun iş temposunda sağlıklı beslenmeye devam etmek isteyenler için ideal.',
    price: '1.750₺',
    highlight: false,
    features: [
      'Hafta içi 5 gün teslimat',
      'Günde 3 ana öğün',
      'Günde 2 ara öğün',
      'Haftalık menü takibi',
      'Esnek iptal'
    ],
    meals: {
      main: 3,
      snack: 2
    }
  },
  {
    id: '10-gun',
    name: '10 Gün Paketi',
    days: 10,
    description: 'İki haftalık tam gün beslenme paketi. Sağlıklı beslenme rutini oluşturmak isteyenler için.',
    price: '3.300₺',
    highlight: true,
    features: [
      '2 hafta boyunca 5\'er gün teslimat',
      'Günde 3 ana öğün',
      'Günde 2 ara öğün',
      'Haftalık menü takibi',
      'Öncelikli müşteri desteği'
    ],
    meals: {
      main: 3,
      snack: 2
    }
  },
  {
    id: '15-gun',
    name: '15 Gün Paketi',
    days: 15,
    description: 'Üç haftalık tam gün beslenme paketi. Uzun vadeli sağlıklı yaşam hedefleriniz için.',
    price: '4.800₺',
    highlight: false,
    features: [
      '3 hafta boyunca 5\'er gün teslimat',
      'Günde 3 ana öğün',
      'Günde 2 ara öğün',
      'Kişiselleştirilmiş menü önerileri',
      'Beslenme danışmanlığı desteği'
    ],
    meals: {
      main: 3,
      snack: 2
    }
  },
  {
    id: '20-gun',
    name: '20 Gün Paketi',
    days: 20,
    description: 'Dört haftalık tam gün beslenme paketi. Yaşam tarzı değişikliği için en kapsamlı seçenek.',
    price: '6.200₺',
    highlight: false,
    features: [
      '4 hafta boyunca 5\'er gün teslimat',
      'Günde 3 ana öğün',
      'Günde 2 ara öğün',
      'Kişiselleştirilmiş menü planlaması',
      'Bire bir beslenme danışmanlığı',
      'En avantajlı fiyat'
    ],
    meals: {
      main: 3,
      snack: 2
    }
  }
];
