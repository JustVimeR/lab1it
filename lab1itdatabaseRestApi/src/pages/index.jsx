import React from 'react';
import {Container} from "@radix-ui/themes";
import TableManager from "../components/TableManager.jsx";
import DatabaseManager from "../components/DatabaseManager.jsx";
function Index() {
    return (
        <div>
            <Container>
                <DatabaseManager/>
            </Container>
        </div>
    );
}

export default Index;