<template>
  <Teleport to="body">
    <div v-if="book" class="bs-overlay" @click.self="$emit('close')">
      <div class="bs-sheet" :class="{ open: sheetOpen }">
        <div class="bs-handle" />

        <!-- Header -->
        <div class="detail-header">
          <BookCover :colors="book.coverColor" width="72px" height="100px" />
          <div class="detail-meta">
            <span class="detail-status-badge" :class="book.status">{{ statusLabel }}</span>
            <h2 class="detail-title">{{ book.title }}</h2>
            <p class="detail-author">{{ book.author }}</p>
            <p v-if="book.publisher" class="detail-pub">{{ book.publisher }}</p>

            <!-- 단풍잎 평가 (done 상태만) -->
            <div v-if="book.status === 'done'" class="rating-row">
              <MapleLeafRating :modelValue="book.rating" :editable="true"
                @update:modelValue="setRating(book.id, $event)" />
            </div>
          </div>
        </div>

        <!-- 독서 상태 변경 -->
        <div class="section">
          <div class="section-label">독서 상태</div>
          <div class="status-pills">
            <button v-for="s in statuses" :key="s.value"
              class="status-pill" :class="{ active: book.status === s.value }"
              @click="changeStatus(book.id, s.value)">
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- 독서 진행률 -->
        <div v-if="book.status !== 'wishlist'" class="section">
          <div class="section-label">독서 진행률</div>
          <div class="progress-input-row">
            <input
              type="number" class="page-input"
              :value="book.currentPage"
              :max="book.totalPages ?? 9999"
              min="0"
              placeholder="현재 페이지"
              @change="onPageChange"
            />
            <span class="page-sep">/</span>
            <input
              type="number" class="page-input total"
              :value="book.totalPages ?? ''"
              placeholder="전체 페이지"
              @change="onTotalChange"
            />
            <span class="progress-badge">{{ book.progressPercent }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: book.progressPercent + '%' }" />
          </div>
        </div>

        <!-- 한줄 메모 -->
        <div class="section">
          <div class="section-label">한줄 메모</div>
          <textarea
            class="memo-input"
            :value="book.memo"
            placeholder="이 책에 대한 짧은 감상을 남겨요 (최대 200자)"
            maxlength="200"
            @input="updateBook(book.id, { memo: ($event.target as HTMLTextAreaElement).value })"
          />
        </div>

        <!-- 단풍잎 문장 추가 -->
        <div class="section">
          <div class="section-label">🍁 문장 수집</div>
          <div class="leaf-input-row">
            <textarea
              v-model="newSentence"
              class="leaf-input"
              placeholder="인상 깊은 문장을 입력하세요"
              rows="2"
              maxlength="500"
            />
            <button class="leaf-add-btn" @click="saveLeaf">저장</button>
          </div>
          <div class="leaf-list">
            <div v-for="leaf in bookLeaves" :key="leaf.id" class="leaf-item">
              <p class="leaf-text">"{{ leaf.sentence }}"</p>
              <button class="leaf-del" @click="removeLeaf(leaf.id)">✕</button>
            </div>
            <p v-if="bookLeaves.length === 0" class="leaf-empty">아직 수집한 문장이 없어요</p>
          </div>
        </div>

        <!-- 삭제 -->
        <button class="remove-btn" @click="onRemove">서재에서 삭제</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Book, BookStatus } from '../types/book'
import BookCover from './BookCover.vue'
import MapleLeafRating from './MapleLeafRating.vue'
import { useBookStore } from '../stores/bookStore'

const props = defineProps<{ book: Book | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { updateBook, updateProgress, changeStatus, removeBook, addLeaf, removeLeaf, leavesForBook, setRating } = useBookStore()

const sheetOpen = ref(false)
const newSentence = ref('')

watch(() => props.book, async (v) => {
  if (v) { await nextTick(); requestAnimationFrame(() => { sheetOpen.value = true }) }
  else { sheetOpen.value = false }
})

const bookLeaves = computed(() => props.book ? leavesForBook(props.book.id) : [])

const statuses = [
  { value: 'reading' as BookStatus, label: '읽는 중' },
  { value: 'done'    as BookStatus, label: '읽었어요' },
  { value: 'wishlist'as BookStatus, label: '읽고 싶어요' },
]

const statusLabel = computed(() => statuses.find(s => s.value === props.book?.status)?.label ?? '')

function onPageChange(e: Event) {
  if (!props.book) return
  const val = parseInt((e.target as HTMLInputElement).value)
  if (!isNaN(val)) updateProgress(props.book.id, val)
}

function onTotalChange(e: Event) {
  if (!props.book) return
  const val = parseInt((e.target as HTMLInputElement).value)
  if (!isNaN(val)) {
    updateBook(props.book.id, { totalPages: val })
    updateProgress(props.book.id, props.book.currentPage)
  }
}

function saveLeaf() {
  if (!props.book || !newSentence.value.trim()) return
  addLeaf(props.book.id, newSentence.value.trim())
  newSentence.value = ''
}

function onRemove() {
  if (!props.book) return
  removeBook(props.book.id)
  emit('close')
}
</script>

<style scoped>
.bs-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: flex-end;
  z-index: 500;
}
.bs-sheet {
  width: 100%; max-height: 92vh;
  background: #F5F0E8;
  border-radius: 24px 24px 0 0;
  padding: 12px 20px 40px;
  display: flex; flex-direction: column; gap: 18px;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform .35s cubic-bezier(.32,1,.55,1);
  box-shadow: 0 -4px 30px rgba(0,0,0,0.15);
}
.bs-sheet.open { transform: translateY(0); }
.bs-handle {
  width: 36px; height: 4px; background: #D4C9B8;
  border-radius: 2px; align-self: center; flex-shrink: 0;
}

/* Header */
.detail-header { display: flex; gap: 16px; align-items: flex-start; }
.detail-meta { flex: 1; min-width: 0; }
.detail-status-badge {
  display: inline-block; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px; margin-bottom: 6px; letter-spacing: 0.3px;
}
.detail-status-badge.reading { background: #2C5FA8; color: #fff; }
.detail-status-badge.done    { background: #B85C38; color: #fff; }
.detail-status-badge.wishlist{ background: #6B5240; color: #fff; }
.detail-title { font-size: 18px; font-weight: 700; color: #2C2018; margin: 0 0 3px; font-family: 'Noto Serif KR', serif; }
.detail-author { font-size: 13px; color: #6B5744; margin: 0 0 2px; }
.detail-pub { font-size: 12px; color: #9B8B7A; margin: 0 0 8px; }
.rating-row { margin-top: 6px; }

/* Section */
.section { display: flex; flex-direction: column; gap: 8px; }
.section-label { font-size: 12px; font-weight: 700; color: #8B7355; letter-spacing: 0.5px; text-transform: uppercase; }

/* Status pills */
.status-pills { display: flex; gap: 8px; }
.status-pill {
  flex: 1; padding: 8px 4px; border-radius: 10px;
  border: 1.5px solid #D4C9B8; background: #fff;
  font-size: 13px; font-weight: 600; color: #6B5744; cursor: pointer;
}
.status-pill.active { background: #B85C38; border-color: #B85C38; color: #fff; }

/* Progress */
.progress-input-row { display: flex; align-items: center; gap: 8px; }
.page-input {
  width: 70px; padding: 8px 10px; border-radius: 8px;
  border: 1.5px solid #D4C9B8; background: #fff;
  font-size: 14px; color: #2C2018; text-align: center; outline: none;
}
.page-input.total { color: #9B8B7A; }
.page-sep { color: #B8A88A; font-size: 14px; }
.progress-badge {
  margin-left: auto; font-size: 14px; font-weight: 700; color: #B85C38;
}
.progress-track {
  height: 6px; background: rgba(0,0,0,0.08); border-radius: 3px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: #B85C38; border-radius: 3px; transition: width .4s ease;
}

/* Memo */
.memo-input {
  width: 100%; padding: 10px 12px; border-radius: 10px;
  border: 1.5px solid #D4C9B8; background: #fff;
  font-size: 14px; color: #2C2018; resize: none; outline: none;
  font-family: 'Noto Serif KR', serif; line-height: 1.6;
}

/* Leaf */
.leaf-input-row { display: flex; gap: 8px; }
.leaf-input {
  flex: 1; padding: 10px 12px; border-radius: 10px;
  border: 1.5px solid #D4C9B8; background: #fff;
  font-size: 13px; color: #2C2018; resize: none; outline: none;
  font-family: 'Noto Serif KR', serif; line-height: 1.5;
}
.leaf-add-btn {
  padding: 0 16px; background: #B85C38; color: #fff;
  border: none; border-radius: 10px; font-size: 13px; font-weight: 700;
  cursor: pointer; white-space: nowrap; align-self: stretch;
}
.leaf-list { display: flex; flex-direction: column; gap: 8px; }
.leaf-item {
  display: flex; align-items: flex-start; gap: 8px;
  background: #EDE8DC; border-radius: 10px; padding: 10px 12px;
}
.leaf-text {
  flex: 1; font-size: 13px; color: #2C2018;
  font-family: 'Noto Serif KR', serif; line-height: 1.6; margin: 0;
}
.leaf-del {
  background: none; border: none; cursor: pointer;
  color: #B8A88A; font-size: 12px; padding: 2px;
}
.leaf-empty { font-size: 12px; color: #B8A88A; text-align: center; padding: 8px 0; }

/* Remove */
.remove-btn {
  width: 100%; padding: 12px; border-radius: 12px;
  background: none; border: 1.5px solid #D4C9B8;
  color: #9B8B7A; font-size: 14px; font-weight: 600; cursor: pointer;
}
</style>
