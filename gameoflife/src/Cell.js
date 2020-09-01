import React from 'react';
import './Game.css';

const cellSize = 20

class Cell extends React.Component {  
    
    render() {   
         const { x, y } = this.props;    
        return (      
            <div className="Cell" 
                 style={{left: `${cellSize * x + 1}px`, 
                         top: `${cellSize * y + 1}px`, 
                         width: `${cellSize - 1}px`,
                         height: `${cellSize - 1}px`,}} />    
        );  
    }
}

export default Cell;