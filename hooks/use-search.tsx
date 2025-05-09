import  {create} from "zustand";

type Search = {
	isOPEN: boolean;
	onOpen: () => void;
	onClose: () => void;
	toggle: () => void;
};

export const useSearch = create<Search>((set, get) => ({
	isOPEN: false,
	onOpen: () => set({ isOPEN: true }),
	onClose: () => set({ isOPEN: false }),
	toggle: () => set({isOPEN : !get().isOPEN}),
}));