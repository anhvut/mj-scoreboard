<script setup lang="ts">
import {PlayerNames, PlayerNumbers} from '../types'
import {computed, CSSProperties, ref, toRefs} from 'vue'
import {getStore} from '../store'

const props = defineProps<{
  points: PlayerNumbers
  names: PlayerNames
}>()

const {points, names} = toRefs(props)

const store = getStore()
const {maxWidth, maxHeight} = store.state

const emit = defineEmits<{
  (event: 'close'): void
}>()

const rotateZ = ref<number>(0)

function rotateRight() {
  if (rotateZ.value) rotateZ.value -= 90
  else rotateZ.value = 270
}

const fontSize = ref<number>(50)

function inputFontSize(event: any) {
  fontSize.value = event.target.value
}

function changeFontSize(event: any) {
  fontSize.value = event._value
}

const showSettings = ref<boolean>(false)
function settings() {
  showSettings.value = !showSettings.value
}

const dynamicStyle = computed<CSSProperties>(() => ({
  transform: `translateY(-50%) rotateZ(${rotateZ.value}deg)`,
  fontSize: `${fontSize.value}pt`
}))

function sliderChange(...args: any[]) {
  console.log('slider change', ...args)
}
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
      <mcw-button @click="emit('close')" icon="fullscreen_exit" />
      <mcw-button @click="settings" icon="settings" />
      <mcw-button v-if="showSettings" @click="rotateRight" icon="rotate_right" />
      <div v-if="showSettings" class="slider-container">
        <mcw-slider @change="sliderChange" v-model="fontSize" min="10" max="200" />
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
