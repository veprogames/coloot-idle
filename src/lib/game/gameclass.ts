import Arena from "../enemy/arena";
import Player from "../player/player";

export default class GameClass {
    player: Player = new Player();
    arena: Arena = new Arena();
}