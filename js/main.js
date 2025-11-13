'use strict'

var gElCanvas
var gCtx
var gElTextInput
var gElColorInput
var gElFontSelect

var gCurrSelectedImg = new Image() //create pic to paint on canvas

function onInit() {
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElTextInput = document.querySelector('.myTextInput')
    gElColorInput = document.getElementById('color-picker')

    gElFontSelect = document.getElementById('font-select')

    //listen to clicks on Cancas
    gElCanvas.addEventListener('mousedown', onCanvasClick)
    gElCanvas.addEventListener('touchstart', onCanvasClick)

    gCurrSelectedImg.onload = renderMeme //Run the function after selecting the image.

    const meme = getMeme()
    gCurrSelectedImg.src = getImgById(meme.selectedImgId).url //take the url of selected img

    renderGallery()
}

