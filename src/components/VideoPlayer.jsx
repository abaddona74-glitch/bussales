import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './VideoPlayer.css';
import 'videojs-mux';

// localStorage dan saqlangan sozlamalarni olish
const getSavedVolume = () => {
  try {
    const v = localStorage.getItem('bussales_player_volume');
    return v !== null ? parseFloat(v) : 0.7;
  } catch { return 0.7; }
};

const getSavedMuted = () => {
  try {
    return localStorage.getItem('bussales_player_muted') === 'true';
  } catch { return false; }
};

const getSavedRate = () => {
  try {
    const r = localStorage.getItem('bussales_player_rate');
    return r !== null ? parseFloat(r) : 1;
  } catch { return 1; }
};

const VideoPlayer = ({ src, title }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) return;

    const timerId = setTimeout(() => {
      const el = videoRef.current;
      if (!el || !document.body.contains(el)) return;

      // Source turini aniqlash — HLS yoki MP4
      const isHLS = src.endsWith('.m3u8');
      const sourceType = isHLS ? 'application/x-mpegURL' : 'video/mp4';

      const player = videojs(el, {
        controls: true,
        autoplay: false,
        preload: 'metadata',
        fluid: true,
        responsive: true,
        aspectRatio: '16:9',
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        sources: [{ src, type: sourceType }],
        html5: {
          vhs: {
            overrideNative: true,
            enableLowInitialPlaylist: false,
          },
        },
      });

      // Saqlangan ovoz va tezlikni tiklash
      player.volume(getSavedVolume());
      player.muted(getSavedMuted());
      player.playbackRate(getSavedRate());

      // Ovoz o'zgarishini saqlash
      player.on('volumechange', () => {
        try {
          localStorage.setItem('bussales_player_volume', player.volume());
          localStorage.setItem('bussales_player_muted', player.muted());
        } catch {}
      });

      // Tezlik o'zgarishini saqlash
      player.on('ratechange', () => {
        try {
          localStorage.setItem('bussales_player_rate', player.playbackRate());
        } catch {}
      });

      // HLS uchun quality selector menyusini yaratish
      if (isHLS) {
        player.ready(() => {
          const ql = player.qualityLevels();
          let qualityMenuAdded = false;

          const tryAddMenu = () => {
            if (qualityMenuAdded) return;
            if (ql.length > 1) {
              qualityMenuAdded = true;
              addQualitySelector(player, ql);
            }
          };

          ql.on('addqualitylevel', () => tryAddMenu());
          setTimeout(tryAddMenu, 2000);
        });
      }

      // Mux Data monitoring
      player.ready(() => {
        try {
          const envKey = import.meta.env.VITE_MUX_DATA_ENV_KEY || '';
          if (envKey && typeof player.mux === 'function') {
            player.mux({
              debug: false,
              data: {
                env_key: envKey,
                video_title: title || 'Untitled Video',
                player_name: 'Bussales Video.js Player',
                player_init_time: Date.now(),
              },
            });
          }
        } catch (e) {
          console.warn('Mux Data init warning:', e.message);
        }
      });

      playerRef.current = player;
    }, 100);

    return () => {
      clearTimeout(timerId);
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [src, title]);

  return (
    <div data-vjs-player style={{ width: '100%' }}>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-bussales"
        playsInline
      />
    </div>
  );
};

/**
 * HLS quality selector — DOM-based (ishonchli click/menu)
 */
function addQualitySelector(player, qualityLevels) {
  if (!qualityLevels || qualityLevels.length < 2) return;

  // Quality levels ro'yxati
  const levels = [];
  for (let i = 0; i < qualityLevels.length; i++) {
    const ql = qualityLevels[i];
    levels.push({
      index: i,
      height: ql.height,
      bitrate: ql.bitrate,
      label: ql.height ? `${ql.height}p` : `${Math.round(ql.bitrate / 1000)}kbps`,
    });
  }
  levels.sort((a, b) => (b.height || 0) - (a.height || 0));

  // Control bar element
  const controlBarEl = player.controlBar.el();
  const fsBtn = player.controlBar.getChild('fullscreenToggle');

  // Eski quality wrapper ni olib tashlash
  const oldWrapper = controlBarEl.querySelector('.vjs-quality-wrapper');
  if (oldWrapper) oldWrapper.remove();

  // Wrapper yaratish
  const wrapper = document.createElement('div');
  wrapper.className = 'vjs-quality-wrapper vjs-control';

  // Tugma
  const btn = document.createElement('button');
  btn.className = 'vjs-quality-btn';
  btn.title = 'Sifat';
  btn.textContent = 'AUTO';
  wrapper.appendChild(btn);

  // Menyu
  const menu = document.createElement('div');
  menu.className = 'vjs-quality-menu';
  menu.style.display = 'none';

  // Auto item
  const autoItem = document.createElement('div');
  autoItem.className = 'vjs-quality-item vjs-quality-selected';
  autoItem.textContent = 'Avto';
  autoItem.dataset.index = '-1';
  menu.appendChild(autoItem);

  // Har bir quality level
  levels.forEach(level => {
    const item = document.createElement('div');
    item.className = 'vjs-quality-item';
    item.textContent = level.label;
    item.dataset.index = String(level.index);
    menu.appendChild(item);
  });

  wrapper.appendChild(menu);

  // Fullscreen tugmasidan oldin qo'yish
  if (fsBtn) {
    controlBarEl.insertBefore(wrapper, fsBtn.el());
  } else {
    controlBarEl.appendChild(wrapper);
  }

  // Menyu ochish/yopish
  let menuOpen = false;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpen = !menuOpen;
    menu.style.display = menuOpen ? 'block' : 'none';
  });

  // Tashqariga bosilganda yopish
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      menuOpen = false;
      menu.style.display = 'none';
    }
  });

  // Item bosilganda quality tanlash
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.vjs-quality-item');
    if (!item) return;
    e.stopPropagation();

    const idx = parseInt(item.dataset.index, 10);
    const isAuto = idx === -1;

    // Quality levellarni yoqish/o'chirish
    for (let i = 0; i < qualityLevels.length; i++) {
      qualityLevels[i].enabled = isAuto ? true : (i === idx);
    }

    // Selected holatini yangilash
    menu.querySelectorAll('.vjs-quality-item').forEach(el => {
      el.classList.remove('vjs-quality-selected');
    });
    item.classList.add('vjs-quality-selected');

    // Tugma textini yangilash
    btn.textContent = isAuto ? 'AUTO' : item.textContent;

    // Menyuni yopish
    menuOpen = false;
    menu.style.display = 'none';
  });
}

export default VideoPlayer;
