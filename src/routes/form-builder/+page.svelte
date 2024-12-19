<script>
    import QuestionRenderer from '$lib/QuestionRenderer.svelte';
    import { formStore, addQuestion, removeQuestion, updateFormDetails, getFormJSON } from '../../stores/formstore.js';

    let title = '';
    let description = '';
    let questionType = 'text';
    let questionText = '';
    let formData;

    $: formData = $formStore;

    $: title = formData.title;
    $: description = formData.description;

    function updateTitleAndDescription() {
        updateFormDetails(title, description);
    }

    function addQuestionToStore() {
        if (questionText.trim() === '') return;

        addQuestion({
            id: Date.now(),
            type: questionType,
            text: questionText,
            required: false,
            options: (questionType === 'multiple-choice' || questionType === 'radio' || questionType === 'checkbox') 
                ? [{ text: 'Option 1' }, { text: 'Option 2' }] 
                : []
        });

        questionText = '';
    }

    function downloadJSON() {
        const jsonData = getFormJSON();
        const dataStr = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'formData.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
</script>

<div class="form-builder">
    <h2>Create Your Form</h2>

    <input type="text" bind:value={title} placeholder="Form Title" on:input={updateTitleAndDescription} class="large-input" />
    <textarea bind:value={description} placeholder="Form Description" on:input={updateTitleAndDescription} class="large-input"></textarea>
    <input type="text" bind:value={questionText} placeholder="Enter your question" class="large-input" />

    <div class="question-type-add">
        <select bind:value={questionType}>
            <option value="text">Text Field</option>
            <option value="textarea">Text Area</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="radio">Radio Buttons</option>
            <option value="checkbox">Checkboxes</option>
        </select>
        <button class="add-question" on:click={addQuestionToStore}>Add Question</button>
    </div>

    <button class="submit-form" on:click={downloadJSON}>Download JSON</button>

    <div class="questions">
        <h3>Questions Added:</h3>
        {#each $formStore.questions as question, index}
            <div class="question-item">
                <QuestionRenderer {question} />
                <button on:click={() => removeQuestion(index)} class="delete-button">Delete</button>
            </div>
        {/each}
    </div>
</div>

<style>
    /* Main Form Builder Styling */
    .form-builder {
        margin: 20px;
        font-family: 'Inter', sans-serif;
        max-width: 800px;
        color: #ffffff;
        background-color: #1e1e1e;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }

    h2 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: center;
        color: #ffa500;
    }

    .large-input {
        width: 100%;
        margin: 10px 0;
        padding: 12px;
        font-size: 1rem;
        box-sizing: border-box;
        border-radius: 5px;
        background-color: #333333;
        color: #ffffff;
        border: 1px solid #555555;
    }

    textarea.large-input {
        resize: vertical;
        min-height: 100px;
    }

    .large-input::placeholder {
        color: #aaaaaa;
    }

    .question-type-add {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        justify-content: center;
    }

    .add-question {
        background-color: #f58c03;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .add-question:hover {
        background-color: #3e8e41;
    }

    .submit-form {
        display: block;
        width: 100%;
        background-color: #FF4D00;
        color: white;
        border: none;
        padding: 12px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .submit-form:hover {
        background-color: #0056b3;
    }

    .questions {
        margin-top: 20px;
        color: #ffffff;
    }

    .question-item {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #555555;
        border-radius: 8px;
        background-color: #2c2c2c;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease-in-out;
    }

    .question-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
    }

    .delete-button {
        background-color: #ff4c4c;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .delete-button:hover {
        background-color: #e43d3d;
    }
</style>
