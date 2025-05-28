"use-client";

import { IconPicker } from "@/app/(main)/_components/icon-picker";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Icon, ImageIcon, Smile, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import TextareaAutosize from "react-textarea-autosize";
import { CoverImageModal } from "./modals/cover-image-modal";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
	initialData: Doc<"documents">,
	preview?: boolean
}

export const Toolbar = ({
	initialData,
	preview
}: ToolbarProps) => {

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [isEditing, setEditing] = useState(false);
	const [value, setValue] = useState(initialData.title);

	const update = useMutation(api.documents.update);
	const removeIcon = useMutation(api.documents.removeIcon);

	const coverImage = useCoverImage();

	const enableInput = () => {
		if (preview) return;
		setEditing(true);
		setTimeout(() => {
			setValue(initialData.title);
			inputRef.current?.focus();
		}, 0);
	}

	const disableInput = () => {
		setEditing(false);
	}

	const onInput = (value: string) => {
		setValue(value);
		update({
			id: initialData._id,
			title: value || "Untitled",
		});
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			disableInput();
		};
	};

	const onIconSelect = (icon: string) => {
		update({
			id: initialData._id,
			icon
		});
	}

	const onIconRemove = () => {
		removeIcon({
			id: initialData._id
		});
	}

	return (
		<div className="pt-[50px] pl-[54px] group relative">
			{!!initialData.icon && !preview && (
				<div className="flex items-center gap-x-2 group/icon pt-6">
					<IconPicker onChange={onIconSelect}>
						<p className="text-6xl hover:opacity-75 transition">
							{initialData.icon}
						</p>
					</IconPicker>
					<Button onClick={onIconRemove} size="icon"
						variant="outline" className="group-hover/icon:opacity-100 opacity-0 transition rounded-full text-muted-foreground text-xs">
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}
			{!!initialData.icon && preview && (
				<p className="text-6xl pt-6">
					{initialData.icon}
				</p>
			)}
			<div className="opacity-0 group-hover:opacity-100 flex items-center gapx-x-1 py-4">
				{!initialData.icon && !preview && (
					<IconPicker asChildren onChange={onIconSelect}>
						<Button className="text-muted-foreground text-xs" size="sm" variant="outline">
							<Smile className="h-4 w-4 mr-2" />
							Add icon
						</Button>
					</IconPicker>
				)}

				{!initialData.coverImage && !preview && (
					<Button onClick={coverImage.onOpen}
						className="text-muted-foreground text-xs" size="sm" variant="outline">
						<ImageIcon className="w-4 h-4 mr-2" />
						Add cover
					</Button>
				)}
			</div>
			{isEditing && !preview ? (
				<TextareaAutosize
					ref={inputRef}
					onBlur={disableInput}
					onKeyDown={onKeyDown}
					value={value}
					onChange={(e) => onInput(e.target.value)}
					className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none" />) : (
				<div
					onClick={enableInput}
					className="pb-[11.5px] text-5xl break-words font-bold text-[#3F3F3F] dark:text-[#CFCFCF]">
					{initialData.title}
				</div>
			)}
		</div>
	)
}