const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('API Greeting Endpoint', () => {
  test('GET /api/greeting returns welcome message', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/greeting`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    
    // Verify the response structure
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('status', 'success');
    expect(data).toHaveProperty('system');
    expect(data).toHaveProperty('greeting');
    
    // Verify the greeting message content
    expect(data.message).toBe('Hi! Welcome to Conejo Negro POS System');
    expect(data.greeting.text).toBe('Hello from Conejo Negro Café!');
    expect(data.greeting.welcomeMessage).toBe('Your Point of Sale system is ready to serve you.');
    
    // Verify system information
    expect(data.system.name).toBe('pos-conejo-negro');
    expect(data.system.version).toBe('1.0.0');
    expect(data.system.description).toBe('Point of Sale system for Conejo Negro Cafe with cloud backup');
    
    // Verify timestamp is present and valid
    expect(data.greeting.timestamp).toBeDefined();
    expect(new Date(data.greeting.timestamp)).toBeInstanceOf(Date);
    
    // Verify uptime is a number
    expect(typeof data.uptime).toBe('number');
    expect(data.uptime).toBeGreaterThan(0);
  });

  test('Greeting endpoint returns consistent structure', async ({ request }) => {
    // Make a second request to ensure consistency
    const response = await request.get(`${BASE_URL}/api/greeting`);

    expect(response.status()).toBe(200);
    const data = await response.json();
    
    // Response should have the same greeting messages
    expect(data.message).toBe('Hi! Welcome to Conejo Negro POS System');
    expect(data.status).toBe('success');
    expect(data.greeting.text).toBe('Hello from Conejo Negro Café!');
  });
});