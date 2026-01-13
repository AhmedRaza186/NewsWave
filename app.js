
const hero = document.getElementById("hero");
const newsGrid = document.getElementById("newsGrid");
const breaking = document.querySelector(".breaking");
const searchInput = document.querySelector(".navbar input");
const searchBtn = document.querySelector(".searchBtn");
const navLinks = document.querySelectorAll("nav a");
const sidebarItems = document.querySelectorAll(".sidebar li");

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");



fetchNews();

menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
});


function showLoader() {
    newsGrid.innerHTML = "<p>Loading news...</p>";
}


async function fetchNews(category = "general", query = "") {
    showLoader();


    let api = query
        ? `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&apikey=54bea61f4267cabd6a2fc55e70fc69c8`
        : `https://gnews.io/api/v4/top-headlines?country=us&topic=${category}&lang=en&max=10&apikey=54bea61f4267cabd6a2fc55e70fc69c8`;

    try {
        const res = await fetch(api);
        const data = await res.json();

        if (!data.articles) throw new Error("Failed to fetch news");

        renderHero(data.articles[0]);
        renderBreaking(data.articles[1]);
        renderNews(data.articles.slice(1, 10));

        highlightActive(category);

    } catch (err) {
        newsGrid.innerHTML = "<p>⚠️ Failed to load news</p>";
        console.error(err);
    }
}


function renderHero(article) {
    if (!article) return;

    hero.innerHTML = `
    <img src="${article.image || 'https://via.placeholder.com/800'}" alt="${article.title}">
    <div class="hero-text">
      <h1>${article.title}</h1>
      <p>${article.description || ''}</p>
    </div>
  `;
}


function renderBreaking(article) {
    if (!article) return;
    breaking.textContent = `🔴 Breaking: ${article.title}`;
}

function renderNews(articles) {
    newsGrid.innerHTML = "";

    articles.forEach(article => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
      <img src="${article.image || 'https://via.placeholder.com/400'}" alt="${article.title}">
      <h3>${article.title}</h3>
      <p>${article.description || ''}</p>
    `;
        card.onclick = () => window.open(article.url, "_blank");
        newsGrid.appendChild(card);
    });
}


function highlightActive(category) {
    [...navLinks, ...sidebarItems].forEach(el => {
        el.classList.toggle("active", el.dataset.category === category);
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const category = link.dataset.category;
        fetchNews(category);
    });
});

sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
        fetchNews(item.dataset.category);
    });
});


searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) fetchNews("", query);
    }
});

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) fetchNews("", query);
});



