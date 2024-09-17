import React, { useState } from 'react';
import { Box, Button, Text, Flex, Table } from '@radix-ui/themes';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog';
import ColumnEditor from './ColumnEditor';
import TableRow from './TableRow';

function TableManager({ tables, onAddTable, onDeleteTable, onUpdateTable }) {
    const [columns, setColumns] = useState([{ name: '', type: 'string' }]);
    const [editRowInfo, setEditRowInfo] = useState({ tableIndex: null, rowIndex: null });
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedTable1, setSelectedTable1] = useState(null);
    const [selectedTable2, setSelectedTable2] = useState(null);
    const [cartesianProductResult, setCartesianProductResult] = useState(null);

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

        setEditRowInfo({ tableIndex, rowIndex: updatedTables[tableIndex].rows.length - 1 });
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
                return value.start instanceof Date && value.end instanceof Date &&
                !isNaN(value.start.getTime()) && !isNaN(value.end.getTime())
                    ? null
                    : 'Must be a valid date interval';
            default:
                return null;
        }
    };

    const handleCartesianProduct = () => {
        if (selectedTable1 !== null && selectedTable2 !== null) {
            const table1 = tables[selectedTable1];
            const table2 = tables[selectedTable2];

            if (table1.rows.length === 0 || table2.rows.length === 0) {
                alert('Обидві таблиці повинні мати рядки для об’єднання!');
                return;
            }

            const resultColumns = [
                ...table1.columns.map(col => ({ ...col, name: `${table1.name}_${col.name}` })),
                ...table2.columns.map(col => ({ ...col, name: `${table2.name}_${col.name}` }))
            ];

            const resultRows = [];

            for (let row1 of table1.rows) {
                for (let row2 of table2.rows) {
                    const combinedRow = {
                        ...Object.fromEntries(
                            Object.entries(row1).map(([key, value]) => [`${table1.name}_${key}`, value])
                        ),
                        ...Object.fromEntries(
                            Object.entries(row2).map(([key, value]) => [`${table2.name}_${key}`, value])
                        )
                    };
                    resultRows.push(combinedRow);
                }
            }

            const resultTable = {
                name: `${table1.name}_${table2.name}_Прямий добуток`,
                columns: resultColumns,
                rows: resultRows,
            };

            const updatedTables = [...tables, resultTable];
            onUpdateTable(updatedTables);
            setSelectedTable1(null);
            setSelectedTable2(null);
            setCartesianProductResult(null);
        }
    };





    return (
        <Box p="4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="solid" color="blue">Create New Table</Button>
                </DialogTrigger>
                <DialogContent
                    style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '100%',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                    }}
                >
                    <DialogTitle>Create a New Table</DialogTitle>
                    <ColumnEditor columns={columns} setColumns={setColumns} onAddTable={onAddTable} />
                </DialogContent>
            </Dialog>

            <hr style={{ margin: '20px 0' }} />

            <Text as="h3" size="5">Existing Tables</Text>
            {tables.length > 0 ? (
                <>
                    <Flex gap="4">
                    
                    <select
                        data-testid="selectTable1"
                        value={selectedTable1 || ''}
                        onChange={(e) => setSelectedTable1(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Select Table 1</option>
                        {tables.map((table, index) => (
                            <option key={index} value={index}>
                                {table.name}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        data-testid="selectTable2"
                        value={selectedTable2 || ''}
                        onChange={(e) => setSelectedTable2(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Select Table 2</option>
                        {tables.map((table, index) => (
                            <option key={index} value={index}>
                                {table.name}
                            </option>
                        ))}
                    </select>

                        <Button onClick={handleCartesianProduct} variant="solid" color="blue">
                            Прямий добуток
                        </Button>
                    </Flex>


                    {cartesianProductResult && (
                        <Box mt="4">
                            <Text as="h4">{cartesianProductResult.name}</Text>
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        {cartesianProductResult.columns.map((col, colIndex) => (
                                            <Table.ColumnHeaderCell key={colIndex}>{col.name}</Table.ColumnHeaderCell>
                                        ))}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {cartesianProductResult.rows.map((row, rowIndex) => (
                                        <Table.Row key={rowIndex}>
                                            {cartesianProductResult.columns.map((col, colIndex) => (
                                                <Table.Cell key={colIndex}>{row[col.name]}</Table.Cell>
                                            ))}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    )}


                    {tables.map((table, tableIndex) => (
                        <Box key={tableIndex} mb="4">
                            <Flex justify="between" align="center" mb="3">
                                <Text as="h4" size="4" data-testid={`table-header-${table.name}`}>{table.name}</Text>
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
                    ))}
                </>
            ) : (
                <Text>No tables available</Text>
            )}
        </Box>
    );
}

export default TableManager;
