<script>
    import { formStore } from '../../stores/formstore.js'; // Adjust the path as necessary
    let formData;

    // Subscribe to the store to get the form data
    formStore.subscribe(data => {
        formData = data;
    });
</script>

<div class="review-form">
    {#if formData}
        <h2>{formData.title}</h2>
        <p>{formData.description}</p>

        <div class="questions">
            {#each formData.questions as question, index}
                <div class="question-item">
                    <h3>{index + 1}. {question.text}</h3>

                    {#if question.type === 'text'}
                        <input type="text" placeholder="Your answer" />
                    {:else if question.type === 'textarea'}
                        <textarea placeholder="Your answer"></textarea>
                    {:else if question.type === 'multiple-choice'}
                        {#each question.options as option, optionIndex}
                            <div class="option">
                                <input type="radio" id="option-{optionIndex}-{question.id}" name="question-{question.id}" />
                                <label for="option-{optionIndex}-{question.id}">{option.text}</label>
                            </div>
                        {/each}
                    {:else if question.type === 'radio'}
                        {#each question.options as option, optionIndex}
                            <div class="option">
                                <input type="radio" id="option-{optionIndex}-{question.id}" name="question-{question.id}" />
                                <label for="option-{optionIndex}-{question.id}">{option.text}</label>
                            </div>
                        {/each}
                    {:else if question.type === 'checkbox'}
                        {#each question.options as option, optionIndex}
                            <div class="option">
                                <input type="checkbox" id="option-{optionIndex}-{question.id}" />
                                <label for="option-{optionIndex}-{question.id}">{option.text}</label>
                            </div>
                        {/each}
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .review-form {
        margin: 20px auto;
        padding: 20px;
        max-width: 800px;
        background-color: #f8f9fa;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
        text-align: center;
        margin-bottom: 10px;
        font-weight: 700;
    }

    p {
        text-align: center;
        margin-bottom: 20px;
        font-size: 1.1rem;
        color: #6c757d;
    }

    .question-item {
        background-color: #fff;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
        overflow: hidden; /* Ensure content stays within bounds */
    }

    .question-item h3 {
        margin-bottom: 10px;
        font-weight: bold;
    }

    input[type="text"],
    textarea {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ced4da;
        margin-top: 5px;
        background-color: #e9ecef;
        outline: none;
        box-sizing: border-box;
    }

    textarea {
        resize: vertical;
        min-height: 100px;
    }

    .option {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }

    input[type="radio"],
    input[type="checkbox"] {
        margin-right: 10px;
    }

    label {
        font-size: 1rem;
    }
</style>
