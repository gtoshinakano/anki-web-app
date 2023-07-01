import { firestore } from '../service/firebase'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { Flashcard } from '../model/flashcard'
import { QueryFunctionContext } from '@tanstack/react-query'
import _ from 'lodash'

export const getFlashcards = async ({ queryKey }: QueryFunctionContext) => {
  const q = query(collection(firestore, "flashcards"), where("archived", "==", false), where("uid", "==", queryKey[1]))
  const snapshot = await getDocs(q)
  let sorted = snapshot.docs.map(doc => {
    const card = new Flashcard(doc.id, doc.data())
    return card
  })
  return _.shuffle(sorted)
}

export const getUserReviews = async ({ queryKey }: QueryFunctionContext) => {
  const q = query(collection(firestore, `userFcReview/${queryKey[1]}/reviews`))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    ...doc.data(),
    check_after: doc.data().check_after?.toDate() || new Date(),
    id: doc.id
  }))
}

