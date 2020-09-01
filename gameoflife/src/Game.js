import React from 'react';
import './Game.css';
import Cell from './Cell.js'

const cellSize = 20;
const boardWidth = 600;
const boardHeight = 660;

class Game extends React.Component {

    state = {
        cells: [],
        interval: 100,
        isRunning: false,
    }

    constructor() {
        super();
        this.rows = boardHeight/cellSize;
        this.columns = boardWidth/cellSize;
        this.board = this.makeBoard();
    }

    // Create empty board
    makeBoard() {
        let board = [];    
        for (let y = 0; y < this.rows; y++) {      
            board[y] = [];      
            for (let x = 0; x < this.columns; x++) {        
                board[y][x] = false;      }    
        }    
        return board; 
    }

     // Create cells from this.board  
     makeCells() {    
        let cells = [];    
        for (let y = 0; y < this.rows; y++) {      
            for (let x = 0; x < this.columns; x++) {        
                if (this.board[y][x]) {          
                    cells.push({ x, y });        
                }      
            }    
        }    
        return cells;     
    }
     // Run Game
    runGame = () => {
        this.setState({ isRunning: true});
        this.runIteration();
    }
    // Stop Game
    stopGame = () => {
        this.setState({ isRunning: false});
        if (this.timeoutHandler) {      
            window.clearTimeout(this.timeoutHandler);      
            this.timeoutHandler = null; 
        }
    }


   

    runIteration() {
        console.log('running iteration')
        let newBoard = this.makeBoard();
         // Add logic for each iteration here.  
        
        for (let y = 0; y < this.rows; y++) {  
            for (let x = 0; x < this.columns; x++) {    
                let neighbors = this.calculateNeighbors(this.board, x, y);    
                if (this.board[y][x]) {      
                    if (neighbors === 2 || neighbors === 3) {        
                        newBoard[y][x] = true; } 
                    else {        
                        newBoard[y][x] = false; }} 
                else {      
                    if (!this.board[y][x] && neighbors === 3) {        
                        newBoard[y][x] = true;      
                    }    
                }  
            }
        }
        this.board = newBoard;    
        this.setState({ cells: this.makeCells() });
        this.timeoutHandler = window.setTimeout(() => { this.runIteration(); },this.state.interval);  
    }

    
    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.columns && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value});
    }

    handleClear = () => {
        this.board = this.makeBoard();
        this.setState({ cells: this.makeCells() });
    }
    handleRandom = () => {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.board[y][x] = (Math.random() >= 0.5);
            }
        }

        this.setState({ cells: this.makeCells() });
    }

    getElementOffset() {    
        const rect = this.boardRef.getBoundingClientRect();    
        const doc = document.documentElement;
        return { 
            x: (rect.left + window.pageXOffset) - doc.clientLeft,      
            y: (rect.top + window.pageYOffset) - doc.clientTop,    
        };  
    }
    handleClick = (event) => {    
        const elemOffset = this.getElementOffset();    
        const offsetX = event.clientX - elemOffset.x;    
        const offsetY = event.clientY - elemOffset.y;        
        const x = Math.floor(offsetX / cellSize);    
        const y = Math.floor(offsetY / cellSize);
        
        if (x >= 0 && x <= this.columns && y >= 0 && y <= this.rows) {      
            this.board[y][x] = !this.board[y][x];    
        }
        this.setState({ cells: this.makeCells() });  
    }

    render(){
        const {cells, interval, isRunning} = this.state;
        return (
            <div>
                <h2 className="Header">
                    Conway's Game of Life
                </h2>
                <div className="Board" 
                     style={{width: boardWidth, 
                             height: boardHeight, 
                             backgroundSize: `${cellSize}px ${cellSize}px`}} 
                     onClick={this.handleClick} 
                     ref={(n)=> {this.boardRef = n;}}>
                         {cells.map(cell => (<Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>))}
                </div>
                <div className="controls">          
                    Update every <input value={this.state.interval} onChange={this.handleIntervalChange} /> iterations         
                    { this.isRunning ? 
                    <button className="button" onClick={this.stopGame}>
                        Stop
                    </button> :            
                    <button className="button" onClick={this.runGame}>
                        Run
                    </button>          
                    }  
                    <button className="button" onClick={this.handleRandom}>Random</button>
                    <button className="button" onClick={this.handleClear}>Clear</button>        
                </div>  
            </div>
        );
    }
}

export default Game;
