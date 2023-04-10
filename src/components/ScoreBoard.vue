<script setup lang="ts">
import i18n, {t} from '../plugins/i18n'
import {computed, reactive, ref} from 'vue'
import type {PlayerNames, PlayerNumbers, PlayerPoint, Round} from '@/types'
import ScoreFullScreen from './ScoreFullScreen.vue'
import ScoreRow from '@/components/ScoreRow.vue'

const PLAYER1_LS_KEY = 'mj-scoreboard.name.1'
const PLAYER2_LS_KEY = 'mj-scoreboard.name.2'
const PLAYER3_LS_KEY = 'mj-scoreboard.name.3'
const PLAYER4_LS_KEY = 'mj-scoreboard.name.4'
const initialPlayer1 = computed<string>(() => localStorage.getItem(PLAYER1_LS_KEY) ?? '')
const initialPlayer2 = computed<string>(() => localStorage.getItem(PLAYER2_LS_KEY) ?? '')
const initialPlayer3 = computed<string>(() => localStorage.getItem(PLAYER3_LS_KEY) ?? '')
const initialPlayer4 = computed<string>(() => localStorage.getItem(PLAYER4_LS_KEY) ?? '')

const pointInput = ref<string>('')
const player1 = ref<string>(initialPlayer1.value)
const player2 = ref<string>(initialPlayer2.value)
const player3 = ref<string>(initialPlayer3.value)
const player4 = ref<string>(initialPlayer4.value)
const players = computed<PlayerNames>(() => [player1.value, player2.value, player3.value, player4.value])
const playersDefined = computed<boolean>(() => players.value.every((player) => player !== ''))

const savePlayer1 = () => localStorage.setItem(PLAYER1_LS_KEY, player1.value)
const savePlayer2 = () => localStorage.setItem(PLAYER2_LS_KEY, player2.value)
const savePlayer3 = () => localStorage.setItem(PLAYER3_LS_KEY, player3.value)
const savePlayer4 = () => localStorage.setItem(PLAYER4_LS_KEY, player4.value)

const winner = ref<string>('')
const giver = ref<string>('')

const selectedIndex = ref<number>(-1)
const pointInputRef = ref<HTMLInputElement | null>(null)
const setPointInputRef = (ref: HTMLInputElement | null) => (pointInputRef.value = ref)

const eastInputRef = ref<HTMLInputElement | null>(null)
const setEastInputRef = (ref: HTMLInputElement | null) => (eastInputRef.value = ref)

const ROUNDS_LS_KEY = 'mj-scoreboard.rounds'
const initialRounds = computed<Round[]>(() => {
  try {
    return JSON.parse(localStorage.getItem(ROUNDS_LS_KEY) as string) ?? []
  } catch {
    return []
  }
})
const rounds = reactive<Round[]>(initialRounds.value)
const canInputPoints = computed<boolean>(() => playersDefined.value && (rounds.length < 16 || selectedIndex.value >= 0))
const points = computed<PlayerPoint[]>(() => {
  const result: PlayerPoint[] = []
  const currentPoints: PlayerNumbers = [0, 0, 0, 0]
  for (const round of rounds) {
    const currentDiff: PlayerNumbers = [0, 0, 0, 0]
    if (round.winner >= 5) {
      // penalty
      for (let i = 0; i < 4; i++) currentDiff[i] = i === round.giver ? round.points * 3 : -round.points
    } else if (round.winner !== 4) {
      // not draw
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

const w = computed<number[][]>(() => {
  const result = []
  let index = 0
  for (let wind = 0; wind < 4; wind++) {
    let startIndex = index
    let nbPlayedRounds = 0
    while (nbPlayedRounds < 4 && index < rounds.length) {
      if (rounds[index].points >= 0) nbPlayedRounds++
      index++
    }
    result.push([startIndex, nbPlayedRounds])
  }
  return result
})

const canAddRound = computed<boolean>(() => {
  return (
    winner.value === '4' ||
    ((winner.value === '5' || winner.value === '6') && giver.value !== '' && giver.value !== '4') ||
    (parseInt(pointInput.value) >= 8 && winner.value !== '' && giver.value !== '' && winner.value !== giver.value && rounds.length <= 16)
  )
})

const winnerItems = computed<any[]>(() => {
  return [
    {value: '0', title: player1.value},
    {value: '1', title: player2.value},
    {value: '2', title: player3.value},
    {value: '3', title: player4.value},
    {value: '4', title: t('r.draw')},
    {value: '5', title: t('r.penalty10')},
    {value: '6', title: t('r.penalty20')}
  ]
})

const giverItems = computed<any[]>(() => {
  return [
    {value: '0', title: player1.value},
    {value: '1', title: player2.value},
    {value: '2', title: player3.value},
    {value: '3', title: player4.value},
    {value: '4', title: t('r.self')}
  ]
})

function addRound() {
  const winnerValue = parseInt(winner.value)
  const draw = winnerValue === 4
  const penalty10 = winnerValue === 5
  const penalty20 = winnerValue === 6
  const round: Round = {
    points: draw ? 0 : penalty10 ? -10 : penalty20 ? -20 : parseInt(pointInput.value),
    winner: winnerValue,
    giver: draw ? -1 : parseInt(giver.value)
  }
  if (selectedIndex.value >= 0) {
    rounds.splice(selectedIndex.value, 1, round)
    selectedIndex.value = -1
  } else {
    rounds.push(round)
  }
  localStorage.setItem(ROUNDS_LS_KEY, JSON.stringify(rounds))
  pointInput.value = ''
  winner.value = ''
  giver.value = ''
  pointInputRef.value?.focus()
}

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
    savePlayer1()
    savePlayer2()
    savePlayer3()
    savePlayer4()
    localStorage.setItem(ROUNDS_LS_KEY, JSON.stringify(rounds))
    eastInputRef.value?.focus()
  }
}

const scoreFullScreen = ref<boolean>(false)

function openScoreFullScreen() {
  scoreFullScreen.value = true
}

function closeScoreFullScreen() {
  scoreFullScreen.value = false
}

function help() {
  window.open(`./help/${i18n.global.locale['value']}/index.html`, '_blank')
}
</script>

<template>
  <div class="text-h4">{{ t('app.title') }}</div>
  <div class="inputNameContainer">
    <v-text-field
      v-model="player1"
      :label="t('p.Name') + ' ' + t('dir.east')"
      type="text"
      autofocus
      class="inputName"
      :controlRef="setEastInputRef"
      v-on:focusout="savePlayer1"
    />
    <v-text-field v-model="player2" :label="t('p.Name') + ' ' + t('dir.south')" type="text" class="inputName" v-on:focusout="savePlayer2" />
    <v-text-field v-model="player3" :label="t('p.Name') + ' ' + t('dir.west')" type="text" class="inputName" v-on:focusout="savePlayer3" />
    <v-text-field v-model="player4" :label="t('p.Name') + ' ' + t('dir.north')" type="text" class="inputName" v-on:focusout="savePlayer4" />
  </div>
  <v-table v-if="playersDefined" :fixed-header="!scoreFullScreen" class="pointTableContainer">
    <thead>
      <tr>
        <th>
          <span>{{ t('r.Round') }}</span>
        </th>
        <template v-for="player in players">
          <th>
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
      <template v-for="(p, i) in points.slice(w[0][0], w[1][0])" :key="i">
        <ScoreRow :points="p" :round="rounds[i]" :players="players" :index="i" @onclick="cellClick" :selected="i === selectedIndex" />
      </template>
      <tr class="mdc-data-table__row" v-if="w[0][1] >= 4">
        <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
          <img alt="east" :src="resource('south.png')" />
        </td>
      </tr>
      <template v-for="(p, i) in points.slice(w[1][0], w[2][0])" :key="i + w[1][0]">
        <ScoreRow
          :points="p"
          :round="rounds[i + w[1][0]]"
          :players="players"
          :index="i + w[1][0]"
          @onclick="cellClick"
          :selected="i + w[1][0] === selectedIndex"
        />
      </template>
      <tr class="mdc-data-table__row" v-if="w[1][1] >= 4">
        <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
          <img alt="east" :src="resource('west.png')" />
        </td>
      </tr>
      <template v-for="(p, i) in points.slice(w[2][0], w[3][0])" :key="i + w[2][0]">
        <ScoreRow
          :points="p"
          :round="rounds[i + w[2][0]]"
          :players="players"
          :index="i + w[2][0]"
          @onclick="cellClick"
          :selected="i + w[2][0] === selectedIndex"
        />
      </template>
      <tr class="mdc-data-table__row" v-if="w[2][1] >= 4">
        <td class="mdc-data-table__cell" colspan="5" style="text-align: center">
          <img alt="east" :src="resource('north.png')" />
        </td>
      </tr>
      <template v-for="(p, i) in points.slice(w[3][0])" :key="i + w[3][0]">
        <ScoreRow
          :points="p"
          :round="rounds[i + w[3][0]]"
          :players="players"
          :index="i + w[3][0]"
          @onclick="cellClick"
          :selected="i + w[3][0] === selectedIndex"
        />
      </template>
    </tbody>
  </v-table>

  <div v-if="canInputPoints" class="inputWinnerContainer">
    <v-text-field v-model="pointInput" :label="t('r.Points')" type="number" class="inputPoint" :controlRef="setPointInputRef" />
    <v-select v-model="winner" :label="t('r.Winner')" class="selectPlayer" :items="winnerItems" />
    <v-select v-model="giver" :label="t('r.Giver')" class="selectPlayer" :items="giverItems" />
    <v-btn v-if="canAddRound" @click="addRound" :icon="selectedIndex >= 0 ? 'mdi-content-save' : 'mdi-plus'" />
    <div v-if="!canAddRound" class="blank" />
  </div>
  <div class="commandContainer">
    <v-btn v-if="playersDefined" @click="newGame">{{ t('app.newGame') }}</v-btn>
    <div style="display: flex; flex: 1 1 auto" />
    <v-btn @click="openScoreFullScreen" v-if="playersDefined" icon="mdi-fullscreen" />
    <v-btn @click="help" icon="mdi-help-circle-outline" />
  </div>
  <ScoreFullScreen v-if="scoreFullScreen" @close="closeScoreFullScreen" :points="points[points.length - 1]?.points ?? [0, 0, 0, 0]" :names="players" />
</template>

<style lang="scss">
.inputName {
  flex: 1;
}

.inputNameContainer > *:not(:last-child) {
  margin-right: var(--mjs-layout-gutter);
}

.inputNameContainer {
  margin-top: 16px;
  display: flex;
}

.inputWinnerContainer {
  margin: 16px 0;
  display: flex;
}

.blank {
  width: 48px;
  height: 48px;
}

.inputWinnerContainer > *:not(:last-child) {
  margin-right: var(--mjs-layout-gutter);
}

.inputPoint {
  flex: 0;
  min-width: 58px;
}

.selectPlayer {
  flex: 1;
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

.pointTableContainer {
  margin-bottom: 16px;
}

.commandContainer {
  display: flex;
}

.commandContainer > *:not(:last-child) {
  margin-right: var(--mjs-layout-gutter);
}
</style>
