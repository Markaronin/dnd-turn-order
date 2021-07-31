export function parseColor(input: string): number[] {
    const div = document.createElement('div');
    div.style.color = input;
    const m = div.style.color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if(m) {
        return [parseInt(m[1]),parseInt(m[2]),parseInt(m[3])];
    } else {
        throw new Error("Colour "+input+" could not be parsed.");
    }
}