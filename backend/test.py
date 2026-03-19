from app import create_app

app = create_app()

with app.test_client() as client:
    response = client.get('/')
    print(f"Root endpoint: {response.status_code}")
    print(f"Response: {response.get_json()}")
    
    response = client.get('/health')
    print(f"Health endpoint: {response.status_code}")
    print(f"Response: {response.get_json()}")