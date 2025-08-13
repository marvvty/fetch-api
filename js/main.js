class PhotoModel {
  async getPhotos(limit = 10) {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}`
    );

    return response.json();
  }
}

class PhotoView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  createPost(photos) {
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
    this.view = new PhotoView("card-container");

    this.loading = false;
  }

  async init() {
    const photos = await this.model.getPhotos();
    this.view.createPost(photos);

    this.loadMoreCards();
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

        const loadMorePosts = await this.model.getPhotos();
        this.view.createPost(loadMorePosts);

        this.loading = false;
      }
    });
  }
}

new PhotoController().init();
