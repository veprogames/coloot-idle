export interface WorldData {
    stage: number,
    title: string,
    background: string,
}

export const WORLD: WorldData[] = [
    {
        stage: 0,
        title: "Plains",
        background: "./images/backgrounds/plains.png",
    },
    {
        stage: 20,
        title: "Forest",
        background: "./images/backgrounds/forest.png",
    },
    {
        stage: 40,
        title: "Jungle",
        background: "./images/backgrounds/jungle.png",
    },
    {
        stage: 60,
        title: "Desert",
        background: "./images/backgrounds/desert.png",
    },
    {
        stage: 80,
        title: "Badlands",
        background: "./images/backgrounds/badlands.png",
    },
    {
        stage: 100,
        title: "Cave",
        background: "./images/backgrounds/cave.png",
    },
    {
        stage: 125,
        title: "Castle",
        background: "./images/backgrounds/castle.png",
    },
    {
        stage: 150,
        title: "Deep Dungeon",
        background: "./images/backgrounds/deepdungeon.png",
    },
    {
        stage: 180,
        title: "Hellscape",
        background: "./images/backgrounds/hellscape.png",
    },
    {
        stage: 230,
        title: "Portal to Another World",
        background: "./images/backgrounds/portal.png",
    },
];

export function getWorldDataForStage(stage: number): WorldData {
    const data = WORLD.filter(data => stage >= data.stage).at(-1);
    return data ?? WORLD[0];
}