interface OllamaRequest {
    model: string;
    prompt: string;
    system: string;
    stream: boolean;
  }
  
  interface OllamaResponse {
    response: string;
    error?: string;
  }
  
  export async function queryLLM(
    prompt: string,
    systemPrompt: string,
    baseUrl: string,
    model: string,
    timeout: number
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const url = `${baseUrl}/api/generate`;
      const body: OllamaRequest = {
        model,
        prompt,
        system: systemPrompt,
        stream: false,
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
  
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }
  
      const data = (await response.json()) as OllamaResponse;
  
      if (data.error) {
        throw new Error(`Ollama error: ${data.error}`);
      }
  
      return data.response || 'No response from model';
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request to LLM timed out');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }