import React, { useState } from 'react';
//Ne uzabelne
function CreateTableForm({ onCreateTable }) {
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState([{ name: '', type: 'string' }]);

    const handleAddColumn = () => {
        setColumns([...columns, { name: '', type: 'string' }]);
    };

    const handleCreateTable = () => {
        if (tableName && columns.length > 0) {
            onCreateTable({ tableName, columns });
            setTableName('');
            setColumns([{ name: '', type: 'string' }]);
        }
    };

    return (
        <div>
            <h3>Create New Table</h3>
            <input
                type="text"
                placeholder="Table Name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
            />
            <h4>Columns</h4>
            {columns.map((col, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Column Name"
                        value={col.name}
                        onChange={(e) => {
                            const newColumns = [...columns];
                            newColumns[index].name = e.target.value;
                            setColumns(newColumns);
                        }}
                    />
                    <select
                        value={col.type}
                        onChange={(e) => {
                            const newColumns = [...columns];
                            newColumns[index].type = e.target.value;
                            setColumns(newColumns);
                        }}
                    >
                        <option value="string">String</option>
                        <option value="integer">Integer</option>
                        <option value="real">Real</option>
                        <option value="char">Char</option>
                    </select>
                </div>
            ))}
            <button onClick={handleAddColumn}>Add Column</button>
            <button onClick={handleCreateTable}>Create Table</button>
        </div>
    );
}

export default CreateTableForm;
