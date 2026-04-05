export interface Mission {
  id: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const troubleMissions: Mission[] = [
  // EASY - Mots a placer
  { id: 1, text: "Glisse le mot 'banane' dans 3 phrases differentes sans te faire griller.", difficulty: "easy" },
  { id: 2, text: "Place le mot 'mysterieux' au moins 2 fois de facon naturelle.", difficulty: "easy" },
  { id: 3, text: "Dis 'franchement' au debut de 3 phrases sans que ca paraisse bizarre.", difficulty: "easy" },
  { id: 4, text: "Utilise le mot 'catastrophe' 2 fois dans la conversation.", difficulty: "easy" },
  { id: 5, text: "Place l'expression 'c'est chaud' 3 fois.", difficulty: "easy" },
  { id: 6, text: "Dis 'techniquement' avant 2 de tes reponses.", difficulty: "easy" },
  { id: 7, text: "Glisse le mot 'legendaire' 2 fois.", difficulty: "easy" },
  { id: 8, text: "Utilise 'en vrai' au moins 4 fois.", difficulty: "easy" },
  { id: 9, text: "Place le mot 'karma' 2 fois dans tes phrases.", difficulty: "easy" },
  { id: 10, text: "Dis 'j'avoue' au moins 3 fois.", difficulty: "easy" },

  // EASY - Comportements subtils
  { id: 11, text: "Touche ton oreille a chaque fois que tu es d'accord avec quelqu'un.", difficulty: "easy" },
  { id: 12, text: "Bois une gorgee d'eau apres chaque prise de parole.", difficulty: "easy" },
  { id: 13, text: "Hoche la tete lentement pendant que les autres parlent.", difficulty: "easy" },
  { id: 14, text: "Regarde ta montre ou ton telephone discretement toutes les 2 minutes.", difficulty: "easy" },
  { id: 15, text: "Croise les bras a chaque fois qu'on te pose une question.", difficulty: "easy" },
  { id: 16, text: "Fais un petit bruit ('hmm') avant chaque reponse.", difficulty: "easy" },
  { id: 17, text: "Souris mysterieusement apres les reponses des autres.", difficulty: "easy" },
  { id: 18, text: "Tapote la table quand tu reflechis.", difficulty: "easy" },
  { id: 19, text: "Leve legerement un sourcil quand quelqu'un parle.", difficulty: "easy" },
  { id: 20, text: "Penche-toi en avant a chaque anecdote interessante.", difficulty: "easy" },

  // EASY - Phrases a placer
  { id: 21, text: "Place 'ca me rappelle une histoire' sans raconter l'histoire.", difficulty: "easy" },
  { id: 22, text: "Dis 'c'est exactement ce que je pensais' 2 fois.", difficulty: "easy" },
  { id: 23, text: "Utilise 'tu vois ce que je veux dire' 3 fois.", difficulty: "easy" },
  { id: 24, text: "Place 'j'ai lu quelque part que...' suivi d'une info random.", difficulty: "easy" },
  { id: 25, text: "Dis 'c'est complique' au moins 2 fois.", difficulty: "easy" },
  { id: 26, text: "Utilise 'entre nous' avant une revelation banale.", difficulty: "easy" },
  { id: 27, text: "Place 'sans vouloir me vanter' avant quelque chose de pas impressionnant.", difficulty: "easy" },
  { id: 28, text: "Dis 'j'ai une theorie' sans jamais l'expliquer completement.", difficulty: "easy" },
  { id: 29, text: "Utilise 'on en reparle' 2 fois sans jamais en reparler.", difficulty: "easy" },
  { id: 30, text: "Place 'c'est marrant parce que' 2 fois.", difficulty: "easy" },

  // MEDIUM - Missions de manipulation
  { id: 31, text: "Fais en sorte que quelqu'un dise le mot 'bizarre' en 5 minutes.", difficulty: "medium" },
  { id: 32, text: "Amene quelqu'un a te poser une question sur tes vacances.", difficulty: "medium" },
  { id: 33, text: "Fais parler quelqu'un de son ex sans poser de question directe.", difficulty: "medium" },
  { id: 34, text: "Fais rire tout le groupe au moins une fois.", difficulty: "medium" },
  { id: 35, text: "Reussis a ce que quelqu'un repete ce que tu viens de dire.", difficulty: "medium" },
  { id: 36, text: "Fais en sorte qu'on te pose une question sur ta vie amoureuse.", difficulty: "medium" },
  { id: 37, text: "Amene le groupe a parler de nourriture.", difficulty: "medium" },
  { id: 38, text: "Fais en sorte que quelqu'un te donne raison publiquement.", difficulty: "medium" },
  { id: 39, text: "Reussis a changer de sujet sans que ca se remarque.", difficulty: "medium" },
  { id: 40, text: "Fais en sorte qu'une personne specifique prenne la parole.", difficulty: "medium" },

  // MEDIUM - Comportements plus visibles
  { id: 41, text: "Imite discretement les gestes de la personne en face de toi.", difficulty: "medium" },
  { id: 42, text: "Fais une blague qui tombe completement a plat et assume.", difficulty: "medium" },
  { id: 43, text: "Raconte une histoire et fais comme si tu avais oublie la fin.", difficulty: "medium" },
  { id: 44, text: "Fais semblant de recevoir un message important et reagis bizarrement.", difficulty: "medium" },
  { id: 45, text: "Dis quelque chose de faux avec assurance et vois si on te corrige.", difficulty: "medium" },
  { id: 46, text: "Fais un compliment etrange a quelqu'un ('t'as de beaux coudes').", difficulty: "medium" },
  { id: 47, text: "Propose un toast ridicule et convaincs les autres de trinquer.", difficulty: "medium" },
  { id: 48, text: "Invente un mot et utilise-le comme si c'etait normal.", difficulty: "medium" },
  { id: 49, text: "Fais une pause dramatique avant de dire quelque chose de banal.", difficulty: "medium" },
  { id: 50, text: "Commence une phrase par 'ne le prends pas mal mais' suivi d'un compliment.", difficulty: "medium" },

  // MEDIUM - Defis relationnels
  { id: 51, text: "Fais un clin d'oeil discret a quelqu'un du groupe.", difficulty: "medium" },
  { id: 52, text: "Donne un surnom a quelqu'un et utilise-le 3 fois.", difficulty: "medium" },
  { id: 53, text: "Fais croire que tu partages un secret avec quelqu'un du groupe.", difficulty: "medium" },
  { id: 54, text: "Defend une opinion absurde avec conviction pendant 2 minutes.", difficulty: "medium" },
  { id: 55, text: "Raconte une anecdote inventee comme si c'etait vrai.", difficulty: "medium" },
  { id: 56, text: "Fais semblant d'avoir un insider avec quelqu'un.", difficulty: "medium" },
  { id: 57, text: "Lance un 'tu te souviens quand...' avec quelqu'un sur un faux souvenir.", difficulty: "medium" },
  { id: 58, text: "Fais en sorte que quelqu'un se leve de sa place.", difficulty: "medium" },
  { id: 59, text: "Convaincs quelqu'un de te preter son telephone 30 secondes.", difficulty: "medium" },
  { id: 60, text: "Fais boire quelqu'un en lui portant un toast personnalise.", difficulty: "medium" },

  // MEDIUM - Phrases elaborees
  { id: 61, text: "Place 'c'est exactement ce qu'ils veulent qu'on pense' de facon serieuse.", difficulty: "medium" },
  { id: 62, text: "Dis 'j'ai mes sources' sans jamais les reveler.", difficulty: "medium" },
  { id: 63, text: "Utilise 'statistiquement' suivi d'une statistique inventee.", difficulty: "medium" },
  { id: 64, text: "Place 'mon psy dit que' avant une observation random.", difficulty: "medium" },
  { id: 65, text: "Dis 'je ne devrais pas dire ca mais' suivi de quelque chose de banal.", difficulty: "medium" },
  { id: 66, text: "Commence une phrase par 'apparemment' et invente la suite.", difficulty: "medium" },
  { id: 67, text: "Utilise 'c'est ce qu'on m'a dit' pour une info que tu inventes.", difficulty: "medium" },
  { id: 68, text: "Place 'j'ai lu ca dans une etude' suivi d'un fait absurde.", difficulty: "medium" },
  { id: 69, text: "Dis 'promets-moi de ne pas le repeter' avant quelque chose d'inoffensif.", difficulty: "medium" },
  { id: 70, text: "Utilise 'je ne juge pas mais' puis juge clairement.", difficulty: "medium" },

  // HARD - Manipulation avancee
  { id: 71, text: "Fais en sorte que 2 personnes se mettent d'accord contre toi.", difficulty: "hard" },
  { id: 72, text: "Fais changer quelqu'un d'avis sur un sujet.", difficulty: "hard" },
  { id: 73, text: "Cree une inside joke avec le groupe sans qu'ils sachent que c'etait prevu.", difficulty: "hard" },
  { id: 74, text: "Fais en sorte que quelqu'un te defend spontanement.", difficulty: "hard" },
  { id: 75, text: "Lance un debat et fais en sorte de ne prendre aucun parti.", difficulty: "hard" },
  { id: 76, text: "Fais en sorte que 2 personnes du groupe echangent quelque chose.", difficulty: "hard" },
  { id: 77, text: "Amene quelqu'un a partager un secret personnel.", difficulty: "hard" },
  { id: 78, text: "Fais en sorte que tout le monde parle d'un meme sujet sans le proposer.", difficulty: "hard" },
  { id: 79, text: "Convaincs quelqu'un de faire un gage sans que ce soit un jeu.", difficulty: "hard" },
  { id: 80, text: "Fais en sorte qu'on te supplie de raconter quelque chose.", difficulty: "hard" },

  // HARD - Acting
  { id: 81, text: "Fais semblant de recevoir une mauvaise nouvelle par SMS et joue le jeu 2 min.", difficulty: "hard" },
  { id: 82, text: "Pretends reconnaitre quelqu'un qui passe (si vous etes en public).", difficulty: "hard" },
  { id: 83, text: "Fais croire que tu as oublie le prenom de quelqu'un du groupe.", difficulty: "hard" },
  { id: 84, text: "Simule une dispute amicale avec quelqu'un du groupe.", difficulty: "hard" },
  { id: 85, text: "Fais comme si tu venais de te souvenir de quelque chose de choquant.", difficulty: "hard" },
  { id: 86, text: "Pretends ne pas connaitre une celebrite ultra connue.", difficulty: "hard" },
  { id: 87, text: "Fais semblant d'avoir un avis tres tranche puis change completement d'avis.", difficulty: "hard" },
  { id: 88, text: "Joue le role de quelqu'un qui ment tres mal pendant 3 minutes.", difficulty: "hard" },
  { id: 89, text: "Fais comme si quelque chose de tres banal etait extremement interessant.", difficulty: "hard" },
  { id: 90, text: "Pretends avoir vecu exactement la meme experience que quelqu'un d'autre.", difficulty: "hard" },

  // HARD - Defis sociaux
  { id: 91, text: "Fais dire 'je t'aime' a quelqu'un du groupe (meme en blague).", difficulty: "hard" },
  { id: 92, text: "Convaincs le groupe de prendre une photo de groupe maintenant.", difficulty: "hard" },
  { id: 93, text: "Fais en sorte que quelqu'un te fasse un compliment sincere.", difficulty: "hard" },
  { id: 94, text: "Amene quelqu'un a avouer quelque chose d'embarrassant.", difficulty: "hard" },
  { id: 95, text: "Fais en sorte que tout le monde se taise pendant 10 secondes.", difficulty: "hard" },
  { id: 96, text: "Convaincs quelqu'un de chanter quelques notes.", difficulty: "hard" },
  { id: 97, text: "Fais en sorte que 3 personnes portent un toast en meme temps.", difficulty: "hard" },
  { id: 98, text: "Amene quelqu'un a imiter quelqu'un d'autre du groupe.", difficulty: "hard" },
  { id: 99, text: "Fais en sorte que quelqu'un quitte la piece (meme 30 sec).", difficulty: "hard" },
  { id: 100, text: "Cree un moment de malaise puis detends l'atmosphere.", difficulty: "hard" },

  // HARD - Ultimate
  { id: 101, text: "Fais en sorte que quelqu'un te revele un secret qu'il/elle n'a jamais dit.", difficulty: "hard" },
  { id: 102, text: "Convaincs tout le groupe de faire un truc absurde ensemble.", difficulty: "hard" },
  { id: 103, text: "Fais en sorte que 2 personnes se fassent un compliment.", difficulty: "hard" },
  { id: 104, text: "Amene quelqu'un a admettre qu'il/elle avait tort sur quelque chose.", difficulty: "hard" },
  { id: 105, text: "Fais en sorte que quelqu'un raconte son histoire la plus embarrassante.", difficulty: "hard" },
  { id: 106, text: "Lance un sujet tabou sans que ca semble force.", difficulty: "hard" },
  { id: 107, text: "Fais en sorte que quelqu'un te confie ses insecurites.", difficulty: "hard" },
  { id: 108, text: "Convaincs 2 personnes de faire equipe contre une troisieme (en blague).", difficulty: "hard" },
  { id: 109, text: "Fais changer de place 2 personnes du groupe.", difficulty: "hard" },
  { id: 110, text: "Fais en sorte que tout le groupe parle de toi positivement.", difficulty: "hard" },
];
