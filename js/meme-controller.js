'use strict'


function renderMeme() {
    //grab meme info from the service
    const meme = getMeme()
    //select right pic
    const selectedImg = getImgById(meme.selectedImgId)
    //set image
    const img = new Image()
    img.src = selectedImg.url

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        const line = meme.lines[0]
        gCtx.font = `${line.size}px Impact`
        gCtx.fillStyle = line.color
        gCtx.textAlign = 'center'
        gCtx.strokeStyle = 'black'
        gCtx.lineWidth = 2
        //locate the text
        const x = gElCanvas.width / 2
        const y = 50
        //write text
        gCtx.fillText(line.txt, x, y)
        gCtx.strokeText(line.txt, x, y)
    }
}

function onTextInput() {
    var txt = gElTextInput.value
    setLineTxt(txt)
    renderMeme()
}