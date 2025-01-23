let isRunning = false;

const root = document.getElementById("root")

const cell = document.createElement("div");
cell.className = "cell"

const startBtn = document.getElementById("start-btn")
startBtn.addEventListener("click", startBFS)

const form = document.getElementById("form")
form.addEventListener("submit", formApplyHandler)

let m = 20
let n = 20;
let interval = 100

let start_i = 0, start_j = 0;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("rows").value = m
document.getElementById("columns").value = n
document.getElementById("interval").value = interval

const diff = [[0, -1], [1, 0], [0, 1], [-1, 0]]
const diff2 = [[-1, 1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, -1], [-1, 0]]

initVars()

async function bfs(grid, visited, i, j) {
    const queue = new Queue();

    queue.enqueue([i, j]);
    requestAnimationFrame(() => { colorVisitedCell(i, j, 'green') })

    await delay(400);

    while (!queue.isEmpty() && isRunning) {
        // remove this node
        const current = queue.front();
        queue.dequeue();

        // color this
        await delay(interval);
        requestAnimationFrame(() => { colorVisitedCell(current[0], current[1], 'red') })

        // push all neighbors of this cell to queue
        for (let a = 0; a < diff2.length && isRunning; a++) {
            const di = diff2[a][0], dj = diff2[a][1];
            const ni = current[0] + di, nj = current[1] + dj;
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && visited[ni][nj] == false && grid[ni][nj] == 0) {
                queue.enqueue([ni, nj]);
                visited[ni][nj] = true;
                requestAnimationFrame(() => { colorVisitedCell(ni, nj, 'green') })
            }
        }
    }

    isRunning = false;
}

function ready_visited_and_color_cells(e) {

    const color = e.target.style.backgroundColor;
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    if(color == "black"){
        grid[x][y] = 0;
        visited[x][y] = false;
        e.target.style.backgroundColor = ""
    }
    else if (color == "red" || color == "green"){
        return;
    }
    else{
        grid[x][y] = -1;
        visited[x][y] = true;
        e.target.style.backgroundColor = "black"
    }
}

function colorVisitedCell(i, j, color) {
    const cell = document.querySelector(`.cell[data-x='${i}'][data-y='${j}']`);
    if (cell) {
        cell.style.backgroundColor = color;
    }
}

function startBFS() {
    isRunning = true;
    bfs(grid, visited, start_i, start_j);
}

function initVars() {

    console.log("initvars");
    
    root.innerHTML = ""

    root.style.display = "grid";
    root.style.gridTemplateColumns = `repeat(${n}, 1.1em)`;
    root.style.gridTemplateRows = `repeat(${m}, 1.1em)`;
    root.style.gap = "0.4em";

    grid = Array.from({ length: m }, () => Array.from({ length: n }, () => 0));
    visited = Array.from({ length: m }, () => Array.from({ length: n }, () => false));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.createElement("div");
            cell.className = `cell i${i} j${j}`;
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.addEventListener("click", ready_visited_and_color_cells);
            root.appendChild(cell)
        }
    }
}

async function formApplyHandler(e) {
    e.preventDefault();

    m = parseInt(e.target.rows.value, 10);
    n = parseInt(e.target.columns.value, 10);
    interval = parseInt(e.target.interval.value, 10);

    const startrow = parseInt(e.target.startrow.value, 10);
    const startcolumn = parseInt(e.target.startcolumn.value, 10);

    if (Number.isInteger(startrow) && startrow >= 0 && startrow < m) {
        start_i = startrow;
    } else {
        console.error("Invalid start row");
    }

    if (Number.isInteger(startcolumn) && startcolumn >= 0 && startcolumn < n) {
        start_j = startcolumn;
    } else {
        console.error("Invalid start column");
    }

    if (isRunning) {
        isRunning = false;
        await delay(200);
    }

    initVars();
}

// const q = new Queue()
// q.enqueue(Array.from([10, 20, 40]));
// q.enqueue(Array.from([44, 33, 55]));
// q.enqueue(20);
// console.log(q);

// q.dequeue();
// console.log(q);
