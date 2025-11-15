'use strict'


function renderMeme() {
    // "object-fit: cover" Logic ---
    const canvasWidth = gElCanvas.width
    const canvasHeight = gElCanvas.height
    const img = gCurrSelectedImg

    // Clear the canvas with a white background (for letterboxing)
    gCtx.fillStyle = '#ffffff'
    gCtx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Calculate dimensions
    const canvasRatio = canvasWidth / canvasHeight // Should be 1
    const imgRatio = img.naturalWidth / img.naturalHeight

    let dWidth, dHeight, dx, dy

    if (imgRatio > canvasRatio) {
        // Image is wider than canvas ("cover" logic: fit height)
        dHeight = canvasHeight
        dWidth = canvasHeight * imgRatio
        dy = 0
        dx = (canvasWidth - dWidth) / 2 // Center horizontally
    } else {
        // Image is taller than or equal to canvas ("cover" logic: fit width)
        dWidth = canvasWidth
        dHeight = canvasWidth / imgRatio
        dx = 0
        dy = (canvasHeight - dHeight) / 2 // Center vertically
    }

    // Draw the image centered and scaled
    gCtx.drawImage(img, dx, dy, dWidth, dHeight)

    const meme = getMeme()
    // Draw each line
    meme.lines.forEach((line, idx) => {
        drawText(line, idx)
    })
}

function drawText(line, idx) {
    gCtx.font = `${line.size}px ${line.font}`
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

    if (line.isSticker) {
        gCtx.fillText(line.txt, x, y)
    } else {
        // We must reset both fill and stroke style every time
        gCtx.fillStyle = line.color
        gCtx.strokeStyle = 'black'
        gCtx.lineWidth = 2


        gCtx.fillText(line.txt, x, y)
        gCtx.strokeText(line.txt, x, y)
    }

    //calculate and save line dimensions
    calculateLineRect(line, x, y)

    //draw the frame if the line is selected
    if (idx === getMeme().selectedLineIdx) {
        drawTextFrame(line, x, y)
    }
}

function calculateLineRect(line, x, y) {
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

    let rectY
    let rectWidth
    let rectHeight

    if (line.isSticker) {
        rectY = y - textHeight
        rectWidth = textWidth + (padding * 2)
        rectHeight = textHeight + 25
    } else { //for text
        rectY = y - textHeight
        rectWidth = textWidth + (padding * 2)
        rectHeight = textHeight + 6
    }

    //save the location in the object
    line.posX = rectX
    line.posY = rectY
    line.width = rectWidth
    line.height = rectHeight
}

function drawTextFrame(line) {
    // 1. Draw a wider black stroke as an outline
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 5
    gCtx.strokeRect(line.posX, line.posY, line.width, line.height)

    // 2. Draw a thinner white stroke on top
    gCtx.strokeStyle = 'white'
    gCtx.lineWidth = 3
    gCtx.strokeRect(line.posX, line.posY, line.width, line.height)
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
    // Returns either a URL or a dataURL
    const imgSrc = setMemeForEdit(memeId)
    if (!imgSrc) return

    gCurrSelectedImg.src = imgSrc // Load correct background, triggers .onload

    // .onload will call renderMeme() and updateEditorControls()
    onShowEditor() // Navigate to editor view
}

function onAddSticker(stickerTxt) {
    addSticker(stickerTxt)
    renderMeme()
    updateEditorControls()
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

    showUserMsg('Download started!')
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
    showUserMsg('Meme saved!')
    onShowSavedMemes()
}

function onShareImg(ev) {
    ev.preventDefault()

    // 1. Remove frame for clean image
    const currIdx = getMeme().selectedLineIdx
    setSelectedLine(-1)
    renderMeme()

    // 2. Get canvas data
    const canvasData = gElCanvas.toDataURL('image/jpeg')

    // 3. Restore frame for user
    setSelectedLine(currIdx)
    renderMeme()

    // 4. Show uploading message
    showUserMsg('Uploading your meme...')

    // 5. Callback function for success
    function onSuccess(uploadedImgUrl) {
        showUserMsg('Upload complete! Opening Facebook...')
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)

        // Open Facebook share dialog
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }

    // 6. Start upload
    uploadImg(canvasData, onSuccess)
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
    if (line.isSticker) {
        gElTextInput.value = '(Sticker)'
        gElTextInput.disabled = true
        gElColorInput.disabled = true // No color for stickers
    } else {
        // Regular text line
        gElTextInput.value = line.txt
        gElTextInput.disabled = false
        gElColorInput.disabled = false
        gElColorInput.value = line.color
    }
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
    // Find the *last* line (top-most) that was clicked
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]
        if (
            x >= line.posX && x <= line.posX + line.width &&
            y >= line.posY && y <= line.posY + line.height
        ) {
            return i // Return index of the clicked line
        }
    }
    return -1 // No line clicked
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