import { planningRepository } from '@/lib/repositories/planning.repository';
import { PillarsDoc, ThemesDoc, TasksDoc } from '@/types/planning.types';

/**
 * Default pillars to seed for new users
 */
const DEFAULT_PILLARS: PillarsDoc = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Health',
    color: '#7C3AED',
    domain: 'personal',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Work',
    color: '#DC2626',
    domain: 'work',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Finance',
    color: '#16A34A',
    domain: 'personal',
    rating: 0,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Social',
    color: '#2563EB',
    domain: 'personal',
    rating: 0,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Family',
    color: '#F97316',
    domain: 'personal',
    rating: 0,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Default themes to seed for new users
 * Based on production data - 24 themes across 5 pillars
 */
const DEFAULT_THEMES: ThemesDoc = [
  // Health themes (5 themes)
  {
    id: '00000000-0000-0000-0001-000000000001',
    pillarId: '00000000-0000-0000-0000-000000000001',
    name: 'Body',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    pillarId: '00000000-0000-0000-0000-000000000001',
    name: 'Movement',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000003',
    pillarId: '00000000-0000-0000-0000-000000000001',
    name: 'Sleep',
    rating: 0,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000004',
    pillarId: '00000000-0000-0000-0000-000000000001',
    name: 'Diet',
    rating: 0,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000005',
    pillarId: '00000000-0000-0000-0000-000000000001',
    name: 'Mind',
    rating: 0,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Work themes (7 themes)
  {
    id: '00000000-0000-0000-0001-000000000006',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Stakeholder Management',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000007',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Delivery & Projects',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000008',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Craft & Learning',
    rating: 0,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000009',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Hiring & Mentoring',
    rating: 0,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000010',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Strategy & Planning',
    rating: 0,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000011',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Innovation & Experiments',
    rating: 0,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000012',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Operations & Admin',
    rating: 0,
    order: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Finance themes (5 themes)
  {
    id: '00000000-0000-0000-0001-000000000013',
    pillarId: '00000000-0000-0000-0000-000000000003',
    name: 'Investing',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000014',
    pillarId: '00000000-0000-0000-0000-000000000003',
    name: 'Debt Management',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000015',
    pillarId: '00000000-0000-0000-0000-000000000003',
    name: 'Taxes & Compliance',
    rating: 0,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000016',
    pillarId: '00000000-0000-0000-0000-000000000003',
    name: 'Budgeting',
    rating: 0,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000017',
    pillarId: '00000000-0000-0000-0000-000000000003',
    name: 'Savings',
    rating: 0,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Social themes (4 themes)
  {
    id: '00000000-0000-0000-0001-000000000018',
    pillarId: '00000000-0000-0000-0000-000000000004',
    name: 'Professional Network',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000019',
    pillarId: '00000000-0000-0000-0000-000000000004',
    name: 'Community',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000020',
    pillarId: '00000000-0000-0000-0000-000000000004',
    name: 'Close Friends',
    rating: 0,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000021',
    pillarId: '00000000-0000-0000-0000-000000000004',
    name: 'Volunteering',
    rating: 0,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Family themes (4 themes)
  {
    id: '00000000-0000-0000-0001-000000000022',
    pillarId: '00000000-0000-0000-0000-000000000005',
    name: 'Partner Relationship',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000023',
    pillarId: '00000000-0000-0000-0000-000000000005',
    name: 'Extended Family',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000024',
    pillarId: '00000000-0000-0000-0000-000000000005',
    name: 'Kids & Parenting',
    rating: 0,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000025',
    pillarId: '00000000-0000-0000-0000-000000000005',
    name: 'Home & Routines',
    rating: 0,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Initialize planning documents for a new user
 */
export async function initializePlanningDocs(userId: string): Promise<void> {
  console.log(`[initializePlanningDocs] Starting for user ${userId}`);

  // Check if already initialized
  const existingPillars = await planningRepository.getDoc(userId, 'pillars');
  if (existingPillars) {
    console.log(`[initializePlanningDocs] Planning docs already initialized for user ${userId}`);
    return;
  }

  console.log(`[initializePlanningDocs] Creating pillars doc with ${DEFAULT_PILLARS.length} pillars`);
  // Create pillars doc
  const pillarsDoc = await planningRepository.createDoc<PillarsDoc>(
    userId,
    'pillars',
    DEFAULT_PILLARS
  );
  console.log(`[initializePlanningDocs] Pillars doc created:`, pillarsDoc.id);

  console.log(`[initializePlanningDocs] Creating themes doc with ${DEFAULT_THEMES.length} themes`);
  // Create themes doc
  const themesDoc = await planningRepository.createDoc<ThemesDoc>(
    userId,
    'themes',
    DEFAULT_THEMES
  );
  console.log(`[initializePlanningDocs] Themes doc created:`, themesDoc.id);

  console.log(`[initializePlanningDocs] Creating empty tasks doc`);
  // Create empty tasks doc
  const tasksDoc = await planningRepository.createDoc<TasksDoc>(
    userId,
    'tasks',
    []
  );
  console.log(`[initializePlanningDocs] Tasks doc created:`, tasksDoc.id);

  console.log(`[initializePlanningDocs] ✅ All planning docs initialized for user ${userId}`);
}

/**
 * Check if planning docs are initialized for a user
 */
export async function arePlanningDocsInitialized(userId: string): Promise<boolean> {
  const pillarsDoc = await planningRepository.getDoc(userId, 'pillars');
  const themesDoc = await planningRepository.getDoc(userId, 'themes');
  const tasksDoc = await planningRepository.getDoc(userId, 'tasks');
  
  return !!(pillarsDoc && themesDoc && tasksDoc);
}

