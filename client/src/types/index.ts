
// User Types
export type UserId = number

export type User = {
  id: UserId
  username: string
  email?: string
  friendIds: UserId[]
  imageLink?: string
  isAdmin: boolean
}


// Session Types
export type SessionId = number
export type LoggedClimbId = number

export type SessionType = 'indoor' | 'outdoor'

export type Quality = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type Feeling = 1 | 2 | 3 | 4 | 5

export type ClimbStyle = 'Rope' | 'Boulder'

export type Attempt =
  | 'Flash'
  | 'Onsight'
  | 'Redpoint'
  | 'Fell/Hung'
  | 'Project'

export type IndoorColor =
  | 'Red'
  | 'Blue'
  | 'Green'
  | 'Yellow'
  | 'Orange'
  | 'Purple'
  | 'Pink'
  | 'White'
  | 'Black'

export type OutdoorGrade =
  | '5.5'
  | '5.6'
  | '5.7'
  | '5.8'
  | '5.9'
  | '5.10a'
  | '5.10b'
  | '5.10c'
  | '5.10d'
  | '5.11a'
  | '5.11b'
  | '5.11c'
  | '5.11d'
  | '5.12a'
  | '5.12b'
  | '5.12c'
  | '5.12d'
  | '5.13a'
  | '5.13b'
  | '5.13c'
  | '5.13d'
  | '5.14a'
  | '5.14b'
  | '5.14c'
  | '5.14d'

export type BoulderGrade =
  | 'V0'
  | 'V1'
  | 'V2'
  | 'V3'
  | 'V4'
  | 'V5'
  | 'V6'
  | 'V7'
  | 'V8'
  | 'V9'
  | 'V10'
  | 'V11'
  | 'V12'
  | 'V13'
  | 'V14'
  | 'V15'
  | 'V16'
  | 'V17'

export type Grade = OutdoorGrade | BoulderGrade

export type LoggedClimbBase = {
  id: LoggedClimbId
  grade: Grade | ''
  style: ClimbStyle
  attempt: Attempt
  quality: Quality
  comment: string
}

export type IndoorLoggedClimb = LoggedClimbBase & {
  color: IndoorColor | ''
}

export type OutdoorLoggedClimb = LoggedClimbBase & {
  name: string
}

export type LoggedClimb = IndoorLoggedClimb | OutdoorLoggedClimb

export type Session = {
  id: SessionId
  userId: UserId
  title: string
  date: string
  location: string
  type: SessionType
  duration: number | ''
  feeling: Feeling
  notes: string
  climbs: LoggedClimb[]
}