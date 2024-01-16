from happiestfuntokenizing.happiestfuntokenizing import Tokenizer
import pickle
import numpy as np
from transformers import RobertaTokenizer, RobertaModel
import torch
from torch.utils.data import DataLoader, Dataset
# from sklearn.ensemble import RandomForestClassifier

batch_size = 128
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
roberta_model = RobertaModel.from_pretrained('roberta-base', output_hidden_states=True)
roberta_model.to(device)
print(f"Loaded tokenizer and moved model to device:{device} :D")

# @title Helper Functions
# Create custom Torch dataset class + Helper functions to create feature matrix
def load_roberta_classifiers():
    with open('model/roberta_sym_classifiers.pkl', 'rb') as roberta_clf:
        roberta_sym_classifiers = pickle.load(roberta_clf)
        roberta_clf.close()
    return roberta_sym_classifiers

# @title Helper Functions
def create_posts_list(text, single_post=True):
    """
    inputs: 
    text:str - "You are strong."
    single_post:bool - True
    outputs:
    if single_post==True: 
        [['you', 'are', 'strong', '.']]
    else:
        [['you'],
        ['you', 'are'],
        ['you', 'are', 'strong'],
        ['you', 'are', 'strong', '.']]

    """
    happy_tokenizer = Tokenizer()
    tokenized_text = happy_tokenizer.tokenize(text)
    tokenized_post = [tokenized_text]
    if single_post:
        return tokenized_post
    
    # else, break up text into multiple posts
    tokenized_post_list = []
    for i, txt in enumerate(tokenized_text):
        tokenized_post_list.append(tokenized_text[:i+1])
    
    return tokenized_post_list

class PostsDataset(Dataset):
  """
  A PyTorch Dataset for reddit posts that can be iterated through using __getitem__
  A custom dataset class, pass in List[List[str]] posts, and tokenize individual examples on ad hoc basis
  """
  def __init__(self, posts_list, tokenizer, device) -> None:
    self.dataset = posts_list
    self.tokenizer = tokenizer
    self.max_len = 512
    self.device = device

  def __len__(self) -> int:
    return len(self.dataset)

  def __getitem__(self, index):
    post_text = self.dataset[index]
    # returns {input_ids, attention_mask} which contain tensors of shape (1, 512)
    tokenized_post = self.tokenizer(post_text, return_tensors='pt',
                                    padding="max_length", truncation=True,
                                    max_length=self.max_len,
                                    is_split_into_words=True)
    return {
      'input_ids': tokenized_post['input_ids'][0].to(self.device),
      'attention_mask': tokenized_post['attention_mask'][0].to(self.device),
    }

def create_roberta_feature_matrix(posts_list):
    """
    input: List[List[strs]] containing text posts, label to fill the y matrix with
    outputs:
    - np feature matrix X of shape (num_of_posts, 768) - where 768 is feature size coming from RoBERTa model
    """
    # create custom torch dataset of posts - takes care of tokenizing individual posts
    posts_dataset = PostsDataset(posts_list, tokenizer, device)
    posts_dataloader = DataLoader(posts_dataset, batch_size=batch_size) # takes care of batching posts up for me :D
    X = np.zeros((1, 768)) # set up placeholder for featuremat X
    for posts_batch in posts_dataloader:
        with torch.no_grad():
            output = roberta_model(**posts_batch)
        h10 = output.hidden_states[9] # 10th hidden state values (batchsize, 512, 768)
        post_embeddings = torch.mean(h10, dim=1).cpu().numpy() # (batchsize, 786) i.e. take mean of token embeddings per post and use that as post embedding
        X = np.vstack([X, post_embeddings])
    X = X[1:, :] # skip the 0th row, as that was a placeholder
    return X

def run_roberta_classifiers(text):
    """
    text: str - "You are strong."
    lda_sym_classifiers: dict({"symptom": rf_clf})
    """
    print("Text:", text)
    ################## Tokenize text and featurize text
    tokenized_posts_list = create_posts_list(text)
    X = create_roberta_feature_matrix(tokenized_posts_list)
    sym_probs = {}
    for symptom in roberta_sym_classifiers.keys():
        ################## Use RF classifier to make prediction
        rf_classifier = roberta_sym_classifiers[symptom]
        # class_predictions = rf_classifier.predict(X)
        class_probabilities = rf_classifier.predict_proba(X)
        # print(class_predictions)
        # print(class_probabilities)
        print(symptom, "%:", class_probabilities[-1][1])
        sym_probs[symptom] = class_probabilities[-1][1]
    return sym_probs

roberta_sym_classifiers = load_roberta_classifiers()
# text = "Stand proud. You are strong."
# run_roberta_classifiers(text, roberta_sym_classifiers)