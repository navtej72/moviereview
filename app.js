const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const { getMovieReviews, getLatestMovieReviews } = require('./nytapi'); // Import the nytApi module
const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("css"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.get("/latestMovieReviews", function (req, res) {

  fetch('/latestMovieReviews', {
  method: 'GET' // Explicitly specify the HTTP method
})

  
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - 30); // Fetch reviews from the last 7 days

  const latestReviewsPromise = getLatestMovieReviews(sevenDaysAgo.toISOString());

  Promise.all([latestReviewsPromise])
    .then(([reviewsResponse]) => {
      const moviesReview = reviewsResponse.data;

      if (moviesReview.num_results === 7) {
        console.log("No results found for the latest reviews.");
        res.send("No results found for the latest reviews.");
      } else {
        const reviews = moviesReview.results;

        res.send(generateReviewHTML(reviews));
      }
    })
    .catch((error) => {
      console.error(error);
      res.send("Error fetching movie reviews.");
    });
});


app.post("/", function (req, res) {
  const query = req.body.moviename;

  const movieReviewsPromise = getMovieReviews(query);
 

  Promise.all([movieReviewsPromise])
    .then(([reviewsResponse]) => {
      const moviesReview = reviewsResponse.data;
      
      if (moviesReview.num_results === 0) {
        console.log("No results found for the given query.");
        res.send("No results found for the given query.");
      } else {
        const reviews = moviesReview.results;
       
        res.send(generateReviewHTML(reviews));
      }
    })
    .catch(error => {
      console.error(error);
      res.send("Error fetching movie reviews and articles.");
    });
});


app.listen(4000, function () {
  console.log("Server is running on port 4000");
});



function generateReviewHTML(reviews) {
  let html = '<h1 style: color "blue">Movie Reviews </h1>';

  if (!reviews || reviews.length === 0) {
    html += '<p>No results found for the given query.</p>';
  } else {
    html += '<h2>Movie Reviews</h2>';

    if (reviews && reviews.length > 0) {
      for (const review of reviews) { // Add a loop to go through all reviews
        html += `<div class="movie-review">`; // Open a new div for each review
        html += `<p><strong>${review.display_title}</strong>: ${review.summary_short}</p>`;
        if (review.multimedia) {
          const { src, type, height, width } = review.multimedia;
        // Inside the generateReviewHTML function, modify the image tag generation
      html += `<img src="${src}" alt="${review.display_title}" width="auto" height="auto" data-article-url="${review.link.url}">`;

        }
        html += `</div>`; // Close the div for each review
      }
    } else {
      html += '<p>No reviews found for the given query.</p>';
    }
  }

  return html;
}





