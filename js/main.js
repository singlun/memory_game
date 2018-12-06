
// Global variables

//We don't use the todate's date, however we create a past date,
//which allows to set the time (Minutes and Seconds) to zeors.
let startDate = new Date('2014-01-01 00:00:00');

let cardFragment;
let icons = loadIcons();
let selected = false;
let selectCounter = 0;
let eventFunction;
let timerFunction;
let grid;
let gridElement;
let firstCardId;
let secondCardId;
let firstSelectedCard;
let secondSelectedCard;
let noOfMoves = 0;
let noOfStars = 3;
let correctMatch = 0;
let firstCard;
let secondCard;
let secTime = 0;
let minTime = 0;
let restartElement;
let restartFunc;
let pairedCard = new Array;

// The function winModal() is to display the Modal when you win the Game
function winModal() {
      let modal = document.querySelector("#modal");
      let modalOverlay = document.querySelector("#modal-overlay");
      let modalContent = document.querySelector("#modal-content");

      // The DOM classList() "remove()"" function is to remove the "close" class
      // which is defined in the main.css file, "opened" class will be
      // added to the "modal" and the "modal-overlay" span class.
      // It actually acts as a toggle method.

      document.querySelector('#modal').classList.remove("closed");
      document.querySelector('#modal-overlay').classList.remove("closed");
      document.querySelector('#modal').classList.add("opened");
      document.querySelector('#modal-overlay').classList.add("opened");

      const requiredTime = "Time required " + (minTime < 10 ? "0" + minTime : minTime) + ":" + (secTime < 10 ? "0" + secTime : secTime);

      //This is the Modal Content, we use the Template Literals to generate the content
      modalContent.innerHTML = `<p class="modalHeading">Congratualations! You Won!</p><p class="p1">with ${noOfMoves} moves and ${noOfStars} stars</p><p class="p2">${requiredTime}</p><p class="p3"><button onclick="winModal();" class="modal-close-button" id="close-button">Restart</button></p>`;

      let closeButton = document.querySelector("#close-button");

      closeButton.addEventListener("click", function() {
          document.querySelector('#modal').classList.remove("opened");
          document.querySelector('#modal-overlay').classList.remove("opened");
          document.querySelector('#modal').classList.add("closed");
          document.querySelector('#modal-overlay').classList.add("closed");
          restartGame();
      });
}

//This fuction start up the timer and create the Event Listener.
function startGame() {
    document.querySelector('#start').remove();
    document.querySelector('#header-middle-start').innerHTML = '<i id="start" class="fas fa-play game-start"></i> Start Game';
    document.querySelector('#restart').remove();
    document.querySelector('#header-icons-restart').innerHTML = '<i onclick="restartGame();" id="restart" class="fas fa-redo replay"></i>';
    timerFunction = setInterval(startTimer, 1000);
    createEvenListener();
}

//This is the "Timer" which display the time of every one second.
function startTimer() {

    //Add one seconds to the Date.
    startDate.setSeconds(startDate.getSeconds() + 1);

    secTime = Math.floor(startDate / 1000) % 60;
    minTime = startDate.getMinutes();
    starRating();

    //Display the time
    document.querySelector("#startTimer").innerHTML = "Time " + (minTime < 10 ? "0" + minTime : minTime) + ":" + (secTime < 10 ? "0" + secTime : secTime);
}

//Stop the timer , this occurs when restart is clicked or when we finish the game.
function stopTimer() {
    //Reset the date to the begin Date.
    startDate = new Date('2014-01-01 00:00:00');
    clearTimeout(timerFunction);
}

//This fuction is to Load all the Icons.
//By default ther are 16 Icons, all are from the source of "Font Awesome".
//Link "https://fontawesome.com/?from=io"

function loadIcons() {
        let icons = ['<i id="fnt" data-toggle-id="king" class="fas fa-chess-king"></i>',
                     '<i id="fnt" data-toggle-id="pawn" class="fas fa-chess-pawn"></i>',
                     '<i id="fnt" data-toggle-id="cat" class="fas fa-cat"></i>',
                     '<i id="fnt" data-toggle-id="dog" class="fas fa-dog"></i>',
                     '<i id="fnt" data-toggle-id="dove" class="fas fa-dove"></i>',
                     '<i id="fnt" data-toggle-id="horse" class="fas fa-horse"></i>',
                     '<i id="fnt" data-toggle-id="spider" class="fas fa-spider"></i>',
                     '<i id="fnt" data-toggle-id="frog" class="fas fa-frog"></i>',
                     '<i id="fnt" data-toggle-id="fish" class="fas fa-fish"></i>',
                     '<i id="fnt" data-toggle-id="dragon" class="fas fa-dragon"></i>',
                     '<i id="fnt" data-toggle-id="crow" class="fas fa-crow"></i>',
                     '<i id="fnt" data-toggle-id="ghost" class="fas fa-ghost"></i>',
                     '<i id="fnt" data-toggle-id="crossbones" class="fas fa-skull-crossbones"></i>',
                     '<i id="fnt" data-toggle-id="bone" class="fas fa-bone"></i>',
                     '<i id="fnt" data-toggle-id="knight" class="fas fa-chess-knight"></i>',
                     '<i id="fnt" data-toggle-id="hippo" class="fas fa-hippo"></i>'];


       let selectedIcons = new Array;

       //Shuffle the whole Icon Lists.
       icons = shuffle(icons);

       let counter = 0;

       //Select first 8 Icons For the grid;
       for (icon of icons) {
         selectedIcons[counter] = icon;
         if (counter === 7) {
            break;
         }
         counter = counter + 1;
       }

       //Join the 8 Selected Icons together.
       let gridIcons = [...selectedIcons, ...selectedIcons];

       //Shuffle the Whole grid Icon Lists.
       gridIcons = shuffle(gridIcons);


      //This part extracts the "id" of the element which is "id=fnt", inorder
      //to specify the location of the element in the grid we
      //add a numeric value to it. This is convenient for locating the
      //elements in the grid.
       counter = 0;
       let stringReplace = "";
       let replacStr;
       for (let i = 0; i < gridIcons.length; i++) {
            stringReplace = gridIcons[i];
            replacStr = stringReplace.substr(7,3);
            gridIcons[i] = stringReplace.replace(replacStr,replacStr + "-" + counter);
            counter = counter + 1;
       }

       return gridIcons;
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(icons) {

  let currentIndex = icons.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = icons[currentIndex];
    icons[currentIndex] = icons[randomIndex];
    icons[randomIndex] = temporaryValue;
  }

  return icons;
}

//This function Draw the grid, and add styles to it.
function gameSetup() {

      //Create New span element for.
      const mainElement = document.querySelector("main");
      gridElement = document.createElement('span');
      gridElement.id = "gridId";
      gridElement.className = "grid";
      mainElement.appendChild(gridElement);


      cardFragment = document.createDocumentFragment();
      for (let i = 0; i < 16 ; i++) {
          const cardElement = document.createElement('span');
          cardElement.id = "crd-" + i;
          cardElement.className = "card-class";

          const iconElement = document.createElement('span');
          iconElement.id = "icn-" + i;
          iconElement.className = "card-icon-class";
          cardElement.appendChild(iconElement);
          cardFragment.appendChild(cardElement);
      }

      let cardMarginClass;
      let marginClass;

      const grid = document.querySelector('#gridId');
      grid.appendChild(cardFragment);

      for (let i = 0; i < 16 ; i++) {
          if (i >= 4){
             cardMarginClass = document.querySelector("#crd-" + i);
             marginClass = cardMarginClass.classList;
             marginClass.add("card-class-second-row");
          }
      }

      document.querySelector('#modal').classList.add("closed");
      document.querySelector('#modal-overlay').classList.add("closed");

}

//This function restarts the Game, the following procedure will be:
//  1. Stop the Timer.
//  2. Remove the Event Listener.
//  3. Re-Initialize all the variable to the defalut values.
//  4. Re-set all the display timer, No of moves, stars to the initial value.
function restartGame() {

      stopTimer();
      gridElement = document.querySelector("#gridId");
      gridElement.removeEventListener('click', eventFunction);
      reInitialize()
      document.querySelector("#startTimer").innerHTML = "Time 00:00";
      document.querySelector("#noMoves").innerHTML = "0 Moves";
      document.querySelector('#icons-star-one').className = "fas fa-star";
      document.querySelector('#icons-star-two').className = "fas fa-star";
      document.querySelector('#icons-star-three').className = "fas fa-star";
      document.querySelector('#start').remove();
      document.querySelector('#header-middle-start').innerHTML = '<i id="start" onclick="startGame();" class="fas fa-play game-not-start"></i> Start Game';
      document.querySelector('#restart').remove();
      document.querySelector('#header-icons-restart').innerHTML = '<i id="restart" class="fas fa-redo replay"></i>';

      gameSetup();


}

//This function reInitialize all the variables to the default value.
function reInitialize() {
      icons = loadIcons();
      gridElement.remove();
      selected = false;
      selectCounter = 0;
      eventFunction = "";
      grid = "";
      firstCardId = "";
      secondCardId = "";
      noOfMoves = 0;
      correctMatch = 0;
      firstCard = "";
      secondCard = "";
      secTime = 0;
      minTime = 0;
      noOfStars = 3;
}


//This function display and calculate the "Star Rating".
//The "Star Rating" is base on:
//  1.The first star will be lowered when the time is over 19 seconds and
//    No of moves is greater or equal 8.
//  2.The second star will be lowered when the time is over 29 seconds and
//    No of moves is greater or equal 14.
//  3.The third star will be lowered when the time is over 39 seconds and
//    No of moves is greater or equal 22.
function starRating() {

    if (secTime >= 19 && noOfStars === 3) {
        if (noOfMoves >= 8){
            document.querySelector('#icons-star-three').className = "far fa-star";
            noOfStars = noOfStars - 1;
        }
    }

    if (secTime >= 29 && noOfStars === 2) {
        if (noOfMoves >= 14){
            document.querySelector('#icons-star-two').className = "far fa-star";
            noOfStars = noOfStars - 1;
        }
    }

    if (secTime >= 39 && noOfStars === 1) {
        if (noOfMoves >= 22){
            document.querySelector('#icons-star-one').className = "far fa-star";
            noOfStars = noOfStars - 1;
        }
    }
}

//This function add the Event Listener to the Grid.
function createEvenListener() {


        grid = document.querySelector('#gridId');
        eventFunction = function(event) {


        //This part detects which "span" is clicked.
        //And from the event object extracts the "Id" from the <span>.
        //As the id stores the imformation of the postion of the element
        //we can know which element is being clicked.
        const span = event.target.closest('span');

        if (!span) return;
        if (!grid.contains(span)) return;




        const targetId = event.target.id;

        if (event.target.id === 'gridId') return;

        //From the "id" extracts the position of the element.
        let numId = parseInt(targetId.slice(4));

        const selectedCard = document.querySelector('#fnt-' + numId);

        if (selectedCard == null) {
            iconElement = document.querySelector('#icn-' + numId);
            iconElement.innerHTML = icons[numId];
            selectCounter += 1;
            const iconCard = document.querySelector('#fnt-' + numId);

            if (selected) {
                //As we know which element is clicked, from the element
                //we can extract the values from the dataset of the element.
                //for example. the element <i id="fnt" data-toggle-id="dog" class="fas fa-dog"></i>
                //we can extract the "dog" from the dataset.
                secondCard = iconCard.dataset.toggleId;
                secondCardId = numId;
            }
            else {
                firstCard = iconCard.dataset.toggleId;
                firstCardId = numId;
                selected = true;
            }
        }
        else {
            //This part check whether the two cards are matched. To avoid
            //matched card reflip.
            if (pairedCard.indexOf(selectedCard.dataset.toggleId) >= 0) {
              return;
            }
            removeElement(selectedCard);
            selected = false;
            selectCounter -= 1;
            if (selectCounter > 1) {
                secondCard = "";
                secondCardId = "";
            }
            else {
                firstCard = "";
                firstCardId = "";
            }
        }

        //This part handle the event of the selected card.
        handleEvent(numId, selected);

        if (selectCounter === 2) {
            compareCard();
            return;
        }

      };

      grid.addEventListener('click', eventFunction);
}


function handleEvent(numId, selected) {
      let cardShadowClass;
      let shadowClass;
      cardShadowClass = document.querySelector("#crd-" + numId);
      shadowClass = cardShadowClass.classList;

      //Provides effect of the selected card. If the card selected it will
      //display shadow effects.
      if (selected) {
          shadowClass.add("card-class-shadow");
      }
      else {
           shadowClass.remove("card-class-shadow");
      }
}

//This function removes the element.
function removeElement(selectedElement) {
    selectedElement.remove();
}


//This function compares both of the selected cards.
function compareCard() {

    firstSelectedCard = document.querySelector('#fnt-' + firstCardId);
    secondSelectedCard = document.querySelector('#fnt-' + secondCardId);
    selectCounter = 0;
    selected = false;

    noOfMoves = noOfMoves + 1;

    //Count the number of moves.
    document.querySelector("#noMoves").innerHTML = noOfMoves + " Moves";

    if (firstCard === secondCard) {
        pairedCard[correctMatch] = firstCard;
        //This part counts the no of matched cards if hits the 8 means that
        //all the 8 pairs of cards are matched. The game finishes , timer
        //will be stoped, event listener will be removed and the Winning
        //Modal we be displayed.
        correctMatch = correctMatch + 1;
        if (correctMatch == 8) {
            grid.removeEventListener('click', eventFunction);
            stopTimer();
            winModal();
        }
    }
    else {
        grid.removeEventListener('click', eventFunction);
        //this part is used to flip the card back to the unmatched state.
        setTimeout(function waitSeconds(){
                    removeElement(firstSelectedCard);
                    removeElement(secondSelectedCard);
                    handleEvent(firstCardId, false);
                    handleEvent(secondCardId, false);
                    createEvenListener();
                }, 1000);
    }
}
