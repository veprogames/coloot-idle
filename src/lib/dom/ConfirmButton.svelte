<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let clazz: string = "";
    export let disabled: boolean = false;
    export let message: string;

    let dialog: HTMLDialogElement;
    let dispatch = createEventDispatcher<{confirm: MouseEvent, click: MouseEvent}>();

    function openDialog(event: MouseEvent) {
        dialog.showModal();
        dispatch("click", event);
    }

    function confirm(event: MouseEvent) {
        dispatch("confirm", event);
        dialog.close();
    }

    function cancel() {
        dialog.close();
    }

    export {clazz as class};
</script>

<dialog bind:this={dialog}>
    <div>
        <slot name="message">
            <p>{message}</p>
        </slot>
    </div>
    <div class="flex justify-center gap-4">
        <button class="btn" on:click={confirm}>OK</button>
        <button class="btn" on:click={cancel}>Cancel</button>
    </div>
</dialog>

<button {disabled} on:click={openDialog} class="btn btn-warn {clazz}"><slot/></button>