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
        const overkill = game.player.getOverkill(game.arena.currentEnemy);
        const cooldown = overkill.gt(5) ? (overkill.gt(1e6) ? 200 : 500) : 1000;

        setTimeout(tickPlayer, cooldown);
        return game;
    });
}

export function tickEnemy() {
    game.update(game => {
        game.arena.hitPlayer(game.player);

        return game;
    });

    setTimeout(tickEnemy, 5000);
}