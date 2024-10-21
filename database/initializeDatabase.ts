import { type SQLiteDatabase } from "expo-sqlite";
export async function initializeDatabase(database: SQLiteDatabase) {  
  // Cria a tabela de usuários
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      permission INTEGER NOT NULL
    )`
  );

  // Cria a tabela de dados da congregação
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS congregation_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      casadaoracao TEXT,      
      cooperador_nome TEXT,
      cooperador_jovens_nome TEXT,
      responsaveis_nomes TEXT,
      foto_co BLOB,                -- Foto da CO (salva como BLOB)
      material_tipo TEXT,
      qtde_membros INTEGER,
      qtde_batizados INTEGER,
      qtde_santa_ceia_2024 INTEGER,
      qtde_santa_ceia_2023 INTEGER,
      qtde_santa_ceia_2022 INTEGER,
      qtde_criancas INTEGER,
      qtde_musicos INTEGER,
      documentacao TEXT,           -- Documentação (anexar fotos dos documentos)
      latitude REAL,               -- Coordenadas de latitude
      longitude REAL,              -- Coordenadas de longitude
      croqui BLOB,                 -- Desenho do local (salvo como BLOB)
      tem_agua_luz BOOLEAN,
      material_fabrica TEXT,
      posto_administrativo TEXT,
      endereco TEXT,
      dias_cultos TEXT,
      horario_cultos TEXT,
      tem_reuniao_jovens BOOLEAN
    )`
  );
}
