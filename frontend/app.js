/* ================================================================
   qurool's portfolio — app.js  v14  (ASCII fill → fade reveal)
   ================================================================ */
;(function () {
    'use strict';

    /* ────────────────────────────────────────────────────────────
       0.  ASCII CHARACTER RAIN
       ──────────────────────────────────────────────────────────── */
    var rain = document.getElementById('pixelRain');
    var rCtx = rain.getContext('2d');
    var chars = [];
    var CHAR_COUNT = 350;
    var CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\\\'\"';

    function sizeRain () {
        rain.width  = window.innerWidth;
        rain.height = window.innerHeight;
    }
    function seedChars () {
        chars = [];
        for (var i = 0; i < CHAR_COUNT; i++) {
            chars.push({
                x:  Math.random() * rain.width,
                y:  Math.random() * rain.height,
                ch: CHARSET[Math.floor(Math.random() * CHARSET.length)],
                sz: 10 + Math.floor(Math.random() * 14),
                a:  Math.random(),
                ta: Math.random(),
                sp: 0.01 + Math.random() * 0.03,
                cd: Math.random() * 60 | 0,
                rc: Math.random() * 200 | 0
            });
        }
    }
    function loopRain () {
        rCtx.clearRect(0, 0, rain.width, rain.height);
        for (var i = 0; i < chars.length; i++) {
            var c = chars[i];
            if (Math.abs(c.a - c.ta) < 0.02) {
                if (c.cd > 0) c.cd--;
                else { c.ta = Math.random(); c.cd = Math.random() * 60 | 0; }
            }
            c.a += (c.ta - c.a) * c.sp;
            c.rc--;
            if (c.rc <= 0) {
                c.ch = CHARSET[Math.floor(Math.random() * CHARSET.length)];
                c.rc = 80 + Math.random() * 200 | 0;
            }
            rCtx.font = c.sz + 'px W95FA, Courier New, monospace';
            rCtx.fillStyle = 'rgba(255,255,255,' + c.a.toFixed(3) + ')';
            rCtx.fillText(c.ch, c.x | 0, c.y | 0);
        }
        requestAnimationFrame(loopRain);
    }
    sizeRain(); seedChars(); loopRain();
    window.addEventListener('resize', function () { sizeRain(); seedChars(); });

    /* ────────────────────────────────────────────────────────────
       1.  ENTER SCREEN — wait for Enter key or click
       ──────────────────────────────────────────────────────────── */
    var intro = document.getElementById('intro');
    var entered = false;

    function triggerEnter () {
        if (entered) return;
        entered = true;
        document.removeEventListener('keydown', onEnterKey);
        startTransition();
    }

    function onEnterKey (e) {
        if (e.key === 'Enter') {
            triggerEnter();
        }
    }
    document.addEventListener('keydown', onEnterKey);

    var enterBox = document.querySelector('.enter-box');
    var enterTextEl = document.querySelector('.enter-text');
    var SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:<>?/~`░▒▓█';
    var scrambleInterval = null;
    var FINAL_TEXT = 'enter';

    if (enterBox && enterTextEl) {
        enterBox.style.cursor = 'pointer';

        enterBox.addEventListener('mouseenter', function () {
            var frame = 0;
            var maxFrames = 12;
            clearInterval(scrambleInterval);
            scrambleInterval = setInterval(function () {
                var result = '';
                for (var i = 0; i < FINAL_TEXT.length; i++) {
                    if (frame >= maxFrames - 2 || Math.random() < frame / maxFrames) {
                        result += FINAL_TEXT[i];
                    } else {
                        result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                    }
                }
                enterTextEl.textContent = result;
                frame++;
                if (frame >= maxFrames) {
                    clearInterval(scrambleInterval);
                    enterTextEl.textContent = FINAL_TEXT;
                }
            }, 50);
        });

        enterBox.addEventListener('mouseleave', function () {
            clearInterval(scrambleInterval);
            enterTextEl.textContent = FINAL_TEXT;
        });

        enterBox.addEventListener('click', function () {
            triggerEnter();
        });
    }

    /* ────────────────────────────────────────────────────────────
       2.  ASCII FILL → FADE REVEAL TRANSITION

       Screen fills instantly with dense random ASCII characters.
       Each character fades out at its own random time, gradually
       revealing the main page underneath.
       ──────────────────────────────────────────────────────────── */
    var burstC = document.getElementById('burstCanvas');
    var bCtx   = burstC.getContext('2d');

    function sizeBurst () {
        burstC.width  = window.innerWidth;
        burstC.height = window.innerHeight;
    }
    sizeBurst();
    window.addEventListener('resize', sizeBurst);

    function startTransition () {
        var enterWrap = document.querySelector('.enter-wrap');
        if (enterWrap) {
            enterWrap.style.transition = 'opacity 0.3s ease';
            enterWrap.style.opacity = '0';
        }

        setTimeout(function () {
            intro.classList.remove('active');
            portfolio.classList.add('show');
            setupNav();
            setupScrollFade();
            animateCounters();
            doCharFadeReveal();
        }, 350);
    }

    function doCharFadeReveal () {
        burstC.classList.add('active');

        var W = burstC.width;
        var H = burstC.height;
        var CELL = 16;
        var FILL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        var duration = 1800;
        var startTime = performance.now();
        var frameCount = 0;

        // build dense grid — each char has its own fade-out timing
        var grid = [];
        for (var gy = 0; gy < H + CELL; gy += CELL) {
            for (var gx = 0; gx < W + CELL; gx += CELL) {
                // each character picks a random time to start fading
                var fadeStart = 0.1 + Math.random() * 0.55;
                var fadeDur = 0.15 + Math.random() * 0.25;
                grid.push({
                    x: gx,
                    y: gy,
                    ch: FILL_CHARS[Math.floor(Math.random() * FILL_CHARS.length)],
                    changeTick: 1 + Math.floor(Math.random() * 3),
                    fadeStart: fadeStart,
                    fadeEnd: fadeStart + fadeDur
                });
            }
        }

        (function animReveal (now) {
            var elapsed = now - startTime;
            var rawP = Math.min(elapsed / duration, 1);
            frameCount++;

            bCtx.clearRect(0, 0, W, H);

            // black background that also fades
            var bgAlpha = rawP < 0.5 ? 1 : 1 - ((rawP - 0.5) / 0.5);
            bCtx.fillStyle = 'rgba(0,0,0,' + bgAlpha.toFixed(3) + ')';
            bCtx.fillRect(0, 0, W, H);

            // draw each character
            var anyAlive = false;
            for (var i = 0; i < grid.length; i++) {
                var gc = grid[i];

                // character alpha based on its personal fade timing
                var alpha;
                if (rawP < gc.fadeStart) {
                    alpha = 0.4;
                } else if (rawP < gc.fadeEnd) {
                    alpha = 0.4 * (1 - ((rawP - gc.fadeStart) / (gc.fadeEnd - gc.fadeStart)));
                } else {
                    alpha = 0;
                }

                if (alpha < 0.01) continue;
                anyAlive = true;

                // keep scrambling while visible
                if (frameCount % gc.changeTick === 0) {
                    gc.ch = FILL_CHARS[Math.floor(Math.random() * FILL_CHARS.length)];
                }

                bCtx.globalAlpha = alpha;
                bCtx.font = CELL + 'px W95FA, Courier New, monospace';
                bCtx.fillStyle = '#fff';
                bCtx.fillText(gc.ch, gc.x, gc.y);
            }

            bCtx.globalAlpha = 1;

            if (anyAlive && rawP < 1) {
                requestAnimationFrame(animReveal);
            } else {
                burstC.classList.remove('active');
            }
        })(startTime);
    }

    /* ────────────────────────────────────────────────────────────
       3.  SHOW PORTFOLIO
       ──────────────────────────────────────────────────────────── */
    var portfolio = document.getElementById('portfolio');
    var scroller  = document.getElementById('scroller');

    function showPortfolio () {
        intro.classList.remove('active');
        portfolio.classList.add('show');
        setupNav();
        setupScrollFade();
        animateCounters();
    }

    /* ────────────────────────────────────────────────────────────
       4.  PARTNERS GRID (30 slots)
       ──────────────────────────────────────────────────────────── */
    var pgrid = document.getElementById('partnersGrid');
    for (var i = 1; i <= 30; i++) {
        (function (idx) {
            var el = document.createElement('div');
            el.className = 'p-slot';
            var img = document.createElement('img');
            img.src = '../assets/' + idx + '.png';
            img.alt = 'partner ' + idx;
            img.loading = 'lazy';
            img.onerror = function () {
                this.remove();
                var n = document.createElement('span');
                n.className = 'p-num';
                n.textContent = String(idx).padStart(2, '0');
                el.appendChild(n);
            };
            el.appendChild(img);
            pgrid.appendChild(el);

            el.style.cursor = 'pointer';
            el.addEventListener('click', function () {
                var twitters = {
                    1: 'https://x.com/bulktrade',
                    2: 'https://x.com/liquidtrading',
                    3: 'https://x.com/re',
                    4: 'https://x.com/AethirCloud',
                    5: 'https://x.com/soon_svm',
                    6: 'https://x.com/ionet',
                    7: 'https://x.com/BoinkersIO',
                    8: 'https://x.com/hyperlane',
                    9: 'https://x.com/superformxyz',
                    10: 'https://x.com/Owlto_Finance',
                    11: 'https://x.com/Calderaxyz',
                    12: 'https://x.com/reya_xyz',
                    13: 'https://x.com/reddio_com',
                    14: 'https://x.com/swisstronik',
                    15: 'https://x.com/skate_chain',
                    16: 'https://x.com/nftperp',
                    17: 'https://x.com/Lends_so',
                    18: 'https://x.com/assisterr',
                    19: 'https://x.com/irys_xyz',
                    20: 'https://x.com/SuccinctLabs',
                    21: 'https://discord.gg/QPDrFjFX',
                    22: 'https://x.com/glider_fi',
                    23: 'https://x.com/yupp_ai',
                    24: 'https://x.com/magicblock',
                    25: 'https://x.com/codex_pbc',
                    26: 'https://x.com/domaprotocol',
                    27: 'https://x.com/openmind_agi',
                    28: 'https://x.com/burnt_xion',
                    29: 'https://x.com/TeaFi_Official',
                    30: 'https://x.com/fragmetric'
                };
                if (twitters[idx]) {
                    window.open(twitters[idx], '_blank');
                }
            });
        })(i);
    }

    /* ────────────────────────────────────────────────────────────
       5.  SIDE NAV
       ──────────────────────────────────────────────────────────── */
    var navBtns  = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.sec');

    function setupNav () {
        navBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var sec = document.getElementById('sec' + btn.dataset.s);
                if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function updateActiveNav () {
        var vh = scroller.clientHeight;
        var mid = vh / 2;
        var closest = null, closestDist = Infinity;

        sections.forEach(function (sec) {
            var r = sec.getBoundingClientRect();
            var secMid = r.top + r.height / 2;
            var dist = Math.abs(secMid - mid);
            if (dist < closestDist) { closestDist = dist; closest = sec; }
        });

        if (closest) {
            var idx = closest.dataset.idx;
            navBtns.forEach(function (b) {
                var isActive = b.dataset.s === idx;
                b.classList.toggle('active', isActive);
                b.querySelector('.nav-pip').textContent = isActive ? '■' : '□';
            });
        }
    }

    /* ────────────────────────────────────────────────────────────
       6.  SCROLL-DRIVEN FADE
       ──────────────────────────────────────────────────────────── */
    function setupScrollFade () {
        updateFade();
        scroller.addEventListener('scroll', onScroll, { passive: true });
    }

    var ticking = false;
    function onScroll () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(function () {
                updateFade();
                updateActiveNav();
                ticking = false;
            });
        }
    }

    function updateFade () {
        var vh     = scroller.clientHeight;
        var center = vh * 0.45;
        var range  = vh * 0.55;

        var items = document.querySelectorAll('.fade-row, .p-slot');
        for (var i = 0; i < items.length; i++) {
            var el   = items[i];
            var r    = el.getBoundingClientRect();
            var ey   = r.top + r.height / 2;
            var dist = Math.abs(ey - center);
            var t    = 1 - Math.min(dist / range, 1);
            var fade = 0.08 + t * 0.92;
            el.style.setProperty('--fade', fade.toFixed(3));
        }
    }

    /* ────────────────────────────────────────────────────────────
       7.  COUNTER ANIMATION
       ──────────────────────────────────────────────────────────── */
    var countersRan = false;
    function animateCounters () {
        if (countersRan) return;
        countersRan = true;
        document.querySelectorAll('.stat-num').forEach(function (el) {
            var target = +el.dataset.to;
            var dur = 1600, t0 = performance.now();
            (function tick (now) {
                var p  = Math.min((now - t0) / dur, 1);
                var ep = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(ep * target);
                if (p < 1) requestAnimationFrame(tick);
                else       el.textContent = target;
            })(t0);
        });
    }

    /* ────────────────────────────────────────────────────────────
       8.  DETAIL MODAL FOR LEAD POSITIONS
       ──────────────────────────────────────────────────────────── */
    var details = {
        aethir: {
            title: 'aethir',
            body: '<p class="modal-text">├─ 9 months on lead position</p>'
                + '<p class="modal-text">├─ management of regional ambassador team</p>'
                + '<p class="modal-text">├─ curator of 30+ ambassadors in the global team</p>'
                + '<p class="modal-text">├─ increase in activity indicators (700K+ messages in both channels during the month, over 10,000 active users)</p>'
                + '<p class="modal-text">├─ holding 12 events weekly</p>'
        },
        ionet: {
            title: 'io.net',
            body: '<p class="modal-text">├─ 1 year on lead position</p>'
                + '<p class="modal-text">├─ full leadership of the RU community</p>'
                + '<p class="modal-text">├─ assistance with UA management</p>'
                + '<p class="modal-text">├─ monthly AMA sessions with team</p>'
        },
        boinkers: {
            title: 'boinkers',
            body: '<p class="modal-text">├─ 6 months on lead position</p>'
                + '<p class="modal-text">├─ managing Telegram community</p>'
                + '<p class="modal-text">├─ helping users with problems via tickets</p>'
                + '<p class="modal-text">├─ assisting with AMA sessions</p>'
                + '<p class="modal-text">├─ providing feedback about the product</p>'
        },
        liquid: {
            title: 'liquid',
            body: '<p class="modal-text">├─ 1 month on lead position (still on)</p>'
                + '<p class="modal-text">├─ reviewing and analyzing portfolios for promotion</p>'
                + '<p class="modal-text">├─ hosting contests for the guild</p>'
                + '<p class="modal-text">├─ conducting AMA sessions on improving content</p>'
                + '<p class="modal-text">├─ compiling the best works of the week</p>'
                + '<p class="modal-text">├─ collaboration with KOLs to promote the project</p>'
        },
        soon: {
            title: 'soon',
            body: '<p class="modal-text">├─ 18 months on lead position</p>'
                + '<p class="modal-text">├─ conducting AMA sessions</p>'
                + '<p class="modal-text">├─ assistance with building an ambassador program</p>'
                + '<p class="modal-text">├─ hosting events / one with co-founder Joanna Zeng</p>'
                + '<p class="modal-text">├─ creating Notion pages for the community</p>'
        },
        re: {
            title: 're',
            body: '<p class="modal-text">├─ 3 months on lead position</p>'
                + '<p class="modal-text">├─ helping users in chat</p>'
                + '<p class="modal-text">├─ recommendations for promoting people</p>'
                + '<p class="modal-text">├─ translating important product announcements</p>'
        }
    };

    var modal = document.getElementById('detailModal');
    var modalTitle = document.getElementById('modalTitle');
    var modalBody = document.getElementById('modalBody');
    var modalClose = document.getElementById('modalClose');
    var modalHeaderArt = document.getElementById('modalHeaderArt');

    document.querySelectorAll('.card-details-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var key = btn.closest('.card').dataset.detail;
            if (details[key]) {
                modalHeaderArt.textContent = '┌────────────────────────────────┐\n│  ' + details[key].title.padEnd(30) + '│\n└────────────────────────────────┘';
                modalTitle.textContent = '';
                modalBody.innerHTML = details[key].body;
                modal.classList.add('open');
            }
        });
    });

    modalClose.addEventListener('click', function () {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    
})();