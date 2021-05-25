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




// let topFiveCoins = document.getElementById("topFiveCoins");
// let fiveCoins = data;

//   let iconArray = [];

//   // dynamically created elements 
//   let column = document.createElement("column");
  
//   // let header = document.createElement("h1");
//   let nameEl = document.createElement("p");
//   let symbolEl = document.createElement("p");
//   let current_priceEl = document.createElement("p");
//   let imageEL = document.createElement("img");


//    for (i = 0; i < 5; i++) {
//       iconArray.push(fiveCoins[i].image[0].image);
//   }

  

//       // topFiveCoins.appendChild(header);
//       topFiveCoins.appendChild(column);

      
//       for (i = 0; i < 5; i++) {
//           // dynamic HTML elements
//           let card = document.createElement("div");
//           let cardContent = document.createElement("div");
//           // let cardHeader = document.createElement("p");
//           let iconSrc = `https://assets.coingecko.com/coins/images/${iconArray[i]}`;

    
//           // setting attributes for dynamic elements
//           // column.setAttribute("class", "box is-flex is-flex-direction-row is-justify-content-center ");
//           card.setAttribute("class", "card");
//           // cardHeader.setAttribute("class", "card-header-title");
//           cardContent.setAttribute("class", "card-content");
//           imageEL.setAttribute("src", iconSrc);
          
//           // setting text content for dynamic elements using the API data and moment.js variables defined above
//           nameEl.textContent = `${fiveCoins[i].name}`;
//           symbolEl.textContent = `${fiveCoins[i].symbol}`;
//           current_priceEl.textContent = `$${fiveCoins[i].current_price}`;
//           imageEl.image= `${fiveCoins[i].image}`;
// console.log(fiveCoins)
//           // appending elements to the appropriate containers to display the results on the screen
//           // card.appendChild(cardHeader);
//           // cardHeader.append( imageEL.cloneNode(true));
//           card.appendChild(cardContent);
//           cardContent.appendChild(nameEl.cloneNode(true));
//           cardContent.appendChild(symbolEl.cloneNode(true));
//           cardContent.appendChild(current_priceEl.cloneNode(true));
//           // cardContent.appendChild(imageEl.cloneNode(true));
//           column.appendChild(card);
//           imageEL.setAttribute("src", iconSrc);
//         }


})
