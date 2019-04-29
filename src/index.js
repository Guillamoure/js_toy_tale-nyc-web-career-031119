const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
// to find where all the cards go
const toyColl = document.getElementById("toy-collection")

let addToy = false

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

//runs initial fetch through this
function addCard(el) {

  //creates card
  const card = document.createElement("div")
  card.className = `card`
  card.id = el.id
  toyColl.appendChild(card)

//adds title
  const name = document.createElement("h2")
  name.innerHTML = el.name
  card.appendChild(name)

//add image, and sizes it already with the native css
  const img = document.createElement("img")
  img.src = el.image
  img.className = "toy-avatar"
  card.appendChild(img)

//add likes field
  const p = document.createElement("p")
  p.innerHTML = `Likes: ${el.likes}`
  card.appendChild(p)

//button, which i hid the likes value within
  const btn = document.createElement("button")
  btn.className = "like-btn"
  btn.id = el.id
  btn.dataset.num = el.likes
  btn.innerHTML = "Like!"
  card.appendChild(btn)
}
//start the page
fetch("http://localhost:3000/toys")
.then(res => res.json())
.then(function(json) {
  json.forEach(function(el){
    //for each here, but goes to above function
    addCard(el)
  })
})

toyColl.addEventListener("click", function(e) {
  if (e.target.nodeName === "BUTTON"){
    //grabs num of likes from button dataset, and adds one, so that it can be sent to the database
    const newNum = {"likes": `${++e.target.dataset.num}`}

    fetch(`http://localhost:3000/toys/${e.target.id}`, {
      method: "PATCH",
      headers: {
        //what the content is
        "Content-Type": "application/json",
        //what we should be getting back
        "Accept": "application/json"
      },
      //newNum is from above
      body: JSON.stringify(newNum)
    })

    .then(res => res.json())
    .then(function(json){
      //find parent container
      const container = document.getElementById(json.id)
      //find likes: string
      const p = container.querySelector("p")
      p.innerHTML = `Likes: ${json.likes}`
      //find button, and update the dataset
      const btn = container.querySelector("button")
      btn.dataset.num = json.likes
    })
  }
})

toyForm.addEventListener("submit", function(e){
  e.preventDefault();
  //grab the input
  const nameField = toyForm.querySelector("#name")
  const urlField = toyForm.querySelector("#url")
  //turn the input into the parameter for a new card
  const params = {
    "name": `${nameField.value}`,
    "image": `${urlField.value}`,
    "likes": 0
  }

  fetch(`http://localhost:3000/toys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(params)
  })
  //res is what we sent with the variable params
  .then(res => res.json())
  .then(function(json){
    addCard(json)
  })
  nameField.value = ""
  urlField.value = ""
  addToy = false
})


// OR HERE!
