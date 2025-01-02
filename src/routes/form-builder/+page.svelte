<script>
    import { formStore, addQuestion, removeQuestion, updateFormDetails } from '../../stores/formstore.js';

    $: formData = $formStore;

    function enableQuizMode() {
        formStore.update(store => {
            store.quizMode = store.questions.some(q => 
                (q.type === 'multiple-choice' || q.type === 'radio') && q.correctOption !== null
            );
            return store;
        });
    }

    function handleTitleChange(event) {
        formStore.update(store => {
            store.title = event.target.value;
            return store;
        });
    }

    function handleDescriptionChange(event) {
        formStore.update(store => {
            store.description = event.target.value;
            return store;
        });
    }

    function addQuestionToStore() {
        if (formData.questionText?.trim() === '') return;

        addQuestion({
            id: Date.now(),
            type: formData.questionType || 'text',
            text: formData.questionText || '',
            required: false,
            options: (formData.questionType === 'multiple-choice' || formData.questionType === 'radio')
                ? [{ text: 'Option 1' }, { text: 'Option 2' }]
                : [],
            correctOption: null
        });

        formStore.update(store => {
            store.questionText = '';
            return store;
        });

        enableQuizMode();
    }

    function updateOptionText(questionIndex, optionIndex, value) {
        formStore.update(store => {
            store.questions[questionIndex].options[optionIndex].text = value;
            return store;
        });
    }

    function addOption(questionIndex) {
        formStore.update(store => {
            const question = store.questions[questionIndex];
            if (question.type === 'multiple-choice' || question.type === 'radio') {
                question.options.push({ text: `Option ${question.options.length + 1}` });
            }
            return store;
        });
    }

    function removeOption(questionIndex, optionIndex) {
        formStore.update(store => {
            store.questions[questionIndex].options.splice(optionIndex, 1);
            return store;
        });
    }

    function setCorrectOption(questionIndex, optionText) {
        formStore.update(store => {
            const question = store.questions[questionIndex];
            question.correctOption = question.correctOption === optionText ? null : optionText;
            return store;
        });

        enableQuizMode();
    }
</script>

<div class="container">
    <div class="box">
        <h2>Form Builder</h2>
        <input
            type="text"
            bind:value={formData.title}
            placeholder="Form Title"
            class="large-input"
            on:input={handleTitleChange}
        />
        <textarea
            bind:value={formData.description}
            placeholder="Form Description"
            class="large-input"
            on:input={handleDescriptionChange}
        ></textarea>
        <input
            type="text"
            bind:value={formData.questionText}
            placeholder="Enter your question"
            class="large-input"
        />
        <div class="question-type-add">
            <select bind:value={formData.questionType}>
                <option value="text">Text Field</option>
                <option value="textarea">Text Area</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="radio">Radio Buttons</option>
            </select>
            <button class="add-question" on:click={addQuestionToStore}>Add Question</button>
        </div>
    </div>

    <div class="box">
        <h2>Form Preview</h2>
        <h3>{formData.title || 'Untitled Form'}</h3>
        <p>{formData.description || 'No description provided.'}</p>
        {#each formData.questions as question, questionIndex}
            <div class="review-question">
                <button class="delete-button" on:click={() => removeQuestion(questionIndex)}>X</button>
                <h4>{question.text || 'Untitled Question'}</h4>
                {#if question.type === 'text'}
                    <input type="text" placeholder="Your Answer" disabled class="large-input" />
                {:else if question.type === 'textarea'}
                    <textarea placeholder="Your Answer" disabled class="large-input"></textarea>
                {:else if question.type === 'multiple-choice' || question.type === 'radio'}
                    <div class="options">
                        {#each question.options as option, optionIndex}
                            <div class="option">
                                <input
                                    type={question.type === 'radio' ? 'radio' : 'checkbox'}
                                    checked={question.correctOption === option.text}
                                    on:change={() => setCorrectOption(questionIndex, option.text)}
                                />
                                <input
                                    type="text"
                                    class="option-text"
                                    bind:value={option.text}
                                    on:input={(e) => updateOptionText(questionIndex, optionIndex, e.target.value)}
                                />
                                <button
                                    class="delete-option"
                                    on:click={() => removeOption(questionIndex, optionIndex)}
                                >
                                    X
                                </button>
                            </div>
                        {/each}
                        <button
                            class="add-option"
                            on:click={() => addOption(questionIndex)}
                        >
                            Add Option
                        </button>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
<style>
    .container {
        display: flex;
        flex-direction: row;
        height: 90vh;
        width: 90vw;
        gap: 1rem;
        padding: 1rem;
    }

    .box {
        flex: 1;
        padding: 1.5rem;
        border-radius: 8px;
        background-color: #1e1e1e;
        color: #ffffff;
        box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
        overflow-y: auto;
    }

    .large-input {
        width: 100%;
        margin-bottom: 1rem;
        padding: 10px; /* Adjusted padding */
        border-radius: 8px;
        background-color: #333333;
        color: #ffffff;
        border: 1px solid #555555;
        font-size: 1rem;
        box-sizing: border-box; /* Ensure padding doesn't expand the input width */
    }

    .review-question {
        margin-bottom: 1rem;
        padding: 1.5rem;
        background-color: #2c2c2c;
        border-radius: 8px;
        position: relative;
        overflow: hidden; /* Prevent overflow */
        box-sizing: border-box;
    }

    .delete-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #ff4c4c;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }

    .option input.option-text {
        flex: 1;
        border: 1px solid #555555;
        border-radius: 8px;
        padding: 10px;
        background-color: #333333;
        color: white;
        font-size: 1rem;
    }

    .add-option {
        margin-top: 10px;
        background-color: #ffa500;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }

    .add-option:hover {
        background-color: #e58900;
    }
</style>