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

    // Draw text
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

    updateEditorControls()
    onShowEditor()
}

function onEditSavedMeme(memeId) {
    const img = setMemeForEdit(memeId) // Sets gMeme to saved state
    if (!img) return

    gCurrSelectedImg.src = img.url // Load correct background

    updateEditorControls()
    onShowEditor() // Navigate to editor view
    // renderMeme() will be called by gCurrSelectedImg.onload
}

function onDownloadImg(elLink) {
    //Remove Frame
    const currIdx = getMeme().selectedLineIdx
    setSelectedLine(-1) // Deselect line
    renderMeme()

    //Download Pic
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent

    //Return Frame and rerender
    setSelectedLine(currIdx) // Reselect line
    renderMeme() // Render back with frame
}

function onSaveMeme() {
    // 1. Render without frame for a clean preview
    const currIdx = getMeme().selectedLineIdx
    setSelectedLine(-1)
    renderMeme()

    // 2. Get the preview image data
    const previewImg = gElCanvas.toDataURL('image/jpeg')

    // 3. Restore selection and render for user
    setSelectedLine(currIdx)
    renderMeme()

    // 4. Save the meme (data + preview) to service
    saveMeme(previewImg)

    // 5. Show the saved memes gallery
    onShowSavedMemes()
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
    if (!line) return
    const newSize = line.size + diff
    if (newSize < 14) return

    gCtx.font = `${newSize}px ${line.font}`
    const textWidth = gCtx.measureText(line.txt).width
    if (textWidth > gElCanvas.width - 22) return

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
    updateEditorControls()
}

function onAddLine() {
    addLine()
    renderMeme()
    updateEditorControls()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
    updateEditorControls()
}

function updateEditorControls() {
    const line = getSelectedLine()
    if (!line) {
        // If no line is selected (e.g., after deleting last line - though we prevent this)
        gElTextInput.value = ''
        gElColorInput.value = '#ffffff'
        gElFontSelect.value = 'Impact'
        return
    }
    gElTextInput.value = line.txt
    gElColorInput.value = line.color
    gElFontSelect.value = line.font
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

    if (clickedLineIdx === -1) {
        // If clicked outside, deselect
        setSelectedLine(-1)
    } else {
        // If clicked a line, select it
        setSelectedLine(clickedLineIdx)
    }

    renderMeme()
    updateEditorControls()
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
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (ev.touches && ev.touches.length > 0) {
        const rect = ev.target.getBoundingClientRect()
        pos = {
            x: ev.touches[0].clientX - rect.left,
            y: ev.touches[0].clientY - rect.top,
        }
    }
    return pos
}