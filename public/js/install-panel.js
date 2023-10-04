function bindStepsDataToInstallPage() {
  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );
  const installationSteps = projectSelectionFilterData.steps;

  if (installationSteps) {
    bindStepsToPanel(installationSteps);
  }
  /*
    steps:stepsDataForMonopile.steps,
    stepsData:currentStepData.stepsData,
    currentStepData: stepsDataForMonopile.stepsData['stesp_1'] });
    */
}

function bindStepsToPanel(steps) {
  const stepsWrapper = document.getElementById("installation-steps");

  let stepsLi = "";

  steps.forEach((step) => {
    const stepFormated=step.replace('_'," ");

    stepsLi += `<li data-steps="${step}" onclick="onStepClick('${step}')" class="MyInputBtn steps-buttons">
        <span>${stepFormated}</span>
        <button
          class="MyInputBtn StepInstructionBtn"
          onclick="modalPopup(event)">
          <img src="../../assets/info-icon.svg" alt="" />
        </button>
      </li>`;
  });

  stepsWrapper.innerHTML = stepsLi;
}

function onStepClick(step) {
  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );

  const installationStepsData = projectSelectionFilterData.stepsData;

  const selectedStepData = installationStepsData[step];

  if (selectedStepData) {
    setProjectSelectionFilter({
        currentStep:step,
      currentStepData: selectedStepData,
    });
  }
}
