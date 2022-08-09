<script setup lang="ts">
import {t} from '../i18n'
import type {PlayerNames, PlayerPoint, Round} from '../types'
import {computed, toRefs} from 'vue'

const props = defineProps<{
  points: PlayerPoint
  round: Round
  players: PlayerNames
  index: number
  selected: boolean
}>()

const {round, players, index, selected} = toRefs(props)

const emit = defineEmits<{
  (event: 'onclick', index: number): void
}>()

const draw = round.value.winner === 4
const twoLines = computed(() => !draw && index.value !== 0)
const leftLabel = computed<string[]>(() => {
  const self = round.value.giver === 4
  switch (round.value.winner) {
    case 5:
    case 6:
      return [t('r.penalty') + ' ' + round.value.points, players.value[round.value.giver]]
    case 4:
      return [t('r.draw')]
    default:
      return [round.value.points.toString(10) + ' ' + players.value[round.value.winner], self ? '' : t('r.on') + ' ' + players.value[round.value.giver]]
  }
})

const trClass = computed(() => ({
  'mdc-data-table__row': true,
  'mdc-data-table__row--selected': selected.value
}))

const tdClass = computed(() => ({
  'mdc-data-table__cell': true,
  penalty: round.value.points < 0
}))

const tdNumClass = computed(() => ({
  'mdc-data-table__cell': true,
  'mdc-data-table__cell--numeric': true,
  penalty: round.value.points < 0
}))
</script>

<template>
  <tr :class="trClass">
    <td :class="tdClass" v-on:dblclick.stop.prevent="emit('onclick', index)" :style="{cursor: 'pointer'}">
      <template v-for="(label, i) in leftLabel" :key="i">
        <br v-if="i > 0" />
        {{ label }}
      </template>
    </td>
    <td :class="tdNumClass" :style="points.diff[0] * round.points > 0 ? {fontWeight: 'bold'} : {}">
      {{ twoLines ? points.diff[0] : '' }}
      <br v-if="twoLines" />
      {{ points.points[0] }}
    </td>
    <td :class="tdNumClass" :style="points.diff[1] * round.points > 0 ? {fontWeight: 'bold'} : {}">
      {{ twoLines ? points.diff[1] : '' }}
      <br v-if="twoLines" />
      {{ points.points[1] }}
    </td>
    <td :class="tdNumClass" :style="points.diff[2] * round.points > 0 ? {fontWeight: 'bold'} : {}">
      {{ twoLines ? points.diff[2] : '' }}
      <br v-if="twoLines" />
      {{ points.points[2] }}
    </td>
    <td :class="tdNumClass" :style="points.diff[3] * round.points > 0 ? {fontWeight: 'bold'} : {}">
      {{ twoLines ? points.diff[3] : '' }}
      <br v-if="twoLines" />
      {{ points.points[3] }}
    </td>
  </tr>
</template>

<style>
.penalty {
  color: red !important;
}
</style>
