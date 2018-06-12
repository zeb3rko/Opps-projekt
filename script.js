var moves = 0,
    winner = 0,
    x = 1,
    o = 3,
    gracz = x,
    computer = o,
    czyjRuch = x,

    wynik = {
        remis: 0,
        gracz: 0,
        computer: 0
    },

    mykratka = null;

function kratka() {
    this.cells = new Array(9);
}

function int() {
    mykratka = new kratka();
    moves = 0;
    winner = 0;
    graOver = false;
    czyjRuch = gracz;
    for (var i = 0; i <= mykratka.cells.length - 1; i++) {
        mykratka.cells[i] = 0;
    }
    setTimeout(showOptions, 200);
}

function setgraczX() {
    gracz = x;
    computer = o;
    czyjRuch = gracz;
    gracztekst = xtekst;
    computertekst = otekst;
    document.getElementById("graczFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", setgraczX);
    document.getElementById("noBtn").removeEventListener("click", setgraczO);
}

function setgraczO() {
    gracz = o;
    computer = x;
    czyjRuch = computer;
    gracztekst = otekst;
    computertekst = xtekst;
    setTimeout(ruchkomputer, 200);
    document.getElementById("graczFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", setgraczX);
    document.getElementById("noBtn").removeEventListener("click", setgraczO);
}
function showOptions() {
    if (gracz == o) {
        document.getElementById("gx").checked = false;
        document.getElementById("go").checked = true;
    }
    else if (gracz == x) {
        document.getElementById("gx").checked = true;
        document.getElementById("go").checked = false;
    }

    document.getElementById("optionsDlg").style.display = "block";
}

function getOptions() {

    if (document.getElementById('gx').checked === true) {
        gracz = x;
        computer = o;

    }
    else {
        gracz = o;
        computer = x;
    
    }
    document.getElementById("optionsDlg").style.display = "none";
}
