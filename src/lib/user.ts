import type { UUID } from "crypto";
import type { User } from "./types";
import { supabase } from "./supabase";

export async function findUser(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('username', username);

    if (error) {
        console.log(error.message);
        return undefined;
    }

    if (data.length === 0) {
        return undefined;
    } else {
        return data[0];
    }
}

export async function updateUser(id: UUID, payload: any): Promise<User> {
    const { data, error } = await supabase
        .from('Users')
        .update(payload)
        .eq('id', id)
        .select();

    if (error) {
        console.log(error.message);
        throw error;
    }

    return data[0];
}

export async function getOrCreateUser(email: string): Promise<User | Record<string, never>> {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', email);

    if (error) {
        console.log(error.message);
        return {};
    }

    if (data.length === 0) {
        return createUser(email);
    } else {
        return data[0];
    }
}

async function createUser(email: string): Promise<User | Record<string, never>> {
    let { data, error } = await supabase
        .from('Users')
        .insert({
            email: email,
            username: email,
            profile: {},
        })
        .single();

    if (error) {
        console.log(error.message);
        return {};
    }

    return getOrCreateUser(email);
}