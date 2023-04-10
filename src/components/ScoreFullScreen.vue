<script setup lang="ts">
import {PlayerNames, PlayerNumbers} from '@/types'
import {computed, CSSProperties, ref, toRefs} from 'vue'

const props = defineProps<{
  points: PlayerNumbers
  names: PlayerNames
}>()

const {points, names} = toRefs(props)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const ROTATE_Z_LS_KEY = 'mj-scoreboard.fullscreen.rotateZ'
const initialRotateZ = computed<number>(() => +(localStorage.getItem(ROTATE_Z_LS_KEY) || '0'))
const rotateZ = ref<number>(initialRotateZ.value)

function rotateRight() {
  if (rotateZ.value) rotateZ.value -= 90
  else rotateZ.value = 270
  localStorage.setItem(ROTATE_Z_LS_KEY, rotateZ.value.toString(10))
}

const FONT_SIZE_LS_KEY = 'mj-scoreboard.fullscreen.fontSize'
const initialFontSize = computed<number>(() => +(localStorage.getItem(FONT_SIZE_LS_KEY) || '50'))
const fontSize = ref<number>(initialFontSize.value)

function focusOut() {
  localStorage.setItem(FONT_SIZE_LS_KEY, fontSize.value.toString(10))
}

const showSettings = ref<boolean>(false)
function settings() {
  showSettings.value = !showSettings.value
}

const dynamicStyle = computed<CSSProperties>(() => ({
  transform: `translateY(-50%) rotateZ(${rotateZ.value}deg)`,
  fontSize: `${fontSize.value}pt`
}))
</script>

<template>
  <div class="full-screen">
    <div class="top-left border">
      <div class="centered" :style="dynamicStyle">{{ names[0] }}<br />{{ points[0] }}</div>
    </div>
    <div class="bottom-left border">
      <div class="centered" :style="dynamicStyle">{{ names[1] }}<br />{{ points[1] }}</div>
    </div>
    <div class="top-right border">
      <div class="centered" :style="dynamicStyle">{{ names[2] }}<br />{{ points[2] }}</div>
    </div>
    <div class="bottom-right border">
      <div class="centered" :style="dynamicStyle">{{ names[3] }}<br />{{ points[3] }}</div>
    </div>
    <div class="controls">
      <v-btn @click="emit('close')" icon="mdi-fullscreen-exit" />
      <v-btn @click="settings" icon="mdi-cog" />
      <v-btn v-if="showSettings" @click="rotateRight" icon="mdi-rotate-right" />
      <div v-if="showSettings" class="slider-container">
        <v-slider @focusout="focusOut" v-model="fontSize" min="10" max="200" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.full-screen {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
}

.top-left {
  position: absolute;
  top: 0;
  right: 50%;
  bottom: 50%;
  left: 0;
}

.top-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 50%;
  left: 50%;
}

.bottom-left {
  position: absolute;
  top: 50%;
  right: 50%;
  bottom: 0;
  left: 0;
}

.bottom-right {
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 50%;
}

.border {
  border: 1pt solid black;
}

.centered {
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
}

.controls {
  display: flex;
}

.slider-container {
  width: 100%;
}
</style>
