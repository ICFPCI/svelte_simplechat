import { redirect } from "@sveltejs/kit";
import AuthService from '$lib/api/auth.js';

async function verifyToken(token: string | undefined) {
    if (token == undefined){
        return false
    }
    
    const authService = new AuthService()
    const verifyTokenResponse = await authService.verifyToken(token)
    
    if (verifyTokenResponse.ok) {
        return true
    }
    
    return false
}

async function refreshToken(token: string | undefined){ 
    if (token == undefined){
        return false
    }

    const authService = new AuthService()
    const refreshTokenResponse = await authService.refreshToken(token) 

    if (refreshTokenResponse.ok){
        const refreshTokenJSON = await refreshTokenResponse.json()
        return refreshTokenJSON.access
    }

    return false
}

export async function handle({ event, resolve }) {

    const ignoredUrls = ["/Login", "/Register"]

    if(ignoredUrls.includes(event.url.pathname)){
        return resolve(event)
    }

    const access_token = event.cookies.get("access_token");
    const refresh_token = event.cookies.get("refresh_token");

    try {
        if (!access_token) {
            event.cookies.delete("access_token", { path: '/' });
            event.cookies.delete("refresh_token", { path: '/' });
            throw redirect(303, "/Login");
        }

        if (!(await verifyToken(access_token))) {
            if (!(await verifyToken(refresh_token))) {
                event.cookies.delete("access_token", { path: '/' });
                event.cookies.delete("refresh_token", { path: '/' });
                throw redirect(303, "/Login");
            }

            const new_token = await refreshToken(refresh_token)

            if(!(new_token)){
                event.cookies.delete("access_token", { path: '/' });
                event.cookies.delete("refresh_token", { path: '/' });
                throw redirect(303, "/Login");
            }

            event.cookies.set("access_token", new_token, {path:"/", httpOnly:false, maxAge: 60 * 60 * 8 , secure:false})
            
            return resolve(event)
            
        }
        return resolve(event)
    } catch (error) {
        event.cookies.delete("access_token", { path: '/' });
        event.cookies.delete("refresh_token", { path: '/' });
        throw redirect(303, "/Login");
    }

}