/* 技术速查手册 —— 页面逻辑：渲染、检索、主题、复制 */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- 工具 ---------- */
  var ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (ch) { return ESC_MAP[ch]; });
  }

  // 先定位再转义，保证特殊字符既安全又能正确高亮
  function highlight(text, query) {
    var src = String(text);
    if (!query) return esc(src);
    var lower = src.toLowerCase();
    var q = query.toLowerCase();
    var out = '';
    var from = 0;
    while (true) {
      var at = lower.indexOf(q, from);
      if (at === -1) break;
      out += esc(src.slice(from, at)) + '<mark>' + esc(src.slice(at, at + q.length)) + '</mark>';
      from = at + q.length;
    }
    return out + esc(src.slice(from));
  }

  var toastEl = $('#toast');
  var toastTimer = null;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1600);
  }

  /* ---------- 主题 ---------- */
  var THEME_KEY = 'cheatsheet.theme';
  var root = document.documentElement;

  function readStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function storeTheme(value) {
    try { localStorage.setItem(THEME_KEY, value); } catch (e) { /* 隐私模式下忽略 */ }
  }

  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', readStoredTheme() || (prefersLight ? 'light' : 'dark'));

  $('#themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    storeTheme(next);
    toast(next === 'dark' ? '已切换到深色主题' : '已切换到浅色主题');
  });

  /* ---------- 建索引 ---------- */
  var totalItems = 0;
  var sections = SECTIONS.map(function (section, si) {
    section.items.forEach(function (item) {
      var code = typeof item.c === 'string' ? item.c : '';
      item._code = code;
      item._copy = (code && code.trim() !== item.k.trim()) ? code : item.k;
      item._hay = [item.k, item.d, code, (item.tags || []).join(' ')]
        .join(' ').toLowerCase();
      totalItems++;
    });
    section._index = si;
    return section;
  });
  $('#statItems').textContent = String(totalItems);

  /* ---------- 目录与标签 ---------- */
  $('#toc').innerHTML = sections.map(function (s) {
    return '<a href="#' + s.id + '" data-target="' + s.id + '">' +
      '<span class="toc-icon">' + esc(s.icon) + '</span>' +
      '<span>' + esc(s.title) + '</span>' +
      '<span class="toc-count">' + s.items.length + '</span></a>';
  }).join('');

  $('#heroChips').innerHTML = sections.map(function (s) {
    return '<a class="chip" href="#' + s.id + '" data-target="' + s.id + '">' +
      esc(s.icon) + ' ' + esc(s.title) + '</a>';
  }).join('');

  /* ---------- 渲染 ---------- */
  var sectionsEl = $('#sections');

  function itemHTML(item, query) {
    var showCode = item._code && item._code.trim() !== item.k.trim();
    return '<article class="item">' +
        '<div class="item-head">' +
          '<code class="item-key">' + highlight(item.k, query) + '</code>' +
          '<button class="copy-btn" type="button">复制</button>' +
        '</div>' +
        '<p class="item-desc">' + highlight(item.d, query) + '</p>' +
        (showCode
          ? '<div class="item-code"><pre><code>' + highlight(item._code, query) + '</code></pre>' +
            '<button class="copy-btn" type="button">复制</button></div>'
          : '') +
      '</article>';
  }

  function render(query) {
    var q = (query || '').trim().toLowerCase();
    var html = '';
    var matched = 0;
    var hitSections = 0;

    sections.forEach(function (s) {
      var hits = q ? s.items.filter(function (it) { return it._hay.indexOf(q) !== -1; }) : s.items;
      if (!hits.length) return;
      matched += hits.length;
      hitSections++;
      html += '<section class="section" id="' + s.id + '">' +
          '<div class="section-head">' +
            '<span class="section-icon">' + esc(s.icon) + '</span>' +
            '<h2>' + esc(s.title) + '</h2>' +
            '<p class="section-desc">' + esc(s.desc) + '</p>' +
            '<span class="section-count">' + hits.length + ' 条</span>' +
          '</div>' +
          '<div class="items">' + hits.map(function (it) { return itemHTML(it, q); }).join('') + '</div>' +
        '</section>';
    });

    sectionsEl.innerHTML = html;

    var isEmpty = q && matched === 0;
    $('#emptyState').hidden = !isEmpty;
    $('#emptyQuery').textContent = query || '';

    var bar = $('#resultBar');
    bar.hidden = !q;
    if (q) {
      $('#resultText').textContent = '筛选「' + query + '」：' + matched + ' 条结果，分布在 ' + hitSections + ' 个分类';
    }

    updateSpy();
  }

  /* ---------- 搜索 ---------- */
  var searchEl = $('#search');
  var clearBtn = $('#clearSearch');
  var frame = 0;

  function scheduleRender() {
    if (frame) return;
    frame = requestAnimationFrame(function () {
      frame = 0;
      render(searchEl.value);
      clearBtn.hidden = !searchEl.value;
    });
  }

  searchEl.addEventListener('input', scheduleRender);

  clearBtn.addEventListener('click', function () {
    searchEl.value = '';
    render('');
    clearBtn.hidden = true;
    searchEl.focus();
  });

  $('#resetFilter').addEventListener('click', function () {
    searchEl.value = '';
    render('');
    clearBtn.hidden = true;
  });

  document.addEventListener('keydown', function (event) {
    var tag = (event.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || event.target.isContentEditable;

    if (event.key === '/' && !typing) {
      event.preventDefault();
      searchEl.focus();
      searchEl.select();
    } else if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      searchEl.focus();
      searchEl.select();
    } else if (event.key === 'Escape' && typing) {
      searchEl.value = '';
      render('');
      clearBtn.hidden = true;
      searchEl.blur();
    }
  });

  /* ---------- 复制 ---------- */
  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  sectionsEl.addEventListener('click', function (event) {
    var btn = event.target.closest ? event.target.closest('.copy-btn') : null;
    if (!btn) return;

    var item = btn.closest('.item');
    var pre = item.querySelector('.item-code code');
    var key = item.querySelector('.item-key');
    var text = pre ? pre.textContent : (key ? key.textContent : '');
    if (!text) return;

    copyText(text).then(function (ok) {
      if (!ok) { toast('复制失败，请手动选择文本'); return; }
      var label = btn.textContent;
      btn.textContent = '已复制';
      btn.classList.add('done');
      toast('已复制到剪贴板');
      setTimeout(function () {
        btn.textContent = label;
        btn.classList.remove('done');
      }, 1500);
    });
  });

  /* ---------- 目录跳转 ---------- */
  function goTo(id) {
    if (searchEl.value) {
      searchEl.value = '';
      render('');
      clearBtn.hidden = true;
    }
    requestAnimationFrame(function () {
      var target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('[data-target]') : null;
    if (!link) return;
    event.preventDefault();
    goTo(link.getAttribute('data-target'));
  });

  /* ---------- 滚动相关 ---------- */
  var toTop = $('#toTop');
  var progress = $('#scrollProgress');
  var ticking = false;

  function updateSpy() {
    var y = window.scrollY || window.pageYOffset;
    var links = $$('#toc a');
    var currentId = '';

    $$('.section').forEach(function (section) {
      if (section.getBoundingClientRect().top <= 150) currentId = section.id;
    });
    if (!currentId && $$('.section').length) currentId = $$('.section')[0].id;

    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-target') === currentId);
    });

    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
    progress.style.width = pct + '%';

    toTop.hidden = y < 500;

    var active = $('#toc a.active');
    if (active && active.scrollIntoView) {
      var box = $('#toc').getBoundingClientRect();
      var item = active.getBoundingClientRect();
      if (item.left < box.left || item.right > box.right) {
        active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    }
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; updateSpy(); });
  }, { passive: true });

  window.addEventListener('resize', updateSpy);

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 启动 ---------- */
  render('');
  updateSpy();
})();
