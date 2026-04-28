import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Landmark, Loader2 } from 'lucide-react';
import Logo from './ui/Logo';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface AuthProps {
  onLogin: (userData: { name: string; type: string; email: string }) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        onLogin({
          name: result.user.displayName || 'Usuario Federal',
          type: 'Nacional',
          email: result.user.email || '',
        });
      }
    } catch (err: any) {
      console.error(err);
      setError('Error al conectar con el servidor nacional de identidad.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#9F2241] rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#BC955C] rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <Logo className="w-24 h-24 mb-4" />
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              RECONECT<span className="text-[#9F2241]">4T</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Estructura Nacional
            </p>
          </div>

          <div className="flex bg-black/40 p-1 rounded-lg mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${isLogin ? 'bg-[#9F2241] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${!isLogin ? 'bg-[#9F2241] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Registro
            </button>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-[#1a1a1a] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all hover:bg-gray-100 disabled:opacity-50 shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#9F2241]" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span className="uppercase text-xs tracking-widest">{isLoading ? 'Validando...' : 'Acceder con Cuenta Nacional'}</span>
            </button>

            {error && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-red-500 text-[10px] font-bold uppercase text-center animate-pulse">
                {error}
              </div>
            )}
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-[#1a1a1a] px-4 text-gray-500 tracking-widest italic">O mediante credenciales</span></div>
          </div>

            <form className="space-y-4 opacity-40 pointer-events-none">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="CORREO ELECTRÓNICO O USUARIO"
                    className="w-full bg-black/30 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-[#BC955C] outline-none transition-all uppercase"
                    readOnly
                  />
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="CONTRASEÑA"
                  className="w-full bg-black/30 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-[#BC955C] outline-none transition-all"
                  readOnly
                />
              </div>

              <button 
                type="button"
                className="w-full bg-[#BC955C] text-[#12322B] font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-all uppercase text-sm tracking-widest shadow-xl opacity-50"
              >
                Acceso Alternativo
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-center leading-relaxed">
              Sistema de Seguridad Federado <br /> 
              <span className="text-[#BC955C]">Reconect 4T</span> © 2024
            </p>
            <div className="flex gap-4 opacity-50 grayscale">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <Landmark className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
