/**
 * {
 * pad: "pad text here",
 * notes:[['35','200','note text here'],['45','0','note text here']]
 * }
 */
let clicks = 0, t, count = 0,
    save = {"pad":"","notes":{},"toggle": false},
    load = JSON.parse(localStorage.getItem('padSave'));

    save.pad = load?.pad || "";
save.toggle = load?.toggle || false;

const div = document.getElementById('textbox'),
    span = document.getElementById('placeholder'),
    notes = document.getElementById('notes'),
    preventDefault = e => e.preventDefault(),
    createNote = (x, y, txt = 'New Note') => {
        save.notes[count] = [x, y, txt];
        localStorage.setItem('padSave', JSON.stringify(save));
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
                localStorage.setItem('padSave', JSON.stringify(save));
            } else if (noteContent.innerText === '@toggle') {
                note.remove();
                save.toggle = !save.toggle;
                save.toggle ? document.body.className = "dark" : document.body.className = "";
                delete save.notes[index];
                localStorage.setItem('padSave', JSON.stringify(save));
            } else {
                save.notes[index][2] = noteContent.innerText;
                localStorage.setItem('padSave', JSON.stringify(save));
            }
        });
        note.appendChild(noteContent);
        notes.appendChild(note);
    },
    checkClicks = () => {
        clicks++;
        if (clicks === 1) t = setTimeout(() => clicks = 0, 400); 
        else if (clicks === 3){
            clicks = 0;
            createNote(35, scrollY + 200);
            clearTimeout(t);
        }
    }
div.focus();
save.toggle ? document.body.className = "dark" : document.body.className = "";
div.innerText = save.pad;
span.innerText = div.innerText === '' ? 'Type here to start!' : '';
for (let i in load?.notes) createNote(load.notes[i][0], load.notes[i][1], load.notes[i][2]);

div.addEventListener('input', () => {
    span.innerText = div.innerText === '' ? 'Type here to start!' : '';
    save.pad = div.innerText;
    localStorage.setItem('padSave', JSON.stringify(save));
});

addEventListener('mousedown', e => {
    if (window.DocumentTouch && window.document instanceof DocumentTouch || window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints) return;
    checkClicks();
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
    checkClicks();
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