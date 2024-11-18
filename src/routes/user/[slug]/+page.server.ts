import { findUser } from '$lib/user';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ params }) => {
	return {
		user: await findUser(supabase, params.slug)
	};
};