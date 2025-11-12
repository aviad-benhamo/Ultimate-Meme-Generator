'use strict'
var gImgs = [
    {
        id: 1,
        url: 'img/1.jpg',
        keywords: ['funny', 'cat']

    },
    {
        id: 2,
        url: 'img/2.jpg',
        keywords: ['funny', 'dog']
    }]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        { txt: 'I sometimes eat Falafel', size: 30, color: 'white' },
        { txt: 'new Line', size: 30, color: 'white' }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function setLineTxt(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function getImgs() {
    return gImgs
}

function setLineTxt(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function changeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function addLine() {
    gMeme.lines.push({ txt: 'New Line', size: 30, color: 'white' })
    gMeme.selectedLineIdx = gMeme.lines.length - 1

}

function switchLine() {
    let currentIdx = gMeme.selectedLineIdx
    currentIdx++
    if (currentIdx === gMeme.lines.length) {
        currentIdx = 0
    }
    gMeme.selectedLineIdx = currentIdx
}

