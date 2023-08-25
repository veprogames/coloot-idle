<script lang="ts">
    import type Equipment from "../equipment/equipment";
    import EquipmentComponent from "./Equipment.svelte";
    import Player from "./player";

    export let player: Player;

    $: inventory = player.inventory;

    function equip(event: CustomEvent<Equipment>) {
        const equipment = event.detail;
        if(player.canEquip(equipment)) {
            player.equipFromInventory(equipment);
        }
        else {
            player.removeFromInventory(equipment)
        }
    }
</script>

<div>
    <h2>Inventory ({inventory.length} / {Player.INVENTORY_CAPACITY})</h2>
    <div class="flex flex-wrap">
        {#each inventory as equipment}
            <EquipmentComponent on:equip={equip} {equipment} />
        {/each}
    </div>
</div>
