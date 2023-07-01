import { BsFileCheckFill, BsFileDiffFill, BsFileXFill, BsFileMinusFill } from 'react-icons/bs'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthContext } from '../hooks/Auth'
import { useContext } from 'react'
import useApplicationState from '../store/useStore'
import { reviewMutation, archiveMutation } from '../queries/mutations'
import dayjs, { ManipulateType } from 'dayjs'

const StudyFooter: React.FC = () => {

  const user = useContext(AuthContext)
  const client = useQueryClient()
  const reviewKey = ["reviews", user?.uid]
  const flashcardKey = ["flashcards", user?.uid]

  const { reviewing } = useApplicationState()
  const { mutate } = useMutation(reviewMutation, {
    onSuccess: (data, vars, ctx) => {
      client.invalidateQueries(reviewKey)
    }
  })

  const { mutate: archiveMutate } = useMutation(archiveMutation, {
    onSuccess: (data, vars, ctx) => {
      client.invalidateQueries(flashcardKey)
    }
  })
  
  const answer = (time: number, unit?: ManipulateType) => {
    if(reviewing && user ){
      mutate({
        uid: user.uid,
        cid: reviewing.id,
        value: {
          check_after: dayjs().add(time, unit).toDate()
        }
      })
    }
  }

  const archive = () => {
    if(reviewing && user ){
      archiveMutate(reviewing.id)
    }
  }

  return(
    <div className="flex w-full bg-neutral-100 py-0.5 border-t">
      <button 
        className='w-1/4 h-full flex text-xl text-green-700 pt-2 pb-1 flex-col 
        border-r border-zinc-200'
        onClick={() => answer(3, "day")}
      >
        <BsFileCheckFill className='m-auto' />
        <span 
          className="text-sm mx-auto mt-0.5"
        >
          easy
        </span>
      </button>  
      <button 
        className='w-1/4 h-full flex text-xl text-amber-400 pt-2 pb-1 flex-col 
        border-r border-zinc-200'
        onClick={() => answer(1, "day")}
      >
        <BsFileDiffFill className='m-auto' />
        <span 
          className="text-sm mx-auto mt-0.5"
        >
          medium
        </span>
      </button> 
      <button 
        className='w-1/4 h-full flex text-xl text-red-500 pt-2 pb-1 flex-col 
        border-r border-zinc-200'
        onClick={() => answer(10, "minutes")}
      >
        <BsFileXFill className='m-auto' />
        <span 
          className="text-sm mx-auto mt-0.5"
        >
          hard
        </span>
      </button> 
      <button 
        className='w-1/4 h-full flex text-xl text-green-500 pt-2 pb-1 flex-col '
        onClick={archive}
      >
        <BsFileMinusFill className='m-auto' />
        <span 
          className="text-sm mx-auto mt-0.5"
        >
          learned
        </span>
      </button> 
    </div>
  )
}

export default StudyFooter