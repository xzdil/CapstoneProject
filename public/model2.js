

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
    console.log(classes[predict]+ " Predicted!")
}

async function predict(text){

    const classes = ["Sadness", "Joy", "Love", "Anger", "Fear", "Surprise"]
    const response = await fetch('http://localhost:5000/tfjs/vocab.json');
    const vocab1 = await response.json();
    const vector1 =  getIndices(text, vocab1)

    const tensor = tf.tensor1d(vector1)
    const sentence = tf.reshape(tensor, [-1, 1])
    const flat_tensor = tf.transpose(sentence, [1, 0])

    const model = await tf.loadLayersModel('http://localhost:5000/tfjs/model.json');
    console.log(await model.predict(flat_tensor)+"Predict")
    return model.predict(flat_tensor)

}

function concatenateTensors(arr) {
    const splitArr = arr.map(tensor => tensor.expandDims(0));
    const tensor = tf.concat(splitArr)
    arr = tensor.arraySync().map(innerArr => innerArr[0].map(val => Number((val).toFixed(2))));
    return arr
}

function getAverageColumns(arr) {
    const result = []
    const data = concatenateTensors(arr)
    console.log(data+ " Concated")

    // Проходим по каждой колонке в исходном массиве
    for (let j = 0; j < data[0].length; j++) {
        let sum = 0;

        // Суммируем все элементы в текущей колонке
        for (let i = 0; i < data.length; i++) {
            sum += data[i][j];
        }

        // Вычисляем среднее значение текущей колонки и добавляем его в результат
        const average = sum / data.length;

        result.push(average);
    }
    console.log(result)
    console.log("Result<")
    return result;
}

async function getSentences() {

    const obj = document.getElementById("table")
    const div = document.getElementById("sentences");
    if (obj.children.length > 0) {
        div.remove();
        console.log("Removed")
    }
    if (obj.children.length < 1) {
        let tbody = document.createElement('div');
        tbody.setAttribute('id', 'sentences');
        obj.appendChild(tbody)
        console.log("Added")
    }

    const classes = ["Sadness", "Joy", "Love", "Anger", "Fear", "Surprise"]
    const text = input.value.toLowerCase()
    console.log(text)
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    console.log(sentences)

    const array = []

    for (const sentence of sentences) {
        console.log("Predicting...")
        array.push(await predict(sentence))
    }
    const predictions = getAverageColumns(array)
    console.log(predictions+" getavercol")
    const prd = argMax(predictions)
    console.log(array + " Got predictions array")

    const concated = concatenateTensors(array)
    const table = document.getElementById("sentences")
    let th = document.createElement('th');

    th.appendChild(document.createTextNode("Id "));
    table.appendChild(th)

    for(let l of classes){
        th = document.createElement('th');
        th.appendChild(document.createTextNode(l+" "));
        table.appendChild(th)
    }
    th = document.createElement('th');
    th.appendChild(document.createTextNode("Prediction "));
    table.appendChild(th)

    concated.forEach(function(i,index) {
        const row = document.createElement('tr');
        row.appendChild(document.createTextNode(index+1));
        i.forEach(function(j) {
            let cell1 = document.createElement('td');
            let cellText1 = document.createTextNode(Number((j*100).toFixed(2))+ "% ");
            cell1.appendChild(cellText1);
            row.appendChild(cell1);
        });
        const pred = argMax(i)
        let cell1 = document.createElement('td');
        let cellText1 = document.createTextNode(classes[pred]);
        cell1.appendChild(cellText1);
        row.appendChild(cell1);
        table.appendChild(row);
    });

    console.log("conc for each is working")
    const row = document.createElement('tr');
    row.appendChild(document.createTextNode("Total"));
        predictions.forEach(function(j) {

            const cell1 = document.createElement('td');
            const cellText1 = document.createTextNode(Number((j*100).toFixed(2)) + "% ");
            cell1.appendChild(cellText1);
            row.appendChild(cell1);
        });
        const cell1 = document.createElement('td');
        const cellText1 = document.createTextNode(classes[prd]);
        cell1.appendChild(cellText1);
        row.appendChild(cell1);
        table.appendChild(row);

}