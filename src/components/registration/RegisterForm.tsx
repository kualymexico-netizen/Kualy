import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Upload,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

type Step = 'search' | 'capture' | 'review' | 'success';

interface RegisterFormProps {
  onRegisterSuccess?: (userData: { name: string; type: string }) => void;
}

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>('search');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    voterId: '',
    name: '',
    type: '',
    level: '',
    state: 'Ciudad de México',
    municipality: '',
    street: '',
    extNumber: '',
    intNumber: '',
    neighborhood: '',
    zipCode: '',
    phone: '',
    phoneRef: '',
    officer: '',
    contact: '',
  });

  const steps = [
    { id: 'search', label: 'Validación', icon: Search },
    { id: 'capture', label: 'Datos', icon: FileText },
    { id: 'review', label: 'Revisión', icon: Building2 },
    { id: 'success', label: 'Confirmación', icon: CheckCircle2 },
  ];

  const checkVoterId = async () => {
    if (!formData.voterId) return;
    setIsSearching(true);
    setError(null);
    try {
      const q = query(collection(db, 'structures'), where('voterId', '==', formData.voterId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError('Esta Clave de Elector ya se encuentra registrada en el sistema.');
      } else {
        setCurrentStep('capture');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'structures');
    } finally {
      setIsSearching(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 'search') {
      await checkVoterId();
    } else if (currentStep === 'capture') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const dataToSave = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'structures'), dataToSave);
      
      if (onRegisterSuccess) {
        onRegisterSuccess({ name: formData.name, type: formData.type });
      }
      
      setCurrentStep('success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'structures');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'capture') setCurrentStep('search');
    else if (currentStep === 'review') setCurrentStep('capture');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">Registro de Nueva Estructura</h1>
        <p className="text-gray-500 text-sm">Ingrese la información oficial para el alta en el padrón nacional.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
        {steps.map((step, i) => {
          const isActive = currentStep === step.id;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > i;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all bg-white",
                isActive ? "border-[#9F2241] text-[#9F2241] ring-4 ring-[#9F2241]/10" : 
                isCompleted ? "border-[#000000] bg-[#000000] text-white" : 
                "border-gray-200 text-gray-400"
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase mt-2 tracking-wider",
                isActive ? "text-[#9F2241]" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 'search' && (
            <motion.div 
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="max-w-lg mx-auto text-center">
                <Search className="w-12 h-12 text-[#BC955C] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tighter italic">RECONECT 4T <span className="text-[#9F2241]">VERIFICA</span></h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  Ingrese la Clave de Elector del ciudadano o titular. El sistema verificará la vigencia y estatus en el padrón nacional.
                </p>
                
                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block tracking-widest">Clave de Elector (IFE/INE)</label>
                    <input 
                      type="text" 
                      placeholder="Ej. ABCD1234567890EF"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold text-[#9F2241] focus:ring-1 focus:ring-[#9F2241] outline-none transition-all placeholder:text-gray-300 placeholder:font-normal"
                      onChange={(e) => setFormData({...formData, voterId: e.target.value.toUpperCase()})}
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs font-bold animate-pulse">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  <button 
                    onClick={handleNext}
                    disabled={isSearching || !formData.voterId}
                    className="w-full bg-[#000000] text-white py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-[#9F2241] transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Búsqueda'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'capture' && (
            <motion.div 
              key="capture"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  Clave <strong>"{formData.voterId}"</strong> disponible para registro. Ingrese los datos de la estructura a continuación.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Nombre de la Unidad / Estructura</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ej. Coordinación Regional Norte"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Tipo de Unidad</label>
                    <select 
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="">Seleccione tipo de unidad...</option>
                      <option value="Nacional">Nacional</option>
                      <option value="Estatal">Estatal</option>
                      <option value="Municipal">Municipal</option>
                      <option value="Regional">Regional</option>
                      <option value="Zona">Zona</option>
                      <option value="Seccional">Seccional</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Nivel de Gobierno</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Federal', 'Estatal', 'Municipal'].map((l) => (
                        <button 
                          key={l}
                          type="button"
                          className={cn(
                            "py-2 text-[10px] font-bold uppercase border rounded-md transition-all",
                            formData.level === l ? "bg-[#12322B] text-white border-[#12322B]" : "border-gray-200 text-gray-500 hover:border-[#12322B]"
                          )}
                          onClick={() => setFormData({...formData, level: l})}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Entidad Federativa</label>
                    <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#12322B] outline-none">
                      <option>Ciudad de México</option>
                      <option>Jalisco</option>
                      <option>Nuevo León</option>
                      <option>Estado de México</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-[-8px] block">Domicilio de la Unidad</label>
                      <div className="grid grid-cols-1 gap-3">
                        <input 
                          type="text" 
                          placeholder="Calle"
                          value={formData.street}
                          onChange={(e) => setFormData({...formData, street: e.target.value})}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Núm. Exterior"
                            value={formData.extNumber}
                            onChange={(e) => setFormData({...formData, extNumber: e.target.value})}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                          />
                          <input 
                            type="text" 
                            placeholder="Núm. Interior (Opcional)"
                            value={formData.intNumber}
                            onChange={(e) => setFormData({...formData, intNumber: e.target.value})}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Colonia o Fraccionamiento"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Código Postal"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Contacto Telefónico</label>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">TEL:</span>
                        <input 
                          type="tel" 
                          placeholder="Número Celular / Directo"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full border border-gray-200 rounded-lg px-12 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">REF:</span>
                        <input 
                          type="tel" 
                          placeholder="Referencia o Recados"
                          value={formData.phoneRef}
                          onChange={(e) => setFormData({...formData, phoneRef: e.target.value})}
                          className="w-full border border-gray-200 rounded-lg px-12 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none border-dashed"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">Titular de la Unidad</label>
                    <input 
                      type="text" 
                      value={formData.officer}
                      onChange={(e) => setFormData({...formData, officer: e.target.value})}
                      placeholder="Nombre del Responsable"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#9F2241] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <button 
                  onClick={handleBack}
                  className="px-6 py-2.5 text-gray-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Regresar
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-[#9F2241] text-white px-8 py-3 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-[#8B1E39] transition-all flex items-center gap-2 shadow-lg shadow-[#9F2241]/20"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#BC955C]" />
                Verificación de Información
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clave de Elector</span>
                    <span className="font-bold text-[#9F2241]">{formData.voterId}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidad</span>
                    <span className="font-bold text-gray-800">{formData.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nivel</span>
                    <span className="font-bold text-gray-800">{formData.level || 'No especificado'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entidad</span>
                    <span className="font-bold text-gray-800">Ciudad de México</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</span>
                    <span className="font-bold text-gray-800">{formData.type || 'No especificado'}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Domicilio Registrado</span>
                    <span className="font-medium text-gray-600">
                      {formData.street} #{formData.extNumber} {formData.intNumber ? `Int. ${formData.intNumber}` : ''}, 
                      Col. {formData.neighborhood}, C.P. {formData.zipCode}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono Primario</span>
                    <span className="font-bold text-gray-800">{formData.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tel. Referencia</span>
                    <span className="font-bold text-gray-800">{formData.phoneRef || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Titular</span>
                    <span className="font-bold text-gray-800">{formData.officer}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-normal">
                    Certifico bajo protesta de decir verdad que los datos aquí capturados son verídicos y corresponden a la estructura oficial actual de la organización.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <button 
                  onClick={handleBack}
                  className="px-6 py-2.5 text-gray-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Corregir
                </button>
                <button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-[#12322B] text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#0B231E] transition-all flex items-center gap-2 shadow-lg shadow-[#12322B]/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalizar Registro'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase italic tracking-tighter">Registro <span className="text-green-600">Exitoso</span></h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                La unidad <strong>"{formData.name}"</strong> con clave <strong>{formData.voterId}</strong> ha sido registrada satisfactoriamente bajo el folio: <strong>SNR-2024-0042</strong>.
              </p>
              
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button className="w-full bg-[#12322B] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Descargar Acuse PDF
                </button>
                <button 
                  onClick={() => {
                    setCurrentStep('search');
                    setFormData({
                      voterId: '',
                      name: '',
                      type: '',
                      level: '',
                      state: '',
                      municipality: '',
                      street: '',
                      extNumber: '',
                      intNumber: '',
                      neighborhood: '',
                      zipCode: '',
                      phone: '',
                      phoneRef: '',
                      officer: '',
                      contact: '',
                    });
                  }}
                  className="w-full border border-gray-200 text-gray-600 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Realizar otro registro
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
