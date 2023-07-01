import './index.css'
import Layout from './layout'
import useApplicationState from './store/useStore'
import AddCardView from './views/addCard'
import StudyView from './views/study'
import { QueryClient, QueryClientProvider  } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const client = new QueryClient()

function App() {

  const { mode } = useApplicationState()

  return (
    <QueryClientProvider client={client}>
      <Layout>
        <section 
          className='h-full flex flex-col gap-1'
        >
          {mode === "study" && <StudyView />}
          {mode === "addCard" && <AddCardView />}
        </section>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
