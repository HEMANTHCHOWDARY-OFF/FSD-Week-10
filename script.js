window.onerror = (m, u, l) => alert(`Error: ${m}\nLine: ${l}`);
class FlashcardApp {
    constructor() {
        this.flashcards = [];
        this.currentIndex = 0;
        this.studiedCards = new Set();
        this.init();
    }
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateDisplay();
    }
    setupEventListeners() {
        const ids = {
            'flashcard': () => this.flipCard(),
            'prev-btn': () => this.navigate(-1),
            'next-btn': () => this.navigate(1),
            'add-card-btn': () => this.modal(1),
            'shuffle-btn': () => this.shuffle(),
            'reset-progress-btn': () => this.reset(),
            'mark-known': () => this.mark(true),
            'mark-unknown': () => this.mark(false)
        };
        Object.entries(ids).forEach(([id, cb]) => {
            document.getElementById(id)?.addEventListener('click', cb);
        });
        document.querySelector('.close').onclick = () => this.modal(0);
        document.getElementById('submit-card').addEventListener('click', () => this.addCard());
        window.onclick = (e) => e.target.id === 'add-card-modal' && this.modal(0);
        document.onkeydown = (e) => {
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
            if (e.key === ' ') { e.preventDefault(); this.flipCard(); }
            if (e.key === 'Escape') this.modal(0);
        };
    }
    flipCard() {
        document.getElementById('flashcard').classList.toggle('flipped');
        if (this.flashcards.length) { this.studiedCards.add(this.currentIndex); this.save(); this.updateDisplay(); }
    }
    navigate(dir) {
        if (!this.flashcards.length) return;
        document.getElementById('flashcard').classList.remove('flipped');
        this.currentIndex = (this.currentIndex + dir + this.flashcards.length) % this.flashcards.length;
        this.updateDisplay();
    }
    modal(show) {
        document.getElementById('add-card-modal').style.display = show ? 'block' : 'none';
        if (show) document.getElementById('front-input').focus();
        else document.getElementById('add-card-form').reset();
    }
    addCard() {
        const f = document.getElementById('front-input').value.trim();
        const b = document.getElementById('back-input').value.trim();
        const c = document.getElementById('category-input').value.trim() || 'general';
        if (f && b) {
            const newCard = { id: Date.now(), front: f, back: b, category: c, known: false };
            this.flashcards.push(newCard); this.currentIndex = this.flashcards.length - 1;
            this.save(); this.updateDisplay(); this.modal(0); alert('Card Added Successfully!');
        }
    }
    shuffle() {
        if (!this.flashcards.length) return alert('No cards!');
        this.flashcards.sort(() => Math.random() - 0.5);
        this.currentIndex = 0; document.getElementById('flashcard').classList.remove('flipped');
        this.updateDisplay(); alert('Shuffled!');
    }
    mark(known) {
        if (!this.flashcards.length) return;
        this.flashcards[this.currentIndex].known = known; this.save(); setTimeout(() => this.navigate(1), 500);
    }
    reset() {
        if (this.flashcards.length && confirm('Reset progress?')) {
            this.studiedCards.clear(); this.flashcards.forEach(c => c.known = false);
            this.currentIndex = 0; document.getElementById('flashcard').classList.remove('flipped');
            this.save(); this.updateDisplay(); alert('Reset!');
        }
    }
    updateDisplay() {
        const f = document.getElementById('front-text'), b = document.getElementById('back-text'), c = document.getElementById('card-counter'), len = this.flashcards.length;
        if (!len) { f.textContent = 'Add a card!'; b.textContent = '...'; c.textContent = '0 / 0'; }
        else {
            const cur = this.flashcards[this.currentIndex];
            f.textContent = cur.front; b.textContent = cur.back; c.textContent = `${this.currentIndex + 1} / ${len}`;
        }
        document.getElementById('total-cards').textContent = `Total: ${len}`;
        document.getElementById('studied-cards').textContent = `Studied: ${this.studiedCards.size}`;
        document.getElementById('progress').textContent = `Progress: ${len ? Math.round((this.studiedCards.size / len) * 100) : 0}%`;
    }
    save() {
        try {
            const data = { 
                flashcards: this.flashcards, 
                currentIndex: this.currentIndex, 
                studiedCards: Array.from(this.studiedCards) 
            };
            localStorage.setItem('flashcardApp', JSON.stringify(data));
        } catch (err) {
            console.warn("Storage failed:", err);
        }
    }
    loadFromStorage() {
        const d = JSON.parse(localStorage.getItem('flashcardApp') || '{}');
        this.flashcards = d.flashcards || this.getSamples(); this.currentIndex = d.currentIndex || 0; this.studiedCards = new Set(d.studiedCards || []);
    }
    getSamples() {
        return [
            { front: 'Hello', back: 'नमस्ते' }, { front: 'Thank you', back: 'धन्यवाद' }, { front: 'Goodbye', back: 'अलविदा' },
            { front: 'Please', back: 'कृपया' }, { front: 'Excuse me', back: 'माफ़ कीजिए' }, { front: 'How are you?', back: 'आप कैसे हैं?' },
            { front: 'My name is...', back: 'मेरा नाम... है' }, { front: 'What is your name?', back: 'आपका नाम क्या है?' },
            { front: 'Yes', back: 'हाँ' }, { front: 'No', back: 'नहीं' }
        ].map((c, i) => ({ ...c, id: i, category: 'basic', known: false }));
    }
}
const initApp = () => new FlashcardApp();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


