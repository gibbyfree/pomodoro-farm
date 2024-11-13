import type { SupabaseClient } from "@supabase/supabase-js";
import type { UUID } from "crypto";

type User = {
    id: UUID;
    username: string;
    email: string;
    profile: any;
    createdAt: Date;
    updatedAt: Date;
}

export async function getOrCreateUser(supabase: SupabaseClient, email: string): Promise<User> {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', email);

    if (error) {
        console.log(error.message);
        throw error;
    }

    if (data.length === 0) {
        return createUser(supabase, email);
    } else {
        console.log(data[0]);
        return data[0];
    }
}

async function createUser(supabase: SupabaseClient, email: string): Promise<User> {
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
            throw error;
        }

    return getOrCreateUser(supabase, email);
}