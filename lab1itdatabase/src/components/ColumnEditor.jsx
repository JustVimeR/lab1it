import React from 'react';
import { Box, Flex, Button, Text, Select } from '@radix-ui/themes';

function ColumnEditor({ columns, setColumns }) {
    const handleAddColumn = () => {
        setColumns([...columns, { name: '', type: 'string' }]);
    };

    const handleColumnChange = (index, field, value) => {
        const updatedColumns = [...columns];
        updatedColumns[index][field] = value;
        setColumns(updatedColumns);
    };

    return (
        <Box>
            <Text as="h4" size="4" mb="3">Table Columns</Text>
            {columns.map((col, index) => (
                <Flex key={index} align="center" gap="3" mb="2">
                    <input
                        type="text"
                        placeholder="Column name"
                        value={col.name}
                        onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                        style={{
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            width: '100%',
                            flex: 2,
                        }}
                    />
                    <select
                        value={col.type}
                        onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                        style={{
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            flex: 1,
                        }}
                    >
                        <option value="string">String</option>
                        <option value="integer">Integer</option>
                        <option value="real">Real</option>
                        <option value="char">Char</option>
                        <option value="date">Date</option>
                        <option value="dateInvl">Date Interval</option>
                    </select>
                </Flex>
            ))}
            <Button variant="solid" onClick={handleAddColumn} color="green" size="2">
                Add Column
            </Button>
        </Box>
    );
}

export default ColumnEditor;
