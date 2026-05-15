from fastapi import APIRouter, BackgroundTasks, Depends, File, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.core.database import get_db
from app.schemas.knowledge import (
    KnowledgeBaseCreate,
    KnowledgeBaseListResponse,
    KnowledgeBaseResponse,
    KnowledgeBaseUpdate,
    SearchRequest,
)

router = APIRouter()


@router.post("/bases", response_model=KnowledgeBaseResponse, status_code=201)
async def create_knowledge_base(
    request: KnowledgeBaseCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from app.models.knowledge import KnowledgeBase
    kb = KnowledgeBase(user_id=user_id, name=request.name, description=request.description)
    db.add(kb)
    await db.flush()
    await db.commit()
    return KnowledgeBaseResponse.model_validate(kb)


@router.get("/bases", response_model=KnowledgeBaseListResponse)
async def list_knowledge_bases(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import func, select
    from app.models.knowledge import KnowledgeBase, Document

    count_result = await db.execute(
        select(func.count()).where(KnowledgeBase.user_id == user_id)
    )
    total = count_result.scalar() or 0
    result = await db.execute(
        select(KnowledgeBase)
        .where(KnowledgeBase.user_id == user_id)
        .order_by(KnowledgeBase.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    bases = result.scalars().all()
    items = []
    for kb in bases:
        doc_count = await db.execute(
            select(func.count()).where(Document.knowledge_base_id == kb.id)
        )
        items.append(
            KnowledgeBaseResponse(
                id=kb.id,
                name=kb.name,
                description=kb.description,
                document_count=doc_count.scalar() or 0,
                created_at=kb.created_at,
                updated_at=kb.updated_at,
            )
        )
    return KnowledgeBaseListResponse(knowledge_bases=items, total=total)


@router.post("/bases/{kb_id}/documents")
async def upload_document(
    kb_id: str,
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    import os
    from app.models.knowledge import Document
    from app.services.rag_service import process_document

    ext = os.path.splitext(file.filename or "")[1].lower()
    file_type_map = {".pdf": "pdf", ".txt": "txt", ".md": "md"}
    file_type = file_type_map.get(ext)
    if not file_type:
        return {"code": 40000, "message": f"Unsupported file type: {ext}"}

    upload_dir = "uploads/documents"
    os.makedirs(upload_dir, exist_ok=True)
    import uuid
    stored_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(upload_dir, stored_name)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    doc = Document(
        knowledge_base_id=kb_id,
        filename=file.filename or stored_name,
        file_type=file_type,
        file_size=len(content),
        status="pending",
    )
    db.add(doc)
    await db.flush()
    await db.commit()

    background_tasks.add_task(process_document, file_path, file_type, str(doc.id), db)
    return {"code": 0, "message": "Document uploaded, processing started", "data": {"document_id": str(doc.id)}}


@router.post("/search")
async def search_knowledge(
    request: SearchRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Semantic search across knowledge base documents. Placeholder — wire to vector store."""
    return {"code": 0, "message": "ok", "data": {"results": []}}
