export const validateValue = (value, type) => {
	switch (type) {
		case "integer":
			return Number.isInteger(Number(value)) ? null : "Must be an integer";
		case "real":
			return !isNaN(parseFloat(value)) ? null : "Must be a real number";
		case "char":
			return value.length === 1 ? null : "Must be a single character";
		case "string":
			return typeof value === "string" ? null : "Must be a string";
		case "date":
			return value instanceof Date && !isNaN(value.getTime())
				? null
				: "Must be a valid date";
		case "dateInvl":
			return value.start instanceof Date &&
				value.end instanceof Date &&
				!isNaN(value.start.getTime()) &&
				!isNaN(value.end.getTime())
				? null
				: "Must be a valid date interval";
		default:
			return null;
	}
};
