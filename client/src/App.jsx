import { useState } from 'react'
import ModelInput from './components/ModelInput'
import ModelOutput from './components/ModelOutput'

function App() {
  const symptomsList = {'Anger': 0, 'Anhedonia': 0, 'Anxiety': 0, 'Disordered eating': 0, 'Loneliness': 0, 
                        'Sad mood': 0, 'Self-loathing': 0, 'Sleep problem': 0, 'Somatic complaint': 0, 'Worthlessness': 0}
  const [modelOutputDict, setModelOutputDict] = useState(symptomsList)
  const [loading, setLoading] = useState(false);

  return (
    <>
    <div className="flex flex-col h-screen">
        <div className="flex-grow px-8 pt-8">
            <ModelInput modelOutputDict={modelOutputDict} sendDataToRightHalf={setModelOutputDict} loading={loading} setLoading={setLoading} />
        </div>
        <div className="flex-grow px-8 ">
            <ModelOutput modelOutputDict={modelOutputDict} isLoading={loading} />
        </div>
    </div>
    </>
  )
}

export default App
