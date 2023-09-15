import ArtifactShop from "../artifact/artifactshop";
import Arena from "../enemy/arena";
import Player from "../player/player";
import { CRYSTAL_BASE_REQUIRED_LEVEL, PrestigeCrystalMagic, PrestigeCrystalPower, PrestigeCrystalRarity } from "../prestigecrystal/prestigecrystal";
import type { SaverLoader } from "../saveload/saveload";

export default class GameClass implements SaverLoader {
    player: Player = new Player();
    arena: Arena = new Arena();
    prestigeCrystals = {
        power: new PrestigeCrystalPower(),
        rarity: new PrestigeCrystalRarity(),
        magic: new PrestigeCrystalMagic(),
    }
    artifactShop: ArtifactShop = new ArtifactShop()

    resetPrestigeCrystals() {
        for(const crystal of Object.values(this.prestigeCrystals)) {
            crystal.reset();
        }
    }

    get prestigeCrystalsUnlocked() {
        return this.player.highestLevel >= CRYSTAL_BASE_REQUIRED_LEVEL;
    }

    save(): any {
        return {
            player: this.player.save(),
            artifactShop: this.artifactShop.save(),
            arena: this.arena.save(),
            prestigeCrystals: {
                power: this.prestigeCrystals.power.save(),
                rarity: this.prestigeCrystals.rarity.save(),
                magic: this.prestigeCrystals.magic.save(),
            },
        };
    }
    
    load(data: any): void {
        this.player.load(data.player);
        this.artifactShop.load(data.artifactShop);
        this.arena.load(data.arena);
        this.prestigeCrystals.power.load(data.prestigeCrystals.power);
        this.prestigeCrystals.rarity.load(data.prestigeCrystals.rarity);
        this.prestigeCrystals.magic.load(data.prestigeCrystals.magic);
    }
}