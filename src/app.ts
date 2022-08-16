import express, { Application, Request, Response, NextFunction } from "express";

const https = require("https");

const app: Application = express();

// import route
const excelRoute = require("./routes/excelFile");

// Route
app.use("/api/test", excelRoute);

app.listen(9000, () => console.log("Server running."));
