import { describe, it, expect, beforeEach, vi } from 'vitest';
import { pillarsServiceV2 } from './pillars.service.v2';
import { planningRepository } from '../repositories/planning.repository';
import type { PillarsDoc } from '@/types/planning.types';

// Mock the repository
vi.mock('../repositories/planning.repository', () => ({
  planningRepository: {
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    patchDoc: vi.fn(),
  },
}));

// Mock the JSON patch utils
vi.mock('../utils/json-patch.utils', () => ({
  findItemIndex: vi.fn((items: any[], id: string) => {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    return index;
  }),
  createAddItemPatch: vi.fn((item: any) => [{ op: 'add', path: '/-', value: item }]),
  createUpdateItemPatch: vi.fn((index: number, updates: any) => [
    { op: 'replace', path: `/${index}`, value: updates },
  ]),
  createRemoveItemPatch: vi.fn((index: number) => [{ op: 'remove', path: `/${index}` }]),
}));

describe('PillarsServiceV2', () => {
  const userId = 'test-user-123';
  const mockPillarsDoc: PillarsDoc = [
    {
      id: 'pillar-1',
      name: 'Health',
      color: '#7C3AED',
      domain: 'personal',
      rating: 75,
      order: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'pillar-2',
      name: 'Work',
      color: '#DC2626',
      domain: 'work',
      rating: 60,
      order: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPillars', () => {
    it('should return all pillars for a user', async () => {
      vi.mocked(planningRepository.getDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: mockPillarsDoc,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await pillarsServiceV2.getPillars(userId);

      expect(result).toEqual(mockPillarsDoc);
      expect(planningRepository.getDoc).toHaveBeenCalledWith(userId, 'pillars');
    });

    it('should return empty array if no pillars doc exists', async () => {
      vi.mocked(planningRepository.getDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: [],
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await pillarsServiceV2.getPillars(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getPillar', () => {
    it('should return a specific pillar by id', async () => {
      vi.mocked(planningRepository.getDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: mockPillarsDoc,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await pillarsServiceV2.getPillar('pillar-1', userId);

      expect(result).toEqual(mockPillarsDoc[0]);
    });

    it('should throw error if pillar not found', async () => {
      vi.mocked(planningRepository.getDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: mockPillarsDoc,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(pillarsServiceV2.getPillar('non-existent', userId)).rejects.toThrow(
        'Pillar not found'
      );
    });
  });

  describe('createPillar', () => {
    it('should create a new pillar', async () => {
      const newPillar = {
        name: 'Finance',
        color: '#16A34A',
        domain: 'personal' as const,
      };

      vi.mocked(planningRepository.getDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: mockPillarsDoc,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(planningRepository.patchDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: [
          ...mockPillarsDoc,
          {
            ...newPillar,
            id: expect.any(String),
            rating: 0,
            order: 2,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
        version: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await pillarsServiceV2.createPillar(newPillar, userId);

      expect(result.name).toBe('Finance');
      expect(result.color).toBe('#16A34A');
      expect(result.domain).toBe('personal');
      expect(result.rating).toBe(0);
      expect(result.id).toBeDefined();
      expect(planningRepository.patchDoc).toHaveBeenCalled();
    });
  });

  describe('updatePillar', () => {
    it('should update an existing pillar', async () => {
      const updates = { name: 'Health & Wellness', rating: 80 };

      vi.mocked(planningRepository.getDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: mockPillarsDoc,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(planningRepository.updateDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: [
          { ...mockPillarsDoc[0], ...updates, updatedAt: new Date().toISOString() },
          mockPillarsDoc[1],
        ],
        version: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await pillarsServiceV2.updatePillar('pillar-1', updates, userId);

      expect(result.name).toBe('Health & Wellness');
      expect(result.rating).toBe(80);
    });

    it('should throw error if pillar not found', async () => {
      vi.mocked(planningRepository.getDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: mockPillarsDoc,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        pillarsServiceV2.updatePillar('non-existent', { name: 'Test' }, userId)
      ).rejects.toThrow('Item with id non-existent not found');
    });
  });

  describe('deletePillar', () => {
    it('should delete a pillar', async () => {
      // Mock themes check first - no themes for this pillar
      vi.mocked(planningRepository.getDoc)
        .mockResolvedValueOnce({
          id: 'doc-2',
          userId,
          kind: 'themes',
          data: [],
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: 'doc-1',
          userId,
          kind: 'pillars',
          data: mockPillarsDoc,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      vi.mocked(planningRepository.patchDoc).mockResolvedValue({
        id: 'doc-1',
        userId,
        kind: 'pillars',
        data: [mockPillarsDoc[1]],
        version: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await pillarsServiceV2.deletePillar('pillar-1', userId);

      expect(planningRepository.patchDoc).toHaveBeenCalled();
    });

    it('should throw error if pillar not found', async () => {
      vi.mocked(planningRepository.getDoc)
        .mockResolvedValueOnce({
          id: 'doc-2',
          userId,
          kind: 'themes',
          data: [],
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: 'doc-1',
          userId,
          kind: 'pillars',
          data: mockPillarsDoc,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      await expect(pillarsServiceV2.deletePillar('non-existent', userId)).rejects.toThrow(
        'Item with id non-existent not found'
      );
    });

    it('should prevent deletion if pillar has themes (cascade prevention)', async () => {
      vi.mocked(planningRepository.getDoc).mockResolvedValueOnce({
        id: 'doc-2',
        userId,
        kind: 'themes',
        data: [
          {
            id: 'theme-1',
            pillarId: 'pillar-1',
            name: 'Fitness',
            rating: 70,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(pillarsServiceV2.deletePillar('pillar-1', userId)).rejects.toThrow(
        'Cannot delete pillar with existing themes'
      );
    });
  });
});

