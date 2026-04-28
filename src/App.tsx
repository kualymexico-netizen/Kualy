/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Overview from './components/dashboard/Overview';
import RegisterForm from './components/registration/RegisterForm';
import RecordList from './components/consultation/RecordList';
import Auth from './components/Auth';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<{ name: string; type: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || 'Usuario Federal',
          type: 'Nacional',
          email: firebaseUser.email || '',
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // setIsAuthenticated and setUser are handled by the listener
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#BC955C] text-xs font-black uppercase tracking-widest"
        >
          Autenticando con el Registro Nacional...
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={(userData) => {
      setUser(userData);
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Overview />
                </motion.div>
              )}
              
              {activeTab === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <RegisterForm />
                </motion.div>
              )}
              
              {activeTab === 'records' && (
                <motion.div
                  key="records"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <RecordList />
                </motion.div>
              )}

              {activeTab === 'reports' && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-red-50 text-[#9F2241] rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 uppercase italic tracking-tighter">RECONECT 4T REPORTES</h2>
                    <p className="text-gray-500 max-w-sm mt-2 font-medium">
                      Generación de reportes agregados y analíticos de la estructura nacional. 
                      Próximamente disponible con conexión a base de datos en tiempo real.
                    </p>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="mt-6 px-6 py-2 bg-[#000000] text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#9F2241] transition-all"
                    >
                      Volver al Tablero
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 px-8 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">RECONECT<span className="text-[#9F2241]">4T</span></span>
          <div className="flex gap-4">
            <a href="#" className="text-[10px] font-bold text-gray-400 uppercase hover:text-[#9F2241] transition-colors">Privacidad</a>
            <a href="#" className="text-[10px] font-bold text-gray-400 uppercase hover:text-[#9F2241] transition-colors">Normativa</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Plataforma Oficial de Estructura Nacional</span>
          <div className="h-4 w-px bg-gray-200"></div>
          <span className="text-[9px] font-bold text-[#9F2241] uppercase tracking-tighter">v1.2.0-secure</span>
        </div>
      </footer>
    </div>
  );
}
