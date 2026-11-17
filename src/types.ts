export interface Contract {
  id: string;
  insurer: string;         // Nom de l'assureur (e.g. "AXA Corporate")
  contractNumber: string;  // Numéro de contrat (e.g. "CTR-2026-889")
  type: string;            // Type de contrat (e.g. "Dommages aux biens", "Santé Groupe")
  startDate: string;
  endDate: string;
  premium: number;         // Prime annuelle (€)
  coverageLimit: number;   // Plafond de garantie (€)
  deductible: number;      // Franchise (€)
  status: 'Actif' | 'En révision' | 'Expiré';
  createdAt?: string;
  // Nouveaux champs
  guarantees?: string;     // Garanties du contrat
  obligations?: string;    // Obligations de l'assuré
  exclusions?: string;     // Exclusions du contrat
  limits?: string;         // Limites du contrat
}

export interface Risk {
  id: string;
  contractId?: string;    // FK optional -> Contract.id (peut être vide si risque non couvert)
  title: string;
  description: string;
  family: string;          // Category/Family (e.g., "Risques humains", "Risques opérationnels", "Cyber")
  isMandatory: boolean;
  initialProbability: number; // 1 to 5
  initialImpact: number;      // 1 to 5
  coveragePercentage?: number; // 0 to 100 (0 = non couvert, 100 = totalement couvert, entre = partiellement)
  createdAt?: string;
  // New fields for detailed risk profile
  causes?: string;
  consequences?: string;
  department?: string;
  responsible?: string;
  identificationDate?: string;
  status?: 'Identifié' | 'En cours d\'analyse' | 'Traitement en cours' | 'Maîtrisé' | 'Clôturé';
  treatment?: 'Éviter' | 'Réduire' | 'Transférer / Assurer' | 'Accepter';
  coverageStatus?: 'Couvert' | 'Partiellement couvert' | 'Non couvert' | 'À analyser';
  existingMeasures?: string;
  comments?: string;
}

export interface EffectivenessEvaluation {
  id: string;
  measureId: string;       // FK compulsory -> Measure.id
  effectiveness: number;   // 0 to 100 (%)
  justification: string;
  beforeProbability: number; // 1 to 4
  beforeImpact: number;      // 1 to 4
  afterProbability: number;  // 1 to 4 (Probability residual)
  afterImpact: number;       // 1 to 4 (Impact residual)
  createdAt?: string;
}

export interface Measure {
  id: string;
  riskId: string;          // FK compulsory -> Risk.id
  title: string;
  description: string;
  responsible: string;
  date: string;
  type: 'Préventive' | 'Protectrice' | 'Corrective' | 'Organisationnelle';
  status: 'Planifiée' | 'En cours' | 'Mise en œuvre' | 'Abandonnée';
  priority?: string;
  deadline?: string;
  estimatedCost?: string;
  expectedEffectiveness?: number;
  evaluation?: EffectivenessEvaluation;
  createdAt?: string;
  // Nouveau champ
  insurerMandatory?: boolean; // Mesure obligatoire imposée par l'assureur
}

export interface Claim {
  id: string;
  contractId: string;      // FK -> Contract.id
  riskId?: string;         // Optional FK -> Risk.id
  claimNumber: string;
  title: string;
  dateOfLoss: string;
  estimatedCost: number;
  paidAmount: number;
  status: 'Déclaré' | 'En cours d\'expertise' | 'Indemnisé' | 'Clôturé';
  description: string;
  createdAt?: string;
}

export interface CompanyInfo {
  name: string;
  sector: string;
  location: string;
  employees: number;
  revenue: string;
  sites: number;
  facilities: number;
  vehicles: number;
  insuranceBudget: number;
  admin: string;
}

export interface CalculatedRiskData {
  risk: Risk;
  contract?: Contract;
  measures: Measure[];
  residualProbability: number; // 1-4
  residualImpact: number;      // 1-4
  residualScore: number;       // 1-16
  criticalityLevel: 'Critique' | 'Elevé' | 'Modéré' | 'Faible';
  coverageStatus: 'Couverts' | 'Partiellement' | 'Non couvert';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: 'Administrator' | 'User';
  createdAt?: string;
}
