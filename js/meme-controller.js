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
        meme.lines.forEach((line, idx) => {
            drawText(line, idx)
        })
    }
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


    //Draw a frame around the selected line
    if (idx === getMeme().selectedLineIdx) {
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
}


function onTextInput() {
    var txt = gElTextInput.value
    setLineTxt(txt)
    renderMeme()
}

function onImgSelect(imgId) {
    setImg(imgId)
    renderMeme()
    updateTextInput()
    document.querySelector('.image-gallery').classList.add('hidden')
    document.querySelector('.meme-editor').classList.remove('hidden')
}

function onDownloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onSetColor(color) {
    setColor(color)
    renderMeme()
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
    updateTextInput()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    updateTextInput()
}

function updateTextInput() {
    const line = getSelectedLine()
    gElTextInput.value = line.txt
}