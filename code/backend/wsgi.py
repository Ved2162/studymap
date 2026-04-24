"""
WSGI entry point for production deployment (e.g., Render, Railway).
Gunicorn loads this module: gunicorn wsgi:app
"""
from app import app, init_db

# Initialise database tables on first import
with app.app_context():
    init_db()
