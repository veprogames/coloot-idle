<script lang="ts">
    import GemPrestige from "../artifact/GemPrestige.svelte";
    import HelpButton from "../dom/HelpButton.svelte";
    import { game } from "../stores";
    import PrestigeCrystal from "./PrestigeCrystal.svelte";
</script>

<div class="flex flex-col gap-4">
    <div class="flex justify-center items-center gap-2">
        <h2>Crystals</h2>
        <HelpButton>
            <p>
                Invest your Level into Crystals, gaining a bosst, but losing your equipment and level.
            </p>
        </HelpButton>
    </div>
    <PrestigeCrystal crystal={$game.prestigeCrystals.power} />
    <PrestigeCrystal crystal={$game.prestigeCrystals.rarity} />
    <PrestigeCrystal crystal={$game.prestigeCrystals.magic} />
    <GemPrestige artifactShop={$game.artifactShop}/>
</div>