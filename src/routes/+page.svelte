<script>
    import { formState } from '../stores';
    let inputType;
    let currentForm;

    function addInput() {
        // console.log(currentForm);
        const formDataObj = {
            input_name: currentForm.input_name.value,
            input_type: currentForm.input_type.value,
        };
        
        // Set State
        formState.set([...$formState, formDataObj]);
        currentForm.input_name.value = '';
        currentForm.input_type.value = 'text';
    }

    function handleDelete(index) {
        const array = [...$formState];
        array.splice(index, 1);
        formState.set(array);
    }
</script>

<h1>Welcome to Form as a Code</h1>
<h2>Make your own form with this website</h2>

<div class="form">
    <form bind:this={currentForm} on:submit|preventDefault={addInput}>
        <div>
            <label for="input_name">Input Name</label>
            <input required type="text" name="input_name" />
        </div>
        <div>
            <label for="input_type">Input Type</label>
            <select name="input_type" bind:value={inputType} required>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="password">Password</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
                <option value="time">Time</option>
            </select>
        </div>
        <div>
            <label for="input_add">Add Input</label>
            <input class="btn_add" type="submit" name="input_add" value="Add Input" />
        </div>
    </form>
</div>

<div class="input_list">
    {#if $formState.length}
        <div>
            <p class="item_label">Name</p>
        </div>
        <div>
            <p class="item_label">Type</p>
        </div>
        <div>
            <p class="item_label">Delete</p>
        </div>
    {/if}
    {#each $formState as input, index (index)}
        <div class="item">
            <p>{input.input_name}</p>
        </div>
        <div class="item">
            <p>{input.input_type}</p>
        </div>
        <div class="item_btn">
            <button on:click={() => handleDelete(index)}>
                <span class="material-symbols-outlined">remove</span>
            </button>
        </div>
    {/each}
</div>


