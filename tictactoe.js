//SETTING UP GRID
const grid = document.getElementById("grid")
const gameBtn = document.getElementById("gameBtn")
let turn = true
const winPos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
]
let board = Array(9).fill(null)
let msg = document.getElementById("winMsg")

startGame()

function startGame() {
  for (i = 0; i < 9; i++) {
    const button = document.createElement("button")
    //STYLE
    button.id = "tic" + i
    button.style.width = "60px"
    button.style.height = "60px"
    button.style.fontFamily = "sans-serif"
    button.style.fontSize = "30px"
    button.disabled = true

    // required to do this because button text makes life hard
    const tooltip = document.createElement("div")
    applyFormat(tooltip)

    button.appendChild(tooltip)

    //CLICK EVENT vvvv
    button.onclick = function () {
      insMove(this)
    }

    grid.appendChild(button)
  }
}

function applyFormat(tooltip) {
  tooltip.innerText = "x"
  tooltip.style.position = "absolute"
  tooltip.style.paddingLeft = "10px"
  tooltip.style.lineHeight = "0px"
  tooltip.style.marginTop = "-3px"
  tooltip.style.marginLeft = "0px"
  tooltip.style.color = "black"
  tooltip.style.fontSize = "45px"
  tooltip.style.visibility = "hidden" // hide by default
  tooltip.style.whiteSpace = "nowrap"
  tooltip.style.userSelect = "none"
}

function showTooltip() {
  this.querySelector("div").style.visibility = "visible"
}

function hideTooltip() {
  this.querySelector("div").style.visibility = "hidden"
}

function insMove(button) {
  const index = parseInt(button.id.slice(-1))
  board[index] = "x"
  // tooltip.innerText = "o" // example: change the hover letter
  // tooltip.style.paddingLeft = "7px"
  // tooltip.style.lineHeight = "0px"
  // tooltip.style.marginTop = "0px"
  visInsMove(button)
  if (checkGame()) {
    return
  }
  turn = false
  setTimeout(compMove, 2000)
}

function visInsMove(button) {
  // to separate visual changes
  const tooltip = button.querySelector("div")
  tooltip.style.visibility = "visible"
  button.removeEventListener("mouseover", showTooltip)
  button.removeEventListener("mouseout", hideTooltip)
  button.disabled = "true"
}

function gameButton() {
  const buttons = grid.querySelectorAll("button")
  if (gameBtn.innerText[0] === "S") {
    for (i = 0; i < buttons.length; i++) {
      //viz
      buttons[i].disabled = false
      buttons[i].querySelector("div").style.visibility = "hidden"
      buttons[i].addEventListener("mouseover", showTooltip)
      buttons[i].addEventListener("mouseout", hideTooltip)
    }
    gameBtn.innerText = "Reset"
  } else {
    for (i = 0; i < buttons.length; i++) {
      //viz
      const tooltip = buttons[i].querySelector("div")
      applyFormat(tooltip)
      buttons[i].disabled = true
      buttons[i].querySelector("div").style.visibility = "hidden"
      buttons[i].removeEventListener("mouseover", showTooltip)
      buttons[i].removeEventListener("mouseout", hideTooltip)
    }
    gameBtn.innerText = "Start"
    msg.innerText = ""
    //game logic
    turn = true
    board = Array(9).fill(null)
  }
}

function checkGame() {
  for (i = 0; i < winPos.length; i++) {
    const [a, b, c] = winPos[i]
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      if (turn) {
        msg.innerText = "You won!"
        endGame()
        return true
      } else {
        msg.innerText = "You lost!"
        endGame()
        return true
      }
    }
    if (!board.includes(null)) {
      msg.innerText = "It's a draw!"
      endGame()
    }
  }
  return false
}

function endGame() {
  const buttons = grid.querySelectorAll("button")
  for (i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true
    buttons[i].removeEventListener("mouseover", showTooltip)
    buttons[i].removeEventListener("mouseout", hideTooltip)
  }
}

function canWin(player, i) {
  board[i] = player
  const won = winPos.some((line) => line.every((j) => board[j] === player))
  board[i] = null
  return won
}

function doMove(i) {
  // viz changes
  const btn = document.getElementById("tic" + i)
  board[i] = "O"
  const tip = btn.querySelector("div")
  tip.innerText = "O"
  tip.style.visibility = "visible"
  tip.style.marginTop = "2px"
  tip.style.marginLeft = "-5px"
  btn.disabled = true
  btn.removeEventListener("mouseover", showTooltip)
  btn.removeEventListener("mouseout", hideTooltip)
}

function compMove() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null && canWin("O", i)) {
      doMove(i)
      checkGame()
      turn = true
      return
    }
  }

  // Check if the player can win and block them
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null && canWin("x", i)) {
      doMove(i)
      checkGame()
      turn = true
      return
    }
  }

  // Make a random move
  if (board[4] === null) {
    doMove(4)
  } else {
    const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null)
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
    doMove(randomIndex)
  }
  turn = true
  checkGame()
}