import express, { Application, Request, Response, NextFunction } from "express";

const https = require("https");

const app: Application = express();

// import routes
const excelRoute = require("./routes/excelFile");

// Route
app.use("/api/test", excelRoute);

app.listen(5000, () => console.log("Server running."));
