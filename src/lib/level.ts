function generateXpThresholds(levels: number, baseValue: number, firstIncrement: number) {
    const thresholds = [];
    let xp = baseValue;
    let increment = firstIncrement;

    for (let i = 1; i <= levels; i++) {
        thresholds.push(xp);
        xp += increment;
        increment++;
    }

    return thresholds;
}

const levels = generateXpThresholds(100, 30, 10);

export function getLevelFromXp(xp: number): number {
    let level = 0;

    while (level < levels.length && xp >= levels[level]) {
        level++;
    }

    return level + 1;
}