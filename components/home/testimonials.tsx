'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ayşe Yılmaz',
    role: 'Yazılım Geliştirici',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    text: 'P25 Foods sayesinde hem zaman kazanıyorum hem de sağlıklı besleniyorum. Yemekler çok lezzetli ve porsiyon kontrolü mükemmel. Kesinlikle tavsiye ederim!'
  },
  {
    name: 'Mehmet Kaya',
    role: 'Fitness Antrenörü',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    text: 'Sporcular için ideal bir hizmet. Protein oranları ve kalori hesaplamaları tam istediğim gibi. Müşterilerime de öneriyorum.'
  },
  {
    name: 'Zeynep Demir',
    role: 'Doktor',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    text: 'Yoğun mesai saatlerimde sağlıklı beslenmeyi ihmal ediyordum. P25 Foods ile bu sorun tamamen çözüldü. Taze ve kaliteli malzemeler kullanılıyor.'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#FFF8F0] to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Binlerce mutlu müşterimizin deneyimlerini keşfedin
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#4A6B3C] to-[#5a7b4c] rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F28C8C] text-[#F28C8C]" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#E6D5C3]"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4A6B3C] to-[#5a7b4c] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#4A6B3C] mb-2">10K+</div>
            <div className="text-gray-600">Mutlu Müşteri</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#4A6B3C] mb-2">4.9</div>
            <div className="text-gray-600">Ortalama Puan</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#4A6B3C] mb-2">98%</div>
            <div className="text-gray-600">Memnuniyet</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#4A6B3C] mb-2">280+</div>
            <div className="text-gray-600">Farklı Yemek</div>
          </div>
        </div>
      </div>
    </section>
  );
}
