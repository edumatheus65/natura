import pkg from "pg";
const { Client } = pkg;

// Função para criar a tabela no PostgreSQL
const createTable = async () => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "app-natura",
    password: "root",
    port: 5432,
  });

  await client.connect();

  const enableUuidExtension = `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`;

  // Comando SQL para criar a tabela
  const query = `
    CREATE TABLE IF NOT EXISTS activity_data (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      TASK_ID TEXT,
      TRAN_TYPE TEXT,
      TRAN_CODE TEXT,
      CODE_DESC TEXT,
      TRANS_TYPE_DESC TEXT,
      PLT_ID TEXT,
      CNTR_NBR TEXT,
      FROM_L TEXT,
      LOCN_BRCD TEXT,
      TO_L TEXT,
      LOCN_BRCD0 TEXT,
      SKU_ID TEXT,
      DSP_SKU TEXT,
      SKU_DESC0 TEXT,
      CODE_ID TEXT,
      CODE_DESC0 TEXT,
      CUSTCOL_20 TEXT,
      USER_ID TEXT,
      USER_NAME TEXT,
      WJXBFS1 TEXT,
      WJXBFS2 TEXT      
    );
  `;

  try {
    await client.query(enableUuidExtension);
    await client.query(query);
    console.log('Tabela "activity_data" criada com sucesso!');
  } catch (err) {
    console.error("Erro ao criar a tabela:", err);
  } finally {
    await client.end();
  }
};

// Chama a função para criar a tabela
createTable();
