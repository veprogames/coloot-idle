<script lang="ts">
    import { onMount } from "svelte";
    import { game } from "./lib/stores";
    import Arena from "./lib/enemy/Arena.svelte";
    import GameBackground from "./lib/enemy/GameBackground.svelte";
    import Player from "./lib/player/Player.svelte";
    import { loadGame } from "./lib/saveload/saveload";
    import tickGame, { tickEnemy, tickPlayer, tickSave } from "./lib/tick";
    import CreditsButton from "./lib/credits/CreditsButton.svelte";

    let prev = Date.now();

    function tick() {
        const dt = (Date.now() - prev) / 1000;
        tickGame(dt);
        prev = Date.now();

        setTimeout(tick, 0);
    }

    onMount(() => {
        $game.player.initialize();

        tick();
        tickPlayer();
        tickEnemy();
        setTimeout(tickSave, 20000);

        try {
            loadGame();
        }
        catch(e) {
            alert(`Error while loading Game: ${e}`);
        }
    });
</script>

<svelte:head>
    <title>{$game.arena.stageName}</title>
</svelte:head>

<main class="p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
    <Arena arena={$game.arena} />
    <Player player={$game.player} />
    <div class="flex flex-wrap items-center gap-2">
        <CreditsButton/>
        <span>v1.0.1</span>
    </div>

    <GameBackground arena={$game.arena} />
</main>