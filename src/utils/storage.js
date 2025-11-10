// Simula AsyncStorage usando localStorage (para Vite / React web)
const AsyncStorage = {
    async getItem(key) {
        return Promise.resolve(localStorage.getItem(`stockarium_${key}`));
    },

    async setItem(key, value) {
        localStorage.setItem(`stockarium_${key}`, value);
        return Promise.resolve();
    },

    async removeItem(key) {
        localStorage.removeItem(`stockarium_${key}`);
        return Promise.resolve();
    },
};

export default AsyncStorage;
