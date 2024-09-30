import React, { useState } from "react";
import { Box, Text } from "@radix-ui/themes";
import TableList from "./TableList";
import TableSelector from "./TableSelector";
import CreateTableDialog from "./CreateTableDialog";
import CartesianProductResult from "./CartesianProductResult";
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

	const handleCartesianProductClick = () => {
		handleCartesianProduct(
			tables,
			selectedTable1,
			selectedTable2,
			onUpdateTable,
			setSelectedTable1,
			setSelectedTable2,
			setCartesianProductResult
		);
	};

	return (
		<Box p="4">
			<CreateTableDialog
				columns={columns}
				setColumns={setColumns}
				onAddTable={onAddTable}
			/>

			<hr style={{ margin: "20px 0" }} />

			<Text as="h3" size="5">
				Existing Tables
			</Text>

			{tables.length > 0 ? (
				<>
					<TableSelector
						tables={tables}
						selectedTable1={selectedTable1}
						setSelectedTable1={setSelectedTable1}
						selectedTable2={selectedTable2}
						setSelectedTable2={setSelectedTable2}
						handleCartesianProduct={handleCartesianProductClick}
					/>

					<CartesianProductResult
						cartesianProductResult={cartesianProductResult}
					/>

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
