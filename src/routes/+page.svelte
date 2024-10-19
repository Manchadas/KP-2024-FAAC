<script>
    import {formState,recents} from '../stores';
    
    let inputType ;
    
    let currentForm ;
    
    function addInput(e){
        console.log(currentForm.input_name);
        const formDataObj ={
            input_name:currentForm.input_name.value,
            input_type:currentForm.input_type.value
    
        };
        console.log(formDataObj)
        //set state
        formState.set([...$formState,formDataObj])
        //clear form
        currentForm.input_name.value = '';
        currentForm.input_type.value = 'text'
    
    
    
        if($recents.map((input) => input.input_name).includes(formDataObj.input_name))return
        recents.set([...$recents,formDataObj]);
        console.log($formState)
    }
    
    function handleDelete(index){
        const array = $formState;
        array.splice(index,1)
        formState.set(array);
    }
    
    function loadRecent(){
        const value = JSON.parse(currentForm?.input_recent?.value?? "{}")
       if(!value) return
        console.log(value)
        currentForm.input_name.value = value.input_name;
        currentForm.input_type.value = value.input_type;
    
    }
    
    
    </script>
    
    
    
    
    <h1>Welcome to Form as a Code</h1>
    <h2>Build your form!</h2>
    
    <div class="form">
        <form bind:this={currentForm}  on:submit|preventDefault={addInput}>
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
                <input class="btn_add" type="submit" name="input_add" bind:value={inputType} />
            </div>
            <div>
                <label for="input_recent">Recents</label>
                {#if $recents.length}
    
                <select on:change={loadRecent} name="input_recent">
                    <option value={{input_name: '',input_type:'text'}}>None</option>
                    {#each $recents as recentInput, index ("recent"+index)}
                        <option value={JSON.stringify(recentInput)}>{recentInput.input_name}</option>
                    {/each}
    
                </select>
                {:else}
                <span>Empty</span>
                {/if}
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
        {#each $formState as input , index (index)}
                <div class="item">
                    <p>{input.input_name}</p>
                </div>
                <div class="item">
                    <p>{input.input_type}</p>
                </div>
                <div class="item_btn">
                    <button on:click={handleDelete(index)}><span class="material-symbols-outlined">
                        delete
                        </span></button>
                </div>
        {/each}
    </div>
    
    
    
    
    <style>
        h1{
            margin: .25em;
            margin: 1em;
        }
        h2{
            margin: .25em;
        }
        form{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
    
        .form{
            width: 60%;
            height:3em;
            margin-left: 4em;
            margin-right: 4em;
            padding:.5em;
            background-color: #5b615f;
            border: 2px solid #FFF;
        }
    
        label{
            display: block;
        }
    
        .input_list{
            padding:1em;
            width:30%;
            display: grid;
            grid-template-columns: auto auto auto;
        }
    
        p{
            text-align: center;
        }
        .item_label{
            border: 2px solid #FFF;
        }
        .item{
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .item_btn{
            text-align: center;
            padding-top: .75em;
        }
        button:hover{
            cursor: pointer;
            opacity: .5;
    
        }
        .btn_add:hover{
            cursor: pointer;
            opacity: .5;
        }
    
    </style>