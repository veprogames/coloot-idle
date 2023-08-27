<script lang="ts">
    import { onMount } from "svelte";
    import Player from "./lib/player/Player.svelte";
    import { game } from "./lib/stores";
    import tickGame, { tickEnemy, tickPlayer } from "./lib/tick";
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
        tickPlayer();
        tickEnemy();
    });
</script>

<main class="p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
    <Arena arena={$game.arena} />
    <Player player={$game.player} />

    <img class="bg fixed left-0 top-0 -z-10 h-screen w-auto" src="./images/bg.png" alt="Game Background, torchlit dungeon"/>
</main>

<style lang="postcss">
    img.bg {
        mask-image: linear-gradient(125deg, rgba(1, 1, 1, 0.7), transparent);
    }
</style>