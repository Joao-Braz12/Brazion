"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogFooter
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
	children: React.ReactNode;
	onConfirm: () => void;
};

export const ConfirmModal = ({children, onConfirm }: ConfirmModalProps) => {

	const handleConfirm = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		onConfirm();
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent >
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This note will be permanently deleted.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={e => e.stopPropagation()}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}