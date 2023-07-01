import { firestore } from '../service/firebase'
import { doc, setDoc, updateDoc } from "firebase/firestore";

interface ReviewMutation {
  uid?: string,
  cid?: string
  value: any
}

export const reviewMutation = async ({uid, cid, value}: ReviewMutation) => {
  return setDoc(doc(firestore, `userFcReview/${uid}/reviews/${cid}`), value)
}

export const archiveMutation = async (cid : string ) => {
  return updateDoc(doc(firestore, `flashcards/${cid}`), {archived: true})
}