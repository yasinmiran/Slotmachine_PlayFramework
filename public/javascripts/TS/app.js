var _this = this;
var Symbol = (function () {
    function Symbol(imageUrl, imageValue) {
        this._url = imageUrl;
        this._value = imageValue;
    }
    Symbol.prototype.getImage = function () {
        return this._url;
    };
    Symbol.prototype.setImage = function (value) {
        this._url = value;
    };
    Symbol.prototype.getValue = function () {
        return this._value;
    };
    Symbol.prototype.setValue = function (value) {
        this._value = value;
    };
    Symbol.prototype.equals = function (s) {
        return this.getValue() === s.getValue();
    };
    return Symbol;
}());
var Reel = (function () {
    function Reel(reelName) {
        this._imageCollection = [];
        this._reelId = reelName;
        this._imageCollection.push(new Symbol('/assets/images/cherry.png', 2));
        this._imageCollection.push(new Symbol('/assets/images/lemon.png', 3));
        this._imageCollection.push(new Symbol('/assets/images/plum.png', 4));
        this._imageCollection.push(new Symbol('/assets/images/watermelon.png', 5));
        this._imageCollection.push(new Symbol('/assets/images/bell.png', 6));
        this._imageCollection.push(new Symbol('/assets/images/redseven.png', 7));
        this.shuffle();
    }
    Reel.prototype.shuffle = function () {
        try {
            document.getElementById(this._reelId).src
                = this._imageCollection[Math.floor(Math.random() * 6)].getImage();
        }
        catch (err) {
            console.log(err);
        }
    };
    Reel.prototype.spin = function () {
        this._stopState = ci(this);
        function ci(o) {
            return setInterval(function () {
                var reel = document.getElementById(o._reelId);
                var rand = Math.floor(Math.random() * 6);
                var symbol = o._imageCollection[rand];
                reel.src = symbol.getImage();
                o.lastSymbol = symbol;
            }, 70);
        }
    };
    Reel.prototype.stop = function () {
        window.clearInterval(this._stopState);
    };
    Object.defineProperty(Reel.prototype, "lastSymbol", {
        get: function () {
            return this._lastSymbol;
        },
        set: function (value) {
            this._lastSymbol = value;
        },
        enumerable: true,
        configurable: true
    });
    return Reel;
}());
var Player = (function () {
    function Player() {
        this._totalWins = 0;
        this._totalLoses = 0;
        this._totalPartialWins = 0;
        this._totalSpins = 0;
        this._creditsWon = 0;
        this._creditsLost = 0;
    }
    Object.defineProperty(Player.prototype, "totalWins", {
        get: function () {
            return this._totalWins;
        },
        set: function (value) {
            this._totalWins = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "totalLoses", {
        get: function () {
            return this._totalLoses;
        },
        set: function (value) {
            this._totalLoses = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "totalPartialWins", {
        get: function () {
            return this._totalPartialWins;
        },
        set: function (value) {
            this._totalPartialWins = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "totalSpins", {
        get: function () {
            return this._totalSpins;
        },
        set: function (value) {
            this._totalSpins = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "creditsWon", {
        get: function () {
            return this._creditsWon;
        },
        set: function (value) {
            this._creditsWon = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "creditsLost", {
        get: function () {
            return this._creditsLost;
        },
        set: function (value) {
            this._creditsLost = value;
        },
        enumerable: true,
        configurable: true
    });
    return Player;
}());
var SlotMachineHttp = (function () {
    function SlotMachineHttp() {
        this.http = new XMLHttpRequest();
    }
    SlotMachineHttp.prototype.get = function (url, callback) {
        this.http.open('GET', url, true);
        var self = this;
        this.http.onload = function () {
            if (self.http.status === 200) {
                callback(null, self.http.responseText);
            }
            else {
                callback('Error: ' + self.http.status);
            }
        };
        this.http.send();
    };
    SlotMachineHttp.prototype.post = function (url, data, callback) {
        this.http.open('POST', url, true);
        this.http.setRequestHeader('Content-type', 'application/json');
        var self = this;
        this.http.onload = function () {
            callback(null, self.http.responseText);
        };
        this.http.send(JSON.stringify(data));
    };
    return SlotMachineHttp;
}());
// Main ----------------------------------------------------------------------------------------------------------------
var creditsAmount = 10;
var betAmount = 0;
var reelLabelClicked = false;
var resultsEvaluated = true;
var betMaxClicked = false;
var spinning = false;
var reel1 = new Reel("reel_1");
var reel2 = new Reel("reel_2");
var reel3 = new Reel("reel_3");
var elements = [];
var player = new Player();
var betOne = function (e) {
    e.preventDefault();
    if (_this.creditsAmount > 0) {
        _this.creditsAmount--;
        _this.betAmount++;
        _this.updateInfo();
    }
    else {
        alert("No Credits Left to bet! Add more!");
    }
};
var betMax = function (e) {
    e.preventDefault();
    if (!_this.betMaxClicked) {
        if (_this.creditsAmount >= 3) {
            _this.betMaxClicked = true;
            _this.creditsAmount -= 3;
            _this.betAmount += 3;
            _this.updateInfo();
        }
    }
    else {
        alert("You already used that feature!");
    }
};
var addCoin = function (e) {
    e.preventDefault();
    _this.creditsAmount++;
    _this.updateInfo();
};
var resetCoins = function (e) {
    e.preventDefault();
    if (_this.betAmount > 0) {
        _this.creditsAmount += _this.betAmount;
        _this.betAmount = 0;
        _this.betMaxClicked = false;
        _this.updateInfo();
        alert("Bet amount refunded!");
    }
    else {
        alert("No bet to refund!");
    }
};
var spin = function (e) {
    e.preventDefault();
    if (!_this.spinning && _this.betAmount > 0) {
        _this.reel1.spin();
        _this.reel2.spin();
        _this.reel3.spin();
        _this.player.totalSpins = _this.player.totalSpins + 1;
        elementState(false);
        _this.resultsEvaluated = false;
        displayMessage("Good Luck!");
        document.getElementById('title').className = 'animated infinite pulse';
    }
};
var stats = function (e) {
    e.preventDefault();
    try {
        new SlotMachineHttp().post('http://localhost:9000/stats', {
            totalWins: player.totalWins,
            totalLoses: player.totalLoses,
            totalPartialWins: player.totalPartialWins,
            totalSpins: player.totalSpins,
            creditsWon: player.creditsWon,
            creditsLost: player.creditsLost
        }, function (e, b) {
            e ? console.log(e) : window.open("/").document.write(b);
        });
    }
    catch (e) {
        console.log(e);
    }
};
var stopReels = function (e) {
    e.preventDefault();
    _this.reelLabelClicked = !_this.reelLabelClicked;
    _this.reel1.stop();
    _this.reel2.stop();
    _this.reel3.stop();
    _this.spinning = false;
    _this.betMaxClicked = false;
    elementState(true);
    document.getElementById('title').className = 'animated pulse';
    evaluateResults(e);
    updateInfo();
};
var evaluateResults = function (e) {
    e.preventDefault();
    if (!_this.resultsEvaluated) {
        if (_this.reel1.lastSymbol.equals(_this.reel2.lastSymbol)
            && _this.reel2.lastSymbol.equals(_this.reel3.lastSymbol)) {
            var winAmount = _this.reel1.lastSymbol.getValue() * _this.betAmount;
            creditsAmount += winAmount;
            _this.player.creditsWon = _this.player.creditsWon + winAmount;
            _this.player.totalWins = _this.player.totalWins + 1;
            _this.betAmount = 0;
            updateInfo();
            displayMessage("You won! Matched 3 Reels | " + winAmount + "$ Added. Congratulations!");
        }
        else if (_this.reel1.lastSymbol.equals(_this.reel2.lastSymbol) ||
            _this.reel2.lastSymbol.equals(_this.reel3.lastSymbol) ||
            _this.reel1.lastSymbol.equals(_this.reel3.lastSymbol)) {
            var multiplier = 0;
            if (_this.reel1.lastSymbol.equals(_this.reel2.lastSymbol) ||
                _this.reel1.lastSymbol.equals(_this.reel3.lastSymbol)) {
                multiplier = _this.reel1.lastSymbol.getValue();
            }
            else {
                multiplier = _this.reel3.lastSymbol.getValue();
            }
            var winAmount = multiplier * _this.betAmount;
            creditsAmount += winAmount;
            _this.player.creditsWon = _this.player.creditsWon + winAmount;
            _this.player.totalPartialWins = _this.player.totalPartialWins + 1;
            _this.betAmount = 0;
            updateInfo();
            displayMessage("You won! Matched 2 Reels | " + winAmount + "$ Added. Good game!");
        }
        else {
            _this.player.creditsLost = _this.player.creditsLost + _this.betAmount;
            _this.player.totalLoses = _this.player.totalLoses + 1;
            _this.betAmount = 0;
            updateInfo();
            displayMessage("You lost! :( Matched None. Let's try again! :)");
        }
        _this.resultsEvaluated = true;
    }
};
function elementState(c) {
    elements.forEach(function (e) {
        e.disabled = !c;
        e.style.opacity = !c ? '0.4' : '1';
    });
}
function addEventListeners() {
    var _this = this;
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
    }
    catch (err) {
        console.log(err);
    }
    finally {
        console.log('Event:L:Added');
    }
    Array.from(document.getElementsByClassName('reel')).forEach(function (e) {
        e.addEventListener('click', _this.stopReels);
    });
}
function updateInfo() {
    try {
        document.querySelector('#credit-amount').innerHTML = 'Credit Amount: ' + this.creditsAmount + '$';
        document.querySelector('#bet-amount').innerHTML = 'Bet Amount: ' + this.betAmount + '$';
    }
    catch (err) {
        console.log(err);
    }
}
function displayMessage(m) {
    document.querySelector('#result-title').textContent = m;
}
addEventListeners();
updateInfo();
