const CELLS = document.querySelectorAll(".row > div");
const BUTTON_MENU = document.querySelectorAll(".menu > button");
const START = document.getElementById("start");
const NBR_ROWS = 11;
const NBR_COLUMNS = 30;
const SPEED_PROPAGATION = 100;

//0 pour position de départ
//1 pour obstacle
//2 pour objectif
let selectedElement = 0;
for(let i = 0; i < BUTTON_MENU.length; i++){
    BUTTON_MENU[i].addEventListener("click", () => {
        selectedElement = i;
    });
}

START.addEventListener("click", () => {
    FloodPropagation();
})

for(let i = 0; i < CELLS.length; i++){
    CELLS[i].addEventListener("click", () => {
        PlaceStuff(i);
    });
}

let matrixCells = new Array(NBR_ROWS);
for(let i = 0; i < NBR_ROWS; i++){
    matrixCells[i] = new Array(NBR_COLUMNS).fill(-1);
}

//Position de départ sur la case 0
let positionToCheck = [0];
let positionOfObjective = 200
let isObjectiveFound = false;
matrixCells[Math.floor(positionToCheck[0] / NBR_COLUMNS)][positionToCheck[0] % NBR_COLUMNS] = 0;
CELLS[positionToCheck[0]].style.backgroundColor = "red";

matrixCells[Math.floor(positionOfObjective / NBR_COLUMNS)][positionOfObjective % NBR_COLUMNS] = -3;
CELLS[positionOfObjective].style.backgroundColor = "green";

let counter = 1;

//0 est la position de départ
//-1 veut dire que l'endroit n'a pas encore été exploré/est libre
//-2 veut dire que c'est un mur
//-3 veut dire que c'est l'objectif
function PlaceStuff(selectedCell){
    if(selectedElement == 0){//Start position
        CELLS[positionToCheck[0]].style.backgroundColor = "white";
        CELLS[selectedCell].style.backgroundColor = "red";

        matrixCells[Math.floor(positionToCheck[0] / NBR_COLUMNS)][positionToCheck[0] % NBR_COLUMNS] = -1;
        matrixCells[Math.floor(selectedCell / NBR_COLUMNS)][selectedCell % NBR_COLUMNS] = 0;
        positionToCheck[0] = selectedCell;
    }
    else if(selectedElement == 1){//OBSTACLE
        if(matrixCells[Math.floor(selectedCell / NBR_COLUMNS)][selectedCell % NBR_COLUMNS] == -2){
            CELLS[selectedCell].style.backgroundColor = "white";
            matrixCells[Math.floor(selectedCell / NBR_COLUMNS)][selectedCell % NBR_COLUMNS] = -1;
        }else{
            matrixCells[Math.floor(selectedCell / NBR_COLUMNS)][selectedCell % NBR_COLUMNS] = -2;
            CELLS[selectedCell].style.backgroundColor = "gray";
        }
    }
    else if(selectedElement == 2){//OBJECTIF
        CELLS[positionOfObjective].style.backgroundColor = "white";
        CELLS[selectedCell].style.backgroundColor = "green";

        matrixCells[Math.floor(positionOfObjective / NBR_COLUMNS)][positionOfObjective % NBR_COLUMNS] = -1;
        matrixCells[Math.floor(selectedCell / NBR_COLUMNS)][selectedCell % NBR_COLUMNS] = -3;
        positionOfObjective = selectedCell;
    }
}

function FloodPropagation(){
    let newSurrounding = [];
    for(let i = 0; i < positionToCheck.length; i++){
        let row = Math.floor(positionToCheck[i] / NBR_COLUMNS);
        let column = positionToCheck[i] % NBR_COLUMNS;
        newSurrounding = newSurrounding.concat(CheckSurrounding(row, column, counter));
    }
    if(newSurrounding.length != 0){
        if(newSurrounding.includes(positionOfObjective) == false){
            positionToCheck = [...newSurrounding];
            counter++;
            setTimeout(() => {
                FloodPropagation();
            }, SPEED_PROPAGATION);
        }else{
            matrixCells[Math.floor(positionOfObjective / NBR_COLUMNS)][positionOfObjective % NBR_COLUMNS] = -3;
            CELLS[positionOfObjective].style.backgroundColor = "green";
            isObjectiveFound = true;
            FloodComplete();
        }
    }else{
        FloodComplete();
    }
}

function FloodComplete(){
    if(isObjectiveFound){
        TraceBackPath();
    }else{
        window.alert("L'objectif n'a pas été trouvé.");
    }
}

function TraceBackPath(){
    let currentCell = positionOfObjective;
    while(counter > 1){
        currentCell = FindPreviousNumber(counter, currentCell);
        CELLS[currentCell].style.backgroundColor = "yellow";
        counter--;
    }
}

function CheckSurrounding(rowToCheck, columnToCheck, counter){
    let newPositionToCheck = [];
    if(rowToCheck-1 >= 0 && (matrixCells[rowToCheck-1][columnToCheck] == -1 || matrixCells[rowToCheck-1][columnToCheck] == -3)){
        newPositionToCheck.push((rowToCheck-1) * NBR_COLUMNS + columnToCheck);
        matrixCells[rowToCheck-1][columnToCheck] = counter;
    }

    if(columnToCheck+1 < NBR_COLUMNS && (matrixCells[rowToCheck][columnToCheck+1] == -1 || matrixCells[rowToCheck][columnToCheck+1] == -3)){
        newPositionToCheck.push(rowToCheck * NBR_COLUMNS + (columnToCheck+1));
        matrixCells[rowToCheck][columnToCheck+1] = counter;
    }

    if(rowToCheck+1 < NBR_ROWS && (matrixCells[rowToCheck+1][columnToCheck] == -1 || matrixCells[rowToCheck+1][columnToCheck] == -3)){
        newPositionToCheck.push((rowToCheck+1) * NBR_COLUMNS + columnToCheck);
        matrixCells[rowToCheck+1][columnToCheck] = counter;
    }

    if(columnToCheck-1 >= 0 && (matrixCells[rowToCheck][columnToCheck-1] == -1 || matrixCells[rowToCheck][columnToCheck-1] == -3)){
        newPositionToCheck.push(rowToCheck * NBR_COLUMNS + (columnToCheck-1));
        matrixCells[rowToCheck][columnToCheck-1] = counter;
    }
    newPositionToCheck.forEach(element => {
        CELLS[element].style.backgroundColor = "orange";
        //CELLS[element].innerHTML = counter.toString();
    });
    return newPositionToCheck;
}

function FindPreviousNumber(counter, currentCell){
    let row = Math.floor(currentCell / NBR_COLUMNS);
    let column = currentCell % NBR_COLUMNS;

    if(row-1 >= 0 && matrixCells[row-1][column] == counter-1){
        return (row-1) * NBR_COLUMNS + column;
    }

    if(column+1 < NBR_COLUMNS && matrixCells[row][column+1] == counter-1){
        return row * NBR_COLUMNS + (column+1);
    }

    if(row+1 < NBR_ROWS && matrixCells[row+1][column] == counter-1){
        return (row+1) * NBR_COLUMNS + column;
    }

    if(column-1 >= 0 && matrixCells[row][column-1] == counter-1){
        return row * NBR_COLUMNS + (column-1);
    }
}