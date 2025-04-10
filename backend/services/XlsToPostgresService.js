import pkg from "pg";
const { Client } = pkg;
import XLSX from "xlsx";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const filePath = path.join(__dirname, "..", "uploads", "ACTIVITY.xls");

const readXlsFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName]; // Obtém a planilha

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  return data;
};

const insertDataToPostgres = async (data) => {
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

  for (const row of data.slice(1)) {
    const values = row.map((value) => (value === undefined ? null : value));

    const excelSerial = values[17];

    if (typeof excelSerial === "number") {
      values[17] = excelSerial.toString();
    } else {
      values[17] = null;
    }

    await client.query(query, values);
  }

  await client.end();
};

// Leitura do arquivo
const data = readXlsFile(filePath);

// Insira os dados no PostgreSQL
insertDataToPostgres(data)
  .then(() => {
    console.log("✅ Dados inseridos com sucesso!");
  })
  .catch((err) => {
    console.error("❌ Erro na inserção dos dados:", err);
  });
