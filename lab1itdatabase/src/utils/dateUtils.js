export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('uk-UA');
};
