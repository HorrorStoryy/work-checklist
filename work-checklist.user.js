// ==UserScript==
// @name         Рабочий Чек-лист
// @namespace    https://smartway.today/
// @version      1.3
// @description  Чек-листы для рабочих задач с прогрессом и импортом/экспортом
// @author       Smartway
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/HorrorStoryy/work-checklist/main/work-checklist.meta.js
// @downloadURL  https://raw.githubusercontent.com/HorrorStoryy/work-checklist/main/work-checklist.user.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[WC] === Скрипт Рабочий Чек-лист загружен ===');
    console.log('[WC] URL:', window.location.href);

    // === ИКОНКИ ===
    var ICON_CHECKLIST = '\uD83D\uDCCB';
    var ICON_CLOSE = '\u2715';
    var ICON_PLUS = '\u2795';
    var ICON_IMPORT = '\uD83D\uDCE5';
    var ICON_EXPORT = '\uD83D\uDCE4';
    var ICON_RESET = '\uD83D\uDD04';
    var ICON_DELETE = '\uD83D\uDDD1\uFE0F';
    var ICON_SVG_RESET = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>';
    var ICON_SVG_PLUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
    var ICON_SVG_DELETE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
    var ICON_SVG_SMALL_PLUS = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
    var ICON_SVG_SMALL_DELETE = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" /></svg>';

    // === СТИЛИ ===
    var STYLES = [
        '#work-checklist-toggle {',
        '  position: fixed !important;',
        '  bottom: 20px !important;',
        '  right: 20px !important;',
        '  top: auto !important;',
        '  left: auto !important;',
        '  z-index: 2147483647 !important;',
        '  background: #4f46e5 !important;',
        '  color: white !important;',
        '  border: 3px solid #fff !important;',
        '  border-radius: 50% !important;',
        '  width: 56px !important;',
        '  height: 56px !important;',
        '  font-size: 26px !important;',
        '  cursor: pointer !important;',
        '  box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;',
        '  display: flex !important;',
        '  align-items: center !important;',
        '  justify-content: center !important;',
        '  opacity: 0.95 !important;',
        '  transition: transform 0.2s, opacity 0.2s !important;',
        '  padding: 0 !important;',
        '  margin: 0 !important;',
        '  font-family: sans-serif !important;',
        '}',
        '#work-checklist-toggle:hover {',
        '  opacity: 1 !important;',
        '  transform: scale(1.1) !important;',
        '}',
        '#work-checklist-panel {',
        '  position: fixed !important;',
        '  top: 0 !important;',
        '  right: 0 !important;',
        '  width: 400px !important;',
        '  height: 100vh !important;',
        '  background: #ffffff !important;',
        '  box-shadow: -5px 0 20px rgba(0,0,0,0.3) !important;',
        '  z-index: 2147483647 !important;',
        '  display: flex !important;',
        '  flex-direction: column !important;',
        '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;',
        '  border-left: 2px solid #e5e7eb !important;',
        '}',
        '#work-checklist-panel .wc-header {',
        '  background: #4f46e5 !important;',
        '  color: white !important;',
        '  padding: 16px !important;',
        '  display: flex !important;',
        '  justify-content: space-between !important;',
        '  align-items: center !important;',
        '}',
        '#work-checklist-panel .wc-header-title {',
        '  font-size: 18px !important;',
        '  font-weight: 600 !important;',
        '}',
        '#work-checklist-panel .wc-close {',
        '  background: none !important;',
        '  border: none !important;',
        '  color: white !important;',
        '  font-size: 24px !important;',
        '  cursor: pointer !important;',
        '  padding: 0 !important;',
        '  line-height: 1 !important;',
        '}',
        '#work-checklist-panel .wc-toolbar {',
        '  display: flex !important;',
        '  gap: 8px !important;',
        '  padding: 12px 16px !important;',
        '  background: #f9fafb !important;',
        '  border-bottom: 1px solid #e5e7eb !important;',
        '}',
        '#work-checklist-panel .wc-btn {',
        '  padding: 8px 12px !important;',
        '  border: 1px solid #d1d5db !important;',
        '  background: white !important;',
        '  border-radius: 6px !important;',
        '  cursor: pointer !important;',
        '  font-size: 13px !important;',
        '  display: flex !important;',
        '  align-items: center !important;',
        '  gap: 4px !important;',
        '}',
        '#work-checklist-panel .wc-btn:hover { background: #f3f4f6 !important; }',
        '#work-checklist-panel .wc-btn-primary {',
        '  background: #4f46e5 !important;',
        '  color: white !important;',
        '  border-color: #4f46e5 !important;',
        '}',
        '#work-checklist-panel .wc-btn-primary:hover { background: #4338ca !important; }',
        '#work-checklist-panel .wc-content {',
        '  flex: 1 !important;',
        '  overflow-y: auto !important;',
        '  padding: 16px !important;',
        '}',
        '#work-checklist-panel .section-card {',
        '  background: #f9fafb !important;',
        '  border: 1px solid #e5e7eb !important;',
        '  border-radius: 8px !important;',
        '  margin-bottom: 12px !important;',
        '  overflow: hidden !important;',
        '}',
        '#work-checklist-panel .section-header {',
        '  padding: 12px 16px !important;',
        '  background: white !important;',
        '  cursor: pointer !important;',
        '  display: flex !important;',
        '  justify-content: space-between !important;',
        '  align-items: center !important;',
        '  border-bottom: 1px solid #e5e7eb !important;',
        '}',
        '#work-checklist-panel .section-info { flex: 1; }',
        '#work-checklist-panel .section-title {',
        '  font-size: 15px !important;',
        '  font-weight: 600 !important;',
        '  color: #1f2937 !important;',
        '  margin: 0 0 6px 0 !important;',
        '}',
        '#work-checklist-panel .section-actions {',
        '  display: flex !important;',
        '  gap: 6px !important;',
        '}',
        '#work-checklist-panel .icon-btn {',
        '  background: none !important;',
        '  border: none !important;',
        '  cursor: pointer !important;',
        '  padding: 4px !important;',
        '  border-radius: 4px !important;',
        '  display: flex !important;',
        '  align-items: center !important;',
        '  color: #6b7280 !important;',
        '}',
        '#work-checklist-panel .icon-btn:hover { background: #e5e7eb !important; }',
        '#work-checklist-panel .icon-btn.primary { color: #4f46e5 !important; }',
        '#work-checklist-panel .icon-btn.danger { color: #ef4444 !important; }',
        '#work-checklist-panel .progress-container {',
        '  display: flex !important;',
        '  align-items: center !important;',
        '  gap: 8px !important;',
        '}',
        '#work-checklist-panel .progress-bar {',
        '  flex: 1 !important;',
        '  height: 6px !important;',
        '  background: #e5e7eb !important;',
        '  border-radius: 3px !important;',
        '  overflow: hidden !important;',
        '}',
        '#work-checklist-panel .progress-fill {',
        '  height: 100% !important;',
        '  background: #4f46e5 !important;',
        '}',
        '#work-checklist-panel .progress-text {',
        '  font-size: 12px !important;',
        '  color: #6b7280 !important;',
        '  min-width: 40px !important;',
        '}',
        '#work-checklist-panel .section-body {',
        '  padding: 12px 16px !important;',
        '}',
        '#work-checklist-panel .item-list {',
        '  list-style: none !important;',
        '  padding: 0 !important;',
        '  margin: 0 !important;',
        '}',
        '#work-checklist-panel .checklist-group {',
        '  margin-bottom: 8px !important;',
        '  border-left: 2px solid #e5e7eb !important;',
        '  padding-left: 10px !important;',
        '}',
        '#work-checklist-panel .checklist-item {',
        '  display: flex !important;',
        '  align-items: center !important;',
        '  gap: 8px !important;',
        '  padding: 6px 0 !important;',
        '}',
        '#work-checklist-panel .checklist-item input[type="checkbox"] {',
        '  width: 18px !important;',
        '  height: 18px !important;',
        '  cursor: pointer !important;',
        '}',
        '#work-checklist-panel .item-text {',
        '  flex: 1 !important;',
        '  font-size: 14px !important;',
        '  color: #374151 !important;',
        '}',
        '#work-checklist-panel .item-text.completed {',
        '  text-decoration: line-through !important;',
        '  color: #9ca3af !important;',
        '}',
        '#work-checklist-panel .modal-overlay {',
        '  position: fixed !important;',
        '  top: 0 !important;',
        '  left: 0 !important;',
        '  width: 100% !important;',
        '  height: 100% !important;',
        '  background: rgba(0,0,0,0.5) !important;',
        '  z-index: 2147483646 !important;',
        '  display: flex !important;',
        '  align-items: center !important;',
        '  justify-content: center !important;',
        '}',
        '#work-checklist-panel .modal, #work-checklist-modal {',
        '  background: white !important;',
        '  border-radius: 12px !important;',
        '  padding: 24px !important;',
        '  width: 90% !important;',
        '  max-width: 400px !important;',
        '  box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;',
        '}',
        '#work-checklist-panel .modal-title {',
        '  font-size: 18px !important;',
        '  font-weight: 600 !important;',
        '  margin-bottom: 16px !important;',
        '  color: #1f2937 !important;',
        '}',
        '#work-checklist-panel .modal-input {',
        '  width: 100% !important;',
        '  padding: 12px !important;',
        '  border: 1px solid #d1d5db !important;',
        '  border-radius: 6px !important;',
        '  font-size: 14px !important;',
        '  margin-bottom: 16px !important;',
        '  box-sizing: border-box !important;',
        '}',
        '#work-checklist-panel .modal-input:focus {',
        '  outline: none !important;',
        '  border-color: #4f46e5 !important;',
        '}',
        '#work-checklist-panel .modal-actions {',
        '  display: flex !important;',
        '  gap: 8px !important;',
        '  justify-content: flex-end !important;',
        '}',
        '#work-checklist-panel .modal-btn {',
        '  padding: 10px 20px !important;',
        '  border: none !important;',
        '  border-radius: 6px !important;',
        '  cursor: pointer !important;',
        '  font-size: 14px !important;',
        '  font-weight: 500 !important;',
        '}',
        '#work-checklist-panel .modal-btn-cancel {',
        '  background: #e5e7eb !important;',
        '  color: #374151 !important;',
        '}',
        '#work-checklist-panel .modal-btn-confirm {',
        '  background: #4f46e5 !important;',
        '  color: white !important;',
        '}',
        '#work-checklist-panel .empty-state {',
        '  text-align: center !important;',
        '  padding: 40px 20px !important;',
        '  color: #9ca3af !important;',
        '}'
    ].join('\n');

    var HTML = [
        '<div id="work-checklist-panel" style="display: none;">',
        '  <div class="wc-header">',
        '    <span class="wc-header-title">' + ICON_CHECKLIST + ' Рабочий Чек-лист</span>',
        '    <button id="wc-close" class="wc-close">' + ICON_CLOSE + '</button>',
        '  </div>',
        '  <div class="wc-toolbar">',
        '    <button id="wc-add-section" class="wc-btn wc-btn-primary">' + ICON_PLUS + ' Новый раздел</button>',
        '    <button id="wc-import" class="wc-btn">' + ICON_IMPORT + ' Импорт</button>',
        '    <button id="wc-export" class="wc-btn">' + ICON_EXPORT + ' Экспорт</button>',
        '  </div>',
        '  <div class="wc-content" id="wc-sections-list"></div>',
        '  <input type="file" id="wc-import-input" accept=".json" style="display: none;">',
        '</div>'
    ].join('\n');

    // === ДАННЫЕ ===
    var appData = { sections: [] };
    var currentModalAction = null;

    // === СОХРАНЕНИЕ/ЗАГРУЗКА ===
    function loadData() {
        console.log('[WC] Загрузка данных...');
        try {
            var saved = null;
            if (typeof GM_getValue !== 'undefined') {
                saved = GM_getValue('work_checklists', null);
                console.log('[WC] GM_getValue результат:', saved ? 'есть данные' : 'нет');
            }
            if (!saved) {
                saved = localStorage.getItem('wc_data');
                console.log('[WC] localStorage результат:', saved ? 'есть данные' : 'нет');
            }
            if (saved) {
                appData = JSON.parse(saved);
                // Защита: гарантируем что sections это массив
                if (!appData.sections || !Array.isArray(appData.sections)) {
                    appData = { sections: [] };
                }
                console.log('[WC] Загружено разделов:', appData.sections.length);
            } else {
                appData = { sections: [] };
                console.log('[WC] Нет сохранённых данных');
            }
        } catch (e) {
            console.error('[WC] Ошибка загрузки:', e);
            appData = { sections: [] };
        }
        render();
    }

    function saveData() {
        try {
            var json = JSON.stringify(appData);
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('work_checklists', json);
            }
            localStorage.setItem('wc_data', json);
            console.log('[WC] Данные сохранены');
        } catch (e) {
            console.error('[WC] Ошибка сохранения:', e);
        }
    }

    // === СОЗДАНИЕ КНОПКИ ===
    function ensureToggleButton() {
        var existing = document.getElementById('work-checklist-toggle');
        if (existing) {
            console.log('[WC] Кнопка уже существует');
            return;
        }

        console.log('[WC] Создаю кнопку-триггер...');
        var toggle = document.createElement('button');
        toggle.id = 'work-checklist-toggle';
        toggle.textContent = ICON_CHECKLIST;
        toggle.title = 'Рабочий Чек-лист';
        toggle.setAttribute('aria-label', 'Открыть чек-лист');
        toggle.onclick = function() {
            console.log('[WC] Клик по кнопке');
            var panel = document.getElementById('work-checklist-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            } else {
                createPanel();
            }
        };

        if (document.body) {
            document.body.appendChild(toggle);
            console.log('[WC] Кнопка добавлена в body');
        } else {
            console.warn('[WC] body ещё не готов, жду...');
            setTimeout(ensureToggleButton, 500);
        }
    }

    // === СОЗДАНИЕ ПАНЕЛИ ===
    function createPanel() {
        console.log('[WC] Создаю панель...');

        var styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        var temp = document.createElement('div');
        temp.innerHTML = HTML;
        var panel = temp.firstChild;
        document.body.appendChild(panel);
        console.log('[WC] Панель добавлена в DOM');

        document.getElementById('wc-close').onclick = function() {
            panel.style.display = 'none';
        };

        document.getElementById('wc-add-section').onclick = function() {
            openModal('addSection');
        };

        document.getElementById('wc-import').onclick = function() {
            document.getElementById('wc-import-input').click();
        };

        document.getElementById('wc-export').onclick = function() {
            exportData();
        };

        document.getElementById('wc-import-input').onchange = function(e) {
            importData(e);
        };

        loadData();
    }

    // === ESCAPE HTML ===
    function escapeHtml(text) {
        if (!text) return '';
        var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // === ПОИСК С ЗАЩИТОЙ ===
    function findSection(sid) {
        if (!appData.sections || !Array.isArray(appData.sections) || !sid) return null;
        var i;
        for (i = 0; i < appData.sections.length; i++) {
            if (appData.sections[i].id === sid) return appData.sections[i];
        }
        return null;
    }

    function findItem(section, iid) {
        if (!section || !section.items || !Array.isArray(section.items) || !iid) return null;
        var i;
        for (i = 0; i < section.items.length; i++) {
            if (section.items[i].id === iid) return section.items[i];
        }
        return null;
    }

    function findSubtask(item, subid) {
        if (!item || !item.subtasks || !Array.isArray(item.subtasks) || !subid) return null;
        var i;
        for (i = 0; i < item.subtasks.length; i++) {
            if (item.subtasks[i].id === subid) return item.subtasks[i];
        }
        return null;
    }

    // === РЕНДЕР ===
    function render() {
        console.log('[WC] Рендер...');
        var list = document.getElementById('wc-sections-list');
        if (!list) {
            console.warn('[WC] wc-sections-list не найден');
            return;
        }

        list.innerHTML = '';

        if (!appData.sections || appData.sections.length === 0) {
            list.innerHTML = '<div class="empty-state">Нет разделов. Создайте первый!</div>';
            return;
        }

        var s;
        for (s = 0; s < appData.sections.length; s++) {
            var section = appData.sections[s];
            
            // Защита: проверяем что section валидный
            if (!section || !section.id) {
                console.warn('[WC] Пропускаю невалидный раздел:', section);
                continue;
            }

            // Гарантируем что items это массив
            if (!section.items || !Array.isArray(section.items)) {
                section.items = [];
            }

            var sectionEl = document.createElement('div');
            sectionEl.className = 'section-card';

            var totalItems = 0;
            var completedItems = 0;

            var i;
            for (i = 0; i < section.items.length; i++) {
                var item = section.items[i];
                if (!item) continue; // Защита от undefined
                
                totalItems++;
                if (item.completed) completedItems++;
                
                if (item.subtasks && Array.isArray(item.subtasks)) {
                    var j;
                    for (j = 0; j < item.subtasks.length; j++) {
                        var sub = item.subtasks[j];
                        if (!sub) continue;
                        totalItems++;
                        if (sub.completed) completedItems++;
                    }
                }
            }

            var percent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

            var headerHtml = [
                '<div class="section-header" data-section-id="' + section.id + '">',
                '  <div class="section-info">',
                '    <h4 class="section-title">' + escapeHtml(section.title || 'Без названия') + '</h4>',
                '    <div class="progress-container">',
                '      <div class="progress-bar"><div class="progress-fill" style="width: ' + percent + '%"></div></div>',
                '      <span class="progress-text">' + completedItems + '/' + totalItems + '</span>',
                '    </div>',
                '  </div>',
                '  <div class="section-actions">',
                '    <button class="icon-btn" data-action="reset" data-id="' + section.id + '" title="Сбросить">' + ICON_SVG_RESET + '</button>',
                '    <button class="icon-btn primary" data-action="add-item" data-id="' + section.id + '" title="Добавить группу">' + ICON_SVG_PLUS + '</button>',
                '    <button class="icon-btn danger" data-action="delete" data-id="' + section.id + '" title="Удалить">' + ICON_SVG_DELETE + '</button>',
                '  </div>',
                '</div>',
                '<div class="section-body" id="body-' + section.id + '" style="' + (section.isOpen ? 'display: block;' : 'display: none;') + '">',
                '  <ul class="item-list" id="items-' + section.id + '"></ul>',
                '</div>'
            ].join('');

            sectionEl.innerHTML = headerHtml;

            var header = sectionEl.querySelector('.section-header');
            header.onclick = function(e) {
                if (e.target.closest('button')) return;
                var sid = this.getAttribute('data-section-id');
                var sec = findSection(sid);
                if (sec) {
                    sec.isOpen = !sec.isOpen;
                    saveData();
                    render();
                }
            };

            var itemsList = sectionEl.querySelector('#items-' + section.id);

            if (section.items.length > 0) {
                var k;
                for (k = 0; k < section.items.length; k++) {
                    var item = section.items[k];
                    
                    // Защита: пропускаем undefined
                    if (!item || !item.id) {
                        console.warn('[WC] Пропускаю невалидный item:', item);
                        continue;
                    }

                    var itemEl = document.createElement('li');
                    itemEl.className = 'checklist-group';

                    var itemHtml = [
                        '<div class="checklist-item">',
                        '  <input type="checkbox" class="item-check" data-sid="' + section.id + '" data-iid="' + item.id + '" ' + (item.completed ? 'checked' : '') + '>',
                        '  <strong class="item-text ' + (item.completed ? 'completed' : '') + '">' + escapeHtml(item.text || '') + '</strong>',
                        '  <button class="icon-btn primary" data-action="add-subtask" data-sid="' + section.id + '" data-iid="' + item.id + '" title="Добавить пункт">' + ICON_SVG_SMALL_PLUS + '</button>',
                        '  <button class="icon-btn danger" data-action="delete-item" data-sid="' + section.id + '" data-iid="' + item.id + '" title="Удалить">' + ICON_SVG_SMALL_DELETE + '</button>',
                        '</div>'
                    ].join('');

                    if (item.subtasks && Array.isArray(item.subtasks) && item.subtasks.length > 0) {
                        itemHtml += '<ul style="list-style: none; padding-left: 26px; margin-top: 4px;">';
                        var m;
                        for (m = 0; m < item.subtasks.length; m++) {
                            var sub = item.subtasks[m];
                            if (!sub || !sub.id) continue;
                            
                            itemHtml += [
                                '<li class="checklist-item">',
                                '  <input type="checkbox" class="sub-check" data-sid="' + section.id + '" data-iid="' + item.id + '" data-subid="' + sub.id + '" ' + (sub.completed ? 'checked' : '') + '>',
                                '  <span class="item-text ' + (sub.completed ? 'completed' : '') + '" style="font-size: 13px;">' + escapeHtml(sub.text || '') + '</span>',
                                '  <button class="icon-btn danger" data-action="delete-sub" data-sid="' + section.id + '" data-iid="' + item.id + '" data-subid="' + sub.id + '">' + ICON_SVG_SMALL_DELETE + '</button>',
                                '</li>'
                            ].join('');
                        }
                        itemHtml += '</ul>';
                    }

                    itemEl.innerHTML = itemHtml;
                    itemsList.appendChild(itemEl);
                }
            }

            list.appendChild(sectionEl);
        }

        attachEventListeners();
    }

    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    function attachEventListeners() {
        var buttons = document.querySelectorAll('#work-checklist-panel [data-action]');
        var b;
        for (b = 0; b < buttons.length; b++) {
            (function(btn) {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    var action = this.getAttribute('data-action');
                    var id = this.getAttribute('data-id');
                    var sid = this.getAttribute('data-sid');
                    var iid = this.getAttribute('data-iid');
                    var subid = this.getAttribute('data-subid');

                    console.log('[WC] Действие:', action, 'params:', { id: id, sid: sid, iid: iid, subid: subid });

                    if (action === 'add-item') {
                        openModal('addGroup', { sid: id });
                    } else if (action === 'add-subtask') {
                        openModal('addSubtask', { sid: sid, iid: iid });
                    } else if (action === 'reset') {
                        resetSection(id);
                    } else if (action === 'delete') {
                        if (confirm('Удалить этот раздел?')) {
                            appData.sections = appData.sections.filter(function(s) { return s.id !== id; });
                            saveData();
                            render();
                        }
                    } else if (action === 'delete-item') {
                        deleteItem(sid, iid);
                    } else if (action === 'delete-sub') {
                        deleteSubtask(sid, iid, subid);
                    }
                };
            })(buttons[b]);
        }

        var itemChecks = document.querySelectorAll('#work-checklist-panel .item-check');
        var c;
        for (c = 0; c < itemChecks.length; c++) {
            (function(cb) {
                cb.onchange = function() {
                    toggleItem(this.getAttribute('data-sid'), this.getAttribute('data-iid'));
                };
            })(itemChecks[c]);
        }

        var subChecks = document.querySelectorAll('#work-checklist-panel .sub-check');
        var d;
        for (d = 0; d < subChecks.length; d++) {
            (function(cb) {
                cb.onchange = function() {
                    toggleSubtask(this.getAttribute('data-sid'), this.getAttribute('data-iid'), this.getAttribute('data-subid'));
                };
            })(subChecks[d]);
        }
    }

    // === МОДАЛЬНОЕ ОКНО ===
    function openModal(action, params) {
        params = params || {};
        currentModalAction = { action: action, params: params };

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'wc-modal-overlay';

        var title = '';
        var placeholder = '';

        if (action === 'addSection') {
            title = 'Новый раздел';
            placeholder = 'Название раздела...';
        } else if (action === 'addGroup') {
            title = 'Новая группа';
            placeholder = 'Название группы...';
        } else if (action === 'addSubtask') {
            title = 'Новый пункт';
            placeholder = 'Описание действия...';
        }

        overlay.innerHTML = [
            '<div class="modal">',
            '  <div class="modal-title">' + title + '</div>',
            '  <input type="text" class="modal-input" id="wc-modal-input" placeholder="' + placeholder + '">',
            '  <div class="modal-actions">',
            '    <button class="modal-btn modal-btn-cancel" id="wc-modal-cancel">Отмена</button>',
            '    <button class="modal-btn modal-btn-confirm" id="wc-modal-confirm">ОК</button>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(overlay);

        var input = document.getElementById('wc-modal-input');
        input.focus();

        document.getElementById('wc-modal-cancel').onclick = closeModal;
        document.getElementById('wc-modal-confirm').onclick = confirmModal;

        input.onkeydown = function(e) {
            if (e.key === 'Enter') confirmModal();
            if (e.key === 'Escape') closeModal();
        };

        overlay.onclick = function(e) {
            if (e.target === overlay) closeModal();
        };
    }

    function closeModal() {
        var overlay = document.getElementById('wc-modal-overlay');
        if (overlay) overlay.remove();
        currentModalAction = null;
    }

    function confirmModal() {
        var input = document.getElementById('wc-modal-input');
        if (!input) return;

        var val = input.value.trim();
        if (!val || !currentModalAction) {
            closeModal();
            return;
        }

        var action = currentModalAction.action;
        var params = currentModalAction.params;

        console.log('[WC] confirmModal:', action, params);

        if (action === 'addSection') {
            appData.sections.push({
                id: Date.now().toString(),
                title: val,
                items: [],
                isOpen: true
            });
        } else if (action === 'addGroup') {
            if (!params || !params.sid) {
                console.error('[WC] addGroup: нет params.sid');
                closeModal();
                return;
            }
            var section = findSection(params.sid);
            if (!section) {
                console.error('[WC] addGroup: раздел не найден, sid =', params.sid);
                closeModal();
                return;
            }
            if (!section.items) section.items = [];
            section.items.push({
                id: Date.now().toString(),
                text: val,
                completed: false,
                subtasks: []
            });
        } else if (action === 'addSubtask') {
            if (!params || !params.sid || !params.iid) {
                console.error('[WC] addSubtask: нет params', params);
                closeModal();
                return;
            }
            var section2 = findSection(params.sid);
            if (!section2) {
                console.error('[WC] addSubtask: раздел не найден, sid =', params.sid);
                closeModal();
                return;
            }
            var item = findItem(section2, params.iid);
            if (!item) {
                console.error('[WC] addSubtask: группа не найдена, iid =', params.iid);
                closeModal();
                return;
            }
            if (!item.subtasks) item.subtasks = [];
            item.subtasks.push({
                id: Date.now().toString(),
                text: val,
                completed: false
            });
        }

        saveData();
        render();
        closeModal();
    }

    // === ДЕЙСТВИЯ ===
    function toggleItem(sid, iid) {
        var section = findSection(sid);
        if (section) {
            var item = findItem(section, iid);
            if (item) {
                item.completed = !item.completed;
                saveData();
                render();
            }
        }
    }

    function toggleSubtask(sid, iid, subid) {
        var section = findSection(sid);
        if (section) {
            var item = findItem(section, iid);
            if (item) {
                var sub = findSubtask(item, subid);
                if (sub) {
                    sub.completed = !sub.completed;
                    saveData();
                    render();
                }
            }
        }
    }

    function deleteItem(sid, iid) {
        var section = findSection(sid);
        if (section) {
            section.items = section.items.filter(function(i) { return i.id !== iid; });
            saveData();
            render();
        }
    }

    function deleteSubtask(sid, iid, subid) {
        var section = findSection(sid);
        if (section) {
            var item = findItem(section, iid);
            if (item && item.subtasks) {
                item.subtasks = item.subtasks.filter(function(s) { return s.id !== subid; });
                saveData();
                render();
            }
        }
    }

    function resetSection(sid) {
        var section = findSection(sid);
        if (section && confirm('Сбросить все отметки в этом разделе?')) {
            var i;
            for (i = 0; i < section.items.length; i++) {
                section.items[i].completed = false;
                if (section.items[i].subtasks) {
                    var j;
                    for (j = 0; j < section.items[i].subtasks.length; j++) {
                        section.items[i].subtasks[j].completed = false;
                    }
                }
            }
            saveData();
            render();
        }
    }

    // === ЭКСПОРТ/ИМПОРТ ===
    function exportData() {
        try {
            var blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'checklists.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('[WC] Ошибка экспорта:', e);
            alert('Ошибка при экспорте данных');
        }
    }

    function importData(e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(event) {
            try {
                var imported = JSON.parse(event.target.result);
                if (imported && imported.sections && Array.isArray(imported.sections)) {
                    if (confirm('Заменить текущие данные?')) {
                        appData = imported;
                    } else {
                        appData.sections = appData.sections.concat(imported.sections);
                    }
                    saveData();
                    render();
                } else {
                    alert('Неверный формат файла');
                }
            } catch (err) {
                console.error('[WC] Ошибка чтения файла:', err);
                alert('Ошибка чтения файла');
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    }

    // === ИНИЦИАЛИЗАЦИЯ ===
    function init() {
        console.log('[WC] Инициализация...');
        ensureToggleButton();

        var observer = new MutationObserver(function() {
            if (!document.getElementById('work-checklist-toggle')) {
                console.log('[WC] Кнопка удалена сайтом, воссоздаю...');
                ensureToggleButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[WC] MutationObserver установлен');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
