exports.fr = {
  startButton : 'START',
  lockButton  : 'VERROUILLER',
  confirmButton : 'CONFIRMER',
  continueButton: 'CONTINUER',
  map : 'MAP',
  code : 'CODE',
  offlineLangAlert : "Votre téléphone n’est pas connecté. Il n'est pas possible de changer de langue",
  loadingLanguage : 'FRA',
  headphonesInstructions : `Portez les écouteurs fournis pour entendre correctement le son`,
  audioTestInstructions : 'Augmenter le volume du smartphone',
  audioTestCaption : `Entendez-vous correctement l'audio?`,
  confirmAudioButton : `Oui, continuez`,
  dismissAudioButton : `Non, demandez de l'aide`,
  helpAudioMessage: [
    `VOUS N'ENTENDEZ PAS LE SON?`,
    `Vérifiez le niveau de volume à l'aide des touches situées sur le côté droit du téléphone.
    Vérifiez que le casque soit allumé et que la connexion Bluetooth soit active.
    Si vous n’arrivez pas à résoudre le problème, veuillez contacter le bureau du musée.
    Ou, si vous êtes dans le parc, appelez le +39 3351017368`
  ],
  unlockInstructions: '"M" comme MUBIA',
  unlockInstructionsCaption: `Pendant la visite, si vous souhaitez parcourir l'application, utilisez cette séquence pour la déverrouiller`,
  codeInputInstruction : 'Saisissez le code que vous trouvez sur le panneau',
  invalidAudioCode : 'Code non valide. Saisissez le code à 3 caractères qui se trouve sur le panneau',
  alreadyPayingAudio : 'Un autre contenu audio est diffusé',
  alreadyVisitedSpot : [
    `LIEU DÉJÀ VISITÉ`,
    `Vous êtes déjà venu ici. Appuyez sur la touche "play" de l'application pour réécouter le contenu`,
  ],
  loadingAudio : 'Téléchargement du contenu en cours',
  faqTitle: 'Foire aux questions',
  faqs : [
    {
      title : `Pourquoi n'entends-je pas le son des écouteurs?`,
      text  : `
        Mettez les écouteurs et appuyez sur le bouton ci-dessous pour diffuser un son de test et vérifier son fonctionnement.
        <button id="test-sound-button" type="button" name="test-sound" style="display:block;"class="large-button dark-button my-4">TEST</button>

        <b class="mb-4">Si vous entendez un son, passez à la question suivante.</b>
        <br>
        Si vous n'entendez rien, il peut y avoir trois raisons:
        <ol class="my-4">
        <li>le volume du téléphone est au minimum</li>
        <li>l'oreillette est éteinte</li>
        <li>l'oreillette est allumée mais non connectée au téléphone</li>
        </ol>
        Vérifiez d'abord le volume à l'aide des boutons situés sur le côté droit du téléphone. Vérifiez ensuite que le casque soit allumé en appuyant brièvement sur le bouton situé sous votre oreille droite : si la voix annonce le niveau de charge de la batterie, le casque est allumé. Sinon, appuyez plus longtemps sur le même bouton pour l’allumer. Enfin, vérifiez que la fonction Bluetooth de votre téléphone soit activée : ouvrez le menu déroulant Android en faisant glisser votre doigt du haut de l'écran vers le bas. Maintenant, appuyez et gardez enfoncé le symbole Bluetooth pour vérifier l'état de marche et la connexion. Si nécessaire, essayez à nouveau de l'associer avec votre casque.
        Si vous n'avez pas pu résoudre le problème, veuillez contacter le bureau du musée ou, si vous êtes dans le parc, appelez le <b>+39 3351017368</b>.`
    },
    {
      title : `Que dois-je faire si j'atteins un point d’intérêt et que le contenu ne démarre pas?`,
      text  : `Votre signal GPS n'est peut-être pas assez précis pour assurer une lecture automatique. Si aucun contenu n'est diffusé à proximité des panneaux, saisissez le code à trois caractères inscrit sur le panneau dans l'application pour lancer l'audio manuellement.`
    },
    {
      title : 'Où puis-je trouver le code à saisir?',
      text  : 'À chaque point d’intérêt, vous trouverez un panneau en bois avec un symbole de haut-parleur. Sous ce symbole, vous trouverez un code de 3 caractères. Si le contenu audio ne démarre pas automatiquement, vous pouvez utiliser ce code pour le lire manuellement. Entrez dans la section AIDE (?) de l’application, saisissez le code et appuyez sur CONFIRMER.'
    },
    {
      title : 'Pourquoi ne puis-je pas changer de langue?',
      text  : `Vous ne pouvez sélectionner une autre langue que si vous disposez d'une connexion Internet.`
    },
    {
      title : 'Comment fonctionne cette application?',
      text  : `Cette application est basée sur l'utilisation du GPS. Nous utilisons votre position pour reproduire automatiquement le contenu sonore une fois que vous avez atteint les points d'intérêt marqués par des panneaux en bois dédiés le long du chemin. Le GPS a une précision variable et il se peut parfois que le signal ne soit pas disponible. Nous avons donc ajouté le code de sécurité pour vous permettre d'écouter le contenu dans tous les cas. La connexion Bluetooth et le casque à conduction osseuse garantissent une expérience en pleine harmonie avec l'environnement autour de vous.`
    },
    {
      title : 'Qui est Mezzo Forte?',
      text  : `Mezzo Forte est spécialisé dans la conception d'expériences basées sur des contenus audio de haute qualité, la réalité acoustique augmentée et les installations interactives basées sur le son. Elle a été fondée en 2019 par une équipe de chercheurs, de sound designers, de développeurs, d'experts dans le domaine du traitement du son.
      Pour en savoir plus, consultez le site <b>www.mezzoforte.design</b>`
    }
  ],
  audioTitles: {
    '1IN': 'Introduction',
    '2BS': 'Les Biancane dans l’histoire',
    '3SC': 'La source de Chiorba',
    '4LA': 'Le Lagone naturel',
    '5SO': 'Le Soffione',
    '6AF': 'La source de Acqua Forte',
    '7BA': 'La Biancana',
    '8AT': 'L’amphithéâtre',
    '9IV': 'Une île végétative',
    '0RD': 'La colère du Diable',
    '1PG': 'Le paradis des géologues',
    '2BV': 'Le Belvedere'
  },
  walkInstruction: `Continuez le long de l'itinéraire et découvrez la prochaine expérience sonore`
};
