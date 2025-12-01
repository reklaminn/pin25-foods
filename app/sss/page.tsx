import React from 'react';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import { Plus, Minus } from 'lucide-react';

export const metadata = {
  title: 'Sıkça Sorulan Sorular - P25 Foods',
  description: 'P25 Foods hakkında merak edilenler. Teslimat, menü içeriği, ödeme seçenekleri ve daha fazlası.',
};

export default function FAQPage() {
  return (
    <>
      <Section background="cream" className="pt-8">
        <SectionTitle 
          title="Sıkça Sorulan Sorular"
          subtitle="P25 Foods hakkında merak ettikleriniz"
        />
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto space-y-4">
          {/* SSS Accordion yapısı buraya gelecek */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">P25 Foods yemekleri nasıl hazırlanıyor?</h3>
            <p className="text-gray-600">
              Yemeklerimiz, profesyonel şeflerimiz tarafından günlük taze malzemelerle, 
              hijyenik mutfağımızda hazırlanmaktadır. Hiçbir katkı maddesi kullanılmamaktadır.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">Teslimat bölgeleriniz nerelerdir?</h3>
            <p className="text-gray-600">
              Şu anda İstanbul Anadolu Yakası'nın büyük bir bölümüne hizmet vermekteyiz. 
              Detaylı bölge listesini footer alanında bulabilirsiniz.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
