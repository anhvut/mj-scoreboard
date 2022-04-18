<script setup lang="ts">
import i18n, {t} from '../i18n'
import {computed, reactive, ref} from 'vue'
import type {PlayerNumbers, PlayerPoint, Round} from '../types'
import ScoreRow from './ScoreRow.vue'
import {getStore, LayoutNum} from '../store'

const pointInput = ref<string>('')
const player1 = ref<string>('')
const player2 = ref<string>('')
const player3 = ref<string>('')
const player4 = ref<string>('')
const players = computed<string[]>(() => [player1.value, player2.value, player3.value, player4.value])
const playersDefined = computed<boolean>(() => players.value.every((player) => player !== ''))

const winner = ref<string>('')
const giver = ref<string>('')

const selectedIndex = ref<number>(-1)
const pointInputRef = ref<HTMLInputElement | null>(null)
const setPointInputRef = (ref: HTMLInputElement | null) => (pointInputRef.value = ref)

const eastInputRef = ref<HTMLInputElement | null>(null)
const setEastInputRef = (ref: HTMLInputElement | null) => (eastInputRef.value = ref)

const rounds = reactive<Round[]>([])
const canInputPoints = computed<boolean>(() => playersDefined.value && (rounds.length < 16 || selectedIndex.value >= 0))
const points = computed<PlayerPoint[]>(() => {
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
    winner.value === '4' ||
    (parseInt(pointInput.value) >= 8 && winner.value !== '' && giver.value !== '' && winner.value !== giver.value && rounds.length <= 16)
  )
})

function addRound() {
  const winnerValue = parseInt(winner.value)
  const draw = winnerValue === 4
  const round: Round = {
    points: draw ? 0 : parseInt(pointInput.value),
    winner: winnerValue,
    giver: draw ? -1 : parseInt(giver.value)
  }
  if (selectedIndex.value >= 0) {
    rounds.splice(selectedIndex.value, 1, round)
    selectedIndex.value = -1
  } else {
    rounds.push(round)
  }
  pointInput.value = ''
  winner.value = ''
  giver.value = ''
  pointInputRef.value?.focus()
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

const cellClick = (index: number) => {
  selectedIndex.value = index
  pointInput.value = rounds[index].points.toString()
  winner.value = rounds[index].winner.toString()
  giver.value = rounds[index].giver.toString()
  pointInputRef.value?.focus()
}
const resource = (filename: string) => `img/${filename}`

function newGame() {
  if (confirm(t('app.newGameConfirm'))) {
    player1.value = ''
    player2.value = ''
    player3.value = ''
    player4.value = ''
    rounds.length = 0
    pointInput.value = ''
    winner.value = ''
    giver.value = ''
    eastInputRef.value?.focus()
  }
}

function help() {
  window.open(`./help/${i18n.global.locale.value}/index.html`, '_blank')
}
</script>

<template>
  <div class="mdc-typography--headline4">{{ t('app.title') }}</div>
  <mcw-layout-grid class="inputNameContainer">
    <mcw-layout-cell :class="nameCellClass">
      <mcw-textfield v-model="player1" :label="t('p.Name') + ' ' + t('dir.east')" type="text" autofocus class="inputName" :ref="setEastInputRef" />
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
          <th class="mdc-data-table__header-cell" role="columnheader" scope="col">
            <span>{{ t('r.Round') }}</span>
          </th>
          <template v-for="player in players">
            <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">
              <span>{{ player }}</span>
            </th>
          </template>
        </tr>
      </thead>
      <tbody class="mdc-data-table__content">
        <tr class="mdc-data-table__row">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" :src="resource('east.png')" />
          </td>
        </tr>
        <template v-for="(p, i) in points.slice(0, 4)" :key="i">
          <ScoreRow :points="p" :round="rounds[i]" :players="players" :index="i" @onclick="cellClick" :selected="i === selectedIndex" />
        </template>
        <tr class="mdc-data-table__row" v-if="points.length >= 4">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" :src="resource('south.png')" />
          </td>
        </tr>
        <template v-for="(p, i) in points.slice(4, 8)" :key="i + 4">
          <ScoreRow :points="p" :round="rounds[i + 4]" :players="players" :index="i + 4" @onclick="cellClick" :selected="i + 4 === selectedIndex" />
        </template>
        <tr class="mdc-data-table__row" v-if="points.length >= 8">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" :src="resource('west.png')" />
          </td>
        </tr>
        <template v-for="(p, i) in points.slice(8, 12)" :key="i + 8">
          <ScoreRow :points="p" :round="rounds[i + 8]" :players="players" :index="i + 8" @onclick="cellClick" :selected="i + 8 === selectedIndex" />
        </template>
        <tr class="mdc-data-table__row" v-if="points.length >= 12">
          <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
            <img alt="east" :src="resource('north.png')" />
          </td>
        </tr>
        <template v-for="(p, i) in points.slice(12, 16)" :key="i + 12">
          <ScoreRow :points="p" :round="rounds[i + 12]" :players="players" :index="i + 12" @onclick="cellClick" :selected="i + 12 === selectedIndex" />
        </template>
      </tbody>
    </table>
  </mcw-data-table>

  <div v-if="canInputPoints" class="inputWinnerContainer">
    <mcw-textfield v-model="pointInput" :label="t('r.Points')" type="number" class="inputPoint" :ref="setPointInputRef" />
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
    <mcw-fab mini v-if="canAddRound" @click="addRound" :icon="selectedIndex >= 0 ? 'save' : 'add'" />
  </div>
  <div style="display: flex; width: 100%; padding-top: 8px">
    <mcw-button v-if="playersDefined" @click="newGame">{{ t('app.newGame') }}</mcw-button>
    <div style="display: flex; flex: 1 1 auto" />
    <mcw-button @click="help">{{ t('app.help') }}</mcw-button>
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

.pointTableContainer .mdc-data-table__table-container {
  overflow: visible;
}

.pointTableContainer table {
  position: relative;
}

.pointTableContainer th {
  position: sticky;
  top: 0;
  background: white;
}

.mobile .pointTableContainer {
  margin-left: var(--mdc-layout-grid-margin-phone);
  width: 100%;
}

.tablet .pointTableContainer {
  margin-left: var(--mdc-layout-grid-margin-tablet);
}

.desktop .pointTableContainer {
  margin-left: var(--mdc-layout-grid-margin-desktop);
}
</style>
