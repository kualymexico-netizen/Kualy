import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus2, 
  ClipboardList, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tablero de Control', icon: LayoutDashboard },
    { id: 'register', label: 'Nuevo Registro', icon: FilePlus2 },
    { id: 'records', label: 'Consulta Nacional', icon: ClipboardList },
    { id: 'reports', label: 'Reportes Generales', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 bg-gray-50 flex flex-col gap-1 border-b border-gray-200">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Módulo RECONECT 4T</span>
        <h2 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-2">
          Estructura Nacional
          <span className="px-1.5 py-0.5 bg-[#9F2241] text-white text-[9px] rounded-full">LIVE</span>
        </h2>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold transition-all group uppercase tracking-tighter",
                  activeTab === item.id 
                    ? "bg-[#000000] text-white shadow-lg border-l-4 border-[#9F2241]" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-[#9F2241]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    activeTab === item.id ? "text-[#9F2241]" : "group-hover:text-[#9F2241]"
                  )} />
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight className="w-3 h-3 text-[#9F2241]" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-all">
          <Settings className="w-4 h-4" />
          Configuración
        </button>
        <div className="mt-4 p-3 bg-red-50 border border-[#9F2241]/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-3 h-3 text-[#9F2241]" />
            <span className="text-[10px] font-bold text-[#9F2241] uppercase">Aviso RECONECT 4T</span>
          </div>
          <p className="text-[9px] text-gray-600 leading-tight">
            Versión oficial del sistema de monitoreo de estructuras ciudadanas y gubernamentales.
          </p>
        </div>
      </div>
    </aside>
  );
}
