const API_URL = 'http://localhost:5000';

export async function listItems() {
  const response = await fetch(`${API_URL}/items`);
  return response.json();
}
