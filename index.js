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
    ref = ref.where("categories", "array-contains", selectedCategory);
  }




  const data = await ref.get();

  container.innerHTML = "";

  const outNowCards = []; 
  const currentTime = new Date();

  data.docs.forEach((doc) => {
    const review = doc.data();
    const releaseDate = review.release.toDate(); 

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


  outNowCards.forEach((outNowCard) => {
    container.appendChild(outNowCard);
  });

  updateCountdowns();
};


window.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < collectionNames.length; i++) {
    const container = document.querySelector(`.container${i + 1}`);
    getNextReviewsForCollection(collectionNames[i], container);
  }


  setInterval(updateCountdowns, 1000);
});


const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.style.backgroundColor = "#1d1d1d"; 
  } else {
    header.style.backgroundColor = "#1d1d1d"; 
  }
});


document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);


    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {

        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});


document.querySelector(".logo").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});


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



function handleOptionSelection(selectedOption, selectedCategory) {

  dropdownOptions.forEach((option) =>
    option.classList.remove("selected-option")
  );


  selectedOption.classList.add("selected-option");


  filterButton.textContent = selectedOption.textContent; 


  for (let i = 0; i < collectionNames.length; i++) {
    const container = document.querySelector(`.container${i + 1}`);
    getNextReviewsForCollection(collectionNames[i], container, selectedCategory);
  }
  
}


filterButton.addEventListener("click", function () {
  dropdown.classList.toggle("show");
});


dropdownOptions.forEach((option) => {
  option.addEventListener("click", function () {
    const selectedCategory = this.id; 
    handleOptionSelection(this, selectedCategory);

    dropdown.classList.remove("show");
  });
});


handleOptionSelection(document.getElementById("all"), "all");


function scrollToWorthTheWait() {
  const worthTheWaitSection = document.getElementById("worth-the-wait-section");
  if (worthTheWaitSection) {
    worthTheWaitSection.scrollIntoView({ behavior: "smooth" });
  }
}


const worthTheWaitLink = document.querySelector('nav a[href="#worth-the-wait-section"]');
if (worthTheWaitLink) {
  worthTheWaitLink.addEventListener("click", function (e) {
    e.preventDefault(); 
    scrollToWorthTheWait();
  });
}

const selectedCategory = this.id; 
if (selectedCategory === "movies") {

  handleOptionSelection(this, "Movies");
} else {

  handleOptionSelection(this, selectedCategory);
}



