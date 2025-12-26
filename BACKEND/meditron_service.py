from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    role: str = "patient"
    max_length: int = 200
    temperature: float = 0.7
    top_p: float = 0.9

# Initialize the pipeline
print("Loading Meditron-7B with 4-bit quantization...")
model_id = "epfl-llm/meditron-7b"

# Initialize tokenizer and model with 4-bit quantization
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    load_in_4bit=True,
    torch_dtype=torch.float16
)

# Create pipeline
pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto"
)

def format_prompt(message, role="patient"):
    system_prompt = "You are a helpful medical assistant."
    # The prompt format should follow the model's expected format.
    # Using a format similar to ChatML for Meditron models.
    if role.lower() == "doctor":
        user_prompt = f"Doctor's query: {message}"
    else:
        user_prompt = f"Patient's query: {message}"

    return f"""<|im_start|>system
{system_prompt}<|im_end|>
<|im_start|>user
{user_prompt}<|im_end|>
<|im_start|>assistant
"""

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        prompt = format_prompt(request.message, request.role)
        
        # Generate response
        response = pipe(
            prompt,
            max_length=request.max_length,
            temperature=request.temperature,
            top_p=request.top_p,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
        
        # Extract and clean the response
        full_text = response[0]['generated_text']
        assistant_response = full_text.split("Meditron:")[-1].strip()
        
        return {
            "success": True,
            "response": assistant_response,
            "model": "meditron-7b-4bit"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
