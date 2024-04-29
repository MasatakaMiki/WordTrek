export class Word {
  _userid = "";
  _word = "";
  _personCount = 0
  _count = 0;
  _lastDate = new Date();
  _meaning = ""
  _errorrMessages = [];
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
      .eq('userid', this._userid)
      .eq('word', this._word)
    if (error) console.log({caused: "Word.constructor", error})
    console.log(data)
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
    if (this._count > 1) {
      return [
        {
          "type": "text",
          "text": `${this._meaning}`
        },
        {
          "type": "text",
          "text": `${this._word}を調べたのは${this._count}回目です。最後に調べたのは${this._lastDate.toLocaleDateString('ja-JP')}です\n${this._word}は、あなたの他に${this._personCount}人が調べています`
        }
      ]  
    } else {
      return [
        {
          "type": "text",
          "text": `${this._meaning}`
        },
        {
          "type": "text",
          "text": `${this._word}を登録しました\n${this._word}は、あなたの他に${this._personCount}人が調べています`
        }
      ]  
    }
  }
}
