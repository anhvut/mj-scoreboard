<script setup lang="ts">
import ScoreBoard from './components/ScoreBoard.vue'
import {getStore} from './store'
import {computed} from 'vue'

const store = getStore()
window.addEventListener(
  'resize',
  () => store.commit('setMaxWidth', window.innerWidth)
)

const layout = computed(() => store.getters.layout)
</script>

<template>
<!--  <img alt="Vue logo" src="./assets/banner.jpg" style='margin-bottom: 8px'/>-->
  <div :class='layout'>
    <ScoreBoard />
  </div>
</template>

<style lang='scss'>
@import './theme.scss';
</style>