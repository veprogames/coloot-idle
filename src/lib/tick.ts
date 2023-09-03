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
        const cooldown = 1000 / (1 + overkill.max(1).log10() / 2);

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