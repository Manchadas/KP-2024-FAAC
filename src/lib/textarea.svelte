<script>
    export let question;
</script>

<div class="text-area">
    <label for="textarea-{question.id}">{question.text}</label>
    <textarea id="textarea-{question.id}" placeholder="Your answer"></textarea>
</div>

<style>
    .text-area {
        margin-bottom: 10px;
    }
</style>
