<script>
    import {formState} from '../../stores';
    function submit(){
        alert("Thanks for submitting!")
    }

</script>

<h1>Form Page</h1>

<form  on:submit|preventDefault={submit}>
    <div class="form">
        {#each $formState as input, index ("form"+index)}
        <div>
            <label for={input.input_name}>{input.input_name}</label>
            <input required type={input.input_type} name={input.input_name} />
        </div>
        {/each}

    </div>
    {#if $formState.length}
    <div class="btn">
        <input class="btn_submit" type="submit" name="input_add" value="Submit" />
    </div>
    {/if}
</form>




<style>
    h1{
        margin: .25em;
        margin: 1em;
    }
    .form{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 40vw;

    }
    label{
        display: block;
    }
    .btn_submit{
        align-self: flex-end;
        justify-self: end;
    }
    .btn_submit:hover{
        cursor: pointer;
        opacity: .5;
    }
    .btn{
        padding-top:1em;
        text-align: center;
    }

</style>