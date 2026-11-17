import React, { useState } from 'react';
import { Building2, X, Check, PlusCircle, ShieldAlert, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { CompanyInfo } from '../types';
import { SECTOR_OPTIONS } from '../data/riskCatalog';

interface AuthCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: CompanyInfo;
  allCompanies: CompanyInfo[];
  onRegisterCompany: (data: Partial<CompanyInfo>) => Promise<void>;
  onSwitchCompany: (name: string) => Promise<void>;
}

export const AuthCompanyModal: React.FC<AuthCompanyModalProps> = ({
  isOpen,
  onClose,
  currentCompany,
  allCompanies,
  onRegisterCompany,
  onSwitchCompany
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'select'>('register');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state for new company
  const [formData, setFormData] = useState({
    name: '',
    sector: SECTOR_OPTIONS[0],
    customSector: '',
    location: 'Rabat, Maroc',
    employees: '150',
    revenue: '15M €',
    sites: '2',
    facilities: '5',
    vehicles: '10',
    insuranceBudget: '120000'
  });

  if (!isOpen) return null;

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg("Le nom de l'entreprise est obligatoire.");
      return;
    }

    const selectedSector = formData.sector === "Autre secteur d'activité" && formData.customSector.trim()
      ? formData.customSector.trim()
      : formData.sector;

    setLoading(true);
    try {
      await onRegisterCompany({
        name: formData.name.trim(),
        sector: selectedSector,
        location: formData.location.trim() || 'Rabat, Maroc',
        employees: parseInt(formData.employees) || 50,
        revenue: formData.revenue.trim() || '5M €',
        sites: parseInt(formData.sites) || 1,
        facilities: parseInt(formData.facilities) || 2,
        vehicles: parseInt(formData.vehicles) || 5,
        insuranceBudget: parseInt(formData.insuranceBudget) || 50000,
        admin: 'ARZ Assureur Conseil'
      });

      setSuccessMsg(`Entreprise "${formData.name.trim()}" enregistrée avec succès !`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de l'enregistrement de l'entreprise");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = async (companyName: string) => {
    setErrorMsg('');
    setLoading(true);
    try {
      await onSwitchCompany(companyName);
      setSuccessMsg(`Session active basculée sur "${companyName}".`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de basculer d'entreprise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 text-blue-200 border border-white/20">
                <Building2 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold tracking-tight">Identification & Enregistrement d'Entreprise</h3>
            </div>
            <p className="text-xs text-blue-100/90 mt-1">
              Renseignez votre secteur d'activité pour générer automatiquement le catalogue des risques applicables.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>S'enregistrer (Nouvelle entreprise)</span>
          </button>
          <button
            onClick={() => setActiveTab('select')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'select'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>S'identifier / Choisir ({allCompanies.length})</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'register' ? (
            <form onSubmit={handleSubmitRegister} className="space-y-4">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  En renseignant le secteur d'activité de votre entreprise, le système pré-charge la cartographie, les obligations d'assurance et le catalogue de risques pré-qualifiés.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de l'entreprise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clinique Ibno Sina, TechnoMed SARL, Groupe BTP Atlas..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secteur d'activité <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  {SECTOR_OPTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {formData.sector === "Autre secteur d'activité" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Précisez votre secteur d'activité
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Énergie solaire, Biotech, Télécoms..."
                    value={formData.customSector}
                    onChange={(e) => setFormData({ ...formData, customSector: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Localisation / Siège</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre d'employés</label>
                  <input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chiffre d'Affaires (€ ou DH)</label>
                  <input
                    type="text"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Assurance (€/an)</label>
                  <input
                    type="number"
                    value={formData.insuranceBudget}
                    onChange={(e) => setFormData({ ...formData, insuranceBudget: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer mon entreprise'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Sélectionnez une entreprise déjà enregistrée dans le système :
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {allCompanies.map((comp) => {
                  const isCurrent = comp.name.toLowerCase() === currentCompany.name.toLowerCase();
                  return (
                    <div
                      key={comp.name}
                      onClick={() => !isCurrent && handleSelectCompany(comp.name)}
                      className={`p-4 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/70 shadow-2xs cursor-default'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            {comp.sector} • {comp.location}
                          </p>
                          <div className="flex gap-3 text-[11px] text-slate-600 font-medium mt-1">
                            <span>👥 {comp.employees} sal.</span>
                            <span>📈 CA: {comp.revenue}</span>
                          </div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          disabled={loading}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                        >
                          S'identifier
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
