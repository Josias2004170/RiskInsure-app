import { Contract, Risk, Measure, Claim, CompanyInfo, User } from "../types";

export interface ApiError {
  error: string;
  fields?: Record<string, string>;
}

// ----------------------------------------------------
// CONTRACTS API CLIENT
// ----------------------------------------------------
export async function fetchContracts(): Promise<Contract[]> {
  const res = await fetch("/api/contracts");
  if (!res.ok) throw new Error("Erreur de chargement des contrats");
  return res.json();
}

export async function createContract(payload: Partial<Contract>): Promise<Contract> {
  console.log("Payload envoyé (createContract) :", payload);
  const res = await fetch("/api/contracts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Erreur Backend createContract :", data);
    const err: ApiError = data;
    throw err;
  }

  console.log("Contrat créé retourné par l'API :", data);
  return data;
}

export async function deleteContract(id: string): Promise<void> {
  console.log("Deleting contract ID:", id);
  const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la suppression du contrat");
  }
}

// ----------------------------------------------------
// RISKS API CLIENT
// ----------------------------------------------------
export async function fetchRisks(): Promise<Risk[]> {
  const res = await fetch("/api/risks");
  if (!res.ok) throw new Error("Erreur de chargement des risques");
  return res.json();
}

export async function createRisk(payload: Partial<Risk>): Promise<Risk> {
  console.log("Payload envoyé (createRisk) :", payload);
  const res = await fetch("/api/risks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Erreur Backend createRisk :", data);
    const err: ApiError = data;
    throw err;
  }

  console.log("Risque créé retourné par l'API :", data);
  return data;
}

export async function deleteRisk(id: string): Promise<void> {
  const res = await fetch(`/api/risks/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la suppression du risque");
  }
}

// ----------------------------------------------------
// MEASURES API CLIENT
// ----------------------------------------------------
export async function fetchMeasures(): Promise<Measure[]> {
  const res = await fetch("/api/measures");
  if (!res.ok) throw new Error("Erreur de chargement des mesures");
  return res.json();
}

export async function createMeasure(payload: {
  riskId: string;
  title: string;
  description: string;
  responsible: string;
  date: string;
  type?: 'Préventive' | 'Protectrice' | 'Corrective' | 'Organisationnelle';
  status?: 'Planifiée' | 'En cours' | 'Mise en œuvre' | 'Suspendue';
  evaluation?: {
    effectiveness: number;
    justification: string;
    beforeProbability?: number;
    beforeImpact?: number;
    afterProbability?: number;
    afterImpact?: number;
  };
}): Promise<Measure> {
  // Requirement 9: console.log("Payload envoyé :", payload)
  console.log("Payload envoyé (createMeasure) :", payload);

  const res = await fetch("/api/measures", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Erreur Backend createMeasure :", data);
    const err: ApiError = data;
    throw err;
  }

  // Requirement 4: Retour de l'objet créé
  console.log("Mesure enregistrée retournée par l'API :", data);
  return data;
}

export async function deleteMeasure(id: string): Promise<void> {
  const res = await fetch(`/api/measures/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la suppression de la mesure");
  }
}

// ----------------------------------------------------
// CLAIMS / SINISTRES API CLIENT
// ----------------------------------------------------
export async function fetchClaims(): Promise<Claim[]> {
  const res = await fetch("/api/claims");
  if (!res.ok) throw new Error("Erreur de chargement des sinistres");
  return res.json();
}

export async function createClaim(payload: Partial<Claim>): Promise<Claim> {
  console.log("Payload envoyé (createClaim) :", payload);
  const res = await fetch("/api/claims", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    const err: ApiError = data;
    throw err;
  }
  return data;
}

export async function deleteClaim(id: string): Promise<void> {
  const res = await fetch(`/api/claims/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la suppression du sinistre");
  }
}

// ----------------------------------------------------
// COMPANY API CLIENT
// ----------------------------------------------------
export async function fetchCompany(): Promise<CompanyInfo> {
  const res = await fetch("/api/company");
  if (!res.ok) throw new Error("Erreur de chargement des données de l'entreprise");
  return res.json();
}

export async function fetchCompanies(): Promise<CompanyInfo[]> {
  const res = await fetch("/api/companies");
  if (!res.ok) throw new Error("Erreur de chargement de la liste des entreprises");
  return res.json();
}

export async function updateCompany(company: Partial<CompanyInfo>): Promise<CompanyInfo> {
  const res = await fetch("/api/company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company)
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour des paramètres de l'entreprise");
  return res.json();
}

export async function registerCompany(company: Partial<CompanyInfo>): Promise<{ company: CompanyInfo; companies: CompanyInfo[] }> {
  const res = await fetch("/api/company/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(company)
  });
  if (!res.ok) throw new Error("Erreur lors de l'enregistrement de l'entreprise");
  return res.json();
}

export async function switchCompany(name: string): Promise<{ company: CompanyInfo; companies: CompanyInfo[] }> {
  const res = await fetch("/api/company/switch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error("Erreur lors du changement d'entreprise");
  return res.json();
}

// ----------------------------------------------------
// RESET DATA CLIENT
// ----------------------------------------------------
export async function resetDatabase(): Promise<void> {
  const res = await fetch("/api/reset", { method: "POST" });
  if (!res.ok) throw new Error("Erreur lors de la réinitialisation de la base");
}

// ----------------------------------------------------
// AUTHENTICATION API CLIENT
// ----------------------------------------------------
export async function login(username: string, password: string): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erreur lors de la connexion");
  }
  return res.json();
}

export async function register(userData: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}): Promise<User> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Erreur lors de l'inscription");
  }
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  if (!res.ok) throw new Error("Erreur lors de la déconnexion");
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch("/api/auth/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
  return res.json();
}
