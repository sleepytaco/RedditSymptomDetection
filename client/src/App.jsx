import { useState } from 'react'
import ModelInput from './components/ModelInput'
import ModelOutput from './components/ModelOutput'

function App() {
  const [modelOutputDict, setModelOutputDict] = useState({})

  return (
    <>
    <div className="flex h-screen items-center">
        <div className="flex-grow mx-4 p-4">
            <ModelInput sendDataToRightHalf={setModelOutputDict} />
        </div>
        <div className="flex-grow mx-4 p-4">
            <ModelOutput modelOutputDict={modelOutputDict} />
        </div>
    </div>
    </>
  )
}

export default App
