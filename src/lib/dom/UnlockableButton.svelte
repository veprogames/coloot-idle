<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import type { Unsubscriber } from "svelte/store";
    import type GameClass from "../game/gameclass";
    import { game } from "../stores";

    export let clazz: string = "";
    export let condition: (game: GameClass) => boolean;
    let fulfilled: boolean = false;

    let unsubscribe: Unsubscriber;

    const dispatch = createEventDispatcher<{click: MouseEvent}>()

    function emitClick(mouseEvent: MouseEvent) {
        if(fulfilled) {
            dispatch("click", mouseEvent);
        }
    }

    onMount(() => {
        fulfilled = condition($game);
        unsubscribe = game.subscribe((game) => {
            fulfilled = condition(game);
        });
    });

    onDestroy(() => {
        unsubscribe();
    });

    export { clazz as class };
</script>

<button on:click={(event) => emitClick(event)} disabled={!fulfilled} class="btn {clazz}">
    {#if fulfilled}
        <slot></slot>
    {:else}
        <slot name="locked">Locked</slot>
    {/if}
</button>