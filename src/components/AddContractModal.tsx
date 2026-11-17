import React, { useState, useRef } from 'react';
import { X, ShieldPlus, AlertCircle, Upload, FileText, Sparkles, Check } from 'lucide-react';
import { Contract } from '../types';

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Contract>) => Promise<void>;
}

export const AddContractModal: React.FC<AddContractModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
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

  // Nouveaux champs
  const [guarantees, setGuarantees] = useState<string>('');
  const [obligations, setObligations] = useState<string>('');
  const [exclusions, setExclusions] = useState<string>('');
  const [limits, setLimits] = useState<string>('');

  const [isScanningFile, setIsScanningFile] = useState<boolean>(false);
  const [scannedFileName, setScannedFileName] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileScan = (file: File) => {
    setScannedFileName(file.name);
    setIsScanningFile(true);

    setTimeout(() => {
      setIsScanningFile(false);
      // Auto-populate fields based on file
      const name = file.name.toLowerCase();
      if (name.includes('axa')) {
        setInsurer('AXA Corporate Solutions');
        setContractNumber('AXA-POL-2026-78');
        setType('Multirisque Dommages & Responsabilité Civile');
        setPremium(48000);
        setCoverageLimit(10000000);
        setDeductible(2500);
      } else if (name.includes('allianz')) {
        setInsurer('Allianz Global Corporate');
        setContractNumber('ALLZ-2026-909');
        setType('Responsabilité Civile Professionnelle');
        setPremium(35000);
        setCoverageLimit(8000000);
        setDeductible(1500);
      } else {
        setInsurer('Sanlam / Saham Assurance');
        setContractNumber(`POL-${Math.floor(1000 + Math.random() * 9000)}`);
        setType('Multirisque Industrielle & Bâtiment');
        setPremium(52000);
        setCoverageLimit(12000000);
        setDeductible(3000);
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    const newErrors: Record<string, string> = {};
    if (!insurer.trim()) {
      newErrors.insurer = "Le nom de l'assureur est requis";
    }
    if (!contractNumber.trim()) {
      newErrors.contractNumber = "Le numéro de contrat est requis";
    }
    if (!type.trim()) {
      newErrors.type = "Le type de contrat est requis";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        insurer: insurer.trim(),
        contractNumber: contractNumber.trim(),
        type: type.trim(),
        startDate,
        endDate,
        premium: Number(premium),
        coverageLimit: Number(coverageLimit),
        deductible: Number(deductible),
        status,
        guarantees: guarantees.trim(),
        obligations: obligations.trim(),
        exclusions: exclusions.trim(),
        limits: limits.trim()
      });

      setInsurer('');
      setContractNumber('');
      setType('');
      setGuarantees('');
      setObligations('');
      setExclusions('');
      setLimits('');
      setScannedFileName(null);
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement du contrat :", err);
      if (err.fields) {
        setErrors(err.fields);
      }
      setBackendError(err.error || err.message || "Erreur de création de contrat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileScan(e.target.files[0]);
          }
        }}
      />

      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ajouter un contrat d'assurance</h3>
              <p className="text-xs text-slate-500">Saisie manuelle ou pré-remplissage automatique par fichier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload File Banner in Modal */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-blue-900 font-medium">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              {scannedFileName
                ? `Document analysé : ${scannedFileName}`
                : "Avez-vous un fichier PDF/Word du contrat ? Importez-le pour pré-remplir les champs."}
            </span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanningFile}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
          >
            {isScanningFile ? (
              <span>Analyse OCR...</span>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>{scannedFileName ? 'Changer de fichier' : 'Scanner un contrat'}</span>
              </>
            )}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {backendError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{backendError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nom de l'assureur <span className="text-red-500">*</span>
            </label>
            <input
              id="contract-insurer"
              type="text"
              placeholder="Ex: AXA Corporate Solutions, Allianz, Saham..."
              value={insurer}
              onChange={(e) => setInsurer(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                errors.insurer ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {errors.insurer && <p className="text-xs text-red-600 mt-1">{errors.insurer}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro de contrat <span className="text-red-500">*</span>
              </label>
              <input
                id="contract-number"
                type="text"
                placeholder="Ex: CTR-2026-901"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.contractNumber ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                }`}
              />
              {errors.contractNumber && <p className="text-xs text-red-600 mt-1">{errors.contractNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type de contrat <span className="text-red-500">*</span>
              </label>
              <input
                id="contract-type"
                type="text"
                placeholder="Ex: Dommages aux biens, Responsabilité..."
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.type ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                }`}
              />
              {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prime (€)</label>
              <input
                type="number"
                value={premium}
                onChange={(e) => setPremium(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Plafond (€)</label>
              <input
                type="number"
                value={coverageLimit}
                onChange={(e) => setCoverageLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Franchise (€)</label>
              <input
                type="number"
                value={deductible}
                onChange={(e) => setDeductible(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date d'échéance</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Garanties</label>
            <textarea
              rows={2}
              placeholder="Liste des garanties couvertes par le contrat..."
              value={guarantees}
              onChange={(e) => setGuarantees(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Obligations de l'assuré</label>
            <textarea
              rows={2}
              placeholder="Obligations et conditions à respecter..."
              value={obligations}
              onChange={(e) => setObligations(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Exclusions</label>
            <textarea
              rows={2}
              placeholder="Ce qui n'est pas couvert par le contrat..."
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Limites du contrat</label>
            <textarea
              rows={2}
              placeholder="Limites de couverture, franchises spécifiques..."
              value={limits}
              onChange={(e) => setLimits(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              id="btn-save-contract"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le contrat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
