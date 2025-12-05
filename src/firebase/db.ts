import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './config'
import type { University, UniversityFilters } from '../types/university'
import { dummyUniversities } from '../data/dummyData'

let memoryUniversities = [...dummyUniversities]

const universitiesCollection = db ? collection(db, 'universities') : null

const applyFilters = (items: University[], filters?: UniversityFilters) => {
  const { search, city, program } = filters || {}
  return items.filter((item) => {
    const matchesSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase())
      : true
    const matchesCity = city
      ? item.location.toLowerCase().includes(city.toLowerCase())
      : true
    const matchesProgram = program
      ? item.programs.some((p) =>
          p.title.toLowerCase().includes(program.toLowerCase()),
        )
      : true
    return matchesSearch && matchesCity && matchesProgram
  })
}

export const fetchUniversities = async (
  filters?: UniversityFilters,
): Promise<University[]> => {
  if (!isFirebaseConfigured || !db || !universitiesCollection) {
    return applyFilters(memoryUniversities, filters)
  }

  try {
    const constraints = []
    if (filters?.city) {
      constraints.push(
        where('location', '>=', filters.city),
        where('location', '<=', `${filters.city}\uf8ff`),
      )
    }
    const snap = await getDocs(
      constraints.length
        ? query(universitiesCollection, ...constraints)
        : universitiesCollection,
    )
    const items = snap.docs.map((d) => {
      const data = d.data() as Omit<University, 'id'>
      return {
        ...data,
        id: d.id,
        programs: data.programs || [],
        achievements: data.achievements || [],
        leadership: data.leadership || [],
        admissions: data.admissions || {
          requirements: [],
          deadlines: [],
          scholarships: [],
        },
        cooperation: data.cooperation || {
          partners: [],
          exchangePrograms: [],
          foreignStudentInfo: '',
        },
      } as University
    })
    return applyFilters(items, filters)
  } catch (error) {
    console.error('Firebase fetch error:', error)
    return applyFilters(memoryUniversities, filters)
  }
}

export const fetchUniversity = async (id: string): Promise<University | null> =>
  fetchUniversities().then((list) => list.find((u) => u.id === id) || null)

export const upsertUniversity = async (payload: University) => {
  if (!payload.id) {
    payload.id = `uni-${Date.now()}`
  }

  if (isFirebaseConfigured && db && universitiesCollection) {
    try {
      const ref = doc(universitiesCollection, payload.id)
      const { id, ...data } = payload
      
      const firestoreData = {
        name: data.name || '',
        logoUrl: data.logoUrl || '',
        location: data.location || 'Kazakhstan',
        mission: data.mission || '',
        history: data.history || '',
        achievements: data.achievements || [],
        leadership: data.leadership || [],
        admissions: {
          requirements: data.admissions?.requirements || [],
          deadlines: data.admissions?.deadlines || [],
          scholarships: data.admissions?.scholarships || [],
        },
        cooperation: {
          partners: data.cooperation?.partners || [],
          exchangePrograms: data.cooperation?.exchangePrograms || [],
          foreignStudentInfo: data.cooperation?.foreignStudentInfo || '',
        },
        tour3dUrl: data.tour3dUrl || '',
        programs: data.programs || [],
      }
      
      await setDoc(ref, firestoreData, { merge: true })
      console.log('Successfully saved university to Firestore:', payload.id)
    } catch (error) {
      console.error('Firebase save error:', error)
      throw new Error(
        `Failed to save to Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  const existingIndex = memoryUniversities.findIndex((u) => u.id === payload.id)
  if (existingIndex >= 0) {
    memoryUniversities[existingIndex] = payload
  } else {
    memoryUniversities = [...memoryUniversities, payload]
  }

  return payload
}

export const deleteUniversity = async (id: string) => {
  if (isFirebaseConfigured && db && universitiesCollection) {
    await deleteDoc(doc(universitiesCollection, id))
  }
  memoryUniversities = memoryUniversities.filter((u) => u.id !== id)
}

export const seedUniversities = async () => {
  if (isFirebaseConfigured && db && universitiesCollection) {
    const existing = await getDocs(universitiesCollection)
    if (!existing.empty) return memoryUniversities

    await Promise.all(
      dummyUniversities.map((u) =>
        setDoc(doc(universitiesCollection, u.id), { ...u }),
      ),
    )
  }
  memoryUniversities = [...dummyUniversities]
  return memoryUniversities
}

