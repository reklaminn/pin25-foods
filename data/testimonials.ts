export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    role: 'Pazarlama Müdürü',
    comment: 'Yoğun iş temposu içinde sağlıklı beslenmeyi sürdürmek çok zordu. P25 Foods & Cloud Kitchen sayesinde hem zaman kazanıyorum hem de kendimi çok daha enerjik hissediyorum.',
    rating: 5
  },
  {
    id: '2',
    name: 'Mehmet Kaya',
    role: 'Yazılım Geliştirici',
    comment: 'Menülerdeki çeşitlilik ve lezzet harika. Her gün farklı tatlar deniyorum ve hiç sıkılmıyorum. Özellikle protein ağırlıklı seçenekler spor yapmam için çok uygun.',
    rating: 5
  },
  {
    id: '3',
    name: 'Zeynep Demir',
    role: 'Avukat',
    comment: 'Kurumsal paket olarak ofisimize aldık. Ekip olarak öğle yemeklerinde bir araya geliyoruz ve herkes çok memnun. Hem sağlıklı hem de pratik bir çözüm.',
    rating: 5
  },
  {
    id: '4',
    name: 'Can Özkan',
    role: 'Girişimci',
    comment: 'Kalori ve makro takibi yapan biri olarak P25 Foods & Cloud Kitchen tam aradığım şeydi. Her öğünün besin değerleri net bir şekilde belirtilmiş. Hedeflerime ulaşmam çok kolaylaştı.',
    rating: 5
  }
];
