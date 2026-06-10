<template>
  <div class="app-shell">
    <div class="paper-texture" />
    <component :is="currentView" />
    <BottomNav :current="activeTab" @change="activeTab = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BottomNav from './components/BottomNav.vue'
import HomeView from './views/HomeView.vue'
import LibraryView from './views/LibraryView.vue'
import SentenceView from './views/SentenceView.vue'
import WishlistView from './views/WishlistView.vue'

const activeTab = ref('home')

const currentView = computed(() => {
  if (activeTab.value === 'library')  return LibraryView
  if (activeTab.value === 'sentence') return SentenceView
  if (activeTab.value === 'wishlist') return WishlistView
  return HomeView
})
</script>

<style>
/* Google Fonts - Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: 'Noto Serif KR', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100%;
  display: flex;
  justify-content: center;
  background: #D8CDB4;
}
</style>

<style scoped>
.app-shell {
  width: 100%;
  max-width: 430px;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  /* Warm aged paper base */
  background: #EDE5D0;
  /* Subtle grain overlay via repeating pattern */
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
  position: relative;
  overflow: hidden;
}

/* Layered paper texture */
.paper-texture {
  position: absolute;
  inset: 0;
  /* Crosshatch faint lines for aged paper feel */
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      rgba(140,115,75,0.045) 39px,
      rgba(140,115,75,0.045) 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 79px,
      rgba(140,115,75,0.025) 79px,
      rgba(140,115,75,0.025) 80px
    );
  pointer-events: none;
  z-index: 0;
}

/* Vignette edges for depth */
.paper-texture::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 55%,
    rgba(100,75,40,0.12) 100%
  );
}

/* Views sit on top of texture */
:deep(.home-view),
:deep(.library-view),
:deep(.sentence-view),
:deep(.wishlist-view) {
  position: relative;
  z-index: 1;
}
</style>
