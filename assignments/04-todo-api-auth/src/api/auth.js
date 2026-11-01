export async function refreshTokenRequest (refreshToken) {
    const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify( { refreshToken }),
    });
    if (!response.ok) {
        throw new Error('Token refresh failed');
    }
    return response.json();
}