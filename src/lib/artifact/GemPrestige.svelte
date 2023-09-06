<script lang="ts">
    import { game } from "../stores";
    import type ArtifactShop from "./artifactshop";

    export let artifactShop: ArtifactShop;
</script>

<div class="bg-black bg-opacity-30 rounded-md p-4">
    <h2>Gem Prestige</h2>
    <p>
        Turn your Levels into Gems. This process is destructive and will destroy your equipment
        and also drain everything out of your Prestige Crystals. Are you sure?
    </p>
    <button on:click={() => artifactShop.activate()} class="btn">+{artifactShop.getGems($game.player.level)} Gems</button>
</div>