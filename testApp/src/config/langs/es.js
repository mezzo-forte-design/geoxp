exports.es = {
  startButton : 'COMIENZO',
  lockButton  : 'BLOQUEA',
  confirmButton : 'CONFIRMAR',
  continueButton: 'CONTINUAR',
  map : 'MAPA',
  code : 'CODIGO',
  offlineLangAlert : "Tu teléfono está desconectado. No es posible cambiar de idioma.",
  loadingLanguage : 'ESP',
  headphonesInstructions : `Usa los auriculares suministrados para escuchar el sonido correctamente.`,
  audioTestInstructions : 'Aumenta el volumen del teléfono.',
  audioTestCaption : `¿Estás escuchando el audio correctamente?`,
  confirmAudioButton : `Sí, continúe`,
  dismissAudioButton : `No, pide ayuda`,
  helpAudioMessage: [
    `¿NO PUEDES OÍR EL AUDIO?`,
    `Comprueba el nivel del volumen con las teclas del lado derecho del teléfono.
    Comprueba que el auricular está encendido y que la conexión Bluetooth está activa.
    Si el problema no se resuelve, por favor contacta con el mostrador del Museo.
    o, si estás en el parque, llama al +39 3351017368.`
  ],
  unlockInstructions: '"M" como MUBIA',
  unlockInstructionsCaption: 'Durante su visita, use este patrón para desbloquear la aplicación si lo necesita',
  codeInputInstruction : 'Introduce el código que encuentras en el panel',
  invalidAudioCode : 'Código inválido. Introduce el código de 3 caracteres que se encuentra en el panel',
  alreadyPayingAudio : 'Otro contenido de audio se está reproduciendo',
  alreadyVisitedSpot : [
    `LUGAR YA VISITADO`,
    `Ya has estado aquí antes. Pulsa play en la aplicación para escuchar el contenido de nuevo.`,
  ],
  loadingAudio : 'Subiendo el contenido actual',
  faqTitle: 'Preguntas frecuentes',
  faqs : [
    {
      title : '¿Por qué no puedo oír el sonido de los auriculares?',
      text  : `
        Ponte los auriculares y pulsa el botón de abajo para reproducir un sonido de prueba y comprobar su funcionamiento.
        <button id="test-sound-button" type="button" name="test-sound" style="display:block;"class="large-button dark-button my-4">TEST</button>

        <b class="mb-4">Si escuchas el audio, cambia a la siguiente pregunta.</b>
        <br>
        Si no oyes nada puede haber tres razones:
        <ol class="my-4">
        <li>el volumen del teléfono está al mínimo</li>
        <li>el auricular está apagado</li>
        <li>el auricular está encendido pero no está conectado al teléfono</li>
        </ol>
        Primero comprueba el volumen con los botones del lado derecho del teléfono.
        Luego comprueba que el auricular está encendido presionando brevemente
        el botón de encendido debajo del auricular derecho: si la voz anuncia
        el nivel de carga de la batería, el auricular está encendido. Si no,
        mantenga pulsado el mismo botón para encender el auricular. Como último paso,
        comprueba que el Bluetooth de tu teléfono esté activado: abre el menú
        desplegable de Android deslizando el dedo hacia abajo desde la parte
        superior de la pantalla. Ahora mantén pulsado el símbolo del bluetooth
        para comprobar el estado de la alimentación y la conexión. Si es necesario,
        intenta emparejarlo con sus auriculares de nuevo.
        Si no ha podido resolver el problema, póngase en contacto con el
        mostrador del Museo o, si está en el parque, llame al <b>+39 3351017368</b>.`
    },
    {
      title : '¿Qué hago si llego a un punto y el contenido no comienza?',
      text  : `Es posible que la señal del GPS no sea lo suficientemente precisa como para asegurar la reproducción automática. Si no se reproduce ningún contenido cerca de los paneles, introduce el código de tres caracteres escrito en el panel de la aplicación para iniciar el audio manualmente.`
    },
    {
      title : '¿Dónde encuentro el código a introducir?',
      text  : 'En cada lugar encontrarás un panel de madera con un símbolo de un altavoz. Bajo este símbolo encontrarás un código de 3 caracteres. Si el contenido de audio no se inicia automáticamente, puedes usar este código para reproducirlo manualmente. Entra en la sección de AYUDA (?) de la aplicación, introduce el código y pulsa CONFIRMAR.'
    },
    {
      title : '¿Por qué no puedo cambiar de idioma?',
      text  : 'Sólo puedes seleccionar un idioma diferente si tienes una conexión a Internet.'
    },
    {
      title : '¿Cómo funciona esta aplicación?',
      text  : `Esta aplicación se basa en el uso del GPS. Utilizamos su
      ubicación para reproducir automáticamente el contenido de sonido una vez
      que llegue a los puntos de interés marcados por paneles de madera especiales
      a lo largo del camino. El GPS tiene una precisión variable y a veces la
      señal puede no estar disponible, por lo que hemos añadido el código de
      seguridad para permitirle escuchar el contenido en cualquier caso.
      La conexión bluetooth y los auriculares de conducción ósea garantizan una
      experiencia en plena armonía con el entorno.`
    },
    {
      title : '¿Quién es Mezzo Forte?',
      text  : `Mezzo Forte está especializado en el diseño de experiencias basadas
      en contenido de audio de alta calidad, realidad acústica aumentada e
      instalaciones interactivas basadas en audio. Fue fundada en 2019 por un
      equipo de investigadores, diseñadores de sonido, desarrolladores, expertos
      en el campo del procesamiento de sonido.
      Encuentra más información en el sitio <b>www.mezzoforte.design</b>`
    },
  ],
  audioTitles: {
    '1IN': 'Introducción',
    '2BS': 'Biancane en la historia',
    '3SC': 'La fuente de Chiorba',
    '4LA': 'El Lagone Natural',
    '5SO': 'I Soffioni',
    '6AF': 'La fuente de Acqua Forte',
    '7BA': 'La Biancana',
    '8AT': 'El anfiteatro',
    '9IV': 'Una isla vegetacional',
    '0RD': 'La ira del diablo',
    '1PG': 'El paraíso de los geólogos',
    '2BV': 'El Belvedere'
  },
  walkInstruction: 'Continúa a lo largo de la ruta y descubre la próxima experiencia sonora.'
};
