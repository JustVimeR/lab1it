import React, { useState } from 'react';
import { Button, Container, Flex } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';

function Header({ onCreateDatabase, databases, activeDatabaseIndex, setActiveDatabaseIndex }) {
    const [dbName, setDbName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateDatabase = () => {
        if (dbName.trim() !== '') {
            onCreateDatabase(dbName);
            setDbName(''); // Очищуємо поле після створення
            setIsDialogOpen(false); // Закриваємо модальне вікно
        }
    };

    return (
        <Container position={'sticky'} top={0} maxWidth='100%'>
            <Flex gap='4px' justify="between" align="center">
                {/* Кнопки управління */}
                <Flex gap='4px'>
                    <Button onClick={() => setIsDialogOpen(true)}>Create new DB</Button>
                </Flex>

                {/* Вкладки для перемикання між базами даних */}
                <Flex gap="8px">
                    {databases.length > 0 ? (
                        databases.map((db, index) => (
                            <Button
                                key={index}
                                variant={index === activeDatabaseIndex ? 'solid' : 'soft'}
                                onClick={() => setActiveDatabaseIndex(index)}
                            >
                                {db.name}
                            </Button>
                        ))
                    ) : (
                        <p>No databases available</p>
                    )}
                </Flex>
            </Flex>

            {/* Модальне вікно для створення бази даних */}
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Overlay />
                <Dialog.Content>
                    <Dialog.Title>Create New Database</Dialog.Title>
                    <input
                        type="text"
                        placeholder="Database Name"
                        value={dbName}
                        onChange={(e) => setDbName(e.target.value)}
                    />
                    <Flex gap='8px' mt='10px'>
                        <Button onClick={handleCreateDatabase}>Create</Button>
                        <Dialog.Close>Cancel</Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Container>
    );
}

export default Header;
