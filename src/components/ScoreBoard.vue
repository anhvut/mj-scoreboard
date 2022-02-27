<script setup lang="ts">
import {t} from '../i18n'
import {computed, reactive, ref} from 'vue'
import type {PlayerNumbers, PlayerPoint, Round} from '../types'
import ScoreRow from './ScoreRow.vue'
import {getStore, LayoutNum} from '../store'

const points = ref<string>('')
const player1 = ref<string>('')
const player2 = ref<string>('')
const player3 = ref<string>('')
const player4 = ref<string>('')
const players = computed<string[]>(() => [player1.value, player2.value, player3.value, player4.value])
const playersDefined = computed<boolean>(() => players.value.every((player) => player !== ''))

const winner = ref<string>('')
const giver = ref<string>('')

const rounds = reactive<Round[]>([])
const playerPoints = computed<PlayerPoint[]>(() => {
  const result: PlayerPoint[] = []
  const currentPoints: PlayerNumbers = [0, 0, 0, 0]
  for (const round of rounds) {
    const currentDiff: PlayerNumbers = [0, 0, 0, 0]
    if (round.winner !== 4) {
      if (round.giver !== 4) {
        currentDiff[round.winner] = round.points + 32
        currentDiff[round.giver] = -round.points
        for (let i = 0; i < 4; i++) currentDiff[i] -= 8
      } else {
        currentDiff[round.winner] = 4 * (round.points + 8)
        for (let i = 0; i < 4; i++) currentDiff[i] -= round.points + 8
      }
    }
    for (let i = 0; i < 4; i++) currentPoints[i] += currentDiff[i]
    result.push({
      diff: currentDiff,
      points: currentPoints.slice() as PlayerNumbers
    })
  }
  return result
})

const canAddRound = computed<boolean>(() => {
  return (
    winner.value === '4' || (parseInt(points.value) >= 8 && winner.value !== '' && giver.value !== '' && winner.value !== giver.value && rounds.length <= 16)
  )
})

function addRound() {
  rounds.push({
    points: parseInt(points.value),
    winner: parseInt(winner.value),
    giver: parseInt(giver.value)
  })
  points.value = ''
  winner.value = ''
  giver.value = ''
}

const store = getStore()
const nameCellClass = computed(() => `mdc-layout-grid__cell--span-${store.getters.layoutNum + 1}`)
const selectPlayerStyle = computed(() =>
  store.getters.layoutNum === LayoutNum.Mobile
    ? {
        // 12 is global side margin, 58 pointInput width, 40 is button width, 8 is margin between 4 components
        width: `${(store.state.maxWidth - 12 - 12 - 58 - 40 - 8 - 8 - 8) / 2}px`
      }
    : {}
)
</script>

<template>
  <div class="mdc-typography--headline4">{{ t('app.title') }}</div>
  <mcw-layout-grid class="inputNameContainer">
    <mcw-layout-cell :class="nameCellClass">
      <mcw-textfield v-model="player1" :label="t('p.Name') + ' ' + t('dir.east')" type="text" autofocus class="inputName" />
    </mcw-layout-cell>
    <mcw-layout-cell :class="nameCellClass">
      <mcw-textfield v-model="player2" :label="t('p.Name') + ' ' + t('dir.south')" type="text" class="inputName" />
    </mcw-layout-cell>
    <mcw-layout-cell :class="nameCellClass">
      <mcw-textfield v-model="player3" :label="t('p.Name') + ' ' + t('dir.west')" type="text" class="inputName" />
    </mcw-layout-cell>
    <mcw-layout-cell :class="nameCellClass">
      <mcw-textfield v-model="player4" :label="t('p.Name') + ' ' + t('dir.north')" type="text" class="inputName" />
    </mcw-layout-cell>
  </mcw-layout-grid>

  <mcw-data-table v-if="playersDefined" class="pointTableContainer">
    <table class="mdc-data-table__table">
      <thead>
        <tr class="mdc-data-table__header-row">
          <th class="mdc-data-table__header-cell" role="columnheader" scope="col">{{ t('r.Round') }}</th>
          <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">
            {{ player1 }}
          </th>
          <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">
            {{ player2 }}
          </th>
          <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">
            {{ player3 }}
          </th>
          <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">
            {{ player4 }}
          </th>
        </tr>
      </thead>
      <tbody class="mdc-data-table__content">
        <tr class="mdc-data-table__row">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" src="../assets/east.png" />
          </td>
        </tr>
        <template v-for="(roundPoints, index) in playerPoints.slice(0, 4)" :key="index">
          <ScoreRow :roundPoints="roundPoints" :round-definition="rounds[index]" :players="players" :roundIndex="index" />
        </template>
        <tr class="mdc-data-table__row" v-if="playerPoints.length >= 4">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" src="../assets/south.png" />
          </td>
        </tr>
        <template v-for="(roundPoints, index) in playerPoints.slice(4, 8)" :key="index">
          <ScoreRow :roundPoints="roundPoints" :round-definition="rounds[index]" :players="players" :roundIndex="index + 4" />
        </template>
        <tr class="mdc-data-table__row" v-if="playerPoints.length >= 8">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" src="../assets/west.png" />
          </td>
        </tr>
        <template v-for="(roundPoints, index) in playerPoints.slice(8, 12)" :key="index">
          <ScoreRow :roundPoints="roundPoints" :round-definition="rounds[index]" :players="players" :roundIndex="index + 8" />
        </template>
        <tr class="mdc-data-table__row" v-if="playerPoints.length >= 12">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" src="../assets/north.png" />
          </td>
        </tr>
        <template v-for="(roundPoints, index) in playerPoints.slice(12, 16)" :key="index">
          <ScoreRow :roundPoints="roundPoints" :round-definition="rounds[index]" :players="players" :roundIndex="index + 12" />
        </template>
      </tbody>
    </table>
  </mcw-data-table>

  <div v-if="playersDefined" class="inputWinnerContainer">
    <mcw-textfield v-model="points" :label="t('r.Points')" type="number" class="inputPoint" />
    <mcw-select v-model="winner" :label="t('r.Winner')" class="selectPlayer" :style="selectPlayerStyle">
      <mcw-list-item data-value="" tabindex="0" style="display: none; height: 0 !important"></mcw-list-item>
      <mcw-list-item data-value="0">{{ player1 }}</mcw-list-item>
      <mcw-list-item data-value="1">{{ player2 }}</mcw-list-item>
      <mcw-list-item data-value="2">{{ player3 }}</mcw-list-item>
      <mcw-list-item data-value="3">{{ player4 }}</mcw-list-item>
      <mcw-list-item data-value="4">{{ t('r.draw') }}</mcw-list-item>
    </mcw-select>
    <mcw-select v-model="giver" :label="t('r.Giver')" class="selectPlayer" :style="selectPlayerStyle">
      <mcw-list-item data-value="" tabindex="0" style="display: none; height: 0 !important"></mcw-list-item>
      <mcw-list-item data-value="0">{{ player1 }}</mcw-list-item>
      <mcw-list-item data-value="1">{{ player2 }}</mcw-list-item>
      <mcw-list-item data-value="2">{{ player3 }}</mcw-list-item>
      <mcw-list-item data-value="3">{{ player4 }}</mcw-list-item>
      <mcw-list-item data-value="4">{{ t('r.self') }}</mcw-list-item>
    </mcw-select>
    <mcw-fab mini v-if="canAddRound" @click="addRound" icon="add" />
  </div>
</template>

<style lang="scss">
.inputName {
}

.inputNameContainer {
  margin-bottom: 16px;
}

.inputWinnerContainer {
  margin-bottom: 16px;
  display: block;
}

.mobile .inputWinnerContainer {
  margin-left: var(--mdc-layout-grid-margin-phone);
}

.tablet .inputWinnerContainer {
  margin-left: var(--mdc-layout-grid-margin-tablet);
}

.desktop .inputWinnerContainer {
  margin-left: var(--mdc-layout-grid-margin-desktop);
}

.inputWinnerContainer > * {
  display: inline-block;
}

.mobile .inputWinnerContainer > *:not(:last-child) {
  margin-right: var(--mdc-layout-grid-gutter-phone);
}
.tablet .inputWinnerContainer > *:not(:last-child) {
  margin-right: var(--mdc-layout-grid-gutter-tablet);
}
.desktop .inputWinnerContainer > *:not(:last-child) {
  margin-right: var(--mdc-layout-grid-gutter-desktop);
}

.inputWinnerContainer .mdc-select > .mdc-select__anchor > .mdc-select__dropdown-icon {
  width: 0;
}
.inputWinnerContainer .mdc-select--filled .mdc-floating-label--float-above {
  max-width: unset;
}

.inputPoint {
  width: 58px;
}

/* deactivate spinner Chrome, Safari, Edge, Opera */
.inputPoint input::-webkit-outer-spin-button,
.inputPoint input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* deactivate spinner Firefox */
.inputPoint input[type='number'] {
  -moz-appearance: textfield;
}

.inputWinnerContainer .mdc-menu > .mdc-list > .mdc-list-item[data-value=''] {
  display: none;
}

.pointTableContainer {
  margin-bottom: 16px;
}

.mobile .pointTableContainer {
  margin-left: var(--mdc-layout-grid-margin-phone);
}

.tablet .pointTableContainer {
  margin-left: var(--mdc-layout-grid-margin-tablet);
}

.desktop .pointTableContainer {
  margin-left: var(--mdc-layout-grid-margin-desktop);
}
</style>
