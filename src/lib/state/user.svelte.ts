import { getSession } from "$lib/supabase";
import type { User } from "../types";

const emptyUUID = '00000000-0000-0000-0000-000000000000';

const emptyUser = {
    id: emptyUUID,
    username: "",
    email: "",
    profile: "",
    createdAt: new Date(),
    updatedAt: new Date(),
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
        get id() {
            return user.id;
        },
        get username() {
            return user.username;
        },
        get email() {
            return user.email;
        },
    };
}   