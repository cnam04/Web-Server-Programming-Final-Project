import type {
    Climb,
    Grade,
    Session,
} from "../../types"
//  HELPER FUNCTIONS FOR METRICS CALCULATION
// ---------------------------------------------------
const OUTDOOR_GRADES: Grade[] = [
    "5.5",
    "5.6",
    "5.7",
    "5.8",
    "5.9",
    "5.10a",
    "5.10b",
    "5.10c",
    "5.10d",
    "5.11a",
    "5.11b",
    "5.11c",
    "5.11d",
    "5.12a",
    "5.12b",
    "5.12c",
    "5.12d",
    "5.13a",
    "5.13b",
    "5.13c",
    "5.13d",
    "5.14a",
    "5.14b",
    "5.14c",
    "5.14d",
]

const BOULDER_GRADES: Grade[] = [
    "V0",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
]

function roundTo(value: number, decimals: number = 2): number {
    const factor = 10 ** decimals
    return Math.round(value * factor) / factor
}

function toDateOnly(date: string): Date {
    return new Date(`${date}T00:00:00Z`)
}

function getSessionsCoveredWeeks(sessions: Session[]): number {
    if (sessions.length === 0) return 0

    const timestamps = sessions
        .map((session) => toDateOnly(session.date).getTime())
        .filter((time) => !Number.isNaN(time))

    if (timestamps.length === 0) return 0

    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)
    const daysCovered = Math.max(1, (maxTime - minTime) / (1000 * 60 * 60 * 24) + 1)

    return Math.max(1, daysCovered / 7)
}

export function calculateSessionsPerWeek(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    const weeks = getSessionsCoveredWeeks(sessions)
    if (weeks === 0) return 0
    return roundTo(sessions.length / weeks)
}

export function calculateClimbsPerWeek(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    const weeks = getSessionsCoveredWeeks(sessions)
    if (weeks === 0) return 0

    const totalClimbs = sessions.reduce(
        (count, session) => count + (session.climbs?.length ?? 0),
        0,
    )

    return roundTo(totalClimbs / weeks)
}

export function calculateAverageQuality(climbs: Climb[]): number {
    if (climbs.length === 0) return 0
    const total = climbs.reduce((sum, climb) => sum + climb.quality, 0)
    return roundTo(total / climbs.length)
}

export function calculateAverageSessionDuration(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0)
    return roundTo(totalDuration / sessions.length)
}

export function calculateAlltimeDuration(sessions: Session[]): number {
    return sessions.reduce((sum, session) => sum + session.duration, 0)
}

export function isRopeClimb(climb: Climb): boolean {
    return climb.style === "Rope"
}

export function isBoulderClimb(climb: Climb): boolean {
    return climb.style === "Boulder"
}

export function getGradeScale(climbs: Climb[]): Grade[] {
    if (climbs.length === 0) return []
    return climbs[0].style === "Rope" ? OUTDOOR_GRADES : BOULDER_GRADES
}

export function calculateAverageGrade(climbs: Climb[]): Grade | null {
    if (climbs.length === 0) return null

    const scale = getGradeScale(climbs)
    if (scale.length === 0) return null

    const indexes = climbs
        .map((climb) => scale.indexOf(climb.grade))
        .filter((index) => index >= 0)

    if (indexes.length === 0) return null

    const averageIndex = indexes.reduce((sum, index) => sum + index, 0) / indexes.length
    const roundedIndex = Math.max(0, Math.min(scale.length - 1, Math.round(averageIndex)))

    return scale[roundedIndex] ?? null
}

export function calculateTopGrade(climbs: Climb[]): Grade | null {
    if (climbs.length === 0) return null

    const scale = getGradeScale(climbs)
    if (scale.length === 0) return null

    const indexes = climbs
        .map((climb) => scale.indexOf(climb.grade))
        .filter((index) => index >= 0)

    if (indexes.length === 0) return null

    const maxIndex = Math.max(...indexes)
    return scale[maxIndex] ?? null
}