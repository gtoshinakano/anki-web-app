import React, { useEffect, useRef, useState } from "react"
import { BsFillBackspaceFill } from 'react-icons/bs'
import useApplicationState from "../store/useStore"
import Canvas from './canvas'

interface IForm {
  value: string
  characters: string[]
}

const Drawboard: React.FC = () => {
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [form, setForm] = useState<IForm>(initialForm)
  
  function callback(data: any, err: any) {
    
    if (err) {
      throw err;
    } else if (data && data.length > 0) {
      setForm({
        ...form,
        value: form.value + data[0],
        characters: data
      });
    }
  }
  
  const singleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, [e.target.name] : e.target.value})
  
  const backspace = () => {
    setForm({...form, value: form.value.slice(0, -1)})
  }
  
  const clickCharacter = (char: string) => {
    setForm({...form, value: form.value.slice(0, -1) + char})
  }

  const { reviewing } = useApplicationState()

  useEffect(() => {
    setForm(initialForm)
  }, [reviewing])
  
  return(
    <section className="h-full flex flex-col gap-1">
      <div 
        className="flex w-full flex-wrap justify-center gap-0.5"
      >
        <input
          type="text"
          value={form.value}
          ref={inputRef}
          onChange={singleChange}
          name="value"
          placeholder="Answer"
          className="px-3 py-1 outline-none border rounded w-5/6"
        />
        <button
          className="flex py-2 px-4 outline-none grow bg-neutral-100 justify-center border rounded"
          type="button"
          onClick={backspace}
          title="Backspace"
        >
          <BsFillBackspaceFill className="my-auto" />
        </button>
        <div className="flex overflow-hidden gap-0.5">
          {form.characters.map((char, index) => (
            <button 
              key={index}
              className="px-2 py-1 border bg-gray-100 w-10 text-center"
              onClick={() => clickCharacter(char)}
            >
              {char}
            </button>
          ))}
        </div>
      </div>  
      <Canvas callback={callback} />
    </section>
  )
}

export default Drawboard

const initialForm = {
  value: "",
  characters: []
}