# 📊 Natura Data Importer

Este projeto realiza a leitura de um arquivo Excel (`.xls`) contendo dados de atividades logísticas e insere os dados tratados em uma tabela PostgreSQL.

---

## 🧰 Tecnologias Utilizadas

- Node.js
- PostgreSQL
- Docker & Docker Compose
- XLSX (leitura de planilhas Excel)
- `pg` (cliente PostgreSQL para Node.js)

---

## 🚀 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio/backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Suba o banco de dados PostgreSQL com Docker

```bash
docker-compose up -d
```

### 4. Crie a tabela no banco

```bash
node createTable.js
```

### 5. Coloque o arquivo Excel

Coloque o arquivo `ACTIVITY.xls` (ou outro nome) na pasta `uploads/`.

> 🔁 Você pode adaptar o código para ler nomes de arquivos dinamicamente.

### 6. Execute o serviço de importação

```bash
node services/XlsToPostgresService.js
```

---

## 📂 Estrutura do Projeto

```
backend/
├── createTable.js                  # Criação da tabela no PostgreSQL
├── docker-compose.yml              # Configuração do container PostgreSQL
├── index.js                        # Arquivo de entrada (opcional)
├── uploads/                        # Pasta onde ficam os arquivos .xls
├── services/
│   ├── XlsToPostgresService.js     # Serviço principal de importação
│   └── utils/
│       └── excelDateToJSDate.js    # Conversão de datas do Excel para JS
```

---

## ⚠️ .gitignore

Certifique-se de que os seguintes arquivos/pastas estão no `.gitignore`:

```gitignore
node_modules/
uploads/
postgres-data/
*.xls
*.xlsx
.env
```

---

## 📌 Observações

- O campo `CUSTCOL_20` (posição 18 da planilha) é tratado como `TIMESTAMP`. Caso o valor não seja compatível, será convertido para string.
- É necessário instalar a extensão `pgcrypto` no PostgreSQL para gerar UUIDs:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  ```

---

## 🧑‍💻 Autor

Eduardo Matheus Silva das Neves  
[LinkedIn](https://www.linkedin.com/in/eduardo-matheus-silva-das-neves/) | [Portfólio](https://portfolio-eduardo-livid.vercel.app/)