# Language Learning Flashcards (V2) - Comprehensive Documentation

This document provide a detailed line-by-line breakdown of every feature, including the HTML structure, CSS styling, and JavaScript logic used to create this application.

---


---


## 1. Statistics Tracking (Total, Studied, Progress)
A dynamic dashboard that reflects the user's current progress in real-time.

### HTML Breakdown
```html
<div class="stats">
    <span id="total-cards">Total: 0</span>
    <span id="studied-cards">Studied: 0</span>
    <span id="progress">Progress: 0%</span>
</div>
```
- **Explanation**: We use `<span>` elements with unique IDs so that JavaScript can target them and update their text content.

### CSS Breakdown
```css
.stats span { 
    background: #f7fafc; 
    padding: 8px 16px; 
    border-radius: 20px; 
    font-weight: bold; 
    color: #4a5568; 
}
```
- **Explanation**: `border-radius: 20px` creates the "pill" shape, and the light background (`#f7fafc`) makes the text pop against the gradient background of the page.

### JavaScript Logic
```javascript
updateDisplay() {
    const len = this.flashcards.length;
    document.getElementById('total-cards').textContent = `Total: ${len}`;
    document.getElementById('studied-cards').textContent = `Studied: ${this.studiedCards.size}`;
    document.getElementById('progress').textContent = `Progress: ${len ? Math.round((this.studiedCards.size / len) * 100) : 0}%`;
}
```
- **Explanation**: `this.flashcards.length` gets the total count. `this.studiedCards.size` counts unique cards flipped. The ternary operator (`? :`) prevents "Division by Zero" errors if there are no cards.

---

## 2. Flashcard 3D Flip Animation
Creates an immersive experience by making the card feel like a physical object.

### HTML Structure
```html
<div id="flashcard" class="flashcard">
    <div class="flashcard-front">...</div>
    <div class="flashcard-back">...</div>
</div>
```
- **Explanation**: The `flashcard` parent contains two children (Front and Back) which sit on top of each other.

### CSS Styling
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
- **Explanation**: `preserve-3d` allows the children to exist in 3D space. `backface-visibility: hidden` ensures that when a side is turned away from the user, it becomes invisible, showing the other side instead.

---

## 3. Delete Card Functionality
Allows users to remove cards they no longer need.

### HTML Code
```html
<span class="delete-icon" title="Delete Card">&times;</span>
```
- **Explanation**: The `&times;` entity generates the '×' symbol. It is placed inside the card faces.

### JavaScript Propagation Logic
```javascript
document.querySelectorAll('.delete-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation(); // CRITICAL
        this.deleteCurrentCard();
    });
});
```
- **Explanation**: `e.stopPropagation()` prevents the click event from "bubbling up" to the card itself. Without this, clicking "Delete" would also trigger a "Flip" animation simultaneously.

---

## 4. Navigation & Counter
Enables moving through the card deck and seeing your position.

### HTML Code
```html
<button id="prev-btn">Previous</button>
<span id="card-counter">0 / 0</span>
```

### JavaScript Logic (Circular)
```javascript
navigate(dir) {
    this.currentIndex = (this.currentIndex + dir + this.flashcards.length) % this.flashcards.length;
    this.updateDisplay();
}
```
- **Explanation**: The modulo operator (`%`) ensures that if you are on the last card and click "Next," you return to the first card (index 0).

---

## 5. Shuffle Logic
Randomizes the deck to prevent users from memorizing the order of words.

### JavaScript Code
```javascript
shuffle() {
    this.flashcards.sort(() => Math.random() - 0.5);
    this.currentIndex = 0; 
    this.updateDisplay();
}
```
- **Explanation**: `Math.random() - 0.5` returns a value that is randomly positive or negative, causing the `sort()` function to reorder the array in a completely random way.

---

## 6. Confidence Buttons (Know It / Practice)
Lets the user track which words they have mastered.

### JavaScript Logic
```javascript
mark(known) {
    this.flashcards[this.currentIndex].known = known; 
    this.save(); 
    setTimeout(() => this.navigate(1), 500); 
}
```
- **Explanation**: `setTimeout` creates a 0.5-second delay so the user can see the card being marked before it automatically slides to the next word.

---

## 7. Reset Progress logic
Clears history while keeping your custom cards.

### JavaScript Code
```javascript
reset() {
    this.studiedCards.clear(); 
    this.flashcards.forEach(c => c.known = false);
    this.save(); 
}
```
- **Explanation**: `this.studiedCards.clear()` empties the Set of viewed cards. `forEach` resets the `known` property on every single card object to `false`.

---

## 8. Add Card Modal (UI/UX)
A popup form for adding new data.

### CSS Breakdown
```css
.modal { 
    display: none; 
    position: fixed; 
    z-index: 1000; 
    background: rgba(0,0,0,0.5); 
}
```
- **Explanation**: `position: fixed` keeps the modal centered even if the user scrolls. `rgba(0,0,0,0.5)` creates the "dimmed" background effect.

### JavaScript Logic
```javascript
if (show) document.getElementById('front-input').focus();
```
- **Explanation**: `.focus()` automatically places the typing cursor in the first box so the user can start typing immediately without clicking.

---

## 9. Initialization & Local Storage
How the app starts and remembers your data.

### JavaScript Logic
```javascript
this.flashcards = d.flashcards || this.getSamples();
```
- **Explanation**: On startup, the app checks for saved data (`d.flashcards`). The Logical OR (`||`) ensures that if you are a new user with no data, it automatically loads the 10 "Sample Cards" instead of showing an empty screen.

---

## 10. Responsive Design (@media)
Makes the app usable on mobile phones.

### CSS Media Query
```css
@media (max-width: 600px) { 
    .controls { flex-direction: column; } 
}
```
- **Explanation**: When the screen is narrower than 600 pixels, `flex-direction: column` tells the buttons to stack on top of each other instead of sitting side-by-side.

---

## 11. Keyboard Controls
Accessibility for power users.

### JavaScript Event Listeners
```javascript
if (e.key === ' ') { e.preventDefault(); this.flipCard(); }
```
- **Explanation**: `e.preventDefault()` is used with the Spacebar to stop the web page from scrolling down when you press it to flip the card.

---
*Created by Antigravity AI - Line-by-Line Technical Analysis*
