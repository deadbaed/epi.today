import express from "express";

import * as auth from "./auth";

const router = express.Router();

router.get("/office365", auth.Office365);
router.get("/callback", auth.Callback);
router.get("/logout", auth.isUserAuthenticated, auth.Logout);

export default router;
