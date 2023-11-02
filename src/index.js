//Global variables
const theURL = "http://localhost:3000/toys";
const divContainer = document.querySelector("#toy-collection");
const toyForm = document.querySelector(".add-toy-form");

//Don't remove this code provided for you
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //Helper functions

  /*2. Each card should have the following child elements: --- need to append to card after creating each element
     - h2 tag with the toy's name
     - img tag with the src of the toy's image attribute and the class name "toy-avatar"
     - p tag with how many likes that toy has
     - button tag with a class "like-btn" and an id attribute set to the toy's id number 
*/
  const appendToyCard = toyObj => {
    const divElement = document.createElement("div");
    divContainer.append(divElement); //append new created div for card to the div that already exists

    divElement.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toyObj.name;

    const imgElement = document.createElement("img");
    imgElement.src = toyObj.image;
    imgElement.alt = toyObj.name;
    imgElement.className = "toy-avatar";

    const pElement = document.createElement("p");
    pElement.textContent = `${toyObj.likes} Likes`;

    const btn = document.createElement("button");
    btn.className = "like-btn";
    btn.id = `toy_${toyObj.id}`;
    btn.textContent = "Like ❤️";

    //append new created elements to div for card
    divElement.append(h2, imgElement, pElement, btn);
  };

  /*1. On the index.html page, there is a div with the id "toy-collection." When the page loads, make a 'GET' request to fetch all the toy objects. With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
   */
  const fetchData = () => {
    fetch(theURL)
      .then(res => res.json())
      .then(toy => toy.forEach(appendToyCard)) //Call appendToyCard to render a card for each toy
      .catch(err => alert(err));
  };
  fetchData();

  /* 
When a user submits the toy form, two things should happen:
A POST request should be sent to http://localhost:3000/toys and the new toy added to Andy's Toy Collection.
If the post is successful, the toy should be added to the DOM without reloading the page.
In order to send a POST request via fetch(), give the fetch() a second argument of an object. This object should specify the method as POST and also provide the appropriate headers and the JSON data for the request. 
*/
  const postToy = newToy => {
    fetch(theURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }, //JSON data for the request, - using form inputs with value
      body: JSON.stringify({
        name: newToy.name.value,
        image: newToy.image.value,
        likes: 0,
      }),
    })
      .then(res => res.json())
      .then(newToyCard => appendToyCard(newToyCard)); //create a card for a new toy after triggering appendToyCard function when clicking submit button
  };

  //add submit event listener to form
  //New toy added to Andy's Toy Collection after clicking on a submit button ()
  toyForm.addEventListener("submit", e => {
    e.preventDefault();

    postToy(e.target); //or postToy(toyForm) - //Trigger postToy function after clicking submit button and get a new toy card

    e.target.reset();
  });
});
