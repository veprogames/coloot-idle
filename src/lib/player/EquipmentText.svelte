<script lang="ts">
    import type Equipment from "../equipment/equipment";
    import { EquipmentType } from "../equipment/equipment";
    import { I } from "../images";
    import { F } from "../utils";

    export let equipment: Equipment;

    // Temporary! This is supposed to be a "unique" name
    $: typeName = {
        [EquipmentType.WEAPON]: "Weapon",
        [EquipmentType.ARMOR]: "Armor",
        [EquipmentType.ACCESSORY]: "Accessory",
    }[equipment.type];

    $: image = {
        [EquipmentType.WEAPON]: I.equipment.sword,
        [EquipmentType.ARMOR]: I.equipment.armor,
        [EquipmentType.ACCESSORY]: I.equipment.accessory,
    }[equipment.type];
</script>

<div class="flex justify-end items-center gap-2" title={typeName}>
    <img class="w-6 h-6" alt={typeName} src={image}/>
    <span>{F(equipment.stat)}</span>
</div>