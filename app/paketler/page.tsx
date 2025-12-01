import React from 'react';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import PackageCard from '@/components/packages/package-card';

export const metadata = {
  title: 'Paketler - P25 Foods',
  description: 'Size uygun P25 Foods beslenme paketini seçin. Kilo verme, dengeli beslenme, sporcu beslenmesi ve daha fazlası.',
};

export default function PackagesPage() {
  return (
    <>
      <Section background="cream" className="pt-8">
        <SectionTitle 
          title="Paketlerimiz"
          subtitle="Hedefinize ve yaşam tarzınıza uygun P25 Foods paketini seçin"
        />
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Paket kartları buraya gelecek */}
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Paketler yükleniyor...</p>
          </div>
        </div>
      </Section>
    </>
  );
}
