const API_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/data';

export const getPosts = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        return await response.json();
    } catch (error) {
        console.error('Не удалось получить данные:', error);
        throw error;
    }
};
