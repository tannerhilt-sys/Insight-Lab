/**
 * In-memory data store for Finance Buddy.
 *
 * Architecture: Primary Maps index by `id`. Secondary index Maps (`userIndex.*`)
 * index `Set<id>` by `userId` for O(1) per-user lookups instead of O(n) full-table scans.
 *
 * This structure is isomorphic to PostgreSQL tables with indexed `user_id` foreign keys.
 * Migration to Postgres requires replacing Map methods with parameterized SQL queries —
 * the data shapes and access patterns remain identical.
 *
 * @see constants.js for validation bounds shared by all routes.
 */

const store = {
  users: new Map(),        // id -> user
  usersByEmail: new Map(), // email -> user  (secondary index for fast login lookup)
  profiles: new Map(),     // userId -> profile

  budgetEntries: new Map(),  // id -> entry
  savingsGoals: new Map(),   // id -> goal
  holdings: new Map(),       // id -> holding
  watchlist: new Map(),      // id -> watchlist item
  insightCards: new Map(),   // id -> card
  chatHistory: new Map(),    // userId -> messages[]

  // Secondary userId -> Set<id> indexes for O(1) per-user collection lookups
  userIndex: {
    budgetEntries: new Map(), // userId -> Set<entryId>
    savingsGoals: new Map(),  // userId -> Set<goalId>
    holdings: new Map(),      // userId -> Set<holdingId>
    watchlist: new Map(),     // userId -> Set<itemId>
    insightCards: new Map(),  // userId -> Set<cardId>
  },
};

/** Register an id in a userId secondary index. */
function indexByUser(index, userId, id) {
  if (!index.has(userId)) index.set(userId, new Set());
  index.get(userId).add(id);
}

/** Remove an id from a userId secondary index. */
function deindexByUser(index, userId, id) {
  index.get(userId)?.delete(id);
}

/** Retrieve all items from a primary map whose ids are in the user's index set. */
function getByUserIndex(primaryMap, index, userId) {
  const ids = index.get(userId);
  if (!ids || ids.size === 0) return [];
  const results = [];
  for (const id of ids) {
    const item = primaryMap.get(id);
    if (item) results.push(item);
  }
  return results;
}

// --------------- Users ---------------

export function getUserByEmail(email) {
  return store.usersByEmail.get(email) || null;
}

export function addUser(user) {
  store.users.set(user.id, user);
  store.usersByEmail.set(user.email, user);
  return user;
}

export function getUser(id) {
  return store.users.get(id) || null;
}

// --------------- Profiles ---------------

export function getProfile(userId) {
  return store.profiles.get(userId) || null;
}

export function setProfile(userId, profile) {
  store.profiles.set(userId, profile);
  return profile;
}

// --------------- Budget Entries ---------------

export function getBudgetEntries(userId) {
  return getByUserIndex(store.budgetEntries, store.userIndex.budgetEntries, userId);
}

export function addBudgetEntry(entry) {
  store.budgetEntries.set(entry.id, entry);
  indexByUser(store.userIndex.budgetEntries, entry.userId, entry.id);
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
  const entry = store.budgetEntries.get(id);
  if (entry) deindexByUser(store.userIndex.budgetEntries, entry.userId, id);
  return store.budgetEntries.delete(id);
}

// --------------- Savings Goals ---------------

export function getSavingsGoals(userId) {
  return getByUserIndex(store.savingsGoals, store.userIndex.savingsGoals, userId);
}

export function addSavingsGoal(goal) {
  store.savingsGoals.set(goal.id, goal);
  indexByUser(store.userIndex.savingsGoals, goal.userId, goal.id);
  return goal;
}

// --------------- Holdings ---------------

export function getHoldings(userId) {
  return getByUserIndex(store.holdings, store.userIndex.holdings, userId);
}

export function getHoldingByTicker(userId, ticker) {
  const userHoldings = getByUserIndex(store.holdings, store.userIndex.holdings, userId);
  return userHoldings.find((h) => h.ticker === ticker) || null;
}

export function addHolding(holding) {
  store.holdings.set(holding.id, holding);
  indexByUser(store.userIndex.holdings, holding.userId, holding.id);
  return holding;
}

export function removeHolding(id) {
  const holding = store.holdings.get(id);
  if (holding) deindexByUser(store.userIndex.holdings, holding.userId, id);
  return store.holdings.delete(id);
}

// --------------- Watchlist ---------------

export function getWatchlist(userId) {
  return getByUserIndex(store.watchlist, store.userIndex.watchlist, userId);
}

export function addWatchlistItem(item) {
  store.watchlist.set(item.id, item);
  indexByUser(store.userIndex.watchlist, item.userId, item.id);
  return item;
}

export function removeWatchlistByTicker(userId, ticker) {
  const userItems = getByUserIndex(store.watchlist, store.userIndex.watchlist, userId);
  const item = userItems.find((w) => w.ticker === ticker);
  if (!item) return false;
  deindexByUser(store.userIndex.watchlist, userId, item.id);
  store.watchlist.delete(item.id);
  return true;
}

// --------------- Insight Cards ---------------

export function getInsightCards(userId) {
  return getByUserIndex(store.insightCards, store.userIndex.insightCards, userId);
}

export function addInsightCard(card) {
  store.insightCards.set(card.id, card);
  indexByUser(store.userIndex.insightCards, card.userId, card.id);
  return card;
}

export function getInsightCard(id) {
  return store.insightCards.get(id) || null;
}

// --------------- Chat History ---------------

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
