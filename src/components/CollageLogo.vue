<template>
  <div class="logo-wrap">
    <div class="collage-logo">
      <!-- "book" group -->
      <span v-for="(letter, i) in bookLetters" :key="'b'+i"
        class="logo-letter"
        :style="letterStyle(letter)"
      >{{ letter.char }}</span>

      <div class="logo-gap" />

      <!-- "nook" group -->
      <span v-for="(letter, i) in nookLetters" :key="'n'+i"
        class="logo-letter"
        :style="letterStyle(letter)"
      >{{ letter.char }}</span>
    </div>

    <!-- Decorative torn newspaper strips under logo -->
    <div class="news-strip strip-1">
      <span class="news-text">...reading is the great b...</span>
    </div>
    <div class="news-strip strip-2">
      <span class="news-text">and fell in love with it.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const bookLetters = [
  { char: 'b', bg: '#D4C5A9', color: '#4A2C0E', rotate: -4, font: 'Georgia, "Times New Roman", serif', italic: false },
  { char: 'o', bg: '#F5D060', color: '#2C1A00', rotate: 2,  font: '"Helvetica Neue", Arial, sans-serif', italic: false },
  { char: 'o', bg: '#1C1C1C', color: '#F0E8D8', rotate: -2, font: 'Georgia, serif', italic: false },
  { char: 'k', bg: '#C8A068', color: '#2C1400', rotate: 3,  font: '"Arial Black", sans-serif', italic: false },
]

const nookLetters = [
  { char: 'n', bg: '#5C9E6E', color: '#F0FAF0', rotate: -3, font: 'Georgia, serif', italic: false },
  { char: 'o', bg: '#A8C8E0', color: '#0A2A44', rotate: 2,  font: '"Helvetica Neue", sans-serif', italic: false },
  { char: 'o', bg: '#C84060', color: '#FFF0F4', rotate: -1, font: '"Times New Roman", serif', italic: false },
  { char: 'k', bg: '#8B6E8E', color: '#F8F0FF', rotate: 3,  font: '"Arial Black", sans-serif', italic: false },
]

function letterStyle(l: { bg: string; color: string; rotate: number; font: string; italic: boolean }) {
  return {
    background: l.bg,
    color: l.color,
    transform: `rotate(${l.rotate}deg)`,
    fontFamily: l.font,
    fontStyle: l.italic ? 'italic' : 'normal',
  }
}
</script>

<style scoped>
.logo-wrap {
  position: relative;
  padding-bottom: 10px;
}

.collage-logo {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  flex-wrap: nowrap;
}

.logo-gap {
  width: 16px;
}

.logo-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 44px;
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
  border-radius: 2px;
  box-shadow:
    1px 1px 0 rgba(0,0,0,0.25),
    2px 3px 6px rgba(0,0,0,0.22),
    inset 0 1px 0 rgba(255,255,255,0.15);
  user-select: none;
  letter-spacing: -1px;
  position: relative;
}

/* Tape on some letters */
.logo-letter:nth-child(1)::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(-8deg);
  width: 32px; height: 12px;
  background: rgba(220,195,140,0.6);
  border-radius: 1px;
}

.logo-letter:nth-child(3)::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(6deg);
  width: 28px; height: 11px;
  background: rgba(180,210,200,0.55);
  border-radius: 1px;
}

/* 'n' of nook */
.logo-letter:nth-child(6)::before {
  content: '';
  position: absolute;
  top: -6px;
  right: -4px;
  transform: rotate(-4deg);
  width: 36px; height: 12px;
  background: rgba(220,195,140,0.55);
  border-radius: 1px;
}

/* Newspaper strip decorations */
.news-strip {
  position: absolute;
  background: #F0E8D0;
  border: 1px solid rgba(160,140,100,0.3);
  padding: 2px 8px;
  font-size: 10px;
  color: #5A4A30;
  font-family: Georgia, serif;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
}

/* Torn edges on strips */
.news-strip::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: #F0E8D0;
  clip-path: polygon(
    0% 100%, 2% 0%, 5% 80%, 8% 10%, 11% 90%, 14% 5%,
    17% 70%, 20% 0%, 23% 85%, 26% 15%, 29% 75%,
    32% 0%, 35% 80%, 38% 10%, 41% 90%, 44% 5%,
    47% 70%, 50% 0%, 53% 85%, 56% 15%, 59% 75%,
    62% 0%, 65% 80%, 68% 10%, 71% 90%, 74% 5%,
    77% 70%, 80% 0%, 83% 85%, 86% 15%, 89% 75%,
    92% 0%, 95% 80%, 98% 10%, 100% 90%, 100% 100%
  );
}

.strip-1 {
  bottom: 0px;
  left: -8px;
  transform: rotate(-2deg);
  z-index: 2;
}

.strip-2 {
  bottom: -4px;
  left: 60px;
  transform: rotate(1.5deg);
  z-index: 1;
  background: #EDE0C8;
}
</style>
