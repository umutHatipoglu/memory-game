//This .js file is just for code review which is same with the actual src/index.ts(typescript) without any typing 
// src/index.ts is used for implementation

import './css/app.css';
import './img/geometry2.png';
import {map, forEach, isEqual, intersection} from 'lodash/fp';
import {fromEvent, interval, BehaviorSubject, combineLatest} from 'rxjs';
import {filter} from 'rxjs/operators'

let gameCards = [];
let evaluatedGameCards= [];
let attempt = 0;
let visibleAttempt = 0;
let isProcessing = false;

const timer$ = new BehaviorSubject(0);
const interval$ = interval(1000);
const isFinish$ = new BehaviorSubject(false);
const falseAttempt$= new BehaviorSubject(0);

let cardList = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');
const timerEl = document.querySelector('.timer');
const modal = document.getElementById("myModal");
const modalCloseButton = document.querySelector('.btn-primary.close');
const modalPlayButton = document.querySelector('.btn-primary.play');
const totalMoves = document.querySelector('.total-moves');
const restartButton = document.querySelector('.restart');
const score = document.querySelector('.score');

modalCloseButton.addEventListener('click', ()=> modal.style.display = "none");
modalPlayButton.addEventListener('click', ()=> {
    modal.style.display = "none";
    resetGame();
});

const restart$ = fromEvent(restartButton, 'click');

const removeCardElements = (list) => {
    forEach((card)=>{
        card.classList.remove('show', 'open', 'match');
       deck.removeChild(card);
    }, list);
}

const suffleCards = (list) => {
    //Remove card from document
    removeCardElements(list);
    //Add again with random order
    const shuffledList = shuffle(list);
    forEach((card)=>{
        deck.appendChild(card);
     }, shuffledList);
}

const initiliazeSuffleGame = () => {
    gameCards = map((card) => card, cardList);
    suffleCards(gameCards);
}

const openAndShowCard = (event) => {
    if(!isProcessing){
        const unique = intersection(event.currentTarget.classList, ['open', 'show', 'match']);
        if(unique.length === 0){
            attempt++;
            visibleAttempt++;
            moves.textContent = visibleAttempt.toString();
            event.target.classList.add('open', 'show');
            evaluatedGameCards.push(event.target);
            if(attempt % 2 === 0){
                isProcessing = true;
                setTimeout(()=> evaluateMatchCase(), 500);
                attempt = 0;
            }   
        }
    }
}

//Check game is finish and show modal
const checkGameIsFinish = () => {
    const matchedCardList = document.querySelectorAll('.match');
    if(matchedCardList.length === cardList.length){
        modal.style.display = "block";
        totalMoves.textContent = (timer$.getValue()).toString();
        isFinish$.next(true);
        const starEl = map((star)=>star.cloneNode(true), document.querySelectorAll('.fa-star'));
        forEach((star) => {
            score.appendChild(star);
        }, starEl)
    }
}

const evaluateMatchCase = () => {
    if(evaluatedGameCards.length === 2){
        const first = evaluatedGameCards[0].getElementsByTagName('i')[0].classList.toString();
        const second = evaluatedGameCards[1].getElementsByTagName('i')[0].classList.toString();
        if(!isEqual(first, second)){
            const currentFalseAttempt = falseAttempt$.getValue();
            falseAttempt$.next(currentFalseAttempt + 1);
            forEach((card)=>{
                card.classList.remove('show', 'open');
            }, evaluatedGameCards);
        }else{
            forEach((card)=>{
                card.classList.add('match');
            }, evaluatedGameCards);
        }
        evaluatedGameCards = [];
    }
    isProcessing = false;
    checkGameIsFinish();
}

//reset game states
const resetGame = () => {
    initiliazeSuffleGame();
    cardList = document.querySelectorAll('.card');
    addClickEventToCards(cardList);
    attempt = 0;
    visibleAttempt = 0;
    moves.textContent = visibleAttempt.toString();
    evaluatedGameCards = [];
    isFinish$.next(false);
    timer$.next(0);
    falseAttempt$.next(0);
    resetStars();
}

//Add star elements after reseting the game
const resetStars = () => {
    const starWrapper = document.querySelector('.stars');
    const currentStarNumber = document.querySelectorAll('.stars .fa-star').length;
    for(let i = currentStarNumber; i < 3; i++){
        const starEl = document.querySelector('.fa-star').parentNode.cloneNode(true);
        starWrapper.appendChild(starEl);
    }
}

const addClickEventToCards = (cardList) => {
    forEach((card) => {
        card.addEventListener('click', openAndShowCard);
    }, cardList);
}

initiliazeSuffleGame();
addClickEventToCards(cardList);

// Update star based on number of falseAttempts 
falseAttempt$.subscribe((attemptNumber)=>{
    const starsWrapper = document.querySelector('.stars');
    const starEl = document.querySelectorAll('.fa-star');
    if(starEl.length > 1 && attemptNumber > 0 && attemptNumber % 5 === 0){
        starsWrapper.removeChild(starEl[0].parentNode);
    }
});

restart$.subscribe(()=>{
    resetGame();
});

//Timer implementation
combineLatest(
    interval$,
    isFinish$
).pipe(
    filter(([ , isFinish]) => !isFinish)
).subscribe(([]) => {
    const currentTime = timer$.getValue();
    timer$.next(currentTime + 1);
});

timer$.subscribe((time)=>{
    timerEl.textContent = time.toString();
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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