//open dropdown fiat selection when user clicks
$(".dropdown").on('click', function(event) {
  //event.stopPropagation();
  $(".dropdown").toggleClass('is-active');
});

//create a variable to hold a user's base fiat currency selection
var fiatSelection = JSON.parse(localStorage.getItem("baseFiat")) || "usd";

//create an array to store responses from API calls
var cryptoListArr = [];
var cryptoInfoArr = [];
var exchangeRateArr = [];
//currency symbol information
var currencySymbol = "&#36;";
//table info
var dynamicDataTable;

//get a list of the top 50 cryptocurrencies and then pass that information to getCryptocurrencyData which is a different api call that contains coin to fiat exchange rates for each coin
function getCryptocurrencyList(baseFiat){
    //clear any html and arrays out to prevent duplicate data
    cryptoListArr = [];
    cryptoInfoArr = [];
    exchangeRateArr = [];
    if(dynamicDataTable !== undefined)
    {
      dynamicDataTable.destroy();
    }
    $("#crypto-table-rows").empty();

    //add loading spinner while table data loads
    var loader = $("<img>").attr("src", "./assets/images/bitcoin-spinning.gif").addClass("loading-image");
    var loaderRow = $("<td>").attr({colspan: "5.5", height: "256px"});
    loaderRow.append(loader);
    $("#crypto-table-rows").append(loaderRow);

    //get api URL (uses user selected base currency)
    var apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + baseFiat + "&order=market_cap_desc&per_page=50&page=1&sparkline=false"

    fetch(apiURL).then(function(response){
            if(response.ok){
                return response.json();
            }
            else{
                return Promise.reject(response);
            }
        }).then(function(data){
            cryptoListArr = data;
            buildTickerItems();
            getCryptocurrencyData();
        }).catch(function(error){
            //catch error if something goes wrong with api
            console.warn(error);
        });
};

//Add ticker tape items to page
function buildTickerItems(){
    $("#ticker-tape").empty();
    for(i = 0; i < cryptoListArr.length; i ++){
        //create ticker items
        var tickerItemElem = $("<div>").addClass("ticker-item");
        var tickerLogoElem = $("<span>").html('<img src="' + cryptoListArr[i].image +'" style="height: 15px; width: 15px;"/>')
        var tickerCryptTick = $("<span>").html(" " + (cryptoListArr[i].symbol).toUpperCase());
        var tickerCryptPerf = $("<span>").html(" " + parseFloat(cryptoListArr[i].market_cap_change_percentage_24h).toFixed(2) + "%");
        
        //color the perfomance numbers appropriately
        colorPerformanceTickerItems(tickerCryptPerf);

        //append ticker items to ticker tape
        tickerItemElem.append(tickerLogoElem);
        tickerItemElem.append(tickerCryptTick);
        tickerItemElem.append(tickerCryptPerf);
        //append ticker tape to DOM
        $("#ticker-tape").append(tickerItemElem);
    }
};

//Get crypto currency data - this is async so it doesn't start building table rows before all information is gathered. If we don't do this - it might still work, but often there are missed coins or the table doesn't fill
async function getCryptocurrencyData(){

    for (var i=0; i < cryptoListArr.length; i ++){
        var apiURL = "https://api.coingecko.com/api/v3/coins/" + cryptoListArr[i].id + "?market_data=true";
        await fetch(apiURL).then(function(response){
            if(response.ok){
                response.json().then(function(data){
                    //create a new object containing desired cryptocurrency information and push it to the cryptoInfo array
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
                        rubPrice: data.market_data.current_price["rub"],
                        one_day_change: data.market_data.price_change_percentage_24h,
                        week_change: data.market_data.price_change_percentage_7d,
                        eurProfit: "",
                        gbpProfit: "",
                        jpyProfit: "",
                        krwProfit: ""
                    });
                });
            }
            else{
                return Promise.reject(response);
            }

        }).catch(function(error){
            console.warn(error);
        });
    }
    getFiatExchangeInfo(fiatSelection);
};

//Get current exchange rates for the selected base currency to other currencies
function getFiatExchangeInfo(baseFiat){

    var apiURL = "https://v6.exchangerate-api.com/v6/d39488d42ff5b6cc753183cf/latest/" + baseFiat;

    fetch(apiURL).then(function(response){
        if(response.ok){
          response.json().then(function(data){
            //grab exchange rates from API to be used in table
            var usdConversion = data.conversion_rates["USD"];
            var eurConversion = data.conversion_rates["EUR"];
            var cnyConversion = data.conversion_rates["CNY"];
            var krwConversion = data.conversion_rates["KRW"];
            var jpyConversion = data.conversion_rates["JPY"];
            var cadConversion = data.conversion_rates["CAD"];
            var gbpConversion = data.conversion_rates["GBP"];
            var rubConversion = data.conversion_rates["RUB"];

            //push conversion rates to exchange rate array
            exchangeRateArr.push(usdConversion, eurConversion, cnyConversion, krwConversion, jpyConversion, cadConversion, gbpConversion, rubConversion);
            performFiatCryptoConversions();
            });
        }
    });

};

//Convert prices to base currency and indicate arbitrage opportunity
function performFiatCryptoConversions(){
    for (var i =0; i < cryptoInfoArr.length; i ++){
        var baseIndexVal = fiatSelection.toLowerCase() + "Price"
        var basePrice = cryptoInfoArr[i][baseIndexVal];

        var priceToEur = cryptoInfoArr[i].eurPrice;
        var convertedEurToBase = (parseFloat(priceToEur)) / (parseFloat(exchangeRateArr[1]));
        var potentialProfitEur = convertedEurToBase - basePrice;
        cryptoInfoArr[i]["eurProfit"] = parseFloat(potentialProfitEur).toFixed(5);

        var priceToGBP = cryptoInfoArr[i].gbpPrice;
        var convertedGBPToBase = (parseFloat(priceToGBP)) / (parseFloat(exchangeRateArr[6]));
        var potentialProfitGBP = convertedGBPToBase - basePrice;
        cryptoInfoArr[i]["gbpProfit"] = parseFloat(potentialProfitGBP).toFixed(5);

        var priceToJPY = cryptoInfoArr[i].jpyPrice;
        var convertedJPYToBase = (parseFloat(priceToJPY)) / (parseFloat(exchangeRateArr[4]));
        var potentialProfitJPY = convertedJPYToBase - basePrice;
        cryptoInfoArr[i]["jpyProfit"] = parseFloat(potentialProfitJPY).toFixed(5);

        var priceToKRW = cryptoInfoArr[i].krwPrice;
        var convertedKRWToBase = (parseFloat(priceToKRW)) / (parseFloat(exchangeRateArr[3]));
        var potentialProfitKRW = convertedKRWToBase - basePrice;
        cryptoInfoArr[i]["krwProfit"] = parseFloat(potentialProfitKRW).toFixed(5);

        //use regex to add commas in appropriate places (source:https://www.delftstack.com/howto/javascript/javascript-add-commas-to-number/ )
        var bpString = basePrice.toString().split(".");
        bpString[0] = bpString[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        basePrice = bpString.join(".");

        //Build the table rows
        buildTableData(i, basePrice);
    }
    //use DataTable plug-in to create a DataTable (pagination, sorting, and search capabilities in the table)
    dynamicDataTable = $("#crypto-table").DataTable();
};

//Choose the appropriate currency symbol based on user's base currency selection
function chooseCorrectCurrencySymbol(){
    if(fiatSelection == "usd" || fiatSelection == "cad"){
        currencySymbol = "&#36;"
    }
    else if(fiatSelection == "cny" || fiatSelection == "jpy"){
        currencySymbol = "&yen;"
    }
    else if(fiatSelection == "eur"){
        currencySymbol = "&euro;";
    }
    else if (fiatSelection == "krw"){
        currencySymbol = "&#8361;";
    }
    else if (fiatSelection == "gbp"){
        currencySymbol = "&#8356;";
    }
    else{
        currencySymbol = "&#8381;";
    }
}

//Begin to build out the table
function buildTableData(i, baseFiatPrice){
    //Choose the appropriate currency symbol based on user's selected base currency.
    chooseCorrectCurrencySymbol();
    //create table row
    var tableRowElem = $("<tr>");
    //create table data elements
    var tableFavElem = $("<td>").html('<i class="far fa-crown"></i>');
    var tableIDElem = $("<td>").html("<b>"+ (i+1) + "</b>");
    var tableCoinElem = $("<td>").html('<img src="' + cryptoInfoArr[i].image +'" style="height: auto; width: 25px; float: left;"><span style="padding-left: 25px; font-size: .95em;"> <b>' + cryptoInfoArr[i].coin +'</b></span>');
    var tableCoinTicker = $("<td>").html(cryptoInfoArr[i].ticker);
    var tableCoinPriceBase = $("<td>").html("<span>" + currencySymbol + " </span>" + baseFiatPrice);
    var tableCoinPriceEUR = $("<td>").html(currencySymbol + " " + cryptoInfoArr[i].eurProfit);
    var tableCoinPriceGBP = $("<td>").html(currencySymbol + " " + cryptoInfoArr[i].gbpProfit);
    var tableCoinPriceJPY = $("<td>").html(currencySymbol + " " + cryptoInfoArr[i].jpyProfit);
    var tableCoinPriceKRW = $("<td>").html(currencySymbol + " " + cryptoInfoArr[i].krwProfit);
    var tableCoin1D = $("<td>").html(parseFloat(cryptoInfoArr[i].one_day_change).toFixed(2) + "%").addClass("right-text-items");
    var tableCoin7D = $("<td>").html(parseFloat(cryptoInfoArr[i].week_change).toFixed(2) + "%").addClass("right-text-items");

    //color performance ticker and table elements text
    colorPerformanceTableItems(tableCoin1D, tableCoin7D);

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
};

//color the performance data green for positive or red for negative in the ticker
function colorPerformanceTickerItems(tickerOneDay){
    if((parseFloat(tickerOneDay.html())) >= 0){
        tickerOneDay.addClass("positive-performance");
        tickerOneDay.append($("<span>").html(" <img src='./assets/images/arrow-alt-up-solid.svg' height='15px' width='15px'/>"))
        tickerOneDay.removeClass("negative-performance");
    }
    else{
        tickerOneDay.removeClass("positive-performance");
        tickerOneDay.addClass("negative-performance");
        tickerOneDay.append($("<span>").html(" <img src='./assets/images/arrow-alt-down-solid.svg' height='15px' width='15px'/>"))
    }
};

//color the performance data green for positive or red for negative in the table
function colorPerformanceTableItems(tableCoin1DPerf, tableCoin7DPerf){
    if((parseFloat(tableCoin1DPerf.html())) >= 0){
        tableCoin1DPerf.addClass("positive-performance");
        tableCoin1DPerf.removeClass("negative-performance");
    }
    else{
        tableCoin1DPerf.removeClass("positive-performance");
        tableCoin1DPerf.addClass("negative-performance");
    }

    if((parseFloat(tableCoin7DPerf.html())) >= 0){
        tableCoin7DPerf.addClass("positive-performance");
        tableCoin7DPerf.removeClass("negative-performance");
    }
    else{
        tableCoin7DPerf.removeClass("positive-performance");
        tableCoin7DPerf.addClass("negative-performance");
    }
};

//Get user fiat selection
$("#dropdown-menu").on("click", function(event){
    event.preventDefault();
    fiatSelection = event.target.getAttribute("data-fiat");
    
    if(fiatSelection != null)
    {
      $("#base-fiat-select").text("");
      $("#base-fiat-select").html(fiatSelection.toUpperCase() + ' <i class="fas fa-caret-down"></i>');
      //pass fiat selection to cryptocurrency api to get crypto information in that base fiat currency
      getCryptocurrencyList(fiatSelection);
      //save fiat selection to local storage for page reload
      localStorage.setItem("baseFiat", JSON.stringify(fiatSelection));
    }
});

function loadLocalStorage(){
    $("#base-fiat-select").html(fiatSelection.toUpperCase() + ' <i class="fas fa-caret-down"></i>');
};

//load items from local storage on page load
loadLocalStorage();

//run the first table population on page load using the users stored currency from local storage or USD if nothing in local storage
getCryptocurrencyList(fiatSelection);

const toastMessage = "First time or new to crypto? Check out our education page: <a href='./getting-started.html' target='_blank'>here</a>";
//Show toast on page load to direct user to education resources if they are new to crypto or new to the application
bulmaToast.toast({
    duration: 60000,
    pauseOnHover: true,
    message: toastMessage,
    position: "bottom-right",
    type: "is-link",
    dismissible: true,
    color: "#00000",
});