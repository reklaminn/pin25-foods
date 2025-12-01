'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import Button from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative bg-[#3E5834] overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mealora-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-mealora-yellow"></span>
              </span>
              <span className="text-sm font-medium text-white">Pin25 Foods ile Sağlıklı Yaşama Adım Atın</span>
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                İyi yaşamın <span className="text-mealora-yellow relative inline-block">
                  tadı
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-white opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-mealora-cream/90 font-light mt-4 italic">
                The taste of better living
              </p>
            </div>
            
            <p className="text-lg text-mealora-cream/80 leading-relaxed max-w-xl">
              Pin25 Foods mutfağından çıkan, beslenme uzmanı onaylı, katkısız ve lezzetli yemek paketleri kapına gelsin. Zaman kazan, iyi hisset.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/paket-sec">
                <Button size="lg" className="bg-[#EB6F75] hover:bg-[#d65f65] text-white font-semibold border-none shadow-lg shadow-black/10" icon={ArrowRight}>
                  Paketini Seç
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white">
                  Menüyü İncele
                </Button>
              </Link>
            </div>
            
            <div className="pt-6 flex flex-wrap items-center gap-6 text-sm text-mealora-cream/70 font-medium border-t border-white/10 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-mealora-yellow" />
                <span>Katkısız İçerik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-mealora-yellow" />
                <span>Uzman Onaylı</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-mealora-yellow" />
                <span>Ücretsiz Teslimat</span>
              </div>
            </div>
          </div>
          
          {/* Right Image Area */}
          <div className="relative lg:h-[600px] w-full flex items-center justify-center">
            {/* Main Image Container */}
            <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border-4 border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" 
                alt="Pin25 Foods Sağlıklı Yemekler" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3E5834]/90 via-transparent to-transparent"></div>
              
              {/* Image Overlay Text */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} className="text-mealora-yellow fill-mealora-yellow" />
                    ))}
                  </div>
                  <span className="text-white text-sm font-medium">5.0 Müşteri Puanı</span>
                </div>
                <p className="text-white/90 text-sm">"Hayatımı kolaylaştıran en lezzetli karar!"</p>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute top-10 -right-4 md:right-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow z-20 max-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3E5834]/10 flex items-center justify-center text-[#3E5834]">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="font-bold text-mealora-graphite text-sm">Günlük Taze</p>
                  <p className="text-xs text-gray-500">Her sabah üretim</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[100px] rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
      
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-b from-black/20 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-black/10 blur-3xl rounded-tr-full"></div>
    </section>
  );
}
