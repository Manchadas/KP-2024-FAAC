<script>
    import { formStore } from '../stores/formstore.js';
    export let question;

    let newOption = '';

    function addOption() {
        if (newOption.trim() === '') return;

        formStore.update(store => {
            const updatedQuestions = store.questions.map(q => {
                if (q.id === question.id) {
                    return {
                        ...q,
                        options: [...q.options, { text: newOption }]
                    };
                }
                return q;
            });
            return { ...store, questions: updatedQuestions };
        });

        newOption = '';
    }

    function removeOption(index) {
        formStore.update(store => {
            const updatedQuestions = store.questions.map(q => {
                if (q.id === question.id) {
                    const updatedOptions = q.options.filter((_, i) => i !== index);
                    return { ...q, options: updatedOptions };
                }
                return q;
            });
            return { ...store, questions: updatedQuestions };
        });
    }
</script>

<div class="question">
    <h3>{question.text}</h3>
    <div class="required-checkbox">
        <label>
            <input type="checkbox" bind:checked={question.required} />
            Required
        </label>
    </div>

    {#if question.type === 'text'}
        <input type="text" placeholder="Your answer" />

    {:else if question.type === 'textarea'}
        <textarea placeholder="Your answer"></textarea>

    {:else if question.type === 'multiple-choice' || question.type === 'radio'}
        <div>
            <h4>Options:</h4>
            {#each question.options as option, index}
                <div>
                    <input type="radio" disabled />
                    {option.text}
                    <button on:click={() => removeOption(index)}>Remove</button>
                </div>
            {/each}
            <input type="text" bind:value={newOption} placeholder="Add an option" />
            <button on:click={addOption}>Add Option</button>
        </div>

    {:else if question.type === 'checkbox'}
        <div>
            <h4>Options:</h4>
            {#each question.options as option, index}
                <div>
                    <input type="checkbox" disabled />
                    {option.text}
                    <button on:click={() => removeOption(index)}>Remove</button>
                </div>
            {/each}
            <input type="text" bind:value={newOption} placeholder="Add an option" />
            <button on:click={addOption}>Add Option</button>
        </div>
    {/if}
</div>

<style>
    .question {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        position: relative;
    }

    .required-checkbox {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    h3 {
        margin-top: 0;
    }

    h4 {
        margin-bottom: 5px;
    }

    button {
        margin-top: 5px;
    }
</style>
