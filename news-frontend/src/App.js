import React, { useState, useEffect } from "react";

// Spinner styling
const spinnerStyle = {
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #3498db",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  animation: "spin 1s linear infinite",
  margin: "30px auto",
};

// Spinner keyframes
const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject keyframes into DOM
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = spinnerKeyframes;
document.head.appendChild(styleSheet);

function App() {
  const [category, setCategory] = useState("technology");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState("publishedAt"); // or 'relevance', 'popularity'

  // Fetch news by category and page, or search
  const fetchNews = (cat, pg, search = "", sort = "publishedAt", append = false) => {
    setLoading(true);
    let url = "";

    if (search && search.trim() !== "") {
      url = `http://localhost:8080/api/news/search?q=${encodeURIComponent(search)}&sort=${sort}&page=${pg}`;
    } else {
      url = `http://localhost:8080/api/news/${cat}?sort=${sort}&page=${pg}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const newArticles = data.articles || [];
        setArticles((prev) => (append ? [...prev, ...newArticles] : newArticles));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Load initial news on category or sort change
  useEffect(() => {
    setPage(1);
    fetchNews(category, 1, "", sortBy, false);
    setIsSearching(false);
    setSearchTerm("");
  }, [category, sortBy]);

  // Handle Load More button
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (isSearching) {
      fetchNews("", nextPage, searchTerm, sortBy, true);
    } else {
      fetchNews(category, nextPage, "", sortBy, true);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    setIsSearching(true);
    setPage(1);
    fetchNews("", 1, searchTerm, sortBy, false);
  };

  // Handle Home button click
  const goHome = () => {
    setIsSearching(false);
    setSearchTerm("");
    setPage(1);
    fetchNews(category, 1, "", sortBy, false);
  };

  // Categories list (add more if needed)
  const categories = ["technology", "sports", "business", "general", "world", "science"];

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Technology News App</h1>

      {/* Category selector */}
      {!isSearching && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                marginRight: 10,
                backgroundColor: cat === category ? "#007bff" : "#eee",
                color: cat === category ? "white" : "black",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Search bar & Home button */}
      <form
        onSubmit={handleSearch}
        style={{ textAlign: "center", marginBottom: "15px" }}
      >
        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button type="submit" style={{ padding: "8px 15px", cursor: "pointer" }}>
          Search
        </button>
        {isSearching && (
          <button
            type="button"
            onClick={goHome}
            style={{
              padding: "8px 15px",
              marginLeft: "10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Home
          </button>
        )}
      </form>

      {/* Sort dropdown */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="sortSelect" style={{ marginRight: "10px" }}>
          Sort by:
        </label>
        <select
          id="sortSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="publishedAt">Published At</option>
          <option value="relevance">Relevance</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      {/* Loading Spinner */}
      {loading && <div style={spinnerStyle}></div>}

      {/* No results message */}
      {isSearching && !loading && articles.length === 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: "1.2rem",
            color: "#888",
          }}
        >
          No results found for "{searchTerm}"
        </p>
      )}

      {/* News Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {articles.map((article, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ddd",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
            )}
            <div style={{ padding: "12px" }}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                <h3 style={{ fontSize: "1rem", marginBottom: "8px" }}>
                  {article.title}
                </h3>
              </a>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                {article.description}
              </p>
              <small style={{ color: "#888" }}>
                {article.source.name} —{" "}
                {new Date(article.publishedAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {articles.length > 0 && !loading && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={loadMore}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
