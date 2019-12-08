import express from "express";

import * as root from "./root";

const router = express.Router();

router.get("/", root.get);

export default router;
