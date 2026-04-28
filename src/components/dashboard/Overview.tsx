import React from 'react';
import { 
  Users, 
  FileCheck, 
  Clock, 
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';

import { cn } from '../../lib/utils';

const data = [
  { name: 'Ene', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1200 },
];

const pieData = [
  { name: 'Federal', value: 45 },
  { name: 'Estatal', value: 35 },
  { name: 'Municipal', value: 20 },
];

const COLORS = ['#9F2241', '#BC955C', '#1a1a1a'];

export default function Overview() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
          Tablero <span className="text-[#9F2241]">RECONECT4T</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">Monitoreo en tiempo real de la Estructura Nacional</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Registros', value: '14,285', icon: Users, color: 'emerald', trend: '+12.5%' },
          { label: 'Validados', value: '12,940', icon: FileCheck, color: 'blue', trend: '+8.2%' },
          { label: 'Pendientes', value: '1,345', icon: Clock, color: 'amber', trend: '-2.4%' },
          { label: 'Entidades Federativas', value: '32', icon: MapPin, color: 'rose', trend: '0%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className={cn(
                "p-2 rounded-lg",
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                'bg-rose-50 text-rose-600'
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={cn(
                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 
                stat.trend === '0%' ? 'bg-gray-100 text-gray-600' : 
                'bg-red-100 text-red-700'
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : 
                 stat.trend.startsWith('-') ? <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" /> : null}
                {stat.trend}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">vs. mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-[#9F2241]/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase flex items-center gap-2 tracking-tight">
              <TrendingUp className="w-4 h-4 text-[#9F2241]" />
              Actividad del Registro Nacional
            </h3>
            <select className="text-[11px] font-bold text-[#9F2241] border-none bg-transparent focus:ring-0 cursor-pointer uppercase tracking-widest">
              <option>Año 2024</option>
              <option>Año 2023</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9F2241" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#9F2241" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#9F2241" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-6">Distribución por Nivel</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-gray-600 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-gray-800">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
