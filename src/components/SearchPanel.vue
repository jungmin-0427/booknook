<template>
  <div class="search-panel">
    <!-- 검색바 (항상 표시) -->
    <div class="search-bar-wrap" @click="openSearch">
      <Search :size="18" class="search-icon" />
      <span class="search-placeholder">책 제목, 저자, 키워드 검색</span>
      <button class="camera-btn" @click.stop="showBarcode = true">
        <Camera :size="18" />
      </button>
    </div>

    <Teleport to="body">
      <!-- ── 전체 검색창 ── -->
      <div v-if="showSearch" class="search-overlay" :class="{ open: overlayOpen }">
        <div class="search-full">
          <!-- 상단 검색 인풋 -->
          <div class="sf-top">
            <button class="sf-back" @click="closeSearch">
              <ChevronLeft :size="22" />
            </button>
            <div class="sf-input-wrap">
              <Search :size="16" class="sf-icon" />
              <input
                ref="inputRef"
                v-model="query"
                class="sf-input"
                placeholder="책 제목, 저자 검색"
                @input="doSearch"
                @keyup.enter="doSearch"
              />
              <button v-if="query" class="sf-clear" @click="query = ''; results = []">✕</button>
            </div>
          </div>

          <div class="sf-body">
            <!-- 최근 검색어 (쿼리 없을 때) -->
            <div v-if="!query && recentSearches.length > 0" class="recent-section">
              <div class="recent-header">
                <span class="recent-title">최근 검색</span>
                <button class="recent-clear-all" @click="recentSearches = []">전체 삭제</button>
              </div>
              <div class="recent-list">
                <button
                  v-for="(term, i) in recentSearches"
                  :key="i"
                  class="recent-chip"
                  @click="applyRecent(term)"
                >
                  <Clock :size="12" />
                  {{ term }}
                  <span class="recent-del" @click.stop="removeRecent(i)">✕</span>
                </button>
              </div>
            </div>

            <!-- 검색어 없고 최근 없을 때 힌트 -->
            <div v-else-if="!query" class="search-hint">
              <img src="/maple.png" class="hint-leaf" alt="" />
              <p>어떤 책을 찾고 있나요?</p>
            </div>

            <!-- 검색 결과 -->
            <div v-else-if="results.length > 0" class="result-list">
              <div v-for="book in results" :key="book.id" class="result-item">
                <BookCover :colors="book.coverColor" width="46px" height="64px" />
                <div class="result-info">
                  <p class="result-title">{{ book.title }}</p>
                  <p class="result-author">{{ book.author }}</p>
                  <p v-if="book.publisher" class="result-pub">{{ book.publisher }}</p>
                </div>
                <div class="result-actions">
                  <button class="action-btn reading" @click="addToReading(book)">
                    <BookOpen :size="12" /> 읽는 중
                  </button>
                  <button class="action-btn wish" @click="addToWishlist(book)">
                    <Bookmark :size="12" /> 찜하기
                  </button>
                </div>
              </div>
            </div>

            <!-- 검색 결과 없음 -->
            <div v-else class="empty-result">
              <span class="empty-icon">📚</span>
              <p>검색 결과가 없어요</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 바코드 스캔 풀팝업 ── -->
      <div v-if="showBarcode" class="barcode-overlay" :class="{ open: barcodeOpen }">
        <div class="barcode-full">
          <div class="bc-top">
            <button class="bc-back" @click="closeBarcode">
              <ChevronLeft :size="22" />
            </button>
            <span class="bc-title">바코드 스캔</span>
          </div>

          <!-- 스캐너 뷰파인더 -->
          <div class="bc-viewfinder">
            <div class="vf-frame">
              <span class="vf-corner tl" /><span class="vf-corner tr" />
              <span class="vf-corner bl" /><span class="vf-corner br" />
              <div class="vf-scan-line" />
            </div>
            <p class="vf-hint">책 뒷면의 ISBN 바코드를 네모 안에 맞춰주세요</p>
          </div>

          <!-- ISBN 직접 입력 -->
          <div class="bc-manual">
            <p class="bc-manual-label">직접 입력</p>
            <div class="bc-input-row">
              <input v-model="isbnInput" class="bc-input" placeholder="ISBN 번호 입력" @keyup.enter="searchByIsbn" />
              <button class="bc-search-btn" @click="searchByIsbn">검색</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Search, Camera, ChevronLeft, BookOpen, Bookmark, Clock } from '@lucide/vue'
import BookCover from './BookCover.vue'
import { mockSearchPool } from '../data/mockBooks'
import { useBookStore } from '../stores/bookStore'

const emit = defineEmits<{ (e: 'book-added', msg: string): void }>()
const { addBook } = useBookStore()

// 검색창 상태
const showSearch  = ref(false)
const overlayOpen = ref(false)
const inputRef    = ref<HTMLInputElement | null>(null)
const query       = ref('')
const results     = ref<typeof mockSearchPool>([])

// 최근 검색어 (localStorage)
const recentSearches = ref<string[]>(
  JSON.parse(localStorage.getItem('bn_recent_searches') || '[]')
)
watch(recentSearches, v => localStorage.setItem('bn_recent_searches', JSON.stringify(v)), { deep: true })

// 바코드 상태
const showBarcode  = ref(false)
const barcodeOpen  = ref(false)
const isbnInput    = ref('')

// ── 검색창 열기/닫기 ──
async function openSearch() {
  showSearch.value = true
  await nextTick()
  requestAnimationFrame(() => { overlayOpen.value = true })
  await nextTick()
  inputRef.value?.focus()
}
function closeSearch() {
  overlayOpen.value = false
  setTimeout(() => { showSearch.value = false; query.value = ''; results.value = [] }, 280)
}

// ── 바코드 팝업 열기/닫기 ──
watch(showBarcode, async (v) => {
  if (v) { await nextTick(); requestAnimationFrame(() => { barcodeOpen.value = true }) }
})
function closeBarcode() {
  barcodeOpen.value = false
  setTimeout(() => { showBarcode.value = false; isbnInput.value = '' }, 280)
}

// ── 검색 ──
function doSearch() {
  if (!query.value.trim()) { results.value = []; return }
  const q = query.value.toLowerCase()
  results.value = mockSearchPool.filter(b =>
    b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  )
}

function applyRecent(term: string) {
  query.value = term
  doSearch()
}
function removeRecent(i: number) {
  recentSearches.value.splice(i, 1)
}
function pushRecent(term: string) {
  const list = recentSearches.value.filter(t => t !== term)
  recentSearches.value = [term, ...list].slice(0, 10)
}

// ── 책 추가 ──
function addToReading(book: typeof mockSearchPool[0]) {
  pushRecent(book.title)
  addBook({ title: book.title, author: book.author, coverColor: book.coverColor,
    publisher: book.publisher, totalPages: book.totalPages, status: 'reading' })
  emit('book-added', `"${book.title}" 읽는 책에 추가됐어요 📖`)
  closeSearch()
}
function addToWishlist(book: typeof mockSearchPool[0]) {
  pushRecent(book.title)
  addBook({ title: book.title, author: book.author, coverColor: book.coverColor,
    publisher: book.publisher, totalPages: book.totalPages, status: 'wishlist' })
  emit('book-added', `"${book.title}" 찜한 책에 추가됐어요 🍁`)
  closeSearch()
}

// ── 바코드/ISBN ──
function searchByIsbn() {
  const found = mockSearchPool.find(b => (b as any).isbn === isbnInput.value.trim())
  if (found) {
    closeBarcode()
    setTimeout(() => {
      query.value = found.title
      openSearch()
      doSearch()
    }, 320)
  } else {
    emit('book-added', '해당 ISBN의 책을 찾을 수 없습니다')
  }
}
</script>

<style scoped>
/* ── 검색바 ── */
.search-panel { display: flex; flex-direction: column; }

.search-bar-wrap {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border: 1.5px solid #D4C9B8;
  border-radius: 24px; padding: 11px 14px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.search-icon { color: #8B7355; flex-shrink: 0; }
.search-placeholder { flex: 1; font-size: 14px; color: #B8A88A; user-select: none; }
.camera-btn {
  background: none; border: none; cursor: pointer;
  color: #8B7355; padding: 0; display: flex; align-items: center;
}

/* ══ 전체 검색 오버레이 ══ */
.search-overlay {
  position: fixed; inset: 0; z-index: 400;
  background: #F5F0E8;
  transform: translateY(100%);
  transition: transform .28s cubic-bezier(.32,1,.55,1);
  display: flex; flex-direction: column;
}
.search-overlay.open { transform: translateY(0); }

.search-full { display: flex; flex-direction: column; height: 100%; }

/* 상단 인풋 */
.sf-top {
  display: flex; align-items: center; gap: 8px;
  padding: 52px 16px 14px;
  background: #F5F0E8;
  border-bottom: 1px solid #E0D6C4;
}
.sf-back {
  width: 36px; height: 36px; border-radius: 50%;
  background: #EDE0CC; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #4A3520; flex-shrink: 0;
}
.sf-input-wrap {
  flex: 1; display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #D4C9B8;
  border-radius: 24px; padding: 10px 14px;
}
.sf-icon { color: #8B7355; flex-shrink: 0; }
.sf-input {
  flex: 1; border: none; outline: none;
  font-size: 15px; color: #2C2018; background: transparent;
}
.sf-clear {
  background: none; border: none; cursor: pointer;
  color: #B8A88A; font-size: 12px; padding: 0;
}

/* 바디 */
.sf-body { flex: 1; overflow-y: auto; padding: 20px 16px 40px; }

/* 최근 검색 */
.recent-section { display: flex; flex-direction: column; gap: 12px; }
.recent-header { display: flex; justify-content: space-between; align-items: center; }
.recent-title { font-size: 13px; font-weight: 700; color: #4A3520; }
.recent-clear-all { font-size: 12px; color: #9B8B7A; background: none; border: none; cursor: pointer; }
.recent-list { display: flex; flex-wrap: wrap; gap: 8px; }
.recent-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 20px;
  background: #EDE0CC; border: none; cursor: pointer;
  font-size: 13px; color: #4A3520;
}
.recent-del {
  font-size: 10px; color: #9B8B7A; margin-left: 2px;
  padding: 0 2px;
}

/* 힌트 */
.search-hint {
  display: flex; flex-direction: column; align-items: center;
  padding: 48px 0; gap: 12px;
}
.hint-leaf { width: 72px; opacity: 0.35; mix-blend-mode: multiply; }
.search-hint p { font-size: 14px; color: #9B8B7A; margin: 0; }

/* 검색 결과 */
.result-list { display: flex; flex-direction: column; gap: 12px; }
.result-item {
  display: flex; gap: 12px; align-items: center;
  background: #fff; border-radius: 14px; padding: 12px 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.result-info { flex: 1; min-width: 0; }
.result-title { font-size: 14px; font-weight: 700; color: #2C2018; margin: 0 0 3px; }
.result-author { font-size: 12px; color: #8B7355; margin: 0 0 2px; }
.result-pub { font-size: 11px; color: #B8A88A; margin: 0; }
.result-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.action-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 700; padding: 6px 10px;
  border-radius: 20px; border: none; cursor: pointer; white-space: nowrap;
}
.action-btn.reading { background: #B85C38; color: #fff; }
.action-btn.wish { background: #EDE0CC; color: #5C3D1A; }

/* 결과 없음 */
.empty-result {
  display: flex; flex-direction: column; align-items: center;
  padding: 48px 0; gap: 10px;
}
.empty-icon { font-size: 40px; opacity: 0.4; }
.empty-result p { font-size: 14px; color: #8B7355; margin: 0; }

/* ══ 바코드 풀팝업 ══ */
.barcode-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: #1A1008;
  transform: translateY(100%);
  transition: transform .28s cubic-bezier(.32,1,.55,1);
  display: flex; flex-direction: column;
}
.barcode-overlay.open { transform: translateY(0); }

.barcode-full { display: flex; flex-direction: column; height: 100%; }

.bc-top {
  display: flex; align-items: center; gap: 12px;
  padding: 52px 16px 16px;
}
.bc-back {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.12); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.bc-title { font-size: 18px; font-weight: 700; color: #fff; }

/* 뷰파인더 */
.bc-viewfinder {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 24px;
}
.vf-frame {
  position: relative;
  width: 240px; height: 240px;
  border: none;
}
/* 코너 마커 */
.vf-corner {
  position: absolute;
  width: 28px; height: 28px;
  border-color: #F5C842;
  border-style: solid;
}
.vf-corner.tl { top:0; left:0;  border-width: 3px 0 0 3px; border-radius: 3px 0 0 3px; }
.vf-corner.tr { top:0; right:0; border-width: 3px 3px 0 0; border-radius: 0 3px 0 0; }
.vf-corner.bl { bottom:0; left:0;  border-width: 0 0 3px 3px; border-radius: 0 0 0 3px; }
.vf-corner.br { bottom:0; right:0; border-width: 0 3px 3px 0; border-radius: 0 0 3px 0; }

/* 스캔 라인 애니메이션 */
.vf-scan-line {
  position: absolute;
  left: 8px; right: 8px; height: 2px;
  background: linear-gradient(90deg, transparent, #F5C842, transparent);
  top: 50%;
  animation: scan 2s ease-in-out infinite;
}
@keyframes scan {
  0%   { top: 10%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

.vf-hint {
  font-size: 13px; color: rgba(255,255,255,0.65);
  text-align: center; margin: 0; max-width: 220px; line-height: 1.5;
}

/* 직접 입력 */
.bc-manual {
  padding: 24px 20px 48px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex; flex-direction: column; gap: 10px;
}
.bc-manual-label { font-size: 12px; color: rgba(255,255,255,0.5); margin: 0; font-weight: 600; letter-spacing: 0.5px; }
.bc-input-row { display: flex; gap: 10px; }
.bc-input {
  flex: 1; padding: 12px 14px; border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08); color: #fff;
  font-size: 14px; outline: none;
}
.bc-input::placeholder { color: rgba(255,255,255,0.35); }
.bc-search-btn {
  padding: 12px 20px; background: #F5C842; color: #1A1008;
  border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer;
}
</style>
