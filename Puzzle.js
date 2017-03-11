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


    /**
     * 
     * @param root
     * @param series
     */
    constructor(root, series) {
        this.root = root;
        this.series = series || Puzzle.generateSeries();
        this.coordinatesEmptyElement = [ROW - 1, COLUMN - 1];
        this.coordinatesDragElement = [0, 0];
        this.dragElement = null;
        this.matrix = this._createMatrix(this.series);
    }


    /**
     *
     */
    render() {
        this.matrix.forEach((row) => {
            const container = this._createRow();
            row.forEach((column) => {
                container.appendChild(column);
            });
        });
        this._attachEvents();
    }


    /**
     *
     */
    update() {
        this.detachEvents();
        this.root.innerHTML = null;
        this.render();
    }


    /**
     *
     * @returns {Element}
     * @private
     */
    _createRow() {
        const row = document.createElement('div');
        row.className = 'row';
        this.root.appendChild(row);
        return row;
    }


    /**
     *
     * @param content
     * @returns {Element}
     * @private
     */
    _createElement(content) {
        const element = document.createElement('div');
        element.innerHTML = content;
        element.className = 'column';
        return element;
    }


    /**
     *
     * @private
     */
    _attachEvents() {
        this._attachEventsEmptyElement();

        // top
        if(this.coordinatesEmptyElement[0] !== 0) {
            this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0] - 1, this.coordinatesEmptyElement[1]));
        }
        // bottom
        if(this.coordinatesEmptyElement[0] !== ROW - 1) {
            this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0] + 1, this.coordinatesEmptyElement[1]));
        }
        // left
        if(this.coordinatesEmptyElement[1] !== 0) {
            this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0], this.coordinatesEmptyElement[1] - 1));
        }
        // right
        if(this.coordinatesEmptyElement[1] !== COLUMN - 1) {
            this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0], this.coordinatesEmptyElement[1] + 1));
        }
    }


    /**
     *
     * @param element
     * @param isEmpty
     * @private
     */
    _attachEventsElement(element, isEmpty) {
        if(!isEmpty) {
            element.setAttribute('draggable', 'true');
        }

        const self = this;

        element.addEventListener('dragover', this._handleDragOver.bind(self), false);
        element.addEventListener('dragstart', this._handleDragStart.bind(self), false);
        element.addEventListener('dragenter', this._handlerDragEnter.bind(self), false);
        element.addEventListener('dragleave', this._handleDragLeave.bind(self), false);
        element.addEventListener('dragend', this._handlerDragEnd.bind(self), false);
    }


    /**
     *
     * @private
     */
    _attachEventsEmptyElement() {
        const element = this._getElementFromMatrix(this.coordinatesEmptyElement);
        const self = this;

        this._attachEventsElement(element, true);
        element.classList.add('is-empty');
        element.addEventListener('drop', this._handleDrop.bind(self), false);
    }

    /**
     *
     * @private
     */
    detachEvents() {
        this.matrix.forEach((row) => {
            row.forEach((column) => {
                column.removeAttribute('draggable');
                column.removeEventListener('dragstart', this._handleDragStart);
                column.removeEventListener('dragenter', this._handlerDragEnter);
                column.removeEventListener('dragover', this._handleDragOver);
                column.removeEventListener('dragleave', this._handleDragLeave);
                column.removeEventListener('dragend', this._handlerDragEnd);
                column.removeEventListener('drop', this._handleDrop);
            });
        });
    }


    /**
     *
     * @param row
     * @param column
     * @returns {*}
     * @private
     */
    _getElementFromMatrix(row, column) {
        if(Array.isArray(row)) {
            return this.matrix[row[0]][row[1]];
        }
        return this.matrix[row][column];
    }


    /**
     *
     * @param series
     * @returns {Array}
     */
    _createMatrix(series) {
        const matrix = [];
        let position = 0;
        for(let i = 0; i < ROW; i++) {
            matrix[i] = [];
            for(let j = 0; j < COLUMN; j++) {
                const element = series[position];
                matrix[i].push(this._createElement(element));
                if(element == EMPTY) {
                    this.coordinatesEmptyElement = [i, j];
                }
                position++;
            }
        }
        return matrix;
    }


    _checkForVictory() {
        return false;
    }



    /**
     *
     * @param event
     * @private
     */
    _handleDragStart(event) {
        this.dragElement = event.target;
        this.matrix.forEach((row, index) => {
            const searchIndex = row.indexOf(this.dragElement);
            if(searchIndex >= 0) {
                this.coordinatesDragElement = [index, searchIndex];
            }
        });
    }


    /**
     *
     * @param event
     * @returns {boolean}
     * @private
     */
    _handleDragOver(event) {
        event.preventDefault();
        return false;
    }


    /**
     *
     * @param event
     * @private
     */
    _handlerDragEnter(event) {
        event.preventDefault();
        event.target.classList.add('is-active');
    }


    /**
     *
     * @param event
     * @private
     */
    _handleDragLeave(event) {
        event.preventDefault();
        event.target.classList.remove('is-active');
    }


    /**
     *
     * @param event
     * @private
     */
    _handlerDragEnd(event) {
        event.preventDefault();
        event.target.classList.remove('is-active');
    }


    /**
     *
     * @param event
     * @returns {boolean}
     * @private
     */
    _handleDrop(event) {
        event.stopPropagation();
        if (this.dragElement != event.target) {
            const dragElement = this._getElementFromMatrix(this.coordinatesDragElement);
            const emptyElement = this._getElementFromMatrix(this.coordinatesEmptyElement);

            this.matrix[this.coordinatesDragElement[0]][this.coordinatesDragElement[1]] = emptyElement;
            this.matrix[this.coordinatesEmptyElement[0]][this.coordinatesEmptyElement[1]] = dragElement;
            this.coordinatesEmptyElement = this.coordinatesDragElement;

            if(this._checkForVictory()) {
                console.log('win!');
                this.detachEvents();
            }
            else {
                this.update();
            }
        }

        return false;
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
