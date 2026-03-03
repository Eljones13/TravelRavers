import { create } from 'zustand';

export interface VibeReport {
    stageId: string;
    energyLevel: number; // 0-100
    timestamp: number;
    reportedBy: string;
}

interface VibeState {
    reports: Record<string, VibeReport>; // Key: stageId
    addReport: (report: VibeReport) => void;
    getEnergyForStage: (stageId: string) => number;
}

export const useVibeStore = create<VibeState>((set, get) => ({
    reports: {},
    addReport: (report) => set((state) => ({
        reports: {
            ...state.reports,
            [report.stageId]: report
        }
    })),
    getEnergyForStage: (stageId) => get().reports[stageId]?.energyLevel || 0,
}));
