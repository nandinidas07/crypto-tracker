const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
let cryptoData = [];
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch data");
    cryptoData = await response.json();

    console.log("Fetched Data:", cryptoData); 
    renderTable(cryptoData);
  } catch (error) {
    console.error("Error:", error.message);
    document.getElementById("tableBody").innerHTML = <tr><td colspan="8">Error loading data</td></tr>;
  }
}

function renderTable(data) {
  const tableHead = document.getElementById("tableHead");
  const tableBody = document.getElementById("tableBody");

  tableHead.innerHTML = `
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Symbol</th>
      <th>Price (USD)</th>
      <th>Market Cap</th>
      <th>Total Volume</th>
      <th>% Change (24h)</th>
    </tr>
  `;

  tableBody.innerHTML = data.map(coin => `
    <tr>
      <td><img src="${coin.image}" alt="${coin.name}"></td>
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td style="color:${coin.market_cap_change_percentage_24h >= 0 ? 'green' : 'red'}">
        ${coin.market_cap_change_percentage_24h.toFixed(2)}%
      </td>
    </tr>
  `).join("");
}
function searchData() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const filteredData = cryptoData.filter(coin =>
    coin.name.toLowerCase().includes(searchText) ||
    coin.symbol.toLowerCase().includes(searchText)
  );
  renderTable(filteredData);
}

function resetData() {
  document.getElementById("searchInput").value = "";
  renderTable(cryptoData);
}

function sortByMarketCap() {
  const sorted = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
  renderTable(sorted);
}

function sortByPercentage() {
  const sorted = [...cryptoData].sort((a, b) => b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h);
  renderTable(sorted);
}
fetchData();
