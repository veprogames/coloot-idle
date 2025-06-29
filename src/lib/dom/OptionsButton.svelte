<script lang="ts">
    import WipeSaveButton from "../saveload/WipeSaveButton.svelte";
    import { game } from "../stores";
    import {
        getSaveString,
        loadGameFromString,
        saveGame,
    } from "../saveload/saveload";

    let dialog: HTMLDialogElement;
    let exportCode: string = "";
    let error: boolean = false;

    function exportSave() {
        exportCode = getSaveString($game);
    }

    function importSave() {
        error = false;
        if (exportCode.length === 0) return;
        try {
            loadGameFromString(exportCode);
        } catch {
            error = true;
        }
    }
</script>

<dialog bind:this={dialog}>
    <h2>Options</h2>
    <p>Number Format:</p>
    <div class="flex flex-wrap gap-4">
        <button
            class="btn"
            on:click={() => ($game.settings.numberFormat = "default")}
            >Default</button
        >
        <button
            class="btn"
            on:click={() => ($game.settings.numberFormat = "scientific")}
            >Scientific</button
        >
    </div>

    <h2>Save Management</h2>
    <button on:click={exportSave} class="btn">Export &darr;</button>
    <textarea bind:value={exportCode}></textarea>
    <button on:click={importSave} disabled={exportCode.length === 0} class="btn"
        >Import &darr;</button
    >
    {#if error}
        <p class="text-red-400">Invalid Save String.</p>
    {/if}

    <button on:click={() => saveGame()} class="btn">Manual Save</button>
    <WipeSaveButton />

    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="btn">Options</button>
