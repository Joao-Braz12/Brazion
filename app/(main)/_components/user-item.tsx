"use-client";

import { ChevronsLeft } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const UserItem = () => {

	const { user } = useUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div role="button" className="flex items-center text-sm p-3 w-full hover:bg-secondary/5">
					<div
						className="gap-2 flex items-center max-w-[150px]">
						<Avatar className="w-5 h-5">
							<AvatarImage src={user?.imageUrl} alt="User" />
						</Avatar>
						<span className="text-start font-medium line-clamp-1">
							{user?.fullName}&apos;s Brazion
						</span>
					</div>
					<ChevronsLeft className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-80"
				align="start"
				alignOffset={11}
				forceMount>
				<div className="flex flex-col space-y-4 p-2">
					<p className="text-xs font-medium leading-none text-muted-foreground">
						{user?.emailAddresses[0]?.emailAddress}
					</p>
					<div className="flex items-center gap-x-2">
						<div className="rounded-md bg-secondary p-1">
							<Avatar className="w-8 h-8">
								<AvatarImage src={user?.imageUrl} alt="User" />
							</Avatar>
						</div>
						<div className="space-y-1">
							<p className="text-sm line-clamp-1">
								{user?.fullName}&apos;s Brazion
							</p>
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<SignOutButton>
						<button
							className="cursor-pointer w-full text-muted-foreground">
							Sign Out
						</button>
					</SignOutButton>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
