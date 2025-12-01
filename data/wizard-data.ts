export interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  type: 'multi' | 'single' | 'slider';
  maxSelections?: number;
  options: WizardOption[];
  motivationText: string;
  motivationImage: string;
}

export interface WizardOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export const wizardSteps: WizardStep[] = [
  {
    id: 'goals',
    title: 'Hedefleriniz Neler?',
    subtitle: 'Size en uygun planı belirlemek için 3\'e kadar hedef seçin.',
    type: 'multi',
    maxSelections: 3,
    options: [
      { id: 'lose-weight', label: 'Kilo vermek istiyorum', icon: '🏃' },
      { id: 'gain-muscle', label: 'Kas yapmak istiyorum', icon: '💪' },
      { id: 'improve-health', label: 'Sağlığımı iyileştirmek istiyorum', icon: '❤️' },
      { id: 'save-time', label: 'Mutfakta zaman kazanmak istiyorum', icon: '⏰' },
      { id: 'variety', label: 'Daha çeşitli beslenmek istiyorum', icon: '🥗' },
      { id: 'maintain-weight', label: 'Kilomı korumak istiyorum', icon: '🎯' }
    ],
    motivationText: 'Hedefleriniz sağlık, denge veya zaman olsun, MEALORA iyi beslenmeyi kolaylaştırır.',
    motivationImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'diet-type',
    title: 'Beslenme Tercihiniz?',
    subtitle: 'Tüm menüye erişiminiz olacak, ancak önce bu yemekleri göstereceğiz.',
    type: 'single',
    options: [
      { id: 'akdeniz', label: 'Akdeniz Tipi', icon: '🫒' },
      { id: 'yuksek-protein', label: 'Yüksek Protein', icon: '💪' },
      { id: 'vegan', label: 'Vegan/Vejetaryen', icon: '🌱' },
      { id: 'anne-mutfagi', label: 'Anne Mutfağı', icon: '🏠' },
      { id: 'everything', label: 'Her şeyi yerim', icon: '🍽️' }
    ],
    motivationText: 'MEALORA\'yı seviyorum. Sağlıklı beslenmeye devam etmek kolay ve yemekler lezzetli.',
    motivationImage: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'avoid-proteins',
    title: 'Kaçınmak İstediğiniz Proteinler?',
    subtitle: 'Beğenme ihtimaliniz yüksek tarifleri önereceğiz.',
    type: 'multi',
    options: [
      { id: 'no-pork', label: 'Domuz eti yok', icon: '🐷', description: 'Jelatin gibi domuz türevlerini içerir' },
      { id: 'no-fish', label: 'Balık yok', icon: '🐟' },
      { id: 'no-seafood', label: 'Deniz ürünleri yok', icon: '🦐', description: 'Karides, midye ve kabuklu deniz ürünleri' },
      { id: 'no-red-meat', label: 'Kırmızı et yok', icon: '🥩' },
      { id: 'no-chicken', label: 'Tavuk yok', icon: '🐔' }
    ],
    motivationText: 'Planınız, sizin yolunuzla. Diyetinize uyacak şekilde özelleştirin, taviz vermeyin.',
    motivationImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'avoid-ingredients',
    title: 'Kaçınmak İstediğiniz Malzemeler?',
    subtitle: 'Beğenme ihtimaliniz yüksek tarifleri önereceğiz.',
    type: 'multi',
    options: [
      { id: 'no-spicy', label: 'Baharatlı yemekler yok', icon: '🌶️' },
      { id: 'no-mushrooms', label: 'Mantar yok', icon: '🍄' },
      { id: 'no-onions', label: 'Soğan yok', icon: '🧅' },
      { id: 'no-nuts', label: 'Fındık/fıstık yok', icon: '🥜' },
      { id: 'no-gluten', label: 'Gluten yok', icon: '🌾' }
    ],
    motivationText: 'Sevmediğinizi atlayın. Sevdiğinizi saklayın.',
    motivationImage: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'people-count',
    title: 'Kaç Kişilik?',
    subtitle: 'Masanızda kaç kişi olduğunu bize bildirin. Bunu daha sonra her zaman güncelleyebilirsiniz.',
    type: 'single',
    options: [
      { id: 'just-me', label: 'Sadece ben', icon: '👤' },
      { id: 'two', label: 'İki kişi', icon: '👥' },
      { id: 'family', label: 'Grup/aile', icon: '👨‍👩‍👧‍👦' }
    ],
    motivationText: 'İster sadece siz olun ister tüm masa, yemekleriniz yaşamınıza uyar.',
    motivationImage: 'https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'calories',
    title: 'Günlük Kalori Hedefiniz?',
    subtitle: 'Hedeflerinize ulaşmanız için ideal kalori aralığını seçin.',
    type: 'slider',
    options: [
      { id: '1200', label: '1200 kcal', icon: '⚡' },
      { id: '1500', label: '1500 kcal', icon: '⚡' },
      { id: '1800', label: '1800 kcal', icon: '⚡' },
      { id: '2000', label: '2000 kcal', icon: '⚡' }
    ],
    motivationText: 'Kişiselleştirilmiş kalori hedefi ile sağlıklı yaşam yolculuğunuza başlayın.',
    motivationImage: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'meal-plan',
    title: 'Öğün Düzeniniz?',
    subtitle: 'Günlük rutininize en uygun öğün planını seçin.',
    type: 'single',
    options: [
      { id: 'sabah-aksam', label: 'Sabah-Akşam', icon: '🌅', description: '3 ana öğün + 2 ara öğün' },
      { id: 'oglensiz-aksamsiz', label: 'Öğlensiz/Akşamsız', icon: '🌞', description: '2 ana öğün + 2 ara öğün' },
      { id: 'kahvaltisiz', label: 'Kahvaltısız', icon: '☀️', description: '2 ana öğün + 2 ara öğün' },
      { id: 'gunduz', label: 'Gündüz Programı', icon: '🌤️', description: '1 ana öğün + 2 ara öğün' }
    ],
    motivationText: 'Esnek öğün planları ile yaşam tarzınıza uygun beslenin.',
    motivationImage: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export interface UserSelections {
  goals: string[];
  dietType: string;
  avoidProteins: string[];
  avoidIngredients: string[];
  peopleCount: string;
  calories: string;
  mealPlan: string;
}

export const initialSelections: UserSelections = {
  goals: [],
  dietType: '',
  avoidProteins: [],
  avoidIngredients: [],
  peopleCount: '',
  calories: '1500',
  mealPlan: ''
};
