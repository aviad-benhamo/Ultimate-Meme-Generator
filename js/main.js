'use strict'

let gElCanvas
let gCtx
let gElTextInput
let gElColorInput
let gCurrSelectedImg = new Image() //create pic to paint on canvas

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElTextInput = document.querySelector('.myTextInput')
    gElColorInput = document.getElementById('color-picker')

    gCurrSelectedImg.onload = renderMeme //Run the function after selecting the image.

    const meme = getMeme()
    gCurrSelectedImg.src = getImgById(meme.selectedImgId).url //take the url of selected img

    renderGallery()
}

