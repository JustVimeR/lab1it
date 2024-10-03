import React from "react";
import { Button, Flex } from "@radix-ui/themes";

const TableSelector = ({
	tables,
	selectedTable1,
	setSelectedTable1,
	selectedTable2,
	setSelectedTable2,
	handleCartesianProduct,
}) => {
	return (
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

			<Button onClick={handleCartesianProduct} variant="solid" color="blue">
				Прямий добуток
			</Button>
		</Flex>
	);
};

export default TableSelector;
