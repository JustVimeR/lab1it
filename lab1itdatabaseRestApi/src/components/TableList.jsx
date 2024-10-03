import React from "react";
import { Box, Button, Flex, Text, Table } from "@radix-ui/themes";
import TableRow from "./TableRow";

const TableList = ({
	tables,
	editRowInfo,
	handleRowChange,
	handleEditRow,
	handleSaveRow,
	handleDeleteRow,
	handleAddRow,
	validationErrors,
	onDeleteTable,
}) => {
	return (
		<>
			{tables.map((table, tableIndex) => (
				<Box key={tableIndex} mb="4">
					<Flex justify="between" align="center" mb="3">
						<Text as="h4" size="4" data-testid={`table-header-${table.name}`}>
							{table.name}
						</Text>
						<Button
							onClick={() => onDeleteTable(tableIndex)}
							variant="solid"
							color="red"
						>
							Delete Table
						</Button>
					</Flex>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								{table.columns.map((col, colIndex) => (
									<Table.ColumnHeaderCell key={colIndex}>
										{col.name}
									</Table.ColumnHeaderCell>
								))}
								<Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{table.rows.map((row, rowIndex) => (
								<TableRow
									key={rowIndex}
									tableIndex={tableIndex}
									row={row}
									rowIndex={rowIndex}
									columns={table.columns}
									editRowInfo={editRowInfo}
									handleRowChange={handleRowChange}
									handleEditRow={handleEditRow}
									handleSaveRow={handleSaveRow}
									handleDeleteRow={handleDeleteRow}
									validationErrors={validationErrors}
								/>
							))}
							<Table.Row>
								<Table.Cell colSpan={table.columns.length + 1}>
									<Button
										onClick={() => handleAddRow(tableIndex)}
										variant="outline"
									>
										Add Row
									</Button>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</Box>
			))}
		</>
	);
};

export default TableList;
