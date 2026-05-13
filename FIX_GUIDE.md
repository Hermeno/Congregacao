# Fix para erro: java.lang.Spring cannot be cast to java.lang.Boolean

## Problema
Este erro ocorre devido a conflito de versão entre `react-native-maps` e as dependências do Google Play Services em combinação com Expo 54 e React Native 0.81.5.

## Mudanças realizadas

### 1. **android/app/build.gradle**
- ✅ Adicionado `missingDimensionStrategy` na `defaultConfig` para resolver ambiguidade do Google Play Services
- ✅ Adicionadas dependências explícitas do Google Play Services:
  - `com.google.android.gms:play-services-maps:18.2.0`
  - `com.google.android.gms:play-services-base:18.3.0`

### 2. **app.json**
- ✅ Adicionadas permissões de localização necessárias para Maps
- ✅ Configurado `expo-build-properties` com versões corretas de SDK

### 3. **android/gradle.properties**
- ✅ Adicionadas configurações para suprimir warnings de compilação

## Como aplicar o fix

### Opção 1: Build limpo no Expo (Recomendado)
```bash
# Dentro da pasta do projeto
cd /Users/cash/Desktop/ccb

# Limpar cache
expo prebuild --clean

# Deletar pasta android se existir (ela será recriada)
rm -rf android

# Instalar dependências novamente
npm install

# Build para Android
expo run:android
```

### Opção 2: Se estiver usando EAS Build
```bash
eas build --platform android --clean
```

### Opção 3: Build local com gradle limpo
```bash
# Se já tiver a pasta android
cd android
./gradlew clean
cd ..

# Reconstruir
expo run:android
```

## Próximos passos

1. Execute um dos comandos acima
2. Espere a compilação completar
3. O app deve funcionar sem o erro de Spring casting
4. Se continuar com erros, tente remover `node_modules` e `package-lock.json`:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Se o erro persistir

O erro pode estar também em:
- Versão desatualizada do `react-native-maps` (considere atualizar para 1.21.3 ou superior)
- Cachê do Gradle corrompido: `cd android && ./gradlew --stop && ./gradlew clean`
- Variáveis de ambiente do Android SDK

## Referências
- Issue do react-native-maps: Compatibilidade com Google Play Services
- Expo docs: https://docs.expo.dev/build-reference/android-gradle-properties/
