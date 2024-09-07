import { useState, useEffect } from 'react';
import axios from 'axios';

// Логіка для роботи з базами даних
const useDatabaseManager = () => {
    const [databases, setDatabases] = useState([]);
    const [activeDatabaseIndex, setActiveDatabaseIndex] = useState(0);

    // Завантаження баз даних з сервера при рендері
    useEffect(() => {
        loadDatabases();
    }, []);

    // Завантаження баз даних з сервера
    const loadDatabases = async () => {
        try {
            const response = await axios.get('http://localhost:3001/load-database');
            setDatabases(response.data.databases || []);
        } catch (error) {
            console.error('Error loading databases:', error);
        }
    };

    // Створення нової бази даних
    const handleCreateDatabase = async (name) => {
        const newDatabase = { name, tables: [] };
        try {
            await axios.post('http://localhost:3001/add-database', { name });
            setDatabases([...databases, newDatabase]);
            setActiveDatabaseIndex(databases.length);
        } catch (error) {
            console.error('Error creating database:', error);
        }
    };

    // Оновлення бази даних на сервері
    const saveDatabase = async (updatedDatabase) => {
        try {
            await axios.post('http://localhost:3001/save-database', { database: updatedDatabase });
        } catch (error) {
            console.error('Error saving database:', error);
        }
    };

    // Додавання нової таблиці в активну базу
    const handleAddTableToActiveDatabase = (newTable) => {
        const updatedDatabases = [...databases];
        updatedDatabases[activeDatabaseIndex].tables.push(newTable);
        setDatabases(updatedDatabases);
        saveDatabase(updatedDatabases[activeDatabaseIndex]);
    };

    // Видалення таблиці
    const handleDeleteTable = (tableIndex) => {
        const updatedDatabases = [...databases];
        updatedDatabases[activeDatabaseIndex].tables = updatedDatabases[activeDatabaseIndex].tables.filter(
            (_, index) => index !== tableIndex
        );
        setDatabases(updatedDatabases);
        saveDatabase(updatedDatabases[activeDatabaseIndex]);
    };

    // Оновлення таблиць
    const handleUpdateTables = (updatedTables) => {
        const updatedDatabases = [...databases];
        updatedDatabases[activeDatabaseIndex].tables = updatedTables;
        setDatabases(updatedDatabases);
        saveDatabase(updatedDatabases[activeDatabaseIndex]);
    };

    return {
        databases,
        activeDatabaseIndex,
        setActiveDatabaseIndex,
        handleCreateDatabase,
        handleAddTableToActiveDatabase,
        handleDeleteTable,
        handleUpdateTables,
    };
};

export default useDatabaseManager;
