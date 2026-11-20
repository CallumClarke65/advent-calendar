/*
 * Christmas Music — advent calendar.
 *
 * TO DO BEFORE PUBLISHING:
 *   Paste one Spotify track ID into each slot in SONGS below (slot 0 is day 1,
 *   slot 23 is day 24). A bare ID, a spotify:track: URI or a full
 *   open.spotify.com/track/... URL all work.
 *
 * TESTING:
 *   Add ?day=7 to the URL to pretend it is 7th December (1-24 only).
 *   Without that parameter, the calendar only runs on 1st-24th December.
 *
 * If you add or remove files in /img, update the IMAGES list to match.
 */
(function () {
  'use strict';

  // Every file currently in /img. The roulette cycles through all of these.
  var IMAGES = [
    'img/IMG_4859.jpg',
    'img/IMG_4939.jpg',
    'img/IMG_4944.jpg',
    'img/IMG_4947.jpg',
    'img/IMG_4957.jpg',
    'img/IMG_5044.jpg',
    'img/IMG_5046.jpg',
    'img/IMG_5055.webp',
    'img/IMG_5099.jpg',
    'img/IMG_5106.jpg',
    'img/IMG_5125.jpg',
    'img/IMG_5137.jpg',
    'img/IMG_5140.webp',
    'img/IMG_5149.jpg'
  ];

  // ---------------------------------------------------------------------------
  // FILL THIS IN: one Spotify track ID per day. Index 0 = 1 December,
  // index 23 = 24 December. Nothing else needs changing.
  // ---------------------------------------------------------------------------
  var SONGS = [
    '44mYhOVgerj2qPjkGDVA6n', // Dec 1 Its Beginning to look a lot like christmas
    '3VTNVsTTu05dmTsVFrmGpK', // Dec 2 Fairytale of New York
    '0lizgQ7Qw35od7CYaoMBZb', // Dec 3 Santa Tell Me
    '1F8tXdM8cz9bH5PiK1SuAB', // Dec 4 Wonderful Christmastime
    '1hvpDAxZPKjKztOc72sv06', // Dec 5 Do They Know Its Christmas
    '6tQlbNOGPmNhsZZedQ6B0q', // Dec 6 Stop the cavalry
    '7bomUcOZwl9IHBW29XuNR8', // Dec 7 Baby its cold outside
    '0QtJZpyfZF67QF32p41NXa', // Dec 8 Thank God its christmas
    '6rqn19AqjcM5wgI1hCYciJ', // Dec 9 Holly jolly Christmas
    '2TE4xW3ImvpltVU0cPcKUn', // Dec 10 Merry Christmas Everyone
    '0bYg9bo50gSsH3LtXe2SQn', // Dec 11 All I want for Christmas is you
    '46w8k81V0eSBx64XuVHxT2', // Dec 12 Christmas time
    '4jHl6jgzZOnS4nGamPZ1Uk', // Dec 13 Santa Baby
    '0QPYn15U8IQHKcH2LDfrek', // Dec 14 Last Christmas
    '3qcjMLT05VwLyZ8BNQgXZh', // Dec 15 White Christmas
    '0UORDNH9ZneYlamDQB7guH', // Dec 16 Feliz Navidad
    '1zOnUH1tBBLYREt1hgzvgf', // Dec 17 Sleigh Ride
    '0JoLc8rgQBJhDMolSCuRuw', // Dec 18 Jingle Bell Rock
    '1mH6tZC6iXIHPI6EixCwxw', // Dec 19 I wish it could be christmas every day
    '2VeGUtdexOkXkNXpGdbNws', // Dec 20 Christmas in LA
    '5JUXAJ6cqX9wmPB0smNci8', // Dec 21 Merry Xmas Everybody
    '27RYrbL6S02LNVhDWVl38b', // Dec 22 War is over
    '6sBWmE23q6xQHlnEZ8jYPT', // Dec 23 Step into Christmas
    '4fzyvSu73BhGvi96p2zwjL', // Dec 24 Christmas Lights
  ];

  // A different little cast of characters for each day (Unicode emoji, so no
  // external assets or licences to worry about).
  var DECORATIONS = [
    ['🐧', '🎄'], ['🎅', '🎁'], ['⛄', '❄️'], ['🦌', '🔔'],
    ['🧝', '🍬'], ['🐧', '⭐'], ['🎅', '🛷'], ['⛄', '🎄'],
    ['🦌', '🎁'], ['🧝', '🔔'], ['🐧', '🍬'], ['🎅', '❄️'],
    ['⛄', '⭐'], ['🦌', '🎄'], ['🧝', '🎁'], ['🐧', '🔔'],
    ['🎅', '🍬'], ['⛄', '🎁'], ['🦌', '⭐'], ['🧝', '🎄'],
    ['🐧', '🎁'], ['🎅', '🔔'], ['⛄', '🍬'], ['🦌', '🛷']
  ];

  var DECOR_SPOTS = [
    { top: '7%', left: '3%' },
    { top: '9%', right: '4%' },
    { bottom: '9%', left: '5%' },
    { bottom: '11%', right: '3%' },
    { top: '45%', left: '1%' },
    { top: '49%', right: '1%' }
  ];

  var LOAD_MS = 10000; // The fake loading takes about ten seconds.
  var FADE_MS = 600;   // Keep longer than the fastest roulette change.
  var BULB_COLOURS = ['#c9a227', '#8b0016', '#2e8b57', '#f2e3b3'];
  var FLAKES = ['❄', '❅'];
  var STATUS_MESSAGES = [
    { at: 0, text: 'Hanging the garland...' },
    { at: 13, text: 'Lighting the tree...' },
    { at: 28, text: 'Setting the table...' },
    { at: 42, text: 'Basting the turkey...' },
    { at: 56, text: 'Polishing the gold...' },
    { at: 70, text: 'Wrapping the music...' },
    { at: 84, text: 'One last festive touch...' },
    { at: 96, text: 'Nearly ready...' }
  ];

  var el = {};
  var thumbnails = [];
  var frontImage = null;
  var backImage = null;
  var rafId = null;
  var fadeTimer = null;
  var spin = null;
  var selectedDay = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    el.date = document.getElementById('date');
    el.unavailable = document.getElementById('unavailable');
    el.loadingArea = document.getElementById('loadingArea');
    el.resultArea = document.getElementById('resultArea');
    el.rouletteImage = document.getElementById('rouletteImage');
    el.rouletteImageNext = document.getElementById('rouletteImageNext');
    el.filmstrip = document.getElementById('filmstrip');
    el.progressFill = document.getElementById('progressFill');
    el.progressText = document.getElementById('progressText');
    el.progressTrack = document.getElementById('progressTrack');
    el.status = document.getElementById('status');
    el.qrImage = document.getElementById('qrImage');

    frontImage = el.rouletteImage;
    backImage = el.rouletteImageNext;

    buildSnow();
    buildLights(document.getElementById('lightsTop'));
    buildLights(document.getElementById('lightsBottom'));
    buildFilmstrip();

    var today = new Date();
    var day = resolveDay(today);
    el.date.textContent = buildDateText(today, day);

    if (day === null) {
      showUnavailable();
      return;
    }

    selectedDay = day;
    buildDecorations(day);
    startLoading();
  }

  /* ---------------------------- page decorations --------------------------- */

  function buildSnow() {
    var snow = document.getElementById('snow');
    for (var i = 0; i < 32; i += 1) {
      var flake = document.createElement('span');
      flake.className = 'flake';
      flake.textContent = FLAKES[Math.floor(Math.random() * FLAKES.length)];
      flake.style.left = (Math.random() * 100).toFixed(2) + '%';
      flake.style.fontSize = Math.round(10 + Math.random() * 15) + 'px';
      flake.style.setProperty('--duration', (12 + Math.random() * 12).toFixed(1) + 's');
      flake.style.setProperty('--delay', (-Math.random() * 18).toFixed(1) + 's');
      flake.style.setProperty('--drift', Math.round((Math.random() * 2 - 1) * 120) + 'px');
      snow.appendChild(flake);
    }
  }

  function buildLights(container) {
    for (var i = 0; i < 26; i += 1) {
      var bulb = document.createElement('span');
      bulb.className = 'bulb';
      bulb.style.setProperty('--bulb', BULB_COLOURS[i % BULB_COLOURS.length]);
      bulb.style.setProperty('--speed', (1.4 + Math.random() * 1.8).toFixed(2) + 's');
      bulb.style.setProperty('--delay', (-Math.random() * 2.5).toFixed(2) + 's');
      container.appendChild(bulb);
    }
  }

  function buildFilmstrip() {
    for (var i = 0; i < IMAGES.length; i += 1) {
      var thumb = document.createElement('img');
      thumb.src = IMAGES[i];
      thumb.alt = 'Festive image ' + (i + 1);
      el.filmstrip.appendChild(thumb);
      thumbnails.push(thumb);
    }
  }

  function buildDecorations(day) {
    var container = document.getElementById('decorations');
    var cast = DECORATIONS[day - 1] || DECORATIONS[0];

    for (var i = 0; i < cast.length; i += 1) {
      var character = document.createElement('span');
      var spot = DECOR_SPOTS[(day - 1 + i) % DECOR_SPOTS.length];
      character.className = 'decor';
      character.textContent = cast[i];
      character.style.top = spot.top || '';
      character.style.right = spot.right || '';
      character.style.bottom = spot.bottom || '';
      character.style.left = spot.left || '';
      character.style.setProperty('--duration', (1.8 + ((day + i) % 5) * 0.35).toFixed(2) + 's');
      character.style.setProperty('--delay', (-((day + i) % 7) * 0.3).toFixed(2) + 's');
      container.appendChild(character);
    }
  }

  /* ------------------------------- date logic ------------------------------ */

  function resolveDay(today) {
    var raw = null;
    try {
      raw = new URLSearchParams(window.location.search).get('day');
    } catch (error) {
      raw = null;
    }

    if (raw !== null && /^\d+$/.test(raw)) {
      var requested = Number(raw);
      if (requested >= 1 && requested <= SONGS.length) { return requested; }
    }

    if (today.getMonth() === 11 && today.getDate() <= SONGS.length) {
      return today.getDate();
    }

    return null;
  }

  function buildDateText(today, day) {
    if (day !== null) {
      var decemberDate = new Date(today.getFullYear(), 11, day, 12);
      var weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(decemberDate);
      return 'Today is ' + weekday + ' ' + ordinal(day) + ' December!';
    }

    var parts = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).formatToParts(today);

    function part(type) {
      for (var i = 0; i < parts.length; i += 1) {
        if (parts[i].type === type) { return parts[i].value; }
      }
      return '';
    }

    return 'Today is ' + part('weekday') + ' ' + ordinal(Number(part('day'))) + ' ' + part('month') + '!';
  }

  function ordinal(n) {
    var lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 13) { return n + 'th'; }
    switch (n % 10) {
      case 1: return n + 'st';
      case 2: return n + 'nd';
      case 3: return n + 'rd';
      default: return n + 'th';
    }
  }

  function showUnavailable() {
    el.loadingArea.hidden = true;
    el.resultArea.hidden = true;
    el.unavailable.hidden = false;
  }

  /* -------------------------- roulette + fake bar -------------------------- */

  function startLoading() {
    document.body.classList.remove('state-result');

    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (fadeTimer !== null) {
      window.clearTimeout(fadeTimer);
      fadeTimer = null;
    }

    el.loadingArea.hidden = false;
    el.resultArea.hidden = true;
    el.unavailable.hidden = true;
    el.progressFill.style.width = '0%';
    updateProgress(0);
    el.status.textContent = STATUS_MESSAGES[0].text;

    resetImages();

    spin = {
      start: window.performance.now(),
      steps: buildSchedule(LOAD_MS),
      stepIndex: 0,
      progress: 0,
      lastChange: window.performance.now(),
      imageIndex: Math.floor(Math.random() * IMAGES.length),
      targetIndex: (selectedDay - 1) % IMAGES.length,
      finished: false
    };

    setFrontImage(spin.imageIndex);
    rafId = window.requestAnimationFrame(tick);
  }

  // A lumpy, stuttering series of progress steps that sits at 99% and only
  // snaps to 100% when the ten seconds are up.
  function buildSchedule(totalMs) {
    var steps = [];
    var elapsed = 0;
    var progress = 0;

    while (elapsed < totalMs) {
      var stall = Math.random() < 0.18;
      var duration = stall ? randomBetween(350, 950) : randomBetween(60, 290);
      duration = Math.min(duration, totalMs - elapsed);
      if (duration <= 0) { break; }

      var fairShare = (duration / totalMs) * 100;
      var jump = stall ? randomBetween(0, fairShare * 0.25) : fairShare * randomBetween(0.25, 2.6);
      jump = Math.min(jump, 99 - progress);
      if (jump < 0) { jump = 0; }

      elapsed += duration;
      progress += jump;
      steps.push({ at: elapsed, progress: progress });
    }

    steps.push({ at: totalMs, progress: 100 });
    return steps;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function tick(now) {
    if (!spin || spin.finished) { return; }

    var elapsed = now - spin.start;
    while (spin.stepIndex < spin.steps.length - 1 &&
      spin.steps[spin.stepIndex + 1].at <= elapsed) {
      spin.stepIndex += 1;
    }

    spin.progress = spin.steps[spin.stepIndex].progress;
    updateProgress(spin.progress);

    var message = STATUS_MESSAGES[0];
    for (var i = 0; i < STATUS_MESSAGES.length; i += 1) {
      if (spin.progress >= STATUS_MESSAGES[i].at) { message = STATUS_MESSAGES[i]; }
    }
    if (el.status.textContent !== message.text) { el.status.textContent = message.text; }

    if (spin.progress < 100) {
      // Deliberately unhurried, and slower still towards the end.
      var delay = 650 + Math.pow(spin.progress / 100, 3) * 1950;
      if (now - spin.lastChange >= delay) {
        spin.lastChange = now;
        fadeTo(nextSpinIndex(spin.progress));
      }
    }

    if (elapsed >= LOAD_MS) {
      finish();
      return;
    }

    rafId = window.requestAnimationFrame(tick);
  }

  function nextSpinIndex(progress) {
    if (IMAGES.length < 2) { return 0; }

    // Near the end, drift towards the day's image so the roulette settles.
    if (progress > 82 && Math.random() < 0.6) {
      var distance = (spin.targetIndex - spin.imageIndex + IMAGES.length) % IMAGES.length;
      return distance <= 2 ? spin.targetIndex : (spin.imageIndex + 1) % IMAGES.length;
    }

    var next = spin.imageIndex;
    while (next === spin.imageIndex) {
      next = Math.floor(Math.random() * IMAGES.length);
    }
    return next;
  }

  function resetImages() {
    frontImage.className = 'front';
    frontImage.setAttribute('aria-hidden', 'false');
    backImage.className = '';
    backImage.alt = '';
    backImage.setAttribute('aria-hidden', 'true');
  }

  function setFrontImage(index) {
    frontImage.src = IMAGES[index];
    frontImage.alt = altFor(index);
    frontImage.className = 'front';
    frontImage.setAttribute('aria-hidden', 'false');
    backImage.className = '';
    backImage.alt = '';
    backImage.setAttribute('aria-hidden', 'true');
    updateThumbs(index);
  }

  function fadeTo(index) {
    if (fadeTimer !== null) {
      window.clearTimeout(fadeTimer);
      fadeTimer = null;
      resetImages();
    }

    var outgoing = frontImage;
    var incoming = backImage;

    incoming.src = IMAGES[index];
    incoming.alt = '';
    incoming.className = '';
    incoming.setAttribute('aria-hidden', 'true');
    void incoming.offsetWidth; // commit the transparent starting position

    incoming.classList.add('fade-in');
    outgoing.classList.remove('front');
    outgoing.classList.add('fade-out');
    outgoing.setAttribute('aria-hidden', 'true');

    spin.imageIndex = index;
    updateThumbs(index);

    fadeTimer = window.setTimeout(function () {
      outgoing.className = '';
      outgoing.setAttribute('aria-hidden', 'true');
      incoming.className = 'front';
      incoming.alt = altFor(index);
      incoming.setAttribute('aria-hidden', 'false');
      frontImage = incoming;
      backImage = outgoing;
      fadeTimer = null;
    }, FADE_MS);
  }

  function altFor(index) {
    return 'Festive image ' + (index + 1) + ' of ' + IMAGES.length + ' in the roulette';
  }

  function updateThumbs(index) {
    for (var i = 0; i < thumbnails.length; i += 1) {
      thumbnails[i].classList.toggle('active', i === index);
    }
  }

  function updateProgress(progress) {
    var shown = Math.min(100, Math.floor(progress));
    el.progressFill.style.width = Math.min(100, progress).toFixed(1) + '%';
    el.progressText.textContent = shown + '%';
    el.progressTrack.setAttribute('aria-valuenow', String(shown));
  }

  function finish() {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (fadeTimer !== null) {
      window.clearTimeout(fadeTimer);
      fadeTimer = null;
    }

    spin.finished = true;
    updateProgress(100);
    setFrontImage(spin.targetIndex);

    var rawId = String(SONGS[selectedDay - 1] || '').trim();
    var url = spotifyUrl(rawId);

    el.resultArea.setAttribute('aria-label', 'QR code for day ' + selectedDay);
    el.qrImage.src = qrUrl(url);
    el.qrImage.alt = 'QR code linking to ' + url + ' for day ' + selectedDay;

    document.body.classList.add('state-result');
    el.loadingArea.hidden = true;
    el.resultArea.hidden = false;
  }

  /* -------------------------------- spotify -------------------------------- */

  function spotifyUrl(value) {
    if (!value) { return 'https://open.spotify.com/search/christmas'; }
    if (/^https?:\/\//i.test(value)) { return value; }
    var id = value.replace(/^spotify:track:/i, '').replace(/^track:/i, '');
    return 'https://open.spotify.com/track/' + encodeURIComponent(id);
  }

  function qrUrl(url) {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=320x320&ecc=M&margin=12&data=' +
      encodeURIComponent(url);
  }
}());
