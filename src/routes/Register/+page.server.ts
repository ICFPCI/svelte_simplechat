import {redirect, type Actions} from '@sveltejs/kit';

import AuthService from '$lib/api/auth.js';

export async function load({cookies}){
    const authToken = cookies.get("access_token")
    if (!authToken) return {clearUser: true}
    
    return {clearUser: false}
}

export const actions: Actions = {
    default: async ({request, cookies}) => {
        const authService = new AuthService()
        const loginFormData = await request.formData();
        const username = loginFormData.get("username")?.toString() ?? "";
        const password = loginFormData.get("password")?.toString() ?? "";

        const response = await authService.login(username, password)

        // let loginRespose: loginFormResponse

        if (!response.ok){
            return {
                error: true,
                message: response.body
            };
        }

        const jwtToken = await response.json()

        try{
            cookies.set("refresh_token", jwtToken.refresh, {path:"/", httpOnly:false, maxAge: 60 * 60 * 8 , secure:false})
            cookies.set("access_token", jwtToken.access, {path:"/", httpOnly:false, maxAge: 60 * 60 * 8 , secure:false})
        }catch(error){
            return {
                error: true,
                message: error
            }
        }
        
        throw redirect(303, "/Chat")
    }
};
// default: async ({request, cookies}) => {
//     let data = await request.formData()

//     let userID: string = "";
//     let username = data.get('username')
//     let password = data.get('password')

//     const res = await fetch(`${API_URL}/api/v1.0/auth/login`,
//         {
//             method: "POST",
//             headers: {"Content-Type":"application/json"},
//             body: JSON.stringify({username,password})
//         }
//     )

//     let success:boolean = false;
//     if (res.ok){
//         const body = await res.json()
//         const expiryDate = new Date();
//         expiryDate.setDate(expiryDate.getDate() + 7);
//         cookies.set("access_token", body.access, {path:"/", httpOnly:false, expires: expiryDate, secure:false});
//         cookies.set("refresh_token", body.refresh, {path:"/", httpOnly:false, expires: expiryDate, secure:false});

//         const decodedJWT = jose.decodeJwt(body.access)

//         username = String(decodedJWT.username)
//         userID = String(decodedJWT.user_id)

//         success = true;

//     }
    
//     return { success, username, userID };
// }