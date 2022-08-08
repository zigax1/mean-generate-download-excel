import express from "express";
import { generateExcel } from "../generate excel/excel-builder";

const router = express.Router();

router.get("/downloadExcel", generateExcel);

export = router;
