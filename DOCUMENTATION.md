# Language Learning Flashcards (V2) - Beginner's Comprehensive Guide

Welcome to the technical guide for your Flashcard Application! This document is designed to explain **every single piece of code** as if you were explaining it to someone completely new to web development.

---

## 1. Statistics Tracking (Total, Studied, Progress)
The "Dashboard" of your app. It tells the user how many cards they have, how many they've looked at, and what their overall percentage is.

### **The Design (HTML)**
```html
<div class="stats">
    <span id="total-cards">Total: 0</span>
    <span id="studied-cards">Studied: 0</span>
    <span id="progress">Progress: 0%</span>
</div>
```
- **Explanation**: We use `<span>` tags because they are "inline" elements (they sit side-by-side). Each has a unique `id` so our JavaScript "brain" can find them later.

### **The Styling (CSS)**
```css
.stats span { 
    background: #f7fafc; 
    padding: 8px 16px; 
    border-radius: 20px; 
    font-weight: bold; 
    color: #4a5568; 
}
```
- **Explanation**: 
    - `background`: A very light grey to make the box look clean.
    - `padding`: Adds "breathing room" inside the box so the text isn't touching the edges.
    - `border-radius: 20px`: This is the magic property that makes the corners perfectly round, creating a "pill" or "capsule" look.

### **The Logic (JavaScript)**
```javascript
updateDisplay() {
    const len = this.flashcards.length;
    document.getElementById('total-cards').textContent = `Total: ${len}`;
    document.getElementById('studied-cards').textContent = `Studied: ${this.studiedCards.size}`;
    const percent = len ? Math.round((this.studiedCards.size / len) * 100) : 0;
    document.getElementById('progress').textContent = `Progress: ${percent}%`;
}
```
- **How it works step-by-step**:
    1. it calculates the `len` (length) of the flashcards array.
    2. It looks for the HTML element with the ID `total-cards` and replaces its text.
    3. It uses `studiedCards.size` (which is a `Set` that only counts *unique* cards you've flipped) to show how many you've studied.
    4. It calculates the percentage. The `len ? ... : 0` part is a safety check: "If there are cards, calculate the percentage; otherwise, just show 0." (This prevents a computer error called "Division by Zero").

---

## 2. Flashcard 3D Animation (Anatomy of Flip)
The most visual part of the app. It makes a digital card feel like a real physical one that you can flip over.

### **The Anatomy (HTML)**
```html
<div id="flashcard" class="flashcard">
    <div class="flashcard-front"> [Front Content] </div>
    <div class="flashcard-back"> [Back Content] </div>
</div>
```
- **Explanation**: Think of this like a sandwich. The `flashcard` is the wrapper. The `front` is the top slice of bread, and the `back` is the bottom slice.

### **The Magic (CSS)**
```css
.flashcard { 
    transform-style: preserve-3d; 
    transition: 0.6s; 
}
.flashcard.flipped { 
    transform: rotateY(180deg); 
}
.flashcard-front, .flashcard-back { 
    backface-visibility: hidden; 
    position: absolute; 
}
```
- **How it works line-by-line**:
    - `preserve-3d`: This tells the browser, "Treat this element like it's in a 3D movie!"
    - `transition: 0.6s`: This makes the flip smooth (half a second) instead of instant.
    - `rotateY(180deg)`: When we add the "flipped" class, the card spins halfway exactly like a door on a hinge.
    - `backface-visibility: hidden`: This is the **most important part**. It hides the "back" of the front face so you don't see it mirrored when the card flips. It's like having real opaque paper.

---

## 3. Delete Functionality (Safety & Logic)
Allows the user to remove a card they no longer need from their library.

### **The Safety (JavaScript Propagation)**
```javascript
icon.addEventListener('click', (e) => {
    e.stopPropagation(); 
    this.deleteCurrentCard();
});
```
- **Explanation**: Because the "Delete Card" button is *inside* the card, clicking it would normally trigger a "Flip" (because you clicked on the card!). `e.stopPropagation()` tells the browser: "Stop the click right here; don't let it touch the card behind the button."

### **The Logic (JavaScript)**
```javascript
deleteCurrentCard() {
    if (confirm('Are you sure you want to delete this card?')) {
        this.flashcards.splice(this.currentIndex, 1);
        this.save();
        this.updateDisplay();
        alert('Card Deleted!');
    }
}
```
- **How it works step-by-step**:
    1. `confirm(...)`: A browser popup asks the user "Are you sure?" to prevent accidental deletions.
    2. `splice(index, 1)`: This is the command to "cut out" exactly one item from our list of cards.
    3. `save()`: It immediately updates the browser's permanent memory (LocalStorage) so the card stays gone after a refresh.

---

## 4. Navigation (Circular Selection)
Moving through your cards without ever getting stuck.

### **The Math (JavaScript)**
```javascript
this.currentIndex = (this.currentIndex + dir + this.flashcards.length) % this.flashcards.length;
```
- **Explanation for a non-math person**:
    - Imagine you have 3 cards (0, 1, 2). If you are on card 2 and click "Next," the math becomes `(2+1+3) % 3`. The result is `0`.
    - This creates an **infinite loop**, so you can keep clicking "Next" and it will eventually wrap back to the start. You'll never see an "End of List" error.

---

## 5. Shuffle Logic (Randomization)
Testing your memory by changing the order of the deck.

### **The Logic (JavaScript)**
```javascript
this.flashcards.sort(() => Math.random() - 0.5);
```
- **How it works**:
    - `Math.random()` gives a number between 0 and 1.
    - By subtracting 0.5, we get a list of numbers that are randomly positive or negative.
    - The `sort()` function uses these random pluses and minuses to scramble the cards like a deck of play-cards.

---

## 6. Confidence Tracking (Known / Practice)
Lets you mark cards as "I know this" or "I need to practice."

### **The Flow (JavaScript)**
```javascript
setTimeout(() => this.navigate(1), 500); 
```
- **Design Choice**: Why wait 500ms? It provides a smooth "Slide" feel. If it moved instantly, the user might get confused about which card they are looking at. This tiny delay gives them a "completion" feeling before seeing the next word.

---

## 7. Reset Logic (State Management)
Restores your session without losing your words.

### **The Logic (JavaScript)**
```javascript
this.studiedCards.clear(); 
this.flashcards.forEach(c => c.known = false);
```
- **Explanation**: 
    - `clear()` empties our "Studied" set.
    - `forEach` goes through every single card in your deck and turns the "Known" light bulb to "OFF." This puts you back at the beginning of your learning journey.

---

## 8. Add Card Modal (UI Tricks)
The advanced popup window for data entry.

### **The Transition (JavaScript)**
```javascript
if (show) document.getElementById('front-input').focus();
```
- **User Experience (UX)**: When the "Add New Card" window opens, we use `.focus()` to immediately put the typing cursor in the first box. This means the user can start typing instantly without having to use their mouse. It's a "premium" touch.

### **Closing Logic**
```javascript
window.onclick = (e) => e.target.id === 'add-card-modal' && this.modal(0);
```
- **Explanation**: This allows you to close the modal by clicking *anywhere outside* the white box. It's an intuitive behavior that most professional websites use.

---

## 9. Data Persistence (LocalStorage Architecture)
The "Glue" that holds your application together across different days.

### **The Storage Logic (JavaScript)**
```javascript
localStorage.setItem('flashcardApp', JSON.stringify(data));
```
- **How it works**:
    - The browser has a small permanent storage area called `localStorage`.
    - However, it can *only* store text.
    - `JSON.stringify` turns our complex list of card objects (array) into one long "text string" so it fits in the storage.
    - When you refresh the page, we do the opposite: `JSON.parse` turns that text back into usable card objects.

---

## 10. Responsive Design (@media Adaptation)
Ensures the app looks great on a 27-inch monitor and a 5-inch smartphone.

### **The Stacking (CSS)**
```css
@media (max-width: 600px) { 
    .controls, .navigation, .study-controls { 
        flex-direction: column; 
    } 
}
```
- **Explanation**: On a desktop, buttons sit in a row (horizontally). But on a phone, a row of 3 buttons would be too cramped. This rule says: "If the screen is smaller than 600px, stack them in a column (vertically)."

---

## 11. Keyboard Accessibility (Hotkeys)
Because real productivity happens on the keyboard.

| Key | Why we added it |
| :--- | :--- |
| **Spacebar** | Quick flipping to see the answer. |
| **Arrow Keys** | Fast cycling through the deck. |
| **Escape** | Quickly exit the "Add Card" popup without reaching for the mouse. |

### **Preventing Scrolling**
```javascript
if (e.key === ' ') { e.preventDefault(); this.flipCard(); }
```
- **Technical Detail**: Normally, pressing the spacebar scrolls the web page down. `e.preventDefault()` tells the browser "Don't scroll! Just flip my card instead."

---
*Created by Antigravity AI - Written for Clarity and Understanding*
