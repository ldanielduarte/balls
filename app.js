class App
{
    /**
     * App constructor.
     * 
     * @param {HTMLElement} stage
     * @param {HTMLElement} counter
     * @param {HTMLElement} primeNumberCounter
     * @param {HTMLElement} button
     */
    constructor(stage, counter, primeNumberCounter, button, animationLifeTimeInput) {
        this.stage = stage;
        this.counter = counter;
        this.primeNumberCounter = primeNumberCounter;
        this.button = button;
        this.animationLifeTimeInput = animationLifeTimeInput;

        this.nBalls = 30;
        this.ballsFactory = new BallsFactory();
        this.onHoldBalls = [];
        this.activeBalls = [];
        this.laneWidth = 300;
        this.animationLifeTime = Number(this.animationLifeTimeInput.value);
        this.animationInterval = 10;
        this.currentTime = 0;
        this.ballsFinished = 0;
        this.primeBallsFinished = 0;
    }

    /**
     * Get a random whole number inside and inclusive a range number.
     * 
     * @param {int} min 
     * @param {int} max 
     */
    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Check if a given number is prime.
     * 
     * @param {int} number 
     */
    static checkIfNumberIsPrime(number) {
        for (let i = 2; i < number; i++) {
            if (number % i === 0) {
                return false;
            }

            return number > 1;
        }
    }

    userInteraction() {
        if (this.button.innerHTML === 'PLAY') {
            this.resetAnimation();
            this.button.innerHTML = 'PAUSE';
        } else if (this.button.innerHTML === 'PAUSE') {
            this.pause();
            this.button.innerHTML = 'RESUME';
        } else if (this.button.innerHTML === 'RESUME') {
            this.button.innerHTML = 'PAUSE';
            this.resume();
        }
    }

    /**
     * Resets active and on hold balls,
     * and restarts animation and its timer.
     */
    resetAnimation() {
        this.animationLifeTime = Number(this.animationLifeTimeInput.value);
        this.stage.innerHTML = '';
        this.ballsFinished = 0;
        this.counter.innerHTML = this.ballsFinished;
        this.primeBallsFinished = 0;
        this.primeNumberCounter.innerHTML = this.primeBallsFinished;
        this.currentTime = 0;
        this.activeBalls = [];
        this.onHoldBalls = this.ballsFactory.generateBalls();
        this.paused = false;
        this.startTimer();
    }

    /**
     * Timer to orchestrate the animation.
     */
    startTimer() {
        let self = this;

        this.timer = window.setInterval(
            function() {
                // to let the last balls finish ("around 3 secs") add the time that a ball takes to finish.
                if (self.currentTime > self.animationLifeTime + Number(self.animationLifeTime / self.nBalls)) {
                    self.button.innerHTML = 'PLAY';
                    clearInterval(self.timer);
                } else if (!self.paused) {
                    self.currentTime += self.animationInterval;
                    
                    self.doAnimation(self.currentTime);
                }
            },
            this.animationInterval
        );
    }

    /**
     * Pause animation
     */
    pause() {
        this.paused = true;
    }

    /**
     * Resume animation
     */
    resume() {
        this.paused = false;
    }

    /**
     * Animation
     * 
     * @param {int} time 
     */
    doAnimation(time) {
        // Total animation time / number of balls = each ball animation life time.
        // In this case: 3000 / 30 = 100
        // If timer is currently at 0 or at a number which is multipliable by 100,
        // activate another ball.
        if (typeof this.onHoldBalls[this.activeBalls.length] !== 'undefined'
            && (time === this.animationInterval || (time % (this.animationLifeTime / this.nBalls)) === 0)
        ) {
            this.stage.appendChild(this.onHoldBalls[this.activeBalls.length]);

            this.activeBalls.push(this.onHoldBalls[this.activeBalls.length]);
        }

        // animate balls.
        this.activeBalls.forEach(
            (ball) => {
                if (ball.style.display === 'none')
                {
                    return;
                }

                let currentX = Number(ball.style.left.replace('px', ''));
                // Each ball will move forward in X axys: lane width / ball animation life time.
                // Multiple by 10 because timer is running each 10milisecs.
                let xIncrement = (this.laneWidth / (this.animationLifeTime / this.nBalls) * this.animationInterval);
                let newX = currentX + xIncrement;

                if (newX >= ball._maxX) {
                    ball._audio.play();
                    ball.style.display = 'none';
                    this.ballsFinished++;
                    this.counter.innerHTML = this.ballsFinished;

                    if (ball._prime) {
                        this.primeBallsFinished++;
                        this.primeNumberCounter.innerHTML = this.primeBallsFinished;
                    }
                } else {
                    ball.style.left = newX + 'px';
                }
            }
        );
    }
}
