/*
 * Name: Hairong Wu (Jason)
 * Date: May 19, 2020
 * Section: CSE 154 AG
 * This is the JS to implement commenting function in the index.html. It can fetch data from a
 * server and sync the data on the visual webpage.
 */

"use strict";
(function() {

  const BASE_URL = "https://api.lyrics.ovh/v1/";
  const BUGAVOIDER = 1;
  const NULLSIZE = -1;
  let artist, title, size;

  window.addEventListener("load", init);

  /**
   * sets up necessary functionality when page loads
   */
  function init() {
    getServer();
    qs("button#search").addEventListener("click", makeRequest);
  }

  /**
   * Sync to the server data
   */
  function getServer() {
    let url = "/data";
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(initializeHTML)
      .catch(console.error);
  }

  /**
   * Execute server data to the web performance
   * @param {*} data - data fectched from the server
   */
  function initializeHTML(data) {
    if (!Object.keys(data)) {
      size = NULLSIZE;
    } else {
      size = Object.keys(data).length - BUGAVOIDER;
    }
    for (let i = 0; i < size + BUGAVOIDER; i++) {
      artist = data[i]["artist"];
      title = data[i]["title"];
      addEntry(data[i]);
    }
  }

  /**
   * Make request on the desired url. By checking the status will it make further operations or
   * handle the errors.
   */
  function makeRequest() {
    artist = id("new-artist").value;
    title = id("newtitle").value;
    let url = BASE_URL + artist + "/" + title;
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(addHist)
      .catch(console.error);
    fetch(url)
      .then(checkStatus)
      .then(RESP => RESP.json())
      .then(addEntry)
      .catch(console.error);
  }

  /**
   * Add new search history to the server.
   * @param {*} resp - responsedc object from the server
   */
  function addHist(resp) {
    size = size + 1;
    let url = "/data";
    let params = new FormData();
    params.append("num", size);
    params.append("artist", artist);
    params.append("title", title);
    params.append("lyrics", resp["lyrics"]);
    fetch(url, {method: "POST", body: params})
      .then(checkStatus)
      .catch(console.error);
  }

  /**
   * Function to add a new search to the Board Histroy.
   * @param {*} data - feteched data from the url.
   */
  function addEntry(data) {
    checkNotFound();
    let date;
    if (!data["date"]) {
      date = data["date"];
    } else {
      date = (new Date()).toLocaleDateString();
    }
    let container = document.createElement("article");
    container.id = "board";
    let h2 = document.createElement("h2");
    let h3 = document.createElement("h3");
    let h4 = document.createElement("h4");
    let lyric = dealLyrics(data["lyrics"]);
    h2.textContent = "\"" + title + "\"";
    h3.textContent = artist;
    h4.textContent = "Date: " + date;
    let commentcontainer = creatCommentContainer(data["conmment"]);
    container.appendChild(h2);
    container.appendChild(h3);
    container.appendChild(h4);
    container.appendChild(lyric);
    container.appendChild(commentcontainer);
    id("board").appendChild(container);
  }

  /**
   * Return a article container with p tags of lyrics.
   * @param {*} str - a string represent the lyrics.
   * @returns {article} - article container with p tags.
   */
  function dealLyrics(str) {
    let container = document.createElement("article");
    let lst = str.split("\n");
    for (let i = 0; i < lst.length; i++) {
      let pTag = document.createElement("p");
      pTag.id = "lyrics";
      pTag.textContent = lst[i];
      container.appendChild(pTag);
    }
    return container;
  }

  /**
   * Function to add comments to an existing history.
   */
  function addSubEntry() {
    let tar, subusername, subcomment;
    tar = this.parentElement;
    subusername = tar.children[1].value;
    subcomment = tar.children[3].value;
    let subcontainer = document.createElement("article");
    subcontainer.id = "subcontainer";
    let subh4 = document.createElement("h4");
    let subcontents = document.createElement("p");
    subh4.textContent = "User Name: " + subusername;
    subcontents.textContent = subcomment;
    subcontainer.appendChild(subh4);
    subcontainer.appendChild(subcontents);
    tar.appendChild(subcontainer);
  }

  /**
   * Return a comentcontainner for appending a comment.
   * @returns {object} - DOM object associated with id.
   */
  function creatCommentContainer() {
    let commentcontainer = document.createElement("section");
    commentcontainer.id = "subpost";
    let subnameLabel = document.createElement("label");
    let subname = document.createElement("input");
    let subcommentLabel = document.createElement("label");
    let subcomment = document.createElement("input");
    let subbutton = document.createElement("button");
    let subboard = document.createElement("section");
    let subboardh2 = document.createElement("h4");
    subboardh2.textContent = "Comments";
    subname.id = "subname";
    subname.type = "text";
    subboard.id = "subboard";
    subcomment.id = "subcomment";
    subcomment.type = "text";
    subbutton.id = "subbutton";
    subnameLabel.textContent = "Nickname: ";
    subcommentLabel.textContent = "New Comment: ";
    subbutton.textContent = "Post!";
    subbutton.addEventListener("click", addSubEntry);
    subboard.appendChild(subboardh2);
    commentcontainer.appendChild(subnameLabel);
    commentcontainer.appendChild(subname);
    commentcontainer.appendChild(subcommentLabel);
    commentcontainer.appendChild(subcomment);
    commentcontainer.appendChild(subbutton);
    commentcontainer.appendChild(subboard);
    return commentcontainer;
  }

  /**
   * Check whether the fetch is valid for following operations.
   * @param {*} response - response object fetech by url.
   * @returns {response} - a promise with the fetched data.
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else if (response.statusText === "Not Found") {
      checkNotFound();
      let container = document.createElement("article");
      container.id = "not-found";
      let message = document.createElement("p");
      message.textContent = "Lyrics Not Found!";
      container.appendChild(message);
      id("new-search").appendChild(container);
    } else {
      throw Error("Error in request: " + response.statusText);
    }
  }

  /**
   * Check whether there appears a "Lyrics Not Found!" message.
   * If so, remove the message for desire future operations.
   */
  function checkNotFound() {
    let tmp = id("not-found");
    if (tmp !== null) {
      id("new-search").removeChild(id("new-search").lastChild);
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

})();