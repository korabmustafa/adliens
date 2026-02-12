import { initialCaseStudies, initialCompanies } from './data';

const DB_KEY = 'adliens-admin-db-v1';

function readDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const seed = { companies: initialCompanies, caseStudies: initialCaseStudies };
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return seed;
}

function writeDb(next) {
  localStorage.setItem(DB_KEY, JSON.stringify(next));
}

function delay(data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), 180));
}

export async function mockLogin({ email, password }) {
  if (!email || !password) throw new Error('Missing credentials');
  return delay({ token: 'mock-admin-token', user: { email, role: 'admin' } });
}

export async function listCompanies() {
  return delay(readDb().companies);
}

export async function createCompany(payload) {
  const db = readDb();
  const item = { id: `cmp-${Date.now()}`, ...payload };
  db.companies = [item, ...db.companies];
  writeDb(db);
  return delay(item);
}

export async function updateCompany(id, payload) {
  const db = readDb();
  db.companies = db.companies.map((c) => (c.id === id ? { ...c, ...payload } : c));
  writeDb(db);
  return delay(db.companies.find((c) => c.id === id));
}

export async function deleteCompany(id) {
  const db = readDb();
  db.companies = db.companies.filter((c) => c.id !== id);
  db.caseStudies = db.caseStudies.filter((cs) => cs.companyId !== id);
  writeDb(db);
  return delay({ success: true });
}

export async function listCaseStudies({ publishedOnly = false } = {}) {
  const db = readDb();
  const entries = publishedOnly
    ? db.caseStudies.filter((item) => item.status === 'published')
    : db.caseStudies;
  return delay(entries);
}

export async function createCaseStudy(payload) {
  const db = readDb();
  const company = db.companies.find((c) => c.id === payload.companyId);
  const item = {
    id: `cs-${Date.now()}`,
    ...payload,
    companyName: company?.name || payload.companyName || 'Unknown company',
    logoUrl: payload.logoUrl || company?.logoUrl || '',
  };
  db.caseStudies = [item, ...db.caseStudies];
  writeDb(db);
  return delay(item);
}

export async function updateCaseStudy(id, payload) {
  const db = readDb();
  db.caseStudies = db.caseStudies.map((cs) => {
    if (cs.id !== id) return cs;
    const company = db.companies.find((c) => c.id === payload.companyId);
    return {
      ...cs,
      ...payload,
      companyName: company?.name || cs.companyName,
      logoUrl: payload.logoUrl || company?.logoUrl || cs.logoUrl,
    };
  });
  writeDb(db);
  return delay(db.caseStudies.find((cs) => cs.id === id));
}

export async function deleteCaseStudy(id) {
  const db = readDb();
  db.caseStudies = db.caseStudies.filter((cs) => cs.id !== id);
  writeDb(db);
  return delay({ success: true });
}
