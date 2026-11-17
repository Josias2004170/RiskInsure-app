import React from 'react';

interface HomePageProps {
  onOpenApplication?: () => void;
  onAuth?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenApplication, onAuth }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Bienvenue sur RiskInsure</h1>
        <p className="text-sm text-slate-600 mb-6">Gestion centralisée des risques et des contrats d'assurance pour votre entreprise. Visualisez la cartographie des risques, suivez les mesures préventives, gérez les contrats et exportez des synthèses.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-slate-800">Démarrer l'application</h3>
            <p className="text-xs text-slate-500 mt-2">Accéder à la cartographie, aux risques et à vos contrats.</p>
            <div className="mt-4">
              <button onClick={onOpenApplication} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">Ouvrir l'application</button>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-slate-800">Créer un contrat</h3>
            <p className="text-xs text-slate-500 mt-2">Ajouter un contrat en respectant les spécifications et conditions standard.</p>
            <div className="mt-4">
              <button onClick={onAuth} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm">Créer un compte / Se connecter</button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          <p>Pour respecter les spécifications documentaires, nous pouvons appliquer des règles de validation avancées (plafonds, franchises, structure des numéros de contrat, pièces jointes obligatoires). Souhaitez-vous que j'intègre ces règles maintenant ?</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
