import { describe, it, expect, vi } from "vitest";
import { handleCartesianProduct } from "../hooks/cartesianProduct";

describe("handleCartesianProduct", () => {
	let tablesMock;
	let onUpdateTableMock;
	let setSelectedTable1Mock;
	let setSelectedTable2Mock;
	let setCartesianProductResultMock;

	beforeEach(() => {
		tablesMock = [
			{
				name: "Table1",
				columns: [{ name: "col1", type: "string" }],
				rows: [{ col1: "value1" }],
			},
			{
				name: "Table2",
				columns: [{ name: "col2", type: "string" }],
				rows: [{ col2: "value2" }],
			},
		];

		onUpdateTableMock = vi.fn();
		setSelectedTable1Mock = vi.fn();
		setSelectedTable2Mock = vi.fn();
		setCartesianProductResultMock = vi.fn();

		global.alert = vi.fn();
	});

	it("should not execute if one of the tables is not selected (onUpdateTable)", () => {
		const selectedTable1 = null;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(onUpdateTableMock).not.toHaveBeenCalled();
	});

	it("should not execute if one of the tables is not selected (setSelectedTable1)", () => {
		const selectedTable1 = null;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(setSelectedTable1Mock).not.toHaveBeenCalled();
	});

	it("should not execute if one of the tables is not selected (setSelectedTable2)", () => {
		const selectedTable1 = null;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(setSelectedTable2Mock).not.toHaveBeenCalled();
	});

	it("should not execute if one of the tables is not selected (setCartesianProductResult)", () => {
		const selectedTable1 = null;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(setCartesianProductResultMock).not.toHaveBeenCalled();
	});

	it("should alert if any table has no rows", () => {
		const tablesWithEmptyRows = [
			{
				name: "Table1",
				columns: [{ name: "col1", type: "string" }],
				rows: [],
			},
			tablesMock[1],
		];

		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesWithEmptyRows,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(global.alert).toHaveBeenCalledWith(
			"Обидві таблиці повинні мати рядки для об’єднання!"
		);
	});

	it("should combine columns correctly", () => {
		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		const expectedColumns = [
			{ name: "Table1_col1", type: "string" },
			{ name: "Table2_col2", type: "string" },
		];

		const resultTable = onUpdateTableMock.mock.calls[0][0][2];
		expect(resultTable.columns).toEqual(expectedColumns);
	});

	it("should combine rows correctly", () => {
		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		const expectedRows = [
			{
				Table1_col1: "value1",
				Table2_col2: "value2",
			},
		];

		const resultTable = onUpdateTableMock.mock.calls[0][0][2];
		expect(resultTable.rows).toEqual(expectedRows);
	});

	it("should reset selected tables after execution (setSelectedTable1)", () => {
		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(setSelectedTable1Mock).toHaveBeenCalledWith(null);
	});

	it("should reset selected tables after execution (setSelectedTable2)", () => {
		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(setSelectedTable2Mock).toHaveBeenCalledWith(null);
	});

	it("should reset cartesianProductResult after execution", () => {
		const selectedTable1 = 0;
		const selectedTable2 = 1;

		handleCartesianProduct(
			tablesMock,
			selectedTable1,
			selectedTable2,
			onUpdateTableMock,
			setSelectedTable1Mock,
			setSelectedTable2Mock,
			setCartesianProductResultMock
		);

		expect(setCartesianProductResultMock).toHaveBeenCalledWith(null);
	});
});
