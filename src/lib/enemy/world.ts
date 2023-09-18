import { I } from "../images";

export interface WorldData {
    stage: number,
    title: string,
    background: string,
}

export const WORLD: WorldData[] = [
    {
        stage: 0,
        title: "Plains",
        background: I.backgrounds.plains,
    },
    {
        stage: 20,
        title: "Forest",
        background: I.backgrounds.forest,
    },
    {
        stage: 40,
        title: "Jungle",
        background: I.backgrounds.jungle,
    },
    {
        stage: 60,
        title: "Desert",
        background: I.backgrounds.desert,
    },
    {
        stage: 80,
        title: "Badlands",
        background: I.backgrounds.badlands,
    },
    {
        stage: 100,
        title: "Cave",
        background: I.backgrounds.cave,
    },
    {
        stage: 125,
        title: "Castle",
        background: I.backgrounds.castle,
    },
    {
        stage: 150,
        title: "Deep Dungeon",
        background: I.backgrounds.deepDungeon,
    },
    {
        stage: 180,
        title: "Hellscape",
        background: I.backgrounds.hellscape,
    },
    {
        stage: 230,
        title: "Portal to Another World",
        background: I.backgrounds.portal,
    },
];

export function getWorldDataForStage(stage: number): WorldData {
    const data = WORLD.filter(data => stage >= data.stage).at(-1);
    return data ?? WORLD[0];
}