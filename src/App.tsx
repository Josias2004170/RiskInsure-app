import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar';
import CreateContractPage from './components/CreateContractPage';
import LoginPage from './components/LoginPage';
import CompanySelectionPage from './components/CompanySelectionPage';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { PanoramaTab } from './components/PanoramaTab';
import { RisksTab } from './components/RisksTab';
import { MappingTab } from './components/MappingTab';
import { MeasuresTab } from './components/MeasuresTab';
import { ContractsTab } from './components/ContractsTab';
import { ClaimsTab } from './components/ClaimsTab';
import { ScanContractTab } from './components/ScanContractTab';
import { ReportsTab } from './components/ReportsTab';
import { SettingsTab } from './components/SettingsTab';

import { AddContractModal } from './components/AddContractModal';
import { AddRiskModal } from './components/AddRiskModal';
import { AddMeasureModal } from './components/AddMeasureModal';
import { AddClaimModal } from './components/AddClaimModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { CompanyInfo, Contract, Risk, Measure, Claim, User } from './types';
import { CatalogRiskItem } from './data/riskCatalog';
import { risks as catalogRisks, sectorDefaultCoverage } from './data/insuranceCatalog';
import {
  fetchCompany,
  fetchCompanies,
  fetchContracts,
  fetchRisks,
  fetchMeasures,
  fetchClaims,
  createContract,
  createRisk,
  createMeasure,
  createClaim,
  deleteContract,
  deleteRisk,
  deleteMeasure,
  deleteClaim,
  updateCompany,
  registerCompany,
  switchCompany,
  resetDatabase,
  login,
  register,
  logout,
  getCurrentUser
} from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Database State
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [allCompanies, setAllCompanies] = useState<CompanyInfo[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isAddContractOpen, setIsAddContractOpen] = useState<boolean>(false);
  const [isAddRiskOpen, setIsAddRiskOpen] = useState<boolean>(false);
  const [isAddMeasureOpen, setIsAddMeasureOpen] = useState<boolean>(false);
  const [isAddClaimOpen, setIsAddClaimOpen] = useState<boolean>(false);

  const [selectedRiskIdForMeasure, setSelectedRiskIdForMeasure] = useState<string | undefined>();
  const [selectedContractIdForRisk, setSelectedContractIdForRisk] = useState<string | undefined>();

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Authentication Handlers
  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
      addToast('success', 'Connexion réussie', `Bienvenue, ${user.firstName} ${user.lastName}`);
    } catch (err: any) {
      throw err;
    }
  };

  const handleRegister = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const user = await register(userData);
      setCurrentUser(user);
      setIsAuthenticated(true);
      addToast('success', 'Compte créé', `Bienvenue, ${user.firstName} ${user.lastName}`);
    } catch (err: any) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setCompany(null);
      setActiveTab('home');
      addToast('info', 'Déconnexion réussie', 'Vous avez été déconnecté de RiskInsure.');
    } catch (err: any) {
      addToast('error', 'Erreur de déconnexion', err.message);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // User not authenticated
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Initial Load from API
  const loadAllData = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const [compsList, ctrData, riskData, measData, clmData] = await Promise.all([
        fetchCompanies().catch(() => []),
        fetchContracts().catch(() => []),
        fetchRisks().catch(() => []),
        fetchMeasures().catch(() => []),
        fetchClaims().catch(() => [])
      ]);

      setAllCompanies(compsList.length > 0 ? compsList : []);
      setContracts(ctrData);
      setRisks(riskData);
      setMeasures(measData);
      setClaims(clmData);
    } catch (err: any) {
      console.error("Erreur de chargement initial :", err);
      addToast('error', 'Erreur de chargement', err.message || 'Impossible de contacter le serveur backend.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // listen to import-default-risks events dispatched by MappingTab
    const onImport = async (e: any) => {
      const sector = e.detail?.sector;
      if (!sector) return;
      try {
        // create each catalog risk referenced in sectorDefaultCoverage
        const ids = sectorDefaultCoverage[sector] || [];
        for (const id of ids) {
          const catalog = catalogRisks.find(r => r.id === id);
          if (!catalog) continue;
          // create unassigned risk (contractId empty)
          await handleSaveCatalogImport(catalog);
        }
        addToast('success', 'Risques importés', `Les risques par défaut pour ${sector} ont été ajoutés.`);
        await loadAllData();
      } catch (err: any) {
        addToast('error', 'Import impossible', err.message || 'Erreur lors de l\'import des risques');
      }
    };
    window.addEventListener('import-default-risks', onImport as EventListener);
    return () => window.removeEventListener('import-default-risks', onImport as EventListener);
  }, [isAuthenticated]);

  const handleSaveCatalogImport = async (catalogItem: any) => {
    const payload: Partial<Risk> = {
      contractId: '',
      title: catalogItem.title,
      description: catalogItem.description || '',
      family: catalogItem.family,
      isMandatory: Boolean(catalogItem.isMandatoryByLaw),
      initialProbability: catalogItem.defaultProbability || 2,
      initialImpact: catalogItem.defaultImpact || 2
    };
    const newRisk = await createRisk(payload);
    setRisks(prev => [...prev, newRisk]);
    return newRisk;
  };

  // Handlers for Save Actions
  const handleSaveContract = async (payload: Partial<Contract>) => {
    console.log("App handleSaveContract:", payload);
    const newContract = await createContract(payload);
    setContracts(prev => [...prev, newContract]);
    addToast('success', 'Contrat enregistré avec succès', `Le contrat ${newContract.insurer} (${newContract.contractNumber}) a été ajouté.`);
  };

  const handleSaveRisk = async (payload: Partial<Risk>) => {
    console.log("App handleSaveRisk:", payload);
    const newRisk = await createRisk(payload);
    setRisks(prev => [...prev, newRisk]);
    addToast('success', 'Risque enregistré avec succès', `Le risque ${newRisk.title} est lié au contrat d'assurance.`);
  };

  const handleSaveCatalogRisk = async (catalogItem: CatalogRiskItem, contractId: string) => {
    const payload: Partial<Risk> = {
      contractId,
      title: catalogItem.title,
      description: catalogItem.description,
      family: catalogItem.family,
      isMandatory: Boolean(catalogItem.isMandatoryByLaw),
      initialProbability: catalogItem.defaultProbability,
      initialImpact: catalogItem.defaultImpact
    };
    const newRisk = await createRisk(payload);
    setRisks(prev => [...prev, newRisk]);
    addToast('success', 'Risque enregistré', `Le risque "${newRisk.title}" a été ajouté à la cartographie.`);
  };

  const handleSaveMeasure = async (payload: any) => {
    console.log("App handleSaveMeasure:", payload);
    const savedMeasure = await createMeasure(payload);
    setMeasures(prev => [...prev, savedMeasure]);
    addToast('success', 'Mesure enregistrée avec succès', `La mesure "${savedMeasure.title}" a été rattachée au risque.`);
  };

  const handleSaveClaim = async (payload: Partial<Claim>) => {
    console.log("App handleSaveClaim:", payload);
    const newClaim = await createClaim(payload);
    setClaims(prev => [...prev, newClaim]);
    addToast('success', 'Sinistre enregistré avec succès', `Le dossier ${newClaim.claimNumber} a été créé.`);
  };

  // Delete Handlers
  const handleDeleteContract = async (id: string) => {
    try {
      await deleteContract(id);
      setContracts(prev => prev.filter(c => c.id !== id));
      setRisks(prev => prev.map(r => r.contractId === id ? { ...r, contractId: '' } : r));
      setClaims(prev => prev.map(c => c.contractId === id ? { ...c, contractId: '' } : c));
      addToast('info', 'Contrat supprimé', 'Le contrat a été retiré de votre portefeuille.');
    } catch (err: any) {
      addToast('error', 'Suppression impossible', err.message || 'Erreur lors de la suppression du contrat');
    }
  };

  const handleDeleteRisk = async (id: string) => {
    try {
      await deleteRisk(id);
      setRisks(prev => prev.filter(r => r.id !== id));
      addToast('info', 'Risque supprimé');
    } catch (err: any) {
      addToast('error', 'Suppression impossible', err.message);
    }
  };

  const handleDeleteMeasure = async (id: string) => {
    try {
      await deleteMeasure(id);
      setMeasures(prev => prev.filter(m => m.id !== id));
      addToast('info', 'Mesure supprimée');
    } catch (err: any) {
      addToast('error', 'Erreur de suppression', err.message);
    }
  };

  const handleDeleteClaim = async (id: string) => {
    try {
      await deleteClaim(id);
      setClaims(prev => prev.filter(c => c.id !== id));
      addToast('info', 'Sinistre supprimé');
    } catch (err: any) {
      addToast('error', 'Erreur de suppression', err.message);
    }
  };

  const handleResetData = async () => {
    try {
      await resetDatabase();
      await loadAllData();
      addToast('success', 'Données réinitialisées', 'Les données de démonstration ont été restaurées.');
    } catch (err: any) {
      addToast('error', 'Erreur de réinitialisation', err.message);
    }
  };

  const handleUpdateCompany = async (updated: Partial<CompanyInfo>) => {
    const res = await updateCompany(updated);
    setCompany(res);
    addToast('success', 'Paramètres mis à jour');
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center animate-bounce mb-4 shadow-lg shadow-blue-500/20">
          <span className="font-bold text-lg">RI</span>
        </div>
        <h3 className="text-sm font-bold text-slate-800">Chargement de RiskInsure...</h3>
        <p className="text-xs text-slate-400 mt-1">Initialisation de l'application</p>
      </div>
    );
  }

  // Not authenticated - Show Login Page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Authenticated but no company selected - Show Company Selection Page
  if (!company) {
    return (
      <CompanySelectionPage
        companies={allCompanies}
        onSelectCompany={async (name) => {
          const res = await switchCompany(name);
          setCompany(res.company);
          setAllCompanies(res.companies);
          setActiveTab('overview');
          addToast('success', 'Entreprise sélectionnée', `Vous accédez maintenant à ${res.company.name}`);
        }}
        onAddCompany={async (data) => {
          const res = await registerCompany(data);
          setCompany(res.company);
          setAllCompanies(res.companies);
          setActiveTab('overview');
          addToast('success', 'Entreprise créée', `L'entreprise ${res.company.name} a été ajoutée.`);
        }}
        onLogout={handleLogout}
        currentUser={{
          firstName: currentUser?.firstName || '',
          lastName: currentUser?.lastName || '',
          role: currentUser?.role || 'User'
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          company={company}
          onLogout={handleLogout}
          onChangeCompany={() => {
            setCompany(null);
            setActiveTab('overview');
          }}
        />

        {/* Tab View Container */}
        <main className="p-8 max-w-7xl w-full mx-auto flex-1">
          {activeTab === 'overview' && (
            <OverviewTab
              company={company}
              contracts={contracts}
              risks={risks}
              measures={measures}
              claims={claims}
              onNavigateTab={setActiveTab}
              onOpenAddContract={() => setIsAddContractOpen(true)}
              onOpenAddRisk={() => setIsAddRiskOpen(true)}
              onOpenAddMeasure={() => {
                setSelectedRiskIdForMeasure(undefined);
                setIsAddMeasureOpen(true);
              }}
              onOpenAddClaim={() => setIsAddClaimOpen(true)}
            />
          )}

          {activeTab === 'panorama' && (
            <PanoramaTab
              company={company}
              contracts={contracts}
              risks={risks}
              measures={measures}
              onOpenAddContract={() => setIsAddContractOpen(true)}
              onOpenAddRisk={() => setIsAddRiskOpen(true)}
              onOpenAddMeasure={() => {
                setSelectedRiskIdForMeasure(undefined);
                setIsAddMeasureOpen(true);
              }}
            />
          )}

          {activeTab === 'risks' && (
            <RisksTab
              company={company}
              risks={risks}
              contracts={contracts}
              measures={measures}
              onOpenAddRisk={() => setIsAddRiskOpen(true)}
              onOpenAddMeasureForRisk={(riskId) => {
                setSelectedRiskIdForMeasure(riskId);
                setIsAddMeasureOpen(true);
              }}
              onDeleteRisk={handleDeleteRisk}
              onSaveCatalogRisk={handleSaveCatalogRisk}
            />
          )}

          {activeTab === 'mapping' && (
            <MappingTab
              risks={risks}
              contracts={contracts}
              measures={measures}
              onOpenAddRisk={() => setIsAddRiskOpen(true)}
              onOpenAddMeasureForRisk={(riskId) => {
                setSelectedRiskIdForMeasure(riskId);
                setIsAddMeasureOpen(true);
              }}
              company={company}
            />
          )}

          {activeTab === 'create-contract' && (
            <CreateContractPage onSave={handleSaveContract} onCancel={() => setActiveTab('contracts')} />
          )}

          {activeTab === 'measures' && (
            <MeasuresTab
              measures={measures}
              risks={risks}
              onOpenAddMeasure={() => {
                setSelectedRiskIdForMeasure(undefined);
                setIsAddMeasureOpen(true);
              }}
              onDeleteMeasure={handleDeleteMeasure}
            />
          )}

          {activeTab === 'contracts' && (
            <ContractsTab
              contracts={contracts}
              risks={risks}
              onOpenAddContract={() => setIsAddContractOpen(true)}
              onDeleteContract={handleDeleteContract}
            />
          )}

          {activeTab === 'scan' && (
            <ScanContractTab
              onSaveContract={handleSaveContract}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'claims' && (
            <ClaimsTab
              claims={claims}
              contracts={contracts}
              risks={risks}
              onOpenAddClaim={() => setIsAddClaimOpen(true)}
              onDeleteClaim={handleDeleteClaim}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              risks={risks}
              contracts={contracts}
              measures={measures}
              claims={claims}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              company={company}
              onUpdateCompany={handleUpdateCompany}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddContractModal
        isOpen={isAddContractOpen}
        onClose={() => setIsAddContractOpen(false)}
        onSave={handleSaveContract}
      />

      <AddRiskModal
        isOpen={isAddRiskOpen}
        onClose={() => setIsAddRiskOpen(false)}
        contracts={contracts}
        selectedContractId={selectedContractIdForRisk}
        onSave={handleSaveRisk}
      />

      <AddMeasureModal
        isOpen={isAddMeasureOpen}
        onClose={() => setIsAddMeasureOpen(false)}
        risks={risks}
        selectedRiskId={selectedRiskIdForMeasure}
        onSave={handleSaveMeasure}
      />

      <AddClaimModal
        isOpen={isAddClaimOpen}
        onClose={() => setIsAddClaimOpen(false)}
        contracts={contracts}
        risks={risks}
        onSave={handleSaveClaim}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
