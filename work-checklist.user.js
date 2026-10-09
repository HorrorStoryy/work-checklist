// ==UserScript==
// @name         Рабочий Чек-лист
// @namespace    https://smartway.today/
// @version      1.0
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

    var ICON_CHECKLIST = '\uD83D\uDCCB';
    var ICON_CLOSE = '\u2715';
    var ICON_PLUS = '\u2795';
    var ICON_IMPORT = '\uD83D\uDCE5';
    var ICON_EXPORT = '\uD83D\uDCE4';
    var ICON_RESET = '\uD83D\uDD04';
    var ICON_DELETE = '\uD83D\uDDD1\uFE0F';

    var STYLES = [
        '#work-checklist-panel {',
        '  position: fixed; top: 0; right: 0; width: 400px; height: 100vh;',
        '  background: #ffffff; box-shadow: -5px 0 20px rgba(0,0,0,0.15);',
        '  z-index: 999999; display: flex; flex-direction: column;',
        '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
        '  border-left: 1px solid #e5e7eb;',
        '}',
        '#work-checklist-panel .wc-header {',
        '  background: #4f46e5; color: white; padding: 16px;',
        '  display: flex; justify-content: space-between; align-items: center;',
        '  border-bottom: 2px solid #4338ca;',
        '}',
        '#work-checklist-panel .wc-header-title {',
        '  font-size: 18px; font-weight: 600;',
        '}',
        '#work-checklist-panel .wc-close {',
        '  background: none; border: none; color: white; font-size: 24px;',
        '  cursor: pointer; padding: 0; line-height: 1;',
        '}',
        '#work-checklist-panel .wc-toolbar {',
        '  display: flex; gap: 8px; padding: 12px 16px;',
        '  background: #f9fafb; border-bottom: 1px solid #e5e7eb;',
        '}',
        '#work-checklist-panel .wc-btn {',
        '  padding: 8px 12px; border: 1px solid #d1d5db; background: white;',
        '  border-radius: 6px; cursor: pointer; font-size: 13px;',
        '  display: flex; align-items: center; gap: 4px;',
        '  transition: all 0.2s;',
        '}',
        '#work-checklist-panel .wc-btn:hover {',
        '  background: #f3f4f6; border-color: #9ca3af;',
        '}',
        '#work-checklist-panel .wc-btn-primary {',
        '  background: #4f46e5; color: white; border-color: #4f46e5;',
        '}',
        '#work-checklist-panel .wc-btn-primary:hover {',
        '  background: #4338ca;',
        '}',
        '#work-checklist-panel .wc-content {',
        '  flex: 1; overflow-y: auto; padding: 16px;',
        '}',
        '#work-checklist-panel .section-card {',
        '  background: #f9fafb; border: 1px solid #e5e7eb;',
        '  border-radius: 8px; margin-bottom: 12px; overflow: hidden;',
        '}',
        '#work-checklist-panel .section-header {',
        '  padding: 12px 16px; background: white; cursor: pointer;',
        '  display: flex; justify-content: space-between; align-items: center;',
        '  border-bottom: 1px solid #e5e7eb;',
        '}',
        '#work-checklist-panel .section-title {',
        '  font-size: 15px; font-weight: 600; color: #1f2937; margin: 0;',
        '}',
        '#work-checklist-panel .section-actions {',
        '  display: flex; gap: 6px;',
        '}',
        '#work-checklist-panel .icon-btn {',
        '  background: none; border: none; cursor: pointer; padding: 4px;',
        '  border-radius: 4px; display: flex; align-items: center;',
        '  transition: background 0.2s;',
        '}',
        '#work-checklist-panel .icon-btn:hover {',
        '  background: #e5e7eb;',
        '}',
        '#work-checklist-panel .icon-btn.primary {',
        '  color: #4f46e5;',
        '}',
        '#work-checklist-panel .icon-btn.danger {',
        '  color: #ef4444;',
        '}',
        '#work-checklist-panel .progress-container {',
        '  display: flex; align-items: center; gap: 8px; margin-top: 6px;',
        '}',
        '#work-checklist-panel .progress-bar {',
        '  flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;',
        '}',
        '#work-checklist-panel .progress-fill {',
        '  height: 100%; background: #4f46e5; transition: width 0.3s;',
        '}',
        '#work-checklist-panel .progress-text {',
        '  font-size: 12px; color: #6b7280; min-width: 40px;',
        '}',
        '#work-checklist-panel .section-body {',
        '  padding: 12px 16px;',
        '}',
        '#work-checklist-panel .item-list {',
        '  list-style: none; padding: 0; margin: 0;',
        '}',
        '#work-checklist-panel .checklist-group {',
        '  margin-bottom: 12px; padding-left: 12px; border-left: 2px solid #e5e7eb;',
        '}',
        '#work-checklist-panel .checklist-item {',
        '  display: flex; align-items: center; gap: 8px; padding: 6px 0;',
        '}',
        '#work-checklist-panel .checklist-item input[type="checkbox"] {',
        '  width: 18px; height: 18px; cursor: pointer;',
        '}',
        '#work-checklist-panel .item-text {',
        '  flex: 1; font-size: 14px; color: #374151;',
        '}',
        '#work-checklist-panel .item-text.completed {',
        '  text-decoration: line-through; color: #9ca3af;',
        '}',
        '#work-checklist-panel .modal-overlay {',
        '  position: fixed; top: 0; left: 0; width: 100%; height: 100%;',
        '  background: rgba(0,0,0,0.5); z-index: 1000000;',
        '  display: flex; align-items: center; justify-content: center;',
        '}',
        '#work-checklist-panel .modal {',
        '  background: white; border-radius: 12px; padding: 24px;',
        '  width: 90%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);',
        '}',
        '#work-checklist-panel .modal-title {',
        '  font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1f2937;',
        '}',
        '#work-checklist-panel .modal-input {',
        '  width: 100%; padding: 12px; border: 1px solid #d1d5db;',
        '  border-radius: 6px; font-size: 14px; margin-bottom: 16px;',
        '  box-sizing: border-box;',
        '}',
        '#work-checklist-panel .modal-input:focus {',
        '  outline: none; border-color: #4f46e5;',
        '}',
        '#work-checklist-panel .modal-actions {',
        '  display: flex; gap: 8px; justify-content: flex-end;',
        '}',
        '#work-checklist-panel .modal-btn {',
        '  padding: 10px 20px; border: none; border-radius: 6px;',
        '  cursor: pointer; font-size: 14px; font-weight: 500;',
        '}',
        '#work-checklist-panel .modal-btn-cancel {',
        '  background: #e5e7eb; color: #374151;',
        '}',
        '#work-checklist-panel .modal-btn-confirm {',
        '  background: #4f46e5; color: white;',
        '}',
        '#work-checklist-panel .modal-btn-confirm:hover {',
        '  background: #4338ca;',
        '}',
        '#work-checklist-panel .empty-state {',
        '  text-align: center; padding: 40px 20px; color: #9ca3af;',
        '}',
        '#work-checklist-toggle {',
        '  position: fixed; top: 220px; right: 20px; z-index: 999998;',
        '  background: #4f46e5; color: white; border: none; border-radius: 50%;',
        '  width: 50px; height: 50px; font-size: 24px; cursor: pointer;',
        '  box-shadow: 0 2px 10px rgba(0,0,0,0.3); transition: 0.2s;',
        '  display: flex; align-items: center; justify-content: center;',
        '  opacity: 0.9;',
        '}',
        '#work-checklist-toggle:hover {',
        '  opacity: 1; transform: scale(1.05);',
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

    var appData = { sections: [] };
    var currentModalAction = null;

    function createToggleButton() {
        var oldBtn = document.getElementById('work-checklist-toggle');
        if (oldBtn) oldBtn.remove();
        var toggle = document.createElement('button');
        toggle.id = 'work-checklist-toggle';
        toggle.textContent = ICON_CHECKLIST;
        toggle.title = 'Рабочий Чек-лист';
        toggle.onclick = function() {
            var panel = document.getElementById('work-checklist-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            } else {
                createPanel();
            }
        };
        document.body.appendChild(toggle);
        console.log('[WC] Кнопка чек-листа создана');
    }

    function createPanel() {
        var styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        var temp = document.createElement('div');
        temp.innerHTML = HTML;
        var panel = temp.firstChild;
        document.body.appendChild(panel);

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
        console.log('[WC] Панель чек-листа создана');
    }

    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function loadData() {
        try {
            var saved = GM_getValue('work_checklists', null);
            if (saved) {
                appData = JSON.parse(saved);
            }
        } catch (e) {
            console.error('[WC] Ошибка загрузки:', e);
            appData = { sections: [] };
        }
        render();
    }

    function saveData() {
        try {
            GM_setValue('work_checklists', JSON.stringify(appData));
        } catch (e) {
            console.error('[WC] Ошибка сохранения:', e);
        }
    }

    function render() {
        var list = document.getElementById('wc-sections-list');
        if (!list) return;

        list.innerHTML = '';

        if (!appData.sections || appData.sections.length === 0) {
            list.innerHTML = '<div class="empty-state">Нет разделов. Создайте первый!</div>';
            return;
        }

        appData.sections.forEach(function(section) {
            var sectionEl = document.createElement('div');
            sectionEl.className = 'section-card';

            var totalItems = 0;
            var completedItems = 0;

            if (section.items && section.items.length > 0) {
                section.items.forEach(function(item) {
                    totalItems++;
                    if (item.completed) completedItems++;
                    if (item.subtasks && item.subtasks.length > 0) {
                        item.subtasks.forEach(function(sub) {
                            totalItems++;
                            if (sub.completed) completedItems++;
                        });
                    }
                });
            }

            var percent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

            sectionEl.innerHTML = [
                '<div class="section-header" data-section-id="' + section.id + '">',
                '  <div style="flex: 1;">',
                '    <h4 class="section-title">' + escapeHtml(section.title) + '</h4>',
                '    <div class="progress-container">',
                '      <div class="progress-bar"><div class="progress-fill" style="width: ' + percent + '%"></div></div>',
                '      <span class="progress-text">' + completedItems + '/' + totalItems + '</span>',
                '    </div>',
                '  </div>',
                '  <div class="section-actions">',
                '    <button class="icon-btn primary" data-action="add-item" data-id="' + section.id + '" title="Добавить группу">' + ICON_PLUS + '</button>',
                '    <button class="icon-btn" data-action="reset" data-id="' + section.id + '" title="Сбросить">' + ICON_RESET + '</button>',
                '    <button class="icon-btn danger" data-action="delete" data-id="' + section.id + '" title="Удалить">' + ICON_DELETE + '</button>',
                '  </div>',
                '</div>',
                '<div class="section-body" id="body-' + section.id + '" style="' + (section.isOpen ? 'display: block;' : 'display: none;') + '">',
                '  <ul class="item-list" id="items-' + section.id + '"></ul>',
                '</div>'
            ].join('');

            var header = sectionEl.querySelector('.section-header');
            header.onclick = function(e) {
                if (e.target.closest('button')) return;
                section.isOpen = !section.isOpen;
                saveData();
                render();
            };

            var itemsList = sectionEl.querySelector('#items-' + section.id);

            if (section.items && section.items.length > 0) {
                section.items.forEach(function(item) {
                    var itemEl = document.createElement('li');
                    itemEl.className = 'checklist-group';

                    var itemHtml = [
                        '<div class="checklist-item">',
                        '  <input type="checkbox" class="item-check" data-sid="' + section.id + '" data-iid="' + item.id + '" ' + (item.completed ? 'checked' : '') + '>',
                        '  <strong class="item-text ' + (item.completed ? 'completed' : '') + '">' + escapeHtml(item.text) + '</strong>',
                        '  <button class="icon-btn primary" data-action="add-subtask" data-sid="' + section.id + '" data-iid="' + item.id + '" title="Добавить пункт">+</button>',
                        '  <button class="icon-btn danger" data-action="delete-item" data-sid="' + section.id + '" data-iid="' + item.id + '" title="Удалить">' + ICON_DELETE + '</button>',
                        '</div>'
                    ].join('');

                    if (item.subtasks && item.subtasks.length > 0) {
                        itemHtml += '<ul style="list-style: none; padding-left: 26px; margin-top: 4px;">';
                        item.subtasks.forEach(function(sub) {
                            itemHtml += [
                                '<li class="checklist-item">',
                                '  <input type="checkbox" class="sub-check" data-sid="' + section.id + '" data-iid="' + item.id + '" data-subid="' + sub.id + '" ' + (sub.completed ? 'checked' : '') + '>',
                                '  <span class="item-text ' + (sub.completed ? 'completed' : '') + '" style="font-size: 13px;">' + escapeHtml(sub.text) + '</span>',
                                '  <button class="icon-btn danger" data-action="delete-sub" data-sid="' + section.id + '" data-iid="' + item.id + '" data-subid="' + sub.id + '">' + ICON_DELETE + '</button>',
                                '</li>'
                            ].join('');
                        });
                        itemHtml += '</ul>';
                    }

                    itemEl.innerHTML = itemHtml;
                    itemsList.appendChild(itemEl);
                });
            }

            list.appendChild(sectionEl);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('#work-checklist-panel [data-action]').forEach(function(btn) {
            btn.onclick = function(e) {
                e.stopPropagation();
                var action = this.getAttribute('data-action');
                var id = this.getAttribute('data-id');
                var sid = this.getAttribute('data-sid');
                var iid = this.getAttribute('data-iid');
                var subid = this.getAttribute('data-subid');

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
        });

        document.querySelectorAll('#work-checklist-panel .item-check').forEach(function(cb) {
            cb.onchange = function() {
                toggleItem(this.getAttribute('data-sid'), this.getAttribute('data-iid'));
            };
        });

        document.querySelectorAll('#work-checklist-panel .sub-check').forEach(function(cb) {
            cb.onchange = function() {
                toggleSubtask(this.getAttribute('data-sid'), this.getAttribute('data-iid'), this.getAttribute('data-subid'));
            };
        });
    }

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

        if (action === 'addSection') {
            appData.sections.push({
                id: Date.now().toString(),
                title: val,
                items: [],
                isOpen: true
            });
        } else if (action === 'addGroup') {
            var section = appData.sections.find(function(s) { return s.id === params.sid; });
            if (section) {
                section.items.push({
                    id: Date.now().toString(),
                    text: val,
                    completed: false,
                    subtasks: []
                });
            }
        } else if (action === 'addSubtask') {
            var section = appData.sections.find(function(s) { return s.id === params.sid; });
            if (section) {
                var item = section.items.find(function(i) { return i.id === params.iid; });
                if (item) {
                    if (!item.subtasks) item.subtasks = [];
                    item.subtasks.push({
                        id: Date.now().toString(),
                        text: val,
                        completed: false
                    });
                }
            }
        }

        saveData();
        render();
        closeModal();
    }

    function toggleItem(sid, iid) {
        var section = appData.sections.find(function(s) { return s.id === sid; });
        if (section) {
            var item = section.items.find(function(i) { return i.id === iid; });
            if (item) {
                item.completed = !item.completed;
                saveData();
                render();
            }
        }
    }

    function toggleSubtask(sid, iid, subid) {
        var section = appData.sections.find(function(s) { return s.id === sid; });
        if (section) {
            var item = section.items.find(function(i) { return i.id === iid; });
            if (item && item.subtasks) {
                var sub = item.subtasks.find(function(s) { return s.id === subid; });
                if (sub) {
                    sub.completed = !sub.completed;
                    saveData();
                    render();
                }
            }
        }
    }

    function deleteItem(sid, iid) {
        var section = appData.sections.find(function(s) { return s.id === sid; });
        if (section) {
            section.items = section.items.filter(function(i) { return i.id !== iid; });
            saveData();
            render();
        }
    }

    function deleteSubtask(sid, iid, subid) {
        var section = appData.sections.find(function(s) { return s.id === sid; });
        if (section) {
            var item = section.items.find(function(i) { return i.id === iid; });
            if (item && item.subtasks) {
                item.subtasks = item.subtasks.filter(function(s) { return s.id !== subid; });
                saveData();
                render();
            }
        }
    }

    function resetSection(sid) {
        var section = appData.sections.find(function(s) { return s.id === sid; });
        if (section && confirm('Сбросить все отметки в этом разделе?')) {
            section.items.forEach(function(item) {
                item.completed = false;
                if (item.subtasks) {
                    item.subtasks.forEach(function(sub) { sub.completed = false; });
                }
            });
            saveData();
            render();
        }
    }

    function exportData() {
        try {
            var blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application