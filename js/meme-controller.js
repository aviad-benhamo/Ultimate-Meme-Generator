'use strict'


function renderMeme() {
    gCtx.drawImage(gCurrSelectedImg, 0, 0, gElCanvas.width, gElCanvas.height)
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        drawText(line, idx)
    })
}

function drawText(line, idx) {
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2

    let x
    const padding = 10
    if (line.align === 'left') {
        x = padding
        gCtx.textAlign = 'left'
    } else if (line.align === 'right') {
        x = gElCanvas.width - padding
        gCtx.textAlign = 'right'
    } else { // 'center'
        x = gElCanvas.width / 2
        gCtx.textAlign = 'center'
    }

    //Y location
    let y = line.y

    //write text
    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)

    //put a frame on selected text
    if (idx === getMeme().selectedLineIdx) {
        drawTextFrame(line, x, y)
    }
}

function drawTextFrame(line, x, y) {
    gCtx.font = `${line.size}px ${line.font}`
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size
    const padding = 8

    let rectX
    if (line.align === 'left') {
        rectX = x - padding
    } else if (line.align === 'right') {
        rectX = x - textWidth - padding
    } else { // 'center'
        rectX = x - (textWidth / 2) - padding
    }


    const rectY = y - textHeight
    const rectWidth = textWidth + (padding * 2)
    const rectHeight = textHeight + 6

    //save the location in the object
    line.posX = rectX
    line.posY = rectY
    line.width = rectWidth
    line.height = rectHeight

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
    updateFontSelect()

    //hide gallery after selecting pic
    document.querySelector('.image-gallery').classList.add('hidden')
    document.querySelector('.meme-editor').classList.remove('hidden')
    document.querySelector('.gallery-controls').classList.add('hidden')
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

function onSetFont(font) {
    setFont(font)
    renderMeme()
}

function onSetAlign(align) {
    setAlign(align)
    renderMeme()
}

function onChangeFontSize(diff) {
    const line = getSelectedLine()
    const newSize = line.size + diff
    //Limit small size
    if (newSize < 14) return
    gCtx.font = `${newSize}px ${line.font}`
    const textWidth = gCtx.measureText(line.txt).width
    const canvasWidth = gElCanvas.width
    //Limit too big size
    if (textWidth > canvasWidth - 22) {
        return
    }

    changeFontSize(diff)
    renderMeme()
}

function onSetUpDown(diff) {
    moveLineVertical(diff)
    renderMeme()
}

function onDeleteLine() {
    deleteSelectedLine()
    renderMeme()

    // Sync UI controls to the new selected line
    updateTextInput()
    updateColorInput()
    updateFontSelect()
}

function onAddLine() {
    addLine()
    renderMeme()
    updateTextInput()
    updateColorInput()
    updateFontSelect()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    updateTextInput()
    updateColorInput()
    updateFontSelect()
}

function updateTextInput() {
    const line = getSelectedLine()
    gElTextInput.value = line.txt
}

function updateColorInput() {
    const line = getSelectedLine()
    gElColorInput.value = line.color
}

function updateFontSelect() {
    const line = getSelectedLine()
    gElFontSelect.value = line.font
}

function onCanvasClick(ev) {
    ev.preventDefault()
    const pos = getEvPos(ev) // {x, y}

    const scaleX = gElCanvas.width / gElCanvas.clientWidth
    const scaleY = gElCanvas.height / gElCanvas.clientHeight
    const clickX = pos.x * scaleX
    const clickY = pos.y * scaleY


    const clickedLineIdx = findClickedLine(clickX, clickY)

    if (clickedLineIdx === -1) return

    setSelectedLine(clickedLineIdx)

    renderMeme()
    updateTextInput()
    updateColorInput()
    updateFontSelect()
}

function findClickedLine(x, y) {
    const lines = getMeme().lines
    return lines.findIndex(line => {
        return (
            x >= line.posX && x <= line.posX + line.width &&
            y >= line.posY && y <= line.posY + line.height
        )
    })
}

function getEvPos(ev) {
    if (ev.touches) {
        return {
            x: ev.touches[0].clientX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.touches[0].clientY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    else {
        return {
            x: ev.offsetX,
            y: ev.offsetY,
        }
    }
}