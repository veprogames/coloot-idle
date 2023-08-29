<script lang="ts">
    import type Artifact from "../equipment/artifact";

    export let artifact: Artifact;
</script>

<div class="relative">
    <img class="absolute left-0 top-0 h-16 w-auto" src="./images/equipment/sword.png" alt="Icon"/>
    <span class="font-bold">{artifact.data.id} x{artifact.count} - {artifact.description}</span>
</div>

<style lang="postcss">
    img {
        filter: drop-shadow(0 0.25rem 0 lime) 
            drop-shadow(0 -0.25rem 0 lime)
            drop-shadow(0.25rem 0 0 lime)
            drop-shadow(-0.25rem 0 0 lime);
    }
</style>