<script lang="ts">
    import { I } from "../images";
    import Enemy from "./Enemy.svelte";
    import type Arena from "./arena";

    export let arena: Arena;
</script>

<section class="text-center">
    <div class="flex gap-1 items-center justify-center text-lg font-semibold">
        <img src={I.arena.world} alt="Stage"/>
        {arena.stageName}
    </div>
    <Enemy enemy={arena.currentEnemy} />
    {#if arena.isOnHighestStage}
        {#if !arena.isBossActive}
            <button on:click={() => arena.activateBoss()} class="btn my-2">Fight Boss</button>
        {:else}
            <button on:click={() => arena.deactivateBoss()} class="btn my-2">Flee</button>
        {/if}
    {/if}
</section>

<style>
    div img {
        height: 1.5em;
    }
</style>