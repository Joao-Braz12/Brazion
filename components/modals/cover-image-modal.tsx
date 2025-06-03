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
import { UploaderProvider, UploadFn } from "../upload/uploader-provider";
import React from "react";

export const CoverImageModal = () => {
	const params = useParams();
	const update = useMutation(api.documents.update);
	const coverIMage = useCoverImage();
	const [file, setFile] = useState<File>();
	const [isUploading, setIsUploading] = useState(false);
	const coverImage = useCoverImage();
	const { edgestore } = useEdgeStore();

	const onClose = () => {
		if(file)
			setFile(undefined);
		setIsUploading(false);
		coverImage.onClose();
	}

	const uploadFn: UploadFn = React.useCallback(
		async ({ file, onProgressChange, signal }) => {
			const res = await edgestore.publicFiles.upload({
				file,
				signal,
				onProgressChange,
				options: {
					replaceTargetUrl: coverImage.url
				}
			});
			if (file) {
				setIsUploading(true);
				setFile(file);

				await update({
					id: params.documentId as Id<"documents">,
					coverImage: res.url
				});
				onClose();
			}
			return res;
		},
		[edgestore],
	);

	return (
		<Dialog open={coverIMage.isOpen} onOpenChange={coverIMage.onClose}>
			<DialogContent>
				<DialogHeader>
					<h2 className="text-cente text-lg font-semibold">
						Cover Image
					</h2>
				</DialogHeader>
				<div>
					<UploaderProvider
						uploadFn={uploadFn} autoUpload
					>
						<SingleImageDropzone
							className="w-full outline-none"
							height={200}
							width={200}
							dropzoneOptions={{
								maxSize: 1024 * 1024 * 1,
							}}
							disabled={isUploading}
						/>
					</UploaderProvider>
				</div>
			</DialogContent>
		</Dialog>
	);
}