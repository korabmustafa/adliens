import { apiRequest } from './client';
import {
  createCaseStudy as mockCreateCaseStudy,
  createCompany as mockCreateCompany,
  deleteCaseStudy as mockDeleteCaseStudy,
  deleteCompany as mockDeleteCompany,
  listCaseStudies as mockListCaseStudies,
  listCompanies as mockListCompanies,
  mockLogin,
  updateCaseStudy as mockUpdateCaseStudy,
  updateCompany as mockUpdateCompany,
} from '../mock/adminStore';

const useMock = () => import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export function createLead(payload) {
  return apiRequest('/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginAdmin(payload) {
  if (useMock()) return mockLogin(payload);
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCompanies() {
  if (useMock()) return mockListCompanies();
  return apiRequest('/admin/companies');
}

export function createCompany(payload) {
  if (useMock()) return mockCreateCompany(payload);
  return apiRequest('/admin/companies', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCompany(id, payload) {
  if (useMock()) return mockUpdateCompany(id, payload);
  return apiRequest(`/admin/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteCompany(id) {
  if (useMock()) return mockDeleteCompany(id);
  return apiRequest(`/admin/companies/${id}`, { method: 'DELETE' });
}

export function getCaseStudies({ publishedOnly = false } = {}) {
  if (useMock()) return mockListCaseStudies({ publishedOnly });
  const path = publishedOnly ? '/case-studies?status=published' : '/admin/case-studies';
  return apiRequest(path);
}

export function createCaseStudy(payload) {
  if (useMock()) return mockCreateCaseStudy(payload);
  return apiRequest('/admin/case-studies', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCaseStudy(id, payload) {
  if (useMock()) return mockUpdateCaseStudy(id, payload);
  return apiRequest(`/admin/case-studies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteCaseStudy(id) {
  if (useMock()) return mockDeleteCaseStudy(id);
  return apiRequest(`/admin/case-studies/${id}`, { method: 'DELETE' });
}
