<script lang="ts">
    import Statbar from "../dom/Statbar.svelte";
    import { I } from "../images";
    import { F } from "../utils";
    import EquipmentText from "./EquipmentText.svelte";
    import Inventory from "./Inventory.svelte";
    import type Player from "./player";

    export let player: Player;
</script>

<section>
    <div class="flex flex-wrap justify-between text-lg">
        <div class="flex flex-col justify-evenly items-start gap-1">
            <div class="stat" title="Damage">
                <img src={I.stat.power} alt="Power"/>
                {F(player.power)}
            </div>
            <div class="stat" title="Rarity">
                <img src={I.stat.rarity} alt="Magic Find"/>
                x{F(player.rarityMultiplier, true)}
            </div>
            <div class="stat" title="Magic Find (Multiplies Stats of found Equipment)">
                <img src={I.stat.magicFind} alt="Magic Find"/>
                x{F(player.magicFind, true)}
            </div>
        </div>
        <div class="flex flex-col gap-1 items-end">
            <EquipmentText equipment={player.weapon}/>
            <EquipmentText equipment={player.armor}/>
            <EquipmentText equipment={player.accessory}/>
        </div>
    </div>
    <Statbar center width="18rem" value={player.hpPercentage}>HP: {F(player.currentHp)}/{F(player.hp)}</Statbar>
    <p class="text-center" title="Level (Multiplies various stats)">
        Level {(player.level).toLocaleString("en-US")}
    </p>
    <Statbar center width="18rem" value={player.xpPercentage}>{F(player.xp)}/{F(player.xpRequired)}</Statbar>
    <Inventory {player}/>
</section>

<style lang="postcss">
    div.stat {
        @apply flex items-center gap-2;
    }

    div.stat img {
        height: 1.5em;
    }
</style>