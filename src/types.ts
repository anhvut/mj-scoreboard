export type Round = {
  points: number
  winner: number
  giver: number
}

export type PlayerNames = [string, string, string, string]

export type PlayerNumbers = [number, number, number, number]

export type PlayerPoint = {
  diff: PlayerNumbers
  points: PlayerNumbers
}
