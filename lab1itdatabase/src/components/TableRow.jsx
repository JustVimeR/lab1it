import React, { forwardRef } from 'react';
import { Box, Button, Table, Text, Flex } from '@radix-ui/themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import DatePicker from 'react-datepicker';
import { formatDate } from '../utils/dateUtils';
import 'react-datepicker/dist/react-datepicker.css';

const IconButton = forwardRef(({ children, ...props }, ref) => (
    <button
        ref={ref}
        {...props}
        style={{
            padding: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {children}
    </button>
));

function TableRow({ tableIndex, row, rowIndex, columns, editRowInfo, handleRowChange, handleEditRow, handleSaveRow, handleDeleteRow, validationErrors }) {
    return (
        <Table.Row>
            {columns.map((col, colIndex) => (
                <Table.Cell key={colIndex}>
                    {editRowInfo.tableIndex === tableIndex && editRowInfo.rowIndex === rowIndex ? (
                        <Box>
                            {col.type === 'date' ? (
                                <DatePicker
                                    selected={row[col.name] ? new Date(row[col.name]) : null}
                                    onChange={(date) => handleRowChange(tableIndex, rowIndex, col.name, date)}
                                    dateFormat="dd.MM.yyyy"
                                    style={{ width: '100%' }}
                                />
                            ) : col.type === 'dateInvl' ? (
                                <Flex direction="column" gap="2">
                                    <Text>Start:</Text>
                                    <DatePicker
                                        selected={row[col.name]?.start ? new Date(row[col.name].start) : null}
                                        onChange={(date) =>
                                            handleRowChange(tableIndex, rowIndex, col.name, {
                                                ...row[col.name],
                                                start: date
                                            })
                                        }
                                        dateFormat="dd.MM.yyyy"
                                    />
                                    <Text>End:</Text>
                                    <DatePicker
                                        selected={row[col.name]?.end ? new Date(row[col.name].end) : null}
                                        onChange={(date) =>
                                            handleRowChange(tableIndex, rowIndex, col.name, {
                                                ...row[col.name],
                                                end: date
                                            })
                                        }
                                        dateFormat="dd.MM.yyyy"
                                    />
                                </Flex>
                            ) : (
                                <input
                                    type="text"
                                    value={row[col.name] || ''}
                                    onChange={(e) => handleRowChange(tableIndex, rowIndex, col.name, e.target.value)}
                                    style={{ width: '100%', padding: '4px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            )}
                            {validationErrors[`${tableIndex}-${rowIndex}-${col.name}`] && (
                                <Text color="red" size="1">
                                    {validationErrors[`${tableIndex}-${rowIndex}-${col.name}`]}
                                </Text>
                            )}
                        </Box>
                    ) : (
                        <Text>
                            {col.type === 'date'
                                ? formatDate(row[col.name])
                                : col.type === 'dateInvl'
                                    ? `${formatDate(row[col.name]?.start)} - ${formatDate(row[col.name]?.end)}`
                                    : row[col.name]}
                        </Text>
                    )}
                </Table.Cell>
            ))}
            <Table.Cell>
                {editRowInfo.tableIndex === tableIndex && editRowInfo.rowIndex === rowIndex ? (
                    <Button onClick={handleSaveRow} variant="solid" color="green">
                        Save Row
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <IconButton>
                                <DotsVerticalIcon style={{ width: '20px', height: '20px' }} />
                            </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            style={{ borderRadius: '8px', padding: '8px' }}
                        >
                            <DropdownMenuItem
                                onClick={() => handleEditRow(tableIndex, rowIndex)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                    fontWeight: 700
                                }}
                                onPointerEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                                onPointerLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                            >
                                Edit Row
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteRow(tableIndex, rowIndex)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                    fontWeight: 700
                                }}
                                onPointerEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                                onPointerLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                            >
                                Delete Row
                            </DropdownMenuItem>
                        </DropdownMenuContent>

                    </DropdownMenu>
                )}
            </Table.Cell>
        </Table.Row>
    );
}

export default TableRow;
