import './css/app.css';
import './img/geometry2.png';
import {map, forEach, isEqual} from 'lodash/fp';
import {fromEvent} from 'rxjs';

let cardList:NodeListOf<Element> = document.querySelectorAll('.card');
let gameCards: Element[];
let evaluatedGameCards: any[] = [];
let attempt = 0;
let visibleAttempt = 0;

const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');


const restartButton:Element = document.querySelector('.restart');
const restart$ = fromEvent(restartButton, 'click');

const openAndShowCard = (event:any) => {
    attempt++;
    visibleAttempt++;
    moves.textContent = visibleAttempt.toString();
    event.target.classList.add('open', 'show');
    evaluatedGameCards.push(event.target);
    console.log(event.target);
    if(attempt % 2 === 0){
        setTimeout(()=> evaluateMatchCase(), 500);
        attempt = 0;
    }
    const matchedCardList = document.querySelectorAll('.match');
    if(matchedCardList.length === cardList.length){
        //TODO: Implement modal
    }
}

const addClickEventToCards = (cardList:NodeListOf<Element>) => {
    forEach((card:Element) => {
        card.addEventListener('click', openAndShowCard);
    }, cardList);
}

addClickEventToCards(cardList);

restart$.subscribe(()=>{
    gameCards = map((card:Element) => card, cardList);
    suffleCards(gameCards);
    cardList = document.querySelectorAll('.card');
    addClickEventToCards(cardList);
    attempt = 0;
    visibleAttempt = 0;
    moves.textContent = visibleAttempt.toString();
})


const evaluateMatchCase = () => {
    const first = evaluatedGameCards[0].getElementsByTagName('i')[0].classList.toString();
    const second = evaluatedGameCards[1].getElementsByTagName('i')[0].classList.toString();
    if(!isEqual(first, second)){
        forEach((card:Element)=>{
            card.classList.remove('show', 'open');
        }, evaluatedGameCards);
    }else{
        forEach((card:Element)=>{
            card.classList.add('match');
        }, evaluatedGameCards);
    }
    evaluatedGameCards = [];
}


const removeClassStyles = (list:any) => {
    forEach((card:Element)=>{
        card.classList.remove('show', 'open', 'match');
       deck.removeChild(card);
    }, list);
}



/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const suffleCards = (list:Element[]) => {
    //Remove card from document
    removeClassStyles(list);
    //Add again with random order
    const shuffledList = shuffle(list);
    forEach((card:Element)=>{
        deck.appendChild(card);
     }, shuffledList);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array:any) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */