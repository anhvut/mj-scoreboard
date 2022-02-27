<script setup lang="ts">
import {t} from '../i18n'
import type {PlayerPoint, Round} from '../types'

const {roundPoints, roundDefinition, players, roundIndex} = defineProps<{
  roundPoints: PlayerPoint
  roundDefinition: Round
  players: Array<string>
  roundIndex: number
}>()

const draw = roundDefinition.winner === 4
const twoLines = !draw && roundIndex !== 0
const self = roundDefinition.giver === 4
const leftLabel: string[] = (() => {
  switch (roundDefinition.winner) {
    case 4:
      return [t('r.draw')]
    default:
      return [roundDefinition.points.toString(10) + ' ' + players[roundDefinition.winner], self ? '' : t('r.on') + ' ' + players[roundDefinition.giver]]
  }
})()

const trClass = {
  'mdc-data-table__row': true,
  'mdc-data-table__row--selected': roundIndex % 2 === 1
}
</script>

<template>
  <tr :class="trClass">
    <td class="mdc-data-table__cell">
      <template v-for="(label, index) in leftLabel" :key="index">
        <br v-if="index > 0" />
        {{ label }}
      </template>
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? roundPoints.diff[0] : '' }}
      <br v-if="twoLines" />
      {{ roundPoints.points[0] }}
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? roundPoints.diff[1] : '' }}
      <br v-if="twoLines" />
      {{ roundPoints.points[1] }}
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? roundPoints.diff[2] : '' }}
      <br v-if="twoLines" />
      {{ roundPoints.points[2] }}
    </td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
      {{ twoLines ? roundPoints.diff[3] : '' }}
      <br v-if="twoLines" />
      {{ roundPoints.points[3] }}
    </td>
  </tr>
</template>

<style scoped></style>
