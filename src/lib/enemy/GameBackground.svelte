<script lang="ts">
    import type Arena from "./arena";
    import { getWorldDataForStage } from "./world";

    export let arena: Arena;

    $: worldData = getWorldDataForStage(arena.currentStage);
</script>

<img
    class="bg fixed left-0 top-0 -z-10 h-screen w-full object-cover blur-xl brightness-[0.6]"
    src={worldData.background}
    alt="Background"
/>
