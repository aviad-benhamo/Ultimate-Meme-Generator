'use strict'

const STORAGE_KEY = 'memesDB'
var gSavedMemes = []


var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'img/2.jpg', keywords: ['funny', 'dog'] },
    { id: 3, url: 'img/3.jpg', keywords: ['meme'] },
    { id: 4, url: 'img/4.jpg', keywords: ['meme'] },
    { id: 5, url: 'img/5.jpg', keywords: ['meme'] },
    { id: 6, url: 'img/6.jpg', keywords: ['meme'] },
    { id: 7, url: 'img/7.jpg', keywords: ['meme'] },
    { id: 8, url: 'img/8.jpg', keywords: ['meme'] },
    { id: 9, url: 'img/9.jpg', keywords: ['meme'] },
    { id: 10, url: 'img/10.jpg', keywords: ['meme'] },
    { id: 11, url: 'img/11.jpg', keywords: ['meme'] },
    { id: 12, url: 'img/12.jpg', keywords: ['meme'] },
    { id: 13, url: 'img/13.jpg', keywords: ['meme'] },
    { id: 14, url: 'img/14.jpg', keywords: ['meme'] },
    { id: 15, url: 'img/15.jpg', keywords: ['meme'] },
    { id: 16, url: 'img/16.jpg', keywords: ['meme'] },
    { id: 17, url: 'img/17.jpg', keywords: ['meme'] },
    { id: 18, url: 'img/18.jpg', keywords: ['meme'] }
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        { txt: 'I sometimes eat Falafel', size: 30, color: '#ffffff', font: 'Impact', align: 'center', y: 50 },
        { txt: "new Line", size: 30, color: "#ffffff", posX: 188.474609375, posY: 420, width: 123.05078125, height: 36, font: 'Impact', align: 'center', y: 450 }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
_loadMemesFromStorage() // Load saved memes on script start

function getMeme() {
    return gMeme
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function getImgs() {
    return gImgs
}

function setLineTxt(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
    gMeme.selectedLineIdx = 0
    gMeme.lines = [
        { txt: 'Your Text Here', size: 30, color: '#ffffff', font: 'Impact', align: 'center', y: 50 },
        { txt: "new Line", size: 30, color: "#ffffff", posX: 188.474609375, posY: 420, width: 123.05078125, height: 36, font: 'Impact', align: 'center', y: 450 }
    ]

}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFont(font) {
    getSelectedLine().font = font
}

function setAlign(align) {
    getSelectedLine().align = align
}

function changeFontSize(diff) {
    getSelectedLine().size += diff
}

function moveLineVertical(diff) {
    const line = getSelectedLine()
    line.y += diff
}

function addLine() {
    gMeme.lines.push({ txt: 'New Line', size: 30, color: '#ffffff', font: 'Impact', align: 'center', y: 250 })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function deleteSelectedLine() {
    if (gMeme.lines.length <= 1) return

    const idx = gMeme.selectedLineIdx
    gMeme.lines.splice(idx, 1)

    gMeme.selectedLineIdx = 0
}

function setSelectedLine(idx) {
    gMeme.selectedLineIdx = idx
}

function switchLine() {
    let currentIdx = gMeme.selectedLineIdx
    currentIdx++
    if (currentIdx === gMeme.lines.length) {
        currentIdx = 0
    }
    gMeme.selectedLineIdx = currentIdx
}

function getRandomImgId() {
    const imgs = getImgs()
    const randomIdx = Math.floor(Math.random() * imgs.length)
    return imgs[randomIdx].id
}

// --- SAVED MEMES (localStorage) ---

function getSavedMemes() {
    return gSavedMemes
}

// Called by controller to load a saved meme into the editor
function setMemeForEdit(memeId) {
    const savedMeme = gSavedMemes.find(meme => meme.id === memeId)
    if (!savedMeme) return null

    // Set the global gMeme to the saved data
    gMeme = savedMeme.memeData

    // Return the background image object for the controller
    return getImgById(gMeme.selectedImgId)
}

// Called by controller to save the current meme
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

function _loadMemesFromStorage() {
    const memes = loadFromStorage(STORAGE_KEY)
    if (memes && memes.length > 0) {
        gSavedMemes = memes
    }
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes)
}