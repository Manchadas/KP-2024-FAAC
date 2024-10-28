<script>
    export let question;
</script>

<div class="text-field">
    <label for="text-input-{question.id}">{question.text}</label>
    <input id="text-input-{question.id}" type="text" placeholder="Your answer" />
</div>

<style>
    .text-field {
        margin-bottom: 10px;
    }
</style>
