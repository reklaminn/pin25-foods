'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [sessionChecked, setSessionChecked] = useState(false);

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] ${msg}`;
    console.log(logMsg);
    setLogs(prev => [...prev, logMsg]);
  }, []);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Session kontrolü - sadece bir kez çalışsın
  useEffect(() => {
    if (sessionChecked) return;
    
    let isMounted = true;

    const checkSession = async () => {
      addLog('Checking existing session...');
      
      try {
        // getUser kullan - daha güvenilir
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          addLog(`User error: ${userError.message}`);
          if (isMounted) {
            setLoading(false);
            setSessionChecked(true);
          }
          return;
        }
        
        if (!user) {
          addLog('No active user.');
          if (isMounted) {
            setLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        addLog(`User found: ${user.email}`);
        
        // Verify admin status
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('id, is_active, role')
          .eq('id', user.id)
          .single();

        if (adminError) {
          addLog(`Admin DB Error: ${adminError.message}`);
          if (isMounted) {
            setLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        if (!admin) {
          addLog('User is not in admins table.');
          if (isMounted) {
            setLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        if (!admin.is_active) {
          addLog('Admin account is inactive.');
          if (isMounted) {
            setLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        addLog(`Admin verified (${admin.role}), redirecting to ${redirectTo}...`);
        
        if (isMounted) {
          // Kısa bir delay ekle - middleware'in cookie'leri okuması için
          await new Promise(resolve => setTimeout(resolve, 500));
          window.location.href = redirectTo;
        }
      } catch (err) {
        addLog(`Unexpected error: ${err}`);
        if (isMounted) {
          setLoading(false);
          setSessionChecked(true);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [sessionChecked, redirectTo, addLog]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setLogs([]);
    
    addLog('--- Login Process Started ---');
    addLog(`Attempting login for: ${loginData.email}`);

    try {
      // 1. Supabase Auth Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        addLog(`❌ Auth Error: ${authError.message}`);
        setError('Email veya şifre hatalı.');
        setSubmitting(false);
        return;
      }

      if (!authData.session || !authData.user) {
        addLog('❌ No session/user returned from Auth');
        setError('Oturum açılamadı.');
        setSubmitting(false);
        return;
      }

      addLog(`✅ Auth successful. User ID: ${authData.user.id}`);

      // 2. Check Admins Table
      addLog('Checking admins table...');
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (adminError) {
        addLog(`❌ Admin DB Error: ${adminError.message}`);
        setError('Yönetici kaydı doğrulanamadı.');
        await supabase.auth.signOut();
        setSubmitting(false);
        return;
      }

      if (!admin) {
        addLog('❌ User not found in admins table');
        setError('Bu hesap yönetici yetkisine sahip değil.');
        await supabase.auth.signOut();
        setSubmitting(false);
        return;
      }

      if (!admin.is_active) {
        addLog('❌ Admin account is inactive');
        setError('Hesabınız pasif durumda.');
        await supabase.auth.signOut();
        setSubmitting(false);
        return;
      }

      addLog(`✅ Admin verified. Role: ${admin.role}`);

      // 3. Update Last Login
      const { error: updateError } = await supabase
        .from('admins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      if (updateError) {
        addLog(`⚠️ Update last_login failed: ${updateError.message}`);
      } else {
        addLog('✅ Last login updated');
      }

      addLog(`✅ Redirecting to: ${redirectTo}`);
      addLog('⏳ Waiting for cookies to be set...');
      
      // Cookie'lerin set edilmesi için kısa bir bekleme
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hard redirect
      window.location.href = redirectTo;

    } catch (err) {
      console.error(err);
      addLog(`❌ Unexpected Error: ${err}`);
      setError('Beklenmeyen bir hata oluştu.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Oturum kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Login Form */}
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
            <p className="text-gray-500 text-sm mt-2">P25 Foods Yönetim</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              icon={Mail}
              required
              disabled={submitting}
            />

            <div className="relative">
              <Input
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                icon={Lock}
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Giriş Yapılıyor...
                </div>
              ) : 'Giriş Yap'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/admin/clear-session" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Sorun mu yaşıyorsunuz? Session'ı temizleyin
            </a>
          </div>
        </div>

        {/* Debug Console */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 text-green-400 font-mono text-xs overflow-hidden flex flex-col h-[500px]">
          <div className="border-b border-gray-700 pb-2 mb-2 flex justify-between items-center">
            <span className="font-bold">SYSTEM LOGS</span>
            <span className="text-gray-500">Live</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {logs.length === 0 && <span className="text-gray-600">Waiting for actions...</span>}
            {logs.map((log, i) => (
              <div key={i} className="break-all border-b border-gray-800/50 pb-1 mb-1 last:border-0">
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
