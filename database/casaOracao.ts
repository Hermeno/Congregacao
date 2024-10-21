import { useSQLiteContext } from "expo-sqlite"
export type createCasaOracaoL = {
    id: number
    userId: number
    casaDaOracao: string
    cooperadorNome: string
    cooperadorJovensNome: string
    responsaveisNomes: string
    materialTipo: string
    qtdeMembros: number
    qtdeBatizados: number
    qtdeSantaCeia2024: number
    qtdeSantaCeia2023: number
    qtdeSantaCeia2022: number
    qtdeCriancas: number
    qtdeMusicos: number
    documentacao: string
    latitude: string
    longitude: string
    temAguaLuz: boolean
    materialFabrica: string
    postoAdministrativo: string
    endereco: string
    diasCultos: string
    horarioCultos: string
    temReuniaoJovens: boolean
    // photoUri: string
}



export function casaOracao(){
    const database = useSQLiteContext();
        async function createCasaOracao(data: Omit<createCasaOracaoL, "id">) {
            const statement = await database.prepareAsync(
                "INSERT INTO congregation_data (casadaoracao,cooperador_nome,cooperador_jovens_nome,responsaveis_nomes,material_tipo,qtde_membros,qtde_batizados,qtde_santa_ceia_2024,qtde_santa_ceia_2023,qtde_santa_ceia_2022,qtde_criancas,qtde_musicos,documentacao,latitude,longitude,tem_agua_luz,material_fabrica,posto_administrativo,endereco,dias_cultos,horario_cultos,tem_reuniao_jovens, userId) VALUES ($casaDaOracao,$cooperadorNome, $cooperadorJovensNome, $responsaveisNomes, $materialTipo, $qtdeMembros, $qtdeBatizados, $qtdeSantaCeia2024, $qtdeSantaCeia2023, $qtdeSantaCeia2022, $qtdeCriancas, $qtdeMusicos, $documentacao, $latitude, $longitude, $temAguaLuz, $materialFabrica, $postoAdministrativo, $endereco, $diasCultos, $horarioCultos, $temReuniaoJovens,  $userId) "
                ) 
            try {
                const result = await statement.executeAsync({
                    $casaDaOracao: data.casaDaOracao,
                    $cooperadorNome: data.cooperadorNome,
                    $cooperadorJovensNome: data.cooperadorJovensNome, 
                    $responsaveisNomes: data.responsaveisNomes,
                    $materialTipo: data.materialTipo,
                    $qtdeMembros: data.qtdeMembros,
                    $qtdeBatizados: data.qtdeBatizados,
                    $qtdeSantaCeia2024: data.qtdeSantaCeia2024,
                    $qtdeSantaCeia2023: data.qtdeSantaCeia2023,
                    $qtdeSantaCeia2022: data.qtdeSantaCeia2022,
                    $qtdeCriancas: data.qtdeCriancas,
                    $qtdeMusicos: data.qtdeMusicos,
                    $documentacao: data.documentacao,
                    $latitude: data.latitude,
                    $longitude: data.longitude,
                    $temAguaLuz: data.temAguaLuz,
                    $materialFabrica: data.materialFabrica,
                    $postoAdministrativo: data.postoAdministrativo,
                    $endereco: data.endereco,
                    $diasCultos: data.diasCultos,
                    $horarioCultos: data.horarioCultos,
                    $temReuniaoJovens: data.temReuniaoJovens,
                    $userId: data.userId,
                    // $photoUri: data.photoUri 
                    // foto: data.foto, // BLOB
                })
                const  insertedRowId = result.lastInsertRowId.toLocaleString()
                return { insertedRowId  }             
            } catch (error) {
                throw error;          
            }
        }
        return { createCasaOracao  }     

}