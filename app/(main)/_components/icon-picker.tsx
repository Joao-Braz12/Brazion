"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";

interface IconPickerProps {
	onChange: (icon: string) => void;
	children: React.ReactNode;
	asChildren?: boolean;
};

export const IconPicker = ({
	onChange,
	children
}: IconPickerProps) => {
	const { resolvedTheme } = useTheme();
	const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;

	const themeMap = {
		"dark": Theme.DARK,
		"light": Theme.LIGHT
	}

	const theme = themeMap[currentTheme];

	return (
		<Popover>
			<PopoverTrigger>
				{children}
			</PopoverTrigger>
			<PopoverContent className="w-full p-0 border-none shadow-none">
				<EmojiPicker 
					height={350}
					theme={theme}
					onEmojiClick={(emojiData) => {
						onChange(emojiData.emoji);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}