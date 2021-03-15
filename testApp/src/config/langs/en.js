exports.en = {
  startButton : 'START',
  lockButton  : 'LOCK',
  confirmButton : 'CONFIRM',
  continueButton: 'CONTINUE',
  map : 'MAP',
  code : 'CODE',
  offlineLangAlert : 'Your phone is offline. It is not possible to change language',
  loadingLanguage : 'ENG',
  headphonesInstructions : 'Wear the supplied headphones to hear the sound correctly',
  audioTestInstructions : 'Increase the the volume of the smartphone',
  audioTestCaption : `Are you hearing the sound correctly?`,
  confirmAudioButton : `Yes, continue`,
  dismissAudioButton : `No, ask for assistance`,
  helpAudioMessage: [
    `NO AUDIO?`,
    `Check the volume level using the buttons on the right side of the phone.
    Check that the headset is turned on and that the Bluetooth connection is active.
    If you cannot solve the problem, please contact the Museum desk or,
    if you're in the park, call +39 3351017368
    `
  ],
  unlockInstructions: '"M" like MUBIA',
  unlockInstructionsCaption: 'During your visit, use this pattern to unlock the app if you need it',
  codeInputInstruction : 'Enter the code written on the panel',
  invalidAudioCode : 'Invalid code. Enter the 3-character code written on the panel',
  alreadyPayingAudio: 'Another audio content is playing',
  alreadyVisitedSpot : [
    `SPOT ALREADY VISITED`,
    `You've been here before. Press play on the application to listen to the content again.`,
  ],
  loadingAudio : 'Content loading',
  faqTitle: 'Frequently Asked Questions',
  faqs : [
    {
      title : `Why can't I hear sound from the headphones?`,
      text  : `
        Put on the headphones and press the button below to play a test sound and check its correct operation.
        <button id="test-sound-button" type="button" name="test-sound" style="display:block;"class="large-button dark-button my-4">TEST</button>

        <b class="mb-4">If you hear the test sound, switch to the next question.</b>
        <br>
        If you don't hear anything there can be three reasons:
        <ol class="my-4">
        <li>the phone volume is at minimum</li>
        <li>the headset is off</li>
        <li>the headset is on but not connected to the p</li>
        </ol>
        First check the volume using the buttons on the right side of the phone.
        Then check that the headset is on by briefly pressing the power button
        under your right ear: if the voice announces the battery charge level,
        the headset is on. If not, press and hold the same button to turn the
        headset on. As a final step, check that the Bluetooth on your phone is
        turned on: open the Android drop-down menu by sliding your finger down
        from the top of the screen. Now press and hold the bluetooth symbol to
        check the power and connection status. If necessary, try pairing with
        your headset again.
        If you are not able to solve the problem, please contact the Museum
        desk or, if you are in the park, call + <b>+39 3351017368</b>.
        `
    },
    {
      title : 'What do I do if I reach a spot and the content does not start?',
      text  : `Your GPS signal may not be accurate enough to ensure automatic playback. If no content is played near the panels, enter the three-character code written on the panel in the application to start the audio manually.`
    },
    {
      title : 'Where do I find the code?',
      text  : `At each spot you'll find a wooden panel with a speaker symbol. Under this symbol you will find a 3-character code. If the audio content does not start automatically, you can use this code to play it manually. Enter the HELP (?) section of the application, enter the code and press CONFIRM.`
    },
    {
      title : `Why can't I change language?`,
      text  : 'You can only select a different language if you have an internet connection.'
    },
    {
      title : 'How does this application work?',
      text  : `This application is based on the use of GPS. We use your location
      to automatically reproduce the sound content once you reach the points of
      interest marked by special wooden panels along the way. The GPS has a
      variable accuracy and sometimes the signal may not be available, so we
      have added the security code to allow you to listen to the contents in any case.
      The Bluetooth connection and the bone conduction headset guarantee an
      experience in full harmony with the surrounding environment.`
    },
    {
      title : `Who's Mezzo Forte?`,
      text  : `Mezzo Forte is specialized in designing experiences based on high
      quality audio content, augmented acoustic reality and interactive audio-based
      installations. It was founded in 2019 by a team of researchers,
      sound designers, developers, experts in the field of sound processing.
      Find out more on our website <b>www.mezzoforte.design</b>`
    },
  ],
  audioTitles: {
    '1IN': 'Introduction',
    '2BS': 'Biancane in History',
    '3SC': 'Chiorba Source',
    '4LA': 'The Natural Lagone',
    '5SO': 'The Soffione',
    '6AF': 'Acqua Forte Source',
    '7BA': 'The Biancana',
    '8AT': 'The Amphitheater',
    '9IV': 'A vegetational island',
    '0RD': 'The Devil’s anger',
    '1PG': `The geologists' paradise`,
    '2BV': 'The Belvedere'
  },
  walkInstruction: 'Continue along the route and discover the next sound experience'
};
