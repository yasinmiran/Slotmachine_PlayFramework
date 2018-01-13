# play-java-slotmachine-game

<h3>Object oriented Programming module - Assessment 2 - slotmachine game.</h3>
<h4>Technologies used</h4>
<ul>
    <li>For data Persistence - MongoDB (Using <a href="https://github.com/morellik/play-morphia">Playmorphia</a>)</li>
    <li>Backend - PlayFramework with Java</li>
    <li>Frontend - HTML with Twitter Bootstrap + JS (Typescript in development)</li>
</ul>

<p>This JavaFx application was developed to have similar functionalities of a classic three reel Slot Machine. UI was designed with Java FX and JavaFx CSS and the user can 'add coins' and 'place bets' as well. When the user press the spin button all the symbols starts spinning simultaneously on three wheels. (each reel is loaded with 6 symbols init) The user can click on either of the three reels to stop it from spinning. And if all the three reels match with each other he/she will gets awarded with credits. The value of each symbol is as follows.<p><br>
<ul>
    <li>1. RedSeven: 7</li>
    <li>2. Bell: 6</li>
    <li>3. Watermelon: 5</li>
    <li>4. Plum: 4</li>
    <li>5. Lemon: 3</li>
    <li>6. Cherry: 2</li>
</ul>
<br>
<p><em>Winning Credit Amount = Value of the symbol * Bet</em>
User can also view the statistics and additionally they can save the statistics to a text file as well.</p>

## Running

Run this using [sbt](http://www.scala-sbt.org/). (scala build tool)

```
sbt run
```

And then go to http://localhost:9000 to see the running web application.
