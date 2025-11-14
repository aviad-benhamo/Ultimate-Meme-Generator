'use strict'

var gElCanvas
var gCtx
var gElTextInput
var gElColorInput
var gElFontSelect

// Sections
var gElGallery
var gElEditor
var gElSavedMemes
var gElGalleryControls


var gCurrSelectedImg = new Image() //create pic to paint on canvas

function onInit() {

    // Select sections
    gElGallery = document.querySelector('.image-gallery')
    gElEditor = document.querySelector('.meme-editor')
    gElSavedMemes = document.querySelector('.saved-memes-gallery')
    gElGalleryControls = document.querySelector('.gallery-controls')

    // Select canvas and controls
    gElCanvas = document.querySelector('.meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElTextInput = document.querySelector('.myTextInput')
    gElColorInput = document.getElementById('color-picker')
    gElFontSelect = document.getElementById('font-select')

    //listen to clicks on Cancas
    gElCanvas.addEventListener('mousedown', onCanvasClick)
    gElCanvas.addEventListener('touchstart', onCanvasClick)

    gCurrSelectedImg.onload = renderMeme //Run the function after selecting the image.

    // On load, show the main gallery
    onShowGallery()
}

function onShowGallery() {
    gElGallery.classList.remove('hidden')
    gElGalleryControls.classList.remove('hidden')
    gElEditor.classList.add('hidden')
    gElSavedMemes.classList.add('hidden')

    renderGallery() // Re-render gallery
}

function onShowEditor() {
    gElGallery.classList.add('hidden')
    gElGalleryControls.classList.add('hidden')
    gElEditor.classList.remove('hidden')
    gElSavedMemes.classList.add('hidden')
}

function onShowSavedMemes() {
    gElGallery.classList.add('hidden')
    gElGalleryControls.classList.add('hidden')
    gElEditor.classList.add('hidden')
    gElSavedMemes.classList.remove('hidden')

    renderSavedMemes() // Render the saved memes gallery
}