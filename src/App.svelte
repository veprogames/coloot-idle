<script lang="ts">
    import { onMount } from "svelte";
    import { game } from "./lib/stores";
    import Arena from "./lib/enemy/Arena.svelte";
    import GameBackground from "./lib/enemy/GameBackground.svelte";
    import Player from "./lib/player/Player.svelte";
    import { loadGame } from "./lib/saveload/saveload";
    import tickGame, { tickEnemy, tickPlayer, tickSave } from "./lib/tick";
    import CreditsButton from "./lib/credits/CreditsButton.svelte";
    import Inventory from "./lib/player/Inventory.svelte";
    import PlayerHelpButton from "./lib/player/PlayerHelpButton.svelte";
    import OptionsButton from "./lib/dom/OptionsButton.svelte";

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

<main class="p-4 px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto max-w-[1120px]">
    <Arena arena={$game.arena} />
    <Player player={$game.player} />
    <Inventory player={$game.player}/>
    <div class="lg:fixed lg:right-0 lg:bottom-0 lg:p-4 lg:bg-black/40 flex justify-center flex-wrap items-center gap-2">
        <CreditsButton/>
        <OptionsButton />
        <PlayerHelpButton />
        <span>v1.0.4</span>
    </div>

    <GameBackground arena={$game.arena} />
</main>
