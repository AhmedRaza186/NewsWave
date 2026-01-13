let hero = document.getElementById("hero")
let newsGrid = document.getElementById("newsGrid")
let breaking = document.querySelector(".breaking")
let searchInput = document.querySelector(".navbar input")
let navLinks = document.querySelectorAll("nav a")

let menuBtn = document.getElementById("menuBtn")
let mobileNav = document.getElementById("mobileNav")

menuBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("active")
})


let showLoader = () => {
  newsGrid.innerHTML = "<p>Loading news...</p>"
}

// Fetch News
async function fetchNews(category = "general", query = "") {
  showLoader()

  let url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&language=en&apiKey=825d44e0945846ca9b17cf4ca4e8132f`

  if (query) {
    url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=825d44e0945846ca9b17cf4ca4e8132f`
  }

  try {
    let res = await fetch(url)
    let data = await res.json()

    if (data.status !== "ok") throw new Error("API Error")

    renderHero(data.articles[0])
    renderBreaking(data.articles[1])
    renderNews(data.articles.slice(1, 10))

  } catch (err) {
    newsGrid.innerHTML = "<p>⚠️ Failed to load news</p>"
    console.error(err);
  }
}


function renderHero(article) {
  if (!article) return

  hero.innerHTML = `
    <img src="${article.urlToImage}" placeholder="${article.title}">
    <div class="hero-text">
      <h1>${article.title}</h1>
      <p>${article.description || ""}</p>
    </div>
  `
}


function renderBreaking(article) {
  if (!article) return
  breaking.textContent = `🔴 Breaking: ${article.title}`
}


function renderNews(articles) {
  newsGrid.innerHTML = ""

  articles.forEach(article => {
    let card = document.createElement("article")
    card.className = "card"

    card.innerHTML = `
         <img src="${article.urlToImage}" placeholder="${article.title}">
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
    `

    card.onclick = () => window.open(article.url, "_blank")
    newsGrid.appendChild(card)
  })
}

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault()
    let category = link.dataset.category
    fetchNews(category)
  })
})
let sidebarItems = document.querySelectorAll(".sidebar li")

sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    fetchNews(item.dataset.category)
  })
})



searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    fetchNews("", searchInput.value)
  }
})


fetchNews()
