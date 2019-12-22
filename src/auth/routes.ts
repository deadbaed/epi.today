import express from "express";
import passport from "passport";

import * as auth from "./auth";

const router = express.Router();

router.get("/office365", passport.authenticate("azure_ad_oauth2"));
router.get("/callback", passport.authenticate("azure_ad_oauth2"), auth.Callback);
router.get("/logout", auth.isUserAuthenticated, auth.Logout);

export default router;
