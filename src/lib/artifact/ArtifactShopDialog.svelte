<script lang="ts">
    import Artifact from "../player/Artifact.svelte";
import ArtifactImage from "./ArtifactImage.svelte";
import type ArtifactShop from "./artifactshop";

    export let shop: ArtifactShop;

    let dialog: HTMLDialogElement;

    export function open() {
        dialog.showModal();
    }
</script>

<dialog bind:this={dialog}>
    <h2>Artifact Shop</h2>
    <div class="flex flex-wrap justify-center gap-8">
        <span>Gems: {shop.gems}</span>
        <span>Spent: {shop.gemsSpent}</span>
    </div>
    {#each [0, 1, 2] as tier} 
        <div class="flex flex-col">  
            <div class="flex flex-row justify-center gap-4">
                {#each shop.availableArtifacts as artifact}
                    <button on:click={() => shop.buyArtifact(artifact, tier)} class="btn w-16 h-16 relative">
                        <ArtifactImage data={artifact} tier={tier} />
                        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 font-semibold bg-black bg-opacity-50 p-0.5 px-1 rounded-md">{tier + 1}</span>
                    </button>
                {/each}
            </div>
        </div>
    {/each}
    <button on:click={() => dialog.close()} class="btn">Close</button>
</dialog>