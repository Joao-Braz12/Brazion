"use client";

import { useState } from "react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { SingleImageDropzone } from "../upload/single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { set } from "zod";

export const CoverImageModal = () => {
	const params = useParams();
	const update = useMutation(api.documents.update);
	const coverIMage = useCoverImage();
	const [file, setFile] = useState<File>();
	const [isUploading, setIsUploading] = useState(false);
	const coverImage = useCoverImage();
	const { edgestore } = useEdgeStore();

	const onClose = () => {
		setFile(undefined);
		setIsUploading(false);
		coverImage.onClose();
	}

	const onChange = async (file?: File) => {
		if (file) {
			setIsUploading(true);
			setFile(file);

			const res = await edgestore.publicFiles.upload({ file });

			await update({
				id: params.documentId as Id<"documents">,
				coverImage: res.url
			});
			onClose();
		}
	}

	return (
		<Dialog open={coverIMage.isOpen} onOpenChange={coverIMage.onClose}>
			<DialogContent>
				<DialogHeader>
					<h2 className="text-cente text-lg font-semibold">
						Cover Image
					</h2>
				</DialogHeader>
				<div>
					<SingleImageDropzone
						className="w-full outline-none"
						disabled={isUploading}
						value={file}
						onCHange={onChange}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}