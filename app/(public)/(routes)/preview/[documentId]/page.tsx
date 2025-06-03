"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { usePathname } from "next/navigation";

const DocumentIdPage = () => {
	const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
	const pathname = usePathname();
	const parts = pathname.split("/");
	const documentId = parts[parts.length - 1] as Id<"documents">;
	const document = useQuery(api.documents.getById, { documentId: documentId });

	const update = useMutation(api.documents.update);

	const onChange = (content: string) => {
		update({
			id: documentId,
			content
		});
	}

	if (document === undefined)
		return (
			<div>
				<div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
					<div className="space-y-4 pl-8 pt-4">
						<Skeleton className="h-14 w-[80%]" />
						<Skeleton className="h-4 w-[60%]" />
						<Skeleton className="h-4 w-[40%]" />
						<Skeleton className="h-4 w-[20%]" />
					</div>
				</div>
			</div>
		);

	if (document === null) {
		return (
			<div>
				Document not found
			</div>
		);
	}

	return (
		<div className="pb-40">
			<div className="h-35vh" />
			<div
				className="md:max-w-3xl lg:max-4xl mx-auto">
				<Toolbar preview initialData={document} />
				<Editor editable={false}
					onChange={onChange}
					initialContent={document.content}
				/>
			</div>
		</div>
	);
}
export default DocumentIdPage;