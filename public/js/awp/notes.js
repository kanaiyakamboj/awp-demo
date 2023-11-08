let draw = false;
let prevX = null;
let prevY = null;
let restoreArray = [];
let canvas=null;

async function loadNotesCanvas() {
  canvas = document.getElementById("drawing-board");
  const canvasWrapper = document.getElementsByClassName("drawing-board")[0];

  canvas.height = canvasWrapper.offsetHeight;
  canvas.width = canvasWrapper.offsetWidth;

  const ctx = canvas.getContext("2d");

  await bindBackgroundImage(canvas, ctx);

  ctx.lineWidth = 3;

  let clrs = document.querySelectorAll(".clr");

  clrs = Array.from(clrs);

  clrs.forEach((clr) => {
    clr.addEventListener("click", () => {
      ctx.strokeStyle = clr.dataset.clr;
    });
  });

  attachCanvasRelatedControls(canvas, ctx);
}

async function bindBackgroundImage(canvas, ctx) {
  const bgImage = await getScreenshot();

  var backgroundImage = new Image();

  backgroundImage.src = bgImage;

  backgroundImage.onload = function () {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  };
}
function attachCanvasRelatedControls(canvas, ctx) {
  let undoBtn = document.querySelector(".undo");

  undoBtn.addEventListener("click", async () => {
    await undoLast(canvas, ctx);
  });

  let clearBtn = document.querySelector(".clear");

  clearBtn.addEventListener("click", async () => {
    restoreArray = [];
    await bindBackgroundImage(canvas, ctx);
  });

  canvas.addEventListener("mousedown", (e) => (draw = true));

  canvas.addEventListener("mouseup", (e) => {
    draw = false;

    restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  });

  canvas.addEventListener("mousemove", (e) => {
    var clientRect = e.target.getBoundingClientRect();

    const clientX = e.clientX - clientRect.left;
    const clientY = e.clientY - clientRect.top;

    if (prevX == null || prevY == null || !draw) {
      prevX = clientX;
      prevY = clientY;
      return;
    }

    let currentX = clientX;
    let currentY = clientY;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.closePath();

    prevX = currentX;
    prevY = currentY;
  });
}

async function getScreenshot() {
  const screenshotTarget = document.getElementById("content-wrapper");

  const canvas = await html2canvas(screenshotTarget);

  const base64image = canvas.toDataURL();

  return base64image;
}

async function undoLast(canvas, ctx) {
  if (restoreArray.length > 1) {
    restoreArray.pop();

    const arrLength = restoreArray.length;

    ctx.putImageData(restoreArray[arrLength - 1], 0, 0);
  } else {
    restoreArray = [];
    await bindBackgroundImage(canvas, ctx);
  }
}

function saveNotes() {
  const dataFromLocalStore = LocalObjectStore.getDataByKey("filtersData");

  const subjectModel =
    dataFromLocalStore?.dateAndSubject?.subjectModel.split(".")[0];

  const fileName = `${subjectModel}-${dataFromLocalStore.currentStep}-notes`;

  let data = canvas.toDataURL("imag/png");
  let a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  a.click();
}
