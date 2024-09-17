import { useState } from 'react';
import { Table } from "@radix-ui/themes";
import * as Dialog from '@radix-ui/react-dialog';
import { saveToLocalStorage } from '../utils/localStorageUtils';

const validateField = (value, type) => {
    switch (type) {
        case 'integer':
            return /^-?\d+$/.test(value) ? true : 'Must be an integer';
        case 'real':
            return /^-?\d*(\.\d+)?$/.test(value) ? true : 'Must be a real number';
        case 'char':
            return value.length === 1 ? true : 'Must be a single character';
        case 'string':
            return value.length > 1 ? true : 'Must be a string (more than 1 character)';
        default:
            return true;
    }
};

function MainTable({ tableData = { columns: [], rows: [] }, onAddRow, tableIndex, setTables, tables }) {
    const [newRow, setNewRow] = useState({});
    const [editingRow, setEditingRow] = useState(null);
    const [editData, setEditData] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const handleAddRow = () => {
        let isValid = true;
        const newErrors = {};

        tableData.columns.forEach((col) => {
            const validation = validateField(newRow[col.name], col.type);
            if (validation !== true) {
                isValid = false;
                newErrors[col.name] = validation;
            }
        });

        if (isValid) {
            onAddRow(newRow);
            setNewRow({});
            setErrors({});
        } else {
            setErrors(newErrors);
        }
    };

    const handleEditRow = (rowIndex) => {
        setEditingRow(rowIndex);
        setEditData(tableData.rows[rowIndex]);
        setIsDialogOpen(true);
    };

    const handleSaveEdit = () => {
        let isValid = true;
        const newErrors = {};

        tableData.columns.forEach((col) => {
            const validation = validateField(editData[col.name], col.type);
            if (validation !== true) {
                isValid = false;
                newErrors[col.name] = validation;
            }
        });

        if (isValid) {
            const updatedTables = [...tables];
            updatedTables[tableIndex].rows[editingRow] = editData;
            setTables(updatedTables);
            setIsDialogOpen(false);
            saveToLocalStorage(updatedTables);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        {tableData.columns.map((col, index) => (
                            <Table.ColumnHeaderCell key={index}>{col.name}</Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableData.rows.map((row, rowIndex) => (
                        <Table.Row key={rowIndex} onDoubleClick={() => handleEditRow(rowIndex)}>
                            {tableData.columns.map((col, colIndex) => (
                                <Table.Cell key={colIndex}>
                                    {row[col.name]}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                    <Table.Row>
                        {tableData.columns.map((col, colIndex) => (
                            <Table.Cell key={colIndex}>
                                <input
                                    type="text"
                                    value={newRow[col.name] || ''}
                                    onChange={(e) =>
                                        setNewRow({ ...newRow, [col.name]: e.target.value })
                                    }
                                />
                                {errors[col.name] && <p style={{ color: 'red' }}>{errors[col.name]}</p>}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                </Table.Body>
            </Table.Root>
            <button onClick={handleAddRow}>Add Row</button>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Overlay />
                <Dialog.Content>
                    <Dialog.Title>Edit Row</Dialog.Title>
                    {tableData.columns.map((col, colIndex) => (
                        <div key={colIndex}>
                            <label>{col.name} ({col.type})</label>
                            <input
                                type="text"
                                value={editData[col.name] || ''}
                                onChange={(e) =>
                                    setEditData({ ...editData, [col.name]: e.target.value })
                                }
                            />
                            {errors[col.name] && <p style={{ color: 'red' }}>{errors[col.name]}</p>}
                        </div>
                    ))}
                    <button onClick={handleSaveEdit}>Save</button>
                    <Dialog.Close>Cancel</Dialog.Close>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
}

export default MainTable;
