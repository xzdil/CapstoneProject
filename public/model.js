
function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

const natural = await require('natural')
async function testModel() {

    let input = document.getElementById("input");
    console.log(input.value)

    const response = await fetch('tfjs/vocab.json');
    const vocab = await response.json();
    const tokenizer = new natural.WordTokenizer();
    const vectorizer = new natural.CountVectorizer({vocabulary: vocab});

    const tokens = tokenizer.tokenize(input.value);
    const vector = vectorizer.transform(tokens);

    console.log('Test')
    const model = await tf.loadLayerModel('/tfjs/model.json');

    document.getElementById('predictions').innerHTML = vector
    const pred = model.predict(vector)

    const classes = ["Sadness", "Joy", "Love", "Anger", "Fear","Surprise"]

    const predict = argMax(pred.arraySync()[0])


    document.getElementById('logits').innerHTML = pred.arraySync()[0]

}

document.querySelector(".buttonn").addEventListener("click", async ()=>{
    console.log('Hui activated')
    await testModel()
})

async function change(){

}
