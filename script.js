
//api key and url
$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=san%20antonio&units=imperial&APPID=acbd999ab80a34836a984a4e8820c3cf",function(data){
console.log(data);
//image for weather icon
let icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"; 
console.log(icon);
let temp = Math.floor(data.main.temp);
let weather = data.weather[0].main;
//weather in sa ,wather in san antonio just for fun at top 
$(".icon").attr("src", icon);
$(".weather").append(weather);
$(".temp").append(temp);



}); 

//when clicked , searches weather 
$(document).ready(function() {
    $("#search-button").on("click", function() {
      let searchValue = $("#search-value").val();
  
      
      $("#search-value").val("");
  
      searchWeather(searchValue);
    });
  
    $(".history").on("click", "li", function() {
      searchWeather($(this).text());
    });
  
    function makeRow(text) {
      let li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
      $(".history").append(li);
    }
  ///grabbing the city you search 
    function searchWeather(searchValue) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=c20d10428ec74d8ce777f02d50551ee0&units=imperial",
        dataType: "json",
        success: function(data) {
          
          if (history.indexOf(searchValue) === -1) {
            history.push(searchValue);
            window.localStorage.setItem("history", JSON.stringify(history));
      
            makeRow(searchValue);
          }
          
          
          $("#today").empty();
  
          //gives city and weather information 
          let title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
          let card = $("<div>").addClass("card");
          let wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
          let humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
         let temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
          let cardBody = $("<div>").addClass("card-body");
          let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
  
    
          title.append(img);
          cardBody.append(title, temp, humid, wind);
          card.append(cardBody);
          $("#today").append(card);
  
          
          getForecast(searchValue);
          getUVIndex(data.coord.lat, data.coord.lon);
        }
      });
    }
    
    function getForecast(searchValue) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=c20d10428ec74d8ce777f02d50551ee0&units=imperial",
        dataType: "json",
        success: function(data) {
          
          $("#forecast").html
  
          
  
          
          for (var i = 0; i < data.list.length; i++) {
            
            if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
              
              let col = $("<div>").addClass("col-md-2");
              let card = $("<div>").addClass("card bg-primary text-white");
              let body = $("<div>").addClass("card-body p-2");
              let title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
              let img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
              let p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
              let p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
  
              
              col.append(card.append(body.append(title, img, p1, p2)));
              $("#forecast .row").append(col);
            }
          }
        }
      });
    }
  
    function getUVIndex(lat, lon) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=&lc20d10428ec74d8ce777f02d50551ee0at=" + lat + "&lon=" + lon,
        dataType: "json",
        success: function(data) {
          let uv = $("<p>").text("UV Index: ");
          let btn = $("<span>").addClass("main-button").text(data.value);
          
          
          if (data.value < 3) {
            btn.addClass("btn-success");
          }
          else if (data.value < 7) {
            btn.addClass("btn-warning");
          }
          else {
            btn.addClass("btn-danger");
          }
          
          $("#today .card-body").append(uv.append(btn));
        }
      });
    }
  
    
    let history = JSON.parse(window.localStorage.getItem("history")) || [];
  
    if (history.length > 0) {
      searchWeather(history[history.length-1]);
    }
  
    for (let i = 0; i < history.length; i++) {
      makeRow(history[i]);
    }
  });