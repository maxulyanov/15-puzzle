/**
 * Created by PhpStorm.
 * Author: Max Ulyanov
 * Project: 15-puzzle
 * Date:  09.03.2017
 * Time: 21:48
 */


'use strict';


const ROW = 4;
const COLUMN = 4;
const EMPTY = 'EMPTY';


class Puzzle {

    constructor(root, series) {
        this.root = root;
        this.series = series || Puzzle.generateSeries();
        this.coordsEmptyCell = [ROW - 1, COLUMN - 1];
        this.po = [0, 0];
        this.dragSrcEl = null;
        this.matrix = this.createMatrix(this.series);
    }


    render() {
        this.matrix.forEach((row) => {
            const container = this.createRow();
            row.forEach((column) => {
                container.appendChild(column);
            });
        });
        this.attachEvents();
    }


    update() {
        this.detachEvent();
        this.root.innerHTML = null;
        this.render();
    }


    createRow() {
        const row = document.createElement('div');
        row.className = 'row';
        this.root.appendChild(row);
        return row;
    }


    createElement(content) {
        const element = document.createElement('div');
        element.innerHTML = content;
        element.className = 'column';
        return element;
    }


    attachEvents() {
        const empty = this.matrix[this.coordsEmptyCell[0]][this.coordsEmptyCell[1]];

        const self = this;

        empty.addEventListener('dragover', handleDragOver.bind(self), false);
        empty.setAttribute('draggable', 'true');
        empty.addEventListener('drop', this.handleDrop.bind(self), false);


        // top
        if(this.coordsEmptyCell[0] !== 0) {
            this.wrapperDrag(this.matrix[this.coordsEmptyCell[0] - 1][this.coordsEmptyCell[1]], [this.coordsEmptyCell[0] - 1 , this.coordsEmptyCell[1]]);
        }
        // bottom
        if(this.coordsEmptyCell[0] !== ROW - 1) {
            this.wrapperDrag(this.matrix[this.coordsEmptyCell[0] + 1][this.coordsEmptyCell[1]], [this.coordsEmptyCell[0] + 1, this.coordsEmptyCell[1]]);
        }
        // left
        if(this.coordsEmptyCell[1] !== 0) {
            this.wrapperDrag(this.matrix[this.coordsEmptyCell[0]][this.coordsEmptyCell[1] - 1], [this.coordsEmptyCell[0], this.coordsEmptyCell[1] - 1]);
        }
        // right
        if(this.coordsEmptyCell[1] !== COLUMN - 1) {
            this.wrapperDrag(this.matrix[this.coordsEmptyCell[0]][this.coordsEmptyCell[1] + 1], [this.coordsEmptyCell[0], this.coordsEmptyCell[1] + 1]);
        }
    }


    detachEvent() {
        this.matrix.forEach((row) => {
            row.forEach((column) => {
                column.removeAttribute('draggable');
                column.removeEventListener('dragover', handleDragOver);
                column.removeEventListener('drop', this.handleDrop);
                column.removeEventListener('dragstart', this.handleDragStart);
            });
        });
    }

    wrapperDrag(element, pos) {
        element.setAttribute('draggable', 'true');
        element.addEventListener('dragstart', this.handleDragStart.bind(this, pos), false);
        element.setAttribute('draggable', 'true');
    }


    handleDrop(event) {
        event.stopPropagation();
        // Don't do anything if dropping the same column we're dragging.
        if (this.dragSrcEl != event.target) {
            const el = this.matrix[this.pos[0]][this.pos[1]];


            this.matrix[this.pos[0]][this.pos[1]] = this.matrix[this.coordsEmptyCell[0]][this.coordsEmptyCell[1]];
            this.matrix[this.coordsEmptyCell[0]][this.coordsEmptyCell[1]] = el;

            this.coordsEmptyCell = this.pos;

            this.update();

        }

        return false;
    }


    handleDragStart(pos, event) {
        this.dragSrcEl = event.target;
        this.pos = pos;
    }


    /**
     *
     * @param series
     * @returns {Array}
     */
    createMatrix(series) {
        const matrix = [];
        let position = 0;
        for(let i = 0; i < ROW; i++) {
            matrix[i] = [];
            for(let j = 0; j < COLUMN; j++) {
                const element = series[position];
                matrix[i].push(this.createElement(element));
                if(element == EMPTY) {
                    this.coordsEmptyCell = [i, j];
                }
                position++;
            }
        }
        return matrix;
    }


    /**
     *
     * @returns {*}
     */
    static generateSeries() {
        const cells = [];
        for(let i = 1; i <= ROW * COLUMN; i++) {
            ROW * COLUMN === i ? cells.push(EMPTY) : cells.push(i);
        }
        return Puzzle.shuffle(cells);
    }


    /**
     *
     * @param array
     * @returns {*}
     */
    static shuffle(array) {
        let j, x, i;
        for (i = array.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = array[i - 1];
            array[i - 1] = array[j];
            array[j] = x;
        }
        return array;
    }

}



function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    return false;
}

