import conditions from './conditions.js';

const apiKey = '6ce58182be1b44b9b3e144338240106';


/* елементи на сторінці */

const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard(){
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage){
    //відображаємо карточку з помилкою
    const html = `<div class="card">${errorMessage}</div>`

    header.insertAdjacentHTML('afterend', html)
}

function showCard(name, country, temp, condition, imgPath){
    //розмітка для карточки
const html = `
<div class="card">
    <h2 class="card-city">${name} <span>${country}</span></h2>

    <div class="card-weather">
        <div class="card-value">${temp}<sup>°c</sup></div>
        <img class="card-img" src="${imgPath}" alt="Weather">
    </div>

    <div class="card-desc">${condition}</div>
</div>`

//відображаємо карточку на сторінці
header.insertAdjacentHTML('afterend', html)
}

async function getWeather(city){
    //робимо запит на сервер для даних прогнозу погоди
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}



/* Слухаємо відправку форми */

form.onsubmit = async function (e){

    //відміняємо відправку форми, щоб сторінка не обновлювалась
    e.preventDefault(); 

    //trim - обрізаємо пробіли якщо вони є
    let city = input.value.trim();  

    const data = await getWeather(city);

if (data.error){
    //якщо є помилка - виводимо її
    removeCard();
    showError(data.error.message);

}else { 
    //якщо нема тот виводимо карточку 
    removeCard();

    const info = conditions.find((obj) =>  obj.code === data.current.condition.code);
    console.log(info);
    console.log(info.languages[32]['day_text']);

    const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';
    const fileName = (data.current.is_day ? info.day : info.night) + '.png' ;
    const imgPath = filePath + fileName;
    // console.log('filePath', filePath + fileName);

    
    showCard(
        data.location.name,
        data.location.country,
        data.current.temp_c,
        data.current.is_day ? info.languages[32]['day_text'] : info.languages[32]['night_text'],
        imgPath,
        );
        
}
}
