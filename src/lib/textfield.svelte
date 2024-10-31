<script>
    export let question;
</script>

<div class="text-field">
    <!-- Required checkbox in the upper-right corner -->
    <div class="required-checkbox">
        <label>
            <input type="checkbox" bind:checked={question.required} />
            Required
        </label>
    </div>

    <label for="text-input-{question.id}">{question.text}</label>
    <input id="text-input-{question.id}" type="text" placeholder="Your answer" />
</div>

<style>
    .text-field {
        margin-bottom: 10px;
        position: relative; /* Positioning for the required checkbox */
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 600px;
    }

    .required-checkbox {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 0.9rem;
    }

    .text-field input[type="text"] {
        margin-top: 5px;
        padding: 10px;
        font-size: 1rem;
        width: 100%;
    }
</style>
