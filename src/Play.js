class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.strokes = 0
        this.totalStrokes = 0
        this.successShots = 0
        this.shotPercentage = 0.0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)
        
        //add text to track the number of shots 
        let textConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '20px',
            backgroundColor: '#FACADE',
            color: '#A56C84',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.golfText = this.add.text(width / 4, height / 8 - height / 10, `Shots: ${this.strokes} | Score: ${this.totalStrokes} | Shot Percentage: ${this.shotPercentage}%`, textConfig).setOrigin(0)

        // add walls
        let wallA = this.physics.add.sprite(0, height/4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width/2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width /2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        this.oneWay.setVelocityX(200)
        this.oneWay.body.setCollideWorldBounds(true)

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirectionX) 
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)

            //handle updating shot count on click
            this.strokes += 1
            this.golfText.setText(`Shots: ${this.strokes} | Score: ${this.totalStrokes} | Shot Percentage: ${this.shotPercentage}%`)
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball,cup) => {
            
            //tracking shot percentages and stroke totals
            //NOTE: I thought the "score" was just tracking the total amount of strokes made during play
            this.successShots++
            this.totalStrokes += this.strokes
            this.shotPercentage = Math.ceil((this.successShots / this.totalStrokes) * 100)
            this.strokes = 0

            //new ball reset logic
            this.ball.setPosition(width / 2, height - height / 10)

            //update UI text
            this.golfText.setText(`Shots: ${this.strokes} | Score: ${this.totalStrokes} | Shot Percentage: ${this.shotPercentage}%`)
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {

        this.moveObstacle(this.oneWay)
    }

    //function to move an obstacle across the screen but withing screen edges
    moveObstacle(sprite){
        if(sprite.x >= width - sprite.width / 2){
            sprite.setVelocityX(-200)
        }
        else if(sprite.x <= 0 + sprite.width / 2){
            sprite.setVelocityX(200)
        }
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/