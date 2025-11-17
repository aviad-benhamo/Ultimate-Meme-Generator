'use strict'

const STORAGE_KEY = 'memesDB'
var gSavedMemes = []


var gImgs = [
    { id: 1, url: 'img/1.jpg' },
    { id: 2, url: 'img/2.jpg' },
    { id: 3, url: 'img/3.jpg' },
    { id: 4, url: 'img/4.jpg' },
    { id: 5, url: 'img/5.jpg' },
    { id: 6, url: 'img/6.jpg' },
    { id: 7, url: 'img/7.jpg' },
    { id: 8, url: 'img/8.jpg' },
    { id: 9, url: 'img/9.jpg' },
    { id: 10, url: 'img/10.jpg' },
    { id: 11, url: 'img/11.jpg' },
    { id: 12, url: 'img/12.jpg' },
    { id: 13, url: 'img/13.jpg' },
    { id: 14, url: 'img/14.jpg' },
    { id: 15, url: 'img/15.jpg' },
    { id: 16, url: 'img/16.jpg' },
    { id: 17, url: 'img/17.jpg' },
    { id: 18, url: 'img/18.jpg' },
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [],
    uploadedImgData: null
}

_loadMemesFromStorage() // Load saved memes on script start

function getImgs() {
    return gImgs
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function getRandomImgId() {
    const imgs = getImgs()
    const randomIdx = Math.floor(Math.random() * imgs.length)
    return imgs[randomIdx].id
}

// --- gMeme (EDITOR) FUNCTIONS ---

function getMeme() {
    return gMeme
}

function getSelectedLine() {
    // Handle cases where no line is selected (idx = -1)
    if (gMeme.selectedLineIdx < 0) return null
    return gMeme.lines[gMeme.selectedLineIdx]
}

function setImg(imgId, dataURL = null) {
    gMeme.selectedImgId = imgId // Can be 0 if user-uploaded
    gMeme.uploadedImgData = dataURL // Store the dataURL

    gMeme.selectedLineIdx = 0
    gMeme.lines = [
        { txt: 'Top Text', size: 30, color: '#ffffff', font: 'Impact', align: 'center', y: 50 },
        { txt: 'Bottom Text', size: 30, color: '#ffffff', font: 'Impact', align: 'center', y: 450 }
    ]
}

function setLineTxt(text) {
    const line = getSelectedLine()
    if (!line) return
    line.txt = text
}

function setColor(color) {
    const line = getSelectedLine()
    if (!line) return
    line.color = color
}

function setFont(font) {
    const line = getSelectedLine()
    if (!line) return
    line.font = font
}

function setAlign(align) {
    const line = getSelectedLine()
    if (!line) return
    line.align = align
}

function changeFontSize(diff) {
    const line = getSelectedLine()
    if (!line) return
    line.size += diff
}

function moveLineVertical(diff) {
    const line = getSelectedLine()
    if (!line) return
    line.y += diff
}

function addLine() {
    gMeme.lines.push({ txt: 'New Line', size: 30, color: '#ffffff', font: 'Impact', align: 'center', y: 250 })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function addSticker(stickerTxt) {
    gMeme.lines.push({
        txt: stickerTxt,
        size: 60,
        align: 'center',
        y: 250,
        isSticker: true
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function deleteSelectedLine() {
    if (gMeme.lines.length <= 1) return // Prevent deleting the last line

    const idx = gMeme.selectedLineIdx
    gMeme.lines.splice(idx, 1)

    gMeme.selectedLineIdx = 0 // Reset selection to the first line
}

function setSelectedLine(idx) {
    gMeme.selectedLineIdx = idx
}

function switchLine() {
    let currentIdx = gMeme.selectedLineIdx
    currentIdx++
    if (currentIdx >= gMeme.lines.length) {
        currentIdx = 0
    }
    gMeme.selectedLineIdx = currentIdx
}

// --- gSavedMemes (localStorage) FUNCTIONS ---

function getSavedMemes() {
    return gSavedMemes
}

function setMemeForEdit(memeId) {
    const savedMeme = gSavedMemes.find(meme => meme.id === memeId)
    if (!savedMeme) return null

    // Set the global gMeme to the saved data
    gMeme = savedMeme.memeData

    // Return the correct image source
    if (gMeme.uploadedImgData) {
        return gMeme.uploadedImgData // Return the saved dataURL
    } else {
        return getImgById(gMeme.selectedImgId).url // Return the gallery URL
    }
}

function saveMeme(previewImg) {
    // Create the object to save
    const savedMeme = {
        id: makeId(),
        memeData: JSON.parse(JSON.stringify(gMeme)), // Deep copy of gMeme
        previewImg: previewImg
    }

    gSavedMemes.push(savedMeme)
    _saveMemesToStorage()
}

function deleteSavedMeme(memeId) {
    const memeIdx = gSavedMemes.findIndex(meme => meme.id === memeId)
    if (memeIdx === -1) return

    gSavedMemes.splice(memeIdx, 1)
    _saveMemesToStorage()
}

// "Private" functions

function _loadMemesFromStorage() {
    const memes = loadFromStorage(STORAGE_KEY)
    if (memes && memes.length > 0) {
        gSavedMemes = memes
    }
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes)
}