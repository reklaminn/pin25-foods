import React from 'react';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import Button from '@/components/ui/button';
import { Building2, Users, Heart, Coffee } from 'lucide-react';

export const metadata = {
  title: 'Kurumsal Çözümler - Pin25 Foods',
  description: 'Şirketiniz için sağlıklı yemek çözümleri. Pin25 Foods ile çalışanlarınızın motivasyonunu ve sağlığını artırın.',
};

export default function CorporatePage() {
  return (
    <>
      <Section background="cream" className="pt-8">
        <SectionTitle 
          title="Kurumsal Çözümler"
          subtitle="Çalışanlarınız için sağlıklı ve lezzetli yemek çözümleri"
        />
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Pin25 Foods ile İş Yerinde Sağlık</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Çalışanlarınızın sağlığı ve mutluluğu, şirketinizin başarısı için kritiktir. 
              Pin25 Foods olarak, ofis çalışanları için özel olarak tasarlanmış, dengeli ve 
              lezzetli menülerimizle iş yerinde beslenmeyi bir üst seviyeye taşıyoruz.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Toplantı ikramlarından günlük personel yemeğine kadar tüm ihtiyaçlarınız için 
              kurumsal çözümler sunuyoruz.
            </p>
            <Button size="lg">Teklif Alın</Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg" 
              alt="Pin25 Foods Kurumsal" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Building2,
              title: 'Ofis Teslimatı',
              desc: 'Her gün belirlenen saatte ofisinize taze teslimat.'
            },
            {
              icon: Users,
              title: 'Toplu Sipariş',
              desc: 'Ekip yemekleri ve etkinlikler için özel menüler.'
            },
            {
              icon: Heart,
              title: 'Çalışan Sağlığı',
              desc: 'Dengeli beslenme ile artan enerji ve motivasyon.'
            },
            {
              icon: Coffee,
              title: 'Toplantı İkramları',
              desc: 'Sağlıklı atıştırmalıklar ve coffee break çözümleri.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-mealora-primary/10 text-mealora-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
