'use strict'

function renderGallery() {
    //grab all images from service
    const imgs = getImgs()
    const strHTMLs = imgs.map(img => {
        return `<img src="${img.url}">`
    })
    //render galery
    const elImages = document.querySelector('.image-gallery')
    elImages.innerHTML = strHTMLs.join('')
}