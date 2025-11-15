'use strict'

function renderGallery() {
    //grab all images from service
    const imgs = getImgs()
    const strHTMLs = imgs.map(img => {
        return `<img onclick="onImgSelect(${img.id})" src="${img.url}">`
    })
    gElGallery.innerHTML = strHTMLs.join('')
}

function onRandomMeme() { //Lucky button
    const randomId = getRandomImgId()
    onImgSelect(randomId)
}

function onImgInput(ev) {
    // Call the utility function, and pass 'onUserImageReady' as the callback
    loadImageFromInput(ev, onUserImageReady)
}

function onUserImageReady(img) {
    // 1. Save the image dataURL in the service (gMeme)
    // We use 0 as an ID to signify it's a user-uploaded image
    setImg(0, img.src)

    // 2. Set the global gCurrSelectedImg to this new image.
    // This will trigger gCurrSelectedImg.onload in main.js
    gCurrSelectedImg.src = img.src

    // 3. Navigate to the editor
    onShowEditor()

    // 4. main.js's .onload will handle renderMeme() and updateEditorControls()
}


function renderSavedMemes() {// SAVED MEMES GALLERY
    const memes = getSavedMemes()

    // Handle empty state
    if (!memes || memes.length === 0) {
        gElSavedMemes.innerHTML = `<p class="empty-message">No saved memes yet!</p>`
        return
    }

    const strHTMLs = memes.map(meme => `
        <div class="saved-meme-card">
            <img src="${meme.previewImg}" onclick="onEditSavedMeme('${meme.id}')">
            <button class="btn-delete-saved" onclick="onDeleteSavedMeme(event, '${meme.id}')">X</button>
        </div>
    `)

    gElSavedMemes.innerHTML = strHTMLs.join('')
}

function onDeleteSavedMeme(ev, memeId) {
    ev.stopPropagation() // Prevent onEditSavedMeme from firing
    deleteSavedMeme(memeId) // Call service to delete
    renderSavedMemes() // Re-render the gallery
    showUserMsg('Meme deleted!') // Show feedback
}