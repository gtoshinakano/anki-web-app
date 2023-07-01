import {Helmet} from "react-helmet";
import useApplicationStore from '../store/useStore'
import {GiCardRandom, GiCardQueenHearts} from 'react-icons/gi'
import { VscSignOut } from 'react-icons/vsc'
import StudyFooter from "./studyFooter";
import {AuthProvider} from "../hooks/Auth"
import { signOut } from 'firebase/auth'
import { auth } from '../service/firebase'

type Props = {
  children: React.ReactNode,
};

const Layout = ({children}: Props) => {

  const {title, mode, setMode} = useApplicationStore()

  return(
    <AuthProvider>
      <main className="h-screen overflow-hidden flex flex-col font-dm text-neutral-700 bg-slate-50">
        <Helmet>
          <title>{title}</title>
          <meta name="description" content="Anki APP" />
        </Helmet>
        <header className="fixed w-screen">
          <nav
            className="w-full flex gap-1 justify-between bg-slate-700 px-2"
          >
            <h1 className="px-2 my-auto grow text-white font-dm font-semibold">{title}</h1>
            <button
              type="button"
              className="px-2 hover:bg-slate-600 text-sky-200 flex"
              onClick={() => setMode("study")}
            >
              <GiCardRandom className="text-xl m-auto" /> 
              <span className="my-auto ml-2">Study</span>
            </button>
            <button
              type="button"
              title="Open Menu"
              className="px-3 py-1 hover:bg-slate-600 text-green-200 flex"
              onClick={() => setMode("addCard")}
            >
              <GiCardQueenHearts className="text-xl m-auto" />
              <span className="my-auto ml-2">Add</span>
            </button>
            <button
              type="button"
              title="Open Menu"
              className="px-3 py-1 hover:bg-slate-600 text-white flex"
              onClick={() => signOut(auth)}
            >
              <VscSignOut className="text-xl m-auto" />
            </button>
          </nav>
        </header>
        <section className="grow pt-10 px-2 pb-20">
          {children}
        </section>
        <footer className="fixed bottom-0 w-full">
          {mode === "study" && <StudyFooter />}
        </footer>
      </main>
    </AuthProvider>
  )
}

export default Layout