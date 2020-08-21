/*
 * Name: Hairong Wu (Jason)
 * Date: May 19, 2020
 * Section: CSE 154 AG
 * This is the JS to implement commenting function in the index.html. It can fetch data from a
 * server and sync the data on the visual webpage.
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  function init() {
    var myFullpage = new fullpage('#fullpage', {
      verticalCentered: false,
      //to avoid problems with css3 transforms and fixed elements in Chrome, as detailed here: https://github.com/alvarotrigo/fullPage.js/issues/208
      css3:false
    });

    
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