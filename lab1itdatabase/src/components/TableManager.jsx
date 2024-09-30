import React, { useState } from "react";
import { Box, Button, Text, Flex } from "@radix-ui/themes";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "@radix-ui/react-dialog";
import ColumnEditor from "./ColumnEditor";
import TableList from "./TableList";
import { handleCartesianProduct } from "../hooks/cartesianProduct";
import { validateValue } from "../utils/validation";

function TableManager({ tables, onAddTable, onDeleteTable, onUpdateTable }) {
	const [columns, setColumns] = useState([{ name: "", type: "string" }]);
	const [editRowInfo, setEditRowInfo] = useState({
		tableIndex: null,
		rowIndex: null,
	});
	const [validationErrors, setValidationErrors] = useState({});
	const [selectedTable1, setSelectedTable1] = useState(null);
	const [selectedTable2, setSelectedTable2] = useState(null);
	const [cartesianProductResult, setCartesianProductResult] = useState(null);

	const handleAddRow = (tableIndex) => {
		const newRow = {};
		tables[tableIndex].columns.forEach((col) => {
			if (col.type === "dateInvl") {
				newRow[col.name] = { start: "", end: "" };
			} else {
				newRow[col.name] = "";
			}
		});

		const updatedTables = [...tables];
		updatedTables[tableIndex].rows.push(newRow);
		onUpdateTable(updatedTables);

		setEditRowInfo({
			tableIndex,
			rowIndex: updatedTables[tableIndex].rows.length - 1,
		});
	};

	const handleDeleteRow = (tableIndex, rowIndex) => {
		const updatedTables = [...tables];
		updatedTables[tableIndex].rows.splice(rowIndex, 1);
		onUpdateTable(updatedTables);
	};

	const handleRowChange = (tableIndex, rowIndex, columnName, value) => {
		const updatedTables = [...tables];
		const column = tables[tableIndex].columns.find(
			(col) => col.name === columnName
		);

		const error = validateValue(value, column.type);
		if (error) {
			setValidationErrors({
				...validationErrors,
				[`${tableIndex}-${rowIndex}-${columnName}`]: error,
			});
		} else {
			const newErrors = { ...validationErrors };
			delete newErrors[`${tableIndex}-${rowIndex}-${columnName}`];
			setValidationErrors(newErrors);
		}

		updatedTables[tableIndex].rows[rowIndex][columnName] = value;
		onUpdateTable(updatedTables);
	};

	const handleEditRow = (tableIndex, rowIndex) => {
		setEditRowInfo({ tableIndex, rowIndex });
	};

	const handleSaveRow = () => {
		setEditRowInfo({ tableIndex: null, rowIndex: null });
	};

	return (
		<Box p="4">
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

			<hr style={{ margin: "20px 0" }} />

			<Text as="h3" size="5">
				Existing Tables
			</Text>
			{tables.length > 0 ? (
				<>
					<Flex gap="4">
						<select
							data-testid="selectTable1"
							value={selectedTable1 || ""}
							onChange={(e) => setSelectedTable1(e.target.value)}
							style={{
								padding: "8px",
								borderRadius: "4px",
								border: "1px solid #ccc",
							}}
						>
							<option value="">Select Table 1</option>
							{tables.map((table, index) => (
								<option key={index} value={index}>
									{table.name}
								</option>
							))}
						</select>

						<select
							data-testid="selectTable2"
							value={selectedTable2 || ""}
							onChange={(e) => setSelectedTable2(e.target.value)}
							style={{
								padding: "8px",
								borderRadius: "4px",
								border: "1px solid #ccc",
							}}
						>
							<option value="">Select Table 2</option>
							{tables.map((table, index) => (
								<option key={index} value={index}>
									{table.name}
								</option>
							))}
						</select>

						<Button
							onClick={() =>
								handleCartesianProduct(
									tables,
									selectedTable1,
									selectedTable2,
									onUpdateTable,
									setSelectedTable1,
									setSelectedTable2,
									setCartesianProductResult
								)
							}
							variant="solid"
							color="blue"
						>
							Прямий добуток
						</Button>
					</Flex>

					{cartesianProductResult && (
						<Box mt="4">
							<Text as="h4">{cartesianProductResult.name}</Text>
							<TableList
								tables={[cartesianProductResult]}
								editRowInfo={editRowInfo}
								handleRowChange={handleRowChange}
								handleEditRow={handleEditRow}
								handleSaveRow={handleSaveRow}
								handleDeleteRow={handleDeleteRow}
								handleAddRow={handleAddRow}
								validationErrors={validationErrors}
								onDeleteTable={onDeleteTable}
							/>
						</Box>
					)}

					<TableList
						tables={tables}
						editRowInfo={editRowInfo}
						handleRowChange={handleRowChange}
						handleEditRow={handleEditRow}
						handleSaveRow={handleSaveRow}
						handleDeleteRow={handleDeleteRow}
						handleAddRow={handleAddRow}
						validationErrors={validationErrors}
						onDeleteTable={onDeleteTable}
					/>
				</>
			) : (
				<Text>No tables available</Text>
			)}
		</Box>
	);
}

export default TableManager;
