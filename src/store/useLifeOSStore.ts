import { create } from 'zustand';
import { Pillar, Theme, Task } from '@/types';

interface LifeOSState {
  pillars: Pillar[];
  themes: Theme[];
  tasks: Task[];
  selectedPillarId: string | null;
  selectedThemeIds: string[];
  selectedTaskId: string | null;
  
  // Pillar actions
  addPillar: (pillar: Omit<Pillar, 'id' | 'avgPercent'>) => void;
  updatePillar: (id: string, updates: Partial<Pillar>) => void;
  deletePillar: (id: string) => void;
  selectPillar: (id: string | null) => void;
  
  // Theme actions
  addTheme: (theme: Omit<Theme, 'id'>) => void;
  updateTheme: (id: string, updates: Partial<Theme>) => void;
  deleteTheme: (id: string) => void;
  toggleThemeSelection: (id: string) => void;
  selectSingleTheme: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  reorderTasks: (themeId: string, tasks: Task[]) => void;
  
  // Computed
  getThemesByPillar: (pillarId: string) => Theme[];
  getTasksByTheme: (themeId: string) => Task[];
  recalculatePillarAverage: (pillarId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Seed data
const initialPillars: Pillar[] = [
  { id: '1', name: 'Health', color: '#7C3AED', domain: 'personal', avgPercent: 0 },
  { id: '2', name: 'Finance', color: '#16A34A', domain: 'personal', avgPercent: 0 },
  { id: '3', name: 'Social', color: '#2563EB', domain: 'personal', avgPercent: 0 },
  { id: '4', name: 'Family', color: '#F97316', domain: 'personal', avgPercent: 0 },
  { id: '5', name: 'Work', color: '#DC2626', domain: 'work', avgPercent: 0 },
];

const initialThemes: Theme[] = [
  // Health
  { id: 'h1', pillarId: '1', name: 'Body', ratingPercent: 50 },
  { id: 'h2', pillarId: '1', name: 'Mind', ratingPercent: 50 },
  { id: 'h3', pillarId: '1', name: 'Diet', ratingPercent: 50 },
  { id: 'h4', pillarId: '1', name: 'Sleep', ratingPercent: 50 },
  { id: 'h5', pillarId: '1', name: 'Movement', ratingPercent: 50 },
  
  // Finance
  { id: 'f1', pillarId: '2', name: 'Budgeting', ratingPercent: 50 },
  { id: 'f2', pillarId: '2', name: 'Savings', ratingPercent: 50 },
  { id: 'f3', pillarId: '2', name: 'Investing', ratingPercent: 50 },
  { id: 'f4', pillarId: '2', name: 'Debt Management', ratingPercent: 50 },
  { id: 'f5', pillarId: '2', name: 'Taxes & Compliance', ratingPercent: 50 },
  
  // Social
  { id: 's1', pillarId: '3', name: 'Close Friends', ratingPercent: 50 },
  { id: 's2', pillarId: '3', name: 'Community', ratingPercent: 50 },
  { id: 's3', pillarId: '3', name: 'Professional Network', ratingPercent: 50 },
  { id: 's4', pillarId: '3', name: 'Volunteering', ratingPercent: 50 },
  
  // Family
  { id: 'fa1', pillarId: '4', name: 'Partner Relationship', ratingPercent: 50 },
  { id: 'fa2', pillarId: '4', name: 'Kids & Parenting', ratingPercent: 50 },
  { id: 'fa3', pillarId: '4', name: 'Home & Routines', ratingPercent: 50 },
  { id: 'fa4', pillarId: '4', name: 'Extended Family', ratingPercent: 50 },
  
  // Work
  { id: 'w1', pillarId: '5', name: 'Strategy & Planning', ratingPercent: 50 },
  { id: 'w2', pillarId: '5', name: 'Delivery & Projects', ratingPercent: 50 },
  { id: 'w3', pillarId: '5', name: 'Stakeholder Management', ratingPercent: 50 },
  { id: 'w4', pillarId: '5', name: 'Craft & Learning', ratingPercent: 50 },
  { id: 'w5', pillarId: '5', name: 'Hiring & Mentoring', ratingPercent: 50 },
  { id: 'w6', pillarId: '5', name: 'Operations & Admin', ratingPercent: 50 },
  { id: 'w7', pillarId: '5', name: 'Innovation & Experiments', ratingPercent: 50 },
];

const initialTasks: Task[] = [
  // Health - Body (1 task)
  { id: 't1', title: 'Complete gym workout routine', pillarId: '1', themeId: 'h1', timeEstimate: '1h', impact: 'H', status: 'open', rank: 0 },
  
  // Health - Mind (3 tasks)
  { id: 't2', title: 'Practice daily meditation', pillarId: '1', themeId: 'h2', timeEstimate: '15m', impact: 'H', status: 'open', rank: 0 },
  { id: 't3', title: 'Read mental health book chapter', pillarId: '1', themeId: 'h2', timeEstimate: '30m', impact: 'M', status: 'done', rank: 1 },
  { id: 't4', title: 'Journal about daily experiences', pillarId: '1', themeId: 'h2', timeEstimate: '15m', impact: 'M', status: 'open', rank: 2 },
  
  // Health - Diet (1 task)
  { id: 't5', title: 'Meal prep for the week', pillarId: '1', themeId: 'h3', timeEstimate: '2h+', impact: 'H', status: 'open', rank: 0 },
  
  // Health - Sleep (3 tasks)
  { id: 't6', title: 'Set consistent bedtime routine', pillarId: '1', themeId: 'h4', timeEstimate: '30m', impact: 'H', status: 'open', rank: 0 },
  { id: 't7', title: 'Reduce screen time before bed', pillarId: '1', themeId: 'h4', timeEstimate: '15m', impact: 'M', status: 'open', rank: 1 },
  { id: 't8', title: 'Track sleep quality', pillarId: '1', themeId: 'h4', timeEstimate: '15m', impact: 'L', status: 'done', rank: 2 },
  
  // Health - Movement (5 tasks)
  { id: 't9', title: 'Morning stretching routine', pillarId: '1', themeId: 'h5', timeEstimate: '15m', impact: 'M', status: 'open', rank: 0 },
  { id: 't10', title: 'Walk 10,000 steps daily', pillarId: '1', themeId: 'h5', timeEstimate: '1h', impact: 'H', status: 'open', rank: 1 },
  { id: 't11', title: 'Try new yoga class', pillarId: '1', themeId: 'h5', timeEstimate: '1h', impact: 'M', status: 'open', rank: 2 },
  { id: 't12', title: 'Research posture exercises', pillarId: '1', themeId: 'h5', timeEstimate: '30m', impact: 'L', status: 'done', rank: 3 },
  { id: 't13', title: 'Join walking group', pillarId: '1', themeId: 'h5', timeEstimate: '30m', impact: 'M', status: 'open', rank: 4 },
  
  // Finance - Budgeting (3 tasks)
  { id: 't14', title: 'Review monthly expenses', pillarId: '2', themeId: 'f1', timeEstimate: '1h', impact: 'H', status: 'open', rank: 0 },
  { id: 't15', title: 'Update budget spreadsheet', pillarId: '2', themeId: 'f1', timeEstimate: '30m', impact: 'M', status: 'open', rank: 1 },
  { id: 't16', title: 'Cancel unused subscriptions', pillarId: '2', themeId: 'f1', timeEstimate: '30m', impact: 'H', status: 'done', rank: 2 },
  
  // Finance - Savings (1 task)
  { id: 't17', title: 'Set up automatic savings transfer', pillarId: '2', themeId: 'f2', timeEstimate: '15m', impact: 'H', status: 'open', rank: 0 },
  
  // Finance - Investing (5 tasks)
  { id: 't18', title: 'Research index funds', pillarId: '2', themeId: 'f3', timeEstimate: '2h+', impact: 'H', status: 'open', rank: 0 },
  { id: 't19', title: 'Review investment portfolio', pillarId: '2', themeId: 'f3', timeEstimate: '1h', impact: 'H', status: 'open', rank: 1 },
  { id: 't20', title: 'Rebalance asset allocation', pillarId: '2', themeId: 'f3', timeEstimate: '1h', impact: 'M', status: 'open', rank: 2 },
  { id: 't21', title: 'Read investment book', pillarId: '2', themeId: 'f3', timeEstimate: '2h+', impact: 'M', status: 'done', rank: 3 },
  { id: 't22', title: 'Calculate retirement needs', pillarId: '2', themeId: 'f3', timeEstimate: '1h', impact: 'H', status: 'open', rank: 4 },
  
  // Finance - Debt Management (1 task)
  { id: 't23', title: 'Create debt payoff plan', pillarId: '2', themeId: 'f4', timeEstimate: '1h', impact: 'H', status: 'open', rank: 0 },
  
  // Finance - Taxes & Compliance (3 tasks)
  { id: 't24', title: 'Organize tax documents', pillarId: '2', themeId: 'f5', timeEstimate: '1h', impact: 'H', status: 'open', rank: 0 },
  { id: 't25', title: 'Schedule accountant meeting', pillarId: '2', themeId: 'f5', timeEstimate: '15m', impact: 'M', status: 'open', rank: 1 },
  { id: 't26', title: 'Review tax deductions', pillarId: '2', themeId: 'f5', timeEstimate: '30m', impact: 'M', status: 'done', rank: 2 },
  
  // Social - Close Friends (3 tasks)
  { id: 't27', title: 'Plan dinner with best friend', pillarId: '3', themeId: 's1', timeEstimate: '15m', impact: 'H', status: 'open', rank: 0 },
  { id: 't28', title: 'Call old college friend', pillarId: '3', themeId: 's1', timeEstimate: '30m', impact: 'M', status: 'open', rank: 1 },
  { id: 't29', title: 'Organize game night', pillarId: '3', themeId: 's1', timeEstimate: '1h', impact: 'M', status: 'done', rank: 2 },
  
  // Social - Community (1 task)
  { id: 't30', title: 'Attend local meetup event', pillarId: '3', themeId: 's2', timeEstimate: '2h+', impact: 'M', status: 'open', rank: 0 },
  
  // Social - Professional Network (5 tasks)
  { id: 't31', title: 'Update LinkedIn profile', pillarId: '3', themeId: 's3', timeEstimate: '30m', impact: 'M', status: 'open', rank: 0 },
  { id: 't32', title: 'Reach out to former colleague', pillarId: '3', themeId: 's3', timeEstimate: '15m', impact: 'M', status: 'open', rank: 1 },
  { id: 't33', title: 'Attend industry conference', pillarId: '3', themeId: 's3', timeEstimate: '2h+', impact: 'H', status: 'open', rank: 2 },
  { id: 't34', title: 'Join professional Slack group', pillarId: '3', themeId: 's3', timeEstimate: '15m', impact: 'L', status: 'done', rank: 3 },
  { id: 't35', title: 'Schedule coffee chat with mentor', pillarId: '3', themeId: 's3', timeEstimate: '1h', impact: 'H', status: 'open', rank: 4 },
  
  // Social - Volunteering (1 task)
  { id: 't36', title: 'Research volunteer opportunities', pillarId: '3', themeId: 's4', timeEstimate: '30m', impact: 'M', status: 'open', rank: 0 },
  
  // Family - Partner Relationship (3 tasks)
  { id: 't37', title: 'Plan date night', pillarId: '4', themeId: 'fa1', timeEstimate: '30m', impact: 'H', status: 'open', rank: 0 },
  { id: 't38', title: 'Weekly check-in conversation', pillarId: '4', themeId: 'fa1', timeEstimate: '30m', impact: 'H', status: 'open', rank: 1 },
  { id: 't39', title: 'Book couples weekend getaway', pillarId: '4', themeId: 'fa1', timeEstimate: '1h', impact: 'M', status: 'done', rank: 2 },
  
  // Family - Kids & Parenting (5 tasks)
  { id: 't40', title: 'Help with homework', pillarId: '4', themeId: 'fa2', timeEstimate: '1h', impact: 'H', status: 'open', rank: 0 },
  { id: 't41', title: 'Plan family movie night', pillarId: '4', themeId: 'fa2', timeEstimate: '15m', impact: 'M', status: 'open', rank: 1 },
  { id: 't42', title: 'Attend school parent meeting', pillarId: '4', themeId: 'fa2', timeEstimate: '1h', impact: 'H', status: 'open', rank: 2 },
  { id: 't43', title: 'Research parenting book', pillarId: '4', themeId: 'fa2', timeEstimate: '30m', impact: 'L', status: 'done', rank: 3 },
  { id: 't44', title: 'Schedule pediatrician appointment', pillarId: '4', themeId: 'fa2', timeEstimate: '15m', impact: 'H', status: 'open', rank: 4 },
  
  // Family - Home & Routines (1 task)
  { id: 't45', title: 'Create weekly meal plan', pillarId: '4', themeId: 'fa3', timeEstimate: '30m', impact: 'M', status: 'open', rank: 0 },
  
  // Family - Extended Family (3 tasks)
  { id: 't46', title: 'Call parents', pillarId: '4', themeId: 'fa4', timeEstimate: '30m', impact: 'M', status: 'open', rank: 0 },
  { id: 't47', title: 'Plan family reunion', pillarId: '4', themeId: 'fa4', timeEstimate: '2h+', impact: 'H', status: 'open', rank: 1 },
  { id: 't48', title: 'Send birthday card to aunt', pillarId: '4', themeId: 'fa4', timeEstimate: '15m', impact: 'L', status: 'done', rank: 2 },
  
  // Work - Strategy & Planning (5 tasks)
  { id: 't49', title: 'Define Q1 OKRs', pillarId: '5', themeId: 'w1', timeEstimate: '2h+', impact: 'H', status: 'open', rank: 0 },
  { id: 't50', title: 'Review team roadmap', pillarId: '5', themeId: 'w1', timeEstimate: '1h', impact: 'H', status: 'open', rank: 1 },
  { id: 't51', title: 'Competitive analysis research', pillarId: '5', themeId: 'w1', timeEstimate: '2h+', impact: 'M', status: 'open', rank: 2 },
  { id: 't52', title: 'Update product strategy doc', pillarId: '5', themeId: 'w1', timeEstimate: '1h', impact: 'H', status: 'done', rank: 3 },
  { id: 't53', title: 'Present vision to leadership', pillarId: '5', themeId: 'w1', timeEstimate: '1h', impact: 'H', status: 'open', rank: 4 },
  
  // Work - Delivery & Projects (3 tasks)
  { id: 't54', title: 'Complete feature implementation', pillarId: '5', themeId: 'w2', timeEstimate: '2h+', impact: 'H', status: 'open', rank: 0 },
  { id: 't55', title: 'Code review for team PR', pillarId: '5', themeId: 'w2', timeEstimate: '30m', impact: 'M', status: 'open', rank: 1 },
  { id: 't56', title: 'Deploy to production', pillarId: '5', themeId: 'w2', timeEstimate: '1h', impact: 'H', status: 'done', rank: 2 },
  
  // Work - Stakeholder Management (1 task)
  { id: 't57', title: 'Prepare executive update', pillarId: '5', themeId: 'w3', timeEstimate: '1h', impact: 'H', status: 'open', rank: 0 },
  
  // Work - Craft & Learning (7 tasks)
  { id: 't58', title: 'Read technical blog posts', pillarId: '5', themeId: 'w4', timeEstimate: '1h', impact: 'M', status: 'open', rank: 0 },
  { id: 't59', title: 'Complete online course module', pillarId: '5', themeId: 'w4', timeEstimate: '2h+', impact: 'H', status: 'open', rank: 1 },
  { id: 't60', title: 'Practice new framework', pillarId: '5', themeId: 'w4', timeEstimate: '2h+', impact: 'M', status: 'open', rank: 2 },
  { id: 't61', title: 'Watch conference talk', pillarId: '5', themeId: 'w4', timeEstimate: '1h', impact: 'L', status: 'done', rank: 3 },
  { id: 't62', title: 'Write technical blog post', pillarId: '5', themeId: 'w4', timeEstimate: '2h+', impact: 'M', status: 'open', rank: 4 },
  { id: 't63', title: 'Attend tech meetup', pillarId: '5', themeId: 'w4', timeEstimate: '2h+', impact: 'M', status: 'open', rank: 5 },
  { id: 't64', title: 'Experiment with new tool', pillarId: '5', themeId: 'w4', timeEstimate: '1h', impact: 'L', status: 'open', rank: 6 },
  
  // Work - Hiring & Mentoring (3 tasks)
  { id: 't65', title: 'Review candidate resumes', pillarId: '5', themeId: 'w5', timeEstimate: '1h', impact: 'H', status: 'open', rank: 0 },
  { id: 't66', title: 'Conduct technical interview', pillarId: '5', themeId: 'w5', timeEstimate: '1h', impact: 'H', status: 'open', rank: 1 },
  { id: 't67', title: 'Weekly 1-on-1 with mentee', pillarId: '5', themeId: 'w5', timeEstimate: '30m', impact: 'M', status: 'done', rank: 2 },
  
  // Work - Operations & Admin (1 task)
  { id: 't68', title: 'Submit expense reports', pillarId: '5', themeId: 'w6', timeEstimate: '30m', impact: 'L', status: 'open', rank: 0 },
  
  // Work - Innovation & Experiments (5 tasks)
  { id: 't69', title: 'Prototype new feature idea', pillarId: '5', themeId: 'w7', timeEstimate: '2h+', impact: 'M', status: 'open', rank: 0 },
  { id: 't70', title: 'Research emerging technologies', pillarId: '5', themeId: 'w7', timeEstimate: '2h+', impact: 'M', status: 'open', rank: 1 },
  { id: 't71', title: 'Run A/B test analysis', pillarId: '5', themeId: 'w7', timeEstimate: '1h', impact: 'H', status: 'open', rank: 2 },
  { id: 't72', title: 'Brainstorm innovation ideas', pillarId: '5', themeId: 'w7', timeEstimate: '1h', impact: 'L', status: 'done', rank: 3 },
  { id: 't73', title: 'Present hackathon project', pillarId: '5', themeId: 'w7', timeEstimate: '30m', impact: 'M', status: 'open', rank: 4 },
];

export const useLifeOSStore = create<LifeOSState>((set, get) => ({
  pillars: initialPillars,
  themes: initialThemes,
  tasks: initialTasks,
  selectedPillarId: null,
  selectedThemeIds: [],
  selectedTaskId: null,
  
  addPillar: (pillar) => {
    const newPillar = { ...pillar, id: generateId(), avgPercent: 0 };
    set((state) => ({ pillars: [...state.pillars, newPillar] }));
  },
  
  updatePillar: (id, updates) => {
    set((state) => ({
      pillars: state.pillars.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },
  
  deletePillar: (id) => {
    set((state) => ({
      pillars: state.pillars.filter((p) => p.id !== id),
      themes: state.themes.filter((t) => t.pillarId !== id),
      tasks: state.tasks.filter((t) => t.pillarId !== id),
      selectedPillarId: state.selectedPillarId === id ? null : state.selectedPillarId,
    }));
  },
  
  selectPillar: (id) => set({ selectedPillarId: id, selectedThemeIds: [] }),
  
  toggleThemeSelection: (id) => {
    set((state) => ({
      selectedThemeIds: state.selectedThemeIds.includes(id)
        ? state.selectedThemeIds.filter((themeId) => themeId !== id)
        : [...state.selectedThemeIds, id],
    }));
  },
  
  selectSingleTheme: (id) => {
    set({ selectedThemeIds: [id] });
  },
  
  addTheme: (theme) => {
    const newTheme = { ...theme, id: generateId() };
    set((state) => ({ themes: [...state.themes, newTheme] }));
    get().recalculatePillarAverage(theme.pillarId);
  },
  
  updateTheme: (id, updates) => {
    const theme = get().themes.find((t) => t.id === id);
    set((state) => ({
      themes: state.themes.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    if (theme) {
      get().recalculatePillarAverage(theme.pillarId);
    }
  },
  
  deleteTheme: (id) => {
    const theme = get().themes.find((t) => t.id === id);
    set((state) => ({
      themes: state.themes.filter((t) => t.id !== id),
      tasks: state.tasks.filter((t) => t.themeId !== id),
    }));
    if (theme) {
      get().recalculatePillarAverage(theme.pillarId);
    }
  },
  
  addTask: (task) => {
    const newTask = { ...task, id: generateId() };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    }));
  },
  
  selectTask: (id) => set({ selectedTaskId: id }),
  
  reorderTasks: (themeId, tasks) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.themeId === themeId) {
          const reordered = tasks.find((rt) => rt.id === t.id);
          return reordered || t;
        }
        return t;
      }),
    }));
  },
  
  getThemesByPillar: (pillarId) => {
    return get().themes.filter((t) => t.pillarId === pillarId);
  },
  
  getTasksByTheme: (themeId) => {
    return get().tasks.filter((t) => t.themeId === themeId).sort((a, b) => a.rank - b.rank);
  },
  
  recalculatePillarAverage: (pillarId) => {
    const themes = get().themes.filter((t) => t.pillarId === pillarId);
    const avg = themes.length > 0
      ? themes.reduce((sum, t) => sum + t.ratingPercent, 0) / themes.length
      : 0;
    
    set((state) => ({
      pillars: state.pillars.map((p) =>
        p.id === pillarId ? { ...p, avgPercent: Math.round(avg) } : p
      ),
    }));
  },
}));
