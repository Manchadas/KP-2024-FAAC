<script>
    import { writable } from 'svelte/store';
    import MultipleChoice from '$lib/multichoice.svelte';
    import TextField from '$lib/textfield.svelte';
    import TextArea from '$lib/textarea.svelte';
    import RadioButton from '$lib/radiobutton.svelte';
    import Checkbox from '$lib/checkbox.svelte';

    // Store to hold the form structure
    export let formStructure = writable([]);

    let questionType = 'text'; // Default question type
    let questionText = '';

    function addQuestion() {
        if (questionText.trim() === '') return; // Prevent adding empty questions
        formStructure.update(questions => [
            ...questions,
            { id: Date.now(), type: questionType, text: questionText, options: [] }
        ]);
        questionText = ''; // Reset input
    }

    function handleSubmit() {
        // Handle form submission logic
        console.log("Form data ready to be sent:", $formStructure);
    }
</script>

<div class="form-builder">
    <h2>Create Your Form</h2>
    <input type="text" bind:value={questionText} placeholder="Enter your question" />
    <select bind:value={questionType}>
        <option value="text">Text Field</option>
        <option value="textarea">Text Area</option>
        <option value="multiple-choice">Multiple Choice</option>
        <option value="radio">Radio Buttons</option>
        <option value="checkbox">Checkboxes</option>
    </select>
    <button on:click={addQuestion}>Add Question</button>
    <button on:click={handleSubmit}>Submit Form</button>

    <div class="questions">
        <h3>Questions Added:</h3>
        {#each $formStructure as question}
            <div class="question-item">
                <strong>Type:</strong> {question.type} <br/>
                <strong>Question:</strong> {question.text}
                <!-- Conditional rendering for different question components -->
                {#if question.type === 'text'}
                    <TextField {question} />
                {:else if question.type === 'textarea'}
                    <TextArea {question} />
                {:else if question.type === 'multiple-choice'}
                    <MultipleChoice {question} />
                {:else if question.type === 'radio'}
                    <RadioButton {question} />
                {:else if question.type === 'checkbox'}
                    <Checkbox {question} />
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .form-builder {
        margin: 20px;
        font-family: Arial, sans-serif;
    }
    input, select {
        margin: 5px 0;
        padding: 8px;
        width: 100%;
        max-width: 300px;
    }
    button {
        margin: 10px 5px;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
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