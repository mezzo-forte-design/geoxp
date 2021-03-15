export const example = `
<h1>Hello {{name}}</h1>
`;

export const desktopBlock = `
<div class="overlay d-flex flex-column text-center align-items-center justify-content-center" style="background:#f8f7f4">
  <h1>Questa applicazione è progettata per dispositivi mobili</h1>
  <img src="/img/logo_comp.png" alt="Mezzo Forte" style="width:350px;">
  <a class="mf-link" href="https://mezzoforte.design">mezzo forte</a>
</div>
`

export const notSupported = `
<div class="overlay d-flex flex-column text-center align-items-center justify-content-center" style="background:#f8f7f4">
  <h1>Questo dispositvo non supporta l'applicazione</h1>
  <img src="/img/logo_comp.png" alt="Mezzo Forte" style="width:350px;">
  <a class="mf-link" href="https://mezzoforte.design">mezzo forte</a>
</div>
`

export const blackFloatingOverlay = `
<div id="intro-floating-overlay" class="floating-overlay flex-column align-items-center justify-content-center px-3 bg-dark">
</div>
`;

export const languageSelect = `
<div id="lang-select-container" class="intro-content text-center align-items-center w-100">
  <div class="intro-step justify-content-end">
    <span><b>1</b>/4</span>
  </div>
  <label for="lang-select">
    <h3>Select your language</h3>
  </label>
  <select id="lang-select" name="lang-select" class="mt-5 {{#offline}}disabled{{/offline}}">
    <option value="it" {{#it}} selected {{/it}}> Italiano </option>
    <option value="en" {{#en}} selected {{/en}}> English  </option>
    <option value="fr" {{#fr}} selected {{/fr}}> Français </option>
    <option value="es" {{#es}} selected {{/es}}> Español  </option>
    <option value="de" {{#de}} selected {{/de}}> Deutsch  </option>
  </select>
  {{#offline}} <p class="mt-4">{{offlineLangAlert}}</p>{{/offline}}
  <button id="confirm-language" type="button" name="confirm" class="intro-button mt-5">{{confirmButton}}</button>
  <span id="app-version">v{{version}}</span>
</div>
`;

export const headphonesInstructions = `
<div id="headphones-instruction-container" class="intro-content text-center align-items-center w-100">
  <div class="intro-step">
    <img id="back-arrow-headphones" class="clickable" src="/img/back_arrow.svg" alt="Back">
    <span><b>2</b>/4</span>
  </div>
  <img src="/img/headphones.svg" alt="Headphones">
  <h4 class="mt-4">{{instruction}}</h4>
  <button id="confirm-headphones" type="button" name="confirm" class="intro-button mt-5">{{confirmButton}}</button>
</div>
`;

export const testAudio = `
<div id="test-audio-container" class="intro-content text-center align-items-center w-100">
  <div class="intro-step">
    <img id="back-arrow-audio" class="clickable" src="/img/back_arrow.svg" alt="Back">
    <span><b>3</b>/4</span>
  </div>
  <img src="/img/smartphone.svg" alt="Smartphone">
  <p class="mt-4"><b>{{instruction}}</b></p>
  <h4>{{instruction_caption}}</h4>
  <button id="confirm-audio" type="button" name="confirm" class="intro-button mt-4">{{confirmAudioButton}}</button>
  <button id="dismiss-audio" type="button" name="confirm" class="intro-button dark mt-2">{{dismissAudioButton}}</button>
</div>
`;

export const unlockInstructions = `
<div id="unlock-instruction-container" class="intro-content text-center align-items-center w-100">
  <div class="intro-step">
    <img id="back-arrow-unlock" class="clickable" src="/img/back_arrow.svg" alt="Back">
    <span><b>4</b>/4</span>
  </div>
  <h4 style="margin-top: 4rem;">{{instruction}}</h4>
  <p class="m-0">{{instruction_caption}}</p>
  <video id="unlock-video" src="/video/unlock.mp4" autoplay loop playsinline></video>
  <button id="confirm-unlock" type="button" name="confirm" class="intro-button">{{continueButton}}</button>
</div>
`;

export const codeInput = `
<div class="pt-4 px-4">
  <img src="/img/soundwave.svg" alt="Sound">
  <h3 class="pt-2 color-dark">{{instruction}}</h3>
  <div id="code-input" class="pt-2">
    {{#inputs}}
      <input type="text" maxlength="1" />
    {{/inputs}}
  </div>
</div>
`;

export const FAQ = `
<h4 class="pt-5 px-4 color-dark">{{title}}</h4>
<div id="faq-accordion">
  {{#faqs}}
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <button class="btn collapsed" data-toggle="collapse" data-target="#faq-{{idx}}" aria-controls="collapseOne">
            {{title}}
          </button>
        </h5>
      </div>

      <div id="faq-{{idx}}" class="collapse" data-parent="#faq-accordion">
        <div class="card-body">
          {{{text}}}
        </div>
      </div>
    </div>
  {{/faqs}}

</div>
`;

export const map = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 375 518">
  <defs>
    <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 512 129">
      <image width="512" height="129" xlink:href="data:image/png;base64,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" />
    </pattern>
    <clipPath id="clip-mezzoforte-mubia-mappa">
      <rect width="375" height="518" />
    </clipPath>
  </defs>
  <g id="mezzoforte-mubia-mappa" clip-path="url(#clip-mezzoforte-mubia-mappa)">
    <rect width="375" height="518" fill="transparent" />
    <rect id="Rectangle_2011" data-name="Rectangle 2011" width="377" height="519" fill="#A5A093" opacity="1" />
    <path id="Path_3691" data-name="Path 3691" d="M6897.959,358.046s1.321-13.212,5.285-14.093,6.605-1.762,6.605-5.285-16.295-27.3-15.854-30.387-6.166-18.5-5.725-20.7,13.212-17.616,14.092-20.258,3.083-9.689,7.928-7.927,5.725,7.046,9.688,5.285-8.367-9.689-6.606-12.331,15.854-14.973,18.937-20.7,14.092-20.7,15.414-25.543,2.2-11.01,6.606-16.735a192.962,192.962,0,0,0,13.652-19.818c4.4-7.487,17.175-17.616,18.5-19.377s6.166-9.689,9.249-8.368,7.487,13.212,7.927,19.818,2.2,11.45,2.2,13.212-3.083,6.166-1.321,7.927,7.487,2.2,7.927,6.606-5.285,15.414-3.523,22.9,1.762,12.331,3.523,14.973,5.725,5.285,5.285,9.248-1.762,8.368-3.964,9.248-9.249-2.642-12.772,0-7.486,0-10.129,3.523-3.083,7.046-1.321,12.331,3.524,8.368,3.083,11.01-4.844,8.367-4.4,12.771-2.2,9.689-3.963,11.01,17.175,2.2,19.377,4.4,9.689,8.368,9.689,13.652.88,25.1-7.047,28.626-11.01,12.771-18.5,11.45-21.58-2.642-32.149-4.4-14.533-4.844-21.139-2.642-11.01,3.523-11.451,3.964,1.762-6.606-2.642-4.4-18.057,9.689-22.46,11.01-17.616,4.844-21.139,7.046-10.129,12.771-14.533,12.771-5.726-3.523-8.808-2.642-9.249,5.725-10.57,2.2,2.2-7.046,4.4-7.927,5.284-2.642-.441-4.4-12.331-11.01-12.771-12.771c-.361-1.445-.723-3.78-.84-4.571a.03.03,0,0,0-.06,0c-.1,1.309-.578,6.875-1.742,7.652-1.321.881-7.046,3.083-7.927,6.606s-1.761,18.056-3.523,23.781-4.4,17.616-2.642,20.258,9.248,12.772,10.569,18.056,1.321,11.891-.44,15.854-9.249,8.368-17.616,8.368-8.809-1.321-13.653.44-7.487,5.285-6.605,8.367,5.284,7.046-.44,10.129-29.088,29.022-27.3,32.589c2.2,4.4,30.828-18.5,36.993-13.652s3.083,11.45,0,18.5-11.01,23.341-10.129,29.506,14.974,11.01,16.735,14.533,2.643,10.129,7.927,12.331,15.854-1.321,21.139,4.844-1.321,21.579-14.974,23.781-25.1,1.762-31.268,3.523-9.249,5.725-3.083,13.212,2.642,13.652,4.4,14.973"
      transform="translate(-6716.781 -128.664)" fill="none" stroke="#dbd7d0" stroke-miterlimit="10" stroke-width="2" />
    <rect id="mubia" width="40" height="10" transform="translate(130 404)" opacity="0.4" fill="url(#pattern)" />
    <rect id="Rectangle_2024" data-name="Rectangle 2024" width="27" height="16" transform="matrix(0.899, -0.438, 0.438, 0.899, 92.859, 415.728)" fill="#121212" opacity="0.4" />
    <g id="Group_2424" data-name="Group 2424" transform="translate(-121 -43)">
      <g id="Group_2351" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_1IN" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2421" data-name="Group 2421" transform="translate(-160 -27)">
      <g id="Group_2351-2" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_2BS" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-2" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-2" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-2" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-2" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2489" data-name="Group 2489" transform="translate(-140 -55)">
      <g id="Group_2351-12" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_3SC" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212"/>
        <g id="Group_2316-12" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-12" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z" transform="translate(-2301.285 -2181.458)" fill="#a5a093"/>
          <path id="Path_948-12" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)" fill="#a5a093"/>
          <path id="Path_949-12" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)" fill="#a5a093"/>
        </g>
      </g>
    </g>
    <g id="Group_2425" data-name="Group 2425" transform="translate(-127 -78)">
      <g id="Group_2351-3" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_4LA" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-3" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-3" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-3" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-3" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2414" data-name="Group 2414" transform="translate(-90 -97)">
      <g id="Group_2351-4" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_5SO" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-4" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-4" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-4" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-4" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2415" data-name="Group 2415" transform="translate(-89 -178)">
      <g id="Group_2351-5" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_6AF" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-5" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-5" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-5" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-5" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2408" data-name="Group 2408" transform="translate(-46 -158)">
      <g id="Group_2351-6" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_7BA" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-6" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-6" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-6" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-6" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2409" data-name="Group 2409" transform="translate(24 -187)">
      <g id="Group_2351-7" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_8AT" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-7" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-7" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-7" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-7" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2416" data-name="Group 2416" transform="translate(-8 -262)">
      <g id="Group_2351-8" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_9IV" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-8" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-8" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-8" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-8" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2428" data-name="Group 2428" transform="translate(65 -379)">
      <g id="Group_2351-9" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_0RD" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-9" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-9" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-9" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-9" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2427" data-name="Group 2427" transform="translate(89 -351)">
      <g id="Group_2351-10" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_1PG" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-10" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-10" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-10" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-10" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <g id="Group_2412" data-name="Group 2412" transform="translate(65 -171)">
      <g id="Group_2351-11" data-name="Group 2351" transform="translate(196 392)">
        <circle id="ellipse_2BV" data-name="Ellipse 485" cx="8" cy="8" r="8" fill="#121212" />
        <g id="Group_2316-11" data-name="Group 2316" transform="translate(5.215 3.067)">
          <path id="Path_947-11" data-name="Path 947" d="M2301.389,2184.073a.273.273,0,0,0-.045.383,3.209,3.209,0,0,1,0,3.89.273.273,0,0,0,.045.383.269.269,0,0,0,.169.059.273.273,0,0,0,.214-.1,3.77,3.77,0,0,0,0-4.567A.273.273,0,0,0,2301.389,2184.073Z"
            transform="translate(-2301.285 -2181.458)" fill="#a5a093" />
          <path id="Path_948-11" data-name="Path 948" d="M2342.263,2164.067a.273.273,0,0,0-.061.381,5.107,5.107,0,0,1,0,5.875.272.272,0,0,0,.441.32,5.747,5.747,0,0,0,0-6.515A.273.273,0,0,0,2342.263,2164.067Z" transform="translate(-2340.142 -2162.442)"
            fill="#a5a093" />
          <path id="Path_949-11" data-name="Path 949" d="M2379.078,2132.051a.272.272,0,0,0-.064.38c.032.045,3.17,4.565,0,9.026a.273.273,0,1,0,.444.316c3.392-4.773.034-9.609,0-9.657A.272.272,0,0,0,2379.078,2132.051Z" transform="translate(-2375.145 -2132)"
            fill="#a5a093" />
        </g>
      </g>
    </g>
    <text id="Percorso_geotermico_Le_Biancane_" data-name="Percorso geotermico
&quot;Le Biancane&quot;" transform="translate(116 463)" fill="#7c7a74" font-size="12" font-family="MessinaSans-Bold, Messina Sans" font-weight="700">
      <tspan x="0" y="13">Percorso geotermico</tspan>
      <tspan x="0" y="31">&quot;Le Biancane&quot;</tspan>
    </text>
  </g>
</svg>
`;


export const headerFloatingBox = `
<div class="header-floating-box">
  <div class="d-flex">
    <img src="/img/walk.svg" alt="walk" style="width:40px;align-self:baseline;" class="mr-1">
    <h5 class="mb-0">{{instruction}}</h5>
  </div>
</div>
`;

export const interactivePlayer = `
<div class="header-floating-box">
  <div class="text-left mb-4">
    <img src="/img/soundwave-main.svg" alt="sound" width="40px;" class="mr-2">
    <h2 class="m-0">{{audioTitle}}</h2>
  </div>

  <div class="w-100 d-flex align-items-center justify-content-around">

    <div class="d-flex flex-column align-items-center justify-content-center">
      <div class="skip-button backward" data-skip="-10"></div>
      <span class="color-main" style="font-size:14px;font-family:monospace;">10 s</span>
    </div>

    <div id="interactive-player-container">
      <div class="progress-circle w-100"></div>
      <div class="play-pause-button {{#playing}}playing{{/playing}}"></div>
    </div>

    <div class="d-flex flex-column align-items-center justify-content-center">
      <div class="skip-button forward" data-skip="10"></div>
      <span class="color-main" style="font-size:14px;font-family:monospace;">10 s</span>
    </div>

  </div>

  <span id="progress-timer" class="mt-3"></span>
  `;
