import { useState } from 'react'
import ModelInput from './components/ModelInput'
import ModelOutput from './components/ModelOutput'

function App() {
  const symptomsList = { 'Anger': 0.09, 'Anhedonia': 0.41, 'Anxiety': 0.67, "Disordered eating": 0.21, 'Loneliness': 0.58, 
                         "Sad mood": 0.31, "Self-loathing": 0.72, "Sleep problem": 0.28, "Somatic complaint": 0.76, 'Worthlessness': 0.46}
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
