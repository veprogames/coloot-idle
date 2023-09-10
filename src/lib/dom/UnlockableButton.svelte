<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type GameClass from "../game/gameclass";
    import { game } from "../stores";

    export let clazz: string = "";
    export let condition: (game: GameClass) => boolean;

    const dispatch = createEventDispatcher<{click: MouseEvent}>()

    function isFulfilled() {
        return condition($game);
    }

    function emitClick(mouseEvent: MouseEvent) {
        if(isFulfilled()) {
            dispatch("click", mouseEvent);
        }
    }

    export { clazz as class };
</script>

<button on:click={(event) => emitClick(event)} disabled={!isFulfilled()} class="btn {clazz}">
    {#if isFulfilled()}
        <slot></slot>
    {:else}
        <slot name="locked">Locked</slot>
    {/if}
</button>