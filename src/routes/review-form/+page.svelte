<script>
    import { formStore, getFormJSON } from '../../stores/formstore.js';

    let formData;
    $: formData = $formStore;

    async function createGoogleForm() {
        const formJSON = getFormJSON();

        // Enable quiz mode if there are graded questions
        formJSON.updateSettings = {
            settings: {
                quizSettings: { isQuiz: true },
            },
            updateMask: 'quizSettings.isQuiz',
        };

        try {
            const response = await fetch('/api/create-google-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formJSON),
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
                    <div class="option">
                        <input type="radio" id={`option-${index}-${question.id}`} disabled />
                        <label for={`option-${index}-${question.id}`}>{option.text || 'Option'}</label>
                    </div>
                {/each}
                {#if question.correctOption}
                    <p class="grading">
                        Grading: 1 Point (Correct Answer: {question.correctOption})
                    </p>
                {/if}
            {:else if question.type === 'checkbox'}
                {#each question.options as option, index}
                    <div class="option">
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
    /* Main Container Styling */
    .review-form {
        margin: 20px auto;
        font-family: 'Inter', sans-serif;
        max-width: 800px;
        background-color: #1e1e1e; /* Black background */
        color: #ffffff; /* White text */
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }

    h2 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: center;
        color: #ffa500; /* Orange title */
    }

    p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        text-align: center;
        color: #aaaaaa;
    }

    .review-question {
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #555555;
        border-radius: 10px;
        background-color: #2c2c2c; /* Slightly lighter black for questions */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease-in-out;
    }

    .review-question:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.7);
    }

    h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #ffffff;
    }

    /* Grading Display */
    .grading {
        margin-top: 10px;
        font-size: 1rem;
        color: #ffa500; /* Orange grading text */
    }

    /* Input Fields */
    input[type="text"],
    textarea {
        width: 100%;
        padding: 10px 12px; /* Adjusted padding for consistency */
        border-radius: 5px;
        border: 1px solid #555555;
        background-color: #333333; /* Consistent background color */
        color: #ffffff; /* White text */
        margin-bottom: 15px; /* Ensure proper spacing between elements */
        font-size: 1rem; /* Consistent font size */
        box-sizing: border-box; /* Include padding in element width/height */
    }

    textarea {
        min-height: 60px; /* Adjusted minimum height for better appearance */
        resize: vertical; /* Allow resizing vertically only */
    }

    input[type="text"]::placeholder,
    textarea::placeholder {
        color: #aaaaaa; /* Light gray placeholder text */
    }

    input[type="radio"],
    input[type="checkbox"] {
        margin-right: 10px;
        transform: scale(1.2); /* Slightly larger for better visibility */
    }

    label {
        font-size: 1rem;
        color: #ffffff;
    }

    /* Button Styling */
    button {
        display: block;
        width: 100%;
        background-color: #4caf50;
        color: #ffffff;
        border: none;
        padding: 12px;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 20px;
        transition: all 0.3s ease;
    }

    button:hover {
        background-color: #3e8e41;
    }

    .warning {
        color: #ff4c4c;
        font-size: 0.9rem;
        margin-top: 10px;
    }

    .option {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
</style>
