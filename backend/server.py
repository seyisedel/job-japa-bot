from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="JobJapa Admin - Health Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "jobjapa-admin"}


@app.get("/api/")
async def root():
    return {"message": "JobJapa Admin backend running. Dashboard talks directly to Supabase."}
