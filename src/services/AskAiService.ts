import API from "../api";

export interface AskAiResult {
  contentType: string;
  title: string;
  price?: number;
  year?: number;
  make?: string;
  model?: string;
  url?: string;
  listingId?: number;
  imageUrl?: string;
}

export interface AskAiResponse {
  answer: string;
  results: AskAiResult[];
}

export async function askAi(question: string): Promise<AskAiResponse> {
  const { data }: { data: any } = await API.post("/api/AzureAiSearch/query", { question });
  return {
    answer: typeof data?.answer === "string" ? data.answer : "",
    results: Array.isArray(data?.results) ? data.results : [],
  };
}
