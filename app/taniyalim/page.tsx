import React from 'react';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import Card from '@/components/ui/card';

export const metadata = {
  title: 'Tanışalım - Pin25 Foods & Cloud Kitchen',
  description: 'Pin25 Foods & Cloud Kitchen ekibi ve hikayemiz. Deneyimli şefler ve beslenme danışmanı ile sağlıklı yaşam yolculuğunuzda yanınızdayız.',
};

export default function AboutPage() {
  const team = [
    {
      name: 'Pınar Altunsoy',
      role: 'Kurucu',
      bio: '25+ yıl profesyonel mutfak deneyimi, yeme-içme danışmanlığı ve restoran yöneticiliği. Temiz gıda, lezzetli yemek ve kadın emeği odaklı çalışmalarıyla Pin25 Foods & Cloud Kitchen\'ın temellerini attı.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      name: 'Sinem Keşen',
      role: 'Mutfak Koordinatörü ve Şefi',
      bio: '15+ yıl pasta ve mutfak şefliği, catering ve eğitmenlik deneyimi. Disiplin ve titizlikle mutfağın "kalesi"ni yönetiyor. Her öğünün mükemmel olması için çalışıyor.',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg'
    },
    {
      name: 'İrem Terci',
      role: 'Bütüncül Beslenme Danışmanı',
      bio: 'Institute for Integrative Nutrition mezunu. Fonksiyonel menülerin arkasındaki bütüncül bakış açısını sağlıyor. Beslenmenin sadece kalori değil, yaşam kalitesi olduğuna inanıyor.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    }
  ];
  
  return (
    <>
      <Section background="cream" className="pt-8">
        <SectionTitle 
          title="Tanışalım"
          subtitle="Pin25 Foods & Cloud Kitchen ailesini tanıyın"
        />
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Pin25 Foods & Cloud Kitchen, sağlıklı beslenmeyi zahmetsiz hale getirme vizyonuyla yola çıktı. 
              Modern yaşamın hızlı temposunda, kaliteli ve dengeli beslenmenin lüks değil, 
              herkesin hakkı olduğuna inanıyoruz.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Yemek sadece doymak değil; kendine özen göstermek, iyi hissetmek, iyileşmek ve 
              zinde olmaktır. Bu felsefe ile her öğünü özenle hazırlıyor, temiz içerikli ve 
              fonksiyonel menüler sunuyoruz.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              Deneyimli şeflerimiz ve beslenme danışmanımızla oluşturduğumuz ekip, 
              sizin için en iyisini sunmak için çalışıyor. Her öğün, bir ziyafet; 
              her gün, iyi yaşamın tadı.
            </p>
          </div>
        </div>

        <SectionTitle 
          title="Ekibimiz"
          subtitle="Pin25 Foods & Cloud Kitchen\'ı hayata geçiren tutkulu insanlar"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card key={member.name} hover>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-xl mb-1">{member.name}</h3>
              <p className="text-mealora-primary font-semibold mb-3">{member.role}</p>
              <p className="text-gray-600 leading-relaxed">{member.bio}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="beige">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: 'Temiz Gıda',
                description: 'Yapay katkı maddesi, koruyucu veya tatlandırıcı kullanmıyoruz. Sadece doğal, taze malzemeler.'
              },
              {
                title: 'Lezzet',
                description: 'Sağlıklı beslenme lezzetten ödün vermek değildir. Her öğün bir ziyafet olmalı.'
              },
              {
                title: 'Kadın Emeği',
                description: 'Kadınların mutfaktaki emeğine değer veriyor, güçlendiriyoruz.'
              }
            ].map((value, index) => (
              <div key={index}>
                <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
