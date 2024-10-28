<script>
    export let question;

    let optionText = '';

    function addOption() {
        if (optionText.trim() === '') return; // Prevent adding empty options
        question.options.push(optionText);
        optionText = ''; // Reset input
    }
</script>

<div class="multiple-choice">
    <h3>{question.text}</h3>
    {#each question.options as option, index}
        <div>
            <input type="radio" id="option-{index}-{question.id}" name={question.text} value={option} />
            <label for="option-{index}-{question.id}">{option}</label>
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
    }
</style>
