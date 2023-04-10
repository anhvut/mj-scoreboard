<script setup lang="ts">
import ScoreBoard from '@/components/ScoreBoard.vue'
import {t} from '@/plugins/i18n'
import releaseId from '@/releaseId'
import {getStore, MUTATION_SET_MAX_HEIGHT, MUTATION_SET_MAX_WIDTH} from '@/plugins/store'
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
  <v-app>
    <v-main :class="layout">
      <ScoreBoard />
    </v-main>
  </v-app>
</template>

<style lang="scss">
main {
  --v-layout-left: 16px !important;
  --v-layout-right: 16px !important;
  --mjs-layout-margin: 16px;
  --mjs-layout-gutter: 16px;
  @media all and (max-width: 840px) {
    --v-layout-left: 16px !important;
    --v-layout-right: 16px !important;
    --mjs-layout-margin: 16px;
    --mjs-layout-gutter: 16px;
  }
  @media all and (max-width: 600px) {
    --v-layout-left: 8px !important;
    --v-layout-right: 8px !important;
    --mjs-layout-margin: 8px;
    --mjs-layout-gutter: 8px;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
