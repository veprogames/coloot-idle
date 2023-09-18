<script lang="ts">
    import { game } from "../stores";
    import WipeSaveButton from "./WipeSaveButton.svelte";
    import { getSaveString, loadGameFromString, saveGame } from "./saveload";

    let dialog: HTMLDialogElement;
    let exportCode: string = "";
    let error: boolean = false;

    function exportSave() {
        exportCode = getSaveString($game);
    }

    function importSave() {
        error = false;
        if(exportCode.length === 0) return;
        try {
            loadGameFromString(exportCode);
        }
        catch {
            error = true;
        }
    }
</script>

<dialog bind:this={dialog}>
    <h2>Save Management</h2>
    <button on:click={exportSave} class="btn">Export &darr;</button>
    <textarea bind:value={exportCode}></textarea>
    <button on:click={importSave} disabled={exportCode.length === 0} class="btn">Import &darr;</button>
    {#if error}
        <p class="text-red-400">Invalid Save String.</p>
    {/if}

    <button on:click={() => saveGame()} class="btn">Manual Save</button>
    <WipeSaveButton />

    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="btn">Save Management</button>