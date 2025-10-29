import type { Task, Pillar, Domain } from '@/types';

/**
 * Compute task counts by domain (all, work, personal)
 * Excludes completed and archived tasks
 */
export function computeTaskCounts(
  tasks: Task[],
  pillars: Pillar[]
): Record<Domain, number> {
  const counts: Record<Domain, number> = { all: 0, work: 0, personal: 0 };
  
  // Create pillar domain lookup map for O(1) access
  const pillarDomainMap = new Map<string, 'work' | 'personal'>();
  pillars.forEach((pillar) => {
    pillarDomainMap.set(pillar.id, pillar.domain);
  });

  tasks.forEach((task) => {
    if (task.status === 'done' || task.status === 'archived') return;
    
    counts.all++;
    const domain = task.pillarId ? pillarDomainMap.get(task.pillarId) : undefined;
    if (domain === 'work') counts.work++;
    if (domain === 'personal') counts.personal++;
  });

  return counts;
}

