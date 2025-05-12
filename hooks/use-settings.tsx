import {create } from "zustand";

type SettingsStore  = {
	isOPEN: boolean;
	onOpen: () => void;
	onClose: () => void;
};

export const useSettings = create<SettingsStore>((set) => ({
	isOPEN: false,
	onOpen: () => set({ isOPEN: true }),
	onClose: () => set({ isOPEN: false }),
}));
