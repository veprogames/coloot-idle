<script lang="ts">
    import { game } from "../stores";
    import { F } from "../utils";
    import type { PrestigeCrystal } from "./prestigecrystal";

    export let crystal: PrestigeCrystal;

    $: player = $game.player;

    function invest() {
        crystal.invest(player);
    }
</script>

<div class="flex flex-col md:flex-row gap-4 justify-between bg-black bg-opacity-30 p-4 text-left">
    <div class="flex flex-col gap-2">
        <h2>{crystal.data.title} Lv. {crystal.level}</h2>
        <p class="text-xs max-w-xs">
            {crystal.data.description}
        </p>
        <p class="flex gap-2 items-center">
            <img class="w-8 h-8 inline" src={crystal.data.statIcon} alt={crystal.data.description}/>
            <span class="text-green-400 font-semibold text-xl">x{F(crystal.effect, true)}</span>
        </p>
    </div>

    {#if crystal.canInvest(player)}
        <button on:click={invest} class="btn btn-warn">
            Add +{crystal.getNewLevels(player)} <br/>
            To: x{F(crystal.getEffect(crystal.getLevels(player.level)), true)}
        </button>
    {:else}
        <button disabled class="btn">Reach<br/>Level {crystal.investedPlayerLevel + 1}</button>
    {/if}
</div>

<style lang="postcss">
    button {
        min-width: 12rem;
    }
</style>