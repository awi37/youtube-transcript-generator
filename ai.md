# Deploying a Pre-trained AI Model Locally for YouTube Transcript Summarization

This guide will help you deploy a **free, pre-trained AI model** locally for summarizing YouTube transcripts and expose it as an API for your project.

---

## 1️⃣ Install Required Dependencies

### Step 1: Set Up Python Environment

Make sure your system has Python installed (preferably **Python 3.8+**). If not, install it from: [https://www.python.org/downloads/](https://www.python.org/downloads/)

Now, create a virtual environment (recommended):

```bash
python -m venv ai_summarizer_env
source ai_summarizer_env/bin/activate  # For Linux/macOS
ai_summarizer_env\Scripts\activate    # For Windows
```

### Step 2: Install Required Python Libraries

```bash
pip install torch transformers fastapi uvicorn youtube-transcript-api
```

---

## 2️⃣ Download and Load a Pre-trained Summarization Model

We will use **"facebook/bart-large-cnn"**, a good balance between quality and performance.

Create a new Python file `model.py` and add the following:

```python
from transformers import pipeline

# Load pre-trained summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text, max_length=150):
    """Summarize the given text using the pre-trained model."""
    summary = summarizer(text, max_length=max_length, min_length=50, do_sample=False)
    return summary[0]['summary_text']
```

---

## 3️⃣ Extract YouTube Transcript

Create another file `transcript.py` to fetch transcripts from YouTube videos.

```python
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    """Fetch transcript from a YouTube video."""
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    full_text = " ".join([t['text'] for t in transcript])
    return full_text
```

Test it with:

```python
print(get_transcript("VIDEO_ID_HERE"))
```

Replace `VIDEO_ID_HERE` with an actual YouTube video ID.

---

## 4️⃣ Create a Local API using FastAPI

Now, create an API file `app.py` to expose the summarization model.

```python
from fastapi import FastAPI
from model import summarize_text
from transcript import get_transcript

app = FastAPI()

@app.get("/summarize")
def summarize(video_id: str):
    """Fetches the YouTube transcript and summarizes it."""
    try:
        transcript = get_transcript(video_id)
        summary = summarize_text(transcript)
        return {"summary": summary}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 5️⃣ Run the API Locally

Start the server:

```bash
python app.py
```

Now, your API is running locally at:

```
http://127.0.0.1:8000/summarize?video_id=YOUR_VIDEO_ID
```

Replace `YOUR_VIDEO_ID` with an actual YouTube video ID and open the link in a browser or use Postman.

---

## 6️⃣ Use API in Your Project

In your **YouTube Summarization Project**, call this local API:

```python
import requests

video_id = "YOUR_VIDEO_ID"
response = requests.get(f"http://127.0.0.1:8000/summarize?video_id={video_id}")
print(response.json())
```

---

## 🎯 Final Notes

- This runs **completely free** on your local system 🚀
- You can **change the model** to `t5-small` or `distilbart-cnn` if BART is too heavy.
- To deploy on a cloud server, use **Docker** or **NGINX**.

✅ **Now, go to your university lab, follow these steps, and test your AI-powered YouTube summarizer!** 🎉
