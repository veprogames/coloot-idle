import Arena from "../enemy/arena";
import Player from "../player/player";
import { PrestigeCrystalPower, type PrestigeCrystal, PrestigeCrystalRarity, PrestigeCrystalMagic } from "../prestigecrystal/prestigecrystal";

export default class GameClass {
    player: Player = new Player();
    arena: Arena = new Arena();
    prestigeCrystals = {
        power: new PrestigeCrystalPower(),
        rarity: new PrestigeCrystalRarity(),
        magic: new PrestigeCrystalMagic(),
    }
}