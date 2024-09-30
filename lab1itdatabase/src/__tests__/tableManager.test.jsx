import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TableManager from "../components/TableManager";

describe("TableManager", () => {
	it("renders table name correctly", () => {
		const tables = [
			{
				name: "Test Table 1",
				columns: [{ name: "Column 1", type: "string" }],
				rows: [{ "Column 1": "Value 1" }],
			},
		];

		render(
			<TableManager
				tables={tables}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={vi.fn()}
			/>
		);
		const names = screen.getAllByText("Test Table 1");
		expect(names.length).toBeGreaterThan(0);
	});

	it("renders column name correctly", () => {
		const tables = [
			{
				name: "Test Table 1",
				columns: [{ name: "Column 1", type: "string" }],
				rows: [{ "Column 1": "Value 1" }],
			},
		];

		render(
			<TableManager
				tables={tables}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={vi.fn()}
			/>
		);
		expect(screen.getByText("Column 1")).toBeInTheDocument();
	});

	it("renders row value correctly", () => {
		const tables = [
			{
				name: "Test Table 1",
				columns: [{ name: "Column 1", type: "string" }],
				rows: [{ "Column 1": "Value 1" }],
			},
		];

		render(
			<TableManager
				tables={tables}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={vi.fn()}
			/>
		);
		expect(screen.getByText("Value 1")).toBeInTheDocument();
	});

	it("does not display dialog initially", () => {
		render(
			<TableManager
				tables={[]}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={vi.fn()}
			/>
		);

		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it('opens dialog when "Create New Table" button is clicked', async () => {
		const user = require("@testing-library/user-event").default;
		render(
			<TableManager
				tables={[]}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={vi.fn()}
			/>
		);

		const createButton = screen.getByText("Create New Table");

		await user.click(createButton);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it('renders dialog content correctly after "Create New Table" button is clicked', async () => {
		const user = require("@testing-library/user-event").default;
		render(
			<TableManager
				tables={[]}
				onAddTable={vi.fn()}
				onDeleteTable={vi.fn()}
				onUpdateTable={vi.fn()}
			/>
		);

		const createButton = screen.getByText("Create New Table");

		await user.click(createButton);

		expect(screen.getByText("Create a New Table")).toBeInTheDocument();
	});
});
