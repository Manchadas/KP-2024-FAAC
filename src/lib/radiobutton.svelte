<script>
    export let question;
</script>

<div class="radio-button">
    <h3>{question.text}</h3>
    {#each question.options as option, index}
        <div>
            <input type="radio" id="option-{index}-{question.id}" name={question.text} value={option} />
            <label for="option-{index}-{question.id}">{option}</label>
        </div>
    {/each}
</div>

<style>
    .radio-button {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>
