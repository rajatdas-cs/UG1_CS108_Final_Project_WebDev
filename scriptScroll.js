// For the basic I was using the script in scroll_or_swipe.html itself.
// But since it was getting large for customisations, I have separated this javascript file.
// Fetch the students data from the server using Fetch API
fetch('students.json')
  .then(response => response.json())
  .then(students => {
    const cardContainer = document.querySelector('.card-container');

    // Create a card for each student
    students.forEach((student, index) => {
      const card = document.createElement('div');
      card.classList.add('card');

      // Adding the image
      // In students.json I have added 'http://localhost:8000/' before the image path as suggested on stackexchange to get the images
      const img = document.createElement('img');
      img.src = student.Photo;
      img.alt = student.Name;
      card.appendChild(img);

      // Adding the name
      const name = document.createElement('h3');
      name.textContent = student.Name;
      card.appendChild(name);

      // Roll Number
      const rollNumber = document.createElement('p');
      rollNumber.textContent = `IITB Roll Number: ${student['IITB Roll Number']}`;
      card.appendChild(rollNumber);

      // Year of Study
      const yearOfStudy = document.createElement('p');
      yearOfStudy.textContent = `Year of Study: ${student['Year of Study']}`;
      card.appendChild(yearOfStudy);

      // Age
      const age = document.createElement('p');
      age.textContent = `Age: ${student.Age}`;
      card.appendChild(age);

      // Gender
      const gender = document.createElement('p');
      gender.textContent = `Gender: ${student.Gender}`;
      card.appendChild(gender);

      // Interests
      const interests = document.createElement('p');
      interests.textContent = `Interests: ${student.Interests.join(', ')}`;
      card.appendChild(interests);

      // Hobbies
      const hobbies = document.createElement('p');
      hobbies.textContent = `Hobbies: ${student.Hobbies.join(', ')}`;
      card.appendChild(hobbies);

      // Email
      const email = document.createElement('p');
      email.textContent = `Email: ${student.Email}`;
      card.appendChild(email);

      // Adding rating section
      const ratingSection = document.createElement('div');
      ratingSection.classList.add('rating-section');

      const ratingLabel = document.createElement('label');
      ratingLabel.textContent = 'See what others think:';
      ratingSection.appendChild(ratingLabel);

      // Getting heart icons using a library
      // They get filled 'proportionately' to the Likemeter
      // I wanted the hearts to be filled proportionately to the likemeter. For example 3.5 on likemeter fills 3 and a half hearts.
      // But the icons are getting filled in integer values
      const heartIcons = document.createElement('div');
      heartIcons.classList.add('heart-icons');

      for (let i = 0; i < 5; i++) {
        const heartIcon = document.createElement('i');
        heartIcon.classList.add('far', 'fa-heart');
        heartIcons.appendChild(heartIcon);
      }

      ratingSection.appendChild(heartIcons);

      // Adding button to allow the user to rate
      const rateButton = document.createElement('button');
      rateButton.textContent = 'Your Opinion';
      // index variable in the arrow function refers to the current iteration index of the loop.
      rateButton.addEventListener('click', () => rateStudent(index, students));
      ratingSection.appendChild(rateButton);

      card.appendChild(ratingSection);

      // Add likemeter to show average rating and if not rated yet show a message
      const likeLabel = document.createElement('p');
      likeLabel.textContent = `Likemeter: ${student.likemeter ? student.likemeter.toFixed(2) : 'Not rated yet'}`;
      card.appendChild(likeLabel);
      
      // Adding button for sending email
      const emailButton = document.createElement('button');
      emailButton.textContent = 'Go For It';
      // Adding event listener to attach the sending of email to the button
      emailButton.addEventListener('click', () => sendEmail(student.Email));
      card.appendChild(emailButton);  
      
      cardContainer.appendChild(card);
    });
  })
  .catch(error => console.error(error));

function rateStudent(studentIndex, students) {
  const rating = prompt("Rate this student from 1 to 5:");

  if (rating && rating >= 1 && rating <= 5) {
    updateStudentRating(students, studentIndex, parseInt(rating));
  } else {
    alert("Invalid rating. Please enter a value between 1 and 5.");
  }
}

function updateStudentRating(students, studentIndex, rating) {
  // Update the student's rating
  if (!students[studentIndex].ratings) {
    students[studentIndex].ratings = [];
  }
  // Push method adds the value to end of the array
  students[studentIndex].ratings.push(rating);

  // Calculate the average rating for the student
  const totalRatings = students[studentIndex].ratings.reduce((sum, value) => sum + value, 0);
  const averageRating = totalRatings / students[studentIndex].ratings.length;

  // Update the likemeter field
  students[studentIndex].likemeter = averageRating;

  // Update the icons
  updateHeartIcons(studentIndex, averageRating);
  updateLikemeter(studentIndex, averageRating);
}

// Here, I am using the Font Awesome CSS library to get the heart shaped icons
// The library has been linked in the head of the html file
function updateHeartIcons(studentIndex, averageRating) {
  const heartIcons = document.querySelectorAll(`.card:nth-child(${studentIndex + 1}) .heart-icons i`);
  heartIcons.forEach((icon, index) => {
    if (index < Math.floor(averageRating)) {
      icon.classList.remove('far', 'fa-heart');
      icon.classList.add('fas', 'fa-heart');
    } else {
      icon.classList.remove('fas', 'fa-heart');
      icon.classList.add('far', 'fa-heart');
    }
  });
}

function updateLikemeter(studentIndex, averageRating) {
  const card_needed = document.querySelectorAll('.card')[studentIndex];
  const likeLabel = Array.from(card_needed.querySelectorAll('p')).find(p => p.textContent.includes('Likemeter'));
  likeLabel.textContent = `Likemeter: ${averageRating.toFixed(2)}`;
}

function sendEmail(recipientEmail) {
  const emailFromUser = prompt("Provide your email: ");
  const passFromUser = prompt("Provide your email password: ");
  Email.send({
    Host: "smtp.gmail.com",
    Username: emailFromUser,
    Password: passFromUser,
    To: recipientEmail,
    From: emailFromUser,
    Subject: "Hi",
    Body: "Hi",
  })
    .then(function (message) {
      alert("Email sent successfully");
    })
    .catch(function (error) {
      console.error("Email failed to send:", error);
      alert("Failed to send email. Please try again.");
    });
}