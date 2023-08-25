<script lang="ts">
    import Enemy from "./Enemy.svelte";
    import type Arena from "./arena";

    export let arena: Arena;
</script>

<div>
    Stage {arena.currentStage} / {arena.maxStage}<br />
    Kills {arena.killsOnHighestStage} / {arena.requiredKills}
    <Enemy enemy={arena.currentEnemy} />
    <button on:click={() => arena.prevStage()}>prev</button>
    <button on:click={() => arena.nextStage()}>next</button>
</div>
