'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ClearSessionPage() {
  const [status, setStatus] = useState('Temizleniyor...');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    const clearEverything = async () => {
      addLog('Session temizleme başladı...');

      try {
        // 1. Supabase sign out
        addLog('Supabase signOut çağrılıyor...');
        await supabase.auth.signOut({ scope: 'global' });
        addLog('✅ Supabase signOut tamamlandı');
      } catch (e) {
        addLog(`⚠️ Supabase signOut hatası: ${e}`);
      }

      try {
        // 2. Clear all localStorage
        addLog('localStorage temizleniyor...');
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => {
          addLog(`  - Siliniyor: ${key}`);
          localStorage.removeItem(key);
        });
        addLog(`✅ ${keysToRemove.length} localStorage öğesi silindi`);
      } catch (e) {
        addLog(`⚠️ localStorage hatası: ${e}`);
      }

      try {
        // 3. Clear sessionStorage
        addLog('sessionStorage temizleniyor...');
        sessionStorage.clear();
        addLog('✅ sessionStorage temizlendi');
      } catch (e) {
        addLog(`⚠️ sessionStorage hatası: ${e}`);
      }

      try {
        // 4. Clear cookies
        addLog('Cookies temizleniyor...');
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim();
          if (name) {
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            addLog(`  - Cookie silindi: ${name}`);
          }
        });
        addLog('✅ Cookies temizlendi');
      } catch (e) {
        addLog(`⚠️ Cookie hatası: ${e}`);
      }

      addLog('');
      addLog('🎉 TÜM TEMİZLİK TAMAMLANDI!');
      addLog('');
      addLog('Şimdi /admin/login sayfasına gidebilirsiniz.');
      
      setStatus('Tamamlandı! Artık login sayfasına gidebilirsiniz.');
    };

    clearEverything();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Session Temizleme</h1>
      <p className="text-xl mb-8 text-white">{status}</p>
      
      <div className="bg-black rounded-lg p-4 max-h-96 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2 text-gray-400">Logs:</h2>
        {logs.map((log, i) => (
          <div key={i} className="text-sm py-1 border-b border-gray-800">
            {log}
          </div>
        ))}
      </div>

      <div className="mt-8 space-x-4">
        <a 
          href="/admin/login" 
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Login Sayfasına Git
        </a>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Tekrar Temizle
        </button>
      </div>
    </div>
  );
}
