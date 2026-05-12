import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface CsvRow {
  [key: string]: string | number | boolean | null;
}

export const exportToCsv = async (
  fileName: string,
  data: CsvRow[],
  headers?: string[]
): Promise<void> => {
  try {
    if (!data || data.length === 0) {
      throw new Error('Aucune donnée à exporter');
    }

    // Utilise les en-têtes fournis ou extrait les clés du premier objet
    const csvHeaders = headers || Object.keys(data[0]);
    
    // Crée l'en-tête
    let csvContent = csvHeaders.join(',') + '\n';

    // Ajoute les lignes de données
    data.forEach((row) => {
      const values = csvHeaders.map((header) => {
        const value = row[header];
        // Échappe les guillemets doubles dans les valeurs qui contiennent des virgules
        if (value !== null && value !== undefined) {
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }
        return '';
      });
      csvContent += values.join(',') + '\n';
    });

    // Enregistre le fichier
    const fileUri = `${FileSystem.DocumentDirectoryPath}/${fileName}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Partage le fichier
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: `Partager ${fileName}`,
      });
    } else {
      console.log(`Fichier enregistré dans : ${fileUri}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    throw error;
  }
};

export const downloadFile = async (
  url: string,
  fileName: string
): Promise<void> => {
  try {
    const fileUri = `${FileSystem.DocumentDirectoryPath}/${fileName}`;
    
    const downloadResult = await FileSystem.downloadAsync(url, fileUri);

    if (downloadResult.status === 200) {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        console.log(`Fichier enregistré dans : ${fileUri}`);
      }
    } else {
      throw new Error(`Le téléchargement a échoué avec le statut ${downloadResult.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw error;
  }
};
