import React, { useState } from 'react';
import { Building2, MapPin, Users, ArrowRight, PlusCircle, LogOut, RefreshCw } from 'lucide-react';
import { CompanyInfo } from '../types';
import { SECTOR_OPTIONS } from '../data/riskCatalog';

interface CompanySelectionPageProps {
  companies: CompanyInfo[];
  onSelectCompany: (companyName: string) => Promise<void>;
  onAddCompany: (companyData: Partial<CompanyInfo>) => Promise<void>;
  onLogout: () => void;
  currentUser: { firstName: string; lastName: string; role: string };
}

export const CompanySelectionPage: React.FC<CompanySelectionPageProps> = ({
  companies,
  onSelectCompany,
  onAddCompany,
  onLogout,
  currentUser
}) => {
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newCompany, setNewCompany] = useState({
    name: '',
    sector: SECTOR_OPTIONS[0],
    location: 'Rabat, Maroc',
    employees: '50',
    revenue: '5M €',
    sites: '1',
    facilities: '2',
    vehicles: '5',
    insuranceBudget: '50000'
  });

  const handleSelectCompany = async (companyName: string) => {
    setLoading(true);
    setError(null);
    try {
      await onSelectCompany(companyName);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sélection de l\'entreprise');
      setLoading(false);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newCompany.name.trim()) {
      setError('Le nom de l\'entreprise est obligatoire');
      return;
    }

    setLoading(true);
    try {
      await onAddCompany({
        name: newCompany.name.trim(),
        sector: newCompany.sector,
        location: newCompany.location.trim() || 'Rabat, Maroc',
        employees: parseInt(newCompany.employees) || 50,
        revenue: newCompany.revenue.trim() || '5M €',
        sites: parseInt(newCompany.sites) || 1,
        facilities: parseInt(newCompany.facilities) || 2,
        vehicles: parseInt(newCompany.vehicles) || 5,
        insuranceBudget: parseInt(newCompany.insuranceBudget) || 50000,
        admin: `${currentUser.firstName} ${currentUser.lastName}`
      });
      setSuccess('Entreprise ajoutée avec succès !');
      setNewCompany({
        name: '',
        sector: SECTOR_OPTIONS[0],
        location: 'Rabat, Maroc',
        employees: '50',
        revenue: '5M €',
        sites: '1',
        facilities: '2',
        vehicles: '5',
        insuranceBudget: '50000'
      });
      setTimeout(() => {
        setIsAddingCompany(false);
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout de l\'entreprise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-bold text-sm">RI</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">RiskInsure</h1>
              <p className="text-xs text-slate-500">Sélectionnez une entreprise</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-[11px] text-slate-500">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200 hover:border-red-200 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Mes entreprises</h2>
          <p className="text-sm text-slate-600">
            Sélectionnez une entreprise pour accéder à son espace de gestion des risques et des contrats d'assurance.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
            {success}
          </div>
        )}

        {/* Add Company Button */}
        {!isAddingCompany && (
          <button
            onClick={() => setIsAddingCompany(true)}
            className="mb-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <PlusCircle className="w-5 h-5" />
            Ajouter une entreprise
          </button>
        )}

        {/* Add Company Form */}
        {isAddingCompany && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Ajouter une nouvelle entreprise
              </h3>
            </div>
            <form onSubmit={handleAddCompany} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Entreprise SARL"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Secteur d'activité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newCompany.sector}
                    onChange={(e) => setNewCompany({ ...newCompany, sector: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    {SECTOR_OPTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Localisation
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Casablanca, Maroc"
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nombre d'employés
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 50"
                    value={newCompany.employees}
                    onChange={(e) => setNewCompany({ ...newCompany, employees: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chiffre d'affaires
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5M €"
                    value={newCompany.revenue}
                    onChange={(e) => setNewCompany({ ...newCompany, revenue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Budget Assurance (€/an)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 50000"
                    value={newCompany.insuranceBudget}
                    onChange={(e) => setNewCompany({ ...newCompany, insuranceBudget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingCompany(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? 'Ajout...' : 'Ajouter l\'entreprise'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Companies Grid */}
        {companies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune entreprise</h3>
            <p className="text-sm text-slate-600 mb-4">
              Vous n'avez pas encore d'entreprise enregistrée. Ajoutez votre première entreprise pour commencer.
            </p>
            <button
              onClick={() => setIsAddingCompany(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="w-5 h-5" />
              Ajouter ma première entreprise
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.name}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {company.sector}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {company.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{company.employees} salariés</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-medium">CA:</span>
                    <span>{company.revenue}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectCompany(company.name)}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Chargement...' : 'Accéder à l\'entreprise'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanySelectionPage;
