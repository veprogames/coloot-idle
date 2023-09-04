import Decimal from "break_infinity.js";
import type Player from "../player/player";
import { get } from "svelte/store";
import { game } from "../stores";
import type { ArtifactData } from "./artifact";
import Artifact, { Artifacts } from "./artifact";

export default class ArtifactShop {
    totalGems: number = 100;
    gemsSpent: number = 0;
    player: Player

    constructor(player: Player) {
        this.player = player;
    }

    get gems(): number {
        return this.totalGems - this.gemsSpent;
    }

    get shopLevel() {
        return 1 + this.gemsSpent ** 0.5;
    }

    getGems(playerLevel: number): number {
        const headStart = playerLevel >= 99 ? 3 : 0;
        const baseGems = (playerLevel - 99) / 3 + headStart;
        return Math.max(0, baseGems - this.totalGems);
    }

    /**
     * The reset mechanic. Get the Gems.
     */
    activate() {
        const gems = this.getGems(this.player.level);
        if(gems > 0) {
            const arena = get(game).arena;

            this.player.reset();
            arena.reset();

            this.totalGems += gems;
        }
    }

    get maxTierAvailable() {
        return Math.floor(this.shopLevel);
    }

    get availableArtifacts(): ArtifactData[] {
        return Object.values(Artifacts);
    }

    getArtifactPrice(artifactData: ArtifactData, tier: number): number {
        return 1 * (1 + tier);
    }

    buyArtifact(artifactData: ArtifactData, tier: number) {
        const price = this.getArtifactPrice(artifactData, tier);

        if(this.gems >= price) {
            const artifact = Artifact.from(artifactData, tier);
            this.player.inventory.addArtifact(artifact);
            this.gemsSpent += price;
        }
    }

    respec() {
        const arena = get(game).arena;
        
        this.gemsSpent = 0;
        this.player.reset();
        arena.reset();
    }
}