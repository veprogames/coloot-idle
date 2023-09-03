<script lang="ts">
    import type Arena from "./arena";
    import { getWorldDataForStage } from "./world";

    export let arena: Arena;

    $: worldData = getWorldDataForStage(arena.currentStage);
</script>

<img class="bg fixed left-0 top-0 -z-10 h-screen w-full object-cover" src={worldData.background} alt="Background"/>

<style lang="postcss">
    img.bg {
        mask-image: linear-gradient(125deg, rgba(1, 1, 1, 0.8), transparent);
    }
</style>