import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabaseClient } from './supabaseClient.ts'
import { Message, openai } from './openai.ts'
import { Word } from './word.ts'
import { replyMessage } from './messages.ts'

//console.log("Hello from Functions!")

serve(async (req) => {
  const { events } = await req.json()
  console.log(events)

  const userid = events[0].source.userId

  if (events && events[0]?.type === "message") {
    const reserved = ["登録されているリストを表示します", "シャッフル単語帳を始めます", "統計を確認します"]
    const word = events[0].message.text
    if (reserved.includes(word)) {
      if (word === reserved[0]) {
        // my list
        const myListWords = new Word({userid, word, count:0, meaning:null})
        await myListWords.myList(supabaseClient())
        let messages:any = myListWords.myListMessages()
        replyMessage(events, messages)
      }
      if (word === reserved[1]) {
        // shuffle
        const shuffleWords = new Word({userid, word, count:0, meaning:null})
        await shuffleWords.shuffle(supabaseClient())
        await shuffleWords.shuffleRandom(supabaseClient())
        let messages:any = shuffleWords.shuffleMessages()
        replyMessage(events, messages)        
      }
      if (word === reserved[2]) {
        // statistics
        const statisticsWords = new Word({userid, word, count:0, meaning:null})
        await statisticsWords.statistics(supabaseClient())
        let messages:any = statisticsWords.statisticsMessages()
        replyMessage(events, messages)        
      }
      return;
    };
    
    const question: Message[] = [
      {
        role: "user",
        content: `${word}とは何ですか？64文字以内でわかりやすく説明してください。${word}に漢字が含まれる場合、その読み方もお願いします。また、${word}を使った例文を32文字以内でお願いします。`,
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
  } else if (events && events[0]?.type === "postback") {
    const postbackData = JSON.parse(events[0].postback.data)
    let messages:any = []
    if (postbackData.action === 'delete') {
      // delete
      let updateTime = new Date()
      await supabaseClient().from('word')
        .update({ deleted_at: updateTime, updated_at: updateTime })
        .eq('id', postbackData.id)
      messages.push({
          "type": "text",
          "text": `${postbackData.word} を削除しました`
      })
    } else if (postbackData.action === 'shuffle') {
      // shuffle
      const shuffleWords = new Word({userid, word:null, count:0, meaning:null})
      if (postbackData.id === 0) {
        // Search again after the number of records the user has registered is over.
        await shuffleWords.shuffle(supabaseClient())
      } else {
        await shuffleWords.shuffleId(postbackData.id)
      }
      await shuffleWords.shuffleRandom(supabaseClient())
      let messages:any = shuffleWords.shuffleMessages()
      replyMessage(events, messages)
    }
    replyMessage(events, messages)

  }
  return new Response(
    JSON.stringify({status: 'ok'}),
    { headers: { "Content-Type": "application/json" } },
  )
})
