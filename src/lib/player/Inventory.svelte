<script lang="ts">
    import Artifact from "../artifact/Artifact.svelte";
    import ArtifactShopDialog from "../artifact/ArtifactShopDialog.svelte";
    import { ARTIFACTS_BASE_REQUIRED_LEVEL } from "../artifact/artifactshop";
    import UnlockableButton from "../dom/UnlockableButton.svelte";
    import type Equipment from "../equipment/equipment";
    import PrestigeCrystalContent from "../prestigecrystal/PrestigeCrystalContent.svelte";
    import { CRYSTAL_BASE_REQUIRED_LEVEL } from "../prestigecrystal/prestigecrystal";
    import SaveManagementButton from "../saveload/SaveManagementButton.svelte";
    import { game } from "../stores";
    import EquipmentComponent from "./Equipment.svelte";
    import PlayerHelpButton from "./PlayerHelpButton.svelte";
    import Player from "./player";

    export let player: Player;

    let containerWidth: number;
    let tab: "equipment" | "artifacts" | "crystals" = "equipment";

    let dialog: ArtifactShopDialog;

    let bagSlotsPerRow: number;

    $: inventory = player.inventory;

    $: {
        const base = Math.floor(containerWidth / 64);
        bagSlotsPerRow = [4, 6, 8, 12].findLast(v => base >= v) ?? 4;
    }
    $: bagWidth = `${bagSlotsPerRow * 64}px`;
    $: bagHeight = `${Math.min(6, Math.ceil(inventory.equipmentCapacity / bagSlotsPerRow)) * 64}px`;

    function onEquip(event: CustomEvent<Equipment>){
        player.equipOrScrap(event.detail);
    }

    function equipAll() {
        player.equipAll();
    }

    function openShop() {
        dialog.open();
    }
</script>

<ArtifactShopDialog bind:this={dialog} shop={$game.artifactShop} />

<div bind:clientWidth={containerWidth}>
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-4 my-2">
        <button on:click={() => tab = "equipment"} class="btn">Loot</button>
        <UnlockableButton on:click={() => tab = "crystals"} condition={(game) => game.prestigeCrystalsUnlocked}>
            <span slot="locked">Reach Level {CRYSTAL_BASE_REQUIRED_LEVEL}</span>
            <span>Crystals</span>
        </UnlockableButton>
        <UnlockableButton on:click={() => tab = "artifacts"} condition={(game) => game.artifactShop.unlocked}>
            <span slot="locked">Reach Level {ARTIFACTS_BASE_REQUIRED_LEVEL}</span>
            <span>Artifacts</span>
        </UnlockableButton>
        <SaveManagementButton />
        <PlayerHelpButton />
    </div>
    {#if tab === "equipment"}
        <div class="bag-actions" style:width={bagWidth}>
            <h2>Loot ({inventory.equipment.length}/{inventory.equipmentCapacity})</h2>
            <button on:click={equipAll} class="btn">Equip All</button>
        </div>
        <div class="bag-actions" style:width={bagWidth}>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" bind:checked={player.autoEquip} />
                <span>Auto Equip</span>
            </label>
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
    {:else if tab === "crystals"}
        <PrestigeCrystalContent />
    {/if}
</div>

<style lang="postcss">
    .bag-actions {
        @apply flex justify-between items-center py-2 mx-auto;
    }

    .bag {
        @apply flex flex-wrap content-start bg-black bg-opacity-30 mx-auto overflow-scroll;
    }
</style>