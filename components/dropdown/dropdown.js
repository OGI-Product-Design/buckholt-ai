// Dropdown _________________________________________________________________________
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.dropdown').forEach(function (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const label = dropdown.querySelector('.dropdown-label');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = dropdown.querySelectorAll('.dropdown-menu .dropdown-item');
        if (!menu) return;

        let tagSet = null;
        const collapseThreshold = dropdown.dataset.collapseThreshold ? parseInt(dropdown.dataset.collapseThreshold) : null;
        const bsDropdown = new bootstrap.Dropdown(toggle);

        function createTagSet() {
            tagSet = document.createElement('div');
            tagSet.classList.add('tag-set');
            dropdown.insertBefore(tagSet, dropdown.firstChild);

            tagSet.addEventListener('click', function (e) {
                if (!e.target.closest('.btn-close')) {
                    bsDropdown.toggle();
                    setTimeout(updateMenuPosition, 0);
                }
            });
        }

        function updateMenuPosition() {
            if (!menu.classList.contains('show')) {
                menu.style.transform = '';
                return;
            }
            const offset = toggle.offsetHeight + 2;
            menu.style.transform = `translate(0, ${offset}px)`;
        }

        toggle.addEventListener('shown.bs.dropdown', () => {
            requestAnimationFrame(updateMenuPosition);

            if (Array.from(items).some(i => i.querySelector('input[type="checkbox"]'))) {
                const selectableItems = Array.from(items).filter(i => !i.id.endsWith('-0'));
                const selectedItems = selectableItems.filter(i => i.classList.contains('active'));
                const unselectedItems = selectableItems.filter(i => !i.classList.contains('active'));

                selectedItems.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
                selectedItems.forEach(i => menu.appendChild(i));
                unselectedItems.forEach(i => menu.appendChild(i));
            }
        });

        toggle.addEventListener('hidden.bs.dropdown', () => {
            menu.style.transform = '';
        });

        document.addEventListener('click', function (e) {
            if (menu.classList.contains('show') && !dropdown.contains(e.target)) {
                bsDropdown.hide();
            }
        });

        dropdown.addEventListener('shown.bs.dropdown', () => {
            if (dropdown.querySelector('input[type="checkbox"]')) {
                menu.scrollTop = 0;
                return;
            }

            const selectedItem = menu.querySelector('.dropdown-item[aria-selected="true"]');
            if (selectedItem) selectedItem.scrollIntoView({ block: "nearest" });
        });

        items.forEach(function (item) {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const hasCheckbox = !!checkbox;
            const optionText = item.textContent.trim();

            // Ensure clicking the label does the same as clicking the whole <li>
const labelEl = item.querySelector('.form-check-label');
if (labelEl) {
    labelEl.addEventListener('click', function (e) {
        // Stop the native label→checkbox toggle so we only run the <li> logic once
        e.preventDefault();
        e.stopPropagation();
        // Trigger the existing <li> click handler (updates active state, checkbox, tags, etc.)
        item.click();
    }, { capture: true }); // capture ensures this runs before bubbling to the <li>
}

            item.setAttribute('aria-selected', 'false');

            item.addEventListener('mousedown', function () {
                if (!hasCheckbox) items.forEach(el => el.classList.remove('active'));
            });

            item.addEventListener('click', function (e) {
                if (hasCheckbox) {
                    if (this.id.endsWith('-0')) {
                        const selectAllCheckbox = checkbox;
                        const currentAria = this.getAttribute('aria-selected') === 'true';
                        this.setAttribute('aria-selected', !currentAria ? 'true' : 'false');

                        if (selectAllCheckbox.indeterminate) {
                            selectAllCheckbox.indeterminate = false;
                            selectAllCheckbox.checked = true;
                        } else if (e.target !== selectAllCheckbox) {
                            selectAllCheckbox.checked = !selectAllCheckbox.checked;
                        }

                        const selectAllChecked = selectAllCheckbox.checked;
                        const otherItems = Array.from(items).filter(i => !i.id.endsWith('-0'));

                        otherItems.forEach(i => {
                            const cb = i.querySelector('input[type="checkbox"]');
                            if (cb) cb.checked = selectAllChecked;

                            if (selectAllChecked) {
                                i.classList.add('active');
                                i.setAttribute('aria-selected', 'true');
                                addTag(i.textContent.trim(), i);
                            } else {
                                i.classList.remove('active');
                                i.setAttribute('aria-selected', 'false');
                                removeTag(i.textContent.trim());
                            }
                        });

                        updateSelectAllState();
                        updateLabelAndToggle();
                        setTimeout(updateMenuPosition, 0);
                        return;
                    }

                    const isActive = this.classList.contains('active');
                    if (isActive) {
                        this.classList.remove('active');
                        this.setAttribute('aria-selected', 'false');
                        if (checkbox) checkbox.checked = false;
                        removeTag(optionText);
                    } else {
                        this.classList.add('active');
                        this.setAttribute('aria-selected', 'true');
                        if (checkbox && e.target !== checkbox) checkbox.checked = true;
                        addTag(optionText, this);
                    }

                    updateSelectAllState();
                    updateLabelAndToggle();
                    setTimeout(updateMenuPosition, 0);
                } else {
                    if (label) label.textContent = optionText;
                    else if (toggle.tagName === 'INPUT') toggle.value = optionText;

                    items.forEach(el => el.classList.remove('active'));
                    items.forEach(el => el.setAttribute('aria-selected', 'false'));
                    this.classList.add('active');
                    this.setAttribute('aria-selected', 'true');
                }
            });
        });

        // Make label clicks behave exactly like clicking the whole <li>
    dropdown.addEventListener('click', function (e) {
        const lbl = e.target.closest('.form-check-label');
        if (!lbl || !dropdown.contains(lbl)) return;

        // Stop the native label->checkbox toggle so we only use the <li> logic
        e.preventDefault();
        e.stopPropagation();

        const li = lbl.closest('.dropdown-item');
        if (li) li.click(); // delegates to your existing <li> click handler
    });

        function updateSelectAllState() {
            if (!items.length) return;
            const selectAllItem = items[0];
            if (!selectAllItem.id.endsWith('-0')) return;

            const selectAllCheckbox = selectAllItem.querySelector('input[type="checkbox"]');
            const otherItems = Array.from(items).slice(1);
            const checkedCount = otherItems.filter(i => i.querySelector('input[type="checkbox"]').checked).length;

            if (checkedCount === 0) {
                selectAllCheckbox.indeterminate = false;
                selectAllCheckbox.checked = false;
            } else if (checkedCount === otherItems.length) {
                selectAllCheckbox.indeterminate = false;
                selectAllCheckbox.checked = true;
            } else {
                selectAllCheckbox.indeterminate = true;
                selectAllCheckbox.checked = false;
            }
        }

        function setToggleHeight() {
            if (tagSet && tagSet.children.length > 0) {
                toggle.style.height = `${tagSet.offsetHeight}px`;
            } else {
                toggle.style.removeProperty('height');
            }
        }

        function updateLabelAndToggle() {
            const selectedItems = Array.from(items)
                .filter(i => !i.id.endsWith('-0'))
                .filter(i => i.querySelector('input[type="checkbox"]')?.checked);
            const selectedCount = selectedItems.length;

            if (selectedCount === 0) {
                if (tagSet) {
                    tagSet.remove();
                    tagSet = null;
                }
                if (label) label.style.display = '';
                setToggleHeight();
                return;
            }

            if (!tagSet) createTagSet();
            tagSet.innerHTML = '';

            if (collapseThreshold && selectedCount > collapseThreshold) {
                const tag = document.createElement('span');
                tag.className = 'tag tag-dismissible expressive-light';

                const tagLabel = document.createElement('span');
                tagLabel.className = 'tag-label';
                const summaryLabel = dropdown.dataset.summaryLabel || 'selected';
                tagLabel.textContent = `${selectedCount} ${summaryLabel}`;

                const closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.className = 'btn-close btn-close-sm';
                closeBtn.setAttribute('aria-label', 'Close');

                closeBtn.addEventListener('click', function (ev) {
                    ev.stopPropagation();
                    items.forEach(i => {
                        i.classList.remove('active');
                        i.setAttribute('aria-selected', 'false');
                        const cb = i.querySelector('input[type="checkbox"]');
                        if (cb) cb.checked = false;
                    });
                    tagSet.remove();
                    tagSet = null;
                    updateSelectAllState();
                    updateLabelAndToggle();
                    setToggleHeight();
                    updateMenuPosition();
                });

                tag.appendChild(tagLabel);
                tag.appendChild(closeBtn);
                tagSet.appendChild(tag);
            } else {
                selectedItems.forEach(i => addTag(i.textContent.trim(), i));
            }

            if (tagSet && tagSet.children.length > 0) {
                if (label) label.style.display = 'none';
            } else {
                if (label) label.style.display = '';
            }

            setToggleHeight();
        }

        function addTag(text, itemElement) {
            if (!tagSet) createTagSet();
            if ([...tagSet.children].some(tag => tag.querySelector('.tag-label')?.textContent === text)) return;

            const tag = document.createElement('span');
            tag.className = 'tag tag-dismissible expressive-light';

            const tagLabel = document.createElement('span');
            tagLabel.className = 'tag-label';
            tagLabel.textContent = text;

            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'btn-close btn-close-sm';
            closeBtn.setAttribute('aria-label', 'Close');

            closeBtn.addEventListener('click', function (ev) {
                ev.stopPropagation();
                tag.remove();
                const matchingItem = Array.from(items).find(el => el.textContent.trim() === text);
                if (matchingItem) {
                    matchingItem.classList.remove('active');
                    matchingItem.setAttribute('aria-selected', 'false');
                    const cb = matchingItem.querySelector('input[type="checkbox"]');
                    if (cb) cb.checked = false;
                }
                if (!tagSet || tagSet.children.length === 0) {
                    tagSet?.remove();
                    tagSet = null;
                }
                updateSelectAllState();
                setToggleHeight();
                updateMenuPosition();
                updateLabelAndToggle();
            });

            tag.appendChild(tagLabel);
            tag.appendChild(closeBtn);

            const existingTags = Array.from(tagSet.children);
            let inserted = false;
            for (let i = 0; i < existingTags.length; i++) {
                const existingText = existingTags[i].querySelector('.tag-label')?.textContent || '';
                if (text.localeCompare(existingText) < 0) {
                    tagSet.insertBefore(tag, existingTags[i]);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) tagSet.appendChild(tag);

            setToggleHeight();
        }

        function removeTag(text) {
            if (!tagSet) return;
            const tag = Array.from(tagSet.children).find(el => el.querySelector('.tag-label')?.textContent === text);
            if (tag) {
                tag.remove();
                if (tagSet.children.length === 0) {
                    tagSet.remove();
                    tagSet = null;
                }
                setToggleHeight();
            }
        }
    });

    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(function(item) {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
});

// Typeahead ________________________________________________________________________
document.querySelectorAll('.dropdown input.dropdown-toggle').forEach(function(input) {
    const dropdown = input.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    const items = Array.from(menu.querySelectorAll('.dropdown-item'));
    const clearBtn = dropdown.querySelector('.input-clear');

    let firstMatch = null;
    let suppressAutocomplete = false; // set on edit/navigation keys
    let composing = false;            // IME composition guard

    // Reset active/selected state
    function resetSelection() {
        items.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
        });
    }

    // Mark a specific item as selected and apply UI state
    function selectItem(item) {
        if (!item) return;
        resetSelection();
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
        input.value = item.textContent.trim();
        if (clearBtn) clearBtn.style.display = 'inline-block';
        bootstrap.Dropdown.getOrCreateInstance(input).hide();
        // After selection, show all items again
        items.forEach(i => (i.style.display = ''));
    }

    // Filter + autocomplete
    function filterMenu() {
        const raw = input.value;                   // exact user text
        const query = raw.trim().toLowerCase();    // for matching
        firstMatch = null;

        items.forEach(item => {
        const text = item.textContent.trim().toLowerCase();
        const match = text.includes(query);
        item.style.display = match ? '' : 'none';
        if (match && !firstMatch) firstMatch = item;
        });

        const visibleItems = items.filter(i => i.style.display !== 'none');
        if (visibleItems.length && query !== '') {
        bootstrap.Dropdown.getOrCreateInstance(input).show();
        } else if (!visibleItems.length) {
        bootstrap.Dropdown.getOrCreateInstance(input).hide();
        }

        // Clear button visibility mirrors whether anything is typed
        if (clearBtn) clearBtn.style.display = raw.trim() ? 'inline-block' : 'none';

        // --- Autocomplete (guarded) ---
        // Only when: not editing, not composing, have a first match, non-empty query,
        // caret at end, and last char isn't whitespace.
        if (
        !suppressAutocomplete &&
        !composing &&
        firstMatch &&
        query !== '' &&
        !/\s$/.test(raw)
        ) {
        const matchText = firstMatch.textContent.trim();
        if (matchText.toLowerCase().startsWith(query)) {
            const caretAtEnd =
            input.selectionStart === raw.length && input.selectionEnd === raw.length;
            if (caretAtEnd) {
            input.value = matchText;
            const start = Math.min(raw.length, matchText.length);
            input.setSelectionRange(start, matchText.length); // select the suggested tail
            }
        }
        }

        // reset the guard after handling this input cycle
        suppressAutocomplete = false;
    }

    // Events
    input.addEventListener('input', filterMenu);

    // Guard autocomplete on edit/navigation keys so Backspace/Delete work naturally
    input.addEventListener('keydown', (e) => {
        const editKeys = [
        'Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'
        ];
        if (editKeys.includes(e.key)) {
        suppressAutocomplete = true;
        }
        // Confirm the current suggestion with Enter/Space
        if ((e.key === 'Enter' || e.key === ' ') && firstMatch) {
        e.preventDefault();
        selectItem(firstMatch);
        }
    });

    // IME composition (e.g., East Asian input) — don't autocomplete mid-composition
    input.addEventListener('compositionstart', () => { composing = true; });
    input.addEventListener('compositionend', () => { composing = false; filterMenu(); });

    input.addEventListener('blur', () => {
        setTimeout(() => {
        if (input.value.trim() === '') {
            items.forEach(item => (item.style.display = ''));
            if (clearBtn) clearBtn.style.display = 'none';
            resetSelection();
        }
        }, 100);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
        input.value = '';
        items.forEach(item => (item.style.display = ''));
        clearBtn.style.display = 'none';
        bootstrap.Dropdown.getOrCreateInstance(input).hide();
        resetSelection();
        input.focus();
        });
    }
});
