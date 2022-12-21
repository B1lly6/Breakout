const grid = document.querySelector('.grid')
const start = document.querySelector('#start')
let game_status = 'not live'
const block_width = 100
const block_height = 20
const grid_width = 560
const grid_height = 300
const ball_diameter = 20
let score_display = document.querySelector('#score')
let score = 0
let xDirection = -2
let yDirection = 2
let timer_id

const user_start = [230, 10]
let user_current = user_start

const ball_start = [270, 30]
let ball_current = ball_start


//create Block. Parameters create bottom left anchor.
class Block {
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + block_width, yAxis]
        this.topLeft = [xAxis, yAxis + block_height]
        this.topRight = [xAxis + block_width, yAxis + block_height]
    }
}

// all my blocks
const blocks = [
    // first line - each x axis moved to the right 110px
    new Block(10,270),
    new Block(120,270),
    new Block(230,270),
    new Block(340,270),
    new Block(450,270),

    // second line - each y axis moved down 30 px
    new Block(10,240),
    new Block(120,240),
    new Block(230,240),
    new Block(340,240),
    new Block(450,240),

    // third line - each y axis moved down another 30 px
    new Block(10,210),
    new Block(120,210),
    new Block(230,210),
    new Block(340,210),
    new Block(450,210)
]

//create an element for every block in the blocks array and append it to the grid.
function addBlocks() {
    for(let i = 0; i < blocks.length; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.append(block)
    }
}

addBlocks()

// create user
const user = document.createElement('div')
user.classList.add('user')
positionUser()
grid.append(user)

// position user
function positionUser() {
    user.style.left = user_current[0] + 'px'
    user.style.bottom = user_current[1] + 'px'
}

// move user function is passed through an event
function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':   // <--- take away from X axis of our current position
            if(user_current[0] > 0){
                 user_current[0] -= 10
                 positionUser()
            }
            break;
        case 'ArrowRight':  // <--- add to the X axis of our current position
            if(user_current[0] < grid_width - block_width){
                user_current[0] += 10
                 positionUser()
            }
            break
    }
}

document.addEventListener('keydown', moveUser)

// add ball
const ball = document.createElement('div')
ball.classList.add('ball')
postionBall()
grid.append(ball)

// position ball
function postionBall() {
    ball.style.left = ball_current[0] + 'px'
    ball.style.bottom = ball_current[1] + 'px'
}

// move ball
function moveBall() {
    ball_current[0] += xDirection
    ball_current[1] += yDirection
    postionBall()
    checkForCollisions()
}

// check for collisions
function checkForCollisions() {
    
    // check for block collisions
    for(let i = 0; i < blocks.length; i++){
        if(
            (ball_current[0] > blocks[i].bottomLeft[0] && ball_current[0] < blocks[i].bottomRight[0]) &&
            ((ball_current[1] + ball_diameter) > blocks[i].bottomLeft[1] && ball_current[1] < blocks[i].topLeft[1])
        ){
            const all_blocks = Array.from(document.querySelectorAll('.block'))
            all_blocks[i].classList.remove('block')
            blocks.splice(i,1)
            changeDirection()
            score++
        }

        if(blocks.length === 0){
            clearInterval(timer_id)
            score_display.innerText = `Congratulations! You crushed all ${score} blocks.`
        } else {
            score_display.innerText = `Score: ${score}`
        }
    }

    //check for wall collisions
    if (
        ball_current[0] >= grid_width - ball_diameter || 
        ball_current[1] >= grid_height - ball_diameter ||
        ball_current[0] <= 0
        ){
        changeDirection()
    }

    // check for user collision
    if(
        (ball_current[0] > user_current[0] && ball_current[0] < user_current[0] + block_width) &&
        (ball_current[1] > user_current[1] && ball_current[1] <= user_current[1] + block_height)
    ){
        changeDirection()
    }
    
    // check for game over
    if(ball_current[1] <= 0){
       // score.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveUser)
        clearInterval(timer_id)
        score_display.innerText = `GAME OVER! Your score was ${score}`
    }
}

// change ball direction
function changeDirection() {
    if(xDirection === 2 && yDirection === 2){
        yDirection = -2
        return /////............
    }
    if(xDirection === 2 && yDirection === -2){
        xDirection = -2
        return
    }
    if(xDirection === -2 && yDirection === -2){
        yDirection = 2
        return
    }
    if(xDirection === -2 && yDirection === 2){
        xDirection = 2
        return
    }
}

start.addEventListener('click', () => {
    if(game_status === 'not live'){
        timer_id = setInterval(moveBall, 30)
        game_status = 'live'
    }
})



