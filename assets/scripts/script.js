//open dropdown fiat selection when user clicks
var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

//create a variable to hold a user's base fiat currency selection
var fiatSelection = JSON.parse(localStorage.getItem("baseFiat")) || "USD";

//create variables for crypto data
var cryptoArr = [];
var cryptoImg;
var cryptoName;
var cryptoTicker;
var crypto1D;
var crypto7D;
var cryptoCurrentPriceBase;
var cryptoCurrentPriceUSD;
var cryptoCurrentPriceEUR;
var cryptoCurrentPriceCNY;
var cryptoCurrentPriceKRW;
var cryptoCurrentPriceJPY;
var cryptoCurrentPriceCAD;
var cryptoCurrentPriceGBP;
var cryptoCurrentPriceRUB;
var dynamicDataTable;


function createPageElements(i){
  if(dynamicDataTable !=undefined)
  {
    dynamicDataTable.destroy();
  }
  //clear any html out so it doesn't duplicate rows
  $("#crypto-table-rows").empty();
    //create ticker items
    var tickerItemElem = $("<div>").addClass("ticker-item");
    var tickerLogoElem = $("<span>").html('<img src="' + cryptoImg +'" style="height: 15px; width: 15px;"/>')
    var tickerCryptTick = $("<span>").html(" " + cryptoTicker.toUpperCase());
    var tickerCryptPerf = $("<span>").html(" " + parseFloat(crypto1D.toLocaleString()).toFixed(2) + "%");
    //append ticker items to ticker tape
    tickerItemElem.append(tickerLogoElem);
    tickerItemElem.append(tickerCryptTick);
    tickerItemElem.append(tickerCryptPerf);

    $("#ticker-tape").append(tickerItemElem);

    //create table row
    var tableRowElem = $("<tr>");
    //create table data elements
    var tableFavElem = $("<td>").html('<i class="far fa-crown"></i>');
    var tableIDElem = $("<td>").html("<b>"+ (i+1) + "</b>");
    var tableCoinElem = $("<td>").html('<img src="' + cryptoImg +'" style="height: auto; width: 25px; float: left;"><span style="padding-left: 25px; font-size: .95em;"> <b>' + cryptoName +'</b></span>');
    var tableCoinTicker = $("<td>").html(cryptoTicker.toUpperCase());
    var tableCoinPriceBase = $("<td>").html("$" + cryptoCurrentPrice.toLocaleString());
    var tableCoinPriceEUR = $("<td>").html("150");
    var tableCoinPriceGBP = $("<td>").html("150");
    var tableCoinPriceJPY = $("<td>").html("150");
    var tableCoinPriceKRW = $("<td>").html("150");
    var tableCoin1D = $("<td>").html(parseFloat(crypto1D.toLocaleString()).toFixed(2) + "%");
    var tableCoin7D = $("<td>").html(parseFloat(crypto7D.toLocaleString()).toFixed(2) + "%");

    //append elements in the correct order
    tableRowElem.append(tableFavElem);
    tableRowElem.append(tableIDElem);
    tableRowElem.append(tableCoinElem);
    tableRowElem.append(tableCoinTicker);
    tableRowElem.append(tableCoinPriceBase);
    tableRowElem.append(tableCoinPriceEUR);
    tableRowElem.append(tableCoinPriceGBP);
    tableRowElem.append(tableCoinPriceJPY);
    tableRowElem.append(tableCoinPriceKRW);
    tableRowElem.append(tableCoin1D);
    tableRowElem.append(tableCoin7D);

    //get reference to crypto table section and append row
    $("#crypto-table-rows").append(tableRowElem);
  
}


async function getCryptocurrenciesTable(baseFiat){
  //get api URL (will need to adjust currency=X to match base selected by user)
  var apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + baseFiat + "&order=market_cap_desc&per_page=150&page=1&sparkline=true&price_change_percentage=24h%2C7d%2C30d%2C1y"

  //make request to URL
  fetch(apiURL).then(function(response){
    console.log(response);
    if(response.ok){
      response.json().then(function(data){
        console.log(data);
        cryptoArr = data;
        for(var i = 0; i < data.length; i++)
        {
          //grab cryptocurrency information
           cryptoImg = data[i].image;
           cryptoName = data[i].name;
           cryptoTicker = data[i].symbol;
           cryptoCurrentPrice = data[i].current_price;
           crypto1D = data[i].price_change_percentage_24h_in_currency;
           crypto7D = data[i].price_change_percentage_7d_in_currency;

          var coinToFiatURL = "https://api.coingecko.com/api/v3/coins/" + data[i].id +"?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false"
          
          fiatCoinInfo = fetch(coinToFiatURL).then(function(response){
            console.log(fiatCoinInfo);
          });

           createPageElements(i);
        }
        dynamicDataTable = $("#crypto-table").DataTable();
      });

    }
    else
    {
      console.log("oops");
    }
  });

};



function getCurrencyExchangeData(baseFiat){

  apiURL = "https://v6.exchangerate-api.com/v6/d39488d42ff5b6cc753183cf/latest/" + baseFiat;

  fetch(apiURL).then(function(response){
    console.log(response);
    if(response.ok){
      response.json().then(function(data){
        console.log(data);
        //search for table exchange rates
        var eurConversion = data.conversion_rates["EUR"];
        var gbpConversion = data.conversion_rates["GBP"];
        var jpyConversion = data.conversion_rates["JPY"];
        var krwConversion = data.conversion_rates["KRW"];
        console.log(eurConversion);
        console.log(gbpConversion);
        console.log(jpyConversion);
        console.log(krwConversion);        
      });
    }
  });
};


function getCryptocurrencyPricesInFiat(){
  var currencyArray = ["eur"];

  for (i = 0; i < currencyArray.length; i++){
    //get api URL (will need to adjust currency=X to match base selected by user)
    var apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + currencyArray[i] + "&order=market_cap_desc&per_page=150&page=1&sparkline=true&price_change_percentage=24h%2C7d%2C30d%2C1y"
    
    var changeSlot = currencyArray[i];

    fetch(apiURL).then(function(response){
      console.log(response);
      if(response.ok){
        response.json().then(function(data){
          console.log(data);
            for(x = 0; x < data.length; x ++){
              console.log(data[x].current_price);
              updatePriceTable(changeSlot, data[x].current_price);
            }
        });
      }
    });
  }

  // performTableFiatConversions(eurCryptoPrice, gbpCryptoPrice, jpyCryptoPrice, krwCryptoPrice);
};

function updatePriceTable(identifier, price){
  console.log(identifier);
  console.log(price);

    var updatePriceTableItem = $(".table-price-item[data-" + identifier + "-id=" + i + "]");
    console.log(updatePriceTableItem);
    updatePriceTableItem.html(price);
}


function performTableFiatConversions(base, euro, gbp, yen, won){


};

//Get user fiat selection
$("#dropdown-menu").on("click", function(event){
  event.preventDefault();
  console.log("fired");
  fiatSelection = event.target.getAttribute("data-fiat");
  
  if(fiatSelection != null)
  {
    console.log(fiatSelection);
    $("#base-fiat-select").text("");
    $("#base-fiat-select").html(fiatSelection.toUpperCase() + ' <i class="fas fa-caret-down"></i>');
    //pass fiat selection to the currency exchange api
    // getCurrencyExchangeData(fiatSelection);
    getCryptocurrenciesTable(fiatSelection);
    //save fiat selection to local storage for page reload
  }

});

getCryptocurrenciesTable(fiatSelection);
