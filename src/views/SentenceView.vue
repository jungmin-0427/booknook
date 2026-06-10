<template>
  <div class="sentence-view">
    <header class="sent-header">
      <img src="/maple.png" class="header-leaf-icon" alt="" />
      <h1 class="sent-title">문장 수집</h1>
      <span class="sent-count">{{ displayLeaves.length }}개</span>
    </header>

    <!-- 책별 필터 -->
    <div class="filter-row">
      <button class="filter-btn" :class="{ active: filterBook === null }"
        @click="filterBook = null">전체</button>
      <button v-for="book in booksWithLeaves" :key="book.id"
        class="filter-btn" :class="{ active: filterBook === book.id }"
        @click="filterBook = book.id">
        {{ book.title }}
      </button>
    </div>

    <!-- Empty -->
    <div v-if="displayLeaves.length === 0" class="empty-state">
      <img src="/maple.png" class="empty-leaf-img" alt="" />
      <p class="empty-msg">수집한 문장이 없어요</p>
      <p class="empty-sub">책 상세에서 인상 깊은 문장을 저장해보세요</p>
    </div>

    <!-- 단풍잎 스캐터 레이아웃 -->
    <div v-else class="leaves-scatter">
      <div
        v-for="(leaf, i) in displayLeaves"
        :key="leaf.id"
        class="leaf-item"
        :style="leafStyle(i)"
        @click="openDetail(leaf.bookId)"
      >
        <!-- 단풍잎 PNG -->
        <img src="/maple.png" class="leaf-img" alt="" />
        <!-- 텍스트 오버레이 -->
        <div class="leaf-text">
          <p class="leaf-sentence">{{ leaf.sentence }}</p>
          <p class="leaf-book-name">— {{ bookMap[leaf.bookId]?.title ?? '' }}</p>
        </div>
        <!-- 삭제 버튼 -->
        <button class="leaf-del" @click.stop="removeLeaf(leaf.id)">✕</button>
      </div>
    </div>

    <!-- 책 상세 시트 -->
    <BookDetailSheet :book="detailBook" @close="detailBook = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Book } from '../types/book'
import BookDetailSheet from '../components/BookDetailSheet.vue'
import { useBookStore } from '../stores/bookStore'

const { state, removeLeaf } = useBookStore()

const filterBook = ref<string | null>(null)
const detailBook = ref<Book | null>(null)

const bookMap = computed(() => Object.fromEntries(state.books.map(b => [b.id, b])))

const booksWithLeaves = computed(() => {
  const ids = new Set(state.leaves.map(l => l.bookId))
  return state.books.filter(b => ids.has(b.id))
})

const displayLeaves = computed(() =>
  filterBook.value
    ? state.leaves.filter(l => l.bookId === filterBook.value)
    : [...state.leaves]
)

function openDetail(bookId: string) {
  detailBook.value = bookMap.value[bookId] ?? null
}

// 각 잎마다 살짝 다른 회전/위치로 자연스럽게
const rotations = [-6, 5, -3, 7, -8, 4, -5, 6, -2, 8]
const scales    = [1, 0.93, 1.04, 0.96, 1.02, 0.95, 1.06, 0.97, 1.01, 0.94]

function leafStyle(i: number) {
  return {
    transform: `rotate(${rotations[i % rotations.length]}deg) scale(${scales[i % scales.length]})`,
  }
}
</script>

<style scoped>
.sentence-view {
  flex: 1; overflow-y: auto;
  padding: 24px 16px 100px;
  display: flex; flex-direction: column; gap: 16px;
  /* 페이퍼 배경 질감 */
  background-image: repeating-linear-gradient(
    0deg, transparent, transparent 27px,
    rgba(180,155,100,0.05) 27px, rgba(180,155,100,0.05) 28px
  );
}

/* 헤더 */
.sent-header { display: flex; align-items: center; gap: 8px; }
.header-leaf-icon { width: 28px; height: auto; mix-blend-mode: multiply; }
.sent-title { font-size: 22px; font-weight: 700; color: #2C2018; font-family: 'Noto Serif KR', serif; margin: 0; }
.sent-count { font-size: 13px; color: #B85C38; font-weight: 600; margin-left: 4px; }

/* 필터 */
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-btn {
  padding: 5px 14px; border-radius: 20px;
  border: 1.5px solid #D4C9B8; background: rgba(255,255,255,0.7);
  font-size: 12px; font-weight: 600; color: #6B5744; cursor: pointer;
  white-space: nowrap;
}
.filter-btn.active { background: #B85C38; border-color: #B85C38; color: #fff; }

/* 빈 상태 */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px 0; gap: 12px; }
.empty-leaf-img { width: 100px; opacity: 0.35; mix-blend-mode: multiply; }
.empty-msg { font-size: 16px; font-weight: 700; color: #4A3520; margin: 0; }
.empty-sub { font-size: 13px; color: #8B7355; margin: 0; text-align: center; }

/* ── 단풍잎 스캐터 ── */
.leaves-scatter {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 8px;
  padding: 4px 0;
}

.leaf-item {
  position: relative;
  cursor: pointer;
  transition: transform 0.18s ease;
  /* 각 아이템이 서로 살짝 겹쳐보이는 효과 */
  filter: drop-shadow(2px 4px 8px rgba(80,40,10,0.18));
}
.leaf-item:active {
  filter: drop-shadow(1px 2px 4px rgba(80,40,10,0.12)) brightness(0.95);
}

/* 단풍잎 이미지 — 전체 너비 */
.leaf-img {
  width: 100%;
  height: auto;
  display: block;
}

/* 텍스트: 잎 위에 절대 위치 오버레이 */
.leaf-text {
  position: absolute;
  /* 단풍잎 이미지에서 텍스트가 들어갈 잎몸 영역 (상단 10% ~ 하단 25% 사이) */
  top: 18%;
  left: 12%;
  right: 12%;
  bottom: 22%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}

.leaf-sentence {
  font-size: 11px;
  font-family: 'Noto Serif KR', serif;
  color: #2C1200;
  line-height: 1.7;
  text-align: center;
  margin: 0;
  /* 말줄임표: 3줄까지 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  /* 잎 위 가독성을 위한 텍스트 그림자 */
  text-shadow:
    0 0 8px rgba(255,240,200,0.8),
    0 1px 2px rgba(255,240,200,0.6);
  font-weight: 600;
}

.leaf-book-name {
  font-size: 9.5px;
  color: #4A1A00;
  font-family: 'Noto Serif KR', serif;
  margin: 0;
  text-align: center;
  opacity: 0.75;
  text-shadow: 0 0 6px rgba(255,240,200,0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* 삭제 버튼 */
.leaf-del {
  position: absolute;
  top: 6px; right: 6px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(255,255,255,0.55);
  border: none; cursor: pointer;
  font-size: 9px; color: #6B3A1A;
  display: flex; align-items: center; justify-content: center;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.15s;
}
.leaf-item:hover .leaf-del { opacity: 1; }
</style>
