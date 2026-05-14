import pytest


@pytest.fixture
def sample_user_data():
    return {"email": "test@campusmind.dev", "username": "testuser", "password": "securepass123"}
