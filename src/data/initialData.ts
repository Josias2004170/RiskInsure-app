import { Contract, Risk, Measure, Claim, CompanyInfo } from '../types';
import { attachConditionsToContracts } from './contractConditions';
import { getDefaultRisksForSector } from './riskCatalog';

export const initialCompany: CompanyInfo = {
  name: "Ecole Mohammadia d'Ingénieurs",
  sector: "BTP / Construction & Travaux publics",
  location: "Rabat, Maroc",
  employees: 250,
  revenue: "20M €",
  sites: 3,
  facilities: 12,
  vehicles: 25,
  insuranceBudget: 150000,
  admin: "ARZ Assureur Conseil"
};

export const initialContracts: Contract[] = [
  {
    id: "ctr-1",
    insurer: "AXA Corporate Solutions",
    contractNumber: "AXA-BTP-2026-901",
    type: "Dommages aux Biens & Perte d'Exploitation",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    premium: 75000,
    coverageLimit: 20000000,
    deductible: 5000,
    status: "Actif"
  },
  {
    id: "ctr-2",
    insurer: "Allianz Global Corporate",
    contractNumber: "ALL-RC-2026-442",
    type: "Responsabilité Civile Exploitation",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    premium: 55000,
    coverageLimit: 12000000,
    deductible: 3000,
    status: "Actif"
  },
  {
    id: "ctr-3",
    insurer: "Sanlam Assurance",
    contractNumber: "SAN-TRAV-2026-109",
    type: "Accidents du Travail & Prévoyance",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    premium: 45000,
    coverageLimit: 8000000,
    deductible: 2000,
    status: "Actif"
  }
];

// Contracts augmented with default conditions and an extrapolated premium breakdown
export const initialContractsWithConditions = attachConditionsToContracts(initialContracts);

// Generate risks based on the company's sector
const sectorRisks = getDefaultRisksForSector(initialCompany.sector);

export const initialRisks: Risk[] = sectorRisks.map((catalogRisk, index) => ({
  id: `risk-${index + 1}`,
  contractId: index === 0 ? "ctr-1" : index === 1 ? "ctr-2" : "ctr-3",
  title: catalogRisk.title,
  description: catalogRisk.description,
  family: catalogRisk.family,
  isMandatory: Boolean(catalogRisk.isMandatoryByLaw),
  initialProbability: catalogRisk.defaultProbability,
  initialImpact: catalogRisk.defaultImpact
}));

export const initialMeasures: Measure[] = [
  {
    id: "meas-1",
    riskId: "risk-1",
    title: "Installation de systèmes de détection incendie sur les chantiers",
    description: "Détecteurs de fumée et alarmes connectées dans tous les bâtiments et zones de stockage.",
    responsible: "M. Ahmed Benali (Directeur Sécurité)",
    date: "2026-03-15",
    type: "Protectrice",
    status: "Mise en œuvre",
    evaluation: {
      id: "eval-1",
      measureId: "meas-1",
      effectiveness: 85,
      justification: "Réduction du temps de détection des incendies de 60%.",
      beforeProbability: 2,
      beforeImpact: 4,
      afterProbability: 1,
      afterImpact: 3
    }
  },
  {
    id: "meas-2",
    riskId: "risk-2",
    title: "Formation RC Exploitation pour le personnel de chantier",
    description: "Formation obligatoire sur les risques de responsabilité civile et procédures de sécurité.",
    responsible: "Mme Fatima Zahra (Responsable RH)",
    date: "2026-02-10",
    type: "Préventive",
    status: "Mise en œuvre",
    evaluation: {
      id: "eval-2",
      measureId: "meas-2",
      effectiveness: 75,
      justification: "Diminution des incidents liés à la responsabilité civile de 40%.",
      beforeProbability: 2,
      beforeImpact: 4,
      afterProbability: 1,
      afterImpact: 3
    }
  },
  {
    id: "meas-3",
    riskId: "risk-3",
    title: "Programme de prévention des accidents du travail",
    description: "Équipements de protection individuelle (EPI) obligatoires et formations régulières.",
    responsible: "Dr. Karim Tazi (Médecin du travail)",
    date: "2026-01-20",
    type: "Préventive",
    status: "Mise en œuvre",
    evaluation: {
      id: "eval-3",
      measureId: "meas-3",
      effectiveness: 80,
      justification: "Baisse des accidents du travail de 35% depuis la mise en place.",
      beforeProbability: 3,
      beforeImpact: 3,
      afterProbability: 2,
      afterImpact: 2
    }
  }
];

export const initialClaims: Claim[] = [
  {
    id: "clm-1",
    contractId: "ctr-1",
    riskId: "risk-1",
    claimNumber: "SIN-2026-0041",
    title: "Incendie sur chantier - Zone stockage matériaux",
    dateOfLoss: "2026-05-12",
    estimatedCost: 85000,
    paidAmount: 78000,
    status: "Indemnisé",
    description: "Incendie dû à un court-circuit dans la zone de stockage des matériaux. Dommages aux stocks et équipements. Prise en charge AXA."
  },
  {
    id: "clm-2",
    contractId: "ctr-2",
    riskId: "risk-2",
    claimNumber: "SIN-2026-0089",
    title: "Dommage à tiers - Chute de matériel",
    dateOfLoss: "2026-06-28",
    estimatedCost: 35000,
    paidAmount: 0,
    status: "En cours d'expertise",
    description: "Chute de matériel depuis un échafaudage endommageant un véhicule tiers. Dossier d'expertise transmis à Allianz."
  }
];
