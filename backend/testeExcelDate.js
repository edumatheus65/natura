import { excelDateToJSDate } from "../backend/services/utils/excelDateToJSDate.js";

const serial = 45736.21028935185;

const jsDate = excelDateToJSDate(serial);

console.log("Serial Excel:", serial);
console.log("Data convertida:", jsDate);
console.log("Formato ISO:", jsDate.toISOString());
