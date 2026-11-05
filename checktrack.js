import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

// 1. Récupérer le dossier où se trouve actuellement notre script (trackada/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Construire le chemin vers le fichier track.json situé dans le même dossier
const trackJsonPath = join(__dirname, "track.json");

// 3. Construire le chemin dynamique vers le dossier principal des projets
const projetsDir = join(homedir(), "AdaTechxSimon-Pierre", "adatasks", "semaine6");

// 4. Vérifier si le dossier principal existe
if (!existsSync(projetsDir)) {
  console.log(`❌ dossier principal des projets`);
  console.log(`- le dossier n'existe pas : vérifie ton arborescence`);
  process.exit(1); // Arrête immédiatement le script
} else {
  console.log(`✅ dossier principal des projets`);
}

// 5. Charger et parser le fichier track.json
const trackContent = readFileSync(trackJsonPath, "utf-8");
const trackData = JSON.parse(trackContent);

// Variables pour le calcul du pourcentage
const nombreTotalProjets = trackData.projects.length;
let nombreProjetsCorrects = 0;

// 6. Parcourir chaque projet défini dans track.json
for (const projet of trackData.projects) {
  const cheminProjet = join(projetsDir, projet.name);

  // 7. Vérifier si le dossier du projet existe
  if (!existsSync(cheminProjet)) {
    console.log(`\n❌ dossier du projet ${projet.name}`);
    console.log(`- le dossier n'existe pas ou n'est pas nommé correctement`);
  } else {
    console.log(`\n✅ dossier du projet ${projet.name}`);
    
    // Tableau pour stocker les messages d'erreur spécifiques à ce projet
    const erreurs = [];

    // Vérifier la présence du dossier .git
    const cheminGit = join(cheminProjet, ".git");
    if (!existsSync(cheminGit)) {
      erreurs.push(`- le repository git n'est pas initialisé`);
    }

    // Vérifier la présence de chaque fichier requis
    const fichiersManquants = [];
    for (const fichier of projet.required) {
      const cheminFichier = join(cheminProjet, fichier);
      if (!existsSync(cheminFichier)) {
        fichiersManquants.push(fichier);
      }
    }

    // Si des fichiers sont manquants, adapter la formulation selon le nombre
    if (fichiersManquants.length > 0) {
      if (fichiersManquants.length === 1) {
        erreurs.push(`- il manque ${fichiersManquants[0]}`);
      } else if (fichiersManquants.length === 2) {
        erreurs.push(`- il manque ${fichiersManquants[0]} et ${fichiersManquants[1]}`);
      } else {
        const derniersFichiers = fichiersManquants.pop();
        erreurs.push(`- il manque ${fichiersManquants.join(", ")} et ${derniersFichiers}`);
      }
    }

    // Afficher les erreurs accumulées (s'il y en a) dans le bon ordre
    if (erreurs.length > 0) {
      for (const erreur of erreurs) {
        console.log(erreur);
      }
    } else {
      // Si aucune erreur, le projet est correct !
      nombreProjetsCorrects++;
    }
  }
}

// 7. Calcul du pourcentage global et affichage final
const pourcentage = Math.round((nombreProjetsCorrects / nombreTotalProjets) * 100);

console.log("\n----------------------------------------");
if (pourcentage === 100) {
  console.log(`✅ ${pourcentage}% des projets sont initialisés correctement (${nombreProjetsCorrects}/${nombreTotalProjets})`);
} else {
  console.log(`❌ ${pourcentage}% des projets sont initialisés correctement (${nombreProjetsCorrects}/${nombreTotalProjets})`);
}