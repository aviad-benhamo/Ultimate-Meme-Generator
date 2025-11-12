'use strict'
var gImgs = [
    {
        id: 1,
        url: 'img/1.jpg',
        keywords: ['funny', 'cat']
    }]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        { txt: 'I sometimes eat Falafel', size: 30, color: 'white' }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function setLineTxt(text) {
    gMeme.lines[0].txt = text
}