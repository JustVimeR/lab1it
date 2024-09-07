import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Підключаємо стилі для календаря

// Функція для форматування дати у форматі DD.MM.YYYY
const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('uk-UA'); // Формат дати для України
};

function TableManager({ tables, onAddTable, onDeleteTable, onUpdateTable }) {
    const [newTableName, setNewTableName] = useState('');
    const [columns, setColumns] = useState([{ name: '', type: 'string' }]);
    const [editRowInfo, setEditRowInfo] = useState({ tableIndex: null, rowIndex: null }); // Зберігаємо індекс таблиці та рядка
    const [validationErrors, setValidationErrors] = useState({});

    // Валідація значень рядка залежно від типу
    const validateValue = (value, type) => {
        switch (type) {
            case 'integer':
                return Number.isInteger(Number(value)) ? null : 'Must be an integer';
            case 'real':
                return !isNaN(parseFloat(value)) ? null : 'Must be a real number';
            case 'char':
                return value.length === 1 ? null : 'Must be a single character';
            case 'string':
                return typeof value === 'string' ? null : 'Must be a string';
            case 'date':
                return value instanceof Date && !isNaN(value.getTime()) ? null : 'Must be a valid date';
            case 'dateInvl':
                return value.start instanceof Date && value.end instanceof Date && !isNaN(value.start.getTime()) && !isNaN(value.end.getTime())
                    ? null
                    : 'Must be a valid date interval';
            default:
                return null;
        }
    };

    const handleCreateTable = () => {
        if (newTableName.trim() !== '') {
            const newTable = {
                name: newTableName,
                columns,
                rows: [] // Порожній рядок
            };
            onAddTable(newTable);
            setNewTableName('');
            setColumns([{ name: '', type: 'string' }]);
        }
    };

    const handleAddColumn = () => {
        setColumns([...columns, { name: '', type: 'string' }]);
    };

    // Додавання нового рядка
    const handleAddRow = (tableIndex) => {
        const newRow = {};
        tables[tableIndex].columns.forEach(col => {
            if (col.type === 'dateInvl') {
                newRow[col.name] = { start: '', end: '' }; // Порожній інтервал дат
            } else {
                newRow[col.name] = ''; // Порожній рядок для кожної колонки
            }
        });

        const updatedTables = [...tables];
        updatedTables[tableIndex].rows.push(newRow);
        onUpdateTable(updatedTables);
    };

    // Видалення рядка
    const handleDeleteRow = (tableIndex, rowIndex) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rows.splice(rowIndex, 1); // Видаляємо рядок
        onUpdateTable(updatedTables);
    };

    // Обробка зміни рядка
    const handleRowChange = (tableIndex, rowIndex, columnName, value) => {
        const updatedTables = [...tables];
        const column = tables[tableIndex].columns.find(col => col.name === columnName);

        const error = validateValue(value, column.type);
        if (error) {
            setValidationErrors({
                ...validationErrors,
                [`${tableIndex}-${rowIndex}-${columnName}`]: error
            });
        } else {
            // Видаляємо помилку для цього поля, якщо немає помилки
            const newErrors = { ...validationErrors };
            delete newErrors[`${tableIndex}-${rowIndex}-${columnName}`];
            setValidationErrors(newErrors);
        }

        // Оновлюємо значення поля в рядку
        updatedTables[tableIndex].rows[rowIndex][columnName] = value;
        onUpdateTable(updatedTables);
    };

    // Увімкнення режиму редагування для конкретного рядка в таблиці
    const handleEditRow = (tableIndex, rowIndex) => {
        setEditRowInfo({ tableIndex, rowIndex });
    };

    // Завершення редагування рядка
    const handleSaveRow = () => {
        setEditRowInfo({ tableIndex: null, rowIndex: null }); // Вимикаємо режим редагування
    };

    return (
        <div>
            <h3>Create New Table</h3>
            <input
                type="text"
                placeholder="New table name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
            />
            <h4>Table Columns</h4>
            {columns.map((col, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Column name"
                        value={col.name}
                        onChange={(e) => {
                            const updatedColumns = [...columns];
                            updatedColumns[index].name = e.target.value;
                            setColumns(updatedColumns);
                        }}
                    />
                    <select
                        value={col.type}
                        onChange={(e) => {
                            const updatedColumns = [...columns];
                            updatedColumns[index].type = e.target.value;
                            setColumns(updatedColumns);
                        }}
                    >
                        <option value="string">String</option>
                        <option value="integer">Integer</option>
                        <option value="real">Real</option>
                        <option value="char">Char</option>
                        <option value="date">Date</option>
                        <option value="dateInvl">Date Interval</option>
                    </select>
                </div>
            ))}
            <Button onClick={handleAddColumn}>Add Column</Button>
            <Button onClick={handleCreateTable}>Create Table</Button>

            <hr />

            <h3>Existing Tables</h3>
            {tables.length > 0 ? (
                tables.map((table, tableIndex) => (
                    <div key={tableIndex}>
                        <h4>{table.name}</h4>
                        <Button onClick={() => onDeleteTable(tableIndex)}>Delete Table</Button>
                        <ul>
                            {table.columns.map((col, colIndex) => (
                                <li key={colIndex}>{col.name} ({col.type})</li>
                            ))}
                        </ul>

                        <h5>Rows:</h5>
                        <table border="1">
                            <thead>
                            <tr>
                                {table.columns.map((col, colIndex) => (
                                    <th key={colIndex}>{col.name}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {table.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {table.columns.map((col, colIndex) => (
                                        <td key={colIndex}>
                                            {editRowInfo.tableIndex === tableIndex && editRowInfo.rowIndex === rowIndex ? (
                                                <div>
                                                    {/* Рендеримо різні типи полів */}
                                                    {col.type === 'date' ? (
                                                        <DatePicker
                                                            selected={row[col.name] ? new Date(row[col.name]) : null}
                                                            onChange={(date) =>
                                                                handleRowChange(tableIndex, rowIndex, col.name, date)
                                                            }
                                                        />
                                                    ) : col.type === 'dateInvl' ? (
                                                        <>
                                                            <label>Start: </label>
                                                            <DatePicker
                                                                selected={row[col.name]?.start ? new Date(row[col.name].start) : null}
                                                                onChange={(date) =>
                                                                    handleRowChange(tableIndex, rowIndex, col.name, {
                                                                        ...row[col.name],
                                                                        start: date
                                                                    })
                                                                }
                                                            />
                                                            <label>End: </label>
                                                            <DatePicker
                                                                selected={row[col.name]?.end ? new Date(row[col.name].end) : null}
                                                                onChange={(date) =>
                                                                    handleRowChange(tableIndex, rowIndex, col.name, {
                                                                        ...row[col.name],
                                                                        end: date
                                                                    })
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={row[col.name] || ''}
                                                            onChange={(e) =>
                                                                handleRowChange(tableIndex, rowIndex, col.name, e.target.value)
                                                            }
                                                        />
                                                    )}
                                                    {validationErrors[`${tableIndex}-${rowIndex}-${col.name}`] && (
                                                        <p style={{ color: 'red' }}>
                                                            {validationErrors[`${tableIndex}-${rowIndex}-${col.name}`]}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span>
                                                        {col.type === 'date'
                                                            ? formatDate(row[col.name])
                                                            : col.type === 'dateInvl'
                                                                ? `${formatDate(row[col.name]?.start)} - ${formatDate(row[col.name]?.end)}`
                                                                : row[col.name]}
                                                    </span>
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        {editRowInfo.tableIndex === tableIndex && editRowInfo.rowIndex === rowIndex ? (
                                            <Button onClick={handleSaveRow}>Save Row</Button>
                                        ) : (
                                            <>
                                                <Button onClick={() => handleEditRow(tableIndex, rowIndex)}>Edit Row</Button>
                                                <Button onClick={() => handleDeleteRow(tableIndex, rowIndex)}>Delete Row</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={table.columns.length + 1}>
                                    <Button onClick={() => handleAddRow(tableIndex)}>Add Row</Button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No tables available</p>
            )}
        </div>
    );
}

export default TableManager;
