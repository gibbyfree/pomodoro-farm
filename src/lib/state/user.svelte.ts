import { getSession } from "$lib/supabase";
import type { Profile, User } from "../types";

const emptyUUID = '00000000-0000-0000-0000-000000000000';

const emptyUser = {
    id: emptyUUID,
    username: "",
    email: "",
    profile: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    doro: 0,
    xp: 0,
};

const loggedInUser = await getSession() ?? emptyUser;

export const cUser = user(loggedInUser);

function user(init: User) {
    // fns modifying User
    let user = $state(init);

    return {
        get get() {
            return { ...user };
        },
        set set(newUser: User) {
            user = newUser;
        },
        set profile(profile: Profile) {
            user.profile = profile;
        },
        get id() {
            return user.id;
        },
        get username() {
            return user.username;
        },
        get email() {
            return user.email;
        },
        get doro() {
            return user.doro;
        },
        get xp() {
            return user.xp;
        },
        get profile() {
            return user.profile;
        }
    };
}