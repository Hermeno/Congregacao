import { type SQLiteDatabase } from "expo-sqlite";
export async function initializeDatabase(database: SQLiteDatabase) {  
  // Cria a tabela de usuários
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
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
      cooperador_numero TEXT,
      cooperador_jovens_nome TEXT,
      porteiros_nomes TEXT,
      auxiliares_admin TEXT,
      obra_irmas TEXT,
      responsaveis_nomes TEXT,
      foto_co BLOB,
      material_tipo TEXT,
      qtde_membros INTEGER,
      qtde_batizados INTEGER,
      qtde_santa_ceia_2024 INTEGER,
      qtde_santa_ceia_2025 INTEGER,
      qtde_santa_ceia_2026 INTEGER,
      qtde_criancas INTEGER,
      qtde_musicos INTEGER,
      qtde_musicistas INTEGER,
      documentacao TEXT,
      latitude REAL,
      longitude REAL,
      croqui BLOB,
      tem_agua BOOLEAN,
      tem_luz BOOLEAN,
      material_fabrica TEXT,
      material_local TEXT,
      posto_administrativo TEXT,
      rua TEXT,
      bairro TEXT,
      cidade TEXT,
      dias_reuniao_jovens TEXT,
      dias_cultos TEXT,
      data_batismo TEXT,
      denominacao_outra TEXT,
      observacao TEXT,
      data_inicio TEXT,
      qtde_habitantes INTEGER,
      ccm_terreno TEXT,
      ccm_imovel TEXT
    )`
  );

  // Adiciona colunas que podem estar faltando
  try {
    await database.execAsync(`
      ALTER TABLE congregation_data ADD COLUMN cooperador_numero TEXT;
      ALTER TABLE congregation_data ADD COLUMN porteiros_nomes TEXT;
      ALTER TABLE congregation_data ADD COLUMN auxiliares_admin TEXT;
      ALTER TABLE congregation_data ADD COLUMN obra_irmas TEXT;
      ALTER TABLE congregation_data ADD COLUMN qtde_musicistas INTEGER;
      ALTER TABLE congregation_data ADD COLUMN material_local TEXT;
      ALTER TABLE congregation_data ADD COLUMN bairro TEXT;
      ALTER TABLE congregation_data ADD COLUMN dias_reuniao_jovens TEXT;
      ALTER TABLE congregation_data ADD COLUMN data_batismo TEXT;
      ALTER TABLE congregation_data ADD COLUMN denominacao_outra TEXT;
      ALTER TABLE congregation_data ADD COLUMN observacao TEXT;
      ALTER TABLE congregation_data ADD COLUMN data_inicio TEXT;
      ALTER TABLE congregation_data ADD COLUMN qtde_habitantes INTEGER;
      ALTER TABLE congregation_data ADD COLUMN ccm_terreno TEXT;
      ALTER TABLE congregation_data ADD COLUMN ccm_imovel TEXT;
      ALTER TABLE congregation_data ADD COLUMN tem_agua BOOLEAN;
      ALTER TABLE congregation_data ADD COLUMN tem_luz BOOLEAN;
      ALTER TABLE congregation_data ADD COLUMN rua TEXT;
      ALTER TABLE congregation_data ADD COLUMN cidade TEXT;
      ALTER TABLE congregation_data ADD COLUMN qtde_santa_ceia_2025 INTEGER;
      ALTER TABLE congregation_data ADD COLUMN qtde_santa_ceia_2026 INTEGER;
    `);
  } catch (error) {
    // As colunas já existem, não há problema
    console.log('Colunas já existem na tabela');
  }

  // Cria a tabela de fotos
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS fotos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idPost INTEGER,
      foto TEXT,
      tipo TEXT
    )`
  );
}
