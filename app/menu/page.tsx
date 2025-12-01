import React from 'react';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import { Calendar, Info } from 'lucide-react';

export const metadata = {
  title: 'Haftanın Menüsü - P25 Foods',
  description: 'P25 Foods haftalık yemek menüsü. Uzman diyetisyenler eşliğinde hazırlanan sağlıklı ve lezzetli öğünler.',
};

export default function MenuPage() {
  return (
    <>
      <Section background="cream" className="pt-8">
        <SectionTitle 
          title="Haftanın Menüsü"
          subtitle="Her hafta yenilenen, mevsimsel ve taze içerikli menümüz"
        />
      </Section>

      <Section>
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
            <p className="text-sm text-blue-800">
              Menülerimiz mevsimsel sebze ve meyvelerin tazeliğine göre değişiklik gösterebilir. 
              P25 Foods, en taze ve en sağlıklı içeriği sunmak için menüde değişiklik yapma hakkını saklı tutar.
            </p>
          </div>

          {/* Menü içeriği buraya gelecek - Şimdilik placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Menü Yükleniyor</h3>
            <p className="text-gray-500">
              Bu haftanın lezzetli P25 Foods menüsü hazırlanıyor. Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
