'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { 
  LayoutDashboard, UtensilsCrossed, Calendar, Package, MapPin, Clock, Tag, 
  HelpCircle, Building2, MessageSquare, Settings, Menu, X, LogOut, ChevronDown, User 
} from 'lucide-react';
import { signOutAdmin } from '@/lib/auth-helpers';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Yemekler', href: '/admin/yemekler', icon: UtensilsCrossed },
  { name: 'Haftalık Menü', href: '/admin/haftalik-menu', icon: Calendar },
  { name: 'Paketler', href: '/admin/paketler', icon: Package },
  { 
    name: 'Teslimat', 
    href: '/admin/teslimat',
    icon: MapPin,
    children: [
      { name: 'Bölgeler', href: '/admin/teslimat/bolgeler', icon: MapPin },
      { name: 'Saatler', href: '/admin/teslimat/saatler', icon: Clock },
    ]
  },
  { name: 'Kuponlar', href: '/admin/kuponlar', icon: Tag },
  { name: 'SSS', href: '/admin/sss', icon: HelpCircle },
  { name: 'Kurumsal Başvurular', href: '/admin/kurumsal', icon: Building2 },
  { name: 'İletişim', href: '/admin/iletisim', icon: MessageSquare },
  { name: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login sayfasında mıyız kontrolü
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Eğer login sayfasındaysak auth kontrolü yapma
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('No session');
        }

        // Get admin details
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (adminError || !admin || !admin.is_active) {
          throw new Error('Not authorized');
        }

        if (mounted) {
          setAdminUser(admin);
          setLoading(false);
        }
      } catch (error) {
        console.error('[AdminLayout] Auth check failed:', error);
        if (mounted) {
          setAdminUser(null);
          router.replace('/admin/login');
        }
      }
    };

    // 1. İlk yüklemede kontrol et
    checkAuth();

    // 2. Auth durum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AdminLayout] Auth Event:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) {
          setAdminUser(null);
          setLoading(true);
          router.replace('/admin/login');
        }
      } else if (event === 'SIGNED_IN' && session) {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, isLoginPage]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutAdmin();
      router.replace('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  };

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Eğer login sayfasındaysak, sadece içeriği (login formunu) göster
  // Sidebar veya loading ekranı gösterme
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading durumunda veya adminUser yoksa içeriği gösterme
  if (loading || !adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-mealora-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-20 px-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M40 40 L40 80 M40 40 L80 40" stroke="#4A6B3C" strokeWidth="8" strokeLinecap="round"/>
                  <text x="70" y="90" fontFamily="Montserrat, sans-serif" fontSize="32" fontWeight="700" fill="#4A6B3C">P25</text>
                  <text x="50" y="125" fontFamily="Montserrat, sans-serif" fontSize="32" fontWeight="700" fill="#4A6B3C">FOODS</text>
                  <text x="50" y="150" fontFamily="Montserrat, sans-serif" fontSize="14" fontWeight="600" fill="#4A6B3C">& CLOUD KITCHEN</text>
                  <path d="M160 160 L160 120 M160 160 L120 160" stroke="#4A6B3C" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span className="font-logo text-sm font-bold text-mealora-primary block leading-tight">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.includes(item.name);

              return (
                <div key={item.name}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          active
                            ? 'bg-mealora-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const childActive = isActive(child.href);
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  childActive
                                    ? 'bg-mealora-primary/10 text-mealora-primary'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <ChildIcon size={18} />
                                    <span>{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-mealora-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-mealora-primary text-white flex items-center justify-center font-semibold">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminUser?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">{adminUser?.email}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="w-10 h-10 flex-shrink-0">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d="M40 40 L40 80 M40 40 L80 40" stroke="#4A6B3C" strokeWidth="8" strokeLinecap="round"/>
                      <text x="70" y="90" fontFamily="Montserrat, sans-serif" fontSize="32" fontWeight="700" fill="#4A6B3C">P25</text>
                      <text x="50" y="125" fontFamily="Montserrat, sans-serif" fontSize="32" fontWeight="700" fill="#4A6B3C">FOODS</text>
                      <path d="M160 160 L160 120 M160 160 L120 160" stroke="#4A6B3C" strokeWidth="8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="font-logo text-sm font-bold text-mealora-primary">Admin</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedItems.includes(item.name);

                  return (
                    <div key={item.name}>
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                              active
                                ? 'bg-mealora-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={20} />
                              <span>{item.name}</span>
                            </div>
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="ml-4 mt-1 space-y-1">
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                const childActive = isActive(child.href);
                                return (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                      childActive
                                        ? 'bg-mealora-primary/10 text-mealora-primary'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    <ChildIcon size={18} />
                                    <span>{child.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            active
                              ? 'bg-mealora-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* User Section */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-mealora-primary text-white flex items-center justify-center font-semibold">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {adminUser?.full_name || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{adminUser?.email}</p>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-700 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-gray-900">
                P25 Foods Admin
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-mealora-primary transition-colors"
              >
                Siteyi Görüntüle
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
