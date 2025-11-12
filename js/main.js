'use strict'

let gElCanvas
let gCtx
let gElTextInput

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElTextInput = document.querySelector('.myTextInput')
    renderMeme()
    renderGallery()
}

