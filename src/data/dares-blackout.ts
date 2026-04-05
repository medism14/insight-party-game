export interface Dare {
  id: number;
  text: string;
  intensity: 'soft' | 'medium' | 'hot';
}

export const blackoutDares: Dare[] = [
  // SOFT - Imitations et voix
  { id: 1, text: "Imite une celebrite pendant 30 secondes.", intensity: "soft" },
  { id: 2, text: "Parle avec un accent etranger jusqu'au prochain tour.", intensity: "soft" },
  { id: 3, text: "Fais ton meilleur rire de mechant.", intensity: "soft" },
  { id: 4, text: "Raconte une blague avec la voix de Dark Vador.", intensity: "soft" },
  { id: 5, text: "Imite quelqu'un du groupe - les autres doivent deviner qui.", intensity: "soft" },
  { id: 6, text: "Chante le refrain de ta chanson preferee.", intensity: "soft" },
  { id: 7, text: "Fais un discours de remerciement aux Oscars pour avoir gagne ce jeu.", intensity: "soft" },
  { id: 8, text: "Imite un bebe qui pleure pendant 15 secondes.", intensity: "soft" },
  { id: 9, text: "Fais la voix d'un robot pendant 1 minute.", intensity: "soft" },
  { id: 10, text: "Imite ton animal prefere.", intensity: "soft" },

  // SOFT - Mouvements et danses
  { id: 11, text: "Fais 10 pompes devant tout le monde.", intensity: "soft" },
  { id: 12, text: "Danse pendant 30 secondes sans musique.", intensity: "soft" },
  { id: 13, text: "Fais le moonwalk (ou essaie).", intensity: "soft" },
  { id: 14, text: "Fais la planche pendant 20 secondes.", intensity: "soft" },
  { id: 15, text: "Fais ton meilleur dab.", intensity: "soft" },
  { id: 16, text: "Marche comme un top model pendant 30 secondes.", intensity: "soft" },
  { id: 17, text: "Fais 5 squats en chantant.", intensity: "soft" },
  { id: 18, text: "Imite la danse de Fortnite (ou une danse virale).", intensity: "soft" },
  { id: 19, text: "Fais le tour de la piece en marchant comme un crabe.", intensity: "soft" },
  { id: 20, text: "Fais semblant de nager pendant 20 secondes.", intensity: "soft" },

  // SOFT - Interactions
  { id: 21, text: "Fais un compliment sincere a chaque personne du groupe.", intensity: "soft" },
  { id: 22, text: "Appelle un contact au hasard et dis-lui que tu l'aimes.", intensity: "soft" },
  { id: 23, text: "Laisse quelqu'un ecrire ce qu'il veut sur ton bras.", intensity: "soft" },
  { id: 24, text: "Echange un vetement avec quelqu'un pendant 3 tours.", intensity: "soft" },
  { id: 25, text: "Laisse le groupe te donner un nouveau prenom pour le reste du jeu.", intensity: "soft" },
  { id: 26, text: "Fais un selfie avec la personne de ton choix et poste-le.", intensity: "soft" },
  { id: 27, text: "Dis ton dernier message envoye a voix haute.", intensity: "soft" },
  { id: 28, text: "Montre la derniere photo de ta galerie.", intensity: "soft" },
  { id: 29, text: "Fais deviner un film en mimant.", intensity: "soft" },
  { id: 30, text: "Raconte ton pire date.", intensity: "soft" },

  // MEDIUM - Plus embarrassant
  { id: 31, text: "Fais un slow avec la personne a ta gauche.", intensity: "medium" },
  { id: 32, text: "Laisse quelqu'un te maquiller les yeux fermes.", intensity: "medium" },
  { id: 33, text: "Poste une story embarrassante de toi maintenant.", intensity: "medium" },
  { id: 34, text: "Envoie 'Tu me manques' a ton ex.", intensity: "medium" },
  { id: 35, text: "Montre ta conversation la plus genante.", intensity: "medium" },
  { id: 36, text: "Fais une declaration d'amour a un objet.", intensity: "medium" },
  { id: 37, text: "Mange une cuillere de quelque chose de degoutant.", intensity: "medium" },
  { id: 38, text: "Bois un shot de quelque chose choisi par le groupe.", intensity: "medium" },
  { id: 39, text: "Mets un glaçon dans ton t-shirt.", intensity: "medium" },
  { id: 40, text: "Fais un poirier (ou essaie) contre le mur.", intensity: "medium" },

  // MEDIUM - Revelations
  { id: 41, text: "Montre ta derniere recherche Google.", intensity: "medium" },
  { id: 42, text: "Lis ton dernier SMS recu a voix haute.", intensity: "medium" },
  { id: 43, text: "Raconte ton reve le plus bizarre.", intensity: "medium" },
  { id: 44, text: "Avoue ton crush de celebrite le plus honteux.", intensity: "medium" },
  { id: 45, text: "Montre ta playlist la plus honteuse.", intensity: "medium" },
  { id: 46, text: "Raconte ta pire honte en soiree.", intensity: "medium" },
  { id: 47, text: "Montre ta photo la moins flatteuse de ta galerie.", intensity: "medium" },
  { id: 48, text: "Avoue un mensonge que tu as dit recemment.", intensity: "medium" },
  { id: 49, text: "Dis combien tu as sur ton compte en banque.", intensity: "medium" },
  { id: 50, text: "Raconte ton fantasme le plus soft.", intensity: "medium" },

  // MEDIUM - Defis physiques
  { id: 51, text: "Fais un massage de 1 minute a la personne de ton choix.", intensity: "medium" },
  { id: 52, text: "Garde quelqu'un sur tes genoux pendant 2 tours.", intensity: "medium" },
  { id: 53, text: "Fais une seance photo sexy pendant 30 secondes.", intensity: "medium" },
  { id: 54, text: "Enleve une chaussette avec ta bouche.", intensity: "medium" },
  { id: 55, text: "Fais un lap dance pendant 20 secondes.", intensity: "medium" },
  { id: 56, text: "Laisse quelqu'un te coiffer comme il veut.", intensity: "medium" },
  { id: 57, text: "Mange quelque chose dans la main de quelqu'un.", intensity: "medium" },
  { id: 58, text: "Mords doucement l'oreille de la personne a ta droite.", intensity: "medium" },
  { id: 59, text: "Fais un calin de groupe de 30 secondes.", intensity: "medium" },
  { id: 60, text: "Laisse quelqu'un dessiner sur ton visage.", intensity: "medium" },

  // MEDIUM - Reseaux sociaux
  { id: 61, text: "Publie 'Je suis celibataire' sur tes reseaux.", intensity: "medium" },
  { id: 62, text: "Envoie un message flirteur a ton dernier match.", intensity: "medium" },
  { id: 63, text: "Like les 5 derniers posts de ton ex.", intensity: "medium" },
  { id: 64, text: "Change ta bio en quelque chose de ridicule.", intensity: "medium" },
  { id: 65, text: "Fais une story en disant 'Je cherche l'amour'.", intensity: "medium" },
  { id: 66, text: "Envoie un emoji coeur a un contact au hasard.", intensity: "medium" },
  { id: 67, text: "Poste une photo de tes pieds sur tes reseaux.", intensity: "medium" },
  { id: 68, text: "Commente 'T'es canon' sous la derniere photo d'un(e) ami(e).", intensity: "medium" },
  { id: 69, text: "Envoie 'On parle ?' a quelqu'un que tu n'as pas contacte depuis longtemps.", intensity: "medium" },
  { id: 70, text: "Laisse quelqu'un envoyer un message de ton telephone.", intensity: "medium" },

  // HOT - Contact physique
  { id: 71, text: "Embrasse quelqu'un du groupe sur la joue pendant 5 secondes.", intensity: "hot" },
  { id: 72, text: "Fais un bisou dans le cou a la personne de ton choix.", intensity: "hot" },
  { id: 73, text: "Murmure quelque chose de sexy a l'oreille de quelqu'un.", intensity: "hot" },
  { id: 74, text: "Leche le doigt de quelqu'un.", intensity: "hot" },
  { id: 75, text: "Masse les epaules de quelqu'un pendant 1 minute.", intensity: "hot" },
  { id: 76, text: "Fais un body shot sur quelqu'un.", intensity: "hot" },
  { id: 77, text: "Passe un glaçon sur le cou de quelqu'un.", intensity: "hot" },
  { id: 78, text: "Fais un slow tres colle avec quelqu'un.", intensity: "hot" },
  { id: 79, text: "Garde ta main sur la cuisse de quelqu'un pendant 2 tours.", intensity: "hot" },
  { id: 80, text: "Fais semblant d'embrasser quelqu'un en vous arretant a 2cm.", intensity: "hot" },

  // HOT - Strip et vetements
  { id: 81, text: "Enleve un vetement de ton choix.", intensity: "hot" },
  { id: 82, text: "Joue le prochain tour en sous-vetements.", intensity: "hot" },
  { id: 83, text: "Laisse quelqu'un t'enlever une chaussette avec les dents.", intensity: "hot" },
  { id: 84, text: "Fais une pose sexy pendant 30 secondes.", intensity: "hot" },
  { id: 85, text: "Danse sensuellement pendant 1 minute.", intensity: "hot" },
  { id: 86, text: "Fais un strip-tease de 30 secondes (jusqu'au t-shirt).", intensity: "hot" },
  { id: 87, text: "Enleve le haut d'une autre personne avec ses yeux bandes.", intensity: "hot" },
  { id: 88, text: "Reste en chaussettes seulement aux pieds pour 3 tours.", intensity: "hot" },
  { id: 89, text: "Montre ton tatouage ou piercing le plus cache.", intensity: "hot" },
  { id: 90, text: "Fais deviner ce que quelqu'un ecrit sur ton dos nu.", intensity: "hot" },

  // HOT - Revelations intimes
  { id: 91, text: "Decris ta technique de drague en detail.", intensity: "hot" },
  { id: 92, text: "Raconte ton experience la plus hot.", intensity: "hot" },
  { id: 93, text: "Dis ce qui t'excite le plus chez quelqu'un.", intensity: "hot" },
  { id: 94, text: "Avoue ton fantasme le plus secret.", intensity: "hot" },
  { id: 95, text: "Dis qui tu embrasserais ici si tu devais choisir.", intensity: "hot" },
  { id: 96, text: "Decris ton partenaire ideal au lit.", intensity: "hot" },
  { id: 97, text: "Dis la chose la plus osee que tu aies faite.", intensity: "hot" },
  { id: 98, text: "Raconte ta pire experience intime (sans noms).", intensity: "hot" },
  { id: 99, text: "Dis ce que tu trouves sexy chez quelqu'un ici.", intensity: "hot" },
  { id: 100, text: "Fais ton plus beau regard seducteur a quelqu'un pendant 15 secondes.", intensity: "hot" },

  // HOT - Defis audacieux
  { id: 101, text: "Embrasse langoureusement la main de quelqu'un.", intensity: "hot" },
  { id: 102, text: "Fais 7 minutes au paradis avec quelqu'un.", intensity: "hot" },
  { id: 103, text: "Laisse quelqu'un te bander les yeux et te nourrir.", intensity: "hot" },
  { id: 104, text: "Fais un massage des pieds a quelqu'un.", intensity: "hot" },
  { id: 105, text: "Joue a la bouteille avec les presents.", intensity: "hot" },
  { id: 106, text: "Chuchote ton plus grand secret a l'oreille de quelqu'un.", intensity: "hot" },
  { id: 107, text: "Fais une danse sensuelle avec quelqu'un.", intensity: "hot" },
  { id: 108, text: "Laisse quelqu'un te mettre du rouge a levres.", intensity: "hot" },
  { id: 109, text: "Envoie un message coquin a ton dernier crush.", intensity: "hot" },
  { id: 110, text: "Fais un jeu de regard intense avec quelqu'un pendant 1 minute.", intensity: "hot" },
];
