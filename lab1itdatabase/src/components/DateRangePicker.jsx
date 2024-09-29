import React from "react";
import DatePicker from "react-datepicker";
import { Flex, Text } from "@radix-ui/themes";
import "react-datepicker/dist/react-datepicker.css";
import "./TableRow.css";

function DateRangePicker({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	validationError,
}) {
	return (
		<Flex direction="column" gap="2">
			<Text>Start:</Text>
			<DatePicker
				selected={startDate ? new Date(startDate) : null}
				onChange={(date) => {
					if (endDate && date > new Date(endDate)) {
						alert("Start date cannot be later than end date");
					} else {
						onStartDateChange(date);
					}
				}}
				dateFormat="dd.MM.yyyy"
				className="date-picker"
				popperPlacement="auto"
			/>
			<Text>End:</Text>
			<DatePicker
				selected={endDate ? new Date(endDate) : null}
				onChange={(date) => onEndDateChange(date)}
				dateFormat="dd.MM.yyyy"
				className="date-picker"
				popperPlacement="auto"
				minDate={startDate ? new Date(startDate) : null}
			/>
			{validationError && (
				<Text color="red" size="1">
					{validationError}
				</Text>
			)}
		</Flex>
	);
}

export default DateRangePicker;
