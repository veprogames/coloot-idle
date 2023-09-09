<script lang="ts">
    import { game } from "../stores";
    import { getSaveString, loadGame, loadGameFromString, saveGame, wipeGame } from "./saveload";

    let dialog: HTMLDialogElement;
    let exportCode: string = "";

    function exportSave() {
        exportCode = getSaveString($game);
    }

    function importSave() {
        if(exportCode.length === 0) return;
        loadGameFromString(exportCode);
    }
</script>

<dialog bind:this={dialog}>
    <h2>Save Management</h2>
    <button on:click={() => saveGame()} class="btn">Manual Save</button>
    <button on:click={() => wipeGame()} class="btn">WIPE</button>
    <textarea bind:value={exportCode}></textarea>
    <button on:click={exportSave} class="btn">Export</button>
    <button on:click={importSave} disabled={exportCode.length === 0} class="btn">Import</button>

    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="btn">Save Management</button>