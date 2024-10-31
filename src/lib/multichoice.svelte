<script>
    export let question;

    let optionText = '';

    function addOption() {
    if (optionText.trim() === '') return;
    question.options = [...question.options, { text: optionText, isCorrect: false }];
    optionText = '';
    }

    function setCorrectOption(index) {
        question.options = question.options.map((option, i) => ({
            ...option,
            isCorrect: i === index
        }));
    }
</script>

<div class="multiple-choice">
    <!-- Required checkbox in the upper-right corner -->
    <div class="required-checkbox">
        <label>
            <input type="checkbox" bind:checked={question.required} />
            Required
        </label>
    </div>

    <h3>{question.text}</h3>
    {#each question.options as option, index}
        <div>
            <input
                type="radio"
                id="correct-{index}-{question.id}"
                name="correct-option-{question.id}"
                on:change={() => setCorrectOption(index)}
                checked={option.isCorrect}
            />
            <label for="correct-{index}-{question.id}">{option.text} {option.isCorrect ? "(Correct)" : ""}</label>
        </div>
    {/each}
    <input type="text" bind:value={optionText} placeholder="Add an option" />
    <button on:click={addOption}>Add Option</button>
</div>

<style>
    .multiple-choice {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
        position: relative; /* Positioning for the required checkbox */
    }

    .required-checkbox {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 0.9rem;
    }

    .multiple-choice input[type="text"] {
        margin-top: 10px;
        padding: 8px;
        width: 100%;
        max-width: 600px;
    }
</style>
