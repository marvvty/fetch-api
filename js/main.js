class PhotoModel {
  async getCats(limit = 10) {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}`
    );

    return response.json();
  }

  async getDogs() {
    const response = await fetch(
      `https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=10`
    );

    return response.json();
  }

  async getAiCats() {}
}

class Post {
  constructor(id, userId, url, title) {
    this.id = id;
    this.userId = userId;
    this.url = url;
    this.title = title;
  }
  static fromJson(json) {
    return new Post(json.id, json.userId, json.url, json.title);
  }
}

class PostView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  createPosts(photos) {
    this.container.innerHTML = "";
    photos.forEach((json) => {
      this.container.append(this.createCard(json));
    });
  }

  appendPosts(photos) {
    photos.forEach((json) => {
      this.container.append(this.createCard(json));
    });
  }

  createCard(json) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.append(
      this.createUser(json),
      this.createTitle(json),
      this.createImage(json)
    );

    return card;
  }

  createUser(json) {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");

    const userLink = document.createElement("a");
    userLink.classList.add("link");
    userLink.href = "#";

    const userAvatar = document.createElement("img");
    userAvatar.classList.add("user__avatar");
    userAvatar.src = json.url;

    const userName = document.createElement("p");
    userName.classList.add("user__name");
    userName.textContent = json.id;

    const postCreationTime = document.createElement("p");
    postCreationTime.classList.add("post-time");
    postCreationTime.textContent = Math.floor(Math.random() * 24) + `hr. ago`;

    userLink.append(userAvatar, userName);
    userDiv.append(userLink, postCreationTime);

    return userDiv;
  }

  createTitle(photo) {
    const linkToPost = document.createElement("a");
    linkToPost.classList.add("link");
    linkToPost.href = "#";

    const cardTitle = document.createElement("h3");
    cardTitle.classList.add("card__title");
    cardTitle.textContent = photo.width + photo.height;

    linkToPost.append(cardTitle);

    return linkToPost;
  }

  createImage(photo) {
    const linkToPhoto = document.createElement("a");
    linkToPhoto.classList.add("link");
    linkToPhoto.href = "#";

    const cardImage = document.createElement("img");
    cardImage.classList.add("card__image");
    cardImage.src = photo.url;

    linkToPhoto.append(cardImage);

    return linkToPhoto;
  }
}

class PhotoController {
  constructor() {
    this.model = new PhotoModel();
    this.view = new PostView("card-container");
    this.loading = false;

    this.catsBtn = document.getElementById("catsBtn");
    this.dogsBtn = document.getElementById("dogsBtn");
  }

  async init() {
    const photos = await this.model.getCats();
    this.view.createPosts(photos);

    this.loadMoreCards();
    this.addBtnListeners();
  }

  addBtnListeners() {
    this.dogsBtn.addEventListener("click", async () => {
      const getDogsPhotos = await this.model.getDogs();
      this.view.createPosts(getDogsPhotos);
      this.catsBtn.classList.remove("controller__btn--active");
      this.dogsBtn.classList.add("controller__btn--active");
    });

    this.catsBtn.addEventListener("click", async () => {
      const getCatsPhotos = await this.model.getCats();
      this.view.createPosts(getCatsPhotos);
      this.catsBtn.classList.add("controller__btn--active");
      this.dogsBtn.classList.remove("controller__btn--active");
    });
  }

  loadMoreCards() {
    const container = this.view.container;
    container.addEventListener("scroll", async () => {
      const lastCard = container.querySelector(".card:last-child");

      const threeCardsOffset = lastCard.offsetHeight * 3;

      const scrollBottom = container.scrollTop + container.clientHeight;
      const scrollTrigger = lastCard.offsetTop + lastCard.offsetHeight;

      if (scrollBottom >= scrollTrigger - threeCardsOffset) {
        if (this.loading) return;

        this.loading = true;

        const loadMorePosts = await this.selectPostsType();
        this.view.appendPosts(loadMorePosts);

        this.loading = false;
      }
    });
  }

  isCatBtnContainClass() {
    const isContain = this.catsBtn.classList.contains(
      "controller__btn--active"
    );
    if (isContain) {
      return true;
    } else {
      return false;
    }
  }

  selectPostsType() {
    if (this.isCatBtnContainClass()) {
      return this.model.getCats();
    } else {
      return this.model.getDogs();
    }
  }
}

new PhotoController().init();
