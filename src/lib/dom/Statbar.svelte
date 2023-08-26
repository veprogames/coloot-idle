<script lang="ts">
    /**
     * Value that ranges between 0 (empty) and 1 (full)
     */
    export let value: number;
</script>

<div class="relative w-fit h-fit overflow-clip mx-auto">
    <progress class="h-6 rounded-md" {value} max=1></progress>
    <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[0.95rem] font-semibold whitespace-nowrap">
        <slot />
    </span>
</div>

<style lang="postcss">
    progress {
        @apply appearance-none;
    }

    progress::-moz-progress-bar, progress::-webkit-progress-bar {
        @apply bg-gradient-to-r from-slate-500 to-slate-400;
    }

    progress[value] {
        @apply bg-slate-700;
    }
</style>