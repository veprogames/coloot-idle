import { game } from "./stores";

export default function tickGame(dt: number) {
    game.update(game => {
        // run every frame

        if(Math.random() < 0.01) {
            game.player.hitEnemy(game.arena);
        }
        
        return game;
    });
}