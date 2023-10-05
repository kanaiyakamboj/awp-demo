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
</div>`;
}

function setPanelsAsPerConfigs(panelsConfig = {}) {
  const { panelsGroups, panelId } = panelsConfig;

  const panelName = document.getElementById(panelId);

  if (panelName) {
    let panelGroups = "";

    panelsGroups.forEach(({ panelTtileText, panelGroupId }) => {
      const template = renderPanelTemplates(panelTtileText, panelGroupId);
      panelGroups += template;
    });

    panelName.innerHTML = panelGroups;
  }
}
