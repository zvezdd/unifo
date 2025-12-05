export type Program = {
  id: string
  title: string
  duration: string
  tuitionFee: string
  description: string
}

export type Admissions = {
  requirements: string[]
  deadlines: string[]
  scholarships: string[]
}

export type Cooperation = {
  partners: string[]
  exchangePrograms: string[]
  foreignStudentInfo: string
}

export type University = {
  id: string
  name: string
  logoUrl: string
  location: string
  missionHistory: string
  achievements: string[]
  admissions: Admissions
  cooperation: Cooperation
  tour3dUrl?: string
  programs: Program[]
}

export type UniversityFilters = {
  search?: string
  city?: string
  program?: string
}


