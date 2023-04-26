

function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}



function getIndices(text, dictionary) {
    text = text.toLowerCase()
    text = text.replace(/[!"#$%&()*+,-/:;<=>?@\[\\\]^_`{|}~'\t\n]/g,'')
    console.log(text)
    const tokens = text.split(' ');
    const indices = [];
    tokens.forEach(token => {
        if (dictionary.includes(token)) {
            indices.push(dictionary.indexOf(token));
        }
        else {
            console.log(token + ' is not found')
        }
    });
    for(let i = 0; i<33; i++){
        if(indices.length<33){
            indices.push(0);
        }
    }
    return indices;
}


async function getPredict(){
    const response = await fetch('http://localhost:5000/tfjs/vocab.json');
    const vocab = await response.json();
    const classes = ["Sadness", "Joy", "Love", "Anger", "Fear", "Surprise"]

    const response2 = await fetch('http://localhost:5000/tfjs_capstoneV2/vocabV2.json');
    const vocab2 = await response2.json();


    let input = document.getElementById("input");
    const vector = getIndices(input.value,vocab)

    const vector2 = getIndices(input.value,vocab2)

    console.log(vector)
    console.log(vocab[915])
    console.log("vectorized!")

    const tensor = tf.tensor1d(vector)
    const sentence = tf.reshape(tensor, [-1, 1])
    const flat_tensor = tf.transpose(sentence, [1, 0])


    const model = await tf.loadLayersModel('http://localhost:5000/tfjs/model.json');
    const model2 = await tf.loadLayersModel('http://localhost:5000/tfjs_capstoneV2/model.json');


    const prd = await model.predict(flat_tensor)
    const predict = argMax(prd.arraySync()[0]);
    const myPred = document.getElementById("predictions")
    myPred.innerHTML = classes[predict]
    const pred = prd.arraySync();

    const sad = document.getElementById("sad")
    sad.innerHTML   = Number(
        (pred[0][0]*100).toFixed(2));
    const joy = document.getElementById("joy")
    joy.innerHTML   = Number(
        (pred[0][1]*100).toFixed(2));
    const love = document.getElementById("love")
    love.innerHTML  = Number(
        (pred[0][2]*100).toFixed(2));
    const anger = document.getElementById("anger")
    anger.innerHTML = Number(
        (pred[0][3]*100).toFixed(2));
    const fear = document.getElementById("fear")
    fear.innerHTML  = Number(
        (pred[0][4]*100).toFixed(2));
    const surp = document.getElementById("surp")
    surp.innerHTML  = Number(
        (pred[0][5]*100).toFixed(2));
    console.log(classes[predict])
}

async function predict(text){

    const classes = ["Sadness", "Joy", "Love", "Anger", "Fear", "Surprise"]
    const response = await fetch('http://localhost:5000/tfjs/vocab.json');
    const vocab1 = await response.json();
    const vector1 = getIndices(text, vocab1)

    const tensor = tf.tensor1d(vector1)
    const sentence = tf.reshape(tensor, [-1, 1])
    const flat_tensor = tf.transpose(sentence, [1, 0])

    const model = await tf.loadLayersModel('http://localhost:5000/tfjs/model.json');
    return model.predict(flat_tensor)
}

function getAverageColumns(arr) {
    const result = [];

    // Проходим по каждой колонке в исходном массиве
    for (let j = 0; j < arr[0].length; j++) {
        let sum = 0;

        // Суммируем все элементы в текущей колонке
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i][j];
        }

        // Вычисляем среднее значение текущей колонки и добавляем его в результат
        const average = sum / arr.length;
        result.push(average);
    }

    return result;
}

function getSentences(text){
    text = input.value.toLowerCase()
    console.log(text)
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    console.log(sentences)

    const array = []
    sentences.forEach(sentence => {
        array.push(predict(sentence))
})
    console.log(array)
    console.log(getAverageColumns(array).array())   
}