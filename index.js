// call api get list
let slideShowContainer = document.getElementById("slideshow-container");
let search = document.getElementById("search");
let searchBtn = document.getElementById("searchBtn");
var slideIndex = 1;

fetch("https://covid-api.mmediagroup.fr/v1/cases")
  .then((data) => data.json())
  .then((data) => {
    let init = [];
    for (let i in data) {
      let country = data[i].All.country;
      let confirmed = data[i].All.confirmed;
      let recovered = data[i].All.recovered;
      let deaths = data[i].All.deaths;
      let mortalityRate = Math.round((deaths / confirmed) * 100 * 100) / 100;
      let obj = {
        country: country,
        confirmed: confirmed,
        recovered: recovered,
        deaths: deaths,
        mortalityRate: mortalityRate,
      };
      init.push(obj);
    }
    return init;
  })
  .then((init) => {
    for (e of init) {
      if (e.country != undefined) {
        let html = `
        <div class="mySlides">
        <div class="info-container">
            <span class="country">${e.country}</span>
            <div class="info">
                <div>Confirmed <br>${e.confirmed}</div>
                <div>Recovered <br>${e.recovered}</div> 
                <div>Deaths <br>${e.deaths}</div>
                <div>MortalityRate <br>${e.mortalityRate}</div>
            </div>
        </div>
        <div class="chart">
            <canvas></canvas>
        </div>
    </div>
        `;
        slideShowContainer.insertAdjacentHTML("afterbegin", html);
        // make chart
        const data = {
          labels: ["confirmed", "recovered", "deaths", "mortalityRate"],
          datasets: [
            {
              label: "Infomation",
              data: [e.confirmed, e.recovered, e.deaths, e.mortalityRate],
              backgroundColor: [
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(255, 99, 132)",
                "rgb(0,255,0)",
              ],
              hoverOffset: 4,
            },
          ],
        };

        const config = {
          type: "pie",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        };
        let chart = document.getElementsByTagName("canvas");
        new Chart(chart, config);
        //slide show
        showSlides(slideIndex);
      }
    }
    return init.filter(e => e.country != undefined)
  })
  .then((init) => {
    var slides = document.getElementsByClassName("mySlides");
    searchBtn.addEventListener("click", () => {
      let needSearch = search.value;
      for (let i = 0; i< slides.length; i++) {
        let text = slides[i].children[0].children[0].innerText
        if (text == needSearch) {
          slides[i].style.display = "flex"
          for (j = 0; j < slides.length; j++) {
            if(j != i) {
              slides[j].style.display = "none";
            }
          }
        }
      }
    });
  });

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex - 1].style.display = "flex";
}
