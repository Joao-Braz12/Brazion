"use client"

import { Id } from "@/convex/_generated/dataModel"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


interface MenuProps {
	documentId: Id<"documents">;
}

export const Menu = ({
	documentId
}: MenuProps) => {
	const router = useRouter();
	const { user } = useUser();
	const archive = useMutation(api.documents.archive);

	const onArchive = () => {
		const promise = archive({ id: documentId });

		toast.promise(promise, {
			loading: "Movind to trash...",
			success: "Document trashed",
			error: "Failed to trasg document"
		});
		router.push("/documents");
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="ghost">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-60"
				align="end"
				alignOffset={8}
				forceMount
			>
				<DropdownMenuItem onClick={onArchive}>
					<Trash className="mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
				<DropdownMenuSeparator />	
				<div className="text-xs text-muted-foreground">
					Last edidted by: {user?.fullName}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

Menu.Skeleton = function MenuSkeleton() {
	return (
	<Skeleton className="h-10 w-10" />
	)
}