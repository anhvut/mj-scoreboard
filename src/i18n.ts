import {createI18n} from 'vue-i18n'

export const messages = {
  en: {
    'app.title': 'Scoreboard MCR',
    'r.AddRound': 'Add round',
    'r.Points': 'Pts',
    'r.Winner': 'Winner',
    'r.Giver': 'Giver',
    'r.on': 'on',
    'r.self': 'self-drawn',
    'r.draw': 'draw',
    'r.Round': 'Round',
    'r.SelectWinner': 'Select winner',
    'r.SelectGiver': 'Select giver',
    'p.Name': 'Name',
    'p.PlayerNames': 'Player names',
    'p.Player': 'Player',
    'p.player': 'player',
    'w.and': 'and',
    'w.Welcome': 'Welcome',
    'dir.east': 'East',
    'dir.south': 'South',
    'dir.west': 'West',
    'dir.north': 'North'
  },
  fr: {
    'app.title': 'Feuille de score MCR',
    'r.AddRound': 'Ajouter manche',
    'r.Points': 'Pts',
    'r.Winner': 'Gagnant',
    'r.Giver': 'Donneur',
    'r.on': 'sur',
    'r.self': 'tiré soi-même',
    'r.draw': 'partie nulle',
    'r.Round': 'Manche',
    'r.SelectWinner': 'Choisir gagnant',
    'r.SelectGiver': 'Choisir donneur',
    'p.Name': 'Nom',
    'p.PlayerNames': 'Noms des joueurs',
    'p.Player': 'Joueur',
    'p.player': 'joueur',
    'w.and': 'et',
    'w.Welcome': 'Bienvenue',
    'dir.east': 'Est',
    'dir.south': 'Sud',
    'dir.west': 'Ouest',
    'dir.north': 'Nord'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})

export const t = i18n.global.t
export default i18n
