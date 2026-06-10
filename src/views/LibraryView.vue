<template>
  <div class="library-view">
    <header class="lib-header">
      <h1 class="lib-title">내 서재</h1>
      <span class="lib-count">{{ doneBooks.length }}권 완독</span>
    </header>

    <!-- 상태 탭 -->
    <div class="status-tabs">
      <button v-for="t in tabs" :key="t.value"
        class="status-tab" :class="{ active: activeTab === t.value }"
        @click="activeTab = t.value">
        {{ t.label }}
        <span class="tab-cnt">{{ tabCount(t.value) }}</span>
      </button>
    </div>

    <!-- 읽었어요: 책장 뷰 -->
    <template v-if="activeTab === 'done'">
      <div v-if="doneBooks.length === 0" class="empty-state">
        <span>📚</span><p>아직 완독한 책이 없어요</p>
      </div>
      <div v-else>
        <div v-for="(shelf, si) in shelves" :key="si" class="shelf-block">
          <!-- 오브제 보상 (3권 단위) -->
          <div v-if="si > 0" class="objet-row">
            <ObjetCard :objet="objetForShelf(si)" :doneCount="doneBooks.length" />
          </div>
          <div class="bookshelf">
            <div class="books-row">
              <div v-for="book in shelf" :key="book.id"
                class="spine" :style="spineStyle(book)"
                @click="detailBook = book">
                <span class="spine-title">{{ book.title }}</span>
              </div>
              <div v-for="i in (8 - shelf.length)" :key="'e'+i" class="spine spine-empty" />
            </div>
            <div class="shelf-plank" />
          </div>
        </div>
      </div>
    </template>

    <!-- 읽는 중 / 읽고 싶어요: 그리드 -->
    <template v-else>
      <div v-if="filteredBooks.length === 0" class="empty-state">
        <span>🍁</span><p>{{ activeTab === 'reading' ? '읽고 있는 책이 없어요' : '읽고 싶은 책이 없어요' }}</p>
      </div>
      <div v-else class="book-grid">
        <div v-for="book in filteredBooks" :key="book.id"
          class="grid-item" @click="detailBook = book">
          <BookCover :colors="book.coverColor" width="80px" height="112px" />
          <p class="grid-title">{{ book.title }}</p>
          <p class="grid-author">{{ book.author }}</p>
          <div v-if="activeTab === 'reading'" class="grid-progress">
            <div class="gp-track"><div class="gp-fill" :style="{ width: book.progressPercent + '%' }" /></div>
            <span class="gp-pct">{{ book.progressPercent }}%</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Book detail -->
    <BookDetailSheet :book="detailBook" @close="detailBook = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Book, BookStatus } from '../types/book'
import BookCover from '../components/BookCover.vue'
import BookDetailSheet from '../components/BookDetailSheet.vue'
import ObjetCard from '../components/ObjetCard.vue'
import { useBookStore } from '../stores/bookStore'

const { readingBooks, doneBooks, wishlistBooks, state } = useBookStore()
const activeTab = ref<BookStatus>('done')
const detailBook = ref<Book | null>(null)

const tabs = [
  { value: 'reading' as BookStatus, label: '읽는 중' },
  { value: 'done'    as BookStatus, label: '읽었어요' },
  { value: 'wishlist'as BookStatus, label: '읽고 싶어요' },
]

function tabCount(v: BookStatus) {
  if (v === 'reading') return readingBooks.value.length
  if (v === 'done')    return doneBooks.value.length
  return wishlistBooks.value.length
}

const filteredBooks = computed(() => {
  if (activeTab.value === 'reading') return readingBooks.value
  if (activeTab.value === 'done')    return doneBooks.value
  return wishlistBooks.value
})

const shelves = computed(() => {
  const r: Book[][] = []
  for (let i = 0; i < doneBooks.value.length; i += 8) r.push(doneBooks.value.slice(i, i + 8))
  return r
})

function spineStyle(book: Book) {
  return { background: `linear-gradient(180deg, ${book.coverColor[0]} 0%, ${book.coverColor[1] || book.coverColor[0]} 100%)` }
}

function objetForShelf(shelfIdx: number) {
  return state.objets[shelfIdx - 1] ?? null
}
</script>

<style scoped>
.library-view { flex: 1; overflow-y: auto; padding: 24px 20px 32px; display: flex; flex-direction: column; gap: 16px; }

.lib-header { display: flex; align-items: baseline; gap: 10px; }
.lib-title { font-size: 22px; font-weight: 700; color: #2C2018; font-family: 'Noto Serif KR', serif; margin: 0; }
.lib-count { font-size: 13px; color: #B85C38; font-weight: 600; }

/* Status tabs */
.status-tabs { display: flex; gap: 0; border-bottom: 1px solid #D4C9B8; }
.status-tab {
  flex: 1; padding: 10px 4px; background: none; border: none;
  font-size: 13px; font-weight: 500; color: #9B8B7A; cursor: pointer;
  position: relative; display: flex; align-items: center; justify-content: center; gap: 4px;
}
.status-tab.active { font-weight: 700; color: #2C2018; }
.status-tab.active::after {
  content: ''; position: absolute; bottom: 0; left: 10%; right: 10%;
  height: 2px; background: #B85C38; border-radius: 2px;
}
.tab-cnt {
  font-size: 11px; background: rgba(0,0,0,0.08);
  border-radius: 20px; padding: 1px 6px; font-weight: 600;
}
.status-tab.active .tab-cnt { background: rgba(184,92,56,0.15); color: #B85C38; }

/* Grid */
.book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.grid-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; }
.grid-title { font-size: 11px; font-weight: 700; color: #2C2018; text-align: center; margin: 0; line-height: 1.3; word-break: keep-all; }
.grid-author { font-size: 10px; color: #9B8B7A; margin: 0; }
.grid-progress { width: 100%; display: flex; align-items: center; gap: 4px; }
.gp-track { flex: 1; height: 4px; background: rgba(0,0,0,0.08); border-radius: 2px; overflow: hidden; }
.gp-fill { height: 100%; background: #B85C38; border-radius: 2px; }
.gp-pct { font-size: 10px; color: #B85C38; font-weight: 700; min-width: 24px; text-align: right; }

/* Bookshelf */
.shelf-block { margin-bottom: 4px; }
.objet-row { padding: 12px 0 8px; display: flex; justify-content: center; }
.bookshelf { padding: 0 4px; }
.books-row { display: flex; align-items: flex-end; gap: 3px; padding: 8px 8px 0; min-height: 110px; }
.shelf-plank {
  height: 11px;
  background: linear-gradient(180deg, #C4965A 0%, #A07840 50%, #8B6535 100%);
  border-radius: 2px; box-shadow: 0 3px 6px rgba(0,0,0,0.2);
}
.spine {
  width: calc((100% - 21px) / 8); height: 96px;
  border-radius: 2px 2px 0 0; display: flex; align-items: center;
  justify-content: center; cursor: pointer;
  box-shadow: inset -2px 0 4px rgba(0,0,0,0.2);
  transition: transform 0.15s ease; flex-shrink: 0;
}
.spine:active { transform: translateY(-4px); }
.spine-empty { background: rgba(200,185,160,0.15); border: 1px dashed rgba(180,160,120,0.2); cursor: default; }
.spine-title {
  writing-mode: vertical-rl; font-size: 9px; font-weight: 700;
  color: rgba(255,255,255,0.85); text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  letter-spacing: 0.5px; overflow: hidden; max-height: 82px; white-space: nowrap;
}

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 48px 24px; gap: 10px; font-size: 40px;
}
.empty-state p { font-size: 14px; color: #9B8B7A; margin: 0; }
</style>
