import ProgressBars from './ProgressBars';

export default function ModelOutput( {modelOutputDict} ) {
    return (
            <>
                <h1>Model output:</h1>
                <ProgressBars />
                <p>Received Data: {modelOutputDict}</p>
            </>
    );
}