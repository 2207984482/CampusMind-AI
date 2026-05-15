from openai import AsyncOpenAI

from app.core.config import settings

# Multi-provider LLM client factory
PROVIDERS = {
    "openai": {
        "api_key": settings.OPENAI_API_KEY,
        "base_url": settings.OPENAI_BASE_URL,
    },
    "deepseek": {
        "api_key": settings.DEEPSEEK_API_KEY,
        "base_url": settings.DEEPSEEK_BASE_URL,
    },
}


def get_llm_client(provider: str | None = None) -> AsyncOpenAI:
    """Return an AsyncOpenAI client for the specified or default provider."""
    provider = provider or settings.DEFAULT_LLM_PROVIDER
    config = PROVIDERS.get(provider, PROVIDERS["deepseek"])
    return AsyncOpenAI(api_key=config["api_key"], base_url=config["base_url"])


def get_default_model(provider: str | None = None) -> str:
    """Return the default model name for the specified or default provider."""
    provider = provider or settings.DEFAULT_LLM_PROVIDER
    if provider == "openai":
        return settings.OPENAI_MODEL
    return settings.DEEPSEEK_MODEL
