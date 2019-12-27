import express from "express";
import { isUserAuthenticated } from "../auth/auth";

import * as date from "./date";

const router = express.Router();

router.get("/:year/:month/:day", date.SpecificDate);
router.get("/today", date.Today);
router.get("/tomorrow", date.Tomorrow);
router.get("/selector", date.DateSelector);

export default router;

