<script lang="ts">
    import ConfirmButton from "../dom/ConfirmButton.svelte";
    import { game } from "../stores";
    import type ArtifactShop from "./artifactshop";

    export let artifactShop: ArtifactShop;

    $: playerLevel = $game.player.level;
    $: gemGain = artifactShop.getGems(playerLevel);
</script>

<div class="bg-black bg-opacity-30 rounded-md p-4">
    <h2>Gem Prestige</h2>
    {#if playerLevel < 100}
        <p>
            Level 100 is required
        </p>
    {:else}
        <p>
            Turn your Levels into Gems, which can be used to buy Artifacts.
        </p>
        <ConfirmButton 
            disabled={gemGain <= 0}
            on:confirm={() => artifactShop.activate()}
            message="This process is destructive and will destroy your equipment
            and also drain everything out of your Prestige Crystals. Are you sure?">
            +{gemGain} Gems
        </ConfirmButton>
    {/if}
</div>