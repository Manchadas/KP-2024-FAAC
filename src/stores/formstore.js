import { writable, get } from 'svelte/store';

// Retrieve stored form data from localStorage or initialize with default values
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

// Add a question with initialized options
export const addQuestion = (question) => {
    formStore.update(store => {
        const newQuestion = {
            ...question,
            itemId: question.id ? question.id.toString() : Date.now().toString(),
            options: (['multiple-choice', 'radio', 'checkbox'].includes(question.type))
                ? question.options || []
                : []
        };

        return {
            ...store,
            questions: [...store.questions, newQuestion]
        };
    });
};

// Format the question object to match the Google Forms API structure
function formatQuestion(question) {
    if (!question || !question.text) {
        console.error('Invalid question format or missing text:', question);
        return null;
    }

    const baseQuestion = {
        itemId: question.itemId || Date.now().toString(),
        title: question.text,
        questionItem: {
            question: {
                required: question.required || false
            }
        }
    };

    if (question.type === 'text') {
        baseQuestion.questionItem.question.textQuestion = { paragraph: false };
    } else if (question.type === 'textarea') {
        baseQuestion.questionItem.question.textQuestion = { paragraph: true };
    } else if (['multiple-choice', 'radio', 'checkbox'].includes(question.type)) {
        baseQuestion.questionItem.question.choiceQuestion = {
            type: question.type === 'checkbox' ? 'CHECKBOX' : 'RADIO',
            options: question.options.map(option => ({ value: option.text })),
            shuffle: false
        };
    } else {
        console.warn(`Unsupported question type: ${question.type}`);
        return null;
    }

    return baseQuestion;
}

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

// Get JSON representation directly from the store value
export const getFormJSON = () => {
    const store = get(formStore);
    return {
        info: {
            title: store.title || 'Untitled Form',
            description: store.description || ''
        },
        items: store.questions.map(formatQuestion).filter(Boolean)
    };
};
