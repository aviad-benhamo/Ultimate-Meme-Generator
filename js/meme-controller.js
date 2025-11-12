'use strict'


function renderMeme() {
    const meme = getMeme()
    const selectedImg = getImgById(meme.selectedImgId)
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

        const x = gElCanvas.width / 2
        const y = 50
        gCtx.fillText(line.txt, x, y)
        gCtx.strokeText(line.txt, x, y)

    }
}