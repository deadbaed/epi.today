import express from "express";
import passport from "passport";

import * as auth from "./auth";

const router = express.Router();

router.post("/login", auth.Login)
router.get("/callback", auth.Callback);
router.get("/logout", auth.isUserAuthenticated, auth.Logout);

export default router;
