<script>
    export let question;

    let optionText = '';

    function addOption() {
        if (optionText.trim() === '') return; // Prevent adding empty options
        question.options.push({ text: optionText, isCorrect: false }); // Store options as objects
        optionText = ''; // Reset input
    }

    function toggleCorrect(index) {
        question.options[index].isCorrect = !question.options[index].isCorrect; // Toggle isCorrect property
    }
</script>

<div class="checkbox">
    <h3>{question.text}</h3>
    {#each question.options as option, index}
        <div>
            <input type="checkbox" id="option-{index}-{question.id}" value={option.text} />
            <label for="option-{index}-{question.id}">{option.text}</label>

            <label>
                <input type="checkbox" bind:checked={option.isCorrect} on:change={() => toggleCorrect(index)} />
                Correct Answer
            </label>
        </div>
    {/each}
    <input type="text" bind:value={optionText} placeholder="Add an option" />
    <button on:click={addOption}>Add Option</button>
</div>

<style>
    .checkbox {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>
