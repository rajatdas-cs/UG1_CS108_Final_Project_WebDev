// Loading the students data from the JSON file
let students = [];
//Using fetch
fetch('students.json')
  .then(response => response.json())
  .then(data => {
    students = data;
    // Add an event listener to the form submission
    document.getElementById('dating-form').addEventListener('submit', handleFormSubmit);
  })
  .catch(error => console.error(error));

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the user input from the form
  // Although only age, gender, interests and hobbies will be used to find a match
  // Why are we taking roll no, name and year, even though we are not storing it ?

  // Compiling all the details the user provides in the form
  const userProfile = {
    'IITB Roll Number': document.getElementById('roll-number').value,
    Name: document.getElementById('name').value,
    'Year of Study': document.getElementById('year-of-study').value,
    Age: parseInt(document.getElementById('age').value, 10),
    Gender: document.querySelector('input[name="gender"]:checked').value,
    Interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(checkbox => checkbox.value),
    Hobbies: Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(checkbox => checkbox.value),
    Email: document.getElementById('email').value
  };

  // Finding the best match for the user
  const bestPossibleMatch = findingBestMatch(students, userProfile);

  // Opening a new tab and show the best match
  if (bestPossibleMatch) {
    // Target blank
    const matchWindow = window.open('', '_blank');
    // Creating a div
    const matchContainer = matchWindow.document.createElement('div');
    // Filling in details of the match
    matchContainer.innerHTML = generateMatchHTML([bestPossibleMatch]);
    matchWindow.document.body.appendChild(matchContainer);
  } else {
    alert("Sorry, no suitable match found.");
  }
}

// Adding an event listener to guide to scroll_or_swipe.html
scrollOrSwipe.addEventListener('click', () => {
  window.location.href = 'scroll_or_swipe.html';
});

// Function to find the best match based on user profile
function findingBestMatch(students, userProfile) {
  // Making sure only opposite genders are matched
  const possibleMatchesOfOppositeGender = students.filter(student => student.Gender !== userProfile.Gender);

  // Calculate match benchmark based on interests and hobbies
  // In the rudimentary algorithm consisting of calculation of a score(sum), I have just
  // Added a weight of 1.5x to hobbies, since I feel that is more important
  // Also calculate age difference, which will be used to sort later
  const matchBenchmark = possibleMatchesOfOppositeGender.map(student => {
    const ageDifference = Math.abs(student.Age - userProfile.Age);
    const intersectionScore = getIntersectionOfArrays(student.Interests, userProfile.Interests) + 1.5 * getIntersectionOfArrays(student.Hobbies, userProfile.Hobbies);
    return { student, ageDifference, intersectionScore };
  });

  // Sorting the matches based on intersection score, age gap, and hobbies intersection
  matchBenchmark.sort((a, b) => {
    if (a.intersectionScore === b.intersectionScore) {
      if (a.ageDifference === b.ageDifference) {
        return getIntersectionOfArrays(b.student.Hobbies, userProfile.Hobbies) - getIntersectionOfArrays(a.student.Hobbies, userProfile.Hobbies);
      }
      return a.ageDifference - b.ageDifference;
    }
    return b.intersectionScore - a.intersectionScore;
  });

  // Return the best match
  return matchBenchmark.length > 0 ? matchBenchmark[0].student : null;
}

// Function to calculate the intersection of two arrays
// Used to get intersection of the students' and users' hobbies and intersests
function getIntersectionOfArrays(arr1, arr2) {
  return arr1.filter(item => arr2.includes(item)).length;
}

// Function to generate HTML for the matches
function generateMatchHTML(matches) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your Match</title>
        <link rel="stylesheet" href="styleMatch.css">
      </head>
      <body>
        <div class="match-container">
          <h1>Your Match</h1>
          ${matches.map(match => `
            <div class="match-card">
              <img src="${match['Photo']}" alt="${match['Name']}">
              <h2>${match['Name']}</h2>
              <p>IITB Roll Number: ${match['IITB Roll Number']}</p>
              <p>Year of Study: ${match['Year of Study']}</p>
              <p>Age: ${match['Age']}</p>
              <p>Gender: ${match['Gender']}</p>
              <p>Interests: ${match['Interests'].join(', ')}</p>
              <p>Hobbies: ${match['Hobbies'].join(', ')}</p>
              <p>Email: ${match['Email']}</p>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;
}

/*

At first I was doing like this, but was not working, then 'Gemini' suggested to make a div, then it worked!

Gemini = try fixing the code with the following approach : Create a new element and append it

  JavaScript suggested :

  const matchWindow = window.open('', '_blank');
  const matchContainer = matchWindow.document.createElement('div');
  matchContainer.innerHTML = generateMatchHTML(bestPossibleMatch);
  matchWindow.document.body.appendChild(matchContainer);
  content_copy

This approach creates a new div element in the new window's document, sets its innerHTML with the match details, and then appends it to the body.

Original_Approach : 
Javascript :

const matchWindow = window.open('', '_blank');
    matchWindow.document.write(generateMatchHTML([bestPossibleMatch]));
    matchWindow.document.close();

function generateMatchHTML(matches) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Your Match</title>
        <link rel="stylesheet" href="styleMatch.css">
      </head>
      <body>
        <div class="match-container">
          <h1>Your Match</h1>
          ${matches.map(match => `
            <div class="match-card">
              <h2>${match['Name']}</h2>
              <p>IITB Roll Number: ${match['IITB Roll Number']}</p>
              <p>Year of Study: ${match['Year of Study']}</p>
              <p>Age: ${match['Age']}</p>
              <p>Gender: ${match['Gender']}</p>
              <p>Interests: ${match['Interests'].join(', ')}</p>
              <p>Hobbies: ${match['Hobbies'].join(', ')}</p>
              <p>Email: ${match['Email']}</p>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;
}

*/