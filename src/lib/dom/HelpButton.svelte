<script lang="ts">
    export let message: string = "";

    let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog}>
    <h2>Help</h2>
    <div class="overflow-y-scroll">
        <slot>
            <p>{message}</p>
        </slot>
    </div>
    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="btn btn-blue">?</button>

<style lang="postcss">
    button.btn.btn-blue {
        @apply px-3;
    }

    dialog div {
        max-height: 80vh;
    }
</style>