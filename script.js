let videosData = "";
let cards = "";

const videoContainer = document.querySelector(".youtube__cards");

function dataFetch() {
  // Define the URL
  const url =
    "https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=500";

  // Fetch data from the URL
  fetch(url)
    .then((response) => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((data) => {
      videosData = data.data.data;

      renderCards(videosData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Handle any errors
    });
}


function renderCards(data) {
  if (data.length) {
    videoContainer.innerHTML = "";
    cards = "";
    data.forEach((details) => {
      cards += generateCard(details.items);
    });

    videoContainer.innerHTML = cards;
  } else {
    const warning = `<div class="warning"> No Data Found </div>`;
    videoContainer.innerHTML = warning;
  }
}

function generateCard(items) {
  const card = `
<div class="youtube__card">
<a href="https://www.youtube.com/watch?v=${items.id}" target="_blank">
    <img src="${
      items.snippet.thumbnails.high.url
    }" alt="#" class="youtube__thumbnail">
</a>

    <div class="youtube__card-content">
        <img src="${items.snippet.thumbnails.default.url}" alt="#"
            class="youtube__card-channel-img">

        <div>
            <h2 class="youtube__card-title">
                ${items.snippet.localized.title}
            </h2>

            <h3 class="youtube__card-channel-name">
                ${items.snippet.channelTitle}
            </h3>

            <div class="youtube__card-info">
                ${items.statistics.viewCount} • ${timeAgo(
    items.snippet.publishedAt
  )}
            </div>
        </div>
    </div>
</div>
`;
  return card;
}

function searchVideos() {
  const searchText = document
    .querySelector(".youtube__search-input")
    .value.trim();
  console.log("search call", searchText);

  if (!searchText) {
    renderCards(videosData);
  } else {
    const videosInfo = videosData.filter((video) => {
      return (
        video.items.snippet.localized.title
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        video.items.statistics.viewCount == searchText ||
        video.items.snippet.channelTitle
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
    renderCards(videosInfo);
  }
}

const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let key in intervals) {
    const count = Math.floor(seconds / intervals[key]);
    if (count >= 1) {
      return `${count} ${key}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};


dataFetch();