import React from "react";
import { Box, Text, Table } from "@radix-ui/themes";

const CartesianProductResult = ({ cartesianProductResult }) => {
	if (!cartesianProductResult) {
		return null;
	}

	return (
		<Box mt="4">
			<Text as="h4">{cartesianProductResult.name}</Text>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						{cartesianProductResult.columns.map((col, colIndex) => (
							<Table.ColumnHeaderCell key={colIndex}>
								{col.name}
							</Table.ColumnHeaderCell>
						))}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{cartesianProductResult.rows.map((row, rowIndex) => (
						<Table.Row key={rowIndex}>
							{cartesianProductResult.columns.map((col, colIndex) => (
								<Table.Cell key={colIndex}>{row[col.name]}</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default CartesianProductResult;
