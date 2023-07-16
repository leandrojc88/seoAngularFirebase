/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response} from "express";
import * as functions from "firebase-functions";
import * as express from "express";
import fetch from "node-fetch";
// import * as url from "url";

const app = express();

const appUrl = "instafire-app.firebaseapp.com";
// const renderUrl = "https://render-tron.appspot.com/render";

/**
 * Generate url
 * @param {any} request The first number.
 * @return {string} The sum of the two numbers.
 */
/* function generateUrl(request: Request) {
  return url.format({
    protocol: request.protocol,
    host: appUrl,
    pathname: request.originalUrl,
  });
} */

/**
 * List of bots to target, add more if you"d like
 * @param {string} userAgent browser agent
 * @return {boolean}
 */
function detectBot(userAgent: string) {
  const bots = [
    // search engine crawler bots
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "slurp",
    // social media link bots
    "twitterbot",
    "facebookexternalhit",
    "linkedinbot",
    "embedly",
    "baiduspider",
    "pinterest",
    "slackbot",
    "vkshare",
    "facebot",
    "outbrain",
    "w3c_validator",
  ];


  // Return true if the user-agent header matches a bot namespace
  const agent = userAgent.toLowerCase();

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log("bot detected", bot, agent);
      return true;
    }
  }

  console.log("no bots found");
  return false;
}

app.get("*", (req: Request, res: Response) => {
  const isBot = detectBot(req.headers["user-agent"] || "");

  if (isBot) {
    // const botUrl = generateUrl(req);
    // If Bot, fetch url via rendertron

    // fetch(`${renderUrl}/${botUrl}`)
    //   .then((res: Response) => res.text())
    //   .then((body: any) => {

    // Set the Vary header to cache the user agent, based on code from:
    // https://github.com/justinribeiro/pwa-firebase-functions-botrender
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.set("Vary", "User-Agent");

    res.send(
      `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>SeoAngularFirebase</title>
        <base href="/">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="favicon.ico">

        <!-- twitter -->
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@angularfirebase">
        <meta name="twitter:title" content="Static Test">
        <meta name="twitter:description" content="Lea Static Test">
        <meta name="twitter:image" content="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png">

        <!-- facebook and other social sites -->
        <meta property="og:type" content="article">
        <meta property="og:site_name" content="AngularFirebase">
        <meta property="og:title" content="Home Page">
        <meta property="og:description" content="Server side rendering">
        <meta property="og:image" content="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png">
        <meta property="og:url" content="https://instafire-app.firebaseapp.com">

      </head>
      <body>
        <app-root></app-root>
      </body>
      </html>

      `);
  } else {
    fetch(`https://${appUrl}`)
      .then((res: any) => res.text())
      .then((body: any) => {
        res.send(body.toString());
      });
  }
});

exports.app = functions.https.onRequest(app);
