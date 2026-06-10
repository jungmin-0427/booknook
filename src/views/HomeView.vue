<template>
  <div class="home-view">
    <!-- Header -->
    <header class="home-header">
      <div class="header-icons">
        <button class="icon-btn"><Bell :size="20" /></button>
        <button class="icon-btn"><Settings :size="20" /></button>
      </div>
      <img :src="`/booknook.png?t=${imgTs}`" alt="book nook" class="logo-img" />
    </header>

    <!-- Search bar -->
    <SearchPanel @book-added="showToast" />

    <!-- 읽는 중 캐러셀 -->
    <section class="reading-section">
      <div v-if="readingBooks.length > 0" class="carousel-outer">
        <!-- 카운트 뱃지 -->
        <div class="reading-count-badge" v-if="readingBooks.length > 1">
          <img src="/maple.png" class="badge-leaf" alt="" />
          <span>{{ activeIdx + 1 }} / {{ readingBooks.length }}권 읽는 중</span>
        </div>

        <!-- 캐러셀 트랙 -->
        <div
          class="carousel-track"
          ref="trackRef"
          @mousedown="onDragStart"
          @touchstart.passive="onTouchStart"
          @mousemove="onDragMove"
          @touchmove.passive="onTouchMove"
          @mouseup="onDragEnd"
          @mouseleave="onDragEnd"
          @touchend="onTouchEnd"
        >
          <div
            class="carousel-slides"
            :style="slidesStyle"
          >
            <div
              v-for="(book, i) in readingBooks"
              :key="book.id"
              class="carousel-slide"
              :class="{ active: i === activeIdx }"
            >
              <ReadingCard
                :book="book"
                :current="i"
                :total="readingBooks.length"
                @change="goTo"
                @tap="openDetail(book)"
              />
            </div>
          </div>
        </div>

        <!-- 도트 인디케이터 -->
        <div v-if="readingBooks.length > 1" class="dots">
          <button
            v-for="(_, i) in readingBooks"
            :key="i"
            class="dot"
            :class="{ active: i === activeIdx }"
            @click="goTo(i)"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-paper">
        <img src="/maple.png" class="empty-leaf-img" alt="" />
        <p class="empty-msg">읽고 있는 책이 없어요</p>
        <p class="empty-sub">검색해서 책을 추가해보세요</p>
      </div>
    </section>

    <!-- Book detail sheet -->
    <BookDetailSheet :book="detailBook" @close="detailBook = null" />

    <!-- Toast -->
    <Teleport to="body">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Bell, Settings } from '@lucide/vue'
import type { Book } from '../types/book'
import SearchPanel from '../components/SearchPanel.vue'
import ReadingCard from '../components/ReadingCard.vue'
import BookDetailSheet from '../components/BookDetailSheet.vue'
import { useBookStore } from '../stores/bookStore'

const { readingBooks } = useBookStore()
const activeIdx = ref(0)
const detailBook = ref<Book | null>(null)
const toast = ref('')
const imgTs = ref(Date.now())
const trackRef = ref<HTMLElement | null>(null)

// 캐러셀 위치
const offsetX   = ref(0)   // 현재 슬라이드 오프셋
const dragging  = ref(false)
const dragStart = ref(0)
const dragDelta = ref(0)

// 슬라이드 트랜스폼
const slidesStyle = computed(() => {
  const base = -activeIdx.value * 100
  const drag = dragging.value ? (dragDelta.value / (trackRef.value?.offsetWidth || 1)) * 100 : 0
  return {
    transform: `translateX(${base + drag}%)`,
    transition: dragging.value ? 'none' : 'transform 0.32s cubic-bezier(.25,.8,.25,1)',
  }
})

// 인덱스 이동
function goTo(i: number) {
  activeIdx.value = Math.max(0, Math.min(i, readingBooks.value.length - 1))
}

// readingBooks 줄면 idx 보정
watch(() => readingBooks.value.length, (len) => {
  if (activeIdx.value >= len) activeIdx.value = Math.max(0, len - 1)
})

// ── 드래그 (mouse) ──
function onDragStart(e: MouseEvent) {
  dragging.value = true; dragStart.value = e.clientX; dragDelta.value = 0
}
function onDragMove(e: MouseEvent) {
  if (!dragging.value) return
  dragDelta.value = e.clientX - dragStart.value
}
function onDragEnd() {
  if (!dragging.value) return
  dragging.value = false
  const w = trackRef.value?.offsetWidth || 300
  if (dragDelta.value < -w * 0.2)      goTo(activeIdx.value + 1)
  else if (dragDelta.value > w * 0.2)  goTo(activeIdx.value - 1)
  dragDelta.value = 0
}

// ── 스와이프 (touch) ──
function onTouchStart(e: TouchEvent) {
  dragging.value = true; dragStart.value = e.touches[0].clientX; dragDelta.value = 0
}
function onTouchMove(e: TouchEvent) {
  if (!dragging.value) return
  dragDelta.value = e.touches[0].clientX - dragStart.value
}
function onTouchEnd() { onDragEnd() }

function openDetail(book: Book) { detailBook.value = book }

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>

<style scoped>
.home-view {
  flex: 1; overflow-y: auto;
  padding: 20px 20px 32px;
  display: flex; flex-direction: column; gap: 18px;
}

.home-header { display: flex; flex-direction: column; gap: 8px; }
.header-icons { display: flex; gap: 2px; justify-content: flex-end; }
.icon-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: none; border: none; cursor: pointer;
  color: #4A3520; display: flex; align-items: center; justify-content: center;
}
.logo-img {
  width: 100%; height: auto; object-fit: contain;
  display: block; mix-blend-mode: multiply;
}

/* ── 캐러셀 ── */
.carousel-outer {
  display: flex; flex-direction: column; gap: 14px;
}

.reading-count-badge {
  display: flex; align-items: center; gap: 6px;
  background: rgba(184,92,56,0.09);
  border-radius: 20px; padding: 5px 12px;
  font-size: 12px; color: #B85C38; font-weight: 600;
  align-self: flex-start;
}
.badge-leaf { width: 16px; height: auto; mix-blend-mode: multiply; }

.carousel-track {
  overflow: hidden;
  cursor: grab;
  /* 좌우 패딩 제거, 전체 너비 사용 */
  margin: 0 -20px;
  padding: 0 20px;
  /* 드래그 중 텍스트 선택 방지 */
  user-select: none;
}
.carousel-track:active { cursor: grabbing; }

.carousel-slides {
  display: flex;
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 100%;
  min-width: 0;
  /* 비활성 슬라이드 살짝 축소 */
  transition: transform 0.32s ease, opacity 0.32s ease;
  opacity: 0.55;
  transform: scale(0.94);
}
.carousel-slide.active {
  opacity: 1;
  transform: scale(1);
}

/* 도트 인디케이터 */
.dots {
  display: flex; justify-content: center; gap: 8px;
}
.dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(140,110,80,0.22);
  border: none; cursor: pointer; padding: 0;
  transition: all 0.2s ease;
}
.dot.active {
  background: #8B6E4E;
  width: 22px; border-radius: 4px;
}

/* 빈 상태 */
.empty-paper {
  background: #F8F3E8; border: 1.5px dashed #C4A870;
  border-radius: 12px; padding: 40px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty-leaf-img { width: 60px; opacity: 0.35; mix-blend-mode: multiply; }
.empty-msg { font-size: 16px; font-weight: 700; color: #4A3520; margin: 0; }
.empty-sub { font-size: 13px; color: #8B7355; margin: 0; }

/* Toast */
.toast {
  position: fixed; bottom: 100px; left: 50%;
  transform: translateX(-50%);
  background: #2C1A0E; color: #F5E6CC;
  font-size: 13px; font-weight: 600;
  padding: 10px 20px; border-radius: 20px;
  z-index: 600; white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  animation: toastIn .2s ease;
}
@keyframes toastIn {
  from { opacity:0; transform: translateX(-50%) translateY(10px); }
  to   { opacity:1; transform: translateX(-50%) translateY(0); }
}
</style>
