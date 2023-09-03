<script lang="ts">
    import { onMount } from "svelte";
    import Player from "./lib/player/Player.svelte";
    import { game } from "./lib/stores";
    import tickGame, { tickEnemy, tickPlayer } from "./lib/tick";
    import Arena from "./lib/enemy/Arena.svelte";
    import GameBackground from "./lib/enemy/GameBackground.svelte";
    import PrestigeCrystalContent from "./lib/prestigecrystal/PrestigeCrystalContent.svelte";

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
    <PrestigeCrystalContent />

    <GameBackground arena={$game.arena} />
</main>