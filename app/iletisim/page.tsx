import React from 'react';
import Section from '@/components/ui/section';
import SectionTitle from '@/components/ui/section-title';
import Button from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata = {
  title: 'İletişim - P25 Foods',
  description: 'P25 Foods ile iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.',
};

export default function ContactPage() {
  return (
    <>
      <Section background="cream" className="pt-8">
        <SectionTitle 
          title="İletişim"
          subtitle="Sorularınız için bize ulaşın"
        />
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl mb-6">İletişim Bilgileri</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Adres</p>
                    <p className="text-gray-600 text-sm">
                      Örnek Mahallesi, Sağlık Caddesi No: 25<br />
                      Kadıköy / İstanbul
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Telefon</p>
                    <p className="text-gray-600 text-sm">+90 (216) 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">E-posta</p>
                    <p className="text-gray-600 text-sm">info@p25foods.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Çalışma Saatleri</p>
                    <p className="text-gray-600 text-sm">
                      Pazartesi - Cuma: 09:00 - 18:00<br />
                      Cumartesi: 09:00 - 13:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl mb-6">Bize Yazın</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                  <textarea rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"></textarea>
                </div>
                <Button type="submit" className="w-full md:w-auto">Gönder</Button>
              </form>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
