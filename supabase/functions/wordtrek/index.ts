// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabaseClient } from './supabaseClient.ts'
import { Message, openai } from './openai.ts'
import { Word } from './word.ts'
import { replyMessage } from './messages.ts'

console.log("Hello from Functions!")

serve(async (req) => {
  const { events } = await req.json()
  console.log(events)
  if (events && events[0]?.type === "message") {
    const reserved = ["登録されているリストを表示します", "シャッフル単語帳を始めます", "統計を確認します"]
    const word = events[0].message.text
    const userid = events[0].source.userId

    if (reserved.includes(word)) {
      if (word === reserved[0]) {
        const myListWords = new Word({userid, word, count:0, meaning:null})
        await myListWords.myList(supabaseClient())
        let messages:any = myListWords.myListMessages()
        replyMessage(events, messages)
      }
      if (word === reserved[1]) {
        
      }
      if (word === reserved[2]) {
        
      }
      return;
    };
    
    const question: Message[] = [
      {
        role: "user",
        content: `${word}とは何ですか？64文字以内でわかりやすく説明してください。また、${word}を使った例文を32文字以内でお願いします。`,
      },
    ];
    
    const res = await openai(question);
    console.log(res?.content);

    
    const count = 1
    const words = new Word({userid, word, count, meaning:res?.content})
    await words.checkCount(supabaseClient())
    await words.saveToSupabase(supabaseClient())
    let messages:any = words.savedMessages()

    replyMessage(events, messages)
   }
  return new Response(
    JSON.stringify({status: 'ok'}),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
