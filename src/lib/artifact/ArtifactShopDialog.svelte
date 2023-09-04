<script lang="ts">
    import { scale } from "svelte/transition";
    import Artifact from "./Artifact.svelte";
import ArtifactImage from "./ArtifactImage.svelte";
import type ArtifactShop from "./artifactshop";

    export let shop: ArtifactShop;

    let dialog: HTMLDialogElement;

    export function open() {
        dialog.showModal();
    }
</script>

<dialog bind:this={dialog} class="overflow-x-hidden">
    <h2>Artifact Shop</h2>
    <div class="flex flex-wrap justify-center gap-8">
        <span>Gems: {shop.gems}</span>
        <span>Spent: {shop.gemsSpent}</span>
        <span>Level: {shop.shopLevel.toFixed(2)}</span>
    </div>
    <div class="flex flex-col gap-4 h-64 w-60 lg:w-[30rem] xl:w-[45rem] overflow-scroll">
        {#each { length: shop.maxTierAvailable } as _, tier} 
            <div class="flex gap-4">
                {#each shop.availableArtifacts as artifact}
                    <button on:click={() => shop.buyArtifact(artifact, tier)} class="btn btn-gray w-16 h-16 flex-shrink-0 relative">
                        <ArtifactImage data={artifact} tier={tier} />
                        <span 
                            class="absolute bottom-0 left-1/2 -translate-x-1/2 font-semibold 
                            bg-black bg-opacity-50 p-0.5 px-1 rounded-md"
                        >
                            {shop.getArtifactPrice(artifact, tier)}
                        </span>
                    </button>
                {/each}
            </div>
        {/each}
    </div>
    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>