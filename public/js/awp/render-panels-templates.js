function renderPanelTemplates(panelTtileText, panelGroupId) {
  return `<div class="MyCard mb-30">
    <div class="toggle-card active">
    <div class="toggle-card-header">
        <h3 class="faq-title">${panelTtileText}</h3>
        <div class="filter-btns">
            <button class="collpase-btn" onclick="onClickCollpaseButton(event)">
                <img src="assets/arrow-up-icon.svg" alt="">                            
            </button>
            <button class="FilterModalBtn" onclick="onClickFilterPopup('${panelGroupId}')">
                <img src="assets/filter-icon.svg" alt="">                                                                            
            </button>
        </div>
    </div>
    <div class="toggle-card-body" id="${panelGroupId}">
    </div>
</div>
${panelGroupId === "workpackSelection" ? renderButtons() : ""}
</div>`;
}

function renderButtons() {
  return `<!--<button id="playPauseButton" onclick="window.toggleStep()" class="MyBtn OrangeBtn"> Play </button>-->
<!--  <button id="snapFreeButton" onclick="window.toggleSnap()" class="MyBtn OrangeBtn"> Snap </button>-->
<!--  <button id="cameraButton" onclick="window.toggleCam()" class="MyBtn OrangeBtn"> Top </button>-->
  `;
}

function setPanelsAsPerConfigs(panelsConfigArray) {
  panelsConfigArray.forEach((panelsConfig) => {
    const { panelsGroups, panelId } = panelsConfig;

    //const possiblePanelGropus=getAllPosiblePanelGoupps();

    const panelName = document.getElementById(panelId);

    if (panelName) {
      let panelGroups = "";

      panelsGroups.forEach(({ panelTtileText, panelGroupId }) => {
        const template = renderPanelTemplates(panelTtileText, panelGroupId);
        panelGroups += template;
      });

      panelName.innerHTML = panelGroups;
    }
  });
}

function bindProjectMap() {
  const projectMapDiv = document.getElementById("projectMap");
  if (projectMapDiv) {
    projectMapDiv.innerHTML = `<div class="map">
    <div id="first-panel-content-right-menu" class="map">
      <canvas id="project-map-canvas"></canvas>
    </div>
  </div>`;
  }
}

function bindProjectSelectionSection() {
  const workpackSelectionDiv = document.getElementById("workpackSelection");
  if (workpackSelectionDiv) {
    workpackSelectionDiv.innerHTML = `   
    <div class="MyInputField">
    <label for="">Locations</label>
    <select
      onchange="onMonopileDropdownChange(event)"
      name="sheet-names"
      id="sheet-names"
      class="MySelect"
    >
      <option value="">--Select option--</option>
    </select>
  </div>
    <div class="MyInputField">
    <label for="">Transport Vessel</label>
    <select
      onchange="onHtvDropdownChange(event)"
      id="file-names"
      name="htv-names"
      class="MySelect"
    >
      <option value="">--Select option--</option>
    </select>
  </div>`;
  }
}
