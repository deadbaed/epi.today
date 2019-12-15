import express from "express";

import * as date from "./date";

const router = express.Router();

router.get("/:year/:month/:day", date.get);

export default router;

