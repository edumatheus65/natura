import pkg from "pg";
const { Client } = pkg;
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "..", "uploads", "ACTIVITY.xls");

const readXlsFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName]; // Obtém a planilha

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  return data;
};

const insertDataToPostgres = async (headers, rows) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "app-natura",
    password: "root",
    port: 5432,
  });

  await client.connect();

  await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  const query = `
    INSERT INTO activity_data (
      id, TASK_ID, TRAN_TYPE, TRAN_CODE, CODE_DESC, TRANS_TYPE_DESC, PLT_ID, CNTR_NBR, FROM_L, 
      LOCN_BRCD, TO_L, LOCN_BRCD0, SKU_ID, DSP_SKU, SKU_DESC0, CODE_ID, CODE_DESC0, CUSTCOL_20, 
      USER_ID, USER_NAME, WJXBFS1, WJXBFS2
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
      $18, $19, $20, $21
    ) ON CONFLICT (id) DO NOTHING; -- Impede a inserção de registros duplicados com o mesmo TASK_ID
  `;

  for (const row of rows) {
    if (
      !Array.isArray(row) ||
      row.length === 0 ||
      row.every((cell) => cell === undefined)
    ) {
      console.log("⚠️ Linha inválida ou vazia pulada:", row);
      continue; // pula linha que não é array ou está vazia
    }

    const rowObject = {};

    headers.forEach((header, index) => {
      rowObject[header] = row[index] !== undefined ? row[index] : null;
    });

    if (typeof rowObject["CUSTCOL_20"] === "number") {
      rowObject["CUSTCOL_20"] = rowObject["CUSTCOL_20"].toString();
    }

    const values = [
      rowObject["TASK_ID"],
      rowObject["TRAN_TYPE"],
      rowObject["TRAN_CODE"],
      rowObject["CODE_DESC"],
      rowObject["TRANS_TYPE_DESC"],
      rowObject["PLT_ID"],
      rowObject["CNTR_NBR"],
      rowObject["FROM_L"],
      rowObject["LOCN_BRCD"],
      rowObject["TO_L"],
      rowObject["LOCN_BRCD0"],
      rowObject["SKU_ID"],
      rowObject["DSP_SKU"],
      rowObject["SKU_DESC0"],
      rowObject["CODE_ID"],
      rowObject["CODE_DESC0"],
      rowObject["CUSTCOL_20"],
      rowObject["USER_ID"],
      rowObject["USER_NAME"],
      rowObject["WJXBFS1"],
      rowObject["WJXBFS2"],
    ];

    await client.query(query, values);
  }

  await client.end();
};

// Leitura do arquivo
const data = readXlsFile(filePath);
const headers = data[0];
const rows = data.slice(1);

// Insira os dados no PostgreSQL
insertDataToPostgres(headers, rows)
  .then(() => {
    console.log("✅ Dados inseridos com sucesso!");
  })
  .catch((err) => {
    console.error("❌ Erro na inserção dos dados:", err);
  });
