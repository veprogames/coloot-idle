<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type Equipment from "../equipment/equipment";
    import { EquipmentType } from "../equipment/equipment";
    import { F } from "../utils";

    export let equipment: Equipment;

    const dispatch = createEventDispatcher<{equip: Equipment}>();

    // Temporary! This is supposed to be an image
    $: typeName = {
        [EquipmentType.WEAPON]: "W",
        [EquipmentType.ARMOR]: "A",
        [EquipmentType.ACCESSORY]: "O",
    }[equipment.type];

    function dispatchEquip() {
        dispatch("equip", equipment);
    }
</script>

<button on:click={dispatchEquip} class="inline-flex flex-col justify-center align-middle text-center w-16 h-16 bg-gray-500">
    <span class="font-bold">{F(equipment.stat)}</span>
    <span>{typeName}</span>
</button>