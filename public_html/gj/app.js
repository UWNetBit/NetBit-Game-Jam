/*
 * Name: Hairong Wu (Jason)
 * Date: May 19, 2020
 * Section: CSE 154 AG
 * This is the app.js as backend server for cp4. It can provide fucntions to give
 * data to the other scripts.
 */

'use strict';

const express = require('express');
const app = express();
const fs = require('fs').promises;
const multer = require("multer");
const SERVER_ERR = 500;
const CLIENT_ERR = 400;
const PORT_NUM = 8000;

const JSONFILE = 'data/hist.json';

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * Implement the get function for client side.
 */
app.get('/data', async function(req, res) {
  res.type('json');
  res.send(await getHists());
});

/**
 * Get the history of searches from the backend file.
 * @param {*} res - responsed object from the fetched action
 */
async function getHists(res) {
  try {
    let contents = await fs.readFile(JSONFILE, 'utf-8');
    return JSON.parse(contents);
  } catch (err) {
    if (err.code !== "ENOENT") {
      res.status(SERVER_ERR).send("Server Error");
    } else {
      res.status(CLIENT_ERR).send("Error in read file: " + err);
    }
  }
}

/**
 * Implement the post function for client side.
 * Will send error code to handle error; otherwise, succeed message will be sent.
 */
app.post("/data", async function(req, res) {
  res.type("json");
  let num = req.body.num;
  let artist = req.body.artist;
  let title = req.body.title;
  let lyrics = req.body.lyrics;
  let comments = req.body.comments;
  if (!(artist && title && lyrics)) {
    res.status(CLIENT_ERR).send("Missing POST parameter: artist, title, and/or lyrics");
  }
  if (!comments) {
    comments = "";
  }
  let result = {"artist": artist, "title": title, "lyrics": lyrics, "comments": comments};
  let contents = await fs.readFile(JSONFILE, "utf8");
  contents = JSON.parse(contents);
  contents[num] = result;
  try {
    await fs.writeFile(JSONFILE, JSON.stringify(contents), "utf8");
  } catch (err) {
    res.status(SERVER_ERR).send("Server Error");
  }
  res.send(req.body.title + " successfully added to " + JSONFILE + "!");
});

app.use(express.static('main'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);