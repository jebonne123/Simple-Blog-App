const DOGS_API_KEY = 'live_odLrvUZfiuXoU7Qdn6QD2932lVU8iQfZzBXzIpbQ1iRXhvgHBB5hKRZwnVLjCSxT';

export async function fetchBreeds(limit: number = 10) {
    const response = await fetch(
        `https://api.thedogapi.com/v1/breeds?limit=${limit}`,
        { 
            method: 'GET',
            headers: { 'x-api-key': DOGS_API_KEY } 
        }
    );
    return response.json();
}