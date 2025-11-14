'use strict'

function renderGallery() {
    //grab all images from service
    const imgs = getImgs()
    const strHTMLs = imgs.map(img => {
        return `<img onclick="onImgSelect(${img.id})" src="${img.url}">`
    })

    gElGallery.innerHTML = strHTMLs.join('')
}

function onRandomMeme() {
    const randomId = getRandomImgId()
    onImgSelect(randomId)
}

// SAVED MEMES GALLERY

function renderSavedMemes() {
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