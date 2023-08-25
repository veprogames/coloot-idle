<script lang="ts">
    import { onMount } from "svelte";
    import Player from "./lib/player/Player.svelte";
    import { game } from "./lib/stores";
    import tickGame from "./lib/tick";
    import Arena from "./lib/enemy/Arena.svelte";

    let prev = Date.now();

    function tick() {
        const dt = (Date.now() - prev) / 1000;
        tickGame(dt);
        prev = Date.now();

        setTimeout(tick, 0);
    }

    onMount(() => {
        tick();
    });
</script>

<main>
    <Arena arena={$game.arena} />
    <Player player={$game.player} />
</main>
