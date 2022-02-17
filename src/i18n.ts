import {createI18n} from "vue-i18n";

export const messages = {
  en: {
    'app.title': 'Mahjong scoreboard calculator',
    'r.AddRound': 'Add round',
    'r.Points': 'Points',
    'r.winner': 'winner',
    'r.loser': 'loser',
    'r.on': 'on',
    'r.self': 'self',
    'r.Round': 'Round',
    'r.SelectWinner': 'Select winner',
    'r.SelectLoser': 'Select loser',
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
    'app.title': 'Calculateur de table de score Mahjong',
    'r.AddRound': 'Ajouter manche',
    'r.Points': 'Points',
    'r.winner': 'gagnant',
    'r.loser': 'perdant',
    'r.on': 'sur',
    'r.self': 'tiré',
    'r.Round': 'Manche',
    'r.SelectWinner': 'Sélectionner gagnant',
    'r.SelectLoser': 'Sélectionner perdant',
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
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})

export const t = i18n.global.t
export default i18n