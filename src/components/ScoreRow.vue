<script setup lang="ts">
import {t} from '../i18n'
import type {PlayerPoint, Round} from '../types'

const {roundPoints, roundDefinition, players, alternate} = defineProps<{
  roundPoints: PlayerPoint
  roundDefinition: Round
  players: Array<string>
  alternate?: boolean
}>()

const displayPoints = roundDefinition.points.toString(10) + (roundDefinition.giver === 4 ? 'T' : '')

const displayWinner: string = (() => {
  switch (roundDefinition.winner) {
    case 4:
      return t('r.draw')
    default:
      const secondPart = roundDefinition.giver === 4 ? '' : ' ' + t('r.on') + ' ' + players[roundDefinition.giver]
      return players[roundDefinition.winner] + secondPart
  }
})()

const draw = roundDefinition.winner === 4
const trClass = {
  'mdc-data-table__row': true,
  'mdc-data-table__row--selected': alternate
}
const trClass2 = {...trClass, 'no-top-border': !draw}
</script>

<template>
  <tr :class="trClass" v-if="!draw">
    <td class="mdc-data-table__cell">{{ displayPoints }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.diff[0] }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.diff[1] }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.diff[2] }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.diff[3] }}</td>
  </tr>
  <tr :class="trClass2">
    <td class="mdc-data-table__cell">{{ displayWinner }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.points[0] }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.points[1] }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.points[2] }}</td>
    <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{{ roundPoints.points[3] }}</td>
  </tr>
</template>

<style scoped>
.no-top-border {
  border-top: 0;
}
</style>
