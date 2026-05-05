from flask import Blueprint, jsonify, request
from models import db, Opportunity

opportunity_bp = Blueprint('opportunity', __name__)

@opportunity_bp.route('/opportunities', methods=['GET'])
def get_opportunities():

    # 🔴 For now (temporary): assume logged-in user = 1
    admin_id = request.args.get('admin_id')
    opportunities = Opportunity.query.filter_by(admin_id=admin_id).all()
    if not admin_id:
        return jsonify({"error": "admin_id is required"}), 400

    opportunities = Opportunity.query.filter_by(admin_id=admin_id).all()

    if not opportunities:
        return jsonify({"message": "No opportunities found"}), 200

    result = []

    for opp in opportunities:
        result.append({
            "id": opp.id,
            "name": opp.name,
            "duration": opp.duration,
            "start_date": opp.start_date,
            "description": opp.description,
            "skills": opp.skills,
            "category": opp.category,
            "future_opportunities": opp.future_opportunities,
            "max_applicants": opp.max_applicants
        })

    return jsonify(result), 200

@opportunity_bp.route('/opportunities', methods=['POST'])
def add_opportunity():
    data = request.get_json()

    # 🔹 Extract fields
    name = data.get('name')
    duration = data.get('duration')
    start_date = data.get('start_date')
    description = data.get('description')
    skills = data.get('skills')
    category = data.get('category')
    future_opportunities = data.get('future_opportunities')
    max_applicants = data.get('max_applicants')
    admin_id = data.get('admin_id')

    admin_id = data.get('admin_id')

    try:
        admin_id = int(admin_id)
        if admin_id <= 0:
            raise ValueError
    except:
        return jsonify({"error": "Invalid admin_id"}), 400

    # 🔹 Validation
    if not all([name, duration, start_date, description, skills, category, future_opportunities, admin_id]):
        return jsonify({"error": "All required fields must be filled"}), 400

    # 🔹 Category validation
    valid_categories = ["Technology", "Business", "Design", "Marketing", "Data Science", "Other"]
    if category not in valid_categories:
        return jsonify({"error": "Invalid category"}), 400

    # 🔹 Save to DB
    new_opportunity = Opportunity(
        name=name,
        duration=duration,
        start_date=start_date,
        description=description,
        skills=skills,
        category=category,
        future_opportunities=future_opportunities,
        max_applicants=max_applicants,
        admin_id=admin_id
    )

    db.session.add(new_opportunity)
    db.session.commit()
    all_data = Opportunity.query.all()
    print("ALL OPPORTUNITIES IN DB:", all_data)
    return jsonify({
        "message": "Opportunity created successfully",
        "data": {
            "id": new_opportunity.id,
            "name": new_opportunity.name,
            "category": new_opportunity.category
        }
    }), 201
#Update opportunity API
@opportunity_bp.route('/opportunities/<int:id>', methods=['PUT'])
def update_opportunity(id):
    data = request.get_json()

    opp = Opportunity.query.get(id)

    if not opp:
        return jsonify({"error": "Opportunity not found"}), 404

    # Update fields
    opp.name = data.get('name')
    opp.duration = data.get('duration')
    opp.start_date = data.get('start_date')
    opp.description = data.get('description')
    opp.skills = data.get('skills')
    opp.category = data.get('category')
    opp.future_opportunities = data.get('future_opportunities')
    opp.max_applicants = data.get('max_applicants')

    db.session.commit()

    return jsonify({"message": "Opportunity updated successfully"}), 200
#Delete opportunity API
@opportunity_bp.route('/opportunities/<int:id>', methods=['DELETE'])
def delete_opportunity(id):
    admin_id = request.args.get('admin_id')

    opp = Opportunity.query.get(id)

    if not opp:
        return jsonify({"error": "Opportunity not found"}), 404

    # 🔒 Ensure only owner can delete
    if str(opp.admin_id) != str(admin_id):
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(opp)
    db.session.commit()

    return jsonify({"message": "Opportunity deleted successfully"}), 200