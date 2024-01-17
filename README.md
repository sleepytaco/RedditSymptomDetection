# Detecting Depression Symptoms on Reddit 


For my Computational Linguistics final project at Brown University, I trained random forest classifiers to predict
symptoms of depression from real Reddit text data with an average accuracy of 80%, trying two different methods to create
linguistic features: fitting LDA model and generating embeddings with RoBERTa language model. I implemented some of the methods mentioned in the [Detecting Depression Symptoms on Reddit](https://dl.acm.org/doi/abs/10.1145/3578503.3583621) paper.

![WebAppScreenshot](https://github.com/sleepytaco/RedditSymptomDetection/blob/main/client/public/appscreenshot.png)


The overall project structure is split into three main steps: generate symptoms+control datasets, featurize datasets, and train symptom vs control random forest classifiers.

## Step 1. Symptoms+Control Datasets Generation

This step loads in the Reddit dataset and splits the 1M+ Reddit post examples from the dataset into 10 symptom datasets and 1 control dataset. The paper specifies a list of depression-related subreddits they used. Each of the 10 symptoms we work with is associated with certain depression-related subreddits. I aggregate posts from those subreddits to generate each of the 10 symptom datasets.

The control dataset contains posts not found in the depression subreddits. Generating the control dataset required an additional constraint (as mentioned in the paper) of the control posts being at least 180 days older than the author's index post in a depression-related subreddit. 

Additionally, this step tokenizes the generated 10+1 datasets using the [happiestfuntokenizing](https://pypi.org/project/happiestfuntokenizing/) module. 

## Step 2. Featurization
 
Featurization is assigning a numerical representation (a.k.a. linguistic features) to each Reddit text post. This step prepares the generated text datasets for classification by converting the 10+1 datasets into 10+1 feature matrices (+ label matrices). A label of 0 is used for the control posts and a label of 1 is used for the symptom posts. The following two methods of featurization were implemented for this project:

### Step 2.1 Featurization using a trained LDA model

First, train an LDA model (for 200 topics) on _all_ the symptoms and control posts from the dataset generation step. Then use the trained LDA model to generate features for each Reddit post. The input to the LDA model will be a BoW representation of the Reddit post and the output of the LDA model will be a list of 200 tuples representing the topic and the probability of the input Reddit post belonging to that topic. I then use these probabilities to build a 200-dimensional feature vector for the Reddit post. I do this for all tokenized Reddit posts to build a feature matrix `X` for symptoms and control datasets.

### Step 2.2 Featurization using RoBERTa embeddings

RoBERTa is a neural network (transformer-based) model with many hidden layers. To featurize a Reddit text post using RoBERTa, the idea is to pass the tokenized post inputs through the model and pluck out the hidden state representations of each of the input posts at the 10th hidden layer. The hidden states at the 10th layer will have a shape of `(batch_size, 512, 768)`. The batch size dimension refers to the number of tokenized posts passed as input to the model. The 512 dimension refers to the (max) number of tokens/words per post. The 768 dimension refers to the feature representation size of each of the 512 tokens. To generate a  feature embedding for a Reddit post, the idea is to average the information from the `512x768` token representations from the 10th layer into one `1x768` post embedding.

## Step 3. Train Symptom vs Control Random Forest Classifiers

The final step is to use the featurized matrices for symptoms and control (i.e. `X_symptom`, `y_symptom`, `X_control`, `y_control`) and train Symptom vs Control  random forest classifiers. 

Overall, I trained 20 symptom vs control classifiers (10 using LDA features + 10 using RoBERTa embeddings) using 5-fold cross-validation and reported their test AUC scores. The following table summarizes the AUC score results of the trained classifiers:

Symptom              | LDA                  | RoBERTa             
---------------------|----------------------|----------------------
Anger                | 0.8792               | 0.9118              
Anhedonia            | 0.9409               | 0.9411              
Anxiety              | 0.9418               | 0.9394              
Disordered eating    | 0.9509               | 0.926               
Loneliness           | 0.8578               | 0.8922              
Sad mood             | 0.8381               | 0.9062              
Self-loathing        | 0.8757               | 0.9054              
Sleep problem        | 0.9741               | 0.9297              
Somatic complaint    | 0.9234               | 0.9043              
Worthlessness        | 0.737                | 0.8787      
