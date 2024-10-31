<script>
    export let question;

    let optionText = '';

    function addOption() {
        if (optionText.trim() === '') return;
        question.options = [...question.options, { text: optionText, isCorrect: false }];
        optionText = '';
    }
</script>

<div class="radio-button">
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
            <input type="radio" id="option-{index}-{question.id}" name={question.text} disabled />
            <label for="option-{index}-{question.id}">{option.text}</label> <!-- Display the 'text' property -->
        </div>
    {/each}
    <input type="text" bind:value={optionText} placeholder="Add an option" />
    <button on:click={addOption}>Add Option</button>
</div>

<style>
    .radio-button {
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
</style>
