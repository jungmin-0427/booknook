<template>
  <div class="wishlist-view">
    <header class="wish-header">
      <h1 class="wish-title">찜한 책</h1>
      <span class="wish-count">{{ wishlistBooks.length }}권</span>
    </header>

    <!-- Empty -->
    <div v-if="wishlistBooks.length === 0" class="empty-state">
      <span class="empty-leaf">🔖</span>
      <p class="empty-msg">찜한 책이 없어요</p>
      <p class="empty-sub">읽고 싶은 책을 검색해서 추가해보세요</p>
    </div>

    <!-- 콜라주 무드보드 -->
    <div v-else class="moodboard">
      <div
        v-for="(book, i) in wishlistBooks" :key="book.id"
        class="mood-item"
        :style="moodStyle(i)"
        @click="detailBook = book"
      >
        <div class="mood-tape" :style="tapeStyle(i)" />
        <BookCover :colors="book.coverColor" width="90px" height="126px" />
        <div class="mood-label">
          <p class="mood-title">{{ book.title }}</p>
          <p class="mood-author">{{ book.author }}</p>
        </div>
        <div class="mood-leaf">🍁</div>
      </div>
    </div>

    <!-- Leaf scatter -->
    <div class="bg-leaf l1">🍂</div>
    <div class="bg-leaf l2">🍁</div>

    <!-- Book detail -->
    <BookDetailSheet :book="detailBook" @close="detailBook = null" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Book } from '../types/book'
import BookCover from '../components/BookCover.vue'
import BookDetailSheet from '../components/BookDetailSheet.vue'
import { useBookStore } from '../stores/bookStore'

const { wishlistBooks } = useBookStore()
const detailBook = ref<Book | null>(null)

const rotations = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3]
const offsets   = [0, 6, -4, 3, -6, 4, -2, 5, -3, 2]
const tapeColors = [
  'rgba(218,192,128,0.6)', 'rgba(170,205,195,0.55)',
  'rgba(200,180,220,0.5)', 'rgba(220,192,128,0.55)',
]

function moodStyle(i: number) {
  return {
    transform: `rotate(${rotations[i % rotations.length]}deg)`,
    marginTop: `${offsets[i % offsets.length]}px`,
  }
}
function tapeStyle(i: number) {
  return { background: tapeColors[i % tapeColors.length] }
}
</script>

<style scoped>
.wishlist-view {
  flex: 1; overflow-y: auto; padding: 24px 20px 32px;
  display: flex; flex-direction: column; gap: 16px; position: relative;
}

.wish-header { display: flex; align-items: baseline; gap: 10px; }
.wish-title { font-size: 22px; font-weight: 700; color: #2C2018; font-family: 'Noto Serif KR', serif; margin: 0; }
.wish-count { font-size: 13px; color: #8B7355; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 0; gap: 10px; }
.empty-leaf { font-size: 48px; opacity: 0.4; }
.empty-msg { font-size: 16px; font-weight: 700; color: #4A3520; margin: 0; }
.empty-sub { font-size: 13px; color: #8B7355; margin: 0; }

/* Moodboard */
.moodboard {
  display: flex; flex-wrap: wrap; gap: 16px;
  padding: 8px 4px;
  align-items: flex-start;
}
.mood-item {
  position: relative; cursor: pointer;
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; width: calc(50% - 8px);
  transition: transform 0.15s ease;
}
.mood-item:active { transform: scale(0.97) !important; }

/* Tape strip on top of each card */
.mood-tape {
  position: absolute; top: -8px; left: 50%; transform: translateX(-50%) rotate(-3deg);
  width: 54px; height: 16px; border-radius: 2px; z-index: 2;
}

.mood-label {
  background: #F5F0E8; padding: 6px 8px; width: 100%;
  border-radius: 0 0 4px 4px; text-align: center;
}
.mood-title { font-size: 11px; font-weight: 700; color: #2C2018; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mood-author { font-size: 10px; color: #9B8B7A; margin: 0; }

.mood-leaf {
  position: absolute; bottom: 28px; right: -6px;
  font-size: 22px; opacity: 0.6; transform: rotate(20deg);
  pointer-events: none;
}

.bg-leaf {
  position: fixed; pointer-events: none; opacity: 0.25; font-size: 36px;
}
.l1 { bottom: 100px; right: 16px; transform: rotate(-15deg); }
.l2 { bottom: 160px; right: 50px; transform: rotate(20deg); }
</style>
