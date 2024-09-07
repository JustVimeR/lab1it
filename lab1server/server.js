const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;
const DATABASE_FILE = './database.json'; // Файл для збереження даних

app.use(bodyParser.json());
app.use(cors());

// Завантаження бази даних з файлу
app.get('/load-database', (req, res) => {
    fs.readFile(DATABASE_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error loading database' });
        }

        let database;
        try {
            database = JSON.parse(data || '{"databases": []}'); // Якщо файл порожній, створюємо порожній об'єкт
        } catch (error) {
            return res.status(500).json({ message: 'Error parsing database JSON' });
        }

        res.status(200).json(database);
    });
});

// Додавання нової бази даних
app.post('/add-database', (req, res) => {
    const { name } = req.body;
    fs.readFile(DATABASE_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database' });
        }

        let database;
        try {
            database = JSON.parse(data || '{"databases": []}');
        } catch (error) {
            return res.status(500).json({ message: 'Error parsing database JSON' });
        }

        // Додаємо нову базу даних до масиву
        database.databases.push({ name, tables: [] });

        // Записуємо оновлені дані до файлу
        fs.writeFile(DATABASE_FILE, JSON.stringify(database, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving database' });
            }
            res.status(200).json({ message: 'Database added successfully' });
        });
    });
});

// Оновлення бази даних
app.post('/save-database', (req, res) => {
    const { database } = req.body;

    fs.readFile(DATABASE_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading database' });
        }

        let dbData;
        try {
            dbData = JSON.parse(data || '{"databases": []}');
        } catch (error) {
            return res.status(500).json({ message: 'Error parsing database JSON' });
        }

        // Знайдемо індекс бази даних, яку потрібно оновити
        const dbIndex = dbData.databases.findIndex(db => db.name === database.name);
        if (dbIndex !== -1) {
            dbData.databases[dbIndex] = database; // Оновлюємо базу даних
        }

        // Записуємо оновлені дані до файлу
        fs.writeFile(DATABASE_FILE, JSON.stringify(dbData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving database' });
            }
            res.status(200).json({ message: 'Database saved successfully' });
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
