import ModelInput from './components/ModelInput'
import ModelOutput from './components/ModelOutput'

export default function App() {
    return (
        <>
        <div className="flex flex-col h-screen">
            <ModelInput />
            <ModelOutput />
        </div>
        </>
    );
}