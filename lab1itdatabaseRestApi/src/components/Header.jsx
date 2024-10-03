import React, { useState } from "react";
import { Button, Container, Flex } from "@radix-ui/themes";

function Header({
	onCreateDatabase,
	databases,
	activeDatabaseIndex,
	setActiveDatabaseIndex,
}) {
	const [dbName, setDbName] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleCreateDatabase = () => {
		if (dbName.trim() !== "") {
			onCreateDatabase(dbName);
			setDbName("");
			setIsModalOpen(false);
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
							<Button
								key={index}
								variant={index === activeDatabaseIndex ? "solid" : "soft"}
								onClick={() => setActiveDatabaseIndex(index)}
							>
								{db.name}
							</Button>
						))
					) : (
						<p>No databases available</p>
					)}
				</Flex>
			</Flex>

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
