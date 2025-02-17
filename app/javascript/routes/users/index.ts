// License: LGPL-3.0-or-later
// this will be generated by some route generator in future but for now, we'll handcode it.

export default {

	/**
	 * camelcased user_session
	 */
	userSession: {
		path: (): string => {
			return '/users/sign_in';
		},
		url: (): string => {
			return '/users/sign_in.json';
		},
	},

	/**
	 * camelcased new_user_password
	 */
	newUserPassword: {
		path: (): string => {
			return '/users/password/new';
		},
		url: (): string => {
			return '/users/password/new';
		},
	},
};