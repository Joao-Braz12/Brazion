"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Cover } from "@/components/cover";

interface DocumentIdPageProps {
	params: {
		documentId: Id<"documents">;
	}
}

const DocumentIdPage = ({
	params
}:DocumentIdPageProps) => {
	const Editor = useMemo(() => dynamic(() => import("@/components/editor"), {ssr: false}), []);

	const existingdocument = useQuery(api.documents.getById, {documentId  : params.documentId});

	const update = useMutation(api.documents.update);

	const onChange = (content:string) => {
		update({
			id: params.documentId,
			content
		});
	}

	if (existingdocument === undefined)
		return (
			<div>
				<div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
					<div className="space-y-4 pl-8 pt-4">
						<Skeleton className="h-14 w-[80%]"/>
						<Skeleton className="h-4 w-[60%]"/>
						<Skeleton className="h-4 w-[40%]"/>
						<Skeleton className="h-4 w-[20%]"/>
					</div>
				</div>
			</div>
		);

	if (existingdocument === null){
		return (
			<div>
				Document not found
			</div>
		);
	}

	return (
		<div className="pb-40">
			<Cover url={existingdocument.coverImage}/>
			<div
			className="md:max-w-3xl lg:max-4xl mx-auto">
				<Toolbar initialData={existingdocument} />
				<Editor
					onChange={onChange}
					initialContent={existingdocument.content}
				/>
			</div>
		</div>
	);
}
export default DocumentIdPage;