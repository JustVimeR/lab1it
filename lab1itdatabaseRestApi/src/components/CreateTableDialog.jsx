import React, { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@radix-ui/react-dialog";
import ColumnEditor from "./ColumnEditor";

const CreateTableDialog = ({ columns, setColumns, onAddTable }) => {
	const [isColumnEditorOpen, setIsColumnEditorOpen] = useState(false);

	useEffect(() => {
		if (window.electron && window.electron.ipcRenderer) {
			window.electron.ipcRenderer.on("open-column-editor", () => {
				setIsColumnEditorOpen(true);
			});
		}
	}, []);

	const openColumnEditor = () => {
		if (window.electron && window.electron.ipcRenderer) {
			window.electron.ipcRenderer.send("open-column-editor");
		} else {
			setIsColumnEditorOpen(true);
		}
	};

	return (
		<div>
			<Dialog open={isColumnEditorOpen} onOpenChange={setIsColumnEditorOpen}>
				<DialogTrigger asChild>
					<Button onClick={openColumnEditor} variant="solid" color="blue">
						Create New Table
					</Button>
				</DialogTrigger>
				<DialogContent
					style={{
						backgroundColor: "white",
						padding: "20px",
						borderRadius: "8px",
						maxWidth: "500px",
						width: "100%",
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
						zIndex: 1000,
					}}
				>
					<DialogTitle>Create a New Table</DialogTitle>
					<ColumnEditor
						columns={columns}
						setColumns={setColumns}
						onAddTable={onAddTable}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CreateTableDialog;
