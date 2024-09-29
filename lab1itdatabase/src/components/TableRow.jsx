import React, { forwardRef } from "react";
import { Box, Button, Table, Text, Flex } from "@radix-ui/themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import DateRangePicker from "./DateRangePicker";
import { formatDate } from "../utils/dateUtils";
import DatePicker from "react-datepicker";
import "./TableRow.css";

const IconButton = forwardRef(({ children, ...props }, ref) => (
	<button ref={ref} {...props} className="icon-button">
		{children}
	</button>
));

function TableRow({
	tableIndex,
	row,
	rowIndex,
	columns,
	editRowInfo,
	handleRowChange,
	handleEditRow,
	handleSaveRow,
	handleDeleteRow,
	validationErrors,
}) {
	const hasValidationErrors = () => {
		return columns.some(
			(col) => validationErrors[`${tableIndex}-${rowIndex}-${col.name}`]
		);
	};

	return (
		<Table.Row>
			{columns.map((col, colIndex) => (
				<Table.Cell key={colIndex}>
					{editRowInfo.tableIndex === tableIndex &&
					editRowInfo.rowIndex === rowIndex ? (
						<Box>
							{col.type === "date" ? (
								<DatePicker
									selected={row[col.name] ? new Date(row[col.name]) : null}
									onChange={(date) =>
										handleRowChange(tableIndex, rowIndex, col.name, date)
									}
									dateFormat="dd.MM.yyyy"
									className="date-picker"
									popperPlacement="auto"
								/>
							) : col.type === "dateInvl" ? (
								<DateRangePicker
									startDate={row[col.name]?.start}
									endDate={row[col.name]?.end}
									onStartDateChange={(start) =>
										handleRowChange(tableIndex, rowIndex, col.name, {
											...row[col.name],
											start,
										})
									}
									onEndDateChange={(end) =>
										handleRowChange(tableIndex, rowIndex, col.name, {
											...row[col.name],
											end,
										})
									}
									validationError={
										validationErrors[`${tableIndex}-${rowIndex}-${col.name}`]
									}
								/>
							) : (
								<input
									type="text"
									value={row[col.name] || ""}
									onChange={(e) =>
										handleRowChange(
											tableIndex,
											rowIndex,
											col.name,
											e.target.value
										)
									}
									className="input-text"
								/>
							)}
							{validationErrors[`${tableIndex}-${rowIndex}-${col.name}`] && (
								<Text color="red" size="1">
									{validationErrors[`${tableIndex}-${rowIndex}-${col.name}`]}
								</Text>
							)}
						</Box>
					) : (
						<Text>
							{col.type === "date"
								? formatDate(row[col.name])
								: col.type === "dateInvl"
								? `${
										row[col.name]?.start ? formatDate(row[col.name].start) : ""
								  } - ${
										row[col.name]?.end ? formatDate(row[col.name].end) : ""
								  }`
								: row[col.name]}
						</Text>
					)}
				</Table.Cell>
			))}

			<Table.Cell>
				{editRowInfo.tableIndex === tableIndex &&
				editRowInfo.rowIndex === rowIndex ? (
					<Button
						onClick={handleSaveRow}
						variant="solid"
						color="green"
						disabled={hasValidationErrors()}
					>
						Save Row
					</Button>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<IconButton>
								<DotsVerticalIcon style={{ width: "20px", height: "20px" }} />
							</IconButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							style={{ borderRadius: "8px", padding: "8px" }}
						>
							<DropdownMenuItem
								onClick={() => handleEditRow(tableIndex, rowIndex)}
								className="dropdown-menu-item"
							>
								Edit Row
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleDeleteRow(tableIndex, rowIndex)}
								className="dropdown-menu-item"
							>
								Delete Row
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</Table.Cell>
		</Table.Row>
	);
}

export default TableRow;
