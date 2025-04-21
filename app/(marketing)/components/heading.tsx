"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton} from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {

	const { isAuthenticated, isLoading } = useConvexAuth();

	return (
		<div className="max-w-3xl space-y-4">
			<h1 className="text-3xl sm:text-5xl md:text6xl font-bold">
				Your lyrics, Ideas & plans. Get along with <span className="underline">Brazion</span>
			</h1>
			<h3 className="text-base sm:text-xl md:text2xl font-medium ">
				Brazion is the connected workspace for your lyrics, ideas and plans. <br />It’s a place to get things done.
			</h3>
			{isLoading && (
				<div className="w-full flex items-center justify-center">
					<Spinner size="lg" />
				</div>
			)}
			{isAuthenticated && !isLoading && (
				<Button asChild>
					<Link href="/documents">
					Enter Brazion
					<ArrowRight className=" h-4 w-4 ml-2" />
					</Link>
				</Button>
			)}
			{!isAuthenticated && !isLoading && (
				<SignInButton mode="modal">
					<Button>
						Get Brazion free
						<ArrowRight className=" h-4 w-4 ml-2" />
					</Button>
				</SignInButton>
			)}
		</div>
	);
}