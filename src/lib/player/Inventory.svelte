<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import Artifact from "../artifact/Artifact.svelte";
    import ArtifactShopDialog from "../artifact/ArtifactShopDialog.svelte";
    import { ARTIFACTS_BASE_REQUIRED_LEVEL } from "../artifact/artifactshop";
    import UnlockableButton from "../dom/UnlockableButton.svelte";
    import type Equipment from "../equipment/equipment";
    import PrestigeCrystalContent from "../prestigecrystal/PrestigeCrystalContent.svelte";
    import { CRYSTAL_BASE_REQUIRED_LEVEL } from "../prestigecrystal/prestigecrystal";
    import { game } from "../stores";
    import EquipmentComponent from "./Equipment.svelte";
    import PlayerHelpButton from "./PlayerHelpButton.svelte";
    import Player from "./player";

    export let player: Player;

    let containerWidth: number;
    let tab: "equipment" | "artifacts" | "crystals" = "equipment";

    let dialog: ArtifactShopDialog;

    let bagSlotsPerRow: number;

    let autoEquip: boolean = false;
    let autoEquipInterval: number;

    $: inventory = player.inventory;

    $: {
        const base = Math.floor(containerWidth / 64);
        bagSlotsPerRow = [4, 6, 8, 12, 16].findLast((v) => base >= v) ?? 4;
    }
    $: bagWidth = `${bagSlotsPerRow * 64}px`;
    $: bagHeight = `${Math.min(6, Math.ceil(inventory.equipmentCapacity / bagSlotsPerRow)) * 64}px`;

    function equip(equipment: Equipment) {
        if (player.canEquip(equipment)) {
            player.equipFromInventory(equipment);
        } else {
            player.scrapEquipment(equipment);
        }
    }

    function onEquip(event: CustomEvent<Equipment>) {
        equip(event.detail);
    }

    function equipAll() {
        for (const equipment of inventory.equipment) {
            equip(equipment);
        }
    }

    function openShop() {
        dialog.open();
    }

    onMount(() => {
        autoEquipInterval = setInterval(() => {
            if (autoEquip) {
                equipAll();
            }
        }, 10000);
    });

    onDestroy(() => {
        if (autoEquipInterval) {
            clearInterval(autoEquipInterval);
        }
    });
</script>

<ArtifactShopDialog bind:this={dialog} shop={$game.artifactShop} />

<div class="inventory" bind:clientWidth={containerWidth}>
    <div
        class="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-4 my-2"
    >
        <button on:click={() => (tab = "equipment")} class="btn">Loot</button>
        <UnlockableButton
            on:click={() => (tab = "crystals")}
            condition={(game) => game.prestigeCrystalsUnlocked}
        >
            <span slot="locked">Reach Level {CRYSTAL_BASE_REQUIRED_LEVEL}</span>
            <span>Crystals</span>
        </UnlockableButton>
        <UnlockableButton
            on:click={() => (tab = "artifacts")}
            condition={(game) => game.artifactShop.unlocked}
        >
            <span slot="locked"
                >Reach Level {ARTIFACTS_BASE_REQUIRED_LEVEL}</span
            >
            <span>Artifacts</span>
        </UnlockableButton>
    </div>
    {#if tab === "equipment"}
        <div class="bag-actions" style:width={bagWidth}>
            <h2>
                Loot ({inventory.equipment
                    .length}/{inventory.equipmentCapacity})
            </h2>
            <div class="flex justify-end gap-4">
                <button on:click={equipAll} class="btn">Equip All</button>
                <label class="flex justify-start items-center gap-2"
                    ><input bind:checked={autoEquip} type="checkbox" /> Auto</label
                >
            </div>
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
                <Artifact {artifact} />
            {/each}
        </div>
    {:else if tab === "crystals"}
        <PrestigeCrystalContent />
    {/if}
</div>

<style lang="postcss">
    .inventory {
        /* same as lg: */
        @media (min-width: 1024px) {
            grid-column: span 2;
        }
    }

    .bag-actions {
        @apply flex justify-between items-center py-2 pb-4 gap-4 mx-auto;
    }

    .bag {
        @apply flex flex-wrap content-start bg-black bg-opacity-30 mx-auto overflow-scroll;
    }
</style>
