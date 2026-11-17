import React, { useState, useRef } from 'react';
import {
  FileSearch,
  Upload,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FileText,
  X,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  File,
  Check
} from 'lucide-react';
import { Contract } from '../types';

interface ScanContractTabProps {
  onSaveContract?: (payload: Partial<Contract>) => Promise<void>;
  onNavigateTab?: (tab: string) => void;
}

export const ScanContractTab: React.FC<ScanContractTabProps> = ({
  onSaveContract,
  onNavigateTab
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');
  
  // File state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  // Editable extracted contract form state
  const [extractedData, setExtractedData] = useState<{
    insurer: string;
    contractNumber: string;
    type: string;
    premium: number;
    coverageLimit: number;
    deductible: number;
    startDate: string;
    endDate: string;
    status: 'Actif' | 'En révision' | 'Expiré';
    detectedRisks: string[];
    clauses: string[];
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Trigger file dialog
  const handleBrowseFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFile({
      name: file.name,
      size: `${sizeInMB} Mo`,
      type: file.type || 'Document'
    });
    setSaveSuccess(false);
    setErrorMessage('');
    startScanSimulation(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const startScanSimulation = (fileName?: string) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStepText("Chargement & numérisation du document...");

    setTimeout(() => {
      setScanProgress(45);
      setScanStepText("Analyse OCR et reconnaissance de la structure contractuelle...");
    }, 600);

    setTimeout(() => {
      setScanProgress(80);
      setScanStepText("Extraction des entités par IA (Garanties, Franchises, Assureur)...");
    }, 1200);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);

      // Generate contextual mock values based on file name or defaults
      const isHealth = fileName?.toLowerCase().includes('sante') || fileName?.toLowerCase().includes('medical');
      
      setExtractedData({
        insurer: isHealth ? "AXA Santé Corporate" : "AXA Corporate Solutions",
        contractNumber: `CTR-SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: isHealth ? "Multirisque Santé & Responsabilité Médicale" : "Multirisque Dommages & Responsabilité Civile",
        premium: isHealth ? 62000 : 58000,
        coverageLimit: 12000000,
        deductible: 2500,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2027-12-31',
        status: 'Actif',
        detectedRisks: [
          "Dégât des eaux sur locaux & blocs chirurgicaux",
          "Responsabilité professionnelle & médicale",
          "Interruption d'activité réseau informatique & cyberdéfense",
          "Vol et vandalisme d'équipements spécialisés"
        ],
        clauses: [
          "Exclusion des sinistres non déclarés sous 5 jours ouvrés",
          "Franchise doublée en cas de défaut de maintenance préventive",
          "Obligation de mise à jour des systèmes de sécurité sous 30 jours"
        ]
      });
    }, 1800);
  };

  const handleSaveToPortfolio = async () => {
    if (!extractedData) return;
    if (!onSaveContract) {
      setErrorMessage("Service d'enregistrement indisponible");
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      await onSaveContract({
        insurer: extractedData.insurer,
        contractNumber: extractedData.contractNumber,
        type: extractedData.type,
        premium: Number(extractedData.premium),
        coverageLimit: Number(extractedData.coverageLimit),
        deductible: Number(extractedData.deductible),
        startDate: extractedData.startDate,
        endDate: extractedData.endDate,
        status: extractedData.status
      });

      setSaveSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de l'enregistrement du contrat");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Scan & Importation de contrat par IA</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Numérisez vos documents PDF/Word, laissez l'IA extraire automatiquement les garanties et enregistrez-les directement dans votre portefeuille.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50/70 scale-[1.005]' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-800">
            Faites glisser et déposez votre contrat ici ou
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            Formats acceptés : PDF, DOC, DOCX, PNG, JPG (Taille max : 25 Mo)
          </p>

          <div className="flex justify-center items-center gap-3">
            <button
              onClick={handleBrowseFilesClick}
              disabled={isScanning}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FileSearch className="w-4 h-4" />
              <span>Parcourir mes fichiers</span>
            </button>

            {!uploadedFile && (
              <button
                onClick={() => startScanSimulation('Contrat_Demarrage.pdf')}
                disabled={isScanning}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Exemple de scan automatique</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected File Card & Progress */}
        {uploadedFile && (
          <div className="mt-4 p-4 rounded-xl border border-blue-100 bg-blue-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{uploadedFile.name}</h4>
                <p className="text-[11px] text-slate-500">{uploadedFile.size} • {uploadedFile.type}</p>
              </div>
            </div>

            {isScanning ? (
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-100/80 px-3 py-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Analyse OCR en cours...</span>
              </div>
            ) : (
              <button
                onClick={() => startScanSimulation(uploadedFile.name)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Re-scanner
              </button>
            )}
          </div>
        )}

        {/* Scanning progress bar */}
        {isScanning && (
          <div className="mt-4 p-4 bg-purple-50/70 rounded-xl border border-purple-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-purple-900">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                {scanStepText}
              </span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Extracted Scan Results */}
      {extractedData && !isScanning && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Résultat de l'analyse OCR / IA</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Vérifiez et ajustez les informations extraites du contrat avant enregistrement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Confiance IA : 98.4%</span>
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Contrat enregistré avec succès dans votre portefeuille !</span>
              </div>
              <p className="text-emerald-700">
                La police <strong>{extractedData.insurer} ({extractedData.contractNumber})</strong> est désormais active et comptabilisée dans votre tableau de bord.
              </p>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('contracts')}
                  className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Voir dans le portefeuille de contrats</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Form with Extracted Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Paramètres contractuels extraits</span>
              </h4>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nom de l'assureur</label>
                <input
                  type="text"
                  value={extractedData.insurer}
                  onChange={(e) => setExtractedData({ ...extractedData, insurer: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">N° Police</label>
                  <input
                    type="text"
                    value={extractedData.contractNumber}
                    onChange={(e) => setExtractedData({ ...extractedData, contractNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Statut</label>
                  <select
                    value={extractedData.status}
                    onChange={(e) => setExtractedData({ ...extractedData, status: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En révision">En révision</option>
                    <option value="Expiré">Expiré</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Type de contrat</label>
                <input
                  type="text"
                  value={extractedData.type}
                  onChange={(e) => setExtractedData({ ...extractedData, type: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Prime (€)</label>
                  <input
                    type="number"
                    value={extractedData.premium}
                    onChange={(e) => setExtractedData({ ...extractedData, premium: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Plafond (€)</label>
                  <input
                    type="number"
                    value={extractedData.coverageLimit}
                    onChange={(e) => setExtractedData({ ...extractedData, coverageLimit: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Franchise (€)</label>
                  <input
                    type="number"
                    value={extractedData.deductible}
                    onChange={(e) => setExtractedData({ ...extractedData, deductible: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date début</label>
                  <input
                    type="date"
                    value={extractedData.startDate}
                    onChange={(e) => setExtractedData({ ...extractedData, startDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date fin</label>
                  <input
                    type="date"
                    value={extractedData.endDate}
                    onChange={(e) => setExtractedData({ ...extractedData, endDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-100 space-y-2">
                <h4 className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Risques détectés dans le texte du contrat</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-purple-900">
                  {extractedData.detectedRisks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Clauses particulières & Franches applicables</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-800">
                  {extractedData.clauses.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-amber-600">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Import Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleSaveToPortfolio}
              disabled={isSaving || saveSuccess}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <span>Enregistrement en cours...</span>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Contrat enregistré !</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enregistrer et Ajouter ce contrat au portefeuille</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
