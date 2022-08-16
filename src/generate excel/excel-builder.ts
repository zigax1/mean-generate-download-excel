import { Request, Response } from "express";

import * as Excel from "exceljs";

import * as fs from "fs";
var csv = require("@fast-csv/parse");

let allParsedData: any = [];

// neke probavam
var uuid = require("uuid");

export const generateExcel = async (req: Request, res: Response) => {
  try {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Report.xlsx"
    );

    await csvParse(res);
  } catch (err) {
    return res.status(500).json("False");
  }

  //zaj bi pa mogo na podlagi tega nekak if key == tabela 1 filam, if key == tablea 2
};

const csvParse = async (res: any) => {
  fs.createReadStream("./content/Test_1234.csv")
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
      //console.log(allParsedData);
      //najboljše da si napišeš neki parse, ki bo šel čez ta 2d array (2 for loopa), pa grem skozi in gledam če je not samo 1 value in še prazn in potem če je še naslednji ki ima recimo string "Test 2, al pa Test 3",.. napišem
      // neki break al pa neke takega, pa si to shranem v neki object.. najlažje je da je en object z več objecti

      let test = allParsedData;

      generateFile(test, res);
    });
};

const generateFile = (data: any, res: any) => {
  //return new Promise<fs.ReadStream>((resolve, reject) => {
  const workbook = new Excel.Workbook();

  workbook.xlsx.readFile("./content/template.xlsx").then(() => {
    //console.log(data);

    const outer = [];
    const mappedArr = data
      .slice(1)
      .map((item: any) => (item === "" ? 9 : item));
    const splittedArr = mappedArr.join().split(9);

    for (let item of splittedArr) {
      let inner = item.split(",");
      if (inner[0] === "") {
        inner.splice(0, 1);
      }
      if (inner[inner.length - 1] === "") {
        inner.splice(inner.length - 1, 1);
      }
      outer.push(inner);
    }

    console.log(outer);

    let worksheet = workbook.getWorksheet(1);
    let row = worksheet.getRow(5);
    row.getCell(5).value = "aa"; // E5's value set to 5
    row.commit();

    workbook.xlsx.write(res);
  });
  //});
};
