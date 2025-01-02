<script>
    import { formStore } from '../../stores/formstore.js';
    import yaml from 'js-yaml';

    $: formData = $formStore; // Reactively syncs with the form store

    let yamlInput = ''; // User-typed YAML
    let parseError = ''; // Error feedback for invalid YAML

    // Function to synchronize YAML input to form store (Manual Builder)
    function updateFormFromYAML() {
        try {
            if (yamlInput.trim() === '') {
                formStore.update(store => {
                    store.title = '';
                    store.description = '';
                    store.questions = [];
                    store.quizMode = false; // Reset quizMode when the YAML is empty
                    return store;
                });
                parseError = '';
            } else {
                const parsedYAML = yaml.load(yamlInput);

                formStore.update(store => {
                    store.title = parsedYAML.title || '';
                    store.description = parsedYAML.description || '';
                    store.questions = (parsedYAML.elements || []).map(element => ({
                        text: element.label || 'Untitled Question',
                        type: element.type || 'text',
                        required: element.required || false,
                        options: element.options?.map(option => ({ text: option })) || [],
                        correctOption: element.correctOption || null, // Add correctOption for quizzes
                        image: element.image || null // Add image property
                    }));

                    // Set quizMode to true if there are multiple-choice or radio questions
                    store.quizMode = store.questions.some(q =>
                        (q.type === 'multiple-choice' || q.type === 'radio') && q.correctOption
                    );

                    return store;
                });
                parseError = ''; // Clear errors
            }
        } catch (e) {
            parseError = 'Invalid YAML: ' + e.message;
        }
    }

    // Function to synchronize the form store (Manual Builder) to YAML
    function updateYAMLFromForm() {
        try {
            const generatedYAML = yaml.dump({
                title: formData.title,
                description: formData.description,
                quizMode: formData.quizMode, // Include quizMode in YAML
                elements: formData.questions.map(question => ({
                    label: question.text,
                    type: question.type,
                    required: question.required,
                    options: question.options?.map(option => option.text) || [],
                    correctOption: question.correctOption || null, // Include correctOption in YAML
                    image: question.image || null // Include image in YAML
                }))
            });

            // Only update YAML input if it doesn't match the generated YAML
            if (yamlInput !== generatedYAML) {
                yamlInput = generatedYAML;
            }
        } catch (e) {
            console.error('Error generating YAML:', e);
        }
    }

    // Automatically update YAML when the form store changes
    $: updateYAMLFromForm();

    // Function to download form data as JSON
    function downloadJSON() {
        const jsonContent = JSON.stringify(formData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'formData.json';
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // Function to create a Google Form
    async function createGoogleForm() {
        if (!formData.title || formData.questions.length === 0) {
            alert('Please provide a valid form with at least one question.');
            return;
        }

        const formJSON = {
            info: {
                title: formData.title,
                description: formData.description,
            },
            settings: {
                quizMode: formData.quizMode // Use quizMode flag from the store
            },
            items: formData.questions.map((question, index) => {
                const item = {
                    itemId: index.toString(),
                    title: question.text,
                    questionItem: {
                        question: {
                            required: question.required,
                            choiceQuestion:
                                question.type === 'multiple-choice' || question.type === 'radio'
                                    ? {
                                          type: question.type === 'multiple-choice' ? 'CHECKBOX' : 'RADIO',
                                          options: question.options.map(option => ({
                                              value: option.text
                                          })),
                                          shuffle: false,
                                      }
                                    : null,
                            textQuestion:
                                question.type === 'text' || question.type === 'textarea'
                                    ? { paragraph: question.type === 'textarea' }
                                    : null,
                        },
                    },
                    image: question.image ? { sourceUri: question.image } : null, // Add image property
                };

                // Add grading for quiz questions
                if (
                    (question.type === 'multiple-choice' || question.type === 'radio') &&
                    question.correctOption
                ) {
                    item.questionItem.question.grading = {
                        pointValue: 1, // Default point value
                        correctAnswers: {
                            answers: [{ value: question.correctOption }],
                        },
                    };
                }

                return item;
            }),
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
            }
        } catch (error) {
            alert(`Error creating form: ${error.message}`);
        }
    }
</script>

<div class="container">
    <!-- YAML Input -->
    <div class="box">
        <h3>YAML Input</h3>
        <textarea
            bind:value={yamlInput}
            placeholder="Write your YAML here..."
            on:input={updateFormFromYAML}
        ></textarea>
        {#if parseError}
            <p style="color: red;">{parseError}</p>
        {/if}
    </div>

    <!-- Live Preview -->
    <div class="box">
        <h3>Live Preview</h3>
        {#if formData.title}
            <h2>{formData.title}</h2>
            <p>{formData.description}</p>
            {#each formData.questions as question, questionIndex}
                <div class="review-question">
                    <button
                        class="delete-button"
                        on:click={() =>
                            formStore.update(store => {
                                store.questions.splice(questionIndex, 1);
                                return store;
                            })
                        }
                    >
                        X
                    </button>
                    {#if question.image}
                        <img src={question.image} alt="Question Image" class="question-image" />
                    {/if}
                    <h3>{question.text}</h3>
                    {#if question.type === 'multiple-choice' || question.type === 'radio'}
                        <div class="options">
                            {#each question.options as option}
                                <div class="option">
                                    <input
                                        type={question.type === 'radio' ? 'radio' : 'checkbox'}
                                        disabled
                                    />
                                    <label>{option.text}</label>
                                </div>
                            {/each}
                        </div>
                    {:else if question.type === 'text'}
                        <input type="text" placeholder="Your answer" disabled />
                    {:else if question.type === 'textarea'}
                        <textarea placeholder="Your answer" disabled></textarea>
                    {/if}
                </div>
            {/each}
        {:else}
            <h2>No Form Data</h2>
            <p>Enter YAML on the left to see the live preview here.</p>
        {/if}
    </div>
</div>

<div class="button-group">
    <button on:click={downloadJSON}>Download JSON</button>
    <button on:click={createGoogleForm}>Create Google Form</button>
</div>

<style>

    .question-image {
        max-width: 100%;
        height: auto;
        margin: 10px 0;
        border-radius: 8px;
    }

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

    textarea {
        width: 100%;
        height: 100%;
        font-family: 'Courier New', monospace;
        background-color: #333333;
        color: #ffffff;
        padding: 1rem;
        border-radius: 8px;
        border: none;
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 1rem;
    }

    button {
        background-color: #ff7b00;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        font-weight: bold;
        cursor: pointer;
    }

    button:hover {
        background-color: #e06b00;
    }

    .review-question {
        margin-bottom: 1rem;
        padding: 1.5rem;
        background-color: #2c2c2c;
        border-radius: 8px;
        position: relative;
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

    .delete-button:hover {
        background-color: #e43d3d;
    }

    /* Updated styles for "Your answer" fields */
    .review-question input[type="text"],
    .review-question textarea {
        width: 100%;
        padding: 12px;
        margin-top: 8px;
        border-radius: 6px;
        background-color: #333333;
        color: #ffffff;
        border: 1px solid #555555;
        font-size: 0.95rem;
        box-sizing: border-box;
    }

    .review-question input[type="text"]::placeholder,
    .review-question textarea::placeholder {
        color: #cccccc;
        font-style: italic;
    }

    .review-question input[type="text"]:focus,
    .review-question textarea:focus {
        border: 1px solid #ffa500;
        outline: none;
    }

    .option {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        gap: 10px;
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
        margin-top: 5px;
        background-color: #ffa500;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: bold;
    }

    .add-option:hover {
        background-color: #e58900;
    }
</style>
