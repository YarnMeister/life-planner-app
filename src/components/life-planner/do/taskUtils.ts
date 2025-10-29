import type { Task, Pillar, Theme, Domain } from '@/types';

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

/**
 * Task prioritization comparator function
 *
 * Prioritization algorithm:
 * 1. Sort by theme rating (ascending - lowest rating = highest priority)
 * 2. Then by rank (ascending - lower rank = higher priority)
 * 3. Then by impact (H > M > L)
 *
 * @param a First task to compare
 * @param b Second task to compare
 * @param themeRatingMap Map of theme IDs to their ratings
 * @returns Negative if a < b, positive if a > b, 0 if equal
 */
export function compareTaskPriority(
  a: Task,
  b: Task,
  themeRatingMap: Map<string, number>
): number {
  // 1. Sort by theme rating (ascending - lowest first)
  const ratingA = themeRatingMap.get(a.themeId) ?? 100;
  const ratingB = themeRatingMap.get(b.themeId) ?? 100;

  if (ratingA !== ratingB) {
    return ratingA - ratingB;
  }

  // 2. Then by rank (ascending)
  const rankA = a.rank ?? 999;
  const rankB = b.rank ?? 999;

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  // 3. Then by impact (H > M > L)
  const impactOrder = { H: 1, M: 2, L: 3 };
  const impactA = impactOrder[a.impact ?? 'L'];
  const impactB = impactOrder[b.impact ?? 'L'];

  return impactA - impactB;
}

/**
 * Prioritize and filter tasks based on domain and status
 *
 * @param tasks All tasks
 * @param themes All themes (for rating lookup)
 * @param pillars All pillars (for domain lookup)
 * @param domainFilter Domain filter to apply ('all', 'work', or 'personal')
 * @returns Filtered and prioritized tasks
 */
export function prioritizeTasks(
  tasks: Task[],
  themes: Theme[],
  pillars: Pillar[],
  domainFilter: Domain
): Task[] {
  // Create lookup maps once before filtering/sorting (micro-optimization)
  const pillarDomainMap = new Map(pillars.map((p) => [p.id, p.domain]));
  const themeRatingMap = new Map(themes.map((t) => [t.id, t.rating]));

  // 1. Filter by domain
  let filtered = tasks.filter((task) => {
    if (domainFilter === 'all') return true;
    const domain = task.pillarId ? pillarDomainMap.get(task.pillarId) : undefined;
    return domain === domainFilter;
  });

  // 2. Filter out completed/archived tasks
  filtered = filtered.filter(
    (task) => task.status !== 'done' && task.status !== 'archived'
  );

  // 3. Sort by prioritization algorithm
  return filtered.sort((a, b) => compareTaskPriority(a, b, themeRatingMap));
}
