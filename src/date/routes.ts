import express from "express";
import { isUserAuthenticated } from "../auth/auth";

import * as date from "./date";

const router = express.Router();

router.get("/:year/:month/:day", isUserAuthenticated, date.SpecificDate);
router.get("/today", isUserAuthenticated, date.Today);
router.get("/tomorrow", isUserAuthenticated, date.Tomorrow);
router.get("/selector", isUserAuthenticated, date.DateSelector);

export default router;

