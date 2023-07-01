import create from "zustand";
import { devtools, persist } from 'zustand/middleware'
import { IFlashcard }  from '../model/flashcard'

interface ApplicationState {
  title: string;
  setTitle: (title: string) => void;
  mode: string;
  setMode: (route: string) => void;
  menuOpen: boolean;
  setMenuOpen: (setOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void
  reviewing?: IFlashcard
  setReviewing: (reviewing: IFlashcard) => void
  isFront: boolean;
  setIsFront: (isFront: boolean) => void;
}

const useApplicationState = create<ApplicationState>() (
  devtools(
    persist((set) => ({
      title: "Anki App Title",
      setTitle: (title: string) => set((state) => ({...state, title})),
      mode: "/",
      setMode: (mode: string) => set((state) => ({...state, mode})),
      menuOpen: false,
      setMenuOpen: (setOpen: boolean) => set((state) => ({...state, setOpen})),
      isLoading: false,
      setIsLoading: (isLoading: boolean) => set(state => ({...state, isLoading})),
      setReviewing:(reviewing: IFlashcard) => set(state => ({...state, reviewing})),
      isFront: true,
      setIsFront: (isFront: boolean) => set(state => ({...state, isFront }))
    }),{
      name: "AppState",
      partialize: (state) => ({
        title: state.title, 
        mode: state.mode,
        isFront: state.isFront 
      })
    })
  , {name: "Application State"})  
)


export default useApplicationState;