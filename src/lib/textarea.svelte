<script>
    export let question;
</script>

<div class="text-area">
    <!-- Required checkbox in the upper-right corner -->
    <div class="required-checkbox">
        <label>
            <input type="checkbox" bind:checked={question.required} />
            Required
        </label>
    </div>

    <label for="textarea-{question.id}">{question.text}</label>
    <textarea id="textarea-{question.id}" placeholder="Your answer"></textarea>
</div>

<style>
    .text-area {
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

    .text-area textarea {
        margin-top: 5px;
        padding: 10px;
        font-size: 1rem;
        width: 100%;
        min-height: 100px;
    }
</style>
