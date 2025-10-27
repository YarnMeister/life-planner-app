import { planningRepository } from '@/lib/repositories/planning.repository';
import { PillarsDoc, ThemesDoc, TasksDoc } from '@/types/planning.types';

/**
 * Default pillars to seed for new users
 */
const DEFAULT_PILLARS: PillarsDoc = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Health & Fitness',
    color: '#10B981',
    domain: 'personal',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Career & Finance',
    color: '#3B82F6',
    domain: 'work',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Relationships',
    color: '#EC4899',
    domain: 'personal',
    rating: 0,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Personal Growth',
    color: '#8B5CF6',
    domain: 'personal',
    rating: 0,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Default themes to seed for new users
 */
const DEFAULT_THEMES: ThemesDoc = [
  // Health & Fitness themes
  {
    id: '00000000-0000-0000-0001-000000000001',
    pillarId: '00000000-0000-0000-0000-000000000001',
    name: 'Exercise',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    pillarId: '00000000-0000-0000-0000-000000000001',
    name: 'Nutrition',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Career & Finance themes
  {
    id: '00000000-0000-0000-0001-000000000003',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Professional Development',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000004',
    pillarId: '00000000-0000-0000-0000-000000000002',
    name: 'Financial Planning',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Relationships themes
  {
    id: '00000000-0000-0000-0001-000000000005',
    pillarId: '00000000-0000-0000-0000-000000000003',
    name: 'Family',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000006',
    pillarId: '00000000-0000-0000-0000-000000000003',
    name: 'Friends',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Personal Growth themes
  {
    id: '00000000-0000-0000-0001-000000000007',
    pillarId: '00000000-0000-0000-0000-000000000004',
    name: 'Learning',
    rating: 0,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0001-000000000008',
    pillarId: '00000000-0000-0000-0000-000000000004',
    name: 'Hobbies',
    rating: 0,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Initialize planning documents for a new user
 */
export async function initializePlanningDocs(userId: string): Promise<void> {
  // Check if already initialized
  const existingPillars = await planningRepository.getDoc(userId, 'pillars');
  if (existingPillars) {
    console.log(`Planning docs already initialized for user ${userId}`);
    return;
  }

  // Create pillars doc
  await planningRepository.createDoc<PillarsDoc>(
    userId,
    'pillars',
    DEFAULT_PILLARS
  );

  // Create themes doc
  await planningRepository.createDoc<ThemesDoc>(
    userId,
    'themes',
    DEFAULT_THEMES
  );

  // Create empty tasks doc
  await planningRepository.createDoc<TasksDoc>(
    userId,
    'tasks',
    []
  );

  console.log(`Planning docs initialized for user ${userId}`);
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

