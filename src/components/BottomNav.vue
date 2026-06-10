<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs" :key="tab.id"
      class="nav-item" :class="{ active: current === tab.id }"
      @click="$emit('change', tab.id)"
    >
      <component :is="tab.icon" v-if="tab.icon" :size="22" class="nav-icon" />
      <span v-else class="nav-leaf-icon">🍁</span>
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { Home, BookMarked, Bookmark } from '@lucide/vue'

defineProps<{ current: string }>()
defineEmits<{ (e: 'change', tab: string): void }>()

const tabs = [
  { id: 'home',      label: '홈',       icon: Home },
  { id: 'library',   label: '내 서재',   icon: BookMarked },
  { id: 'sentence',  label: '문장수집',  icon: null },
  { id: 'wishlist',  label: '찜한 책',   icon: Bookmark },
]
</script>

<style scoped>
.bottom-nav {
  display: flex;
  background: #F5F0E8;
  border-top: 1px solid #D4C9B8;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  flex-shrink: 0;
}
.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 3px; padding: 10px 0 12px;
  background: none; border: none; cursor: pointer;
  color: #B8A88A; transition: color 0.15s;
}
.nav-item.active { color: #2C2018; }
.nav-item:active { opacity: 0.7; }
.nav-label { font-size: 10px; font-weight: 500; }
.nav-item.active .nav-label { font-weight: 700; }
.nav-leaf-icon { font-size: 20px; line-height: 1; filter: grayscale(1) opacity(0.4); }
.nav-item.active .nav-leaf-icon { filter: none; }
</style>
