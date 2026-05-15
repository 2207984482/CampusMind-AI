"""RAG service — document parsing, chunking, embedding, and retrieval."""


async def process_document(file_path: str, file_type: str, document_id: str, db) -> None:
    """Parse document, chunk it, generate embeddings, store in pgvector."""
    from app.models.knowledge import Document
    from sqlalchemy import select, update

    await db.execute(
        update(Document).where(Document.id == document_id).values(status="processing")
    )
    await db.commit()

    try:
        text = _extract_text(file_path, file_type)
        chunks = _chunk_text(text)
        await _embed_and_store(chunks, document_id)
        await db.execute(
            update(Document).where(Document.id == document_id).values(
                status="ready", chunk_count=len(chunks)
            )
        )
        await db.commit()
    except Exception:
        await db.execute(
            update(Document).where(Document.id == document_id).values(status="failed")
        )
        await db.commit()


def _extract_text(file_path: str, file_type: str) -> str:
    if file_type == "pdf":
        import pymupdf
        doc = pymupdf.open(file_path)
        return "\n".join(page.get_text() for page in doc)
    elif file_type in ("txt", "md"):
        with open(file_path, encoding="utf-8") as f:
            return f.read()
    raise ValueError(f"Unsupported file type: {file_type}")


def _chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap)
    return splitter.split_text(text)


async def _embed_and_store(chunks: list[str], document_id: str) -> None:
    """Generate embeddings via DeepSeek API and store in pgvector. Placeholder — implement with actual vector store."""
    pass
