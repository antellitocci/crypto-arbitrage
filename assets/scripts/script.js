var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

function getCryptocurrenciesTable(){

  //get api URL (will need to adjust currency=X to match base selected by user)
  var apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h%2C7d%2C30d%2C1y"

  //make request to URL
  fetch(apiURL).then(function(response){
    console.log(response);
    if(response.ok){
      response.json().then(function(data){
        console.log(data);
        for(var i = 0; i < data.length; i++)
        {
          //grab cryptocurrency information
          var cryptoImg = data[i].image;
          var cryptoName = data[i].name;
          var cryptoTicker = data[i].symbol;
          var cryptoCurrentPrice = data[i].current_price;
          console.log(cryptoCurrentPrice.toLocaleString());
          var cryptoEURPrice = "+ $150.00";
          var cryptoGBPPrice = "+ $20.04";
          var cryptoJPYPrice = "+ $10.25";
          var cryptoKRMPrice = "+ $0.04";
          var crypto1D = data[i].price_change_percentage_24h_in_currency;
          var crypto7D = data[i].price_change_percentage_7d_in_currency;
          var crypto30D = data[i].price_change_percentage_30d_in_currency;
          var crypto1Y = data[i].price_change_percentage_1y_in_currency;
          var cryptoChart = data[i].sparkline_in_7d;


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
          console.log(tableCoinPriceBase);
          var tableCoinPriceEUR = $("<td>").html(cryptoEURPrice);
          var tableCoinPriceGBP = $("<td>").html(cryptoGBPPrice);
          var tableCoinPriceJPY = $("<td>").html(cryptoJPYPrice);
          var tableCoinPriceKRW = $("<td>").html(cryptoKRMPrice);
          var tableCoin1D = $("<td>").html(parseFloat(crypto1D.toLocaleString()).toFixed(2) + "%");
          var tableCoin7D = $("<td>").html(parseFloat(crypto7D.toLocaleString()).toFixed(2) + "%");
          //var tableCoin30D = $("<td>").html(crypto30D.toFixed(2).toLocaleString());
          //var tableCoin1Y = $("<td>").html(crypto1Y.toFixed(2).toLocaleString());
          //var tableCoinChart = $("<td>").html(cryptoChart);

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
          //tableRowElem.append(tableCoin30D);
          //tableRowElem.append(tableCoin1Y);
          //tableRowElem.append(tableCoinChart);

          //get reference to crypto table section and append row
          $("#crypto-table").append(tableRowElem);

        }

      });
    }
    else
    {
      console.log("oops");
    }
  });

};

getCryptocurrenciesTable();