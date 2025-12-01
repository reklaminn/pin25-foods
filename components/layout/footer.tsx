'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Shield } from 'lucide-react';
import { deliveryZones } from '@/data/deliveryZones';
import { useLogo } from '@/hooks/useLogo';

export default function Footer() {
  const { logoUrl } = useLogo();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10">
                <img 
                  src={logoUrl} 
                  alt="Pin25 Foods & Cloud Kitchen" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-logo text-lg font-bold text-white leading-tight">
                  Pin25 Foods
                </h3>
                <p className="text-xs text-gray-400">& Cloud Kitchen</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Sağlıklı beslenmeyi zahmetsiz hale getiriyoruz. Premium kalitede hazır yemek çözümleri.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-mealora-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-mealora-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-mealora-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-mealora-accent transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/menu" className="hover:text-mealora-accent transition-colors">Haftanın Menüsü</Link></li>
              <li><Link href="/paketler" className="hover:text-mealora-accent transition-colors">Paketler</Link></li>
              <li><Link href="/taniyalim" className="hover:text-mealora-accent transition-colors">Tanışalım</Link></li>
              <li><Link href="/sss" className="hover:text-mealora-accent transition-colors">SSS</Link></li>
            </ul>
          </div>
          
          {/* Corporate */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kurumsal" className="hover:text-mealora-accent transition-colors">Kurumsal Çözümler</Link></li>
              <li><Link href="/iletisim" className="hover:text-mealora-accent transition-colors">İletişim</Link></li>
              <li><Link href="#" className="hover:text-mealora-accent transition-colors">KVKK</Link></li>
              <li><Link href="#" className="hover:text-mealora-accent transition-colors">İptal & İade</Link></li>
              <li>
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 text-gray-400 hover:text-mealora-accent transition-colors group"
                >
                  <Shield size={16} className="group-hover:text-mealora-accent" />
                  <span>Admin Paneli</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Delivery Zones */}
          <div>
            <h4 className="font-semibold text-white mb-4">Teslimat Bölgeleri</h4>
            <div className="flex flex-wrap gap-2">
              {deliveryZones.map((zone) => (
                <span 
                  key={zone}
                  className="px-3 py-1 bg-gray-800 rounded-full text-xs"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Pin25 Foods & Cloud Kitchen. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
