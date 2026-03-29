// In-memory data store for Finance Buddy
// All data lives here — no database required for this draft.

const store = {
  users: new Map(),          // id -> user object
  profiles: new Map(),       // userId -> profile object
  budgetEntries: new Map(),  // id -> entry object
  savingsGoals: new Map(),   // id -> goal object
  holdings: new Map(),       // id -> holding object
  watchlist: new Map(),      // id -> watchlist item
  insightCards: new Map(),   // id -> card
  chatHistory: new Map(),    // userId -> messages array
};

// --------------- Helper functions ---------------

export function getUserByEmail(email) {
  for (const user of store.users.values()) {
    if (user.email === email) return user;
  }
  return null;
}

export function addUser(user) {
  store.users.set(user.id, user);
  return user;
}

export function getUser(id) {
  return store.users.get(id) || null;
}

export function getProfile(userId) {
  return store.profiles.get(userId) || null;
}

export function setProfile(userId, profile) {
  store.profiles.set(userId, profile);
  return profile;
}

export function getBudgetEntries(userId) {
  const entries = [];
  for (const entry of store.budgetEntries.values()) {
    if (entry.userId === userId) entries.push(entry);
  }
  return entries;
}

export function addBudgetEntry(entry) {
  store.budgetEntries.set(entry.id, entry);
  return entry;
}

export function getBudgetEntry(id) {
  return store.budgetEntries.get(id) || null;
}

export function updateBudgetEntry(id, updates) {
  const entry = store.budgetEntries.get(id);
  if (!entry) return null;
  Object.assign(entry, updates);
  return entry;
}

export function deleteBudgetEntry(id) {
  return store.budgetEntries.delete(id);
}

export function getSavingsGoals(userId) {
  const goals = [];
  for (const goal of store.savingsGoals.values()) {
    if (goal.userId === userId) goals.push(goal);
  }
  return goals;
}

export function addSavingsGoal(goal) {
  store.savingsGoals.set(goal.id, goal);
  return goal;
}

export function getHoldings(userId) {
  const items = [];
  for (const h of store.holdings.values()) {
    if (h.userId === userId) items.push(h);
  }
  return items;
}

export function getHoldingByTicker(userId, ticker) {
  for (const h of store.holdings.values()) {
    if (h.userId === userId && h.ticker === ticker) return h;
  }
  return null;
}

export function addHolding(holding) {
  store.holdings.set(holding.id, holding);
  return holding;
}

export function removeHolding(id) {
  return store.holdings.delete(id);
}

export function getWatchlist(userId) {
  const items = [];
  for (const w of store.watchlist.values()) {
    if (w.userId === userId) items.push(w);
  }
  return items;
}

export function addWatchlistItem(item) {
  store.watchlist.set(item.id, item);
  return item;
}

export function removeWatchlistByTicker(userId, ticker) {
  for (const [id, w] of store.watchlist.entries()) {
    if (w.userId === userId && w.ticker === ticker) {
      store.watchlist.delete(id);
      return true;
    }
  }
  return false;
}

export function getInsightCards(userId) {
  const cards = [];
  for (const c of store.insightCards.values()) {
    if (c.userId === userId) cards.push(c);
  }
  return cards;
}

export function addInsightCard(card) {
  store.insightCards.set(card.id, card);
  return card;
}

export function getInsightCard(id) {
  return store.insightCards.get(id) || null;
}

export function getChatHistory(userId) {
  return store.chatHistory.get(userId) || [];
}

export function appendChatMessage(userId, message) {
  if (!store.chatHistory.has(userId)) {
    store.chatHistory.set(userId, []);
  }
  store.chatHistory.get(userId).push(message);
}

export default store;
