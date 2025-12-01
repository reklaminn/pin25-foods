'use client';

import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Debug loglarını ekranda göstermek için state (Geliştirme amaçlı)
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] ${msg}`;
    console.log(logMsg);
    setLogs(prev => [...prev, logMsg]);
  };

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    addLog('Checking existing session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      addLog(`Session found: ${session.user.email}`);
      // Verify admin status
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, is_active')
        .eq('id', session.user.id)
        .single();

      if (admin && admin.is_active) {
        addLog('Admin verified, redirecting...');
        router.push(redirectTo);
      } else {
        addLog('User is not an active admin.');
        if (error) addLog(`DB Error: ${error.message}`);
      }
    } else {
      addLog('No active session.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLogs([]); // Clear previous logs
    
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
        setLoading(false);
        return;
      }

      if (!authData.session) {
        addLog('❌ No session returned from Auth');
        setError('Oturum açılamadı.');
        setLoading(false);
        return;
      }

      addLog(`✅ Auth successful. User ID: ${authData.session.user.id}`);

      // 2. Check Admins Table
      addLog('Checking admins table permissions...');
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', authData.session.user.id)
        .single();

      if (adminError) {
        addLog(`❌ Admin DB Error: ${adminError.message}`);
        addLog('Hint: Check RLS policies or if table exists.');
        setError('Yönetici kaydı doğrulanamadı.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (!admin) {
        addLog('❌ User not found in admins table');
        setError('Bu hesap yönetici yetkisine sahip değil.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (!admin.is_active) {
        addLog('❌ Admin account is inactive');
        setError('Hesabınız pasif durumda.');
        await supabase.auth.signOut();
        setLoading(false);
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

      addLog(`Redirecting to: ${redirectTo}`);
      router.push(redirectTo);
      router.refresh();

    } catch (err) {
      console.error(err);
      addLog(`❌ Unexpected Error: ${err}`);
      setError('Beklenmeyen bir hata oluştu.');
      setLoading(false);
    }
  };

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
            <p className="text-gray-500 text-sm mt-2">Debug Modu Aktif</p>
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
            />

            <div className="relative">
              <Input
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Giriş Yapılıyor...
                </div>
              ) : 'Giriş Yap'}
            </Button>
          </form>
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
