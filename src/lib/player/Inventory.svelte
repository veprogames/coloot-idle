<script lang="ts">
    import type Equipment from "../equipment/equipment";
    import Artifact from "./Artifact.svelte";
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
            player.scrapEquipment(equipment);
        }
    }
</script>

<div>
    <h2>Inventory ({inventory.equipment.length} / {inventory.equipmentCapacity})</h2>
    <div class="flex flex-wrap justify-start bg-black bg-opacity-30">
        {#each inventory.equipment as equipment (equipment)}
            <EquipmentComponent on:equip={equip} {equipment} />
        {/each}
    </div>
    <h2>Artifacts ({inventory.artifacts.length})</h2>
    <div class="flex flex-wrap bg-black bg-opacity-30">
        {#each inventory.artifacts as artifact}
            <Artifact {artifact}/>
        {/each}
    </div>
</div>
