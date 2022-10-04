<script setup lang="ts">
import ScoreBoard from './components/ScoreBoard.vue'
import {t} from './i18n'
import releaseId from './releaseId'
import {getStore, MUTATION_SET_MAX_WIDTH, MUTATION_SET_MAX_HEIGHT} from './store'
import {computed} from 'vue'

const store = getStore()
window.addEventListener('resize', () => {
  store.commit(MUTATION_SET_MAX_WIDTH, window.innerWidth)
  store.commit(MUTATION_SET_MAX_HEIGHT, window.innerHeight)
})

const layout = computed(() => store.getters.layout)

const RELEASE_ID_LS_KEY = 'mj-scoreboard.releaseId'
const currentReleaseId = localStorage.getItem(RELEASE_ID_LS_KEY)
if (releaseId !== currentReleaseId) {
  localStorage.setItem(RELEASE_ID_LS_KEY, releaseId)
  alert(t('app.update', {releaseId}))
}
</script>

<template>
  <div :class="layout">
    <ScoreBoard />
  </div>
</template>

<style lang="scss">
@import './theme.scss';
</style>
