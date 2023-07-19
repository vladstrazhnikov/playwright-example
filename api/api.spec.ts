import { APIRequestContext } from '@playwright/test';

export async function deleteBoardRequest(request: APIRequestContext, url: String, boardId: String, key: String, token: String) {
    const response = await request.delete(`${url}/1/boards/${boardId}?key=${key}&token=${token}`);
    return {
        response,
        json: await response.json()
    }
}

export async function createBoardRequest(request: APIRequestContext, url: string, key: string, token: string, boardName: string) {
    const response = await request.post(`${url}/1/boards/?key=${key}&token=${token}&name=${boardName}`);
    return {
        response,
        json: await response.json()
    }
}

export async function getLists(request: APIRequestContext, url: String, boardId: String, key: String, token: String) {
    const response = await request.get(`${url}/1/boards/${boardId}/lists?key=${key}&token=${token}`);
    return {
        response,
        json: await response.json()
    }
}

export async function createCardRequest(request: APIRequestContext, url: string, key: string, token: string, cardName: string, listId) {
    const response = await request.post(`${url}/1/cards?key=${key}&token=${token}&name=${cardName}&idList=${listId}`);
    return {
        response,
        json: await response.json()
    }
}