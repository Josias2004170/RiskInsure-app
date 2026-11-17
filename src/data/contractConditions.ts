import { Contract } from '../types';

export interface ConditionSet {
  object: string; // Objet du contrat
  guarantees: string[]; // Liste des garanties
  obligations: string[]; // Obligations de l'assuré
  exclusions: string[];
  claimProcedure: string;
  noticePeriodDays: number;
  territory: string;
  durationMonths: number;
  deductible: string; // Franchise
  premium: number; // Prime
  subrogation: boolean;
  cancellationTerms: string;
  endorsements?: string[];
}

export interface PremiumBreakdown {
  basePremium: number;
  taxes: number;
  fees: number;
  discounts: number;
  total: number;
}

export interface ContractWithConditions extends Contract {
  conditions: ConditionSet;
  premiumBreakdown: PremiumBreakdown;
}

// Basic mapping from contract.type keywords to default ConditionSet
const defaultConditionFor = (type: string): ConditionSet => {
  const t = type.toLowerCase();
  if (t.includes('sant') || t.includes('prev') || t.includes('prév')) {
    return {
      object: 'Couverture des frais de santé et prévoyance du personnel',
      guarantees: ['Soins médicaux', 'Hospitalisation', 'Prestations liées au personnel selon table de garanties'],
      obligations: ['Déclaration des salariés', 'Versement des cotisations', 'Respect des procédures de remboursement'],
      exclusions: ['Actes non couverts contractuellement', 'Conditions préexistantes non déclarées', 'Suicide (selon délai)'],
      claimProcedure: 'Déclaration sous 30 jours; constitution du dossier médical et factures.',
      noticePeriodDays: 30,
      territory: 'National (extensions possibles sous endorsement)',
      durationMonths: 12,
      deductible: 'Selon tableau de garanties',
      premium: 0,
      subrogation: true,
      cancellationTerms: 'Résiliation annuelle à l\'échéance ou pour non-paiement après préavis 15 jours.'
    };
  }

  if (t.includes('dommage') || t.includes('biens') || t.includes('perte') || t.includes('brise')) {
    return {
      object: 'Dommages aux biens et pertes d\'exploitation',
      guarantees: ['Dommages matériels aux locaux', 'Équipements', 'Stocks', 'Pertes d\'exploitation associées'],
      obligations: ['Maintenance préventive des équipements', 'Respect des normes de sécurité', 'Déclaration annuelle des valeurs'],
      exclusions: ['Usure normale', 'Actes intentionnels', 'Guerre civile, défauts de conception non déclarés'],
      claimProcedure: 'Déclaration immédiate; expertise obligatoire; factures/preuves de valeur.',
      noticePeriodDays: 7,
      territory: 'Sites déclarés + transit national',
      durationMonths: 12,
      deductible: 'Selon contrat',
      premium: 0,
      subrogation: true,
      cancellationTerms: 'Résiliation à la date d\'échéance avec préavis 30 jours; possibilité de suspension pour non-paiement.'
    };
  }

  if (t.includes('responsabil') || t.includes('rc') || t.includes('d&o') || t.includes('direct')) {
    return {
      object: 'Responsabilité civile et protection juridique',
      guarantees: ['Réclamations de tiers pour dommages corporels et matériels', 'Frais de défense'],
      obligations: ['Notification immédiate des sinistres', 'Collaboration à l\'instruction', 'Respect des normes réglementaires'],
      exclusions: ['Sanctions pénales intentionnelles', 'Pertes financières pures sauf si couvertes explicitement'],
      claimProcedure: 'Notification immédiate; mise en place de défense conjointe; prise en charge des frais juridiques selon plafond.',
      noticePeriodDays: 15,
      territory: 'Worldwide (selon clauses territoriales)',
      durationMonths: 12,
      deductible: 'Selon contrat',
      premium: 0,
      subrogation: false,
      cancellationTerms: 'Clauses spécifiques D&O: période de révocation et clauses run-off selon avenants.'
    };
  }

  // Fallback generic conditions
  return {
    object: 'Couverture standard selon le type de contrat',
    guarantees: ['Garanties selon conditions particulières'],
    obligations: ['Respect des conditions générales', 'Paiement des primes', 'Déclaration des sinistres'],
    exclusions: ['Exclusions standards contractuelles'],
    claimProcedure: 'Déclaration au plus tôt; suivre la procédure indiquée sur le contrat.',
    noticePeriodDays: 30,
    territory: 'National',
    durationMonths: 12,
    deductible: 'Selon contrat',
    premium: 0,
    subrogation: true,
    cancellationTerms: 'Résiliation à l\'échéance ou pour non-paiement.'
  };
};

// Simple extrapolation of premium breakdown from known premium and common ratios.
export const extrapolatePremiumBreakdown = (contract: Contract): PremiumBreakdown => {
  const total = Math.max(0, contract.premium || 0);
  // heuristics: base 78-82%, taxes ~10%, fees 3-6%, discounts/loadings remainder
  const taxes = Math.round(total * 0.10);
  const fees = Math.round(total * 0.05);
  const base = Math.round(total - taxes - fees);
  const discounts = Math.round(total - (base + taxes + fees));
  return { basePremium: base, taxes, fees, discounts, total };
};

export const attachConditionsToContract = (contract: Contract): ContractWithConditions => {
  const conditions = defaultConditionFor(contract.type || '');
  const premiumBreakdown = extrapolatePremiumBreakdown(contract);
  return { ...contract, conditions, premiumBreakdown } as ContractWithConditions;
};

export const attachConditionsToContracts = (contracts: Contract[]): ContractWithConditions[] => {
  return contracts.map(attachConditionsToContract);
};

export default { attachConditionsToContract, attachConditionsToContracts, extrapolatePremiumBreakdown };
