import { describe, it, expect, vi } from "vitest";
import { handleCartesianProduct } from "../components/TableManager";

describe("handleCartesianProduct", () => {
	const tablesMock = [
		{
			name: "Test1",
			columns: [{ name: "col1", type: "string" }],
			rows: [{ col1: "value1" }],
		},
		{
			name: "Test2",
			columns: [{ name: "col2", type: "string" }],
			rows: [{ col2: "value2" }],
		},
	];

	let onUpdateTableMock;
	let setSelectedTable1Mock;
	let setSelectedTable2Mock;
	let setCartesianProductResultMock;

	beforeEach(() => {
		onUpdateTableMock = vi.fn();
		setSelectedTable1Mock = vi.fn();
		setSelectedTable2Mock = vi.fn();
		setCartesianProductResultMock = vi.fn();
	});

	it("should not execute if one of the tables is not selected", () => {
		const selectedTable1 = null;
		const selectedTable2 = 1;

		handleCartesianProduct({
			selectedTable1,
			selectedTable2,
			tables: tablesMock,
			onUpdateTable: onUpdateTableMock,
			setSelectedTable1: setSelectedTable1Mock,
			setSelectedTable2: setSelectedTable2Mock,
			setCartesianProductResult: setCartesianProductResultMock,
		});

		expect(onUpdateTableMock).not.toHaveBeenCalled();
	});

	it("should alert if any table has no rows", () => {
		global.alert = vi.fn();

		const tablesWithEmptyRows = [
			{
				name: "Test1",
				columns: [{ name: "col1", type: "string" }],
				rows: [],
			},
			tablesMock[1],
		];

		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct({
			selectedTable1,
			selectedTable2,
			tables: tablesWithEmptyRows,
			onUpdateTable: onUpdateTableMock,
			setSelectedTable1: setSelectedTable1Mock,
			setSelectedTable2: setSelectedTable2Mock,
			setCartesianProductResult: setCartesianProductResultMock,
		});

		expect(global.alert).toHaveBeenCalledWith(
			"Обидві таблиці повинні мати рядки для об’єднання!"
		);
		expect(onUpdateTableMock).not.toHaveBeenCalled();
	});

	it("should combine columns and rows correctly", () => {
		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct({
			selectedTable1,
			selectedTable2,
			tables: tablesMock,
			onUpdateTable: onUpdateTableMock,
			setSelectedTable1: setSelectedTable1Mock,
			setSelectedTable2: setSelectedTable2Mock,
			setCartesianProductResult: setCartesianProductResultMock,
		});

		expect(onUpdateTableMock).toHaveBeenCalledWith([
			...tablesMock,
			{
				name: "Test1_Test2_Прямий добуток",
				columns: [
					{ name: "Test1_col1", type: "string" },
					{ name: "Test2_col2", type: "string" },
				],
				rows: [
					{
						Test1_col1: "value1",
						Test2_col2: "value2",
					},
				],
			},
		]);
	});

	it("should reset selected tables and cartesianProductResult after execution", () => {
		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct({
			selectedTable1,
			selectedTable2,
			tables: tablesMock,
			onUpdateTable: onUpdateTableMock,
			setSelectedTable1: setSelectedTable1Mock,
			setSelectedTable2: setSelectedTable2Mock,
			setCartesianProductResult: setCartesianProductResultMock,
		});

		expect(setSelectedTable1Mock).toHaveBeenCalledWith(null);
		expect(setSelectedTable2Mock).toHaveBeenCalledWith(null);
		expect(setCartesianProductResultMock).toHaveBeenCalledWith(null);
	});
});
