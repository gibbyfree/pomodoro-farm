import type { Timer } from "../types";

const timerMins = 25;
const maxRemaining = timerMins * 60 * 1000;

const emptyTimer: Timer = {
    end: new Date(),
    done: false,
}

export const cTimer: Timer = getOngoingTimer() ?? timer(emptyTimer);

function timer(init: Timer) {
    let timer = $state(init);

    return {
        get get() {
            return { ...timer };
        },
        set done(done: boolean) {
            timer.done = done;
        },
        set end(end: Date) {
            timer.end = end;
        },
        get end() {
            return timer.end;
        },
        get done() {
            return timer.done;
        },
    };
}

function getOngoingTimer(): Timer | undefined {
    const storedEnd = typeof window !== 'undefined' ? localStorage.getItem('end') : undefined;
    if (storedEnd) {
        let end = new Date(storedEnd);
        let done = end.getTime() < Date.now();
        return { end, done };
    }
}