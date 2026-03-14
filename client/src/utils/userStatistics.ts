// Utility functions for calculating user statistics from climbing sessions


import type { Grade, Session } from '@/types'

export type StatRow = {
  label: string
  value: string
}

const ropeGradeOrder = [
  '5.5',
  '5.6',
  '5.7',
  '5.8',
  '5.9',
  '5.10a',
  '5.10b',
  '5.10c',
  '5.10d',
  '5.11a',
  '5.11b',
  '5.11c',
  '5.11d',
  '5.12a',
  '5.12b',
  '5.12c',
  '5.12d',
  '5.13a',
  '5.13b',
  '5.13c',
  '5.13d',
  '5.14a',
  '5.14b',
  '5.14c',
  '5.14d',
] as const

const boulderGradeOrder = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
] as const

function isNumberDuration(duration: Session['duration']): duration is number {
  return typeof duration === 'number'
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function formatNumber(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return 'N/A'
  return value.toFixed(decimals)
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} min`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

function weekKey(dateString: string): string {
  const date = new Date(dateString)
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = utcDate.getUTCDay() || 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function gradeToIndex(grade: Grade, type: 'rope' | 'boulder'): number {
  const source = type === 'rope' ? ropeGradeOrder : boulderGradeOrder
  return source.indexOf(grade as never)
}

function indexToGrade(index: number, type: 'rope' | 'boulder'): string {
  const source = type === 'rope' ? ropeGradeOrder : boulderGradeOrder
  const rounded = Math.round(index)
  if (rounded < 0 || rounded >= source.length) return 'N/A'
  return source[rounded]
}

export function buildUserStatRows(sessions: Session[]): StatRow[] {
  const climbs = sessions.flatMap((session) => session.climbs)

  const activeWeeks = new Set(sessions.map((session) => weekKey(session.date))).size
  const sessionsPerWeek = activeWeeks === 0 ? '0.0' : formatNumber(sessions.length / activeWeeks)
  const climbsPerWeek = activeWeeks === 0 ? '0.0' : formatNumber(climbs.length / activeWeeks)

  const qualities = climbs.map((climb) => climb.quality)
  const averageQuality = qualities.length === 0 ? 'N/A' : formatNumber(average(qualities), 2)

  const durations = sessions.map((session) => session.duration).filter(isNumberDuration)
  const averageSessionDuration =
    durations.length === 0 ? 'N/A' : formatMinutes(Math.round(average(durations)))
  const allTimeDuration =
    durations.length === 0 ? 'N/A' : formatMinutes(durations.reduce((sum, value) => sum + value, 0))

  const ropeGradeIndexes = climbs
    .filter((climb): climb is typeof climb & { grade: Grade } => climb.style === 'Rope' && climb.grade !== '')
    .map((climb) => gradeToIndex(climb.grade, 'rope'))
    .filter((index) => index >= 0)

  const boulderGradeIndexes = climbs
    .filter(
      (climb): climb is typeof climb & { grade: Grade } =>
        climb.style === 'Boulder' && climb.grade !== ''
    )
    .map((climb) => gradeToIndex(climb.grade, 'boulder'))
    .filter((index) => index >= 0)

  const averageRopeGrade =
    ropeGradeIndexes.length === 0 ? 'N/A' : indexToGrade(average(ropeGradeIndexes), 'rope')
  const averageBoulderGrade =
    boulderGradeIndexes.length === 0 ? 'N/A' : indexToGrade(average(boulderGradeIndexes), 'boulder')

  const topRopeGrade =
    ropeGradeIndexes.length === 0 ? 'N/A' : indexToGrade(Math.max(...ropeGradeIndexes), 'rope')
  const topBoulderGrade =
    boulderGradeIndexes.length === 0
      ? 'N/A'
      : indexToGrade(Math.max(...boulderGradeIndexes), 'boulder')

  return [
    { label: 'Sessions / week', value: sessionsPerWeek },
    { label: 'Climbs / week', value: climbsPerWeek },
    { label: 'Average quality', value: averageQuality },
    { label: 'All-time sessions', value: String(sessions.length) },
    { label: 'All-time climbs', value: String(climbs.length) },
    { label: 'Average session duration', value: averageSessionDuration },
    { label: 'All-time duration', value: allTimeDuration },
    { label: 'Average rope grade', value: averageRopeGrade },
    { label: 'Average boulder grade', value: averageBoulderGrade },
    { label: 'Top rope grade', value: topRopeGrade },
    { label: 'Top boulder grade', value: topBoulderGrade },
  ]
}
