$(document).ready(function() {
    i = 1;
    data = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem(localStorage.key(i)))));
    for (let i = 0; i < 55; i++) {

        newDiv = document.createElement("tr");
        $("body").append(newDiv);
        Image = $("img").attr(data[i].image);
        Name = $("<td></td>").text(data[i].name);
        Price = $("<td></td>").text("\u0024" + data[i].current_price);
        Price_7d = $("<td></td>").text(data[i].price_change_percentage_7h);
        Price_24d = $("<td></td>").text(data[i].price_change_percentage_24h);
        Market_Cap = $("<td></td>").text("\u0024" + data[i].market_cap);
        Volume_24h = $("<td></td>").text("\u0024" + data[i].price_change_24h);
        Circulating_Supply = $("<td></td>").text(data[i].circulating_supply);
        Last_7_day = $("<canvas id =" + data[i].name + "></canvas>");

        $(newDiv).append(Name, Name);
        $(newDiv).append(Price, Price);
        $(newDiv).append(Price_7d, Price_7d);
        $(newDiv).append(Price_24d, Price_24d);
        $(newDiv).append(Market_Cap, Market_Cap);
        $(newDiv).append(Volume_24h, Volume_24h);
        $(newDiv).append(Circulating_Supply, Circulating_Supply);
        $(newDiv).append(Last_7_day, Last_7_day);
    };
});