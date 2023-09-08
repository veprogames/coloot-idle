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

<div class="bg-black bg-opacity-30 p-4">
    <h2>{crystal.data.title} Lv. {crystal.level}</h2>
    <p>{crystal.data.description}</p>
    <p>Current: <span class="text-green-400 font-semibold">x{F(crystal.effect, true)}</span></p>

    <button on:click={invest} class="btn">
        Invest (+{crystal.getNewLevels(player)}) <br/>
        To: x{F(crystal.getEffect(crystal.getLevels(player.level)), true)}
    </button>
</div>