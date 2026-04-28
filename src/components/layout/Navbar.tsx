import React, { useState } from 'react';
import { Bell, Search, User, LogOut, ChevronDown, UserPlus } from 'lucide-react';
import Logo from '../ui/Logo';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: { name: string; type: string; email: string } | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="h-16 bg-[#000000] text-white flex items-center justify-between px-6 shadow-md z-30 sticky top-0 border-b border-white/5">
      <div className="flex items-center gap-3">
        <Logo className="w-9 h-9" />
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter uppercase leading-none italic text-white">
            RECONECT<span className="text-[#9F2241]">4T</span>
          </span>
          <span className="text-[9px] text-[#BC955C] uppercase tracking-widest font-bold">Registro de Estructura Nacional</span>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-xl mx-12">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar en el registro nacional..."
            className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#9F2241] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-[#BC955C]">
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative group">
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#9F2241] rounded-full border border-black animate-pulse"></span>
        </button>
        
        <div className="h-6 w-px bg-white/10 mx-1"></div>
        
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-all group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#9F2241] to-[#6d172d] text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg group-hover:ring-2 group-hover:ring-[#BC955C]/50 transition-all">
              {user?.name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-xs font-black text-white uppercase tracking-tight">{user?.name || 'Usuario Demo'}</span>
              <span className="text-[9px] text-[#BC955C] uppercase font-bold">{user?.type || 'Administrador'}</span>
            </div>
            <ChevronDown className={cn("w-3 h-3 text-[#BC955C] transition-transform", showUserMenu ? "rotate-180" : "")} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40 outline-none" 
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5 bg-[#0a0a0a]">
                    <p className="text-[10px] text-[#BC955C] uppercase font-black tracking-widest mb-1">Sesión Activa</p>
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-[#9F2241] hover:text-white rounded-lg transition-all uppercase tracking-tighter"
                    >
                      <UserPlus className="w-4 h-4" />
                      Cambiar Usuario
                    </button>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all uppercase tracking-tighter"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
