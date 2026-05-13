import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, Switch, TouchableOpacity, Alert, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const DIAS_SEMANA = [
  { label: 'Domingo', key: 'domingo', periodos: ['DM', 'DT', 'DN'] },
  { label: 'Segunda', key: 'segunda', periodos: ['2M', '2T', '2N'] },
  { label: 'Terça', key: 'terca', periodos: ['3M', '3T', '3N'] },
  { label: 'Quarta', key: 'quarta', periodos: ['4M', '4T', '4N'] },
  { label: 'Quinta', key: 'quinta', periodos: ['5M', '5T', '5N'] },
  { label: 'Sexta', key: 'sexta', periodos: ['6M', '6T', '6N'] },
  { label: 'Sábado', key: 'sabado', periodos: ['SM', 'ST', 'SN'] },
];

export default function FormScreen({ navigation, route }) {
  const { user, userId, permiSsion } = route.params;
  const database = useSQLiteContext();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para todos os campos
  const [patrimonioNumero, setPatrimonioNumero] = useState('');
  const [cooperadorNome, setCooperadorNome] = useState('');
  const [cooperadorNumero, setCooperadorNumero] = useState('');
  const [porteirosNomes, setPorteirosNomes] = useState('');
  const [auxiliaresAdmin, setAuxiliaresAdmin] = useState('');
  const [obraIrmas, setObraIrmas] = useState('');
  const [materialTipo, setMaterialTipo] = useState('');
  const [membrosQuantidade, setMembrosQuantidade] = useState('');
  const [batizadosQuantidade, setBatizadosQuantidade] = useState('');
  const [santaCeia2024, setSantaCeia2024] = useState('');
  const [santaCeia2025, setSantaCeia2025] = useState('');
  const [santaCeia2026, setSantaCeia2026] = useState('');
  const [criancasQuantidade, setCriancasQuantidade] = useState('');
  const [musicosQuantidade, setMusicosQuantidade] = useState('');
  const [musicistasQuantidade, setMusicistasQuantidade] = useState('');
  const [documentacao, setDocumentacao] = useState('');
  const [temAgua, setTemAgua] = useState(false);
  const [temLuz, setTemLuz] = useState(false);
  const [postoAdministrativo, setPostoAdministrativo] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [diasReuniaoJovens, setDiasReuniaoJovens] = useState([]);
  const [dataBatismo, setDataBatismo] = useState('');
  const [denominacaoOutra, setDenominacaoOutra] = useState('');
  const [observacao, setObservacao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [habitantesQuantidade, setHabitantesQuantidade] = useState('');
  const [ccmTerreno, setCcmTerreno] = useState('');
  const [ccmImovel, setCcmImovel] = useState('');
  const [materialLocal, setMaterialLocal] = useState('');
  const [cooperadorJovensNome, setCooperadorJovensNome] = useState('');
  const [diasCultos, setDiasCultos] = useState([]);

  const toggleDiaReuniao = (periodo) => {
    setDiasReuniaoJovens((prevDias) =>
      prevDias.includes(periodo) ? prevDias.filter((d) => d !== periodo) : [...prevDias, periodo]
    );
  };

  const toggleDiaCulto = (periodo) => {
    setDiasCultos((prevDias) =>
      prevDias.includes(periodo) ? prevDias.filter((d) => d !== periodo) : [...prevDias, periodo]
    );
  };

  const isSelecionado = (periodo, array) => array.includes(periodo);

  const handleSubmit = async () => {
    if (!patrimonioNumero.trim()) {
      Alert.alert('Campo obrigatório', 'Digite o número do patrimônio da casa de oração');
      return;
    }

    setIsLoading(true);
    try {
      await database.execAsync(
        `INSERT INTO congregation_data (
          userId, casadaoracao, cooperador_nome, cooperador_numero, porteiros_nomes, 
          auxiliares_admin, obra_irmas, material_tipo, qtde_membros, qtde_batizados, 
          qtde_santa_ceia_2024, qtde_santa_ceia_2025, qtde_santa_ceia_2026, qtde_criancas, 
          qtde_musicos, qtde_musicistas, documentacao, tem_agua, tem_luz, 
          material_fabrica, posto_administrativo, rua, bairro, cidade, 
          dias_reuniao_jovens, data_batismo, denominacao_outra, observacao, data_inicio, 
          qtde_habitantes, ccm_terreno, ccm_imovel, material_local, 
          cooperador_jovens_nome, dias_cultos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, patrimonioNumero, cooperadorNome, cooperadorNumero, porteirosNomes,
          auxiliaresAdmin, obraIrmas, materialTipo, membrosQuantidade, batizadosQuantidade,
          santaCeia2024, santaCeia2025, santaCeia2026, criancasQuantidade, musicosQuantidade,
          musicistasQuantidade, documentacao, temAgua ? 1 : 0, temLuz ? 1 : 0, materialLocal,
          postoAdministrativo, rua, bairro, cidade, diasReuniaoJovens.join(','),
          dataBatismo, denominacaoOutra, observacao, dataInicio, habitantesQuantidade,
          ccmTerreno, ccmImovel, materialLocal, cooperadorJovensNome, diasCultos.join(',')
        ]
      );

      const lastId = await database.getFirstAsync(
        'SELECT MAX(id) as id FROM congregation_data WHERE userId = ?',
        [userId]
      );

      const registroId = lastId.id;

      navigation.navigate('FotosCasa', {
        registroId,
        userId,
        user,
        permiSsion,
        patrimonioNumero,
        cooperadorNome
      });
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Erro ao enviar o formulário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navContainer}>
        <Text style={styles.navItem}>CCM</Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Accueil', { userId, user, permiSsion })}
        >
          <Text style={styles.buttonText}>← Retour</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewForm}>
        <Text style={styles.title}>Formulário de Cadastro</Text>

        {/* Seção 1: Informações Básicas */}
        <Text style={styles.sectionTitle}>Informações Básicas</Text>

        <Text style={styles.label}>Número do patrimônio da casa de Oração *</Text>
        <TextInput style={styles.input} placeholder="Digite o número" value={patrimonioNumero} onChangeText={setPatrimonioNumero} />

        <Text style={styles.label}>Nome do Cooperador (opcional)</Text>
        <TextInput style={styles.input} placeholder="Digite o nome" value={cooperadorNome} onChangeText={setCooperadorNome} />

        <Text style={styles.label}>Número do Cooperador</Text>
        <TextInput style={styles.input} placeholder="Digite o número" value={cooperadorNumero} onChangeText={setCooperadorNumero} keyboardType="numeric" />

        <Text style={styles.label}>Nome do Cooperador de Jovens</Text>
        <TextInput style={styles.input} placeholder="Digite o nome" value={cooperadorJovensNome} onChangeText={setCooperadorJovensNome} />

        <Text style={styles.label}>Nome dos porteiros</Text>
        <TextInput style={styles.input} placeholder="Digite os nomes" value={porteirosNomes} onChangeText={setPorteirosNomes} />

        <Text style={styles.label}>Nome dos auxiliares da Administração</Text>
        <TextInput style={styles.input} placeholder="Digite os nomes" value={auxiliaresAdmin} onChangeText={setAuxiliaresAdmin} />

        <Text style={styles.label}>Nome das irmãs da obra da piedade</Text>
        <TextInput style={styles.input} placeholder="Digite os nomes" value={obraIrmas} onChangeText={setObraIrmas} />

        {/* Seção 2: Dados da Congregação */}
        <Text style={styles.sectionTitle}>Dados da Congregação</Text>

        <Text style={styles.label}>Quantidade de Membros que Congregam</Text>
        <TextInput style={styles.input} placeholder="Digite a quantidade" keyboardType="numeric" value={membrosQuantidade} onChangeText={setMembrosQuantidade} />

        <Text style={styles.label}>Quantidade de irmãos Batizados</Text>
        <TextInput style={styles.input} placeholder="Digite a quantidade" keyboardType="numeric" value={batizadosQuantidade} onChangeText={setBatizadosQuantidade} />

        <Text style={styles.label}>Quantidade de Crianças</Text>
        <TextInput style={styles.input} placeholder="Digite a quantidade" keyboardType="numeric" value={criancasQuantidade} onChangeText={setCriancasQuantidade} />

        <Text style={styles.label}>Quantidade de irmãos Músicos</Text>
        <TextInput style={styles.input} placeholder="Digite a quantidade" keyboardType="numeric" value={musicosQuantidade} onChangeText={setMusicosQuantidade} />

        <Text style={styles.label}>Quantidade de irmãs Musicistas</Text>
        <TextInput style={styles.input} placeholder="Digite a quantidade" keyboardType="numeric" value={musicistasQuantidade} onChangeText={setMusicistasQuantidade} />

        {/* Seção 3: Santa Ceia */}
        <Text style={styles.sectionTitle}>Santa Ceia</Text>

        <Text style={styles.label}>Santa Ceia 2024</Text>
        <TextInput style={styles.input} placeholder="Quantidade de participantes" keyboardType="numeric" value={santaCeia2024} onChangeText={setSantaCeia2024} />

        <Text style={styles.label}>Santa Ceia 2025</Text>
        <TextInput style={styles.input} placeholder="Quantidade de participantes" keyboardType="numeric" value={santaCeia2025} onChangeText={setSantaCeia2025} />

        <Text style={styles.label}>Santa Ceia 2026</Text>
        <TextInput style={styles.input} placeholder="Quantidade de participantes" keyboardType="numeric" value={santaCeia2026} onChangeText={setSantaCeia2026} />

        {/* Seção 4: Informações Estruturais */}
        <Text style={styles.sectionTitle}>Informações Estruturais</Text>

        <Text style={styles.label}>Tipo de Material utilizado</Text>
        <TextInput style={styles.input} placeholder="Digite o tipo de material" value={materialTipo} onChangeText={setMaterialTipo} />

        <Text style={styles.label}>Tipo de material que existe no local</Text>
        <TextInput style={styles.input} placeholder="Digite o tipo de material" value={materialLocal} onChangeText={setMaterialLocal} />

        <Text style={styles.label}>Documentação</Text>
        <TextInput style={styles.input} placeholder="Descrição da documentação" value={documentacao} onChangeText={setDocumentacao} />

        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Tem Água</Text>
            <Switch value={temAgua} onValueChange={setTemAgua} />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Tem Luz</Text>
            <Switch value={temLuz} onValueChange={setTemLuz} />
          </View>
        </View>

        <Text style={styles.label}>A CCM já possui Terreno</Text>
        <TextInput style={styles.input} placeholder="Sim / Não" value={ccmTerreno} onChangeText={setCcmTerreno} />

        <Text style={styles.label}>A CCM possui imóvel próprio</Text>
        <TextInput style={styles.input} placeholder="Sim / Não" value={ccmImovel} onChangeText={setCcmImovel} />

        {/* Seção 5: Localização */}
        <Text style={styles.sectionTitle}>Localização</Text>

        <Text style={styles.label}>Posto Administrativo</Text>
        <TextInput style={styles.input} placeholder="Digite o nome do posto" value={postoAdministrativo} onChangeText={setPostoAdministrativo} />

        <Text style={styles.label}>Nome da Rua e Número</Text>
        <TextInput style={styles.input} placeholder="Digite a rua e número" value={rua} onChangeText={setRua} />

        <Text style={styles.label}>Nome do Bairro</Text>
        <TextInput style={styles.input} placeholder="Digite o bairro" value={bairro} onChangeText={setBairro} />

        <Text style={styles.label}>Nome da Cidade</Text>
        <TextInput style={styles.input} placeholder="Digite a cidade" value={cidade} onChangeText={setCidade} />

        <Text style={styles.label}>Quantidade de habitantes na cidade</Text>
        <TextInput style={styles.input} placeholder="Digite a quantidade" keyboardType="numeric" value={habitantesQuantidade} onChangeText={setHabitantesQuantidade} />

        {/* Seção 6: Dias de Reunião de Jovens */}
        <Text style={styles.sectionTitle}>Selecione os dias de Reunião de Jovens</Text>
        {DIAS_SEMANA.map((dia) => (
          <View key={dia.key} style={styles.diaContainer}>
            <Text style={styles.diaLabel}>{dia.label}:</Text>
            <View style={styles.periodosContainer}>
              {dia.periodos.map((periodo) => (
                <TouchableOpacity
                  key={periodo}
                  style={[
                    styles.periodoButton,
                    isSelecionado(periodo, diasReuniaoJovens) && styles.periodoButtonSelected,
                  ]}
                  onPress={() => toggleDiaReuniao(periodo)}
                >
                  <Text
                    style={[
                      styles.periodoText,
                      isSelecionado(periodo, diasReuniaoJovens) && styles.periodoTextSelected,
                    ]}
                  >
                    {periodo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Seção 7: Dias e Horários de Cultos */}
        <Text style={styles.sectionTitle}>Selecione os dias e horários dos cultos</Text>
        {DIAS_SEMANA.map((dia) => (
          <View key={dia.key + '_cultos'} style={styles.diaContainer}>
            <Text style={styles.diaLabel}>{dia.label}:</Text>
            <View style={styles.periodosContainer}>
              {dia.periodos.map((periodo) => (
                <TouchableOpacity
                  key={periodo}
                  style={[
                    styles.periodoButton,
                    isSelecionado(periodo, diasCultos) && styles.periodoButtonSelected,
                  ]}
                  onPress={() => toggleDiaCulto(periodo)}
                >
                  <Text
                    style={[
                      styles.periodoText,
                      isSelecionado(periodo, diasCultos) && styles.periodoTextSelected,
                    ]}
                  >
                    {periodo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Seção 8: Informações Adicionais */}
        <Text style={styles.sectionTitle}>Informações Adicionais</Text>

        <Text style={styles.label}>Data do batismo do cooperador</Text>
        <TextInput style={styles.input} placeholder="Digite a data do batismo" value={dataBatismo} onChangeText={setDataBatismo} />

        <Text style={styles.label}>O cooperador veio de outra denominação</Text>
        <TextInput style={styles.input} placeholder="Sim / Não" value={denominacaoOutra} onChangeText={setDenominacaoOutra} />

        <Text style={styles.label}>Quando iniciou a obra no local</Text>
        <TextInput style={styles.input} placeholder="Digite a data do início" value={dataInicio} onChangeText={setDataInicio} />

        <Text style={styles.label}>Campo de observação (sugestão/reclamação)</Text>
        <TextInput 
          style={[styles.input, styles.textAreaInput]} 
          placeholder="Escreva alguma sugestão ou reclamação" 
          value={observacao} 
          onChangeText={setObservacao}
          multiline
          numberOfLines={4}
        />

        {/* Botão Enviar */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>{isLoading ? 'Enviando...' : 'Enviar'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    backgroundColor: '#f5f5f5',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewForm: {
    marginTop: 70,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#ECE3E3',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderColor: '#007AFF',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  textAreaInput: {
    paddingVertical: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  diaContainer: {
    marginVertical: 12,
  },
  diaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  periodosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  periodoButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'white',
    minWidth: 50,
    alignItems: 'center',
  },
  periodoButtonSelected: {
    backgroundColor: '#007AFF',
  },
  periodoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  periodoTextSelected: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#0047AB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
