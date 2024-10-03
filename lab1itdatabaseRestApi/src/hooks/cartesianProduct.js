export const handleCartesianProduct = (
	tables,
	selectedTable1,
	selectedTable2,
	onUpdateTable,
	setSelectedTable1,
	setSelectedTable2,
	setCartesianProductResult
) => {
	if (selectedTable1 !== null && selectedTable2 !== null) {
		const table1 = tables[selectedTable1];
		const table2 = tables[selectedTable2];

		if (table1.rows.length === 0 || table2.rows.length === 0) {
			alert("Обидві таблиці повинні мати рядки для об’єднання!");
			return;
		}

		const resultColumns = [
			...table1.columns.map((col) => ({
				...col,
				name: `${table1.name}_${col.name}`,
			})),
			...table2.columns.map((col) => ({
				...col,
				name: `${table2.name}_${col.name}`,
			})),
		];

		const resultRows = [];

		for (let row1 of table1.rows) {
			for (let row2 of table2.rows) {
				const combinedRow = {
					...Object.fromEntries(
						Object.entries(row1).map(([key, value]) => [
							`${table1.name}_${key}`,
							value,
						])
					),
					...Object.fromEntries(
						Object.entries(row2).map(([key, value]) => [
							`${table2.name}_${key}`,
							value,
						])
					),
				};
				resultRows.push(combinedRow);
			}
		}

		const resultTable = {
			name: `${table1.name}_${table2.name}_Прямий добуток`,
			columns: resultColumns,
			rows: resultRows,
		};

		const updatedTables = [...tables, resultTable];
		onUpdateTable(updatedTables);
		setSelectedTable1(null);
		setSelectedTable2(null);
		setCartesianProductResult(null);
	}
};
