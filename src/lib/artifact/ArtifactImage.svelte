<script lang="ts">
    import { getTierColor } from "../utils";
    import type { ArtifactData } from "./artifact";

    export let data: ArtifactData;
    export let tier: number;

    $: color = getTierColor(tier);
</script>

<img class="w-12 h-12" style:--artifact-color={color} src={data.image} alt={data.title}/>

<style lang="postcss">
    img {
        filter: drop-shadow(0 0.25rem 0 var(--artifact-color)) 
            drop-shadow(0 -0.25rem 0 var(--artifact-color))
            drop-shadow(0.25rem 0 0 var(--artifact-color))
            drop-shadow(-0.25rem 0 0 var(--artifact-color));
    }
</style>