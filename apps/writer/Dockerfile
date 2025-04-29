FROM python:3.13-slim
WORKDIR /app
COPY main.py .
RUN pip install uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
