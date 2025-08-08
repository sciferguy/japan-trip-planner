// Core types for the planner app
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyMessage {
  id: string;
  message: string;
  mascot: 'cat' | 'bunny' | 'bear' | 'panda';
  date: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface UserPreferences {
  theme: 'sakura' | 'ocean' | 'forest' | 'sunset';
  language: 'ja' | 'en';
  mascot: 'cat' | 'bunny' | 'bear' | 'panda';
  notifications: boolean;
}