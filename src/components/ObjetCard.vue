<template>
  <div class="objet-card" :class="{ locked: !objet?.unlockedAt }">
    <div class="objet-emoji">{{ objet?.emoji ?? '🔒' }}</div>
    <div class="objet-info">
      <p class="objet-name">{{ objet?.unlockedAt ? objet.name : '?' }}</p>
      <p class="objet-cond" v-if="!objet?.unlockedAt">
        {{ objet?.unlockCondition }}권 완독 시 획득 (현재 {{ doneCount }}권)
      </p>
      <p class="objet-cond unlocked" v-else>획득 완료 🎉</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Objet } from '../types/book'
defineProps<{ objet: Objet | null; doneCount: number }>()
</script>

<style scoped>
.objet-card {
  display: flex; align-items: center; gap: 12px;
  background: #F8F3E8; border: 1px solid #D4C9B8;
  border-radius: 14px; padding: 12px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  min-width: 220px;
}
.objet-card.locked { opacity: 0.65; filter: grayscale(0.5); }
.objet-emoji { font-size: 36px; flex-shrink: 0; }
.objet-info { flex: 1; }
.objet-name { font-size: 14px; font-weight: 700; color: #2C2018; margin: 0 0 3px; }
.objet-cond { font-size: 11px; color: #9B8B7A; margin: 0; }
.objet-cond.unlocked { color: #B85C38; font-weight: 600; }
</style>
