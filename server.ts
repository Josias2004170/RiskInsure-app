import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initialCompany, initialContracts, initialRisks, initialMeasures, initialClaims } from "./src/data/initialData.js";
import { getDefaultRisksForSector, generateCompanyRisks } from "./src/data/riskCatalog.js";
import { Contract, Risk, Measure, EffectivenessEvaluation, Claim, CompanyInfo, User } from "./src/types.js";

// In-Memory Database store with foreign key enforcement
let dbUsers: User[] = [
  {
    id: "user-admin-001",
    firstName: "ARZ",
    lastName: "Assureur Conseil",
    email: "admin@riskinsure.com",
    username: "admin",
    role: "Administrator",
    createdAt: new Date().toISOString()
  }
];
let dbCurrentUser: User | null = null;
let dbCompanies: CompanyInfo[] = [
  { ...initialCompany },
  {
    name: "Atlas BioPharm Solutions",
    sector: "Pharmaceutique / Biomédical",
    location: "Casablanca, Maroc",
    employees: 180,
    revenue: "35M €",
    sites: 2,
    facilities: 8,
    vehicles: 14,
    insuranceBudget: 220000,
    admin: "ARZ Assureur Conseil"
  },
  {
    name: "BTP Construction Pro",
    sector: "BTP / Construction / Travaux publics",
    location: "Tangier, Maroc",
    employees: 420,
    revenue: "50M €",
    sites: 12,
    facilities: 25,
    vehicles: 60,
    insuranceBudget: 310000,
    admin: "ARZ Assureur Conseil"
  },
  {
    name: "Université Casablanca",
    sector: "Éducation / Écoles / Universités",
    location: "Casablanca, Maroc",
    employees: 350,
    revenue: "45M €",
    sites: 3,
    facilities: 15,
    vehicles: 8,
    insuranceBudget: 180000,
    admin: "ARZ Assureur Conseil"
  },
  {
    name: "Clinique Santé Plus",
    sector: "Santé / Hôpitaux / Cliniques",
    location: "Rabat, Maroc",
    employees: 220,
    revenue: "40M €",
    sites: 1,
    facilities: 12,
    vehicles: 6,
    insuranceBudget: 250000,
    admin: "ARZ Assureur Conseil"
  }
];
let dbCompany: CompanyInfo | null = null;
let dbContracts: Contract[] = [...initialContracts];
let dbRisks: Risk[] = [...initialRisks];
let dbMeasures: Measure[] = [...initialMeasures];
let dbClaims: Claim[] = [...initialClaims];

// In-memory password storage (in production, use bcrypt)
const dbPasswords: Record<string, string> = {
  "admin": "admin123"
};

const app = express();
const PORT = 3000;

app.use(express.json());

// Log middleware for debug tracing
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// ----------------------------------------------------
// AUTHENTICATION API
// ----------------------------------------------------
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("POST /api/auth/login - Username:", username);

  if (!username || !password) {
    res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis" });
    return;
  }

  const user = dbUsers.find(u => u.username === username);
  if (!user) {
    res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    return;
  }

  const storedPassword = dbPasswords[username];
  if (storedPassword !== password) {
    res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    return;
  }

  dbCurrentUser = user;
  console.log("User logged in:", user.username);
  res.json(user);
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password } = req.body;
  console.log("POST /api/auth/register - Username:", username);

  if (!firstName || !lastName || !email || !username || !password) {
    res.status(400).json({ error: "Tous les champs sont obligatoires" });
    return;
  }

  if (dbUsers.find(u => u.username === username)) {
    res.status(409).json({ error: "Ce nom d'utilisateur existe déjà" });
    return;
  }

  if (dbUsers.find(u => u.email === email)) {
    res.status(409).json({ error: "Cet email est déjà utilisé" });
    return;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    firstName,
    lastName,
    email,
    username,
    role: "User",
    createdAt: new Date().toISOString()
  };

  dbUsers.push(newUser);
  dbPasswords[username] = password;
  dbCurrentUser = newUser;

  console.log("User registered:", newUser.username);
  res.status(201).json(newUser);
});

app.post("/api/auth/logout", (req: Request, res: Response) => {
  console.log("POST /api/auth/logout");
  dbCurrentUser = null;
  dbCompany = null;
  res.json({ message: "Déconnexion réussie" });
});

app.get("/api/auth/me", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  res.json(dbCurrentUser);
});

// ----------------------------------------------------
// COMPANY API
// ----------------------------------------------------
app.get("/api/company", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  res.json(dbCompany);
});

app.get("/api/companies", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  res.json(dbCompanies);
});

app.post("/api/company", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("POST /api/company payload:", req.body);
  dbCompany = { ...dbCompany, ...req.body, admin: `${dbCurrentUser.firstName} ${dbCurrentUser.lastName}` };
  const existingIdx = dbCompanies.findIndex(c => c.name.toLowerCase() === dbCompany.name.toLowerCase());
  if (existingIdx >= 0) {
    dbCompanies[existingIdx] = { ...dbCompany };
  } else {
    dbCompanies.push({ ...dbCompany });
  }
  res.json(dbCompany);
});

app.post("/api/company/register", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  console.log("POST /api/company/register payload:", req.body);
  const newCompany: CompanyInfo = {
    name: req.body.name || "Nouvelle Entreprise",
    sector: req.body.sector || "Santé / Services médicaux",
    location: req.body.location || "Rabat, Maroc",
    employees: Number(req.body.employees || 50),
    revenue: req.body.revenue || "5M €",
    sites: Number(req.body.sites || 1),
    facilities: Number(req.body.facilities || 2),
    vehicles: Number(req.body.vehicles || 5),
    insuranceBudget: Number(req.body.insuranceBudget || 50000),
    admin: `${dbCurrentUser.firstName} ${dbCurrentUser.lastName}`
  };

  const existingIndex = dbCompanies.findIndex(c => c.name.toLowerCase() === newCompany.name.toLowerCase());
  if (existingIndex >= 0) {
    dbCompanies[existingIndex] = newCompany;
  } else {
    dbCompanies.push(newCompany);
  }

  dbCompany = newCompany;
  res.status(201).json({ company: dbCompany, companies: dbCompanies });
});

app.post("/api/company/switch", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  const { name } = req.body;
  const target = dbCompanies.find(c => c.name.toLowerCase() === (name || "").toLowerCase());
  if (target) {
    dbCompany = target;

    // Generate risks based on the new company's sector and name (for deterministic variation)
    const sectorRisks = generateCompanyRisks(target.sector, target.name);
    dbRisks = sectorRisks.map((catalogRisk, index) => ({
      id: `risk-${Date.now()}-${index}`,
      contractId: '',
      title: catalogRisk.title,
      description: catalogRisk.description,
      family: catalogRisk.family,
      isMandatory: Boolean(catalogRisk.isMandatoryByLaw || catalogRisk.mandatoryForSectors),
      initialProbability: catalogRisk.defaultProbability,
      initialImpact: catalogRisk.defaultImpact,
      coverageStatus: 'À analyser' as any,
      treatment: 'À analyser' as any
    }));

    // Generate contracts based on sector
    const sectorContracts = generateContractsForSector(target.sector, target.name);
    dbContracts = sectorContracts.map((contract, index) => ({
      ...contract,
      id: `ctr-${Date.now()}-${index}`,
      createdAt: new Date().toISOString()
    }));

    // Associate risks with contracts
    dbRisks = dbRisks.map((risk, index) => ({
      ...risk,
      contractId: dbContracts[index % dbContracts.length]?.id || ''
    }));

    // Generate measures for some risks
    dbMeasures = generateMeasuresForRisks(dbRisks, target.name);

    // Generate some claims
    dbClaims = generateClaimsForCompany(target.sector, target.name, dbContracts, dbRisks);

    console.log(`Switched to company: ${target.name}, sector: ${target.sector}`);
    console.log(`Generated ${dbRisks.length} risks, ${dbContracts.length} contracts, ${dbMeasures.length} measures, ${dbClaims.length} claims`);

    res.json({ company: dbCompany, companies: dbCompanies });
  } else {
    res.status(404).json({ error: "Entreprise introuvable" });
  }
});

// Helper function to generate contracts based on sector
function generateContractsForSector(sector: string, companyName: string): Partial<Contract>[] {
  const contracts: Partial<Contract>[] = [];
  const seed = companyName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  const baseContracts = [
    { insurer: "AXA Corporate", type: "Dommages aux biens", premium: 15000, coverageLimit: 5000000, deductible: 5000 },
    { insurer: "Allianz Global", type: "Responsabilité civile", premium: 12000, coverageLimit: 3000000, deductible: 2500 },
    { insurer: "Zurich International", type: "Cyber risques", premium: 8000, coverageLimit: 2000000, deductible: 10000 },
    { insurer: "Generali France", type: "Dommages corporels", premium: 10000, coverageLimit: 4000000, deductible: 3000 },
    { insurer: "Chubb", type: "Pertes d'exploitation", premium: 20000, coverageLimit: 10000000, deductible: 15000 }
  ];

  const count = 3 + (seed % 3); // 3-5 contracts
  for (let i = 0; i < count; i++) {
    const base = baseContracts[(seed + i) % baseContracts.length];
    contracts.push({
      insurer: base.insurer,
      contractNumber: `CTR-${2026}-${String((seed + i) * 1000 + 1000).slice(-4)}`,
      type: base.type,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      premium: base.premium + (seed % 5000),
      coverageLimit: base.coverageLimit,
      deductible: base.deductible,
      status: "Actif"
    });
  }

  return contracts;
}

// Helper function to generate measures for risks
function generateMeasuresForRisks(risks: Risk[], companyName: string): Measure[] {
  const measures: Measure[] = [];
  const seed = companyName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  // Generate measures for 5-8 risks
  const riskCount = Math.min(risks.length, 5 + (seed % 4));
  for (let i = 0; i < riskCount; i++) {
    const risk = risks[i];
    const measureCount = 1 + (seed % 2); // 1-2 measures per risk

    for (let j = 0; j < measureCount; j++) {
      const types: ('Préventive' | 'Protectrice' | 'Corrective' | 'Organisationnelle')[] = ['Préventive', 'Protectrice', 'Corrective', 'Organisationnelle'];
      const statuses: ('Planifiée' | 'En cours' | 'Mise en œuvre' | 'Abandonnée')[] = ['Planifiée', 'En cours', 'Mise en œuvre', 'Abandonnée'];
      const priorities = ['Basse', 'Moyenne', 'Haute', 'Critique'];

      const measureId = `meas-${Date.now()}-${i}-${j}`;
      const effectiveness = 60 + ((seed + i + j) % 40);

      measures.push({
        id: measureId,
        riskId: risk.id,
        title: `Mesure ${types[(seed + j) % types.length]} pour ${risk.title}`,
        description: `Action visant à réduire la probabilité et l'impact du risque ${risk.title}`,
        responsible: `Responsable ${i + 1}`,
        date: new Date().toISOString().split('T')[0],
        type: types[(seed + j) % types.length],
        status: statuses[(seed + i) % statuses.length],
        priority: priorities[(seed + j) % priorities.length],
        deadline: new Date(Date.now() + ((seed + i) * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        estimatedCost: String(1000 + ((seed + i + j) * 500)),
        expectedEffectiveness: 70 + ((seed + j) % 30),
        evaluation: {
          id: `eval-${Date.now()}-${i}-${j}`,
          measureId,
          effectiveness,
          justification: "Évaluation basée sur les indicateurs de performance",
          beforeProbability: risk.initialProbability,
          beforeImpact: risk.initialImpact,
          afterProbability: Math.max(1, risk.initialProbability - 1),
          afterImpact: Math.max(1, risk.initialImpact - 1),
          createdAt: new Date().toISOString()
        },
        createdAt: new Date().toISOString()
      });
    }
  }

  return measures;
}

// Helper function to generate claims
function generateClaimsForCompany(sector: string, companyName: string, contracts: Contract[], risks: Risk[]): Claim[] {
  const claims: Claim[] = [];
  const seed = companyName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  // Generate 1-3 claims
  const claimCount = 1 + (seed % 3);
  for (let i = 0; i < claimCount; i++) {
    const statuses: ('Déclaré' | 'En cours d\'expertise' | 'Indemnisé' | 'Clôturé')[] = ['Déclaré', 'En cours d\'expertise', 'Indemnisé', 'Clôturé'];

    claims.push({
      id: `claim-${Date.now()}-${i}`,
      contractId: contracts[i % contracts.length]?.id || '',
      riskId: risks[i % risks.length]?.id,
      claimNumber: `SIN-${2026}-${String((seed + i) * 1000 + 5000).slice(-4)}`,
      title: `Sinistre ${sector} - Incident ${i + 1}`,
      dateOfLoss: new Date(Date.now() - ((seed + i) * 60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      estimatedCost: 5000 + ((seed + i) * 10000),
      paidAmount: 0,
      status: statuses[(seed + i) % statuses.length],
      description: `Description détaillée du sinistre survenu dans le cadre de l'activité ${sector}`,
      createdAt: new Date().toISOString()
    });
  }

  return claims;
}

// ----------------------------------------------------
// CONTRACTS API
// ----------------------------------------------------
app.get("/api/contracts", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("GET /api/contracts - Count:", dbContracts.length);
  res.json(dbContracts);
});

app.post("/api/contracts", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("POST /api/contracts - Payload reçu :", req.body);

  const payload = req.body || {};

  // Flexible key mapping to handle React frontend variations
  const insurer = (payload.insurer || payload.insurerName || payload.assureur || "").trim();
  const contractNumber = (payload.contractNumber || payload.number || payload.numeroContrat || payload.contractNo || "").trim();
  const type = (payload.type || payload.typeContrat || payload.contractType || "").trim();
  const startDate = payload.startDate || payload.dateDebut || new Date().toISOString().split("T")[0];
  const endDate = payload.endDate || payload.dateFin || "2026-12-31";
  const premium = Number(payload.premium ?? payload.prime ?? 0);
  const coverageLimit = Number(payload.coverageLimit ?? payload.plafond ?? 0);
  const deductible = Number(payload.deductible ?? payload.franchise ?? 0);
  const status = payload.status || "Actif";

  // Nouveaux champs
  const guarantees = (payload.guarantees || "").trim();
  const obligations = (payload.obligations || "").trim();
  const exclusions = (payload.exclusions || "").trim();
  const limits = (payload.limits || "").trim();

  // Granular validation
  const errors: Record<string, string> = {};
  if (!insurer) {
    errors.insurer = "Le nom de l'assureur est requis";
  }
  if (!contractNumber) {
    errors.contractNumber = "Le numéro de contrat est requis";
  }
  if (!type) {
    errors.type = "Le type de contrat est requis";
  }

  if (Object.keys(errors).length > 0) {
    console.error("Erreur de validation lors de l'ajout d'un contrat :", errors);
    res.status(400).json({
      error: "Erreur de validation du contrat",
      fields: errors
    });
    return;
  }

  const newContract: Contract = {
    id: payload.id || `ctr-${Date.now()}`,
    insurer,
    contractNumber,
    type,
    startDate,
    endDate,
    premium,
    coverageLimit,
    deductible,
    status,
    createdAt: new Date().toISOString(),
    guarantees,
    obligations,
    exclusions,
    limits
  };

  console.log("Insertion du nouveau contrat :", newContract);
  dbContracts.push(newContract);
  console.log("Contrat inséré avec succès. Total contrats :", dbContracts.length);

  res.status(201).json(newContract);
});

app.delete("/api/contracts/:id", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  const { id } = req.params;
  console.log(`DELETE /api/contracts/${id}`);

  // Automatically dissociate any associated risks and claims so deletion never fails
  dbRisks = dbRisks.map(r => r.contractId === id ? { ...r, contractId: "" } : r);
  dbClaims = dbClaims.map(c => c.contractId === id ? { ...c, contractId: "" } : c);

  const initialCount = dbContracts.length;
  dbContracts = dbContracts.filter(c => c.id !== id);

  console.log(`Contrat ${id} supprimé. Contrats restants: ${dbContracts.length}`);
  res.json({ success: true, message: "Contrat supprimé avec succès." });
});

// ----------------------------------------------------
// RISKS API
// ----------------------------------------------------
app.get("/api/risks", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("GET /api/risks - Count:", dbRisks.length);
  res.json(dbRisks);
});

app.post("/api/risks", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("POST /api/risks - Payload reçu :", req.body);
  const payload = req.body || {};

  const contractId = (payload.contractId || "").trim();
  const title = (payload.title || "").trim();
  const description = (payload.description || "").trim();
  const family = (payload.family || "Général").trim();
  const isMandatory = Boolean(payload.isMandatory);
  const initialProbability = Number(payload.initialProbability || 2);
  const initialImpact = Number(payload.initialImpact || 2);

  // Nouveaux champs
  const causes = (payload.causes || "").trim();
  const consequences = (payload.consequences || "").trim();
  const department = (payload.department || "").trim();
  const responsible = (payload.responsible || "").trim();
  const identificationDate = payload.identificationDate || new Date().toISOString().split("T")[0];
  const status = payload.status || "Identifié";
  const existingMeasures = (payload.existingMeasures || "").trim();
  const comments = (payload.comments || "").trim();
  const treatment = payload.treatment || "À analyser";
  const coverageStatus = payload.coverageStatus || "À analyser";

  const errors: Record<string, string> = {};
  // contractId est maintenant optionnel - pas de validation obligatoire
  if (contractId) {
    const parentContract = dbContracts.find(c => c.id === contractId);
    if (!parentContract) {
      errors.contractId = `Le contrat avec l'ID '${contractId}' n'existe pas en base de données`;
    }
  }

  if (!title) {
    errors.title = "Le titre du risque est obligatoire";
  }
  if (!description) {
    errors.description = "La description du risque est obligatoire";
  }

  if (Object.keys(errors).length > 0) {
    console.error("Erreur de validation lors de l'ajout d'un risque :", errors);
    res.status(400).json({
      error: "Erreur de validation du risque",
      fields: errors
    });
    return;
  }

  const newRisk: Risk = {
    id: payload.id || `risk-${Date.now()}`,
    contractId: contractId || undefined,
    title,
    description,
    family,
    isMandatory,
    initialProbability,
    initialImpact,
    createdAt: new Date().toISOString(),
    causes,
    consequences,
    department,
    responsible,
    identificationDate,
    status,
    existingMeasures,
    comments,
    treatment,
    coverageStatus
  };

  console.log("Insertion du nouveau risque :", newRisk);
  dbRisks.push(newRisk);
  console.log("Risque inséré avec succès. Total risques :", dbRisks.length);

  res.status(201).json(newRisk);
});

app.delete("/api/risks/:id", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  const { id } = req.params;
  console.log(`DELETE /api/risks/${id}`);

  // Prevent orphan measures
  const associatedMeasures = dbMeasures.filter(m => m.riskId === id);
  if (associatedMeasures.length > 0) {
    res.status(400).json({
      error: `Impossible de supprimer ce risque : ${associatedMeasures.length} mesure(s) lui sont associées.`
    });
    return;
  }

  dbRisks = dbRisks.filter(r => r.id !== id);
  res.json({ success: true, message: "Risque supprimé avec succès." });
});

// ----------------------------------------------------
// MEASURES & EVALUATIONS API (Transaction Flow)
// ----------------------------------------------------
app.get("/api/measures", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("GET /api/measures - Count:", dbMeasures.length);
  res.json(dbMeasures);
});

app.post("/api/measures", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("POST /api/measures - Payload reçu :", req.body);
  const payload = req.body || {};

  const riskId = (payload.riskId || "").trim();
  const title = (payload.title || "").trim();
  const description = (payload.description || "").trim();
  const responsible = (payload.responsible || "").trim();
  const date = (payload.date || "").trim();
  const type = payload.type || "Préventive";
  const status = payload.status || "Planifiée";
  const priority = payload.priority || "Moyenne";
  const deadline = payload.deadline || "";
  const estimatedCost = payload.estimatedCost || "";
  const expectedEffectiveness = Number(payload.expectedEffectiveness ?? 80);
  const insurerMandatory = Boolean(payload.insurerMandatory);

  const evalData = payload.evaluation || {};
  const effectiveness = Number(evalData.effectiveness ?? payload.effectiveness ?? 50);
  const justification = (evalData.justification || payload.justification || "Évaluation standard d'efficacité").trim();
  const beforeProbability = Number(evalData.beforeProbability ?? payload.beforeProbability ?? 3);
  const beforeImpact = Number(evalData.beforeImpact ?? payload.beforeImpact ?? 3);
  const afterProbability = Number(evalData.afterProbability ?? payload.afterProbability ?? 2);
  const afterImpact = Number(evalData.afterImpact ?? payload.afterImpact ?? 2);

  // Requirement 3: Field validation with explicit per-field message
  const errors: Record<string, string> = {};

  if (!riskId) {
    errors.riskId = "L'association à un risque est obligatoire (riskId requis)";
  } else {
    const parentRisk = dbRisks.find(r => r.id === riskId);
    if (!parentRisk) {
      errors.riskId = `Le risque spécifié (ID: '${riskId}') n'existe pas en base.`;
    }
  }

  if (!title) {
    errors.title = "Le titre est obligatoire";
  }
  if (!description) {
    errors.description = "La description est obligatoire";
  }
  if (!responsible) {
    errors.responsible = "Le responsable est obligatoire";
  }
  if (!date) {
    errors.date = "La date est obligatoire";
  }

  if (isNaN(effectiveness) || effectiveness < 0 || effectiveness > 100) {
    errors.effectiveness = "L'efficacité doit être comprise entre 0 et 100";
  }

  if (Object.keys(errors).length > 0) {
    console.error("Erreur de validation lors de la création d'une mesure :", errors);
    res.status(400).json({
      error: "Erreur de validation de la mesure de gestion",
      fields: errors
    });
    return;
  }

  // Requirement 6: Measure + Evaluation created together in atomic transaction
  const measureId = payload.id || `meas-${Date.now()}`;
  const evaluationId = `eval-${Date.now()}`;

  const evaluationObj: EffectivenessEvaluation = {
    id: evaluationId,
    measureId: measureId,
    effectiveness,
    justification,
    beforeProbability,
    beforeImpact,
    afterProbability,
    afterImpact,
    createdAt: new Date().toISOString()
  };

  const measureObj: Measure = {
    id: measureId,
    riskId,
    title,
    description,
    responsible,
    date,
    type,
    status,
    priority,
    deadline,
    estimatedCost,
    expectedEffectiveness,
    insurerMandatory,
    evaluation: evaluationObj,
    createdAt: new Date().toISOString()
  };

  console.log("TENTATIVE D'INSERTION MESURE :", measureObj);
  console.log("TENTATIVE D'INSERTION EVALUATION :", evaluationObj);

  dbMeasures.push(measureObj);

  console.log("INSERTION MESURE & EVALUATION REUSSIE. Saved Object :", measureObj);

  res.status(201).json(measureObj);
});

app.delete("/api/measures/:id", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  const { id } = req.params;
  console.log(`DELETE /api/measures/${id}`);
  dbMeasures = dbMeasures.filter(m => m.id !== id);
  res.json({ success: true, message: "Mesure supprimée avec succès." });
});

// ----------------------------------------------------
// CLAIMS / SINISTRES API
// ----------------------------------------------------
app.get("/api/claims", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("GET /api/claims - Count:", dbClaims.length);
  res.json(dbClaims);
});

app.post("/api/claims", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("POST /api/claims - Payload reçu :", req.body);
  const payload = req.body || {};

  const contractId = (payload.contractId || "").trim();
  const claimNumber = (payload.claimNumber || `SIN-2026-${Math.floor(1000 + Math.random() * 9000)}`).trim();
  const title = (payload.title || "").trim();
  const dateOfLoss = payload.dateOfLoss || new Date().toISOString().split("T")[0];
  const estimatedCost = Number(payload.estimatedCost || 0);
  const paidAmount = Number(payload.paidAmount || 0);
  const status = payload.status || "Déclaré";
  const description = (payload.description || "").trim();

  const errors: Record<string, string> = {};
  if (!contractId) {
    errors.contractId = "Le contrat associé au sinistre est obligatoire";
  }
  if (!title) {
    errors.title = "Le titre du sinistre est obligatoire";
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ error: "Erreur de validation du sinistre", fields: errors });
    return;
  }

  const newClaim: Claim = {
    id: payload.id || `clm-${Date.now()}`,
    contractId,
    riskId: payload.riskId,
    claimNumber,
    title,
    dateOfLoss,
    estimatedCost,
    paidAmount,
    status,
    description,
    createdAt: new Date().toISOString()
  };

  dbClaims.push(newClaim);
  console.log("Sinistre enregistré :", newClaim);

  res.status(201).json(newClaim);
});

app.delete("/api/claims/:id", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  const { id } = req.params;
  dbClaims = dbClaims.filter(c => c.id !== id);
  res.json({ success: true, message: "Sinistre supprimé avec succès." });
});

// ----------------------------------------------------
// RESET / SEED DATA API
// ----------------------------------------------------
app.post("/api/reset", (req: Request, res: Response) => {
  if (!dbCurrentUser) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  if (!dbCompany) {
    res.status(404).json({ error: "Aucune entreprise sélectionnée" });
    return;
  }
  console.log("POST /api/reset - Reinitialisation des donnees de test...");
  dbCompany = { ...initialCompany };
  dbContracts = [...initialContracts];
  dbRisks = [...initialRisks];
  dbMeasures = [...initialMeasures];
  dbClaims = [...initialClaims];
  res.json({ message: "Données réinitialisées avec succès" });
});

// ----------------------------------------------------
// VITE & APP BOOTSTRAP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RiskInsure Server] Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer();
