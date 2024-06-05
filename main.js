/**
 * {
 * pad: "pad text here",
 * notes:[['35','200','note text here'],['45','0','note text here']]
 * }
 */
let double = false, t, count = 0,
    save = JSON.parse(localStorage.getItem('padSave') || '{"pad":"","notes":{}}');

const div = document.getElementById('textbox'),
    span = document.getElementById('placeholder'),
    notes = document.getElementById('notes'),
    preventDefault = e => e.preventDefault(),
    createNote = (x, y, txt = 'New Note', saving = true) => {
        if (saving) {
            save.notes[count] = [x, y, txt];
            localStorage.setItem('padSave', JSON.stringify(save));
        }
        let index = count++,
            note = document.createElement('div'),
            noteContent = document.createElement('span');
        note.className = 'note';
        note.index = index;
        note.style.left = x + '%';
        note.style.top = y + 'px';
        noteContent.contentEditable = true;
        noteContent.innerText = txt;
        noteContent.addEventListener('focusout', () => {
            if (noteContent.innerText === '') {
                note.remove();
                delete save.notes[index];
            } else {
                save.notes[index][2] = noteContent.innerText;
                localStorage.setItem('padSave', JSON.stringify(save));
            }
        });
        note.appendChild(noteContent);
        notes.appendChild(note);
    },
    checkDouble = () => {
        if (!double) {
            double = true;
            t = setTimeout(() => double = false, 300);
        } else {
            double = false;
            createNote(35, div.scrollTop + 200);
            clearTimeout(t);
        }
    }
div.focus();
div.innerText = save.pad;
span.innerText = div.innerText === '' ? 'Type here to start!' : '';
for (let i in save.notes) createNote(save.notes[i][0], save.notes[i][1], save.notes[i][2], false);

div.addEventListener('input', () => {
    span.innerText = div.innerText === '' ? 'Type here to start!' : '';
    save.pad = div.innerText;
    localStorage.setItem('padSave', JSON.stringify(save));
});

addEventListener('mousedown', e => {
    if (window.DocumentTouch && window.document instanceof DocumentTouch || window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints) return;
    checkDouble();
    let targ = e.target;
    if (targ.className != 'note') return;
    const offsetX = e.clientX / innerWidth * 100, offsetY = e.clientY,
        coordX = parseInt(targ.style.left), coordY = parseInt(targ.style.top),
        move = ev => {
            targ.style.left = coordX + ev.clientX / innerWidth * 100 - offsetX + '%';
            targ.style.top = coordY + ev.clientY - offsetY + 'px';
        }
    addEventListener('mousedown', preventDefault, { passive: false });
    addEventListener('mousemove', preventDefault, { passive: false });
    addEventListener("mousemove", move);
    addEventListener('mouseup', function release() {
        targ.style.left = parseInt(targ.style.left) + '%';
        targ.style.top = parseInt(targ.style.top) + 'px';
        save.notes[targ.index][0] = parseInt(targ.style.left);
        save.notes[targ.index][1] = parseInt(targ.style.top);
        localStorage.setItem('padSave', JSON.stringify(save));
        removeEventListener("mousemove", move);
        removeEventListener('mouseup', release);
        removeEventListener('mousedown', preventDefault, { passive: false });
        removeEventListener('mousemove', preventDefault, { passive: false });
    });
});

addEventListener('touchstart', e => {
    checkDouble();
    let targ = e.touches[0].target;
    if (targ.className != 'note') return;
    const offsetX = e.touches[0].clientX / innerWidth * 100, offsetY = e.touches[0].clientY,
        coordX = parseInt(targ.style.left), coordY = parseInt(targ.style.top),
        move = ev => {
            targ.style.left = coordX + ev.touches[0].clientX / innerWidth * 100 - offsetX + '%';
            targ.style.top = coordY + ev.touches[0].clientY - offsetY + 'px';
        }
    addEventListener('touchstart', preventDefault, { passive: false });
    addEventListener('touchmove', preventDefault, { passive: false });
    addEventListener("touchmove", move);
    addEventListener('touchend', function release() {
        targ.style.left = parseInt(targ.style.left) + '%';
        targ.style.top = parseInt(targ.style.top) + 'px';
        save.notes[targ.index][0] = parseInt(targ.style.left);
        save.notes[targ.index][1] = parseInt(targ.style.top);
        localStorage.setItem('padSave', JSON.stringify(save));
        removeEventListener("touchmove", move);
        removeEventListener('touchend', release);
        removeEventListener('touchstart', preventDefault, { passive: false });
        removeEventListener('touchmove', preventDefault, { passive: false });
    });
});