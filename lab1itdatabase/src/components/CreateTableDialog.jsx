import React from "react";
import { Button } from "@radix-ui/themes";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "@radix-ui/react-dialog";
import ColumnEditor from "./ColumnEditor";

const CreateTableDialog = ({ columns, setColumns, onAddTable }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="solid" color="blue">
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
	);
};

export default CreateTableDialog;
