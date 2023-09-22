let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const toyUrl = "http://localhost:3000/toys";
  divToyCollection = document.querySelector("div#toy-collection");
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  /*1. On the index.html page, there is a div with the id "toy-collection." When the page loads, make a 'GET' request to fetch all the toy objects. With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
   */
  const getToy = () => {
    fetch(toyUrl)
      .then(res => res.json())
      .then(toys => toys.forEach(toy => createToyCard(toy))) //Call creatingElements to render a card for each toy
      .catch(err => alert(err));
  };
  getToy();

  /*2. Each card should have the following child elements: --- need to append to card after creating each element
     - h2 tag with the toy's name
     - img tag with the src of the toy's image attribute and the class name "toy-avatar"
     - p tag with how many likes that toy has
     - button tag with a class "like-btn" and an id attribute set to the toy's id number 
*/
  const createToyCard = toy => {
    const card = document.createElement("div");
    divToyCollection.append(card);

    //create elements to append to card
    card.className = "card";
    card.id = toy.id;
    const h2 = document.createElement("h2");
    const img = document.createElement("img");
    img.className = "toy-avatar";
    const p = document.createElement("p");
    const btn = document.createElement("button");
    btn.className = "like-btn";

    //Insert content from db.json to elements
    h2.textContent = toy.name;
    img.src = toy.image;
    img.alt = toy.name;
    p.textContent = `${toy.likes} Likes`;
    btn.id = `toy_${toy.id}`;
    btn.textContent = "Like ❤️";

    //append elements to card
    card.append(h2, img, p, btn);

    /////////////Patch

    /* 
    When a user clicks on a toy's like button, two things should happen:

    A patch request (i.e., method: "PATCH") should be sent to the server at http://localhost:3000/toys/:id, updating the number of likes that the specific toy has
    If the patch is successful, the toy's like count should be updated in the DOM without reloading the page
    The patch request enables us to update an existing toy. The request will look very similar to our "POST" request except that we need to include the id of the toy we're updating in the path.
    
    To get this working, you will need to add an event listener to each toy's "Like" button. When the button is clicked for a toy, your code should:
    - capture that toy's id,
    - calculate the new number of likes,
    - submit the patch request, and
    - update the toy's card in the DOM based on the Response returned by the fetch request. 
    */
    btn.addEventListener("click", event => {
      fetch(`${toyUrl}/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: ++toy.likes }),
      })
        .then(response => response.json())
        .then(updatedToy => {
          event.target.parentElement.querySelector(
            "p",
          ).textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => alert(error));
    });
  };

  /////////////Post

  /* 
When a user submits the toy form, two things should happen:
A POST request should be sent to http://localhost:3000/toys and the new toy added to Andy's Toy Collection.
If the post is successful, the toy should be added to the DOM without reloading the page.
In order to send a POST request via fetch(), give the fetch() a second argument of an object. This object should specify the method as POST and also provide the appropriate headers and the JSON data for the request. 
*/
  const postToy = newToy => {
    fetch("http://localhost:3000/toys", {
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
      .then(newToyCard => createToyCard(newToyCard)); //create a card for a new toy after triggering createToyCard function after clicking submit button
  };

  //add submit event listener to form
  //New toy added to Andy's Toy Collection after clicking on a submit button ()
  toyForm.addEventListener("submit", e => {
    e.preventDefault();
    postToy(toyForm); //postToy(e.target), //Trigger postToy function after clicking submit button along with new toy cards
    e.target.reset();
  });
});
