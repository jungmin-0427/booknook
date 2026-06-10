<template>
  <div class="leaf-rating">
    <button
      v-for="n in 5" :key="n"
      class="leaf-btn"
      :class="{ filled: (modelValue ?? 0) >= n, disabled: !editable }"
      @click="editable && $emit('update:modelValue', n)"
    >🍁</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: number | null; editable?: boolean }>()
defineEmits<{ (e: 'update:modelValue', v: number): void }>()
</script>

<style scoped>
.leaf-rating { display: flex; gap: 4px; align-items: center; }
.leaf-btn {
  background: none; border: none; padding: 0;
  font-size: 20px; cursor: pointer;
  filter: grayscale(1) opacity(0.3);
  transition: filter 0.15s, transform 0.1s;
  line-height: 1;
}
.leaf-btn.filled { filter: none; }
.leaf-btn.disabled { cursor: default; }
.leaf-btn:not(.disabled):hover { transform: scale(1.15); }
</style>
