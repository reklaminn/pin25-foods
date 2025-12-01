'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A6B3C] via-[#5a7b4c] to-[#4A6B3C]"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F28C8C]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-[#F28C8C]" />
            <span className="text-sm font-medium text-white">Özel Fırsat</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Sağlıklı Yaşama
            <span className="block bg-gradient-to-r from-[#F28C8C] to-[#FFF8F0] bg-clip-text text-transparent">
              Bugün Başlayın
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            İlk siparişinizde %20 indirim fırsatını kaçırmayın. Sağlıklı ve lezzetli öğünlerle tanışın.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/paket-sec"
              className="group px-8 py-4 bg-white text-[#4A6B3C] rounded-full font-semibold text-lg hover:bg-[#FFF8F0] transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Paketleri Keşfet
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/iletisim"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              Bize Ulaşın
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#F28C8C]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Ücretsiz Teslimat</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#F28C8C]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">İstediğin Zaman İptal</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#F28C8C]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">7/24 Destek</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
