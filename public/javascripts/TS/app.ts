interface ISymbol {

    /**
     * @param url sets the image associated with one of the symbols in a reel,
     *            represented by the Symbol Class implementing this Interface.
     */
    setImage(url: string): void;

    /**
     * @return the source location of the symbol(Image).
     */
    getImage(): string;

    /**
     * @param value which sets the value of the symbol as defined in the specification.
     */
    setValue(value: number): void;

    /**
     * @return the value of the Symbol.
     */
    getValue(): number;
}

class Symbol implements ISymbol {

    private _url: string;
    private _value: number;

    constructor(imageUrl: string, imageValue: number) {
        this._url = imageUrl;
        this._value = imageValue;
    }

    getImage(): string {
        return this._url;
    }

    setImage(value: string) {
        this._url = value;
    }

    getValue(): number {
        return this._value;
    }

    setValue(value: number) {
        this._value = value;
    }

    equals(s: Symbol): boolean {
        return this.getValue() === s.getValue();
    }
}

class Reel {

    private _reelId: string;
    private _lastSymbol: Symbol;
    private _imageCollection: Symbol[] = [];
    private _stopState: number;

    constructor(reelName: string) {

        this._reelId = reelName;

        this._imageCollection.push(new Symbol('/assets/images/cherry.png', 2));
        this._imageCollection.push(new Symbol('/assets/images/lemon.png', 3));
        this._imageCollection.push(new Symbol('/assets/images/plum.png', 4));
        this._imageCollection.push(new Symbol('/assets/images/watermelon.png', 5));
        this._imageCollection.push(new Symbol('/assets/images/bell.png', 6));
        this._imageCollection.push(new Symbol('/assets/images/redseven.png', 7));

        this.shuffle();
    }

    shuffle() {

        try {
            (<HTMLImageElement>document.getElementById(this._reelId)).src
                = this._imageCollection[Math.floor(Math.random() * 6)].getImage();
        } catch (err) {
            console.log(err)
        }

    }

    spin() {

        this._stopState = ci(this);

        function ci(o: Reel): number {
            return setInterval(function (): void {

                let reel = (<HTMLImageElement>document.getElementById(o._reelId));
                let rand = Math.floor(Math.random() * 6);
                let symbol: Symbol = o._imageCollection[rand];

                reel.src = symbol.getImage();
                o.lastSymbol = symbol;

            }, 70);
        }
    }

    stop() {
        window.clearInterval(this._stopState);
    }

    get lastSymbol(): Symbol {
        return this._lastSymbol;
    }

    set lastSymbol(value: Symbol) {
        this._lastSymbol = value;
    }

}

class Player {

    private _totalWins: number = 0;
    private _totalLoses: number = 0;
    private _totalPartialWins: number = 0;
    private _totalSpins: number = 0;
    private _creditsWon: number = 0;
    private _creditsLost: number = 0;

    constructor() {
    }

    get totalWins(): number {
        return this._totalWins;
    }

    set totalWins(value: number) {
        this._totalWins = value;
    }

    get totalLoses(): number {
        return this._totalLoses;
    }

    set totalLoses(value: number) {
        this._totalLoses = value;
    }

    get totalPartialWins(): number {
        return this._totalPartialWins;
    }

    set totalPartialWins(value: number) {
        this._totalPartialWins = value;
    }

    get totalSpins(): number {
        return this._totalSpins;
    }

    set totalSpins(value: number) {
        this._totalSpins = value;
    }

    get creditsWon(): number {
        return this._creditsWon;
    }

    set creditsWon(value: number) {
        this._creditsWon = value;
    }

    get creditsLost(): number {
        return this._creditsLost;
    }

    set creditsLost(value: number) {
        this._creditsLost = value;
    }
}

interface ArrayConstructor {
    from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

class SlotMachineHttp {

    private http: XMLHttpRequest;

    constructor() {
        this.http = new XMLHttpRequest();
    }

    get (url, callback) {

        this.http.open('GET', url, true);

        let self = this;
        this.http.onload = function () {
            if (self.http.status === 200) {
                callback(null, self.http.responseText);
            } else {
                callback('Error: ' + self.http.status);
            }
        };

        this.http.send();
    }

    post(url, data, callback) {

        this.http.open('POST', url, true);
        this.http.setRequestHeader('Content-type', 'application/json');

        let self = this;
        this.http.onload = function () {
            callback(null, self.http.responseText);
        };

        this.http.send(JSON.stringify(data));
    }
}

// Main ----------------------------------------------------------------------------------------------------------------

let creditsAmount: number = 10;
let betAmount: number = 0;
let reelLabelClicked: boolean = false;
let resultsEvaluated: boolean = true;
let betMaxClicked: boolean = false;
let spinning: boolean = false;
let reel1 = new Reel("reel_1");
let reel2 = new Reel("reel_2");
let reel3 = new Reel("reel_3");
let elements: HTMLButtonElement[] = [];
const player = new Player();

const betOne = (e: Event): void => {
    e.preventDefault();
    if (this.creditsAmount > 0) {
        this.creditsAmount--;
        this.betAmount++;
        this.updateInfo();
    } else {
        alert("No Credits Left to bet! Add more!");
    }
};

const betMax = (e: Event): void => {
    e.preventDefault();

    if (!this.betMaxClicked) {
        if (this.creditsAmount >= 3) {
            this.betMaxClicked = true;
            this.creditsAmount -= 3;
            this.betAmount += 3;
            this.updateInfo();
        }
    } else {
        alert("You already used that feature!");
    }

};

const addCoin = (e: Event): void => {
    e.preventDefault();
    this.creditsAmount++;
    this.updateInfo();
};

const resetCoins = (e: Event): void => {
    e.preventDefault();

    if (this.betAmount > 0) {
        this.creditsAmount += this.betAmount;
        this.betAmount = 0;
        this.betMaxClicked = false;
        this.updateInfo();
        alert("Bet amount refunded!");
    } else {
        alert("No bet to refund!");
    }
};

const spin = (e: Event): void => {
    e.preventDefault();

    if (!this.spinning && this.betAmount > 0) {
        this.reel1.spin();
        this.reel2.spin();
        this.reel3.spin();
        this.player.totalSpins = this.player.totalSpins + 1;
        elementState(false);
        this.resultsEvaluated = false;
        displayMessage("Good Luck!");
        document.getElementById('title').className = 'animated infinite pulse';
    }
};

const stats = (e: Event): void => {
    e.preventDefault();

    try {
        new SlotMachineHttp().post('http://localhost:9000/stats', {

            totalWins: player.totalWins,
            totalLoses: player.totalLoses,
            totalPartialWins: player.totalPartialWins,
            totalSpins: player.totalSpins,
            creditsWon: player.creditsWon,
            creditsLost: player.creditsLost

        }, (e, b) => {
            e ? console.log(e) : window.open("/").document.write(b);
        });

    } catch (e) {
        console.log(e)
    }
};

const stopReels = (e: Event): void => {
    e.preventDefault();

    this.reelLabelClicked = !this.reelLabelClicked;

    this.reel1.stop();
    this.reel2.stop();
    this.reel3.stop();

    this.spinning = false;
    this.betMaxClicked = false;
    elementState(true);

    document.getElementById('title').className = 'animated pulse';
    evaluateResults(e);
    updateInfo();
};

const evaluateResults = (e: Event): void => {
    e.preventDefault();

    if (!this.resultsEvaluated) {

        if (this.reel1.lastSymbol.equals(this.reel2.lastSymbol)
            && this.reel2.lastSymbol.equals(this.reel3.lastSymbol)) {

            let winAmount = this.reel1.lastSymbol.getValue() * this.betAmount;
            creditsAmount += winAmount;
            this.player.creditsWon = this.player.creditsWon + winAmount;
            this.player.totalWins = this.player.totalWins + 1;
            this.betAmount = 0;
            updateInfo();
            displayMessage(`You won! Matched 3 Reels | ${winAmount}$ Added. Congratulations!`);

        } else if (this.reel1.lastSymbol.equals(this.reel2.lastSymbol) ||
            this.reel2.lastSymbol.equals(this.reel3.lastSymbol) ||
            this.reel1.lastSymbol.equals(this.reel3.lastSymbol)) {

            let multiplier: number = 0;

            if (this.reel1.lastSymbol.equals(this.reel2.lastSymbol) ||
                this.reel1.lastSymbol.equals(this.reel3.lastSymbol)) {
                multiplier = this.reel1.lastSymbol.getValue();
            } else {
                multiplier = this.reel3.lastSymbol.getValue();
            }

            let winAmount = multiplier * this.betAmount;
            creditsAmount += winAmount;
            this.player.creditsWon = this.player.creditsWon + winAmount;
            this.player.totalPartialWins = this.player.totalPartialWins + 1;
            this.betAmount = 0;
            updateInfo();
            displayMessage(`You won! Matched 2 Reels | ${winAmount}$ Added. Good game!`);

        } else {

            this.player.creditsLost = this.player.creditsLost + this.betAmount;
            this.player.totalLoses = this.player.totalLoses + 1;
            this.betAmount = 0;
            updateInfo();
            displayMessage(`You lost! :( Matched None. Let's try again! :)`);
        }

        this.resultsEvaluated = true;
    }

};

function elementState(c: boolean): void {
    elements.forEach(e => {
        e.disabled = !c;
        e.style.opacity = !c ? '0.4' : '1';
    });
}

function addEventListeners(): void {

    this.elements[0] = document.querySelector('#bet-one');
    this.elements[1] = document.querySelector('#bet-max');
    this.elements[2] = document.querySelector('#reset');
    this.elements[3] = document.querySelector('#add-coin');
    this.elements[4] = document.querySelector('#spin');
    this.elements[5] = document.querySelector('#stats');

    try {
        this.elements[0].addEventListener('click', this.betOne);
        this.elements[1].addEventListener('click', this.betMax);
        this.elements[2].addEventListener('click', this.resetCoins);
        this.elements[3].addEventListener('click', this.addCoin);
        this.elements[4].addEventListener('click', this.spin);
        this.elements[5].addEventListener('click', this.stats);

    } catch (err) {
        console.log(err)
    } finally {
        console.log('Event:L:Added')
    }

    Array.from(document.getElementsByClassName('reel')).forEach((e) => {
        e.addEventListener('click', this.stopReels);
    });

}

function updateInfo(): void {

    try {
        document.querySelector('#credit-amount').innerHTML = 'Credit Amount: ' + this.creditsAmount + '$';
        document.querySelector('#bet-amount').innerHTML = 'Bet Amount: ' + this.betAmount + '$';
    } catch (err) {
        console.log(err)
    }

}

function displayMessage(m: string): void {
    document.querySelector('#result-title').textContent = m;
}

addEventListeners();
updateInfo();
