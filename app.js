const hero = document.getElementById("hero")
const newsGrid = document.getElementById("newsGrid")
const breaking = document.querySelector(".breaking")
const searchInput = document.querySelector(".navbar input")
const searchBtn = document.querySelector(".search-box #searchBtn")
const navLinks = document.querySelectorAll("nav a")
const sidebarItems = document.querySelectorAll(".sidebar li")

const menuBtn = document.getElementById("menuBtn")
const mobileNav = document.getElementById("mobileNav")

menuBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("active")
})

fetchNews("business")

function showLoader() {
  newsGrid.innerHTML = "<p>Loading news...</p>"
}

async function fetchNews(category = "business", query = "") {
  showLoader()

  const api = query
    ? `https://api.worldnewsapi.com/search-news?api-key=baf67114359644d2bda5d89193b3ae73&text=${query}&language=en&number=10`
    : `https://api.worldnewsapi.com/search-news?api-key=baf67114359644d2bda5d89193b3ae73&categories=${category}&language=en&number=10`

  try {
    const res = await fetch(api)
    const data = await res.json()

    if (!data.news || data.news.length === 0) {
      newsGrid.innerHTML = "<p>No news found</p>"
      return
    }

    renderHero(data.news[0])
    renderBreaking(data.news[1])
    renderNews(data.news.slice(1, 10))

  } catch (err) {
    newsGrid.innerHTML = "<p>⚠️ Failed to load news</p>"
    console.error(err)
  }
}

function renderHero(news) {
  if (!news) return

  hero.innerHTML = `
    <img src="${news.image || "https://via.placeholder.com/800"}" alt="${news.title}">
    <div class="hero-text">
      <h1>${news.title}</h1>
      <p>${news.text?.slice(0, 150) || ""}...</p>
    </div>
  `
}

function renderBreaking(news) {
  if (!news) return
  breaking.textContent = `🔴 Breaking: ${news.title}`
}

function renderNews(list) {
  newsGrid.innerHTML = ""

  list.forEach(news => {
    const card = document.createElement("article")
    card.className = "card"

    card.innerHTML = `
      <img src="${news.image || "https://via.placeholder.com/400"}" alt="${news.title}">
      <h3>${news.title}</h3>
      <p>${news.text?.slice(0, 100) || ""}...</p>
    `

    card.onclick = () => window.open(news.url, "_blank")
    newsGrid.appendChild(card)
  })
}

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault()
    fetchNews(link.dataset.category)
  })
})

sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    fetchNews(item.dataset.category)
  })
})

searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim()
    if (query) fetchNews("", query)
  }
})

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim()
  if (query) fetchNews("", query)
})




