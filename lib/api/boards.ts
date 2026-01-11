import { Board, CreateBoardInput, UpdateBoardInput } from "@/types/board";

const API_BASE_URL = "/api/boards";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getBoards(): Promise<Board[]> {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  return handleResponse<Board[]>(response);
}

export async function createBoard(data: CreateBoardInput): Promise<Board> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<Board>(response);
}

export async function deleteBoard(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  // DELETE returns 204 No Content, so no JSON to parse
  if (response.status !== 204) {
    await handleResponse(response);
  }
}

export async function updateBoard(id: string, data: UpdateBoardInput): Promise<Board> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<Board>(response);
}

export async function getBoardById(id: string): Promise<Board> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  return handleResponse<Board>(response);
}
