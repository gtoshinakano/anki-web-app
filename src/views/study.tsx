import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { AuthContext } from "../hooks/Auth"
import { getFlashcards, getUserReviews } from "../queries"
import { GiCardPickup } from 'react-icons/gi'
import dayjs from "dayjs"
import Drawboard from "../layout/drawboard"
import useApplicationState from "../store/useStore"

const StudyView: React.FC = () => {

  const client = useQueryClient()
  
  const user = useContext(AuthContext)

  const { data: flashcards } = useQuery(["flashcards", user?.uid], getFlashcards, {
    staleTime: Infinity, 
    onSuccess: () => client.invalidateQueries(["reviews", user?.uid])
  })

  const { data: reviews } = useQuery(["reviews", user?.uid], getUserReviews, {
    staleTime: Infinity, 
    initialData: []
  })

  const studyList = useMemo(() => {
    const reviewIds = reviews.map(r => r.id)
    return flashcards?.filter(f=> {
      let index = reviewIds.indexOf(f.id)
      return index === -1 || dayjs(reviews[index].check_after).isBefore(new Date())
    })
  }, [flashcards, reviews])

  const {reviewing, setReviewing, isFront, setIsFront} = useApplicationState()

  useEffect(() => {
    if(studyList) setReviewing(studyList[0])
  }, [studyList])

  return <>
    <div className='grow flex flex-col'>
      <h1 className="font-montserrat font-semibold flex text-xl">
        <GiCardPickup className="my-auto mr-2" />
        No of Cards: {studyList?.length}
      </h1>
      <button 
        className={`rounded shadow-md m-auto max-w-sm w-full py-6 md:py-12 px-2 text-center text-5xl md:text-6xl font-noto font-bold flex flex-col justify-center transform duration-100 ${isFront ? "bg-white text-slate-600": "bg-neutral-50 text-blue-400"}`}
        onClick={() => setIsFront(!isFront)}
      >
        <span className="mx-auto">
          {reviewing 
            ? isFront ? reviewing.front : reviewing.furigana
            : "Thats all for today"
          }
        </span>
        <small 
          className="text-xs mx-auto mt-2"
        >
          {reviewing && !isFront ? reviewing.translate : ""}
        </small>
      </button>
    </div>
    <div className=''>
      <Drawboard />
    </div>
  </>
}

export default StudyView