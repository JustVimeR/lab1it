const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;
const DATABASE_FILE = path.join(__dirname, "database.json");

app.use(bodyParser.json());
app.use(cors());

// Helper function to read the database
const readDatabase = () => {
	try {
		const data = fs.readFileSync(DATABASE_FILE, "utf-8");
		return JSON.parse(data || '{"databases": []}');
	} catch (err) {
		throw new Error("Error reading the database file");
	}
};

// Helper function to write the database
const writeDatabase = (data) => {
	try {
		fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
	} catch (err) {
		throw new Error("Error writing to the database file");
	}
};

// GET /databases - Get the list of all databases
app.get("/databases", (req, res) => {
	try {
		const database = readDatabase();
		res.status(200).json(database);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// POST /databases - Create a new database
app.post("/databases", (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ message: "Database name is required" });
	}

	try {
		const database = readDatabase();
		database.databases.push({ name, tables: [] });
		writeDatabase(database);

		res.status(201).json({ message: "Database created successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// PUT /databases/:name - Update an existing database
app.put("/databases/:name", (req, res) => {
	const { name } = req.params;
	const { database: newDatabase } = req.body;

	if (!newDatabase) {
		return res.status(400).json({ message: "Database data is required" });
	}

	try {
		const dbData = readDatabase();
		const dbIndex = dbData.databases.findIndex((db) => db.name === name);

		if (dbIndex === -1) {
			return res.status(404).json({ message: "Database not found" });
		}

		dbData.databases[dbIndex] = newDatabase;
		writeDatabase(dbData);

		res.status(200).json({ message: "Database updated successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// DELETE /databases/:name - Delete a database
app.delete("/databases/:name", (req, res) => {
	const { name } = req.params;

	try {
		const dbData = readDatabase();
		const dbIndex = dbData.databases.findIndex((db) => db.name === name);

		if (dbIndex === -1) {
			return res.status(404).json({ message: "Database not found" });
		}

		dbData.databases.splice(dbIndex, 1);
		writeDatabase(dbData);

		res.status(200).json({ message: "Database deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
