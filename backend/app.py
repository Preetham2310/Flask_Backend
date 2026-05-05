from flask import Flask
from flask_cors import CORS
from models import db
from flask_migrate import Migrate
from models import db
from flask import render_template

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SECRET_KEY'] = 'secret'

    db.init_app(app)
    migrate=Migrate(app, db)
    CORS(app)
    @app.route('/')
    def home():
        return render_template('admin.html')
    

    # Import and register routes
    from routes.auth import auth
    app.register_blueprint(auth)

    # ✅ Opportunity blueprint here
    from routes.opportunity import opportunity_bp
    app.register_blueprint(opportunity_bp)

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)