<script>
    import MultipleChoice from '$lib/multichoice.svelte';
    import TextField from '$lib/textfield.svelte';
    import TextArea from '$lib/textarea.svelte';
    import RadioButton from '$lib/radiobutton.svelte';
    import Checkbox from '$lib/checkbox.svelte';
    import { formStore, addQuestion, removeQuestion, updateFormDetails } from '../../stores/formstore.js';

    let title = '';
    let description = '';
    let questionType = 'text';
    let questionText = '';

    function updateTitleAndDescription() {
        updateFormDetails(title, description);
    }

    function addQuestionToStore() {
        if (questionText.trim() === '') return;
        addQuestion({
            id: Date.now(),
            type: questionType,
            text: questionText,
            options: []
        });
        questionText = '';
    }

    async function handleSubmit() {
        const formData = $formStore;
        const payload = {
            title: formData.title,
            description: formData.description,
            questions: formData.questions.map((question) => ({
                type: question.type,
                text: question.text,
                options: question.options,
            })),
        };

        try {
            const response = await fetch('https://your-google-api-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to send form data');
            const responseData = await response.json();
            console.log('Form created successfully on Google Forms:', responseData);
        } catch (error) {
            console.error('Error creating Google Form:', error);
        }
    }
</script>

<div class="form-builder">
    <h2>Create Your Form</h2>

    <!-- Form Title Input (larger) -->
    <input type="text" bind:value={title} placeholder="Form Title" on:input={updateTitleAndDescription} class="large-input" />

    <!-- Form Description Input (larger) -->
    <textarea bind:value={description} placeholder="Form Description" on:input={updateTitleAndDescription} class="large-input"></textarea>

    <!-- Question Text Input (larger) -->
    <input type="text" bind:value={questionText} placeholder="Enter your question" class="large-input" />

    <!-- Question Type and Add Question Button aligned horizontally -->
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

    <!-- Submit Form Button at the bottom (green) -->
    <button class="submit-form" on:click={handleSubmit}>Submit Form</button>

    <div class="questions">
        <h3>Questions Added:</h3>
        {#each $formStore.questions as question, index}
            <div class="question-item">
                <strong>Type:</strong> {question.type} <br/>
                <strong>Question:</strong> {question.text}
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

    .question-type-add select {
        flex: 1;
        padding: 10px;
        font-size: 1rem;
    }

    .add-question {
        flex-shrink: 0;
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
