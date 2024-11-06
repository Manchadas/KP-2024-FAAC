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
                <button on:click={() => removeQuestion(index)}>Delete</button>
            </div>
        {/each}
    </div>
</div>



<style>
    .form-builder {
        margin: 20px;
        font-family: Arial, sans-serif;
        max-width: 600px;
    }

    .large-input {
        width: 100%;
        margin: 10px 0;
        padding: 12px;
        font-size: 1rem;
        box-sizing: border-box;
    }

    textarea.large-input {
        resize: vertical;
        min-height: 100px;
    }

    .question-type-add {
        display: flex;
        gap: 10px;
        margin: 10px 0;
    }

    .add-question {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
    }

    .add-question:hover {
        background-color: #0056b3;
    }

    .submit-form {
        display: block;
        width: 100%;
        background-color: #28a745;
        color: white;
        border: none;
        padding: 12px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
    }

    .submit-form:hover {
        background-color: #218838;
    }

    .questions {
        margin-top: 20px;
    }

    .question-item {
        padding: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
    }
</style>
