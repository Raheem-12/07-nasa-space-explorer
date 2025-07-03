// Your NASA API key here — replace with your actual key
const apiKey = "gMXMgIeLW9X5TGoTdbiUWbdNQILfPl7Q5lfQKQ20"; // Use your NASA API key as a string

// Grab date input elements
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Setup your date inputs (assuming you have a function like this)
setupDateInputs(startInput, endInput);

// Grab the button that triggers loading the gallery
const loadBtn = document.querySelector('.filters button'); // Select the button in the filters section

// Main function to fetch APOD data from NASA API and update the gallery
function fetchAPODData(startDate, endDate) {
  // Build the API URL with the selected dates
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}&thumbs=true`;

  // Fetch data from NASA's APOD API
  // Show a loading message while fetching
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🚀</div><p>Loading images from NASA...</p></div>';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      gallery.innerHTML = ''; // Clear old content or placeholder

      // Sort data so newest is first
      data.reverse().forEach(item => {
        let itemContent = '';
        if (item.media_type === 'image') {
          // Show image thumbnail
          itemContent = `
            <img src="${item.url}" alt="${item.title}" class="thumb" />
            <div class="item-title">${item.title}</div>
            <div class="item-date">${item.date}</div>
          `;
        } else if (item.media_type === 'video') {
          // Show video thumbnail and a play button overlay
          itemContent = `
            <div class="video-thumb-container">
              <img src="${item.thumbnail_url}" alt="${item.title}" class="thumb" />
              <div class="play-overlay">▶</div>
            </div>
            <div class="item-title">${item.title}</div>
            <div class="item-date">${item.date}</div>
          `;
        }
        // Create a gallery item div
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item';
        itemDiv.innerHTML = itemContent;

        // Add a click event to open the modal with details
        itemDiv.addEventListener('click', () => {
          openModal(item);
        });

        // Add the item to the gallery
        gallery.appendChild(itemDiv);
      });
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = `<p class="error">Could not load images. Please try again later.</p>`;
      console.error(error);
    });
}

// Function to open a modal window with image or video details
function openModal(item) {
  // Create the modal background
  const modalBg = document.createElement('div');
  modalBg.className = 'modal-bg';

  // Create the modal content box
  const modalBox = document.createElement('div');
  modalBox.className = 'modal-box';

  let mediaContent = '';
  if (item.media_type === 'image') {
    mediaContent = `<img src="${item.url}" alt="${item.title}" class="modal-img" />`;
  } else if (item.media_type === 'video') {
    // Embed YouTube or show a link for other videos
    if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
      // Embed YouTube video
      let videoId = '';
      if (item.url.includes('youtube.com')) {
        videoId = item.url.split('v=')[1];
        if (videoId && videoId.includes('&')) videoId = videoId.split('&')[0];
      } else if (item.url.includes('youtu.be')) {
        videoId = item.url.split('youtu.be/')[1];
      }
      mediaContent = `<div class="video-embed"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
    } else {
      // Show a clickable link for non-YouTube videos
      mediaContent = `<a href="${item.url}" target="_blank" class="video-link">Watch Video</a>`;
    }
  }

  // Set up the modal content
  modalBox.innerHTML = `
    <button class="modal-close" title="Close">&times;</button>
    ${mediaContent}
    <h2 class="modal-title">${item.title}</h2>
    <div class="modal-date">${item.date}</div>
    <p class="modal-explanation">${item.explanation}</p>
  `;

  // Add close functionality
  modalBox.querySelector('.modal-close').onclick = () => {
    document.body.removeChild(modalBg);
  };
  // Also close modal when clicking outside the box
  modalBg.onclick = (e) => {
    if (e.target === modalBg) {
      document.body.removeChild(modalBg);
    }
  };

  // Add modal to the page
  modalBg.appendChild(modalBox);
  document.body.appendChild(modalBg);
}
// Fun space facts array
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second!",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter is so big that over 1,300 Earths could fit inside it!",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? The Sun makes up 99.8% of the mass in our solar system.",
  "Did you know? Saturn would float if you could put it in water!",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? Space is completely silent—there’s no air for sound to travel.",
  "Did you know? The International Space Station travels at 28,000 km/h!"
];

// Show a random space fact above the gallery
function showRandomFact() {
  const factSection = document.createElement('section');
  factSection.className = 'space-fact';
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  factSection.innerHTML = `<strong>${randomFact}</strong>`;
  const container = document.querySelector('.container');
  container.insertBefore(factSection, container.querySelector('.filters'));
}

// Show a random fact on page load
showRandomFact();
// Listen for button click to load images
loadBtn.addEventListener('click', () => {
  // Get the selected dates
  const startDate = startInput.value;
  const endDate = endInput.value;
  // Only fetch if both dates are selected
  if (startDate && endDate) {
    fetchAPODData(startDate, endDate);
  }
});
