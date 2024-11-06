<script>
    import { formStore, getFormJSON } from '../../stores/formstore.js';

    let formData;
    $: formData = $formStore;

    async function createGoogleForm() {
        try {
            const response = await fetch('/api/create-google-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getFormJSON())
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Form created successfully! View it at: ${result.formUrl}`);
            } else {
                alert(`Error creating form: ${result.error}`);
                console.error(result.error);
            }
        } catch (error) {
            alert(`Error creating form: ${error.message}`);
            console.error("Error creating form:", error);
        }
    }
</script>

<div class="review-form">
    <h2>{formData.title || 'Untitled Form'}</h2>
    <p>{formData.description || 'No description provided.'}</p>

    {#each formData.questions as question (question.id)}
        <div class="review-question">
            <h3>{question.text || 'Untitled Question'}</h3>
            {#if question.type === 'text'}
                <input type="text" placeholder="Your answer" disabled />
            {:else if question.type === 'textarea'}
                <textarea placeholder="Your answer" disabled></textarea>
            {:else if question.type === 'multiple-choice' || question.type === 'radio'}
                {#each question.options as option, index}
                    <div>
                        <input type="radio" id={`option-${index}-${question.id}`} disabled />
                        <label for={`option-${index}-${question.id}`}>{option.text || 'Option'}</label>
                    </div>
                {/each}
            {:else if question.type === 'checkbox'}
                {#each question.options as option, index}
                    <div>
                        <input type="checkbox" id={`option-${index}-${question.id}`} disabled />
                        <label for={`option-${index}-${question.id}`}>{option.text || 'Option'}</label>
                    </div>
                {/each}
            {:else}
                <p class="warning">Unsupported question type.</p>
            {/if}
        </div>
    {/each}

    <button on:click={createGoogleForm}>Create Google Form</button>
</div>

<style>
    .review-form {
        margin: 20px;
        font-family: Arial, sans-serif;
        max-width: 600px;
    }

    .review-question {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    button {
        margin-top: 20px;
        background-color: #28a745;
        color: #ffffff;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 1rem;
        border-radius: 5px;
    }

    button:hover {
        background-color: #218838;
    }

    .warning {
        color: #d9534f;
        font-size: 0.9rem;
    }
</style>
