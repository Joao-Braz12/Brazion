"use client"

import { cn } from "@/lib/utils";
import { ChevronLeft, MenuIcon, PlusCircle, Search, Settings, Trash2 } from "lucide-react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";

export const Navegation = () => {
	const router = useRouter();
	const settings = useSettings();
	const search = useSearch();
	const pathname = usePathname();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const params = useParams();
	const create = useMutation(api.documents.create);

	const isResizingRef = useRef(false);
	const sideBarRef = useRef<HTMLDivElement>(null);
	const navBarRef = useRef<HTMLDivElement>(null);
	const [isResetting, setIsResetting] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(isMobile);


	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();

		isResizingRef.current = true;
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		setIsResetting(true);
	};

	useEffect(() => {
		if (isMobile)
			collapse();
		resetWidth();
	}, [isMobile, pathname]);

	useEffect(() => {
		if (isMobile)
			collapse();
	}, [pathname, isMobile]);

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizingRef.current) return;

		let newWidth = e.clientX;

		if (newWidth < 240) newWidth = 240;
		if (newWidth > 480) newWidth = 480;

		if (sideBarRef.current && navBarRef.current) {
			sideBarRef.current.style.width = `${newWidth}px`;
			navBarRef.current.style.setProperty("left", `${newWidth}px`);

			navBarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
		}
	};

	const handleMouseUp = () => {
		isResizingRef.current = false;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	}

	const resetWidth = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			sideBarRef.current.style.width = isMobile ? "100%" : "240px";
			navBarRef.current.style.setProperty("width",
				isMobile ? "0" : "calc(100% - 240px)");
			navBarRef.current.style.setProperty("left",
				isMobile ? "100%" : "240px");

			setTimeout(() => setIsResetting(false), 300);
		}
	};

	const collapse = () => {
		if (sideBarRef.current && navBarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			sideBarRef.current.style.width = "0";
			navBarRef.current.style.setProperty("width", "100%");
			navBarRef.current.style.setProperty("left", "0");

			setTimeout(() => setIsResetting(false), 300);
		}
	}

	const handleCreate = () => {
		const promise = create({ title: "Undefined" })
			.then((documentId)  => router.push(`/documents/${documentId}`))

		toast.promise(promise, {
			loading: "A new note is being create!..",
			success: "A new note arrived!",
			error: "Mission faild"
		})
	}

	return (
		<>
			<aside className={cn(
				"group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
				isResetting && "transition-all ease-in-out duration-300",
				isMobile && "w-0",)}
				ref={sideBarRef}>
				<div
					role="button" onClick={collapse}
					className={cn("h-6 w-6 text-muted-foreground rounded-b-sm hover:bg-neutral-300 dark:hover:bg-neutral 600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
						isMobile && "opacity-100")}>
					<ChevronLeft className="h-6 w-6" />
				</div>
				<div>
					<UserItem />
					<Item
						label="Search"
						icon={Search}
						isSearch
						onClick={search.onOpen}
					/>
					<Item
						label="Settings"
						icon={Settings}
						onClick={settings.onOpen}
					/>
					<Item
						onClick={handleCreate}
						label="New Page"
						icon={PlusCircle} />
				</div>
				<div className="mt-4">
					<DocumentList />
					<Item
						onClick={handleCreate}
						label="New Page"
						icon={PlusCircle} />
					<Popover>
						<PopoverTrigger className="w-full mt-4">
							<Item label="Trash" icon={Trash2} />
						</PopoverTrigger>
						<PopoverContent className="p-0 w-72" side={isMobile ? "bottom" : "right"} >
							<TrashBox />
						</PopoverContent>
					</Popover>
				</div>
				<div
					onMouseDown={handleMouseDown}
					onClick={resetWidth}
					className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
			</aside>
			<div
				ref={navBarRef}
				className={cn(
					"absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
					isResetting && "transition-all ease-in-out duration-300",
					isMobile && "left-0 w-full"
				)}
			>
				{!!params.documentId ? (
					<Navbar
						isCollapsed={isCollapsed}
						onResetWidth={resetWidth} />
				) : (
					<nav className="bg-transparent px-3 py-2 w-full">
						{isCollapsed && <MenuIcon onClick={resetWidth}
							className="h-6 w-6 text-muted-foreground" role="button" />}
					</nav>
				)}
			</div>
		</>
	);
}