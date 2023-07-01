import { DocumentData } from "firebase/firestore";

export interface IFlashcard {
  id: string
  created_at: Date
  archived: boolean
  check_count: number
  front: string
  furigana: string
  translate: string
}

export class Flashcard implements IFlashcard{
  id: string
  created_at: Date
  archived: boolean
  check_count: number
  front: string
  furigana: string
  translate: string
  constructor (id: string, data: DocumentData){
    this.id = id
    this.created_at = data.created_at.toDate() || new Date()
    this.archived = data.archived || false
    this.check_count = data.check_count || 0
    this.front = data.front || ""
    this.furigana = data.furigana || ""
    this.translate = data.translate || ""
  }
}

export interface IReviewInfo {
  check_after: Date
  id: string
  archived?: boolean
}