import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text } from "@radix-ui/themes";
import { DialogClose } from "@radix-ui/react-dialog";

function ColumnEditor({
	columns,
	setColumns,
	onAddTable,
	existingTables = [],
}) {
	const [newTableName, setNewTableName] = useState("");
	const [tableError, setTableError] = useState("");
	const [columnError, setColumnError] = useState("");
	const [isCreateDisabled, setIsCreateDisabled] = useState(true);

	const handleAddColumn = () => {
		setColumns([...columns, { name: "", type: "string" }]);
	};

	const handleColumnChange = (index, field, value) => {
		const updatedColumns = [...columns];
		updatedColumns[index][field] = value;
		setColumns(updatedColumns);
	};

	const handleDeleteColumn = (index) => {
		const updatedColumns = columns.filter((_, colIndex) => colIndex !== index);
		setColumns(updatedColumns);
	};

	const validateInputs = () => {
		setTableError("");
		setColumnError("");

		if (newTableName.trim() === "") {
			setTableError("Table name cannot be empty");
			return false;
		}

		const isTableNameExists = existingTables.some(
			(table) => table.name.toLowerCase() === newTableName.toLowerCase()
		);

		if (isTableNameExists) {
			setTableError("Table with this name already exists");
			return false;
		}

		if (columns.length === 0) {
			setColumnError("You need at least one column to create a table");
			return false;
		}

		const columnNames = columns.map((col) => col.name.toLowerCase().trim());
		const hasDuplicateColumns = columnNames.some(
			(name, index) => name && columnNames.indexOf(name) !== index
		);

		if (hasDuplicateColumns) {
			setColumnError("Column names must be unique");
			return false;
		}

		if (columnNames.some((name) => name === "")) {
			setColumnError("Column names cannot be empty");
			return false;
		}

		return true;
	};

	const handleCreateTable = () => {
		if (!validateInputs()) {
			return;
		}

		const newTable = {
			name: newTableName,
			columns,
			rows: [],
		};

		onAddTable(newTable);
		setNewTableName("");
		setColumns([{ name: "", type: "string" }]);
	};

	useEffect(() => {
		const isValid = validateInputs();
		setIsCreateDisabled(!isValid);
	}, [newTableName, columns, existingTables]);

	return (
		<Box>
			<Text as="h3" size="5">
				Table Name
			</Text>
			<Box mb="3">
				<input
					type="text"
					placeholder="New table name"
					value={newTableName}
					onChange={(e) => setNewTableName(e.target.value)}
					style={{
						padding: "8px",
						borderRadius: "5px",
						border: "1px solid #ccc",
						marginRight: "8px",
					}}
				/>
				{tableError && (
					<Text color="red" style={{ marginTop: "8px", fontSize: "14px" }}>
						{tableError}
					</Text>
				)}
			</Box>
			<Text as="h4" size="4">
				Table Columns
			</Text>
			{columns.map((col, index) => (
				<Flex key={index} align="center" gap="3" mb="2">
					<input
						type="text"
						placeholder="Column name"
						value={col.name}
						onChange={(e) => handleColumnChange(index, "name", e.target.value)}
						style={{
							padding: "8px",
							border: "1px solid #ccc",
							borderRadius: "4px",
							width: "100%",
							flex: 2,
						}}
					/>
					<select
						value={col.type}
						onChange={(e) => handleColumnChange(index, "type", e.target.value)}
						style={{
							padding: "8px",
							border: "1px solid #ccc",
							borderRadius: "4px",
							flex: 1,
						}}
					>
						<option value="string">String</option>
						<option value="integer">Integer</option>
						<option value="real">Real</option>
						<option value="char">Char</option>
						<option value="date">Date</option>
						<option value="dateInvl">Date Interval</option>
					</select>
					<Button
						variant="solid"
						color="red"
						size="2"
						onClick={() => handleDeleteColumn(index)}
					>
						Delete
					</Button>
				</Flex>
			))}
			{columnError && (
				<Text color="red" style={{ marginTop: "8px", fontSize: "14px" }}>
					{columnError}
				</Text>
			)}
			<Flex direction={"row"} gap={"4px"} mt="4">
				<Button
					variant="solid"
					onClick={handleAddColumn}
					color="green"
					size="2"
				>
					Add Column
				</Button>
				<DialogClose asChild>
					<Button
						onClick={handleCreateTable}
						variant="solid"
						color="blue"
						disabled={isCreateDisabled}
					>
						Create Table
					</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button variant="solid" color="red">
						Close
					</Button>
				</DialogClose>
			</Flex>
		</Box>
	);
}

export default ColumnEditor;
