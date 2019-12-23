import env from "./env";
import passport from "passport";
import jsonwebtoken from "jsonwebtoken";
const AzureStrategy = require("passport-azure-ad-oauth2"); // TODO: find typescript typing

passport.use(new AzureStrategy({
    clientID: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    callbackUrl: "/auth/callback",
    tenant: env.TENANT
}, (accessToken: any, refreshToken: any, params: any, profile: any, done: any) => {
    console.log("passport callback fired");
    console.log(params.id_token);
}));
