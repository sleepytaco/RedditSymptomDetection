import ProgressBar from './ProgressBar';
import { useEffect } from 'react';

export default function ModelOutput( {modelOutputDict, isLoading} ) {
    let progressBars = [];

    let updateProgressBars = () => {
        progressBars = []
        let i=0;
        for (const key in modelOutputDict) {
            progressBars.push(<span id={i}><ProgressBar label={key}  value={modelOutputDict[key]} isLoading={isLoading}> </ProgressBar></span>)
        }
    }

    // Effect to rebuild the list whenever the dictionary changes
    useEffect(() => {
        console.log("in use effect")
        updateProgressBars();
    }, [modelOutputDict]);

    updateProgressBars();

    return (
            <>
                <div className="flex flex-row">
                <div className="flex-grow p-4">{progressBars.slice(0, 5)}</div>
                <div className="flex-grow p-4">{progressBars.slice(5, 10)}</div>
                </div>
            </>
    );
}

