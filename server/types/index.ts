export type { DataEnvelope, DataListEnvelope } from "./dataEnvelopes"


// Ids

export type UserId = number
export type SessionId = number
export type ClimbId = number
export type FriendshipId = number

// User metrics
export type UserMetrics = {
    sessionsPerWeek: number
    climbsPerWeek: number
    averageQuality: number
    alltimeSessions: number
    alltimeClimbs: number 
    avgSessionDuration: number
    alltimeDuration: number
    avgRopeGrade: Grade | null
    avgBoulderGrade: Grade | null
    topRopeGrade: Grade | null
    topBoulderGrade: Grade | null
}


// Users

export type User = {
  id: UserId
  username: string
  email?: string
  imageLink?: string
  isAdmin: boolean
  friendIds: UserId[]
}

// Friendships

export type Friendship = {
  id: FriendshipId
  userId: UserId
  friendId: UserId
}
// Sessions

export type SessionType = "indoor" | "outdoor"

export type Feeling = 1 | 2 | 3 | 4 | 5

export type Session = {
  id: SessionId
  userId: UserId
  title: string
  date: string
  location: string
  type: SessionType
  duration: number
  feeling: Feeling
  notes: string
  climbs: Climb[]
}

export type SessionSummary = Omit<Session, "climbs">


// Climbs
export type ClimbBase = {
  id: ClimbId
  sessionId: SessionId
  grade: Grade
  style: ClimbStyle
  attempt: Attempt
  quality: Quality
  comment: string
}

export type IndoorClimb = ClimbBase & {
  color: IndoorColor
  name?: never
}

export type OutdoorClimb = ClimbBase & {
  name: string
  color?: never
}

export type Climb = IndoorClimb | OutdoorClimb

export type Quality = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type ClimbStyle = "Rope" | "Boulder"

export type Attempt =
  | "Flash"
  | "Onsight"
  | "Redpoint"
  | "Fell/Hung"
  | "Project"

export type IndoorColor =
  | "Red"
  | "Blue"
  | "Green"
  | "Yellow"
  | "Orange"
  | "Purple"
  | "Pink"
  | "White"
  | "Black"

export type OutdoorGrade =
  | "5.5"
  | "5.6"
  | "5.7"
  | "5.8"
  | "5.9"
  | "5.10a"
  | "5.10b"
  | "5.10c"
  | "5.10d"
  | "5.11a"
  | "5.11b"
  | "5.11c"
  | "5.11d"
  | "5.12a"
  | "5.12b"
  | "5.12c"
  | "5.12d"
  | "5.13a"
  | "5.13b"
  | "5.13c"
  | "5.13d"
  | "5.14a"
  | "5.14b"
  | "5.14c"
  | "5.14d"

export type BoulderGrade =
  | "V0"
  | "V1"
  | "V2"
  | "V3"
  | "V4"
  | "V5"
  | "V6"
  | "V7"
  | "V8"
  | "V9"
  | "V10"
  | "V11"
  | "V12"
  | "V13"
  | "V14"
  | "V15"
  | "V16"
  | "V17"

export type Grade = OutdoorGrade | BoulderGrade


// For internal use in models - represents the raw database rows

export type DbUserRow = {
    id: number
    username: string
    email: string | null
    image_link: string | null
    is_admin: boolean
}

export type DbSessionRow = {
    id: number
    user_id: number
    title: string
    date: string
    location: string
    type: string
    duration: number
    feeling: number
    notes: string
}

export type DbClimbRow = {
    id: number
    session_id: number
    grade: string
    style: string
    attempt: string
    quality: number
    comment: string
    color: string | null
    name: string | null
}

export type DbSessionWithClimbsRow = DbSessionRow & {
    climbs?: DbClimbRow[] | null
}

