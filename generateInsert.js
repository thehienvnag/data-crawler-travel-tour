const fs = require("fs");
const readFile = async (filePath) => fs.readFileSync(filePath, "utf8");
const writeFile = (fileName, content, flag = "w") => {
  fs.writeFile(fileName, content, { flag: flag }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully write file");
    }
  });
};
const generateStm = async () => {
  try {
    const tourList = await readFile("storage.txt");
    //console.log(tourList);
    printInsertStm(JSON.parse(tourList));
  } catch (error) {
    console.log(error);
  }
};

const printInsertStm = (tourList) => {
  writeFile("insertStatement.txt", "");
  for (const {
    img,
    title,
    price,
    from,
    to,
    imgLocal,
    toLocation,
    quota,
  } of tourList) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const fromStr = `${fromDate.getFullYear()}-${fromDate.getMonth()}-${fromDate.getDate()}`;
    const toStr = `${toDate.getFullYear()}-${toDate.getMonth()}-${toDate.getDate()}`;
    const now = "2020-6-12";
    const insertStatement = `INSERT INTO "public"."TravelTour" ("ToLocation", "TourName", "FromDate", "ToDate", "Price", "Quota", "ImageLink", "ImportedDate", "StatusId") VALUES ('${toLocation}', '${title}', '${fromStr}', '${toStr}', ${price}, ${quota}, '${imgLocal}', '${now}', 1);\n`;
    writeFile("insertStatement.txt", insertStatement, "a");
  }
};

generateStm();
