
//zmienne globalne
let moves = 0,
    winner = 0,
    x = 1,
    o = 3,
    gracz = x,
    computer = o,
    czyjRuch = x,
    graOver = false,
    wynik = {
        remis: 0,
        gracz: 0,
        computer: 0
            },

    xtekst = "<span class=\"x\">X</class>",
    otekst = "<span class=\"o\">O</class>",
    gracztekst = xtekst,
    computertekst = otekst,
    mykratka = null;

//funkcje pomocnicze
	function sumArray(array) {
    let sum = 0,
        i = 0;
    for (i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

function wtablicy(element, array) {
    if (array.indexOf(element) > -1) {
        return true;
    }
    return false;
}

function mieszajArray(array) {
    let counter = array.length,
        temp,
        index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function intRandom(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}





//stworzenie kratki do gry
function kratka() {
    this.cells = new Array(9);
}

// znajduje wolne komorki w tablicy i indeksuje je
kratka.prototype.getwolneCellindex = function () {
    let i = 0,
        wynikArray = [];
    for (i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === 0) {
            wynikArray.push(i);
        }
    }
    return wynikArray;
};

//zwraca wartosc wiersza

kratka.prototype.getwierszwart = function (index) {
    let i = index * 3;
    return this.cells.slice(i, i + 3);
};

//zwraca indeks wiersza
kratka.prototype.getwierszindex = function (index) {
    let wiersz = [];
    index = index * 3;
    wiersz.push(index);
    wiersz.push(index + 1);
    wiersz.push(index + 2);
    return wiersz;
};

// zwaraca wartosc kolumny
kratka.prototype.getkolumnawart = function (index) {
    let i, kolumna = [];
    for (i = index; i < this.cells.length; i += 3) {
        kolumna.push(this.cells[i]);
    }
    return kolumna;
};

//zwara indeks kolumny
kratka.prototype.getkolumnaindex = function (index) {
    let i, kolumna = [];
    for (i = index; i < this.cells.length; i += 3) {
        kolumna.push(i);
    }
    return kolumna;
};

// zwraca warttosci diagonalne(przekatna)
// arg 0: od gory z lewej
// arg 1: od gory z prawej
kratka.prototype.getDiagwart = function (arg) {
    let cells = [];

 if (arg === 0) {
        cells.push(this.cells[0]);
        cells.push(this.cells[4]);
        cells.push(this.cells[8]);
    } else {
        cells.push(this.cells[2]);
        cells.push(this.cells[4]);
        cells.push(this.cells[6]);
    }
    return cells;
};

// zwraca warttosci diagonalne(przekatna)
// arg 0: od gory z lewej
// arg 1: od gory z prawej
kratka.prototype.getDiagindex = function (arg) {
    if (arg === 0) {
        return [0, 4, 8];
    } else {
        return [2, 4, 6];
    }
};

// Bierze indeks dwoch komorek pod rzad (dla gracza lub komputera)
kratka.prototype.getpierwszedwawAwiersz = function (agent) {

    let sum = agent * 2,
        wolnecells = mieszajArray(this.getwolneCellindex());
    for (let i = 0; i < wolnecells.length; i++) {
        for (let j = 0; j < 3; j++) {
            let wierszV = this.getwierszwart(j);
            let wierszI = this.getwierszindex(j);
            let colV = this.getkolumnawart(j);
            let colI = this.getkolumnaindex(j);
            if (sumArray(wierszV) == sum && wtablicy(wolnecells[i], wierszI)) {
                return wolnecells[i];
            } else if (sumArray(colV) == sum && wtablicy(wolnecells[i], colI)) {
                return wolnecells[i];
            }
        }
        for (j = 0; j < 2; j++) {
            let diagV = this.getDiagwart(j);
            let diagI = this.getDiagindex(j);
            if (sumArray(diagV) == sum && wtablicy(wolnecells[i], diagI)) {
                return wolnecells[i];
            }
        }
    }
    return false;
};

kratka.prototype.reset = function () {
    for (let i = 0; i < this.cells.length; i++) {
        this.cells[i] = 0;
    }
    return true;
};

//wykonywane od razu po zaladowaniu strony
function int() {
    mykratka = new kratka();
    moves = 0;
    winner = 0;
    graOver = false;
    czyjRuch = gracz; // domyslnie gracz zaczyna
    for (let i = 0; i <= mykratka.cells.length - 1; i++) {
        mykratka.cells[i] = 0;
    }
    setTimeout(showOptions, 100);
}

//wybor czy gramy kolkiem czy krzyzykiem
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
    document.getElementById("graczFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", setgraczX);
    document.getElementById("noBtn").removeEventListener("click", setgraczO);
}


//wstawia znak po klikniecu kratki
function cellClicked(id) {
    let idName = id.toString();
    let cell = parseInt(idName[idName.length - 1]);
    moves += 1;
    if (mykratka.cells[cell] > 0 || czyjRuch !== gracz || graOver) {
        // jesli w kratce jest juz znak to nie pozwala kliknac jej ponownie
        return false;
    }
    document.getElementById(id).innerHTML = gracztekst;
    mykratka.cells[cell] = gracz;

    // Sprawdza czy jest zwyciezca
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0) {
        czyjRuch = computer;
        ruchkomputer();
    }
    return true;
}

//resetuje kratke po skonczonej grze
function restart(ask) {

    graOver = false;
    moves = 0;
    winner = 0;
    czyjRuch = x;
    mykratka.reset();
    for (let i = 0; i <= 8; i++) {
        let id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    if (ask === true) {
        setTimeout(showOptions, 200);
    } else if (czyjRuch == computer) {
        setTimeout(ruchkomputer, 200);
    }
}

// Skrypt komputera
function ruchkomputer() {

    let cell = -1,
        myArr = [],
        corners = [0,2,6,8];
    if (moves >= 3) {
        cell = mykratka.getpierwszedwawAwiersz(computer);
        if (cell === false) {
            cell = mykratka.getpierwszedwawAwiersz(gracz);
        }
        if (cell === false) {
            if (mykratka.cells[4] === 0) {
                cell = 4;
            } else {
                myArr = mykratka.getwolneCellindex();
                cell = myArr[intRandom(0, myArr.length - 1)];
            }
        }



        //unikniecie catch-22
        if (moves == 3 && mykratka.cells[4] == computer && gracz == x ) {
            if (mykratka.cells[7] == gracz && (mykratka.cells[0] == gracz || mykratka.cells[2] == gracz)) {
                myArr = [6,8];
                cell = myArr[intRandom(0,1)];
            }
            else if (mykratka.cells[5] == gracz && (mykratka.cells[0] == gracz || mykratka.cells[6] == gracz)) {
                myArr = [2,8];
                cell = myArr[intRandom(0,1)];
            }
            else if (mykratka.cells[3] == gracz && (mykratka.cells[2] == gracz || mykratka.cells[8] == gracz)) {
                myArr = [0,6];
                cell = myArr[intRandom(0,1)];
            }
            else if (mykratka.cells[1] == gracz && (mykratka.cells[6] == gracz || mykratka.cells[8] == gracz)) {
                myArr = [0,2];
                cell = myArr[intRandom(0,1)];
            }
        }
        else if (moves == 3 && mykratka.cells[4] == gracz && gracz == x ) {
            if (mykratka.cells[2] == gracz && mykratka.cells[6] == computer) {
                cell = 8;
            }
            else if (mykratka.cells[0] == gracz && mykratka.cells[8] == computer) {
                cell = 6;
            }
            else if (mykratka.cells[8] == gracz && mykratka.cells[0] == computer) {
                cell = 2;
            }
            else if (mykratka.cells[6] == gracz && mykratka.cells[2] == computer) {
                cell = 0;
            }
        }
    } else if (moves === 1 && mykratka.cells[4] == gracz ) {
        // jesli gracz postawi znak na srodku planszy, komputer stawia w rogu
        cell = corners[intRandom(0,3)];

    } else if (moves === 2 && mykratka.cells[4] == gracz && computer == x) {
        // jesli gracz gra kolkiem i zagral srodek, komputer wstawia znak na przeciwnych rogach
        if (mykratka.cells[0] == computer) {
            cell = 8;
        }
        else if (mykratka.cells[2] == computer) {
            cell = 6;
        }
        else if (mykratka.cells[6] == computer) {
            cell = 2;
        }
        else if (mykratka.cells[8] == computer) {
            cell = 0;
        }
    } else if (moves === 0 && intRandom(1,10) < 8) {
        // jesli kompuer jest krzyzykiem, czasem zaczyna od rogu
        cell = corners[intRandom(0,3)];
    } else {
        // wybiera srodek kratki jesli mozliwe
        if (mykratka.cells[4] === 0) {
            cell = 4;
        } else {
            myArr = mykratka.getwolneCellindex();
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
    }
    let id = "cell" + cell.toString();
    document.getElementById(id).innerHTML = computertekst;
    document.getElementById(id).style.cursor = "default";


    mykratka.cells[cell] = computer;
    moves += 1;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0 && !graOver) {
        czyjRuch = gracz;
    }
}

// sprawdza czy mamy koniec gry i okresla zwyciezce
function checkWin() {
    winner = 0;

    //wiersze
    for (let i = 0; i <= 2; i++) {
        let wiersz = mykratka.getwierszwart(i);
        if (wiersz[0] > 0 && wiersz[0] == wiersz[1] && wiersz[0] == wiersz[2]) {
            if (wiersz[0] == computer) {
                wynik.computer++;
                winner = computer;

            } else {
                wynik.gracz++;
                winner = gracz;

            }
            //zmienia kolor zwycieskiego wiersza
            let tmpAr = mykratka.getwierszindex(i);
            for (let j = 0; j < tmpAr.length; j++) {
                let str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endgra, 0, winner);
            return winner;
        }
    }

    //kolumny
    for (i = 0; i <= 2; i++) {
        let col = mykratka.getkolumnawart(i);
        if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
            if (col[0] == computer) {
                wynik.computer++;
                winner = computer;

            } else {
                wynik.gracz++;
                winner = gracz;

            }
            // zmienia kolor zwycieskiej kolumny
            let tmpAr = mykratka.getkolumnaindex(i);
            for (let j = 0; j < tmpAr.length; j++) {
                let str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endgra, 0, winner);
            return winner;
        }
    }

    //przekatne
    for (i = 0; i <= 1; i++) {
        let diagonal = mykratka.getDiagwart(i);
        if (diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
            if (diagonal[0] == computer) {
                wynik.computer++;
                winner = computer;

            } else {
                wynik.gracz++;
                winner = gracz;

            }
            // zmienia kolor zwycieskiej przekatnej
            let tmpAr = mykratka.getDiagindex(i);
            for (let j = 0; j < tmpAr.length; j++) {
                let str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endgra, 200, winner);
            return winner;
        }
    }

    // jesli nie ma zwyciescy, zapisuje remis
    let myArr = mykratka.getwolneCellindex();
    if (myArr.length === 0) {
        winner = 10;
        wynik.remis++;
        endgra(winner);
        return winner;
    }

    return winner;
}



function announceWinner(tekst) {
    document.getElementById("wintekst").innerHTML = tekst;
    document.getElementById("zwyc").style.display = "block";
    setTimeout(zamknijwybor, 1200, "zwyc");
}

//wybor  czym gramy
function askgracz(tekst) {
    document.getElementById("questiontekst").innerHTML = tekst;
    document.getElementById("graczFeedback").style.display = "block";
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
        czyjRuch = gracz;
        gracztekst = xtekst;
        computertekst = otekst;
    }
    else {
        gracz = o;
        computer = x;
        czyjRuch = computer;
        gracztekst = otekst;
        computertekst = xtekst;
        setTimeout(ruchkomputer, 400);
    }
    document.getElementById("optionsDlg").style.display = "none";
}

function zamknijwybor(id) {
    document.getElementById(id).style.display = "none";
}

//wyswietla informacje o wyniku gry i liczy zdobyte punkty

function endgra(who) {
    if (who == gracz) {
        announceWinner("Wygrałeś!");
    } else if (who == computer) {
        announceWinner("Wygrał komputer...");
    } else {
        announceWinner("Mamy remisik.");
    }
    graOver = true;
    czyjRuch = 0;
    moves = 0;
    winner = 0;
    document.getElementById("computer_wynik").innerHTML = wynik.computer;
    document.getElementById("remis_wynik").innerHTML = wynik.remis;
    document.getElementById("gracz_wynik").innerHTML = wynik.gracz;
    for (let i = 0; i <= 8; i++) {
        let id = "cell" + i.toString();
        document.getElementById(id).style.cursor = "default";
    }
    setTimeout(restart, 1200);
}
