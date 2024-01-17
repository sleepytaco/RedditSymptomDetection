import { useState } from 'react';
import {Textarea, Button, Spinner} from "@nextui-org/react";


export default function ModelInput( {sendDataToRightHalf} ) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const sendToModelAPI = () => {
        // Construct the API endpoint with the text as a query parameter
        const apiUrl = `http://127.0.0.1:5000?text=${encodeURIComponent(text)}`;
        setLoading(true);
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            // Handle the API response data
            console.log(data);
            // const updatedModelOutputDict = {
            //   ...dictionaryState,
            //   data
            // };
            sendDataToRightHalf(updatedModelOutputDict);
          })
          .catch(error => {
            // Handle errors
            console.error('Error:', error);
          }).finally(() => {
            setLoading(false);
          });
      };

    return (
        <>
            <h1>Input to the model:</h1>
            <Textarea
                label="Description"
                placeholder="Enter some text here..."
                className="max-w-xs"
                onChange={(e) => setText(e.target.value)}
                />
            { !loading ? <Button onClick={sendToModelAPI}>Predict</Button> : <Spinner color="success"/>}
        </>
    );
}