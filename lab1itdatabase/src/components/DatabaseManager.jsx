import React from "react";
import Header from "./Header";
import TableManager from "./TableManager";
import useDatabaseManager from "../hooks/useDatabaseManager";

function DatabaseManager() {
	const {
		databases,
		activeDatabaseIndex,
		setActiveDatabaseIndex,
		handleCreateDatabase,
		handleAddTableToActiveDatabase,
		handleDeleteTable,
		handleUpdateTables,
		handleDeleteDatabase,
	} = useDatabaseManager();

	return (
		<div>
			<Header
				onCreateDatabase={handleCreateDatabase}
				databases={databases}
				handleDeleteDatabase={handleDeleteDatabase}
				activeDatabaseIndex={activeDatabaseIndex}
				setActiveDatabaseIndex={setActiveDatabaseIndex}
			/>

			{databases.length > 0 && (
				<TableManager
					tables={databases[activeDatabaseIndex]?.tables || []}
					onAddTable={handleAddTableToActiveDatabase}
					onDeleteTable={handleDeleteTable}
					onUpdateTable={handleUpdateTables}
				/>
			)}
		</div>
	);
}

export default DatabaseManager;
