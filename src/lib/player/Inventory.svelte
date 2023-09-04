<script lang="ts">
    import ArtifactShopDialog from "../artifact/ArtifactShopDialog.svelte";
import type Equipment from "../equipment/equipment";
    import { game } from "../stores";
    import Artifact from "./Artifact.svelte";
    import EquipmentComponent from "./Equipment.svelte";
    import Player from "./player";

    export let player: Player;

    let containerWidth: number;

    let dialog: ArtifactShopDialog;

    $: inventory = player.inventory;
    $: bagWidth = `${Math.min(64 * 8, Math.floor(containerWidth / 64) * 64)}px`;

    function equip(equipment: Equipment) {
        if(player.canEquip(equipment)) {
            player.equipFromInventory(equipment);
        }
        else {
            player.scrapEquipment(equipment);
        }
    }

    function onEquip(event: CustomEvent<Equipment>){
        equip(event.detail);
    }

    function equipAll() {
        for(const equipment of inventory.equipment) {
           equip(equipment);
        }
    }

    function openShop() {
        dialog.open();
    }
</script>

<ArtifactShopDialog bind:this={dialog} shop={$game.artifactShop} />

<div bind:clientWidth={containerWidth}>
    <div class="flex justify-between items-center py-2 pb-4">
        <h2>Inventory ({inventory.equipment.length} / {inventory.equipmentCapacity})</h2>
        <button on:click={equipAll} class="btn">Equip All</button>
    </div>
    <div class="bag flex flex-wrap justify-start bg-black bg-opacity-30 mx-auto" style:width={bagWidth}>
        {#each inventory.equipment as equipment (equipment)}
            <EquipmentComponent on:equip={onEquip} {equipment} />
        {/each}
    </div>
    <div class="flex justify-between items-center py-2 pb-4">
        <h2>Artifacts ({inventory.artifactCount})</h2>
        <button on:click={openShop} class="btn">Buy</button>
    </div>
    <div class="bag flex flex-wrap bg-black bg-opacity-30 mx-auto" style:width={bagWidth}>
        {#each inventory.artifacts as artifact (artifact)}
            <Artifact {artifact}/>
        {/each}
    </div>
</div>

<style lang="postcss">
    .bag {
        min-height: 8rem;
    }
</style>