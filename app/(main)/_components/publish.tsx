"use client"

import { Doc } from "@/convex/_generated/dataModel"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import { useOrigin } from "@/hooks/use-origin"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, Copy, Divide, Ghost, Globe } from "lucide-react"

interface PublishProps{
	initialData: Doc<"documents">
};

export const Publish = ({
	initialData
}:PublishProps) => {
	const origin = useOrigin();
	const update = useMutation(api.documents.update);

	const [copied, setcopied] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const url = `${origin}/preview/${initialData._id}`;

	const onPublish = () => {
		setIsSubmitting(true);

		const promise = update({
			id: initialData._id,
			isPublished: true,
		}).finally(() => setIsSubmitting(false));

		toast.promise(promise, {
			loading:"Publishing...",
			success:"Note published!",
			error:"Failed to publish."
		})
	}

	const onUnPublish = () => {
		setIsSubmitting(false);

		const promise = update({
			id: initialData._id,
			isPublished: true,
		}).finally(() => setIsSubmitting(false));

		toast.promise(promise, {
			loading:"UnPublishing...",
			success:"Note unublished!",
			error:"Failed to unpublish."
		})
	}

	const onCopy = () => {
		navigator.clipboard.writeText(url);
		setcopied(true);

		setTimeout(()=>{
			setcopied(false);
		}, 1000);
	}

	return(
		<Popover>
			<PopoverTrigger asChild>
				<Button size="sm" variant="ghost">
					Publish
					{initialData.isPublished && <Globe
					className="w-4 h-4 ml-2 text-sky-700"
					/>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72"
			align="end"
			alignOffset={8}
			forceMount>
				{initialData.isPublished ? (
					<div className="space-y-4">
						<div className="flex items-center gap-x-2">
							<Globe className="text-sky-700 animate-pulse h-4 w-4"/>
							<p className="text-xs font-medium text-sky-700">
								This note is already visible
							</p>
						</div>
						<div className="flex items-center">
							<input
								className="flex-1 px-3 text-xs border rounded-l-md h-8 bg-muted truncate"
								value={url}
								disabled
							/>
							<Button onClick={onCopy}
							disabled = {copied}
							className="h-8 rounded-l-none">
								{copied ? (
									<Check className="h-4 w-4"/>
								): (
									<Copy className="h-4 w-4"/>
								)}
							</Button>
						</div>
						<Button size = "sm"
						className="w-full text-xs"
						disabled={isSubmitting}
						onClick={onUnPublish}
						>
							Unpublish
						</Button>
						Publish
					</div>
				) : (
					<div className="flex flex-col items-center justify-center">
						<Globe 
						className="h-8 w-8 text-muted-foreground mb-2"
						/>
						<p className="text-sm font-medium">
							Publish this note
						</p>
						<span className="text-xs text-muted-foreground mb-4">
							Share your work with others.
						</span>
						<Button
						disabled={isSubmitting}
						onClick={onPublish}
						className="w-full text-xs"
						size="sm"
						>
							Publish
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}