export type Message = {
    role: "user" | "system" | "assistant";
    content: string;
};

export const openai = async (
    messages: Message[]
  ): Promise<Message | undefined> => {
    const body = JSON.stringify({
      messages,
      model: "gpt-4-turbo",
    });
  
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body,
    });
    const data = await res.json();
    // console.log(data);
    const choice = 0;
    return data.choices[choice].message;
  };