import React, { useState } from 'react';
import { Box, Button, Text, Flex, Table } from '@radix-ui/themes';
import ColumnEditor from './ColumnEditor';
import TableRow from './TableRow';

function TableManager({ tables, onAddTable, onDeleteTable, onUpdateTable }) {
    const [newTableName, setNewTableName] = useState('');
    const [columns, setColumns] = useState([{ name: '', type: 'string' }]);
    const [editRowInfo, setEditRowInfo] = useState({ tableIndex: null, rowIndex: null });
    const [validationErrors, setValidationErrors] = useState({});

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
                rows: []
            };
            onAddTable(newTable);
            setNewTableName('');
            setColumns([{ name: '', type: 'string' }]);
        }
    };

    const handleAddRow = (tableIndex) => {
        const newRow = {};
        tables[tableIndex].columns.forEach(col => {
            if (col.type === 'dateInvl') {
                newRow[col.name] = { start: '', end: '' };
            } else {
                newRow[col.name] = '';
            }
        });

        const updatedTables = [...tables];
        updatedTables[tableIndex].rows.push(newRow);
        onUpdateTable(updatedTables);
    };

    const handleDeleteRow = (tableIndex, rowIndex) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rows.splice(rowIndex, 1);
        onUpdateTable(updatedTables);
    };

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
            const newErrors = { ...validationErrors };
            delete newErrors[`${tableIndex}-${rowIndex}-${columnName}`];
            setValidationErrors(newErrors);
        }

        updatedTables[tableIndex].rows[rowIndex][columnName] = value;
        onUpdateTable(updatedTables);
    };

    const handleEditRow = (tableIndex, rowIndex) => {
        setEditRowInfo({ tableIndex, rowIndex });
    };

    const handleSaveRow = () => {
        setEditRowInfo({ tableIndex: null, rowIndex: null });
    };

    return (
        <Box p="4">
            <Text as="h3" size="5">Create New Table</Text>
            <Box mb="3">
                <input
                    type="text"
                    placeholder="New table name"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '8px' }}
                />
                <Button onClick={handleCreateTable} variant="solid" color="blue">Create Table</Button>
            </Box>
            <ColumnEditor columns={columns} setColumns={setColumns} />

            <hr style={{ margin: '20px 0' }} />

            <Text as="h3" size="5">Existing Tables</Text>
            {tables.length > 0 ? (
                tables.map((table, tableIndex) => (
                    <Box key={tableIndex} mb="4">
                        <Flex justify="between" align="center" mb="3">
                            <Text as="h4" size="4">{table.name}</Text>
                            <Button onClick={() => onDeleteTable(tableIndex)} variant="solid" color="red">
                                Delete Table
                            </Button>
                        </Flex>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    {table.columns.map((col, colIndex) => (
                                        <Table.ColumnHeaderCell key={colIndex}>{col.name}</Table.ColumnHeaderCell>
                                    ))}
                                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {table.rows.map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        tableIndex={tableIndex}
                                        row={row}
                                        rowIndex={rowIndex}
                                        columns={table.columns}
                                        editRowInfo={editRowInfo}
                                        handleRowChange={handleRowChange}
                                        handleEditRow={handleEditRow}
                                        handleSaveRow={handleSaveRow}
                                        handleDeleteRow={handleDeleteRow}
                                        validationErrors={validationErrors}
                                    />
                                ))}
                                <Table.Row>
                                    <Table.Cell colSpan={table.columns.length + 1}>
                                        <Button onClick={() => handleAddRow(tableIndex)} variant="outline">
                                            Add Row
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Box>
                ))
            ) : (
                <Text>No tables available</Text>
            )}
        </Box>
    );
}

export default TableManager;
