import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableManager from "../components/TableManager";

describe("TableManager Component - Cartesian Product", () => {
	const tablesMock = [
		{
			name: "Тест1",
			columns: [
				{ name: "ряд", type: "string" },
				{ name: "циф", type: "integer" },
				{ name: "рил", type: "real" },
				{ name: "чар", type: "char" },
			],
			rows: [
				{ ряд: "asdfffsdf", циф: 31, рил: 2.123, чар: "h" },
				{ ряд: "аааааааааа", циф: 124, рил: 1.1, чар: "п" },
				{ ряд: "півфп", циф: 312, рил: 3.1, чар: "а" },
			],
		},
		{
			name: "Тест2",
			columns: [
				{ name: "ряд", type: "string" },
				{ name: "циф", type: "integer" },
				{ name: "рил", type: "real" },
				{ name: "чар", type: "char" },
			],
			rows: [
				{ ряд: "тестове значення", циф: 100, рил: 1.5, чар: "x" },
				{ ряд: "друге значення", циф: 200, рил: 2.5, чар: "y" },
			],
		},
	];

	const onUpdateTableMock = vi.fn();

	it("renders table header for table Тест1", () => {
		render(
			<TableManager
				tables={tablesMock}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={onUpdateTableMock}
			/>
		);

		expect(screen.getByTestId("table-header-Тест1")).toBeInTheDocument();
	});

	it("renders table header for table Тест2", () => {
		render(
			<TableManager
				tables={tablesMock}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={onUpdateTableMock}
			/>
		);

		expect(screen.getByTestId("table-header-Тест2")).toBeInTheDocument();
	});

	it("selects the first table from the dropdown", () => {
		render(
			<TableManager
				tables={tablesMock}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={onUpdateTableMock}
			/>
		);

		const selectTable1 = screen.getByTestId("selectTable1");
		fireEvent.change(selectTable1, { target: { value: "0" } });

		expect(selectTable1.value).toBe("0");
	});

	it("selects the second table from the dropdown", () => {
		render(
			<TableManager
				tables={tablesMock}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={onUpdateTableMock}
			/>
		);

		const selectTable2 = screen.getByTestId("selectTable2");
		fireEvent.change(selectTable2, { target: { value: "1" } });

		expect(selectTable2.value).toBe("1");
	});

	it("calls onUpdateTableMock once when Cartesian product button is clicked", () => {
		render(
			<TableManager
				tables={tablesMock}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={onUpdateTableMock}
			/>
		);

		const selectTable1 = screen.getByTestId("selectTable1");
		fireEvent.change(selectTable1, { target: { value: "0" } });

		const selectTable2 = screen.getByTestId("selectTable2");
		fireEvent.change(selectTable2, { target: { value: "1" } });

		const cartesianProductButton = screen.getByText("Прямий добуток");
		fireEvent.click(cartesianProductButton);

		expect(onUpdateTableMock).toHaveBeenCalledTimes(1);
	});
});
