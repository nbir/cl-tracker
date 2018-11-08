const API_URL = 'http://localhost:5000';

export async function listItems() {
  const response = await fetch(`${API_URL}/items`);
  return response.json();
}

export async function createItem(data = {}) {
  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteItem(itemId) {
  await fetch(`${API_URL}/items/${itemId}`, {
    method: 'DELETE',
  });
}
