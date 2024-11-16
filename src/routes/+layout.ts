import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/user';

import { getSession, supabase } from '$lib/supabase';
import { getOrCreateUser } from '$lib/user';

export const load: LayoutServerLoad = async () => {
    return {
        user: await getLoggedInUser()
    };
};

async function getLoggedInUser(): Promise<User | Record<string, never>> {
    let session = await getSession();
    if (session) {
        console.log('Session', session);
        return await getOrCreateUser(supabase, session.user.email);
    }
    return {};
}
