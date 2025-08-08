import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Goal, UserPreferences, DailyMessage } from '@/types/planner';

interface PlannerState {
    // Tasks
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskComplete: (id: string) => void;

    // Goals
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    updateGoalProgress: (id: string, progress: number) => void;

    // Daily Messages
    dailyMessage: DailyMessage | null;
    setDailyMessage: (message: DailyMessage) => void;

    // User Preferences
    preferences: UserPreferences;
    updatePreferences: (updates: Partial<UserPreferences>) => void;

    // UI State
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}

export const usePlannerStore = create<PlannerState>()(
    persist(
        (set) => ({
            // Tasks
            tasks: [],
            addTask: (taskData) => set((state) => ({
                tasks: [...state.tasks, {
                    ...taskData,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }]
            })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map(task =>
                    task.id === id
                        ? { ...task, ...updates, updatedAt: new Date() }
                        : task
                )
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(task => task.id !== id)
            })),
            toggleTaskComplete: (id) => set((state) => ({
                tasks: state.tasks.map(task =>
                    task.id === id
                        ? { ...task, completed: !task.completed, updatedAt: new Date() }
                        : task
                )
            })),

            // Goals
            goals: [],
            addGoal: (goalData) => set((state) => ({
                goals: [...state.goals, {
                    ...goalData,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }]
            })),
            updateGoal: (id, updates) => set((state) => ({
                goals: state.goals.map(goal =>
                    goal.id === id
                        ? { ...goal, ...updates, updatedAt: new Date() }
                        : goal
                )
            })),
            deleteGoal: (id) => set((state) => ({
                goals: state.goals.filter(goal => goal.id !== id)
            })),
            updateGoalProgress: (id, progress) => set((state) => ({
                goals: state.goals.map(goal =>
                    goal.id === id
                        ? { ...goal, progress, updatedAt: new Date() }
                        : goal
                )
            })),

            // Daily Messages
            dailyMessage: null,
            setDailyMessage: (message) => set({ dailyMessage: message }),

            // User Preferences
            preferences: {
                theme: 'sakura',
                language: 'ja',
                mascot: 'cat',
                notifications: true,
            },
            updatePreferences: (updates) => set((state) => ({
                preferences: { ...state.preferences, ...updates }
            })),

            // UI State
            selectedDate: new Date(),
            setSelectedDate: (date) => set({ selectedDate: date }),
        }),
        {
            name: 'kawaii-planner-storage',
        }
    )
);