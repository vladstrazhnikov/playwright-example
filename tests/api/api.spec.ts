import { APIRequestContext } from '@playwright/test';

export async function deleteBoardRequest(request: APIRequestContext, url: String, boardId: String, key: String, token: String) {
    const response = await request.delete(`${url}/1/boards/${boardId}?key=${key}&token=${token}`);
    return {
        response,
        json: await response.json()
    }
}