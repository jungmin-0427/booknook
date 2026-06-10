import { reactive, watch, computed } from 'vue'
import type { Book, BookStatus, Leaf, Objet } from '../types/book'
import { mockBooks, mockLeaves, mockObjets } from '../data/mockBooks'

function load<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback }
  catch { return fallback }
}

const state = reactive({
  books: load<Book[]>('bn_books', mockBooks),
  leaves: load<Leaf[]>('bn_leaves', mockLeaves),
  objets: load<Objet[]>('bn_objets', mockObjets),
})

watch(() => state.books,  v => localStorage.setItem('bn_books',  JSON.stringify(v)), { deep: true })
watch(() => state.leaves, v => localStorage.setItem('bn_leaves', JSON.stringify(v)), { deep: true })
watch(() => state.objets, v => localStorage.setItem('bn_objets', JSON.stringify(v)), { deep: true })

function uid() { return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6) }
function today() { return new Date().toISOString().slice(0, 10) }

export function useBookStore() {

  // ── computed groups ──
  const readingBooks  = computed(() => state.books.filter(b => b.status === 'reading'))
  const doneBooks     = computed(() => state.books.filter(b => b.status === 'done'))
  const wishlistBooks = computed(() => state.books.filter(b => b.status === 'wishlist'))
  const doneCount     = computed(() => doneBooks.value.length)

  // ── book CRUD ──
  function addBook(partial: Partial<Book> & { title: string; author: string; coverColor: string[]; status: BookStatus }) {
    const exists = state.books.find(b => b.title === partial.title)
    if (exists) return exists.id
    const book: Book = {
      id: uid(), isbn: '', publisher: '', coverImageUrl: '', memo: '',
      totalPages: partial.totalPages ?? null,
      currentPage: 0, progressPercent: 0,
      rating: null, lastReadAt: null, finishedAt: null,
      addedAt: today(), ...partial,
    }
    state.books.push(book)
    return book.id
  }

  function updateBook(id: string, patch: Partial<Book>) {
    const book = state.books.find(b => b.id === id)
    if (!book) return
    Object.assign(book, patch)
  }

  function updateProgress(id: string, currentPage: number) {
    const book = state.books.find(b => b.id === id)
    if (!book) return
    book.currentPage = currentPage
    book.progressPercent = book.totalPages
      ? Math.round((currentPage / book.totalPages) * 100)
      : 0
    book.lastReadAt = today()
    checkObjetUnlock()
  }

  function changeStatus(id: string, status: BookStatus) {
    const book = state.books.find(b => b.id === id)
    if (!book) return
    book.status = status
    if (status === 'done') {
      book.finishedAt = today()
      book.currentPage = book.totalPages ?? book.currentPage
      book.progressPercent = 100
      checkObjetUnlock()
    }
    if (status === 'reading') book.finishedAt = null
  }

  function removeBook(id: string) {
    const idx = state.books.findIndex(b => b.id === id)
    if (idx !== -1) state.books.splice(idx, 1)
    // remove related leaves
    state.leaves = state.leaves.filter(l => l.bookId !== id)
  }

  // ── leaf CRUD ──
  function addLeaf(bookId: string, sentence: string) {
    state.leaves.unshift({ id: uid(), bookId, sentence, createdAt: today() })
  }

  function removeLeaf(id: string) {
    const idx = state.leaves.findIndex(l => l.id === id)
    if (idx !== -1) state.leaves.splice(idx, 1)
  }

  function leavesForBook(bookId: string) {
    return state.leaves.filter(l => l.bookId === bookId)
  }

  // ── objet unlock ──
  function checkObjetUnlock() {
    const done = doneCount.value
    state.objets.forEach(o => {
      if (!o.unlockedAt && done >= o.unlockCondition) {
        o.unlockedAt = today()
      }
    })
  }

  // ── rating ──
  function setRating(id: string, rating: number) {
    const book = state.books.find(b => b.id === id)
    if (book) book.rating = rating
  }

  return {
    state,
    readingBooks, doneBooks, wishlistBooks, doneCount,
    addBook, updateBook, updateProgress, changeStatus, removeBook,
    addLeaf, removeLeaf, leavesForBook,
    setRating,
  }
}
