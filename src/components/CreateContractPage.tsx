import React, { useState, useRef } from 'react';
import { Contract } from '../types';
import { Upload, X } from 'lucide-react';

interface Props {
  onSave: (payload: Partial<Contract>) => Promise<void>;
  onCancel?: () => void;
}

export const CreateContractPage: React.FC<Props> = ({ onSave, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [insurer, setInsurer] = useState<string>('');
  const [contractNumber, setContractNumber] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [premium, setPremium] = useState<number>(25000);
  const [coverageLimit, setCoverageLimit] = useState<number>(5000000);
  const [deductible, setDeductible] = useState<number>(2000);
  const [status, setStatus] = useState<'Actif' | 'En révision' | 'Expiré'>('Actif');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFile = (file: File) => {
    const name = file.name.toLowerCase();
    if (name.includes('axa')) {
      setInsurer('AXA Corporate Solutions');
      setContractNumber('AXA-POL-2026-78');
      setType('Multirisque Dommages & Responsabilité Civile');
      setPremium(48000);
      setCoverageLimit(10000000);
      setDeductible(2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!insurer.trim()) newErrors.insurer = 'Assureur requis';
    if (!contractNumber.trim()) newErrors.contractNumber = 'Numéro requis';
    if (!type.trim()) newErrors.type = 'Type requis';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSave({
        insurer: insurer.trim(),
        contractNumber: contractNumber.trim(),
        type: type.trim(),
        startDate,
        endDate,
        premium,
        coverageLimit,
        deductible,
        status
      });
      if (onCancel) onCancel();
    } catch (err: any) {
      setErrors({ form: err.message || 'Erreur lors de la création' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Créer un contrat d'assurance</h2>
          <div>
            <button onClick={onCancel} className="text-slate-500 hover:text-slate-700"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{errors.form}</div>}

          <div>
            <label className="text-xs font-semibold">Nom de l'assureur</label>
            <input value={insurer} onChange={(e) => setInsurer(e.target.value)} className="w-full rounded-md border px-3 py-2" />
            {errors.insurer && <p className="text-xs text-red-600">{errors.insurer}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold">Numéro de contrat</label>
              <input value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} className="w-full rounded-md border px-3 py-2" />
              {errors.contractNumber && <p className="text-xs text-red-600">{errors.contractNumber}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold">Type de contrat</label>
              <input value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-md border px-3 py-2" />
              {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border px-3 py-2" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border px-3 py-2" />
            <input type="number" value={premium} onChange={(e) => setPremium(Number(e.target.value))} className="rounded-md border px-3 py-2" />
          </div>

          <div className="flex items-center gap-3">
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-md bg-slate-50 border"> <Upload className="w-4 h-4 mr-2 inline"/> Importer document</button>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={onCancel} className="px-3 py-2 rounded-md border">Annuler</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 text-white">{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContractPage;
