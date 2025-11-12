'use strict'


function renderMeme() {
    gCtx.drawImage(gCurrSelectedImg, 0, 0, gElCanvas.width, gElCanvas.height)
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        drawText(line, idx)
    })
}

function drawText(line, idx) {
    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
    gCtx.textAlign = 'center'
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2

    //Y location
    let y
    if (idx === 0) y = 50
    else if (idx === 1) y = gElCanvas.height - 50
    else y = gElCanvas.height / 2

    //X location
    const x = gElCanvas.width / 2

    //write text
    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)

    //put a frame on selected text
    if (idx === getMeme().selectedLineIdx) {
        drawTextFrame(line, x, y)
    }
}

function drawTextFrame(line, x, y) {
    gCtx.font = `${line.size}px Impact`
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size
    const padding = 8

    const rectX = x - (textWidth / 2) - padding
    const rectY = y - textHeight
    const rectWidth = textWidth + (padding * 2)
    const rectHeight = textHeight + 6

    gCtx.strokeStyle = line.color
    gCtx.lineWidth = 3
    gCtx.strokeRect(rectX, rectY, rectWidth, rectHeight)
}

function onTextInput() {
    var txt = gElTextInput.value
    setLineTxt(txt)
    renderMeme()
}

function onImgSelect(imgId) {
    setImg(imgId)

    gCurrSelectedImg.src = getImgById(imgId).url

    updateTextInput()
    updateColorInput()

    //hide gallery after selecting pic
    document.querySelector('.image-gallery').classList.add('hidden')
    document.querySelector('.meme-editor').classList.remove('hidden')
}

function onDownloadImg(elLink) {
    //Remove Frame
    const currIdx = getMeme().selectedLineIdx
    gMeme.selectedLineIdx = -1
    renderMeme()
    //Download Pic
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
    //Return Frame and rerender
    gMeme.selectedLineIdx = currIdx
    renderMeme()
}

function onSetColor(color) {
    setColor(color)
    renderMeme()
}

function onChangeFontSize(diff) {
    const line = getSelectedLine()
    const newSize = line.size + diff
    //Limit small size
    if (newSize < 14) return
    gCtx.font = `${newSize}px Impact`
    const textWidth = gCtx.measureText(line.txt).width
    const canvasWidth = gElCanvas.width
    //Limit too big size
    if (textWidth > canvasWidth - 22) {
        return
    }

    changeFontSize(diff)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
    updateTextInput()
    updateColorInput()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    updateTextInput()
    updateColorInput()
}

function updateTextInput() {
    const line = getSelectedLine()
    gElTextInput.value = line.txt
}

function updateColorInput() {
    const line = getSelectedLine()
    gElColorInput.value = line.color
}