fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true") 

.then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
// pull data from api
for (i =0; i <5; i++) {
  let cryptoImg = data[i].image;
  let cryptoName = data[i].name;
  let cryptoTicker = data[i].symbol;
  let cryptoCurrentPrice = data[i].current_price;
console.log(cryptoName)
//  create html elements and adding classes
  let columnElm = $("<div>").addClass("column")
  let cardElm = $("<div>").addClass("card card-height");
  let cardContentElm = $("<div>").addClass("card-content");
  let mediaElm = $("<div>").addClass("media");
  let mediaLeftElm = $("<div>").addClass("media-left");
  let figureElm = $("<figure>").addClass("image is-48x48");
  let imageElm = $("<img>").attr("src", cryptoImg)
  let mediaContentElm = $("<div>").addClass("media-content");
  let titleElm = $("<p>").addClass("title is-4");
  let subtitleElm = $("<p>").addClass("subtitle is-6");
  let priceElm = $("<div>").addClass("content pricing");
// Putting Values where they go
titleElm.html(cryptoTicker.toUpperCase())
subtitleElm.html(cryptoName)
priceElm.html("$" + cryptoCurrentPrice.toLocaleString())
// packaging everything and putting on page
columnElm.append(cardElm)
cardElm.append(cardContentElm, priceElm)
cardContentElm.append(mediaElm)
figureElm.append(imageElm)
mediaLeftElm.append(figureElm)
mediaElm.append(mediaLeftElm, mediaContentElm)
mediaContentElm.append(titleElm, subtitleElm)
$("#topFiveCoins").append(columnElm)
}
})
// Currency Calculator

// fetch("https:v6.exchangerate-api.com/v6/5cfa0f1ac92d863d75e87104/latest/USD")
// .then(function(response) {
//   return response.json();
// })
// .then(function(data) {
//   console.log(data);
  
// let currencyName = data[i].

// currencyCalculator(#Calculator);
// currencyCalculator(#Calculator, {
