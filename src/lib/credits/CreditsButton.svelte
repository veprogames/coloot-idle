<script lang="ts">
    let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog}>
    <div class="max-h-[50vh] overflow-y-scroll flex flex-col gap-2">
        <h2>Credits</h2>
        <p>Coloot Idle developed by <a href="https://veprogames.github.io">veprogames</a></p>
        <h2>Inspirations</h2>
        <a href="https://play.google.com/store/apps/details?id=com.topcog.idlelootquest">Idle Loot Quest</a>
        <a href="https://store.steampowered.com/app/632360/Risk_of_Rain_2/">Risk of Rain 2</a>
        <h2>Tools</h2>
        <span>Art mostly made with Stable Diffusion</span>
        <h2>Source Code</h2>
        <a href="https://github.com/veprogames/coloot-idle" class="break-all">https://github.com/veprogames/coloot-idle</a>
    </div>

    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>

<button on:click={() => dialog.showModal()} class="btn">Credits</button>

<style lang="postcss">
    h2:not(:first-child) {
        @apply mt-4;
    }
</style>