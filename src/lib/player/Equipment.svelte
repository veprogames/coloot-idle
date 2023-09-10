<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type Equipment from "../equipment/equipment";
    import { EquipmentType } from "../equipment/equipment";
    import { F } from "../utils";
    import { game } from "../stores";
    import { fade, fly } from "svelte/transition";

    export let equipment: Equipment;

    const hueshift = Math.floor(Math.random() * 360);
    const saturation = 0.5 + Math.random();

    const dispatch = createEventDispatcher<{equip: Equipment}>();

    // Temporary! This is supposed to be an image
    $: typeName = {
        [EquipmentType.WEAPON]: "W",
        [EquipmentType.ARMOR]: "A",
        [EquipmentType.ACCESSORY]: "O",
    }[equipment.type];

    $: image = "./images/equipment/" + {
        [EquipmentType.WEAPON]: "sword.png",
        [EquipmentType.ARMOR]: "armor.png",
        [EquipmentType.ACCESSORY]: "accessory.png",
    }[equipment.type];

    $: statText = F(equipment.stat);

    $: isBetter = $game.player.canEquip(equipment);
    $: fontSize = `${3 / Math.max(3, statText.length)}rem`;

    function dispatchEquip() {
        dispatch("equip", equipment);
    }
</script>

<button on:click={dispatchEquip}
    in:fly={{y: "-4rem"}}
    out:fade={{duration: 50}}
    class="inline-flex flex-col p-1 justify-center items-center text-center w-16 h-16 hover:brightness-125 transition-all overflow-clip"
    class:better={isBetter}
    style="background-color: {equipment.color};">
    <span class="font-bold whitespace-nowrap" style:font-size={fontSize}>{F(equipment.stat)}</span>
    <img
        style:filter="hue-rotate({hueshift}deg) saturate({saturation}) drop-shadow(0 4px 0 rgba(0, 0, 0, 0.5))"
        class="w-10 h-10"
        src={image}
        alt={typeName}
    />
</button>

<style lang="postcss">
    .better {
        box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.7);
    }

    span {
        line-height: 1em;
    }
</style>