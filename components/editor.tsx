"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine"

import "@blocknote/core/style.css";
import { init } from "next/dist/compiled/webpack/webpack";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
	onChange: (value: string) => void;
	initialContent?: string;
	editable?: boolean;
}

const Editor = ({
	onChange,
	initialContent,
	editable
}: EditorProps) => {
	const {resolvedTheme} = useTheme();
	const {edgestore} = useEdgeStore();

	const handleUpload = async (file: File) =>{
		const response = await edgestore.publicFiles.upload({
			file
		});
		return response.url;
	}

	const editor = useCreateBlockNote({
		initialContent: initialContent ?
		JSON.parse(initialContent) as PartialBlock[] :
		undefined,
		uploadFile: handleUpload
		});

	return (
		<div>
			<BlockNoteView
      editor={editor}
        editable= {editable}
        onChange={(editor) => {JSON.stringify(editor.document, null, 2)}}
				theme={resolvedTheme === "dark" ? "dark" : "light"}
			/>
		</div>
	);
} 
export default Editor;