"use client";

import Image from "next/image";

export const Heroes = () => {
	return (
		<div className="flex flex-col items-center justify-items-center max-w-5xl">
			<div className="flex items-center">
				<div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h[350px] md:h-[400px] md:h-[400px]">
					<Image src="/boy-reading.png" fill alt="Boy Reading" 
					className="object-contain dark:hidden"/>
					<Image src="/dark-boy-reading.png" fill alt="Boy Reading" 
					className="object-contain hidden dark:block"/>
				</div>
				<div className="relative h-[400px] w-[400px]hidden md:block">
					<Image src="/girl-reading.png" fill
					alt="Girl on Computer" className="object-contain dark:hidden"/>
					<Image src="/dark-girl-reading.png" fill
					alt="Girl on Computer" className="object-contain hidden dark:block"/>
				</div>
			</div>
		</div>
	);
}