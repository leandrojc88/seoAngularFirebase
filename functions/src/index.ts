/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
/*eslint-env es6*/
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');

const app = express();

const appUrl = 'instafire-app.firebaseapp.com';
const renderUrl = 'https://render-tron.appspot.com/render';

// Generates the URL
function generateUrl(request: any) {
  return url.format({
    protocol: request.protocol,
    host: appUrl,
    pathname: request.originalUrl
  });
}

// List of bots to target, add more if you'd like
function detectBot(userAgent: any) {

  const bots = [
    // search engine crawler bots
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    // social media link bots
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkshare',
    'facebot',
    'outbrain',
    'w3c_validator'
  ]


  // Return true if the user-agent header matches a bot namespace
  const agent = userAgent.toLowerCase()

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('bot detected', bot, agent)
      return true
    }
  }

  console.log('no bots found')
  return false

}

app.get('*', (req: Request, res: Response) => {

  const isBot = detectBot(req.headers['user-agent']);

  if (isBot) {

    const botUrl = generateUrl(req);
    // If Bot, fetch url via rendertron

    // fetch(`${renderUrl}/${botUrl}`)
    //   .then((res: Response) => res.text())
    //   .then((body: any) => {

    // Set the Vary header to cache the user agent, based on code from:
    // https://github.com/justinribeiro/pwa-firebase-functions-botrender
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.set('Vary', 'User-Agent');

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
        <meta property="og:description" content="Server side rendering that works with AngularFire2 - believe it">
        <meta property="og:image" content="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png">
        <meta property="og:url" content="https://instafire-app.firebaseapp.com">


      </head>
      <body>
        <app-root></app-root>
      </body>
      </html>

      `
    )

    // });

  } else {

    // Not a bot, fetch the regular Angular app
    // This is not an infinite loop because Firebase Hosting Priorities dictate index.html will be loaded first
    fetch(`https://${appUrl}`)
      .then((res: any) => res.text())
      .then((body: any) => {
        res.send(body.toString());
      })
  }

});

exports.app = functions.https.onRequest(app);
