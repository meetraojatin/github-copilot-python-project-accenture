"""Application factory for the Sudoku Flask app."""

from flask import Flask

from .routes import bp


def create_app():
    """Create and configure the Flask application instance."""
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.register_blueprint(bp)
    return app


app = create_app()
