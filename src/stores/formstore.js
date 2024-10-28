import { writable } from 'svelte/store';

// Create a writable store for form data
export const formStore = writable({
    title: '',
    description: '',
    questions: [] // This can hold an array of question objects
});

// Function to add a question
export const addQuestion = (question) => {
    formStore.update(store => {
        return {
            ...store,
            questions: [...store.questions, question]
        };
    });
};

// Function to remove a question by index
export const removeQuestion = (index) => {
    formStore.update(store => {
        const updatedQuestions = store.questions.filter((_, i) => i !== index);
        return {
            ...store,
            questions: updatedQuestions
        };
    });
};

// Function to update form title and description
export const updateFormDetails = (title, description) => {
    formStore.update(store => {
        return {
            ...store,
            title,
            description
        };
    });
};