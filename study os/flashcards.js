/* =========================================================
   flashcards.js — decks of Q/A cards with flip navigation
   ========================================================= */

const FlashState = { deckId: null, index: 0 };

function getDecks() {
  return Storage.get('decks', []);
}

function saveDecks(decks) {
  Storage.set('decks', decks);
}

function currentDeck() {
  return getDecks().find(d => d.id === FlashState.deckId) || null;
}

function addDeck(name) {
  const decks = getDecks();
  const deck = { id: uid(), name, cards: [] };
  decks.push(deck);
  saveDecks(decks);
  FlashState.deckId = deck.id;
  FlashState.index = 0;
  renderDeckSelect();
  renderFlashcard();
}

function addCard(deckId, q, a) {
  const decks = getDecks();
  const deck = decks.find(d => d.id === deckId);
  if (!deck) return;
  deck.cards.push({ id: uid(), q, a });
  saveDecks(decks);
  FlashState.index = deck.cards.length - 1;
  renderFlashcard();
}

function deleteCurrentCard() {
  const deck = currentDeck();
  if (!deck || deck.cards.length === 0) return;
  const decks = getDecks();
  const d = decks.find(d => d.id === deck.id);
  d.cards.splice(FlashState.index, 1);
  saveDecks(decks);
  if (FlashState.index >= d.cards.length) FlashState.index = Math.max(0, d.cards.length - 1);
  renderFlashcard();
}

function renderDeckSelect() {
  const select = document.getElementById('deckSelect');
  const decks = getDecks();

  if (decks.length === 0) {
    select.innerHTML = '<option value="">No decks yet</option>';
    FlashState.deckId = null;
    return;
  }

  if (!FlashState.deckId || !decks.some(d => d.id === FlashState.deckId)) {
    FlashState.deckId = decks[0].id;
  }

  select.innerHTML = decks.map(d =>
    `<option value="${d.id}" ${d.id === FlashState.deckId ? 'selected' : ''}>${escapeHtml(d.name)} (${d.cards.length})</option>`
  ).join('');
}

function renderFlashcard() {
  const deck = currentDeck();
  const card = document.getElementById('flashcard');
  const front = document.getElementById('flashFront');
  const back = document.getElementById('flashBack');
  const position = document.getElementById('flashPosition');

  card.classList.remove('is-flipped');

  if (!deck || deck.cards.length === 0) {
    front.textContent = deck ? 'Add a card to begin' : 'Create a deck to begin';
    back.textContent = '';
    position.textContent = '0 / 0';
    return;
  }

  if (FlashState.index >= deck.cards.length) FlashState.index = 0;
  const c = deck.cards[FlashState.index];
  front.textContent = c.q;
  back.textContent = c.a;
  position.textContent = `${FlashState.index + 1} / ${deck.cards.length}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderDeckSelect();
  renderFlashcard();

  document.getElementById('deckSelect').addEventListener('change', (e) => {
    FlashState.deckId = e.target.value;
    FlashState.index = 0;
    renderFlashcard();
  });

  document.getElementById('addDeckBtn').addEventListener('click', () => {
    const input = document.getElementById('newDeckName');
    const name = input.value.trim();
    if (!name) return;
    addDeck(name);
    input.value = '';
  });

  document.getElementById('flashcardForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!FlashState.deckId) { alert('Create a deck first.'); return; }
    const q = document.getElementById('cardQuestion').value.trim();
    const a = document.getElementById('cardAnswer').value.trim();
    if (!q || !a) return;
    addCard(FlashState.deckId, q, a);
    e.target.reset();
    renderDeckSelect();
  });

  document.getElementById('flashFlipBtn').addEventListener('click', () => {
    document.getElementById('flashcard').classList.toggle('is-flipped');
  });
  document.getElementById('flashcard').addEventListener('click', () => {
    document.getElementById('flashcard').classList.toggle('is-flipped');
  });

  document.getElementById('flashNextBtn').addEventListener('click', () => {
    const deck = currentDeck();
    if (!deck || deck.cards.length === 0) return;
    FlashState.index = (FlashState.index + 1) % deck.cards.length;
    renderFlashcard();
  });

  document.getElementById('flashPrevBtn').addEventListener('click', () => {
    const deck = currentDeck();
    if (!deck || deck.cards.length === 0) return;
    FlashState.index = (FlashState.index - 1 + deck.cards.length) % deck.cards.length;
    renderFlashcard();
  });

  document.getElementById('deleteCardBtn').addEventListener('click', () => {
    deleteCurrentCard();
    renderDeckSelect();
  });
});
