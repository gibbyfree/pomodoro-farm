import type { Timer } from "../types";
import { TimerType } from "../types";

const emptyTimer: Timer = {
    end: undefined,
    setting: TimerType.COOLDOWN,
    done: false
}

export const cTimer: Timer = getOngoingTimer() ?? timer(emptyTimer);

function timer(init: Timer) {
    let timer: Timer = $state(init);

    return {
        get get() {
            return { ...timer };
        },
        set end(end: Date) {
            timer.end = end;
        },
        get end(): Date | undefined {
            return timer.end;
        },
        get done(): boolean {
            return timer.end ? timer.end.getTime() < Date.now() : true;
        },
        set setting(setting: TimerType) {
            timer.setting = setting;
        },
        get setting(): TimerType {
            return timer.setting;
        }
    };
}

function getOngoingTimer(): Timer | undefined {
    if (typeof window === 'undefined') return undefined;

    const storedEnd = localStorage.getItem('end');
    const end = storedEnd ? new Date(storedEnd) : undefined;
    if (!end) return undefined;

    const storedSetting = localStorage.getItem('setting');
    const setting = storedSetting ? parseInt(storedSetting) : TimerType.COOLDOWN;

    console.log('Found ongoing timer', { end, setting });

    return { end, setting, done: false };
}