<script lang="ts">
    /**
     * Value that ranges between 0 (empty) and 1 (full)
     */
    export let value: number;
    export let width: string = "10rem";
    export let center: boolean = false;
</script>

<div class="relative h-fit overflow-clip" class:mx-auto={center} style:width>
    <progress class="h-8 w-full" {value} max=1></progress>
    <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[0.82rem] font-semibold whitespace-nowrap">
        <slot />
    </span>
</div>

<style lang="postcss">
    progress {
        @apply appearance-none;
        box-shadow: inset 0.25rem 0.25rem rgba(255, 255, 255, 0.3),
            inset -0.25rem -0.25rem rgba(0, 0, 0, 0.7);
    }

    progress::-moz-progress-bar {
        @apply bg-green-700;
        box-shadow: inset 0.25rem 0.25rem rgba(255, 255, 255, 0.5),
            inset -0.25rem -0.25rem rgba(0, 0, 0, 0.5);
    }

    progress::-webkit-progress-bar {
        @apply bg-green-950;
        box-shadow: inset 0.25rem 0.25rem rgba(255, 255, 255, 0.3),
            inset -0.25rem -0.25rem rgba(0, 0, 0, 0.7)
    }

    progress::-webkit-progress-value {
        @apply bg-green-700;
        box-shadow: inset 0.25rem 0.25rem rgba(255, 255, 255, 0.5),
            inset -0.25rem -0.25rem rgba(0, 0, 0, 0.5);
    }

    progress[value] {
        @apply bg-green-950;
    }
</style>