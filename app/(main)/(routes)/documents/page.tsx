"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {useRouter} from "next/navigation";

const DocumentsPage = () => {
	const { user } = useUser();
	const create = useMutation(api.documents.create);
	const router = useRouter();
	const onCreate = () => {
		const promise = create({ title: "Undefined" }).then((documentId) => {
		router.push(`/documents/${documentId}`)
		})

		toast.promise(promise, {
			loading: "Designing a new note...",
			success: "Brand new noted!",
			error: "Faild to create a new noted."
		}
		)
	}

	return (
		<>
			<div className="h-full flex flex-col items-center justify-center space-y-4">
				<Image src="/box.png" alt="Empty" width="300" height="300" className="dark:hidden" />
				<Image src="/box.png" alt="Empty" width="300" height="300" className="hidden dark:block" />

				<h2 className="text-lg font-medium">
					Welcome to {user?.firstName}&apos;s Brazion Documents
				</h2>
				<Button onClick={onCreate}>
					<PlusCircle className="mr-2 h-4 w-4" />
					Create a note
				</Button>
			</div>
		</>
	);
}
export default DocumentsPage;