exports.it = {
  startButton : 'INIZIA',
  lockButton  : 'BLOCCA',
  confirmButton : 'CONFERMA',
  continueButton: 'CONTINUA',
  map : 'MAPPA',
  code : 'CODICE',
  offlineLangAlert : "Il tuo telefono è offline. Non è possibile cambiare lingua",
  loadingLanguage : 'ITA',
  headphonesInstructions : `Indossa le cuffie in dotazione per sentire l'audio correttamente`,
  audioTestInstructions : 'Aumenta il volume dello smartphone',
  audioTestCaption : `Stai sentendo l'audio correttamente?`,
  confirmAudioButton : `Si, continua`,
  dismissAudioButton : `No, chiedi assistenza`,
  helpAudioMessage: [
    `NON SENTI AUDIO?`,
    `Verifica il livello di volume, utilizzando i tasti sulla destra del telefono.
     Verifica che le cuffie siano accese e che la connessione bluetooth sia attiva.
     Se non riesci a risolvere il problema rivolgiti al desk del Museo
     oppure, se ti trovi nel parco, chiama il numero +39 3351017368`
  ],
  unlockInstructions : `"M" come MUBIA`,
  unlockInstructionsCaption : `Durante la visita, se devi usare l'app, sbloccala con questa sequenza`,
  codeInputInstruction : 'Inserisci il codice che trovi sul pannello',
  invalidAudioCode : 'Codice non valido. Inserisci il codice di 3 caratteri che trovi sul pannello',
  alreadyPayingAudio : 'Un altro contenuto audio è in riproduzione',
  alreadyVisitedSpot : [
    `SPOT GIÀ VISITATO`,
    `Sei già passato di qui. Premi play sull'applicazione per riascoltare il contenuto`,
  ],
  loadingAudio : 'Caricamento dei contenuti in corso',
  faqTitle: 'Domande frequenti',
  faqs : [
    {
      title : 'Perché non sento audio dalle cuffie?',
      text  : `
        Indossa le cuffie e premi il tasto qui sotto per riprodurre un suono di test.
        <button id="test-sound-button" type="button" name="test-sound" style="display:block;"class="large-button dark-button my-4">TEST</button>

        <b class="mb-4">Se senti audio passa alle domande successive.</b>
        <br>
        Se non senti nulla possono esserci tre motivi:
        <ol class="my-4">
        <li>il volume del telefono è al minimo</li>
        <li>le cuffie sono spente</li>
        <li>le cuffie sono accese ma non sono connesse al telefono</li>
        </ol>
        Verifica innanzitutto il volume, utilizzando i tasti sulla destra del telefono.
        Verifica poi che le cuffie siano accese premendo brevemente il pulsante sotto
        l’orecchio sinistro: se la voce annuncia il livello di carica della batteria,
        le cuffie sono accese. Se così non fosse, tieni premuto il pulsante di accensione,
        sotto l'auricolare destro, per accendere le cuffie. Come ultimo passaggio
        verifica che il bluetooth sul telefono sia acceso: apri il menu a tendina
        di Android, scorrendo con il dito verso il basso dalla parte superiore
        dello schermo. A questo punto tieni premuto sul simbolo del bluetooth per
        verificare lo stato di accensione e connessione. Se necessario ritenta
        l'accoppiamento con la cuffia in tuo possesso.
        Se non sei riuscito a risolvere il problema rivolgiti al desk del Museo
        oppure, se ti trovi nel parco, chiama il numero <b>+39 3351017368</b>.
        `
    },
    {
      title : 'Cosa faccio se arrivo ad uno spot e non parte il contenuto?',
      text  : `Il tuo segnale GPS potrebbe non essere sufficientemente preciso
      per garantire la riproduzione automatica. Se in prossimità dei pannelli
      nessun contenuto viene riprodotto, inserisci il codice di tre caratteri
      scritto sul pannello nell'applicazione per avviare l'audio manualmente.`
    },
    {
      title : 'Dove trovo il codice da inserire?',
      text  : 'Ad ogni spot troverai un pannello in legno, con il simbolo di un altoparlante. Sotto questo simbolo troverai un codice di 3 caratteri. Se il contenuto audio non parte automaticamente, potrai utilizzare questo codice per riprodurlo manualmente. Entra nella sezione HELP (?) dell’applicazione, inserisci il codice e premi su CONFERMA.'
    },
    {
      title : 'Perchè non riesco a cambiare lingua?',
      text  : 'Puoi selezionare una lingua diversa solamente se hai a disposizione una connessione internet.'
    },
    {
      title : 'Come funziona questa applicazione?',
      text  : `Questa applicazione si basa sull’utilizzo del GPS. Utilizziamo
      la tua posizione per riprodurre automaticamente i contenuti sonori una
      volta raggiunti i punti di interesse segnalati da appositi pannelli in
      legno lungo il percorso. Il GPS ha una precisione variabile e talvolta
      il segnale può non essere disponibile, per questo abbiamo aggiunto il
      codice di sicurezza per consentirti di ascoltare i contenuti in ogni caso.
      La connessione bluetooth e le cuffie a conduzione ossea garantiscono
      un’esperienza in piena armonia con l’ambiente circostante.`
    },
    {
      title : 'Chi è Mezzo Forte?',
      text  : `Mezzo Forte è una realtà specializzata nella progettazione di
      esperienze basate su contenuti audio di alta qualità, realtà acustica
      aumentata ed installazioni interattive basate sull’audio. Nasce nel 2019
      da un team di ricercatori, sound designer, sviluppatori, esperti nel campo
      nell’elaborazione del suono.
      Scopri di più sul sito <b>www.mezzoforte.design</b>`
    },
  ],
  audioTitles: {
    '1IN': 'Introduzione',
    '2BS': 'La Centrale',
    '3SC': 'La Sorgente di Chiorba',
    '4LA': 'Lagone',
    '5SO': 'Soffione',
    '6AF': 'La Sorgente di Acqua Forte',
    '7BA': 'Prima Biancana',
    '8AT': 'Anfiteatro',
    '9IV': 'La flora del Parco',
    '0RD': 'Panchina',
    '1PG': 'Sogno dei geologi',
    '2BV': 'Il Belvedere'
  },
  walkInstruction: 'Prosegui lungo il percorso e scopri la prossima esperienza sonora'
};
