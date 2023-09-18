<script lang="ts">
    import { wipeGame } from "./saveload";

    const RESET_STRING = "begone coloot";
    let value: string = "";
    let dialog: HTMLDialogElement;

    $: canReset = value.trim() === RESET_STRING;

    function wipe() {
        if(canReset) {
            wipeGame();
            value = "";
        }
    }
</script>

<dialog bind:this={dialog}>
    <h2>WIPE SAVE</h2>
    <p>
        This will reset absolutely everything! Are you sure?
        Type <span class="text-green-400">{RESET_STRING}</span> into the text box below
        and click "WIPE".
    </p>
    <input type="text" bind:value />
    <button disabled={!canReset} on:click={wipe} class="btn btn-crit">WIPE</button>
    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="btn">Wipe Save</button>