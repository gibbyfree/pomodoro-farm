import type { SupabaseClient } from "@supabase/supabase-js";
import type { UUID } from "crypto";
import type { User } from "./types";

export async function findUser(supabase: SupabaseClient, username: string): Promise<User | undefined> {
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
        console.log(data[0]);
        return data[0];
    }
}

export async function updateUser(supabase: SupabaseClient, id: UUID, payload: any): Promise<User> {
    console.log('Updating user', id, payload);
    const { data, error } = await supabase
        .from('Users')
        .update(payload)
        .eq('id', id)
        .select();

    if (error) {
        console.log(error.message);
        throw error;
    }

    console.log(data[0]);
    return data[0];
}

export async function getOrCreateUser(supabase: SupabaseClient, email: string): Promise<User | Record<string, never>> {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', email);

    if (error) {
        console.log(error.message);
        return {};
    }

    if (data.length === 0) {
        return createUser(supabase, email);
    } else {
        console.log(data[0]);
        return data[0];
    }
}

async function createUser(supabase: SupabaseClient, email: string): Promise<User | Record<string, never>> {
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

    return getOrCreateUser(supabase, email);
}