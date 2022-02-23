<script setup lang="ts">
import {t} from '../i18n'
import {computed, reactive, ref} from 'vue'
import type {PlayerNumbers, PlayerPoint, Round} from '../types'
import ScoreRow from './ScoreRow.vue'

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
</script>

<template>
  <div class="mdc-typography--headline3">{{ t('app.title') }}</div>
  <mcw-layout-grid>
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-textfield v-model="player1" :label="t('p.Player') + ' ' + t('dir.east')" type="text" autofocus />
    </mcw-layout-cell>
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-textfield v-model="player2" :label="t('p.Player') + ' ' + t('dir.south')" type="text" />
    </mcw-layout-cell>
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-textfield v-model="player3" :label="t('p.Player') + ' ' + t('dir.west')" type="text" />
    </mcw-layout-cell>
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-textfield v-model="player4" :label="t('p.Player') + ' ' + t('dir.north')" type="text" />
    </mcw-layout-cell>
  </mcw-layout-grid>

  <mcw-layout-grid v-if="playersDefined">
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-textfield v-model="points" :label="t('r.Points')" type="number" />
    </mcw-layout-cell>
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-select v-model="winner" :label="t('r.Winner')" class="mdc-select">
        <mcw-list-item data-value="0" tabindex="0">{{ player1 }}</mcw-list-item>
        <mcw-list-item data-value="1">{{ player2 }}</mcw-list-item>
        <mcw-list-item data-value="2">{{ player3 }}</mcw-list-item>
        <mcw-list-item data-value="3">{{ player4 }}</mcw-list-item>
        <mcw-list-item data-value="4">{{ t('r.draw') }}</mcw-list-item>
      </mcw-select>
    </mcw-layout-cell>
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-select v-model="giver" :label="t('r.Giver')">
        <mcw-list-item data-value="0" role="option" tabindex="0">{{ player1 }}</mcw-list-item>
        <mcw-list-item data-value="1" role="option">{{ player2 }}</mcw-list-item>
        <mcw-list-item data-value="2" role="option">{{ player3 }}</mcw-list-item>
        <mcw-list-item data-value="3" role="option">{{ player4 }}</mcw-list-item>
        <mcw-list-item data-value="4" role="option">{{ t('r.self') }}</mcw-list-item>
      </mcw-select>
    </mcw-layout-cell>
    <mcw-layout-cell class="mdc-layout-grid__cell--span-3">
      <mcw-fab v-if="canAddRound" @click="addRound" icon="add" />
    </mcw-layout-cell>
  </mcw-layout-grid>

  <mcw-data-table v-if="playersDefined">
    <table class="mdc-data-table__table" aria-label="Dessert calories">
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
        <template v-for="(roundPoints, index) in playerPoints" :key="index">
          <ScoreRow :roundPoints="roundPoints" :round-definition="rounds[index]" :players="players" :alternate="index % 2 === 1" />
        </template>
      </tbody>
    </table>
  </mcw-data-table>

  <!--tr>
  <td class="mdl-data-table__cell--non-numeric"></td>
  <td class="center"><img alt="east" src="../assets/east.png"/></td>
  <td class="center"><img alt="south" src="../assets/south.png"/></td>
  <td class="center"><img alt="west" src="../assets/west.png"/></td>
  <td class="center"><img alt="north" src="../assets/north.png"/></td>
</tr-->
</template>

<style lang="scss" scoped>
table {
  margin-top: 1em;
  margin-bottom: 1em;
}

.full-width {
  width: 100%;
}
</style>
