export const initialCompanies = [
  {
    id: 'cmp-1',
    name: 'DTC Skincare',
    logoUrl: 'https://placehold.co/96x96/0a0a0e/C5FF38?text=DS',
    industry: 'E-commerce',
    website: 'https://example.com',
    isActive: true,
  },
  {
    id: 'cmp-2',
    name: 'SaaS Productivity App',
    logoUrl: 'https://placehold.co/96x96/0a0a0e/C5FF38?text=SA',
    industry: 'SaaS',
    website: 'https://example.com',
    isActive: true,
  },
];

export const initialCaseStudies = [
  {
    id: 'cs-1',
    companyId: 'cmp-1',
    companyName: 'DTC Skincare',
    name: 'Q4 Paid Social Scale',
    logoUrl: 'https://placehold.co/96x96/0a0a0e/C5FF38?text=DS',
    result: '+328% ROAS in 4 months',
    summary: 'Creative refresh + paid social scaling with weekly experimentation loops.',
    services: ['Social Media Advertising', 'Motion Design'],
    status: 'published',
  },
  {
    id: 'cs-2',
    companyId: 'cmp-2',
    companyName: 'SaaS Productivity App',
    name: 'Demand Gen Pipeline',
    logoUrl: 'https://placehold.co/96x96/0a0a0e/C5FF38?text=SA',
    result: '+210% qualified signups',
    summary: 'Motion-first ad framework paired with conversion-focused landing page updates.',
    services: ['Social Media Design', 'Consulting'],
    status: 'published',
  },
];
