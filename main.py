import os
import sqlite3
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from functools import wraps

app = Flask(__name__)

# --- CONFIGURAZIONE SICUREZZA ---
app.secret_key = 'una_chiave_molto_segreta_e_complessa_2026' # Cambiala a tuo piacimento
COACH_PASSWORD = "Coach2026" # La tua password di accesso

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'athletes.db')

# --- DECORATORE PER PROTEGGERE LE PAGINE ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- ROTTE DI AUTENTICAZIONE ---

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form.get('password') == COACH_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error="Password Errata!")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

# --- ROTTE PROTETTE ---

@app.route('/')
@login_required
def index():
    return render_template('dashboard.html')

@app.route('/api/save', methods=['POST'])
@login_required
def save():
    try:
        data = request.json
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("INSERT INTO athletes (name, d1, t1, d2, t2) VALUES (?, ?, ?, ?, ?)",
                  (data['name'], data['d1'], data['t1'], data['d2'], data['t2']))
        conn.commit()
        conn.close()
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/athletes', methods=['GET'])
@login_required
def get_athletes():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM athletes ORDER BY id DESC")
    rows = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/delete/<int:athlete_id>', methods=['DELETE'])
@login_required
def delete_athlete(athlete_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM athletes WHERE id = ?", (athlete_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # Creazione tabella se non esiste
    conn = get_db_connection()
    conn.execute('CREATE TABLE IF NOT EXISTS athletes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, d1 INT, t1 REAL, d2 INT, t2 REAL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
    conn.close()
    app.run(debug=True, host='0.0.0.0', port=5001)