<script lang="ts">
    import Enemy from "./Enemy.svelte";
import type Arena from "./arena";

    export let arena: Arena;
</script>

<div>
    Stage {arena.currentStage} / {arena.maxStage}
    <Enemy enemy={arena.currentEnemy}/>
</div>