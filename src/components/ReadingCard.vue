<template>
  <div class="reading-card-wrapper">

    <!-- Behind-card: layered paper scraps -->
    <div class="scrap scrap-grid" />
    <div class="scrap scrap-lined" />

    <!-- Main paper card -->
    <div class="paper-bg" @click="$emit('tap')" style="cursor:pointer">
      <!-- Torn top edge -->
      <div class="torn-top" />

      <!-- Tapes -->
      <div class="tape tape-tl" />
      <div class="tape tape-tr" />

      <!-- Paper clip (right side) -->
      <div class="paper-clip" />

      <div class="card-inner">
        <!-- Top row: cover + book meta -->
        <div class="card-body">
          <div class="cover-area">
            <div class="cover-with-badge">
              <BookCover :colors="book.coverColor" width="106px" height="148px" />
              <div class="status-badge">읽는 중</div>
            </div>
          </div>

          <div class="book-info">
            <h2 class="book-title">{{ book.title }}</h2>
            <p class="book-author">{{ book.author }}</p>

            <div class="progress-area">
              <div class="progress-bar-track">
                <div class="progress-bar-fill" :style="{ width: (book.progressPercent || 0) + '%' }" />
              </div>
              <span class="progress-pct">{{ book.progressPercent }}%</span>
            </div>
          </div>
        </div>

        <!-- Maple leaf deco (하단 우측) -->
        <img src="/maple.png" class="maple-leaf-deco" alt="" />
      </div>

      <!-- Torn bottom edge -->
      <div class="torn-bottom" />
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Book } from '../types/book'
import BookCover from './BookCover.vue'

defineProps<{
  book: Book
  current: number
  total: number
}>()
defineEmits<{ (e: 'change', idx: number): void; (e: 'tap'): void }>()
</script>

<style scoped>
.reading-card-wrapper {
  position: relative;
  padding: 14px 4px 0;
  /* scrap 데코가 왼쪽으로 삐져나오지 않도록 */
  margin-left: 10px;
  margin-right: 6px;
}

/* ── Background paper scraps ── */
.scrap {
  position: absolute;
  border-radius: 3px;
  z-index: 0;
}

.scrap-grid {
  top: -2px;
  left: -10px;
  width: 100px;
  height: 80px;
  background-color: #EDE5CC;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 9px, rgba(160,140,90,0.25) 9px, rgba(160,140,90,0.25) 10px),
    repeating-linear-gradient(90deg, transparent, transparent 9px, rgba(160,140,90,0.25) 9px, rgba(160,140,90,0.25) 10px);
  transform: rotate(-7deg);
  opacity: 0.85;
  /* Torn right edge */
  clip-path: polygon(
    0 0, 95% 0, 100% 8%, 93% 18%, 98% 28%, 91% 38%, 97% 48%,
    92% 58%, 99% 68%, 93% 78%, 98% 88%, 94% 100%, 0 100%
  );
}

.scrap-lined {
  top: 0px;
  right: -6px;
  width: 70px;
  height: 55px;
  background-color: #F5EEDC;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(120,100,60,0.15) 10px, rgba(120,100,60,0.15) 11px);
  transform: rotate(5deg);
  opacity: 0.7;
  clip-path: polygon(
    4% 0, 100% 0, 100% 100%, 0 100%, 0 12%, 5% 28%, 1% 42%, 6% 58%, 0 72%, 5% 88%
  );
}

/* ── Main card ── */
.paper-bg {
  background: #F8F2E5;
  position: relative;
  padding: 0 20px 10px;
  box-shadow:
    3px 5px 20px rgba(0,0,0,0.14),
    0 1px 0 rgba(255,255,255,0.6) inset;
  z-index: 1;
  /* Subtle lined texture */
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 27px,
      rgba(180,155,100,0.07) 27px,
      rgba(180,155,100,0.07) 28px
    );
}

/* ── Torn top edge ── */
.torn-top {
  position: absolute;
  top: -12px;
  left: 0; right: 0;
  height: 18px;
  background: #F8F2E5;
  clip-path: polygon(
    0% 100%,
    1.5% 20%, 3% 100%, 4.5% 30%, 6% 85%, 7.5% 10%, 9% 90%, 10.5% 20%,
    12% 75%, 13.5% 5%, 15% 95%, 16.5% 25%, 18% 80%, 19.5% 0%, 21% 100%,
    22.5% 35%, 24% 70%, 25.5% 0%, 27% 90%, 28.5% 20%, 30% 85%, 31.5% 5%,
    33% 95%, 34.5% 30%, 36% 75%, 37.5% 10%, 39% 100%, 40.5% 25%, 42% 65%,
    43.5% 0%, 45% 90%, 46.5% 15%, 48% 80%, 49.5% 5%, 51% 95%, 52.5% 30%,
    54% 70%, 55.5% 0%, 57% 85%, 58.5% 15%, 60% 90%, 61.5% 20%, 63% 75%,
    64.5% 5%, 66% 95%, 67.5% 25%, 69% 65%, 70.5% 0%, 72% 85%, 73.5% 15%,
    75% 80%, 76.5% 5%, 78% 95%, 79.5% 30%, 81% 70%, 82.5% 0%, 84% 90%,
    85.5% 20%, 87% 75%, 88.5% 10%, 90% 95%, 91.5% 25%, 93% 65%, 94.5% 5%,
    96% 80%, 97.5% 0%, 99% 90%, 100% 100%
  );
}

/* ── Torn bottom edge ── */
.torn-bottom {
  position: absolute;
  bottom: -14px;
  left: 0; right: 0;
  height: 20px;
  background: #F8F2E5;
  clip-path: polygon(
    0% 0%,
    1% 80%, 2.5% 5%, 4% 90%, 5.5% 15%, 7% 75%, 8.5% 0%, 10% 85%,
    11.5% 10%, 13% 95%, 14.5% 20%, 16% 70%, 17.5% 0%, 19% 80%, 20.5% 5%,
    22% 95%, 23.5% 25%, 25% 65%, 26.5% 0%, 28% 90%, 29.5% 15%, 31% 80%,
    32.5% 5%, 34% 95%, 35.5% 30%, 37% 75%, 38.5% 0%, 40% 85%, 41.5% 10%,
    43% 90%, 44.5% 20%, 46% 70%, 47.5% 0%, 49% 85%, 50.5% 5%, 52% 95%,
    53.5% 25%, 55% 65%, 56.5% 0%, 58% 80%, 59.5% 10%, 61% 90%, 62.5% 20%,
    64% 75%, 65.5% 5%, 67% 95%, 68.5% 30%, 70% 70%, 71.5% 0%, 73% 85%,
    74.5% 15%, 76% 80%, 77.5% 5%, 79% 90%, 80.5% 20%, 82% 65%, 83.5% 0%,
    85% 85%, 86.5% 10%, 88% 95%, 89.5% 25%, 91% 70%, 92.5% 0%, 94% 80%,
    95.5% 5%, 97% 90%, 98.5% 15%, 100% 75%, 100% 0%
  );
}

/* ── Tape strips ── */
.tape {
  position: absolute;
  height: 20px;
  border-radius: 2px;
  z-index: 3;
}
.tape-tl {
  top: -8px; left: 24px;
  width: 72px;
  background: rgba(218,192,128,0.58);
  transform: rotate(-7deg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.tape-tr {
  top: -6px; right: 36px;
  width: 58px;
  background: rgba(170,205,195,0.52);
  transform: rotate(6deg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* ── Paper clip ── */
.paper-clip {
  position: absolute;
  top: 14px;
  right: 20px;
  width: 18px;
  height: 50px;
  border: 3.5px solid #9B8260;
  border-radius: 12px 12px 0 0;
  border-bottom: none;
  z-index: 4;
}
.paper-clip::after {
  content: '';
  position: absolute;
  top: 7px; left: 2px;
  width: 9px; height: 34px;
  border: 3.5px solid #9B8260;
  border-radius: 7px 7px 0 0;
  border-bottom: none;
}

/* ── Maple leaf (카드 우하단 절대위치) ── */
.maple-leaf-deco {
  position: absolute;
  bottom: 8px;
  right: 10px;
  width: 64px;
  height: auto;
  opacity: 0.82;
  transform: rotate(14deg);
  filter: drop-shadow(2px 3px 5px rgba(0,0,0,0.18));
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: multiply;
}

.card-inner { position: relative; z-index: 2; padding-top: 20px; padding-bottom: 56px; }

/* ── Cover + badge ── */
.card-body {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.cover-area { flex-shrink: 0; }
.cover-with-badge { position: relative; display: inline-block; }

.status-badge {
  position: absolute;
  top: 10px; left: -4px;
  background: #2C5FA8;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 0.5px;
  box-shadow: 1px 2px 4px rgba(0,0,0,0.25);
  z-index: 5;
}

/* ── Book info ── */
.book-info { flex: 1; min-width: 0; }

.book-title {
  font-size: 18px;
  font-weight: 700;
  color: #2C1A0E;
  letter-spacing: -0.5px;
  line-height: 1.3;
  margin: 0 0 4px;
  font-family: 'Noto Serif KR', 'Georgia', serif;
  word-break: keep-all;
}
.book-author {
  font-size: 14px;
  color: #6B5240;
  margin: 0 0 12px;
}

.progress-area {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.progress-bar-track {
  flex: 1; height: 6px;
  background: rgba(0,0,0,0.1);
  border-radius: 3px; overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: #2C5FA8;
  border-radius: 3px;
  transition: width 0.5s ease;
}
.progress-pct {
  font-size: 13px;
  font-weight: 700;
  color: #2C5FA8;
  min-width: 32px;
  text-align: right;
}

.sentence-area {
  margin-top: 16px;
}
.sentence-label {
  font-size: 11px;
  color: #8B7355;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 7px;
}
.sentence-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.today-sentence {
  flex: 1;
  font-size: 13px;
  color: #3D2B1A;
  line-height: 1.75;
  white-space: pre-line;
  font-family: 'Noto Serif KR', 'Georgia', serif;
  margin: 0;
}

/* ── Timer strip ── */
.timer-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding-bottom: 8px;
}
.timer-tape {
  background: #2C1A0E;
  color: #F5E6CC;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 3px;
  letter-spacing: 0.3px;
  box-shadow: 1px 2px 4px rgba(0,0,0,0.2);
}
.timer-goal {
  font-size: 12px;
  color: #8B7355;
}

/* ── Dot indicators ── */
.dot-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
}
.dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(140,110,80,0.25);
  border: none; cursor: pointer; padding: 0;
  transition: all 0.2s ease;
}
.dot.active {
  background: #8B6E4E;
  width: 22px;
  border-radius: 4px;
}
</style>
