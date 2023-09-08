<script lang="ts">
    import { getTierColor } from "../utils";
    import type { ArtifactData } from "./artifact";

    export let data: ArtifactData;
    export let tier: number;
    export let size: number = 12;

    $: color = getTierColor(tier);
</script>

<img style:width="{size / 4}rem" style:height="{size / 4}rem" style:--artifact-color={color} src={data.image} alt={data.title}/>

<style lang="postcss">
    img {
        filter: drop-shadow(0 0.25rem 0 var(--artifact-color)) 
            drop-shadow(0 -0.25rem 0 var(--artifact-color))
            drop-shadow(0.25rem 0 0 var(--artifact-color))
            drop-shadow(-0.25rem 0 0 var(--artifact-color));
    }
</style>