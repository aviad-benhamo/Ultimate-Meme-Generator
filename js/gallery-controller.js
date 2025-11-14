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

    document.querySelector('.gallery-controls').classList.add('hidden')
}