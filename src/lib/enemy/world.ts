import { I } from "../images";

export interface WorldData {
    stage: number,
    title: string,
    background: string,
    visuals?: WorldVisuals,
}

export interface WorldVisuals {
    enemy: {
        hue: number,
        brightness: number,
        saturation: number,
        grayscale: number,
    }
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
        visuals: {
            enemy: {
                hue: -45,
                brightness: 1,
                saturation: 1,
                grayscale: 0,
            },
        },
    },
    {
        stage: 80,
        title: "Badlands",
        background: I.backgrounds.badlands,
        visuals: {
            enemy: {
                hue: 0,
                brightness: 1.5,
                saturation: 1,
                grayscale: 0,
            },
        },
    },
    {
        stage: 100,
        title: "Cave",
        background: I.backgrounds.cave,
        visuals: {
            enemy: {
                hue: 0,
                brightness: 0.5,
                saturation: 1,
                grayscale: 0,
            },
        },
    },
    {
        stage: 125,
        title: "Castle",
        background: I.backgrounds.castle,
        visuals: {
            enemy: {
                hue: 60,
                brightness: 1,
                saturation: 1,
                grayscale: 0,
            },
        },
    },
    {
        stage: 150,
        title: "Deep Dungeon",
        background: I.backgrounds.deepDungeon,
        visuals: {
            enemy: {
                hue: 0,
                brightness: 0.4,
                saturation: 1,
                grayscale: 0,
            },
        },
    },
    {
        stage: 180,
        title: "Hellscape",
        background: I.backgrounds.hellscape,
        visuals: {
            enemy: {
                hue: -60,
                brightness: 2,
                saturation: 2,
                grayscale: 0,
            },
        },
    },
    {
        stage: 230,
        title: "Portal to Another World",
        background: I.backgrounds.portal,
        visuals: {
            enemy: {
                hue: 0,
                brightness: 2,
                saturation: 1,
                grayscale: 1,
            },
        },
    },
];

export function getWorldDataForStage(stage: number): WorldData {
    const data = WORLD.filter(data => stage >= data.stage).at(-1);
    return data ?? WORLD[0];
}