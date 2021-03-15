exports.de = {
  startButton : 'START',
  lockButton  : 'DISPLAYSPERRE',
  confirmButton : 'BESTÄTIGUNG',
  continueButton: 'WEITER',
  map : 'MAP',
  code : 'CODE',
  offlineLangAlert : "Ihr Handy ist offline. Es ist nicht möglich, die Spracheinstellung zu ändern",
  loadingLanguage : 'DEU',
  headphonesInstructions : `Tragen Sie das mitgelieferte Headset, um den Ton richtig zu hören`,
  audioTestInstructions : 'Erhöhen Sie die Lautstärke des Smartphones',
  audioTestCaption : `Hören Sie den Ton richtig?`,
  confirmAudioButton : `Ja, weiter`,
  dismissAudioButton : `Nein, um Unterstützung bitten`,
  helpAudioMessage: [
    `KÖNNEN SIE KEINEN TON HÖREN?`,
    `Überprüfen Sie den Lautstärkepegel mit den Tasten auf der rechten Seite des Telefons.
     Überprüfen Sie, ob das Headset eingeschaltet und die Bluetooth-Verbindung aktiv ist.
     Wenn Sie das Problem nicht lösen können, wenden Sie sich bitte an den Museumsschalter.
     Oder, wenn Sie im Park sind, rufen Sie +39 3351017368 an`
  ],
  unlockInstructions: '"M" wie MUBIA',
  unlockInstructionsCaption: 'Verwenden Sie dieses Muster während Ihres Besuchs, um die App bei Bedarf freizuschalten',
  codeInputInstruction : 'Geben Sie den Code ein, den Sie auf der Tafel finden',
  invalidAudioCode : 'Ungültiger Code. Geben Sie den dreistelligen Code ein, der sich auf der Tafel befindet',
  alreadyPayingAudio : 'Ein weiterer Audio-Inhalt wird abgespielt',
  alreadyVisitedSpot : [
    `BEREITS BESUCHTER STANDORT`,
    `Du warst schon mal hier. Drücken Sie die Wiedergabetaste auf der Anwendung, um den Inhalt erneut anzuhören`,
  ],
  loadingAudio : 'Inhalt wird hochgeladen',
  faqTitle: 'Häufig gestellte Fragen',
  faqs : [
    {
      title : 'Warum höre ich keinen Ton über die Kopfhörer?',
      text  : `
        Setzen Sie das Headset auf und drücken Sie den Knopf unten, um einen Testton abzuspielen und ihre Funktion zu überprüfen.
        <button id="test-sound-button" type="button" name="test-sound" style="display:block;"class="large-button dark-button my-4">TEST</button>

        <b class="mb-4">Wenn Sie den Ton hören, gehen Sie zur nächsten Frage über.</b>
        <br>
        Wenn Sie er nichts hören, kann das drei Gründe haben:
        <ol class="my-4">
        <li>die Telefonlautstärke ist auf Minimum</li>
        <li>das Headset ist ausgeschaltet</li>
        <li>das Headset ist eingeschaltet, aber nicht mit dem Smartphone verbunden</li>
        </ol>
        Überprüfen Sie zunächst die Lautstärke mit den Tasten auf der rechten
        Seite des Smartphones. Prüfen Sie dann, ob das Headset eingeschaltet ist,
        indem Sie die Netztaste unter Ihrem rechten Ohrhörer kurz gedrückt halten:
        Wenn die Stimme den Ladezustand der Batterie ansagt, ist das Headset
        eingeschaltet. Falls nicht, drücken und halten Sie die gleiche aste unter
        dem rechten Ohrhörer, um das Headset einzuschalten. Vergewissern Sie sich
        abschließend, dass Bluetooth auf Ihrem Telefon eingeschaltet ist: Öffnen
        Sie das Android-Dropdown-Menü, indem Sie Ihren Finger vom oberen
        Bildschirmrand nach unten bewegen. Halten Sie nun das Bluetooth-Symbol
        gedrückt, um den Strom- und Verbindungsstatus zu überprüfen. Versuchen
        Sie ggf. erneut eine Kopplung mit Ihrem Headset.
        Wenn Sie das Problem nicht lösen können, wenden Sie sich bitte an den
        Museumsschalter oder, wenn Sie sich im Park befinden, rufen Sie die
        Nummer <b>+39 3351017368</b> an.
        `
    },
    {
      title : 'Was tue ich, wenn ich einen Anziehungspunkt erreiche und der Inhalt nicht startet?',
      text  : `Ihr GPS-Signal ist möglicherweise nicht genau genug, um eine automatische Wiedergabe zu gewährleisten. Wenn in der Nähe der Tafeln kein Inhalt abgespielt wird, geben Sie den dreistelligen Code, der auf der Tafel steht, in der Anwendung ein, um das Audio manuell zu starten.`
    },
    {
      title : 'Wo finde ich den Code zur Eingabe?',
      text  : 'An jedem Standort finden Sie eine Holztafel mit einem Lautsprechersymbol. Unter diesem Symbol finden Sie einen 3-stelligen Code. Wenn der Audioinhalt nicht automatisch startet, können Sie diesen Code verwenden, um ihn manuell abzuspielen. Verwenden Sie den HILFE (?) Abschnitt der Anwendung, geben Sie den Code ein und drücken Sie BESTÄTIGEN.'
    },
    {
      title : 'Warum kann ich die Sprache nicht wechseln?',
      text  : 'Sie können nur dann eine andere Sprache wählen, wenn Sie über eine Internetverbindung verfügen.'
    },
    {
      title : 'Wie funktioniert diese Anwendung?',
      text  : `Diese Anwendung basiert auf der Verwendung von GPS. Wir nutzen
      Ihren Standort, um den Toninhalt automatisch wiederzugeben, sobald Sie die
      mit speziellen Holztafeln markierten Sehenswürdigkeiten auf dem Weg erreichen.
      Da das GPS eine variable Genauigkeit hat und das Signal manchmal nicht
      verfügbar ist, haben wir den Sicherheitscode hinzugefügt, damit Sie die
      Inhalte in jedem Fall anhören können. Die Bluetooth-Verbindung und das
      Knochenleitungs-Headset garantieren ein Erlebnis in völliger Harmonie mit der Umgebung.`
    },
    {
      title : 'Wer ist  Mezzo Forte?',
      text  : `Mezzo Forte ist auf die Gestaltung von Erlebnissen spezialisiert,
      die auf qualitativ hochwertigen Audioinhalten, akustischer erweiterter
      Realität und interaktiven audio-basierten Installationen basieren. Sie
      wurde im Jahr 2019 von einem Team von Forschern, Sounddesignern, Entwicklern
      und Experten auf dem Gebiet der Tonverarbeitung gegründet.
      Erfahren Sie mehr unter <b>www.mezzoforte.design</b>`
    }
  ],
  audioTitles: {
    '1IN': 'Einführung',
    '2BS': 'Biancane in der Geschichte',
    '3SC': 'Die Quelle von Chiorba',
    '4LA': 'Natürlicher Lagone',
    '5SO': 'Der Soffione',
    '6AF': 'Die Quelle von Acqua Forte',
    '7BA': 'Die Biancana',
    '8AT': 'Das Amphitheater',
    '9IV': 'Eine Vegetationsinsel',
    '0RD': 'Der Zorndes Teufels',
    '1PG': 'Ein Paradies für die Geologen',
    '2BV': 'Das Belvedere'
  },
  walkInstruction: 'Setzen Sie den Rundgang fort und entdecken Sie das nächste Klangerlebnis'
};
