'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Package, UserCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { useLogo } from '@/hooks/useLogo';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logoUrl } = useLogo();
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };
    
    checkAuth();
    
    // Listen for storage changes (login/logout events)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
  
  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Haftanın Menüsü', href: '/menu' },
    { name: 'Paketler', href: '/paketler' },
    { name: 'Tanışalım', href: '/taniyalim' },
    { name: 'SSS', href: '/sss' },
    { name: 'Kurumsal Çözümler', href: '/kurumsal' },
    { name: 'İletişim', href: '/iletisim' },
  ];
  
  return (
    <header className="sticky top-0 z-[100] bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <nav className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-20 h-20 flex-shrink-0 transition-transform group-hover:scale-105">
              <img 
                src={logoUrl} 
                alt="Pin25 Foods & Cloud Kitchen" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block leading-[0.25rem]">
              <span className="font-logo text-lg md:text-xl font-bold text-mealora-primary dark:text-mealora-primary block leading-[0.25rem]">
                Pin25 Foods
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-[0.25rem]">
                & Cloud Kitchen
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-mealora-primary dark:hover:text-mealora-primary transition-colors font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Member Icon Button */}
            <Link 
              href={isLoggedIn ? '/member' : '/member/login'}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-mealora-primary dark:hover:text-mealora-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all"
              title={isLoggedIn ? 'Hesabım' : 'Giriş Yap'}
            >
              <UserCircle size={24} />
            </Link>
            
            {/* Package Selection Button */}
            <Link href="/paket-sec">
              <Button size="sm" icon={Package}>
                Paket Seç
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-mealora-primary transition-colors"
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-mealora-primary transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Member Link */}
              <Link
                href={isLoggedIn ? '/member' : '/member/login'}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-mealora-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCircle size={20} />
                <span>{isLoggedIn ? 'Hesabım' : 'Giriş Yap'}</span>
              </Link>
              
              {/* Mobile Package Button */}
              <Link href="/paket-sec" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" icon={Package}>
                  Paket Seç
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
