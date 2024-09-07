
export const saveToLocalStorage = (tables) => {
    localStorage.setItem('tables', JSON.stringify(tables));
};

export const loadFromLocalStorage = () => {
    const tables = localStorage.getItem('tables');
    return tables ? JSON.parse(tables) : null;
};
