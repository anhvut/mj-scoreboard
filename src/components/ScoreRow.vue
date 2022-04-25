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
</script>

<template>
  <tr :class="trClass">
    <td class="mdc-data-table__cell" v-on:click.stop.prevent="emit('onclick', index)" :style="{cursor: 'pointer'}">
      <template v-for="(label, i) in leftLabel" :key="i">
        <br v-if="i > 0" />
        {{ label }}
      </template>
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? points.diff[0] : '' }}
      <br v-if="twoLines" />
      {{ points.points[0] }}
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? points.diff[1] : '' }}
      <br v-if="twoLines" />
      {{ points.points[1] }}
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? points.diff[2] : '' }}
      <br v-if="twoLines" />
      {{ points.points[2] }}
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? points.diff[3] : '' }}
      <br v-if="twoLines" />
      {{ points.points[3] }}
    </td>
  </tr>
</template>

<style scoped></style>
