// export function dateFormat(date:Date) {
//     const yyyy = String(date.getFullYear());
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const dd = String(date.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`
// }

// export function shuffle(array) {
//     let currentIndex = array.length, temporaryValue, randomIndex;

//     while (0 !== currentIndex) {
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;

//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }

//     return array;
// }

// export const fetchRandom10QuizIds = async(supabaseClient) => {
//     const { data, error } = await supabaseClient.from('quiz').select('body,answer')
//     return shuffle(data).slice(0, 10)
// }
