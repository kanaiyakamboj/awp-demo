window.focusedCanvas = null;
{
    document.getElementById('fullCanvasButton').onclick = ()=>{
        document.getElementById('modalBackgroundDiv').hidden = false;

    }
    document.getElementById('modalCloseButton').onclick = ()=>{
        document.getElementById('modalBackgroundDiv').hidden = true;
    }
    let panelHiddens = {
        left: false,
        right: false
    }
    function resizeCanvasDiv(){
        let canvasDiv = document.getElementById('canvasDiv');
        canvasDiv.style.left = panelHiddens.left ? '0%' : '17%';
        let width = 66;
        if(panelHiddens.left) width+=17;
        if(panelHiddens.right) width+=17;
        canvasDiv.style.width = ''+width+'%';

    }

    ["left", 'right'].forEach((id)=>{
        let button = document.getElementById(id+'Button');
        button.onclick=()=>{
            let div = document.getElementById(id+'MenuDiv');
            div.hidden = !div.hidden;
            button.style.backgroundColor = div.hidden ? "white" :  "red";
        };


        let collapseButton = document.getElementById(id+'CollapseButton');
        collapseButton.onclick=()=>{
            let div = document.getElementById(id+'PanelDiv');
            div.hidden = !div.hidden;
            panelHiddens[id] = div.hidden;
            collapseButton.style.backgroundColor = div.hidden ? "red" :  "white";
            resizeCanvasDiv();
        };

    });

    const fullScreenStyle = document.getElementById("fullCanvasDiv").style;
    let storedStyle = null;
    ["topCanvas", "topRightCanvas", "topLeftCanvas", "botCanvas"].forEach(id => {
        let div = document.getElementById(id + 'Div');
        let button = document.getElementById(id + 'Button');
        button.onclick = () => {
            if (storedStyle) {
                Object.entries(storedStyle).forEach(entry => {
                    const [key, value] = entry;
                    div.style[key] = value;
                });
                window.focusedCanvas = null;
                storedStyle = null;
            } else {

                storedStyle = {
                    top: div.style.top,
                    left: div.style.left,
                    width: div.style.width,
                    height: div.style.height,
                    zIndex: div.style.zIndex
                };
                Object.entries(storedStyle).forEach(entry => {
                    const [key, value] = entry;
                    div.style[key] = fullScreenStyle[key];
                });
                window.focusedCanvas = document.getElementById(id);
            }
        }
    });
    let colorMap = {
        // botCanvas: 'orange',
        // topLeftCanvas: 'blue',
        // topRightCanvas: 'yellow',
        // topCanvas: 'green',
        // fullCanvas: 'aquamarine'
    }
    Object.entries(colorMap).forEach(entry => {
        const [key, value] = entry;
        console.log(key, value);
        let canvas = document.getElementById(key);
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
}