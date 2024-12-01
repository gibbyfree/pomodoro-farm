import { findUser } from '$lib/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		user: await findUser(params.slug)
	};
};