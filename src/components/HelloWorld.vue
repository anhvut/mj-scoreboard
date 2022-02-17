<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {t} from "../i18n";

type Round = {
  points: number
  winner: number
  loser: number
}

type PlayerNumbers = [number, number, number, number]

type PlayerPoint = {
  diff: PlayerNumbers
  points: PlayerNumbers
}

defineProps<{ msg: string }>()
const points = ref<number>(0)
const player1 = ref<string>(`${t('p.Player')} 1`)
const player2 = ref<string>(`${t('p.Player')} 2`)
const player3 = ref<string>(`${t('p.Player')} 3`)
const player4 = ref<string>(`${t('p.Player')} 4`)
const players = computed<string[]>(() => [player1.value, player2.value, player3.value, player4.value])

const winner = ref<string>('')
const loser = ref<string>('')

const rounds = reactive<Round[]>([])
const playerPoints = computed<PlayerPoint[]>(() => {
  const result: PlayerPoint[] = [];
  const currentPoints: PlayerNumbers = [0, 0, 0, 0];
  for (const round of rounds) {
    const currentDiff: PlayerNumbers = [0, 0, 0, 0];
    if (round.loser !== 4) {
      currentDiff[round.winner] = round.points + 32
      currentDiff[round.loser] = -round.points
      for (let i = 0; i < 4; i++) currentDiff[i] -= 8

    } else {
      currentDiff[round.winner] = 4 * (round.points + 8)
      for (let i = 0; i < 4; i++) currentDiff[i] -= round.points + 8
    }
    for (let i = 0; i < 4; i++) currentPoints[i] += currentDiff[i]
    result.push({
      diff: currentDiff,
      points: currentPoints.slice() as PlayerNumbers
    })
  }
  return result;
});

const cannotAddRound = computed<boolean>(() => {
  return points.value <= 0 || winner.value === '' || loser.value === '' || winner.value === loser.value || rounds.length >= 16
})

function addRound() {
  rounds.push({
    points: points.value,
    winner: parseInt(winner.value),
    loser: parseInt(loser.value)
  })
  points.value = 0
  winner.value = ''
  loser.value = ''
}
</script>

<template>
  <h1>{{$t('app.title')}}</h1>

  <p>{{$t('p.PlayerNames')}}</p>
  <ul>
    <li><input v-model="player1" :placeholder="$t('p.Player') + ' 1'" /></li>
    <li><input v-model="player2" :placeholder="$t('p.Player') + ' 2'" /></li>
    <li><input v-model="player3" :placeholder="$t('p.Player') + ' 3'" /></li>
    <li><input v-model="player4" :placeholder="$t('p.Player') + ' 4'" /></li>
  </ul>
  <p>
    {{$t('w.Welcome')}} {{player1}}, {{player2}}, {{player3}} {{$t('w.and')}} {{player4}} !
  </p>

  <p>{{$t('r.Points')}} <input type="number" v-model="points"/>
    {{$t('r.winner')}}
    <select v-model="winner">
      <option disabled value="">{{$t('r.SelectWinner')}}</option>
      <option value="0">{{player1}}</option>
      <option value="1">{{player2}}</option>
      <option value="2">{{player3}}</option>
      <option value="3">{{player4}}</option>
    </select>

    {{$t('r.loser')}}
    <select v-model="loser">
      <option disabled value="">{{$t('r.SelectLoser')}}</option>
      <option value="0">{{player1}}</option>
      <option value="1">{{player2}}</option>
      <option value="2">{{player3}}</option>
      <option value="3">{{player4}}</option>
      <option value="4">{{$t('r.self')}}</option>
    </select>
    <button @click="addRound" :disabled="cannotAddRound">{{$t('r.AddRound')}}</button>
  </p>
  <table>
    <thead>
      <tr>
        <th>{{$t('r.Round')}}</th>
        <th>{{player1}}</th>
        <th>{{player2}}</th>
        <th>{{player3}}</th>
        <th>{{player4}}</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(round, index) in playerPoints" :key="index">
        <tr>
          <td>{{rounds[index].points.toString(10) + (rounds[index].loser === 4 ? 'T' : '')}}</td>
          <td>{{round.diff[0]}}</td>
          <td>{{round.diff[1]}}</td>
          <td>{{round.diff[2]}}</td>
          <td>{{round.diff[3]}}</td>
        </tr>
        <tr>
          <td>{{players[rounds[index].winner] + (rounds[index].loser === 4 ? '' : ' ' + $t('r.on') + ' ' + players[rounds[index].loser])}}</td>
          <td>{{round.points[0]}}</td>
          <td>{{round.points[1]}}</td>
          <td>{{round.points[2]}}</td>
          <td>{{round.points[3]}}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: inline-block;
  margin: 0 0.5em;
}
</style>
