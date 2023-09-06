<script lang="ts">
    import GemPrestige from "../artifact/GemPrestige.svelte";
import { game } from "../stores";
    import PrestigeCrystal from "./PrestigeCrystal.svelte";
</script>

<div class="flex flex-col gap-4">
    <PrestigeCrystal crystal={$game.prestigeCrystals.power} />
    <PrestigeCrystal crystal={$game.prestigeCrystals.rarity} />
    <PrestigeCrystal crystal={$game.prestigeCrystals.magic} />
    <GemPrestige artifactShop={$game.artifactShop}/>
</div>