import { Request, Response } from "express";

import * as Excel from "exceljs";

import * as fs from "fs";
var csv = require("@fast-csv/parse");

let allParsedData: any = [];

export const generateExcel = async (req: Request, res: Response) => {
  try {
    await csvParse();
    res.setHeader("Content-disposition", `attachment;`);
    res.contentType(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.status(200).json("Success");
  } catch (err) {
    return res.status(500).json("False");
  }
};

const csvParse = async () => {
  fs.createReadStream("./content/TestCsv.csv")
    .pipe(csv.parse())
    .on("error", (error: any) => console.log("Error"))
    .on("data", (row: any) => {
      let line: any = String(row);
      line = line.split(";");
      //let parsedData = line[0];
      let parsedData = line;
      allParsedData.push(parsedData);
    })
    .on("end", (rowCount: any) => {
      let test = allParsedData.toString();
      generateFile(test);
    });
};

const generateFile = (data: any) => {
  return new Promise<fs.ReadStream>((resolve, reject) => {
    const workbook = new Excel.Workbook();

    workbook.xlsx.readFile("./utilities/template.xlsx").then(() => {
      workbook.xlsx.writeFile("./content/Test.xlsx").then(
        () => {
          let stream = fs.createReadStream("./content/Test.xlsx");
          stream.on("close", () => {
            fs.unlink("./content/Test.xlsx", (error) => {
              if (error) {
                throw error;
              }
            });
          });

          resolve(stream);
        },
        (err) => {
          throw err;
        }
      );
    });
  });
};
