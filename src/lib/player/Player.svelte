<script lang="ts">
    import { F } from "../utils";
    import EquipmentText from "./EquipmentText.svelte";
    import Inventory from "./Inventory.svelte";
    import type Player from "./player";

    export let player: Player;
</script>

<div>
    <progress value={player.hpPercentage} max=1></progress> <span>({F(player.hp)} / {F(player.maxHp)})</span>
    <p>DMG - {F(player.power)} | MagicFind - {F(player.magicFind)}</p>
    <EquipmentText equipment={player.weapon}/>
    <EquipmentText equipment={player.armor}/>
    <EquipmentText equipment={player.accessory}/>
    <Inventory {player}/>
</div>