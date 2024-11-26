'use strict'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
let width = canvas.width
let height = canvas.height

const blockSize = 10
const widthInBlocks = width / blockSize
const heightInBlock = height / blockSize

let score = 0

const drawBorder = function () {
	ctx.fillStyle = 'Gray'
	ctx.fillRect(0, 0, width, blockSize)
	ctx.fillRect(0, height - blockSize, width, blockSize)
	ctx.fillRect(0, 0, blockSize, height)
	ctx.fillRect(width - blockSize, 0, blockSize, height)
}

const drawScore = function () {
	ctx.font = '20px Courier'
	ctx.fillStyle = 'Black'
	ctx.textAlign = 'left'
	ctx.textBaseline = 'top'
	ctx.fillText('Счет: ' + score, blockSize, blockSize)
}

const gameOver = function () {
	clearInterval(intervalId)
	ctx.font = '60px Courier'
	ctx.fillStyle = 'Black'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText('Конец игры', width / 2, height / 2)
}

const Block = function (col, row) {
	this.col = col
	this.row = row
}

Block.prototype.drawSquare = function (color) {
	let x = this.col * blockSize
	let y = this.row * blockSize
	ctx.fillStyle = color
	ctx.fillRect(x, y, blockSize, blockSize)
}
const sampleBlock = new Block(3, 4)
sampleBlock.drawSquare('LightBlue')

Block.prototype.drawCircle = function (color) {
	let centerX = this.col * blockSize + blockSize / 2
	let centerY = this.row * blockSize + blockSize / 2
	ctx.fillStyle = color
	circle(centerX, centerY, blockSize / 2, true)
}

const sampleCircle = new Block(4, 3)
sampleCircle.drawCircle('LightGreen')

function circle(x, y, radius, fillStyle) {
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, Math.PI * 2)

	if (fillStyle) {
		ctx.fill()
	} else {
		ctx.stroke()
	}
}

Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row
}

// let apple = new Block(2, 5);
// let head = new Block(3, 5)
// head.equal(apple)
// head = new Block(2, 5)
// head.equal(apple)

const Snake = function () {
	this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)]
	this.direction = 'right'
	this.nextDirection = 'right'
}

Snake.prototype.draw = function () {
	for (let i = 0; i < this.segments.length; i++) {
		this.segments[i].drawSquare('Blue')
	}
}


Snake.prototype.move = function () {
	let head = this.segments[0]
	let newHead

	this.direction = this.nextDirection

	if (this.direction === 'right') {
		newHead = new Block(head.col + 1, head.row)
	} else if (this.direction === 'down') {
		newHead = new Block(head.col, head.row + 1)
	} else if (this.direction === 'left') {
		newHead = new Block(head.col - 1, head.row)
	} else if (this.direction === 'up') {
		newHead = new Block(head.col, head.row - 1)
	}

	if (this.checkCollision(newHead)) {
		gameOver()
		return
	}

	this.segments.unshift(newHead)
	if (newHead.equal(apple.position)) {
		score++
		apple.move()
	} else {
		this.segments.pop()
	}
}

Snake.prototype.checkCollision = function (head) {
	let leftCollision = head.col === 0
	let topCollision = head.row === 0
	let rightCollision = head.col === widthInBlocks - 1
	let bottomCollision = head.row === widthInBlocks - 1

	let wallCollision =
		leftCollision || topCollision || rightCollision || bottomCollision

	let selfCollision = false

	for (let i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true
		}
	}
	return wallCollision || selfCollision
}


Snake.prototype.setDirection = function (newDirection) {
	if (this.direction === 'up' && newDirection === 'down') {
		return
	} else if (this.direction === 'down' && newDirection === 'up') {
		return
	} else if (this.direction === 'right' && newDirection === 'left') {
		return
	} else if (this.direction === 'left' && newDirection === 'right') {
		return
	}

	this.nextDirection = newDirection
}

const Apple = function () {
	this.position = new Block(10, 10)
}

Apple.prototype.draw = function () {
	this.position.drawCircle('LimeGreen')
}

Apple.prototype.move = function () {
	let randomCol = Math.floor(Math.random() * (widthInBlocks - 2) + 1)
	let randomRow = Math.floor(Math.random() * (widthInBlocks - 2) + 1)
	this.position = new Block(randomCol, randomRow)
}

const snake = new Snake();
const apple = new Apple();

const intervalId = setInterval(function (){
	ctx.clearRect(0, 0, width, height)
	drawScore()
	snake.move()
	snake.draw()
	apple.draw()
	drawBorder()
}, 100)


const directions = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
}

$('body').keydown(function (event) {
	let newDirection = directions[event.keyCode]
	if (newDirection !== undefined) {
		snake.setDirection(newDirection)
	}
})

// const intervalId = setInterval(()=>{
// 	ctx.clearRect(0, 0, width, height)
// 	drawBorder();
// 	drawScore();
// score++ ;
// }, 30)

// setInterval(()=>{
// 	gameOver();
// }, 5000)

// drawBorder();
// drawScore();
