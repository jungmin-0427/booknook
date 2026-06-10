<template>
  <div class="book-cover" :style="coverStyle">
    <span v-if="emoji" class="cover-emoji">{{ emoji }}</span>
    <div v-else class="cover-lines">
      <div class="cover-line" />
      <div class="cover-line short" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  colors: string[]
  emoji?: string
  width?: string
  height?: string
}>()

const coverStyle = computed(() => ({
  width: props.width || '80px',
  height: props.height || '110px',
  background: `linear-gradient(160deg, ${props.colors[0]} 0%, ${props.colors[1] || props.colors[0]} 60%, ${props.colors[2] || props.colors[1] || props.colors[0]} 100%)`,
}))
</script>

<style scoped>
.book-cover {
  border-radius: 4px 8px 8px 4px;
  box-shadow: -3px 3px 8px rgba(0,0,0,0.25), inset -2px 0 4px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
.book-cover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: rgba(0,0,0,0.2);
}
.cover-emoji {
  font-size: 28px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}
.cover-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 12px;
  width: 100%;
  padding: 16px 12px;
}
.cover-line {
  height: 3px;
  background: rgba(255,255,255,0.5);
  border-radius: 2px;
}
.cover-line.short { width: 60%; }
</style>
