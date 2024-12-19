<script>
    import yaml from 'js-yaml';

    let yamlInput = '';
    let formJson = {};
    let parseError = '';

    // Watch for changes to YAML input and parse it into the desired format
    function parseYAML() {
        try {
            if (yamlInput.trim() === '') {
                formJson = {};
                parseError = '';
            } else {
                const rawYaml = yaml.load(yamlInput);
                formJson = convertToGoogleFormJson(rawYaml); // Convert YAML to the desired format
                parseError = '';
            }
        } catch (e) {
            parseError = 'Invalid YAML: ' + e.message;
            formJson = {};
        }
    }

    $: yamlInput, parseYAML();

    // Convert YAML to Google Forms API JSON
    function convertToGoogleFormJson(rawYaml) {
        const info = {
            title: rawYaml.title || 'Untitled Form',
            description: rawYaml.description || '',
        };

        let hasGradedQuestions = false; // Flag for graded questions

        const items = (rawYaml.elements || []).map((question, index) => {
            const baseItem = {
                itemId: Date.now() + index, // Generate a unique ID
                title: question.label || question.question || 'Untitled Question',
                description: question.placeholder || '',
                questionItem: {
                    question: {
                        required: question.required === true ? true : false, // Handle required flag
                    },
                },
            };

            // Text or Textarea Questions
            if (question.type === 'text') {
                baseItem.questionItem.question.textQuestion = { paragraph: false };
            } else if (question.type === 'textarea') {
                baseItem.questionItem.question.textQuestion = { paragraph: true };
            }

            // Multiple-Choice Questions (MCQ)
            else if (question.type === 'radio' || question.type === 'mcq') {
                baseItem.questionItem.question.choiceQuestion = {
                    type: 'RADIO',
                    options: question.options.map((option) => ({ value: String(option) })),
                    shuffle: false,
                };

                // Graded MCQs
                if (question.correctOption) {
                    hasGradedQuestions = true; // Mark graded questions
                    baseItem.questionItem.question.grading = {
                        pointValue: 1, // Default point value
                        correctAnswers: {
                            answers: [{ value: String(question.correctOption) }],
                        },
                    };
                }
            }

            // Checkbox Questions
            else if (question.type === 'checkbox') {
                baseItem.questionItem.question.choiceQuestion = {
                    type: 'CHECKBOX',
                    options: question.options.map((option) => ({ value: String(option) })),
                    shuffle: false,
                };
            }

            return baseItem;
        });

        const result = { info, items };

        // Add quiz settings only if graded questions exist
        if (hasGradedQuestions) {
            result.updateSettings = {
                settings: {
                    quizSettings: { isQuiz: true },
                },
                updateMask: 'quizSettings.isQuiz',
            };
        }

        return result;
    }

    // Function to create a Google Form
    async function createGoogleForm() {
        if (!Object.keys(formJson).length) {
            alert('No valid form data to send.');
            return;
        }

        try {
            const response = await fetch('/api/create-google-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formJson),
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

    function downloadJSON() {
        if (!Object.keys(formJson).length) {
            alert('No valid form data to download.');
            return;
        }

        const jsonContent = JSON.stringify(formJson, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'formConfig.json';
        link.click();
        URL.revokeObjectURL(link.href);
    }
</script>

<style>
    /* General Reset */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  
    body {
      font-family: 'Inter', sans-serif;
      background-color: #000000; /* Black background */
      color: #ffffff; /* White text */
      margin: 0;
      padding: 0;
    }
  
    /* Container Styling */
    .container {
      display: flex;
      height: 80vh;
      width: 100%;
      gap: 1rem;
      padding: 1rem;
    }
  
    .box {
      flex: 1;
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #1e1e1e; /* Dark box background */
      box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
      overflow-y: auto;
    }
  
    /* Textarea Styling */
    textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border: none;
      font-family: 'Courier New', monospace;
      background-color: #1e1e1e; /* Same as box */
      color: #ffffff; /* White text */
      padding: 1rem;
      border-radius: 8px;
      box-shadow: inset 0 4px 10px rgba(255, 255, 255, 0.1);
    }
  
    textarea::placeholder {
      color: #aaaaaa; /* Placeholder text color */
    }
  
    /* Live Preview Section */
    .form-question {
      margin-bottom: 1.5rem;
      padding: 15px;
      border-radius: 10px;
      background: #2e2e2e; /* Slightly lighter for contrast */
      box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease-in-out;
    }
  
    .form-question:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(255, 255, 255, 0.2);
    }
  
    /* Headings in Preview */
    .form-question h3 {
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffffff;
    }
  
    .form-question p {
      margin: 0;
      font-size: 1rem;
      color: #cccccc;
    }
  
    /* Box Headings */
    .box h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #ffffff;
    }
  
    .box p {
      font-size: 1.1rem;
      color: #cccccc;
      margin-bottom: 2rem;
    }
  
    /* Options Styling */
    .options {
      margin-top: 0.5rem;
      padding-left: 1rem;
    }
  
    .option {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      font-size: 1rem;
      color: #cccccc;
    }
  
    .option input {
      margin-right: 10px;
      transform: scale(1.2);
    }
  
    .option label {
      cursor: pointer;
    }
  
    /* Button Group Styling */
    .button-group {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      gap: 10px;
    }
  
    button {
      background-color: #ff7b00; /* Bright orange for contrast */
      color: #ffffff;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      transition: background-color 0.3s ease-in-out;
    }
  
    button:hover {
      background-color: #e06b00; /* Slightly darker orange */
    }
  
    /* Heading for YAML Builder */
    h3 {
      margin-bottom: 0.5rem;
      font-weight: 700;
      font-size: 1.75rem;
      text-align: center;
      color: #ffffff;
    }
  </style>
  

<h1 style="text-align: center;">YAML Builder</h1>

<div class="container">
    <div class="box">
        <h3>YAML Input</h3>
        <textarea bind:value={yamlInput} placeholder="Write your YAML here..."></textarea>
        {#if parseError}
            <p style="color: red;">{parseError}</p>
        {/if}
    </div>

    <div class="box">
        {#if formJson.info}
            <h2>{formJson.info.title}</h2>
            <p>{formJson.info.description}</p>
            {#each formJson.items as item}
                <div class="form-question">
                    <h3>{item.title}</h3>
                        <p>Type: {item.questionItem.question.choiceQuestion?.type || 'Text'}</p>
        
        {#if item.questionItem.question.choiceQuestion}
            <div class="options">
                {#each item.questionItem.question.choiceQuestion.options as option}
                    <div class="option">
                        <input 
                            type="{item.questionItem.question.choiceQuestion.type === 'RADIO' ? 'radio' : 'checkbox'}" 
                            id={option.value} 
                            name={item.itemId} 
                            disabled
                        />
                        <label for={option.value}>{option.value}</label>
                    </div>
                {/each}
            </div>
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
    <button on:click={createGoogleForm}>Create Google Form</button>
    <button on:click={downloadJSON}>Download JSON</button>
</div>
