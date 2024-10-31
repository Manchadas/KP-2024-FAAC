<script>
    export let question;

    let optionText = question.options.length > 0 ? question.options[0].text : ''; // Initial option text

    function updateOptionText() {
        question.options = [{ text: optionText, isCorrect: false }]; // Update the single option text
    }
</script>

<div class="checkbox">
    <!-- Required checkbox in the upper-right corner -->
    <div class="required-checkbox">
        <label>
            <input type="checkbox" bind:checked={question.required} />
            Required
        </label>
    </div>

    <h3>{question.text}</h3>
    <div>
        <input type="checkbox" id="option-{question.id}" />
        <label for="option-{question.id}">{optionText || "Agree"}</label>
    </div>
    <input type="text" bind:value={optionText} placeholder="Set the option text" on:input={updateOptionText} />
</div>

<style>
    .checkbox {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
        position: relative;
        border-radius: 8px;
    }

    .required-checkbox {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 0.9rem;
    }

    h3 {
        margin-bottom: 10px;
    }

    input[type="text"] {
        display: block;
        margin-top: 5px;
        padding: 8px;
        width: 100%;
        max-width: 500px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    label {
        margin-left: 5px;
    }
</style>
