outputPath = @"C:\DevopsRepos\awp-core-project\HTML\content\"

CAM_HTV_SIDE = $'HLV-S'
RES_HTV_SIDE = [1600,491]
CAM_HTV_TOP = $'HLV-T'
RES_HTV_TOP = [1600,491]
CAM_IN_P = $'IN-P'
RES_IN_P = [640,500]
CAM_IN_S = $'IN-S'
RES_IN_S = [640,500]
CAM_IN_T = $'IN-T'
RES_IN_T = [1280,491]

frameTimes = #(0,90,210,350,360)

selectedPiles = #("EW1-B21", "EW1-B22")
alternatePiles = #("EW1-C21","EW1-C22")

sceneAnimator = $'SceneAnimator'

fn renderImage pile altPile cam res frame =
(
  if frame == 0 then suffix = "-31-01.jpg"
  if frame == 90 then suffix = "-31-02.jpg"
  if frame == 210 then suffix = "-51-01.jpg"
  if frame == 350 then suffix = "-51-02.jpg"
  if frame == 360 then suffix = "-51-03.jpg"
  
  wasCancelled = false

  image = bitmap (res.x) (res.y) fileName:(outputPath + pile + "-" + cam.name + suffix)
  render camera:cam frame:frame outputwidth:res.x outputHeight:res.y vfb:false to:image cancelled:&wasCancelled --outputFile:(outputPath + pileName+"-"+cam.name+"-01"+".jpg")
  save image
  image.filename = (outputPath + altPile + "-" + cam.name + suffix)
  save image
  close image

  return wasCancelled
)

fn renderImages = 
(
  if sceneAnimator != undefined then
  (
    AWPSetup = sceneAnimator.modifiers[1]
    
    
    for i=1 to selectedPiles.count do
    (
      cancelRender = false
      while cancelRender == false do
      (
        AWPSetup.selectedPile = i
        AWPSetup.updateAnimation i
        
        pile = selectedPiles[i]
        altPile = alternatePiles[i]

        --render HTV images
        --side
        (layerManager.getLayerFromName "THIALF").ishidden = true
        (layerManager.getLayerFromName "TP AND STUFF").ishidden = true
        (layerManager.getLayerFromName "GRABBER").ishidden = true
        (layerManager.getLayerFromName "MP_ends").ishidden = false
        (layerManager.getLayerFromName "MP_ends1").ishidden = (i==2)
        (layerManager.getLayerFromName "ENVIRONMENT").ishidden = false
        cancelRender = renderImage pile altPile CAM_HTV_SIDE RES_HTV_SIDE 0


        --top
        (layerManager.getLayerFromName "TP AND STUFF").ishidden = false
        (layerManager.getLayerFromName "MP_ends").ishidden = true
        (layerManager.getLayerFromName "MP_ends1").ishidden = (i==2)
        (layerManager.getLayerFromName "ENVIRONMENT").ishidden = true
        cancelRender = renderImage pile altPile CAM_HTV_TOP RES_HTV_TOP 0

        --render the Installation images
        --persp
        (layerManager.getLayerFromName "THIALF").ishidden = false
        (layerManager.getLayerFromName "GRABBER").ishidden = false
        (layerManager.getLayerFromName "ENVIRONMENT").ishidden = true
        cancelRender = renderImage pile altPile CAM_IN_P RES_IN_P 0
        cancelRender = renderImage pile altPile CAM_IN_P RES_IN_P 90
        cancelRender = renderImage pile altPile CAM_IN_P RES_IN_P 210
        cancelRender = renderImage pile altPile CAM_IN_P RES_IN_P 350
        cancelRender = renderImage pile altPile CAM_IN_P RES_IN_P 360

        --side
        (layerManager.getLayerFromName "TP AND STUFF").ishidden = true
        (layerManager.getLayerFromName "MP_ends").ishidden = false
        (layerManager.getLayerFromName "MP_ends1").ishidden = (i==2)
        (layerManager.getLayerFromName "ENVIRONMENT").ishidden = false
        cancelRender = renderImage pile altPile CAM_IN_S RES_IN_S 0
        cancelRender = renderImage pile altPile CAM_IN_S RES_IN_S 90
        cancelRender = renderImage pile altPile CAM_IN_S RES_IN_S 210
        cancelRender = renderImage pile altPile CAM_IN_S RES_IN_S 350
        cancelRender = renderImage pile altPile CAM_IN_S RES_IN_S 360
        
        --top
        (layerManager.getLayerFromName "TP AND STUFF").ishidden = false
        (layerManager.getLayerFromName "MP_ends").ishidden = true
        (layerManager.getLayerFromName "MP_ends1").ishidden = (i==2)
        (layerManager.getLayerFromName "ENVIRONMENT").ishidden = true
        cancelRender = renderImage pile altPile CAM_IN_T RES_IN_T 0
        cancelRender = renderImage pile altPile CAM_IN_T RES_IN_T 90
        cancelRender = renderImage pile altPile CAM_IN_T RES_IN_T 210
        cancelRender = renderImage pile altPile CAM_IN_T RES_IN_T 350
        cancelRender = renderImage pile altPile CAM_IN_T RES_IN_T 360

        cancelRender = true
      )
    )
  )
)

try destroydialog renderImagesUI catch()

rollout RenderImagesUI "Render Images" 
(
  button btn_render "Render"

  on btn_render pressed do
  (
    escapeEnable = true
    renderImages()
  )
)

createDialog RenderImagesUI