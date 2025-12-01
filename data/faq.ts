export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'P25 Foods & Cloud Kitchen nedir?',
    answer: 'P25 Foods & Cloud Kitchen, günlük sağlıklı yemek aboneliği hizmeti sunan bir markadır. Temiz içerikli, fonksiyonel menüler hazırlayarak sağlıklı beslenmeyi zahmetsiz hale getiriyoruz.'
  },
  {
    id: '2',
    question: 'Hangi bölgelere teslimat yapıyorsunuz?',
    answer: 'Şu anda Maslak, Levent, Etiler, Bomonti, Kağıthane ve Zekeriyaköy bölgelerine teslimat yapıyoruz. Yakında yeni bölgeler eklenecek.'
  },
  {
    id: '3',
    question: 'Menüler nasıl belirleniyor?',
    answer: 'Menülerimiz, bütüncül beslenme danışmanımız ve deneyimli şeflerimiz tarafından birlikte hazırlanıyor. Her hafta farklı, dengeli ve lezzetli seçenekler sunuyoruz.'
  },
  {
    id: '4',
    question: 'Paketler nasıl çalışıyor?',
    answer: '5, 10, 15 veya 20 günlük paketler arasından seçim yapabilirsiniz. Her paket hafta içi 5 gün teslimat içerir ve günde 3 ana öğün + 2 ara öğün sunar.'
  },
  {
    id: '5',
    question: 'Teslimat saatleri nedir?',
    answer: 'Yemekleriniz her sabah 06:00-08:00 arasında kapınıza teslim edilir. Böylece tüm gün boyunca taze yemeklerinize erişebilirsiniz.'
  },
  {
    id: '6',
    question: 'Alerjim var, özel menü yapabilir misiniz?',
    answer: 'Evet, alerjilerinizi ve beslenme tercihlerinizi bize bildirirseniz menünüzü buna göre özelleştirebiliriz. Lütfen bizimle iletişime geçin.'
  },
  {
    id: '7',
    question: 'Haftalık menüyü nereden görebilirim?',
    answer: 'Her hafta Pazartesi günü bir sonraki haftanın menüsünü web sitemizde ve sosyal medya hesaplarımızda paylaşıyoruz.'
  },
  {
    id: '8',
    question: 'İptal ve iade politikanız nedir?',
    answer: 'Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal talebiniz bir sonraki teslimat döneminden itibaren geçerli olur. Detaylar için KVKK ve İptal & İade sayfamızı inceleyebilirsiniz.'
  },
  {
    id: '9',
    question: 'Yemekler nasıl saklanmalı?',
    answer: 'Yemekleriniz soğuk zincir kurallarına uygun olarak teslim edilir. Buzdolabında saklanmalı ve tüketim öncesi ısıtılmalıdır.'
  },
  {
    id: '10',
    question: 'Kalori ve besin değerleri belirtiliyor mu?',
    answer: 'Evet, her öğünün kalori, protein, karbonhidrat ve yağ değerleri detaylı olarak belirtilir. Böylece beslenme hedefinizi kolayca takip edebilirsiniz.'
  },
  {
    id: '11',
    question: 'Kurumsal paket alabilir miyiz?',
    answer: 'Elbette! Ofislere özel kurumsal paketlerimiz var. Detaylı bilgi için Kurumsal Çözümler sayfamızı ziyaret edebilir veya bizimle iletişime geçebilirsiniz.'
  },
  {
    id: '12',
    question: 'Ödeme seçenekleri nelerdir?',
    answer: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeler güvenli ödeme altyapısı üzerinden gerçekleşir.'
  },
  {
    id: '13',
    question: 'Vejetaryen/vegan seçenekler var mı?',
    answer: 'Evet, menümüzde vejetaryen seçenekler bulunmaktadır. Vegan menü talepleriniz için lütfen bizimle iletişime geçin.'
  },
  {
    id: '14',
    question: 'Yemekleri ısıtmak için önerileriniz nedir?',
    answer: 'Yemeklerinizi mikrodalga veya fırında ısıtabilirsiniz. Her öğünün ambalajında ısıtma talimatları bulunur.'
  },
  {
    id: '15',
    question: 'Tatil günlerinde teslimat oluyor mu?',
    answer: 'Hayır, teslimatlarımız hafta içi yapılmaktadır. Resmi tatil günlerinde teslimat yapılmaz.'
  },
  {
    id: '16',
    question: 'Paket değişikliği yapabilir miyim?',
    answer: 'Evet, mevcut paketinizi bitirmeden önce bir sonraki dönem için farklı bir paket seçebilirsiniz.'
  },
  {
    id: '17',
    question: 'Yemeklerin son kullanma tarihi ne kadar?',
    answer: 'Yemeklerimiz günlük taze hazırlanır ve 24-48 saat içinde tüketilmelidir. Her öğünün üzerinde son kullanma tarihi belirtilir.'
  },
  {
    id: '18',
    question: 'Spor yapıyorum, yüksek proteinli seçenekler var mı?',
    answer: 'Evet, menümüzde yüksek protein içerikli özel seçenekler bulunmaktadır. Spor yapanlar için ideal dengeli menüler sunuyoruz.'
  },
  {
    id: '19',
    question: 'Hamilelik döneminde kullanabilir miyim?',
    answer: 'Menülerimiz dengeli ve sağlıklıdır ancak hamilelik döneminde doktorunuza danışmanızı öneririz. Özel ihtiyaçlarınız için bizimle iletişime geçebilirsiniz.'
  },
  {
    id: '20',
    question: 'Yemeklerde katkı maddesi var mı?',
    answer: 'Hayır, yemeklerimizde yapay katkı maddesi, koruyucu veya tatlandırıcı kullanmıyoruz. Tamamen doğal ve temiz içeriklerle çalışıyoruz.'
  },
  {
    id: '21',
    question: 'Porsiyonlar doyurucu mu?',
    answer: 'Evet, porsiyonlarımız ortalama bir yetişkinin günlük kalori ihtiyacını karşılayacak şekilde planlanmıştır. İhtiyacınıza göre paket seçimi yapabilirsiniz.'
  },
  {
    id: '22',
    question: 'Teslimat ücreti var mı?',
    answer: 'Hayır, belirtilen teslimat bölgelerine ücretsiz teslimat yapıyoruz.'
  },
  {
    id: '23',
    question: 'Yemekleri dondurabilir miyim?',
    answer: 'Yemeklerimiz taze tüketim için tasarlanmıştır. Dondurma önerilmez çünkü lezzet ve doku kalitesi etkilenebilir.'
  },
  {
    id: '24',
    question: 'Müşteri hizmetlerine nasıl ulaşabilirim?',
    answer: 'İletişim sayfamızdan bize ulaşabilir, WhatsApp hattımızdan mesaj gönderebilir veya e-posta atabilirsiniz. Size en kısa sürede dönüş yapacağız.'
  }
];
