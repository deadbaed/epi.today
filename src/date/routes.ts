import express from "express";

import * as date from "./date";

const router = express.Router();

router.get("/:year/:month/:day", date.SpecificDate);
router.get("/today", date.Today);
router.get("/tomorrow", date.Tomorrow);

export default router;

