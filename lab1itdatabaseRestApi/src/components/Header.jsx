import React, { useState } from "react";
import { Button, Container, Flex } from "@radix-ui/themes";
import { AiFillDelete } from "react-icons/ai";

function Header({
	onCreateDatabase,
	onDeleteDatabase,
	databases,
	activeDatabaseIndex,
	setActiveDatabaseIndex,
}) {
	const [dbName, setDbName] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [databaseToDelete, setDatabaseToDelete] = useState(null);

	const handleCreateDatabase = () => {
		if (dbName.trim() !== "") {
			onCreateDatabase(dbName);
			setDbName("");
			setIsModalOpen(false);
		}
	};

	const handleDeleteClick = (dbName) => {
		setDatabaseToDelete(dbName);
		setIsConfirmModalOpen(true);
	};

	const handleConfirmDelete = () => {
		if (databaseToDelete) {
			onDeleteDatabase(databaseToDelete);
			setIsConfirmModalOpen(false);
		}
	};

	return (
		<Container position={"sticky"} top={0} maxWidth="100%">
			<Flex gap="4px" justify="between" align="center">
				<Flex gap="4px">
					<Button onClick={() => setIsModalOpen(true)}>Create new DB</Button>
				</Flex>

				<Flex gap="8px">
					{databases.length > 0 ? (
						databases.map((db, index) => (
							<Flex key={index} align="center" gap="8px">
								<Button
									variant={index === activeDatabaseIndex ? "solid" : "soft"}
									onClick={() => setActiveDatabaseIndex(index)}
								>
									{db.name}
								</Button>

								<Button
									variant="soft"
									onClick={() => handleDeleteClick(db.name)}
									style={{
										backgroundColor: "#f44336",
										color: "white",
										fontWeight: "bold",
										border: "none",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<AiFillDelete size={20} />
								</Button>
							</Flex>
						))
					) : (
						<p>No databases available</p>
					)}
				</Flex>
			</Flex>

			{isConfirmModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h2>Are you sure you want to delete this database?</h2>
						<Flex gap="8px" mt="10px">
							<Button
								onClick={handleConfirmDelete}
								style={{
									backgroundColor: "#f44336",
									color: "white",
									padding: "8px 16px",
									borderRadius: "4px",
									fontWeight: "bold",
									cursor: "pointer",
									border: "none",
									transition: "background-color 0.3s",
								}}
							>
								Delete
							</Button>
							<Button
								onClick={() => setIsConfirmModalOpen(false)}
								style={{
									backgroundColor: "#4CAF50",
									color: "white",
									padding: "8px 16px",
									borderRadius: "4px",
									fontWeight: "bold",
									cursor: "pointer",
									border: "none",
									transition: "background-color 0.3s",
								}}
							>
								Cancel
							</Button>
						</Flex>
					</div>
				</div>
			)}

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h2>Create New Database</h2>
						<input
							type="text"
							placeholder="Database Name"
							value={dbName}
							onChange={(e) => setDbName(e.target.value)}
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "4px",
								border: "1px solid #ccc",
								marginBottom: "15px",
								fontSize: "16px",
							}}
						/>
						<Flex gap="8px" mt="10px">
							<Button
								onClick={handleCreateDatabase}
								style={{
									backgroundColor: "#4CAF50",
									color: "white",
									padding: "8px 16px",
									borderRadius: "4px",
									fontWeight: "bold",
									cursor: "pointer",
									border: "none",
									transition: "background-color 0.3s",
								}}
								onPointerEnter={(e) =>
									(e.target.style.backgroundColor = "#45a049")
								}
								onPointerLeave={(e) =>
									(e.target.style.backgroundColor = "#4CAF50")
								}
							>
								Create
							</Button>
							<Button
								onClick={() => setIsModalOpen(false)}
								style={{
									backgroundColor: "#f44336",
									color: "white",
									padding: "8px 16px",
									borderRadius: "4px",
									fontWeight: "bold",
									cursor: "pointer",
									border: "none",
									transition: "background-color 0.3s",
								}}
								onPointerEnter={(e) =>
									(e.target.style.backgroundColor = "#d32f2f")
								}
								onPointerLeave={(e) =>
									(e.target.style.backgroundColor = "#f44336")
								}
							>
								Cancel
							</Button>
						</Flex>
					</div>
				</div>
			)}
		</Container>
	);
}

export default Header;
