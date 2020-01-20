class BallsFactory
{
    /**
     * BallsFactory constructor.
     * 
     * @param {int} nBalls 
     * @param {int} minNumberInterval 
     * @param {int} maxNumberInterval 
     */
    constructor(nBalls = 30, minNumberInterval = 1, maxNumberInterval = 60) {
        this._nBalls = nBalls;
        this._minNumberInterval = minNumberInterval;
        this._maxNumberInterval = maxNumberInterval;
        this._choosenNumbers = [];
        this._colorsSet = [
            'blue',
            'green',
            'gray',
            'lightblue',
            'orange',
            'pink',
        ];
    }

    // It can be smart to use getters and setters for your properties,
    // especially if you want to do something special with the value before returning them,
    // or before you set them.
    get ballsMaxX() {
        return this._ballsMaxX;
    }

    // The name of the getter/setter method cannot be the same as the name of the property.
    // Many programmers use an underscore character _ before the property name
    // to separate the getter/setter from the actual property.
    set ballsMaxX(x) {
        this._ballsMaxX = x;
    }

    get nBalls() {
        return this._nBalls;
    }

    set nBalls(n) {
        this._nBalls = n;
    }

    get minNumberInterval() {
        return this._minNumberInterval;
    }

    set minNumberInterval(number) {
        this._minNumberInterval = number;
    }

    get maxNumberInterval() {
        return this._maxNumberInterval;
    }

    set maxNumberInterval(number) {
        this._maxNumberInterval = number;
    }

    get choosenNumbers() {
        return this._choosenNumbers;
    }

    set choosenNumbers(numbers) {
        this._choosenNumbers = numbers;
    }

    get colorsSet() {
        return this._colorsSet;
    }

    set colorsSet(colorsSet) {
        this._colorsSet = colorsSet;
    }

    /**
     * It will generate n balls (the number set in the instantiation),
     * with a non repeated random whole number,
     * and a color from a defined set.
     */
    generateBalls() {
        this._choosenNumber = [];

        let balls = [];

        for (let i = 0; i < this._nBalls; i++) {
            let htmlBall = document.createElement('div');
            htmlBall._number = this.getAndStoreNonRepeatedRandomIntInclusive();
            htmlBall._prime = App.checkIfNumberIsPrime(htmlBall._number);
            htmlBall.id = 'ball-' +  htmlBall._number; // To validate prime numbers.

            let customProperties = {
                _color: this.getBallColor(htmlBall._number),
                _maxX: 300,
                _width: 6,
                _height: 6,
                _x: 0,
                _y: App.getRandomIntInclusive(4, 96),
                _audio: htmlBall._prime
                    ? new Audio('./resources/prime.mp3')
                    : new Audio('./resources/normal.mp3')
            };
            Object.assign(htmlBall, customProperties);

            let styles = {
                "backgroundColor": htmlBall._color,
                "position": "absolute",
                "border-radius": "50%",
                "display": "block",
                "left": htmlBall._x + "px",
                "top": htmlBall._y + "px",
                "width": htmlBall._width + "px",
                "height": htmlBall._height + "px"
            };
            Object.assign(htmlBall.style, styles);

            balls.push(htmlBall);
        }

        return balls;
    }

    /**
     * Check to which color a number is related to.
     * @param {int} number 
     */
    getBallColor(number) {
        // Reduce a dozens to unity number,
        // Map the number to find a color in the pre defined color set.
        let index = number / 10;

        index = index % 1 === 0 ? index - 1 : Math.trunc(index);

        return this.colorsSet[index];
    }

    /**
     * Get a random whole number, inside and inclusive a range number,
     * making sure is not repeated, within the total balls generated,
     * for each generateBalls() request.
     */
    getAndStoreNonRepeatedRandomIntInclusive() {
        let randomNumber;

        do {
            randomNumber = App.getRandomIntInclusive(this.minNumberInterval, this.maxNumberInterval);
        } while (this._choosenNumber.includes(randomNumber))

        this._choosenNumber.push(randomNumber);

        return randomNumber;
    }
}
