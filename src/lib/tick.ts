import { game } from "./stores";

export default function tickGame(dt: number) {
    game.update(game => {
        // run every frame
        
        return game;
    });
}

export function tickPlayer() {
    game.update(game => {
        game.player.hitEnemy(game.arena);

        return game;
    });

    setTimeout(tickPlayer, 60000 / 128);
}

export function tickEnemy() {
    game.update(game => {
        game.arena.hitPlayer(game.player);

        return game;
    });

    setTimeout(tickEnemy, 2500);
}