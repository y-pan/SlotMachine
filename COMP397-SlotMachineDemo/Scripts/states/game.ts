﻿module states {
    // GAME CLASS
    export class Game extends objects.Scene {

        fruits1: objects.Tile;
        fruits2: objects.Tile;
        fruits3: objects.Tile;
        background: objects.Background;
        horizontalLine: createjs.Rectangle;


        bet1Button: objects.BetButton;
        bet10Button: objects.BetButton;
        bet100Button: objects.BetButton;
        betMaxButton: objects.BetButton;
        spinButton: objects.BetButton;

        jackpotLabel: objects.Label;
        creditsLabel: objects.Label;
        betLabel: objects.Label;
        winningsLabel: objects.Label;
        messageLabel: objects.Label;
        
        bet: number = 0;
        credits: number = 1000;
        winnings: number = 0;
        jackpot: number = 5000;

        grapes: number = 0;
        bananas: number = 0;
        oranges: number = 0;
        cherries: number = 0;
        bars: number = 0;
        bells: number = 0;
        sevens: number = 0;
        blanks: number = 0;
        //winNumber: number = 0;
        //lossNumber: number = 0;

        // CONDITION VAR
        isSpinBegun: boolean = false;
        isPlayable: boolean;
        
        betLine: any;
        result: number; 

        // CONSTRUCTOR
        constructor() {
            super();
        }
          
        // PUBLIC METHODS
        public start(): void {       
                      
            // fruit window
            this.fruits1 = new objects.Tile("../../Assets/images/fruitsSheet69x759debug.png", 241, 240, null, 186, 3, 759,false,false);
            this.addChild(this.fruits1);          
            
            this.fruits2 = new objects.Tile("../../Assets/images/fruitsSheet69x759debug.png", 320, 240, null, 669, 3, 690, false, false);
            this.addChild(this.fruits2);    
                 
            this.fruits3 = new objects.Tile("../../Assets/images/fruitsSheet69x759debug.png", 396, 240, null, 222, 3, 205, false, false);
            this.addChild(this.fruits3); 

            // background
            this.background = new objects.Background("../../Assets/images/Background.png", 320, 240);
            this.addChild(this.background);
    
            // labels
            this.messageLabel = new objects.Label("Welcome!", "15px Consolas", "#00f", 600, 150);
            this.messageLabel.textAlign = "center";

            this.jackpotLabel = new objects.Label(this.normalize(this.jackpot, 6), "26px Consolas", "#f00", (190 + (640 - 375) * .5), 60);

            this.creditsLabel = new objects.Label(this.normalize(this.credits,6), "26px Consolas", "#f00", (93 + (640 - 375) * .5), 343);
            this.betLabel = new objects.Label(this.normalize(this.bet,3), "26px Consolas", "#f00", (167 + (640 - 375) * .5), 343);
            this.winningsLabel = new objects.Label(this.normalize(this.winnings, 6), "26px Consolas", "#f00", (282 + (640 - 375) * .5), 343);

            this.addChild(this.messageLabel);
            this.addChild(this.jackpotLabel);
            this.addChild(this.creditsLabel);
            this.addChild(this.betLabel);
            this.addChild(this.winningsLabel);

            // bet1Button
            this.bet1Button = new objects.BetButton("../../Assets/images/Bet1Button.png", (53 + (640 - 375) * .5), 416, 60, 60, 1);
            this.bet1Button.on("click", function () {
                this.bet = this.bet1Button.value;
                this.checkPlayable();
            }, this); 
            this.addChild(this.bet1Button);    

            // bet10Button
            this.bet10Button = new objects.BetButton("../../Assets/images/Bet10Button.png", (118 + (640 - 375) * .5), 416, 60, 60, 10);
            this.bet10Button.on("click", function () {
                this.bet = this.bet10Button.value;
                this.checkPlayable();
            }, this); 
            this.addChild(this.bet10Button);    

            // bet100Button
            this.bet100Button = new objects.BetButton("../../Assets/images/Bet100Button.png", (183 + (640 - 375) * .5), 416, 60, 60, 100);
            this.bet100Button.on("click", function () {
                this.bet = this.bet100Button.value;
                this.checkPlayable();
            }, this); 
            this.addChild(this.bet100Button);    

            // betMaxButton
            this.betMaxButton = new objects.BetButton("../../Assets/images/BetMaxButton.png", (248 + (640 - 375) * .5), 416, 60, 60, 999);
            this.betMaxButton.on("click", function () {
                this.bet = this.betMaxButton.value;
                this.checkPlayable();
            }, this); 
            this.addChild(this.betMaxButton);    

            // spinButton
            this.spinButton = new objects.BetButton("../../Assets/images/SpinButton.png", (319 + (640 - 375) * .5), 416, 60, 60, 0);
            this.spinButton.on("click", this.clickSpinButton, this); 
            this.addChild(this.spinButton);

            this.horizontalLine = new createjs.Rectangle(320, 240, 320, 3);
            
            // final
            stage.addChild(this);
            //alert(this.isSpinClicked);
        }

        public update(): void {

            // go spin
            if (this.isSpinBegun && !this.fruits1.hasEnded) {
                this.spinning(this.fruits1);
                //this.spinning(this.fruits2);
                //this.spinning(this.fruits3);
            }

            // wait entil spin stop
            if (this.fruits1.hasBegun && this.fruits1.hasEnded) {  // spinDoneCount++ after fruitX spin done 
                //TOADD && this.fruits2.hasEnded && this.fruits3.hasEnded
               

                this.applyResult(this.result);   // from result to set this.credits ... 
                this.messageLabel.text = this.result > 0 ? ("You win:\n\n" + this.result) : ("You lose:\n\n" + (-this.result));
                this.messageLabel.color = this.result > 0 ? "#00f" : "#f00";
                
                this.resetFruits();
                console.log("fruits1.hasBegun && this.fruits1.hasEnded to apply result");
            }
        }

        // --------------------------------------------------- PRIVATE METHODS------------------------------------------------------
        private clickSpinButton(event: createjs.MouseEvent): void { 
            console.log("here 1");
            
            this.checkPlayable(); // set this.isPlayable
            if (this.isPlayable) {          
                this.fruits1.hasBegun = true;      
                this.isSpinBegun = true;
                
                // get fruits so for result
                this.betLine = this.Reels();   // from Math.random() to generate betLine(), and set this.blank ... for determinWinnings();

                this.fruits1.goal = this.setGoalByFruit(this.betLine[0]);// from betLine() to get goal for "this.fruits1"
                this.fruits2.goal = this.setGoalByFruit(this.betLine[1]);
                this.fruits3.goal = this.setGoalByFruit(this.betLine[2]);
                // get result from fruits
                this.result = this.determineWinnings();  // from values of this.blanks ... to get result
                console.log("goals: " + this.betLine[0] + "|" + this.fruits1.goal + ", " + this.betLine[1] + "|" + this.fruits2.goal + ", " + this.betLine[2] + "|" + this.fruits3.goal + " @result: " + this.result);
                console.log("here now");
            }     
            //this.resetFruits();       
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``
        private spinning(fruitsX: objects.Tile): void {
            if (fruitsX.hasBegun && !fruitsX.hasEnded) {
                if (this.isSpinBegun) {
                    // get step
                    var step;
                    var MIN = 117, MAX = 669;
                    if (fruitsX.value > 0) {
                        if (fruitsX.value > 2) { step = 23; }
                        else { step = 12; }
                        fruitsX.regY -= step;
                        if (fruitsX.regY <= MIN) {
                            fruitsX.regY = 669 - (step + MIN - fruitsX.regY); // from 669 to 117, this 117 should not exist and set to 669 immediately
                            fruitsX.value--;                            
                        }
                        console.log("fruitsX.regY: " + fruitsX.regY + " go to " + fruitsX.goal);
                    } else {
                        step = 3;
                        if (fruitsX.regY <= fruitsX.goal + step*2 && fruitsX.regY >= fruitsX.goal - step*2) {
                            fruitsX.hasEnded = true;
                        } else {
                            fruitsX.regY -= step;
                            if (fruitsX.regY <= MIN) {
                                fruitsX.regY = 669 - (step + MIN - fruitsX.regY); // from 669 to 117, this 117 should not exist and set to 669 immediately
                                fruitsX.value--;
                            }
                        }
                        console.log("ELSE fruitsX.regY: " + fruitsX.regY + " go to " + fruitsX.goal);
                    }

                }
            }
        }

        private checkPlayable(): void {            
            if (!this.fruits1.hasBegun && !this.isSpinBegun) {
                if (this.bet > 0) {
                    if (this.credits < this.bet) {
                        this.isPlayable = false;
                        this.messageLabel.text = "Not enough\n\ncredits!";
                        this.messageLabel.color = "#f00";
                        this.bet = 0;
                        this.betLabel.text = this.normalize(this.bet, 3);
                    }
                    else {
                        this.isPlayable = true;
                        this.betLabel.text = this.normalize(this.bet, 3);
                    }
                } else {
                    this.isPlayable = false;
                    this.messageLabel.text = "Please bet";
                    this.messageLabel.color = "#f00";
                }
            }
        }
               

        private setGoalByFruit(fruit: string): number {

            var goal: number;
            switch (fruit) {
                case "Banana":
                    goal = 186;
                    break;
                case "Bar":
                    goal = 255;
                    break;
                case "Bell":
                    goal = 324;
                    break;
                case "Cherry":
                    goal = 393;
                    break;
                case "Grapes":
                    goal = 462;
                    break;
                case "Orange":
                    goal = 531;
                    break;
                case "Seven":
                    goal = 600;
                    break;
                case "blank":
                    goal = 669;
                    break;
            }
            return goal;
        }

        private resetFruits(): void {
            this.bananas = 0;//1
            this.bars = 0;// 2
            this.bells = 0;// 3
            this.cherries = 0;//4
            this.grapes = 0;// 5            
            this.oranges = 0;// 6          
            this.sevens = 0;//7
            this.blanks = 0;  //8

            this.fruits1.value = 3;
            this.fruits1.hasEnded = false;
            this.fruits1.hasBegun = false;

            this.fruits2.value = 3;
            this.fruits2.hasEnded = false;
            this.fruits2.hasBegun = false;

            this.fruits3.value = 3;
            this.fruits3.hasEnded = false;
            this.fruits3.hasBegun = false;

            this.isSpinBegun = false;
        }

        private resetAll(): void {
            this.credits = 1000;
            this.winnings = 0;
            this.jackpot = 5000; // what to do with jackpot ??
            //turn = 0;
            this.bet = 0;
            //winNumber = 0;
            //lossNumber = 0;
            //winRatio = 0;

            this.fruits1.value = 3;
            this.fruits1.hasEnded = false;
            this.fruits1.hasBegun = false;

            this.fruits2.value = 3;
            this.fruits2.hasEnded = false;
            this.fruits2.hasBegun = false;

            this.fruits3.value = 3;
            this.fruits3.hasEnded = false;
            this.fruits3.hasBegun = false;

            this.isSpinBegun = false;

        }
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++

        public determineWinnings(): number {
            var result:number = 0;
            if (this.blanks == 0) {
                if (this.grapes == 3) {
                    result = this.bet * 10;
                }
                else if (this.bananas == 3) {
                    result = this.bet * 20;
                }
                else if (this.oranges == 3) {
                    result = this.bet * 30;
                }
                else if (this.cherries == 3) {
                    result = this.bet * 40;
                }
                else if (this.bars == 3) {
                    result = this.bet * 50;
                }
                else if (this.bells == 3) {
                    result = this.bet * 75;
                }
                else if (this.sevens == 3) {
                    result = this.bet * 100;
                }
                else if (this.grapes == 2) {
                    result = this.bet * 2;
                }
                else if (this.bananas == 2) {
                    result = this.bet * 2;
                }
                else if (this.oranges == 2) {
                    result = this.bet * 3;
                }
                else if (this.cherries == 2) {
                    result = this.bet * 4;
                }
                else if (this.bars == 2) {
                    result = this.bet * 5;
                }
                else if (this.bells == 2) {
                    result = this.bet * 10;
                }
                else if (this.sevens == 2) {
                    result = this.bet * 20;
                }
                else if (this.sevens == 1) {
                    result = this.bet * 5;
                }
                else {
                    result = this.bet * 1;
                }
            } else {
                result = -this.bet;
            }
            return result;//$ 
        } // end of this.determineWinnings = function(): void 

        private applyResult(result: number): void {
            this.credits += result;
            this.creditsLabel.text = this.normalize(this.credits, null);
            this.winnings = result > 0 ? result : 0;
            this.winningsLabel.text = this.normalize(this.winnings, null);
        }

        public normalize(num: number, length: number): string {
            var output: string = "";
            var length: number = (length != null && length > 0) ? length : 6;

            switch (num.toString().length) {
                case 1:
                    output = "     " + num;
                    break;
                case 2:
                    output = "    " + num;
                    break;
                case 3:
                    output = "   " + num;
                    break;
                case 4:
                    output = "  " + num;
                    break;
                case 5:
                    output = " " + num;
                    break;
                case 6:
                    output = "" + num;
                    break;
            }

            return output;
        }      
        
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++

        public checkRange(value: number, lowerBounds: number, upperBounds: number): any {
            if (value >= lowerBounds && value <= upperBounds) {
                return value;
            }
            else {
                return !value;
            }
        } // end of this.checkRange = function (value: number, lowerBounds: number, upperBounds: number): any
       
        
        private Reels(): any {
            var betLine = [" ", " ", " "];
            var outCome = [0, 0, 0];

            for (var i = 0; i < 3; i++) {
                outCome[i] = Math.floor((Math.random() * 65) + 1);
                switch (outCome[i]) {
                    case this.checkRange(outCome[i], 1, 27):  // 41.5% probability
                        betLine[i] = "blank";
                        this.blanks++;
                        break;
                    case this.checkRange(outCome[i], 28, 37): // 15.4% probability
                        betLine[i] = "Grapes";
                        this.grapes++;
                        break;
                    case this.checkRange(outCome[i], 38, 46): // 13.8% probability
                        betLine[i] = "Banana";
                        this.bananas++;
                        break;
                    case this.checkRange(outCome[i], 47, 54): // 12.3% probability
                        betLine[i] = "Orange";
                        this.oranges++;
                        break;
                    case this.checkRange(outCome[i], 55, 59): //  7.7% probability
                        betLine[i] = "Cherry";
                        this.cherries++;
                        break;
                    case this.checkRange(outCome[i], 60, 62): //  4.6% probability
                        betLine[i] = "Bar";
                        this.bars++;
                        break;
                    case this.checkRange(outCome[i], 63, 64): //  3.1% probability
                        betLine[i] = "Bell";
                        this.bells++;
                        break;
                    case this.checkRange(outCome[i], 65, 65): //  1.5% probability
                        betLine[i] = "Seven";
                        this.sevens++;
                        break;
                }
            }
            return betLine; 
        } // end of this.Reels = function (): any
      

    }
} 