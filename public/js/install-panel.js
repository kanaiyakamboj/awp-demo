function bindStepsDataToInstallPage() {
  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );

  if (projectSelectionFilterData) {
    const installationSteps = projectSelectionFilterData?.steps;

    if (installationSteps) {
      bindStepsToPanel(installationSteps);
    }

    const currentStepData = projectSelectionFilterData.currentStepData;

    if (currentStepData) {
      bindDataToAllPanel(currentStepData);
    }
  }
}

function bindStepsToPanel(steps) {
  const stepsWrapperProjectSelection = document.getElementById(
    "installationStepsProjectSelection"
  );

  const stepsWrapperInstallationStepsRightPanel = document.getElementById(
    "installationStepsRightPanel"
  );

  if (stepsWrapperProjectSelection && stepsWrapperInstallationStepsRightPanel) {
    let stepsLi = "";

    steps.forEach((step, i) => {
      const stepFormated = step.replace("_", " ");

      const stepData = getDataByStep(step);

      if (stepData) {
        const stepNotes = stepData["Step_Notes *Notes"];

        stepsLi += `<li data-testid="${step}" onclick="onStepClick('${step}')" class="MyInputBtn steps-buttons ${
          i === 0 ? "active" : ""
        }">
          <span>${stepFormated}</span>
          <button
            class="MyInputBtn StepInstructionBtn"
            onclick="modalPopup('${stepNotes}')">
            <img src="../../assets/info-icon.svg" alt="" />
          </button>
        </li>`;
      }
    });

    if (stepsLi) {
      renderInstallationSteps(stepsLi, [
        stepsWrapperInstallationStepsRightPanel,
        stepsWrapperProjectSelection,
      ]);
    }
  }
}

function modalPopup(stepsInstruction) {
  const stepsContent = document.getElementById("stepsContent");
  if (stepsContent && stepsInstruction) {
    stepsContent.textContent = stepsInstruction;
  }

  const instructionModel = document.getElementById("StepInstructionModalId");
  if (instructionModel) {
    instructionModel.classList.toggle("is-visible");
  }
}

function onStepClick(step) {
  const selectedStepData = getDataByStep(step);

  if (selectedStepData) {
    const panelsData = createPanelsDataToShow(selectedStepData);

    setProjectSelectionFilter({
      currentStep: step,
      currentStepKeyVal: selectedStepData,
      currentStepData: panelsData,
      currentStepDataToForFilterPopup: panelsData,
    });

    bindDataToAllPanel(panelsData);

    let stepElements = document.querySelectorAll(".steps-buttons");
    removeClasses(stepElements, "active");

    let currentStepElements = document.querySelectorAll(
      `[data-testid=${step}]`
    );
    currentStepElements.forEach((currentStepElement) => {
      currentStepElement.classList.add("active");
    });
    if (panelsData) {
      setProjectSelectionFilter({
        currentStep: step,
        currentStepKeyVal: selectedStepData,
        currentStepData: panelsData,
      });

      bindDataToAllPanel(panelsData);

      let stepElements = document.querySelectorAll(".steps-buttons");

      if (stepElements) {
        removeClasses(stepElements, "active");
      }

      let currentStepElements = document.querySelectorAll(
        `[data-testid=${step}]`
      );

      if (currentStepElements) {
        (currentStepElements || []).forEach((currentStepElement) => {
          currentStepElement.classList.add("active");
        });
      }
    }
  }
}

function getDataByStep(step) {
  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );
  let selectedStepData = {};

  if (projectSelectionFilterData) {
    const installationStepsData = projectSelectionFilterData?.stepsData;

    if (installationStepsData) {
      selectedStepData = installationStepsData[step];
    }
  }

  return selectedStepData;
}

function createPanelsDataToShow(selectedStepData) {
  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );

  const panelsDataStructure = {
    engData: { "Monopile Name": projectSelectionFilterData.monopileName },
    sbCrane: {},
    psCrane: {},
  };

  for (let [key, val] of Object.entries(selectedStepData)) {
    if (key.includes("Eng_Data")) {
      const objKey = key.split("*")[1];

      panelsDataStructure["engData"][objKey] = val;
    }
    if (key.includes("HLV_SB_Crane")) {
      const objKey = key.split("*")[1];

      panelsDataStructure["sbCrane"][objKey] = val;
    }
    if (key.includes("HLV_PS_Crane")) {
      const objKey = key.split("*")[1];

      panelsDataStructure["psCrane"][objKey] = val;
    }
  }

  return panelsDataStructure;
}

function renderInstallationSteps(steps, elements) {
  const stepsTemplate = `
    <ul class="progress-steps">
    ${steps}
    </ul>`;

  if (stepsTemplate) {
    (elements || []).forEach((element) => {
      if (element) {
        element.innerHTML = stepsTemplate;
      }
    });
  }
}

function bindDataToAllPanel(panelsData) {
  if (panelsData) {
    const engData = document.getElementById("engData");
    const sbCrane = document.getElementById("sbCrane");
    const psCrane = document.getElementById("psCrane");

    const panelEngData = panelsData.engData;
    const panelSbCraneData = panelsData.sbCrane;
    const panelPsCraneData = panelsData.psCrane;

    if (engData && panelEngData) {
      bindDataToPanels(engData, panelEngData);
    }

    if (sbCrane && panelSbCraneData) {
      bindDataToPanels(sbCrane, panelSbCraneData);
    }
    if (psCrane && panelPsCraneData) {
      bindDataToPanels(psCrane, panelPsCraneData);
    }
  }
}

function bindDataToPanels(panel, panelsData) {
  let panelHtml = "";

  if (panel && panelsData) {
    Object.entries(panelsData).forEach(([title, value]) => {
      panelHtml += `<div class="ValueView">
  <span>${title}</span>
  <h4>${value}</h4>
</div>`;
    });

    panel.innerHTML = panelHtml;
  }
}

function bindAllDataPanelsValuesToPopup(panelGroupId) {
  const modelPopupDataPanelFields = document.getElementById("dataPanelFields");

  if (modelPopupDataPanelFields) {
    const projectSelectionFilterData = JSON.parse(
      localStorage.getItem("projectSelectionFilterData")
    );

    if (projectSelectionFilterData) {
      let dataPanelHtml = "";

      const filteredData =
        projectSelectionFilterData.currentStepData[panelGroupId];

      const currentStepKeyValData =
        projectSelectionFilterData.currentStepDataToForFilterPopup[
          panelGroupId
        ];

      let checked = "";

      if (currentStepKeyValData) {
        Object.entries(currentStepKeyValData).forEach(([key, val], index) => {
          const checkboxValue = `${key},${val}`;

          if (filteredData[key]) {
            checked = "checked";
          } else {
            checked = "";
          }

          dataPanelHtml += `<li>
      <input class="styled-checkbox" ${checked} data-testid='${val}' id="styled-checkbox-${index}" type="checkbox" value="${checkboxValue}">
      <label for="styled-checkbox-${index}">${key}</label>
  </li>`;
        });

        modelPopupDataPanelFields.innerHTML = `<ul class="filter-checklist">
  ${dataPanelHtml}
  </ul>
  <button class="MyBtn OrangeBtn W100 JustifyCenter" onclick="onClickDataPanelFilterApply('${panelGroupId}')">Apply Now</button>`;
      }
    }
  }
}

function bindAllPanelsAsPerConfigSetup() {
  const psCrane = document.getElementById("psCrane");
  if (!psCrane) {
    const configDataOne = {
      panelsGroups: [
        {
          panelGroupId: "installationStepsRightPanel",
          panelTtileText: "Installation Steps",
        },
        {
          panelGroupId: "psCrane",
          panelTtileText: "PS Crane Dimensions",
        },
      ],
      panelId: "installationStepsPannel",
    };
    setPanelsAsPerConfigs(configDataOne);
  }

  const engData = document.getElementById("engData");
  if (!engData) {
    const configDataTwo = {
      panelsGroups: [
        { panelGroupId: "engData", panelTtileText: "Data Engineering" },
        {
          panelGroupId: "sbCrane",
          panelTtileText: "SB Crane Dimensions",
        },
      ],
      panelId: "installLeftPanel",
    };
    setPanelsAsPerConfigs(configDataTwo);
  }

  bindStepsDataToInstallPage();
}

function onClickDataPanelFilterApply(panelGroupId) {
  const checkedFilterValues = {};
  const checkboxElements = document.getElementsByClassName("styled-checkbox");

  [...checkboxElements].forEach((checbox) => {
    if (checbox.checked) {
      const [key, value] = checbox.value.split(",");

      checkedFilterValues[key] = value;
    }
  });

  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );

  const newCurrentStepData = {
    ...projectSelectionFilterData.currentStepData,
    [panelGroupId]: checkedFilterValues,
  };

  setProjectSelectionFilter({
    currentStepData: newCurrentStepData,
  });

  bindDataToAllPanel(newCurrentStepData);
  hideShowFilterPopup();
}
