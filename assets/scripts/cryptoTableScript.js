//open dropdown fiat selection when user clicks
var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

//create a variable to hold a user's base fiat currency selection
var fiatSelection = JSON.parse(localStorage.getItem("baseFiat")) || "USD";

//create an array to store responses from API calls
var cryptoListArr = [];
var cryptoInfoArr = [];
var exchangeRateArr = [];

function getCryptocurrencyList(){
    //get api URL (will need to adjust currency=X to match base selected by user)
    var apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"

    fetch(apiURL).then(function(response){
        if(response.ok){
            return response.json();
        }
        else{
            return Promise.reject(response);
        }
    }).then(function(data){
        cryptoListArr = data;
        console.log(cryptoListArr);
        getCryptocurrencyData();
    }).catch(function(error){
        console.warn(error);
    });
};

async function getCryptocurrencyData(){

    for (var i=0; i < cryptoListArr.length; i ++){
        var apiURL = "https://api.coingecko.com/api/v3/coins/" + cryptoListArr[i].id + "?market_data=true";
        await fetch(apiURL).then(function(response){
            if(response.ok){
                response.json().then(function(data){
                    //console.log(data);
                    cryptoInfoArr.push({
                        image: data.image.large,
                        coin: data.name,
                        ticker: data.symbol.toUpperCase(),
                        usdPrice: data.market_data.current_price["usd"],
                        eurPrice: data.market_data.current_price["eur"],
                        cnyPrice: data.market_data.current_price["cny"],
                        krwPrice: data.market_data.current_price["krw"],
                        jpyPrice: data.market_data.current_price["jpy"],
                        cadPrice: data.market_data.current_price["cad"],
                        gbpPrice: data.market_data.current_price["gbp"],
                        rubPrice: data.market_data.current_price["rub"]
                    });
                });
                console.log(cryptoInfoArr);
            }
            else{
                return Promise.reject(response);
            }

        });
    }
    getFiatExchangeInfo(fiatSelection);
};

async function getFiatExchangeInfo(baseFiat){

    var apiURL = "https://v6.exchangerate-api.com/v6/d39488d42ff5b6cc753183cf/latest/" + baseFiat;

    await fetch(apiURL).then(function(response){
        if(response.ok){
          response.json().then(function(data){
            console.log(data);
            //search for table exchange rates
            var usdConversion = data.conversion_rates["USD"];
            var eurConversion = data.conversion_rates["EUR"];
            var cnyConversion = data.conversion_rates["CNY"];
            var krwConversion = data.conversion_rates["KRW"];
            var jpyConversion = data.conversion_rates["JPY"];
            var cadConversion = data.conversion_rates["CAD"];
            var gbpConversion = data.conversion_rates["GBP"];
            var rubConversion = data.conversion_rates["RUB"];

            exchangeRateArr.push(usdConversion, eurConversion, cnyConversion, krwConversion, jpyConversion, cadConversion, gbpConversion, rubConversion);
            console.log(exchangeRateArr);
            performFiatCryptoConversions();
            });
        }
    });

};

function performFiatCryptoConversions(){

    for (var i =0; i < cryptoInfoArr.length; i ++){
        var priceToEur = cryptoInfoArr[i].eurPrice;
        var convertedEurToBase = (parseFloat(priceToEur, 5)) / (parseFloat(exchangeRateArr[1], 5));
        console.log(priceToEur);
        console.log(convertedEurToBase);
    }
}

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
      getCryptocurrencyList();
      //save fiat selection to local storage for page reload
    }
});

getCryptocurrencyList();