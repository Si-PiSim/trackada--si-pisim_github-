import fs from 'fs';

const filePath = './track.json';

try {
  console.log("Lecture du fichier :", filePath);
    const rawData = fs.readFileSync(filePath, 'utf8');
    console.log("Contenu brut du fichier :", rawData);

    const trackData = JSON.parse(rawData);
    
    console.log("Parsing réussi ! Type de la variable trackData :", typeof trackData);
    console.log("Objet JavaScript obtenu :", trackData);
} catch (error) {
    console.error("Erreur lors de la lecture du fichier :", error.message);
}
console.log("Fin du script");