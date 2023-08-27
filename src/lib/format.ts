import type { DecimalSource } from "break_infinity.js";
import Decimal from "break_infinity.js";

const LETTERS = "~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function formatLetters(n: DecimalSource) {
    const d = new Decimal(n);
    let o = Math.floor(d.e / 3);

    // resulting letters
    let result = "";

    while(o > 0) {
        const letter = LETTERS[o % LETTERS.length];
        result = `${letter}${result}`;

        o = Math.floor(o / LETTERS.length);
    }

    const mantissaPlaces = 2 - (d.e % 3);
    const mantissa = 10 ** (Decimal.log10(d) % 3);

    return `${result}${mantissa.toFixed(mantissaPlaces)}`;
}