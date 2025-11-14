'use strict'

function renderGallery() {
    //grab all images from service
    const imgs = getImgs()
    const strHTMLs = imgs.map(img => {
        return `<img onclick="onImgSelect(${img.id})" src="${img.url}">`
    })
    //render galery
    const elImages = document.querySelector('.image-gallery')
    elImages.innerHTML = strHTMLs.join('')
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

    const strHTMLs = memes.map(meme => {
        // Use the saved preview image
        return `<img src="${meme.previewImg}" onclick="onEditSavedMeme('${meme.id}')">`
    })

    gElSavedMemes.innerHTML = strHTMLs.join('')
}