import {
  addDoc,
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
    const data = d.data() as University
    return { ...data, id: d.id }
  })
  return applyFilters(items, filters)
}

export const fetchUniversity = async (id: string): Promise<University | null> =>
  fetchUniversities().then((list) => list.find((u) => u.id === id) || null)

export const upsertUniversity = async (payload: University) => {
  if (!payload.id) {
    payload.id = `uni-${Date.now()}`
  }

  if (isFirebaseConfigured && db && universitiesCollection) {
    const ref = payload.id
      ? doc(universitiesCollection, payload.id)
      : doc(universitiesCollection)
    const { id, ...data } = payload
    if (payload.id) {
      await setDoc(ref, data, { merge: true })
    } else {
      const createdRef = await addDoc(universitiesCollection, data)
      payload.id = createdRef.id
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

