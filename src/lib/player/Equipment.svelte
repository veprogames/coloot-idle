<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, fly } from "svelte/transition";
    import type Equipment from "../equipment/equipment";
    import { EquipmentType } from "../equipment/equipment";
    import { I } from "../images";
    import { game } from "../stores";
    import { F } from "../utils";

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

    $: image = {
        [EquipmentType.WEAPON]: I.equipment.sword,
        [EquipmentType.ARMOR]: I.equipment.armor,
        [EquipmentType.ACCESSORY]: I.equipment.accessory,
    }[equipment.type];

    $: statText = F(equipment.stat);

    $: isBetter = $game.player.canEquip(equipment);
    $: fontSize = `${3 / Math.max(3, statText.length)}rem`;
    $: textScaleX = 3 / Math.max(3, statText.length);

    function dispatchEquip() {
        dispatch("equip", equipment);
    }
</script>

<button on:click={dispatchEquip}
    in:fly={{y: "-4rem"}}
    out:fade={{duration: 50}}
    class="inline-flex flex-col p-1 justify-center items-center text-center w-16 h-16
        hover:brightness-125 transition-all overflow-clip"
    class:better={isBetter}
    style="background-color: {equipment.color};">
    <span class="font-bold whitespace-nowrap pt-1" style:transform="scaleX({textScaleX})">{F(equipment.stat)}</span>
    <img
        style:filter="hue-rotate({hueshift}deg) saturate({saturation}) drop-shadow(0 4px 0 rgba(0, 0, 0, 0.5))"
        class="w-10 h-10"
        src={image}
        alt={typeName}
    />
</button>

<style lang="postcss">
    button {
        box-shadow: inset 0.25rem 0.25rem rgba(255, 255, 255, 0.25),
            inset -0.25rem -0.25rem rgba(0, 0, 0, 0.25);
    }

    .better {
        box-shadow: inset 0 0 0 0.25rem rgb(255, 255, 255, 1);
    }

    span {
        line-height: 0.75em;
    }
</style>