export class Word {
  _userid = "";
  _word = "";
  _personCount = 0
  _count = 0;
  _lastDate = new Date();
  _meaning = ""
  _errorrMessages = [];
  _myList:any;
  _statistics:any;
  _shuffle_id = 0;
  _shuffle:any;
  constructor({userid, word, count, meaning}) {
    this._userid = userid;
    this._word = word;
    this._count = count;
    this._meaning = meaning;
  }

  async checkCount(supabaseClient) {
    let { data, error } = await supabaseClient
      .from('view_word')
      .select('userid')
      .neq('userid', this._userid)
      .eq('word', this._word)
    if (error) console.log({caused: "Word.constructor", error})
    //console.log(data)
    this._personCount = data.length;

    ({ data, error } = await supabaseClient
      .from('word')
      .select('count,created_at')
      .eq('userid', this._userid)
      .eq('word', this._word)
      .order('count', { ascending: false }))
    if (error) console.log({caused: "Word.constructor", error})
    //console.log(data)
    if (data.length > 0) {
      this._count = data[0].count + 1;
      this._lastDate = new Date(data[0].created_at);
    }
  }

  async saveToSupabase(supabaseClient) {
    const { error } = await supabaseClient
      .from('word')
      .insert({ userid: this._userid, word: this._word, count: this._count, meaning: this._meaning })
    if(error) console.log({caused: "Word.saveToSupabase", error})
  }

  savedMessages() {
    let wordMessage = '';
    if (this._count > 1) {
      wordMessage = `${this._word}を調べたのは${this._count}回目です。最後に調べたのは${this._lastDate.toLocaleDateString('ja-JP')}です。\n${this._word}は、あなたの他に${this._personCount}人が調べています。`
    } else {
      wordMessage = `${this._word}を登録しました。\n${this._word}は、あなたの他に${this._personCount}人が調べています。`
    }
    return [
      // {
      //   "type": "text",
      //   "text": `${this._meaning}`
      // },
      // {
      //   "type": "text",
      //   "text": wordMessage
      // },
      {
        "type": "flex",
        "altText": `${this._word}の情報を表示`,
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": this._meaning,
                    "wrap": true,
                    "size": "sm",
                    "color": "#000000"
                  }
                ],
                "paddingBottom": "8px"
              },
              {
                "type": "separator"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": wordMessage,
                    "wrap": true,
                    "size": "xs"
                  }
                ],
                "paddingTop": "8px",
                "paddingBottom": "8px"
              },
              {
                "type": "separator"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "回答がおかしい場合はクリック👉",
                        "size": "xs",
                        "align": "end"
                      }
                    ],
                    "width": "80%"
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "報告",
                        "align": "center",
                        "action": {
                          "type": "postback",
                          "label": "action",
                          "data": JSON.stringify({action: 'hallucination', word: this._word})
                        },
                        "size": "sm",
                        "color": "#1a0dab"
                      }
                    ],
                    "width": "20%"
                  }
                ],
                "paddingTop": "8px"
              }
            ],
            "paddingTop": "8px",
            "paddingBottom": "8px"
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }  
      }
    ]
  }

  async myList(supabaseClient) {
    let { data, error } = await supabaseClient
      .from('view_word')
      .select('id,word,created_at')
      .eq('userid', this._userid)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) console.log({caused: "Word.myList", error})
    //console.log(data)
    this._myList = data;
  }

  myListMessages() {
    if (this._myList.length > 0) {
      const bubble = {
        "type": "bubble",
        "size": "giga",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "MY LIST",
              "weight": "bold",
              "color": "#1DB446",
              "size": "sm"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "削除",
                      "action": {
                        "type": "postback",
                        "label": "delete",
                        "data": "hello"
                      },
                      "size": "xs",
                      "color": "#1a0dab",
                      "align": "start"
                    }
                  ],
                  "width": "32px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Sample",
                      "size": "sm",
                      "color": "#111111"
                    }
                  ],
                  "width": "180px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "2024/04/30",
                      "size": "xs",
                      "color": "#111111",
                      "align": "end"
                    }
                  ],
                  "width": "80px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "確認",
                      "action": {
                        "type": "message",
                        "label": "確認",
                        "text": "確認"
                      },
                      "size": "sm",
                      "color": "#1a0dab",
                      "align": "end"
                    }
                  ],
                  "width": "40px"
                }
              ]
            }
          ],
          "paddingTop": "none",
          "spacing": "lg"
        },
        "styles": {
          "footer": {
            "separator": true
          }
        }
      }
      console.log(bubble.body.contents)
      this._myList.forEach((list) => {
        bubble.body.contents.push(
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "削除",
                    "action": {
                      "type": "postback",
                      "label": "delete",
                      "data": JSON.stringify({action: 'delete', id: list.id, word: list.word})
                    },
                    "size": "xs",
                    "color": "#1a0dab",
                    "align": "start"
                  }
                ],
                "width": "32px"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": list.word,
                    "size": "sm",
                    "color": "#111111"
                  }
                ],
                "width": "180px"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": new Date(list.created_at).toLocaleDateString('ja-JP'),
                    "size": "xs",
                    "color": "#111111",
                    "align": "end"
                  }
                ],
                "width": "80px"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "確認",
                    "action": {
                      "type": "message",
                      "label": "確認",
                      "text": list.word
                    },
                    "size": "sm",
                    "color": "#1a0dab",
                    "align": "end"
                  }
                ],
                "width": "40px"
              }
            ]
          }
        )
      });
      bubble.body.contents.shift()
      return [
        {
          "type": "flex",
          "altText": "MY LISTを表示",
          "contents": bubble  
        }
      ]
    } else {
      return [
        {
          "type": "text",
          "text": "まだ単語の登録がありません"
        }
      ]  
    }
  }

  async statistics(supabaseClient) {
    let { data, error } = await supabaseClient
      .from('view_word_statistics')
      .select('word,user_count')
      .limit(20)
      .order('user_count', { ascending: false })
      .order('latest_date', { ascending: false })
    if (error) console.log({caused: "Word.statistics", error})
    console.log(data)
    this._statistics = data;
  }

  statisticsMessages() {
    if (this._statistics.length > 0) {
      const bubble = {
        "type": "bubble",
        "size": "giga",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "STATISTICS",
              "weight": "bold",
              "color": "#1DB446",
              "size": "sm"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Sample",
                      "size": "sm",
                      "color": "#111111"
                    }
                  ],
                  "width": "180px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "2024/04/30",
                      "size": "xs",
                      "color": "#111111",
                      "align": "end"
                    }
                  ],
                  "width": "80px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "確認",
                      "action": {
                        "type": "message",
                        "label": "確認",
                        "text": "確認"
                      },
                      "size": "sm",
                      "color": "#1a0dab",
                      "align": "end"
                    }
                  ],
                  "width": "40px"
                }
              ]
            }
          ],
          "paddingTop": "none",
          "spacing": "lg"
        },
        "styles": {
          "footer": {
            "separator": true
          }
        }
      }
      console.log(bubble.body.contents)
      let i = 0;
      this._statistics.forEach((list) => {
        i++;
        bubble.body.contents.push(
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": i.toString() + '. ' + list.word,
                    "size": "sm",
                    "color": "#111111"
                  }
                ],
                "width": "180px"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": list.user_count + '人',
                    "size": "xs",
                    "color": "#111111",
                    "align": "end"
                  }
                ],
                "width": "80px"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "確認",
                    "action": {
                      "type": "message",
                      "label": "確認",
                      "text": list.word
                    },
                    "size": "sm",
                    "color": "#1a0dab",
                    "align": "end"
                  }
                ],
                "width": "40px"
              }
            ]
          }
        )
      });
      bubble.body.contents.shift()
      return [
        {
          "type": "flex",
          "altText": "STATISTICSを表示",
          "contents": bubble  
        }
      ]
    } else {
      return [
        {
          "type": "text",
          "text": "まだ単語の登録がありません"
        }
      ]  
    }
  }

  async shuffle(supabaseClient) {
    let { data, error } = await supabaseClient
      .from('view_word')
      .select('id')
      .eq('userid', this._userid)
      .is('deleted_at', null)
    if (error) console.log({caused: "Word.shuffle", error});
    if (data.length === 0) {
      console.log('here')
      this._shuffle_id = 0
      return
    }
    // console.log(data);

    ({ data, error } = await supabaseClient
      .from('shuffle')
      .insert({ userid: this._userid, words: data, words_rest: data })
      .select('id'))
    if(error) console.log({caused: "Word.shuffle", error});
    // console.log(data)
    this._shuffle_id = data[0].id;
  }

  async shuffleId(id) {
    this._shuffle_id = id;
  }

  async shuffleRandom(supabaseClient) {
    let { data, error } = await supabaseClient
      .from('shuffle')
      .select('id,words,words_rest')
      .eq('id', this._shuffle_id)
    if (error) console.log({caused: "Word.shuffleRandom", error});

    if (data.length === 0) {
      this._shuffle = []
      return
    }

    let words = data[0].words;
    let words_rest = data[0].words_rest;
    // random
    const randomIndex: number = Math.floor(Math.random() * words_rest.length);
    // console.log(words_rest[randomIndex])
    let word_id = words_rest[randomIndex].id;
    words_rest.splice(randomIndex, 1);
    // console.log(words_rest);

    // data for message
    ({ data, error } = await supabaseClient
      .from('view_word')
      .select('word,meaning')
      .eq('userid', this._userid)
      .eq('id', word_id))
    if (error) console.log({caused: "Word.shuffleRandom", error})

    this._shuffle = {
      "shuffle_id": words_rest.length === 0 ? 0 : this._shuffle_id,
      "counts": words.length,
      "count": words.length - words_rest.length,
      "word": data[0].word,
      "meaning": data[0].meaning
    }

    // update
    let updateTime = new Date();
    ({ data, error } = await supabaseClient
      .from('shuffle')
      .update({ words_rest: words_rest, updated_at: updateTime })
      .eq('id', this._shuffle_id))
    if (error) console.log({caused: "Word.shuffleRandom", error});
  }

  shuffleMessages() {
    if (this._shuffle.length === 0) {
      return [
        {
          "type": "text",
          "text": "まだ単語の登録がありません"
        }
      ]
    }
    const carousel = {
      "type": "carousel",
      "contents": [
        {
          "type": "bubble",
          "size": "giga",
          "header": {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "SHUFFLE",
                "weight": "bold",
                "color": "#1DB446",
                "size": "sm"
              },
              {
                "type": "text",
                "text": this._shuffle.count.toString() + "/" + this._shuffle.counts.toString(),
                "size": "xxs",
                "align": "end",
                "gravity": "bottom"
              }
            ]
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": this._shuffle.word,
                "weight": "bold",
                "size": "xl",
                "align": "center"
              }
            ],
            "paddingTop": "none"
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "次の単語",
                  "data": JSON.stringify({action: 'shuffle', id: this._shuffle.shuffle_id})
                }
              }
            ]
          }
        },
        {
          "type": "bubble",
          "size": "giga",
          "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "意味",
                "weight": "bold",
                "size": "md",
                "wrap": true
              },
              {
                "type": "separator"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": this._shuffle.meaning,
                    "wrap": true
                  }
                ],
                "paddingStart": "48px"
              }
            ]
          }
        }
      ]
    }
    console.log(this._shuffle)
    return [
      {
        "type": "flex",
        "altText": "SHUFFLEを表示",
        "contents": carousel  
      }
    ]
  }

  async hallucination(supabaseClient) {
    const { error } = await supabaseClient
      .from('hallucination')
      .insert({ userid: this._userid, word: this._word })
    if(error) console.log({caused: "Word.hallucination", error})
  }

  hallucinationMessages() {
    return [
      {
        "type": "text",
        "text": `報告ありがとうございました。${this._word}の回答を確認します。`
      }
    ]
  }
}
