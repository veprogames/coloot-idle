<script lang="ts">
    import { game } from "../stores";
    import PrestigeCrystal from "./PrestigeCrystal.svelte";
</script>

<div class="flex flex-col gap-4">
    <PrestigeCrystal crystal={$game.prestigeCrystals.power} />
    <PrestigeCrystal crystal={$game.prestigeCrystals.rarity} />
    <PrestigeCrystal crystal={$game.prestigeCrystals.magic} />
</div>