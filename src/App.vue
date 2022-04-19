<script setup lang="ts">
import ScoreBoard from './components/ScoreBoard.vue'
import {getStore, MUTATION_SET_MAX_WIDTH, MUTATION_SET_MAX_HEIGHT} from './store'
import {computed} from 'vue'

const store = getStore()
window.addEventListener('resize', () => {
  store.commit(MUTATION_SET_MAX_WIDTH, window.innerWidth)
  store.commit(MUTATION_SET_MAX_HEIGHT, window.innerHeight)
})

const layout = computed(() => store.getters.layout)
</script>

<template>
  <div :class="layout">
    <ScoreBoard />
  </div>
</template>

<style lang="scss">
@import './theme.scss';
</style>
