import { writable } from 'svelte/store';

// Retrieve stored form data from localStorage, or initialize with default values
function getStoredForm() {
    if (typeof localStorage !== 'undefined') {
        const storedForm = localStorage.getItem('formStore');
        return storedForm ? JSON.parse(storedForm) : { title: '', description: '', questions: [] };
    }
    return { title: '', description: '', questions: [] };
}

// Initialize form store
const storedForm = getStoredForm();
export const formStore = writable(storedForm);

// Subscribe to store updates and save to localStorage if available
formStore.subscribe((store) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('formStore', JSON.stringify(store));
    }
});

// Add a question
export const addQuestion = (question) => {
    formStore.update(store => ({
        ...store,
        questions: [...store.questions, question]
    }));
};

// Remove a question by index
export const removeQuestion = (index) => {
    formStore.update(store => {
        const updatedQuestions = store.questions.filter((_, i) => i !== index);
        return {
            ...store,
            questions: updatedQuestions
        };
    });
};

// Update form title and description
export const updateFormDetails = (title, description) => {
    formStore.update(store => ({
        ...store,
        title,
        description
    }));
};
