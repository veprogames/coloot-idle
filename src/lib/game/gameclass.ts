import ArtifactShop from "../artifact/artifactshop";
import Arena from "../enemy/arena";
import Player from "../player/player";
import { PrestigeCrystalMagic, PrestigeCrystalPower, PrestigeCrystalRarity } from "../prestigecrystal/prestigecrystal";

export default class GameClass {
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
}