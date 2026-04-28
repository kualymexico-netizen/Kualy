import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  CheckCircle,
  Eye,
  Trash2,
  Edit2,
  Loader2,
  X,
  Save
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, onSnapshot, query, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';

interface StructureRecord {
  id: string;
  voterId: string;
  name: string;
  type: string;
  level: string;
  state: string;
  municipality: string;
  officer: string;
  street: string;
  extNumber: string;
  neighborhood: string;
  zipCode: string;
  phone: string;
  createdAt?: any;
}

export default function RecordList() {
  const [records, setRecords] = useState<StructureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState<StructureRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'structures'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StructureRecord[];
        setRecords(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'structures');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este registro? Esta acción no se puede deshacer.')) return;
    try {
      await deleteDoc(doc(db, 'structures', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `structures/${id}`);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setIsSaving(true);
    try {
      const { id, ...data } = editingRecord;
      await updateDoc(doc(db, 'structures', id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      setEditingRecord(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `structures/${editingRecord.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.voterId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.officer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-[#9F2241] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cargando base de datos nacional...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
            Consulta <span className="text-[#9F2241]">Nacional</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Gestión integral de la Estructura 4T en tiempo real.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-wider">
            <Download className="w-4 h-4" />
            Exportar registros
          </button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por clave, nombre o titular..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#9F2241] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Estatus</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clave / Unidad</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo / Nivel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Titular</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ubicación</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#9F2241] tracking-tight mb-0.5">{record.voterId}</span>
                      <span className="text-xs font-bold text-gray-800 uppercase">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-600 uppercase">{record.type}</span>
                      <span className="text-[9px] font-bold text-[#BC955C] uppercase">{record.level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-700 uppercase">{record.officer}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[150px]">{record.neighborhood}</span>
                      <span className="text-[9px] text-gray-400 font-medium">{record.state}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingRecord(record)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all" 
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all" 
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic text-sm">
                    No se encontraron registros que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRecord(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleUpdate}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#1a1a1a] text-white">
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">Editar <span className="text-[#9F2241]">Registro</span></h3>
                    <p className="text-[10px] text-[#BC955C] font-bold uppercase tracking-widest">Folio: {editingRecord.id}</p>
                  </div>
                  <button type="button" onClick={() => setEditingRecord(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-8 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Clave de Elector</label>
                      <input 
                        type="text" 
                        value={editingRecord.voterId}
                        onChange={(e) => setEditingRecord({...editingRecord, voterId: e.target.value.toUpperCase()})}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-[#9F2241] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Nombre / Unidad</label>
                      <input 
                        type="text" 
                        value={editingRecord.name}
                        onChange={(e) => setEditingRecord({...editingRecord, name: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold uppercase outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Tipo de Unidad</label>
                      <select 
                        value={editingRecord.type}
                        onChange={(e) => setEditingRecord({...editingRecord, type: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none"
                      >
                        <option value="Nacional">Nacional</option>
                        <option value="Estatal">Estatal</option>
                        <option value="Municipal">Municipal</option>
                        <option value="Regional">Regional</option>
                        <option value="Zona">Zona</option>
                        <option value="Seccional">Seccional</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Titular</label>
                      <input 
                        type="text" 
                        value={editingRecord.officer}
                        onChange={(e) => setEditingRecord({...editingRecord, officer: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditingRecord(null)}
                    className="px-6 py-2 text-xs font-bold text-gray-500 uppercase hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#9F2241] text-white px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg shadow-[#9F2241]/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
