// Array of Firestore collection names
const collectionNames = [
  "collection1",
  "collection2",
  "collection3",
  "collection4",
  "collection5",
  "collection6",
  "collection7",
  "collection8",
  "collection9",
  "collection10",
  "collection11",
  "collection12",
  "collection13",
];

// Function to update the countdown timers
const updateCountdowns = () => {
  for (let i = 0; i < collectionNames.length; i++) {
    const container = document.querySelector(`.container${i + 1}`);
    const countdownElements = container.querySelectorAll(".countdown");

    countdownElements.forEach((countdownElement) => {
      const releaseTime = new Date(
        countdownElement.getAttribute("data-release")
      );
      const currentTime = new Date();

      if (currentTime >= releaseTime) {
        // If the current time is greater than or equal to the release time, display "OUT NOW!"
        countdownElement.textContent = "OUT NOW!";
      } else {
        const timeRemaining = releaseTime - currentTime;

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    });
  }
};

const getNextReviewsForCollection = async (collectionName, container, selectedCategory = "all") => {
  let ref = db.collection(collectionName);

  if (selectedCategory !== "all") {
    // If a specific category is selected, add a filter to the query
    ref = ref.where("categories", "array-contains", selectedCategory);
  }




  const data = await ref.get();

  // Clear the container before adding new data
  container.innerHTML = "";

  const outNowCards = []; // To store "OUT NOW!" cards
  const currentTime = new Date();

  // Output docs with countdown timers
  data.docs.forEach((doc) => {
    const review = doc.data();
    const releaseDate = review.release.toDate(); // Assuming 'release' is a Firestore timestamp field

    const countdown = document.createElement("div");
    countdown.className = "card";
    countdown.innerHTML = `
    <div class="release">${review.bigdate}</div>
    <img src="${review.image}" />
    <h2>${review.name}</h2>
    <p class="countdown" data-release="${releaseDate}">
      0d 0h 0m 0s remaining
    </p>
    `;

    const timeRemaining = releaseDate - currentTime;

    if (timeRemaining <= 0) {
      // If the current time is greater than or equal to the release time, display "OUT NOW!"
      countdown.querySelector(".countdown").textContent = "OUT NOW!";
      outNowCards.push(countdown);
    } else {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      countdown.querySelector(".countdown").textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      container.appendChild(countdown);
    }
  });

  // Add "OUT NOW!" cards at the end
  outNowCards.forEach((outNowCard) => {
    container.appendChild(outNowCard);
  });

  // Update countdown timers immediately after rendering
  updateCountdowns();
};

// Load data for each collection on DOM loaded
window.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < collectionNames.length; i++) {
    const container = document.querySelector(`.container${i + 1}`);
    getNextReviewsForCollection(collectionNames[i], container);
  }

  // Update countdown timers every second
  setInterval(updateCountdowns, 1000);
});

// JavaScript to change the header background color on scroll
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.style.backgroundColor = "#1d1d1d"; // Make the header transparent
  } else {
    header.style.backgroundColor = "#1d1d1d"; // Restore the original background color
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);

    // Check if the target ID is "top" for scrolling to the top
    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Scroll smoothly to the target section
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// Smooth scroll to the top when the logo is clicked
document.querySelector(".logo").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// JavaScript to scroll to the "Next Month" section
document.querySelector('a[href="#next-month-section"]').addEventListener("click", function (e) {
  e.preventDefault();
  const nextMonthSection = document.getElementById("next-month-section");
  if (nextMonthSection) {
    const headerHeight = document.querySelector("header").offsetHeight;
    window.scrollTo({
      top: nextMonthSection.offsetTop - headerHeight,
      behavior: "smooth",
    });
  }
});

const filterButton = document.getElementById("filterButton");
const dropdown = document.querySelector(".dropdown");
const dropdownOptions = document.querySelectorAll(".dropdown-option");


// Function to handle the selection of an option
function handleOptionSelection(selectedOption, selectedCategory) {
  // Remove the selected class from all options
  dropdownOptions.forEach((option) =>
    option.classList.remove("selected-option")
  );

  // Add the selected class to the clicked option
  selectedOption.classList.add("selected-option");

  // Update the filter button's text to the selected option
  filterButton.textContent = selectedOption.textContent; // Set the text to the selected option's text

  // Iterate through the collection names and update the data for each collection based on the selected category
  for (let i = 0; i < collectionNames.length; i++) {
    const container = document.querySelector(`.container${i + 1}`);
    getNextReviewsForCollection(collectionNames[i], container, selectedCategory);
  }
  
}

// Add an event listener to the filter button to handle category selection
filterButton.addEventListener("click", function () {
  dropdown.classList.toggle("show");
});

// Add an event listener to each category option
dropdownOptions.forEach((option) => {
  option.addEventListener("click", function () {
    const selectedCategory = this.id; // Get the category from the selected option
    handleOptionSelection(this, selectedCategory);
    // Close the dropdown
    dropdown.classList.remove("show");
  });
});

// Set "Show All" as the default selected option
handleOptionSelection(document.getElementById("all"), "all");

// Function to scroll to the "Worth the Wait" section
function scrollToWorthTheWait() {
  const worthTheWaitSection = document.getElementById("worth-the-wait-section");
  if (worthTheWaitSection) {
    worthTheWaitSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Add a click event listener to the "Worth The Wait" link in the navbar
const worthTheWaitLink = document.querySelector('nav a[href="#worth-the-wait-section"]');
if (worthTheWaitLink) {
  worthTheWaitLink.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior
    scrollToWorthTheWait();
  });
}

const selectedCategory = this.id; // Get the category from the selected option
if (selectedCategory === "movies") {
  // If "Movies" is selected, filter by the "Movies" category
  handleOptionSelection(this, "Movies");
} else {
  // For other categories, filter accordingly
  handleOptionSelection(this, selectedCategory);
}



