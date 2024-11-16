import {redirect, type Actions} from '@sveltejs/kit';

import UserService from '$lib/api/user.js';
import type {User} from '$lib/types.js'

export const actions: Actions = {
    default: async ({request, cookies}) => {
        const userService = new UserService()
        const registerFormData = await request.formData();
        const firstname = registerFormData.get("firstname")?.toString() ?? "";
        const lastname = registerFormData.get("lastname")?.toString() ?? "";
        const email = registerFormData.get("email")?.toString() ?? "";
        const username = registerFormData.get("username")?.toString() ?? "";
        const password = registerFormData.get("password")?.toString() ?? "";
        
        const newUser: User = {
            first_name: firstname,
            last_name: lastname,
            email: email,
            username: username,
            password: password
        }

        console.log(JSON.stringify(newUser))

        const response = await userService.createUser(newUser)
        
        if (!response.ok){
            return JSON.stringify({
                error: true,
                message: response.body
            });
        }
        throw redirect(303, "/Login")
    }
};