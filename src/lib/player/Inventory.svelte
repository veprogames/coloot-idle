<script lang="ts">
    import ArtifactShopDialog from "../artifact/ArtifactShopDialog.svelte";
    import type Equipment from "../equipment/equipment";
    import { game } from "../stores";
    import Artifact from "../artifact/Artifact.svelte";
    import EquipmentComponent from "./Equipment.svelte";
    import Player from "./player";

    export let player: Player;

    let containerWidth: number;
    let tab: "equipment" | "artifacts" = "equipment";

    let dialog: ArtifactShopDialog;

    let bagSlotsPerRow: number;

    $: inventory = player.inventory;

    $: {
        const base = Math.min(8, Math.floor(containerWidth / 64));
        bagSlotsPerRow = [4, 6, 8, 12].findLast(v => base >= v) ?? 4;
    }
    $: bagWidth = `${bagSlotsPerRow * 64}px`;
    $: bagHeight = `${Math.min(6, Math.ceil(inventory.equipmentCapacity / bagSlotsPerRow)) * 64}px`;

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
    <div class="flex gap-4">
        <button on:click={() => tab = "equipment"} class="btn">Loot</button>
        <button on:click={() => tab = "artifacts"} class="btn">Artifacts</button>
    </div>
    {#if tab === "equipment"}
        <div class="bag-actions" style:width={bagWidth}>
            <h2>Loot ({inventory.equipment.length} / {inventory.equipmentCapacity})</h2>
            <button on:click={equipAll} class="btn">Equip All</button>
        </div>
        <div class="bag" style:width={bagWidth} style:height={bagHeight}>
            {#each inventory.equipment as equipment (equipment)}
                <EquipmentComponent on:equip={onEquip} {equipment} />
            {/each}
        </div>
    {:else if tab === "artifacts"}
        <div class="bag-actions" style:width={bagWidth}>
            <h2>Artifacts ({inventory.artifactCount})</h2>
            <button on:click={openShop} class="btn">Buy</button>
        </div>
        <div class="bag" style:width={bagWidth} style:height={bagHeight}>
            {#each inventory.artifacts as artifact (artifact)}
                <Artifact {artifact}/>
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    .bag-actions {
        @apply flex justify-between items-center py-2 pb-4 mx-auto;
    }

    .bag {
        @apply flex flex-wrap content-start bg-black bg-opacity-30 mx-auto overflow-scroll;
    }
</style>