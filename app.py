import json
import math
import os
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

DATA_FILE = os.path.join(os.getcwd(), 'data', 'health_records.json')

# Ensure data directory exists
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

# Ensure data file exists with empty array
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

class HealthRecord:
    def __init__(self, name, age, gender, height, weight, id=None, date=None, time=None, bmi=None, category=None):
        self.id = id if id else str(int(datetime.now().timestamp() * 1000))
        self.name = name
        self.age = int(age)
        self.gender = gender
        self.height = float(height) # meters
        self.weight = float(weight) # kg
        
        # Academic requirement: math module
        self.bmi = bmi if bmi is not None else self.calculate_bmi()
        
        # Academic requirement: if-else statements for BMI category
        self.category = category if category else self.determine_category()
        
        # Academic requirement: datetime module
        now = datetime.now()
        self.date = date if date else now.strftime('%Y-%m-%d')
        self.time = time if time else now.strftime('%H:%M:%S')

    def calculate_bmi(self):
        raw_bmi = self.weight / math.pow(self.height, 2)
        return round(raw_bmi, 2)

    def determine_category(self):
        if self.bmi < 18.5:
            return "Underweight"
        elif 18.5 <= self.bmi <= 24.9:
            return "Normal"
        elif 25 <= self.bmi <= 29.9:
            return "Overweight"
        else:
            return "Obese"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            'bmi': self.bmi,
            'category': self.category,
            'date': self.date,
            'time': self.time
        }

    def save(self):
        records = HealthRecord.load()
        existing_index = next((i for i, r in enumerate(records) if r['id'] == self.id), -1)
        if existing_index >= 0:
            records[existing_index] = self.to_dict()
        else:
            records.append(self.to_dict())
        
        with open(DATA_FILE, 'w') as f:
            json.dump(records, f, indent=2)

    @staticmethod
    def load():
        try:
            if not os.path.exists(DATA_FILE):
                return []
            with open(DATA_FILE, 'r') as f:
                data = f.read()
                if not data:
                    return []
                return json.loads(data)
        except Exception as e:
            print("Error loading JSON data:", e)
            return []

    @staticmethod
    def delete(record_id):
        records = HealthRecord.load()
        records = [r for r in records if r['id'] != record_id]
        with open(DATA_FILE, 'w') as f:
            json.dump(records, f, indent=2)


class RequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="dist", **kwargs)

    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path == '/api/records':
            self._set_headers()
            self.wfile.write(json.dumps(HealthRecord.load()).encode())
        elif parsed_path.path.startswith('/api/'):
            self._set_headers(404)
            self.wfile.write(b'{"error": "Not found"}')
        else:
            # Fallback for SPA routing if file does not exist
            full_path = os.path.join(self.directory, parsed_path.path.lstrip('/'))
            if not os.path.exists(full_path) or not os.path.isfile(full_path):
                self.path = '/index.html'
            super().do_GET()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path == '/api/records':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            try:
                record = HealthRecord(
                    name=data.get('name'),
                    age=data.get('age'),
                    gender=data.get('gender'),
                    height=data.get('height'),
                    weight=data.get('weight')
                )
                record.save()
                self._set_headers(201)
                self.wfile.write(json.dumps(record.to_dict()).encode())
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self._set_headers(404)

    def do_PUT(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path.startswith('/api/records/'):
            record_id = parsed_path.path.split('/')[-1]
            content_length = int(self.headers['Content-Length'])
            put_data = self.rfile.read(content_length)
            data = json.loads(put_data)
            
            try:
                records = HealthRecord.load()
                existing = next((r for r in records if r['id'] == record_id), None)
                if not existing:
                    self._set_headers(404)
                    self.wfile.write(b'{"error": "Record not found"}')
                    return
                
                record = HealthRecord(
                    name=data.get('name', existing['name']),
                    age=data.get('age', existing['age']),
                    gender=data.get('gender', existing['gender']),
                    height=data.get('height', existing['height']),
                    weight=data.get('weight', existing['weight']),
                    id=record_id,
                    date=existing['date'],
                    time=existing['time']
                )
                record.save()
                self._set_headers(200)
                self.wfile.write(json.dumps(record.to_dict()).encode())
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self._set_headers(404)

    def do_DELETE(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path.startswith('/api/records/'):
            record_id = parsed_path.path.split('/')[-1]
            try:
                HealthRecord.delete(record_id)
                self._set_headers(204)
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self._set_headers(404)

def run(server_class=HTTPServer, handler_class=RequestHandler, port=3000):
    server_class.allow_reuse_address = True
    server_address = ('0.0.0.0', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting httpd on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
