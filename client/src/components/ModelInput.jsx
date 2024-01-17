import { useState } from 'react';
import {Textarea, Button, Spinner} from "@nextui-org/react";


export default function ModelInput( {modelOutputDict, sendDataToRightHalf, loading, setLoading} ) {
    const [text, setText] = useState('In the quiet echoes of solitude, life often reveals its poignant melancholy. Each passing moment feels like a fleeting whisper of dreams lost and unfulfilled. The world, once adorned with the hues of hope, now wears the muted shades of sorrow.');

    const sendToModelAPI = () => {
        // Construct the API endpoint with the text as a query parameter
        const apiUrl = `http://127.0.0.1:5000?text=${encodeURIComponent(text)}`;
        setLoading(true);
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            // Handle the API response data
            console.log(data);
            const updatedModelOutputDict = {
              ...modelOutputDict,
              ...data
            };
            delete updatedModelOutputDict["text"]; 
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
          <div className="flex">
            <div className="w-1/2 px-4">
              <h1 class="text-3xl">Hello!</h1>
              <p>I trained 10 random forest classifiers to predict
              symptoms of depression by training it on 1M+ Reddit text data. I featurized the Reddit posts using two methods: fitting LDA model and generating embeddings with RoBERTa language model. 
              Take a look at my <a href="https://github.com/sleepytaco/RedditSymptomDetection" target='_blank' style={{color: "green"}}>GitHub repo</a> for this project for more details on my implementation.
              </p>
              <p className='mt-5'>Tip: the more text you write, the better the results!</p>
            </div>

            <div className="flex w-1/2 px-10 gap-4 mt-5">
              <Textarea
              label="Model Input"
              placeholder="Enter some text here..."
              className="max-w-xs"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxRows={8}
              />
              { !loading ? <Button onClick={sendToModelAPI}>Predict</Button> : <Spinner color="success"/>}
            </div>
          </div>
        </>
    );
}