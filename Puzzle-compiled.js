/**
 * Created by PhpStorm.
 * Author: Max Ulyanov
 * Project: 15-puzzle
 * Date:  09.03.2017
 * Time: 21:48
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ROW = 4;
var COLUMN = 4;
var EMPTY = 'EMPTY';
var ANIMATE_DURATION = 300;

var Puzzle = function () {

    /**
     * 
     * @param root
     * @param series
     */
    function Puzzle(root, series) {
        _classCallCheck(this, Puzzle);

        this.root = root;
        this.series = series || Puzzle.generateSeries(true);
        this.winSeries = Puzzle.generateSeries(false);
        this.coordinatesEmptyElement = [ROW - 1, COLUMN - 1];
        this.coordinatesDragElement = [0, 0];
        this.dragElement = null;
        this.matrix = this._createMatrix(this.series);
    }

    /**
     *
     */


    _createClass(Puzzle, [{
        key: 'render',
        value: function render() {
            var _this = this;

            this.matrix.forEach(function (row) {
                var container = _this._createRow();
                row.forEach(function (cell) {
                    container.appendChild(cell);
                });
            });
            this._attachEvents();
        }

        /**
         *
         */

    }, {
        key: 'update',
        value: function update() {
            this.root.innerHTML = null;
            this.render();
        }

        /**
         *
         * @returns {Element}
         * @private
         */

    }, {
        key: '_createRow',
        value: function _createRow() {
            var row = document.createElement('div');
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

    }, {
        key: '_createElement',
        value: function _createElement(content) {
            var element = document.createElement('div');
            element.innerHTML = content;
            element.className = 'cell';
            return element;
        }

        /**
         *
         * @private
         */

    }, {
        key: '_attachEvents',
        value: function _attachEvents() {
            this._attachEventsEmptyElement();

            // top
            if (this.coordinatesEmptyElement[0] !== 0) {
                this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0] - 1, this.coordinatesEmptyElement[1]));
            }
            // bottom
            if (this.coordinatesEmptyElement[0] !== ROW - 1) {
                this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0] + 1, this.coordinatesEmptyElement[1]));
            }
            // left
            if (this.coordinatesEmptyElement[1] !== 0) {
                this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0], this.coordinatesEmptyElement[1] - 1));
            }
            // right
            if (this.coordinatesEmptyElement[1] !== COLUMN - 1) {
                this._attachEventsElement(this._getElementFromMatrix(this.coordinatesEmptyElement[0], this.coordinatesEmptyElement[1] + 1));
            }
        }

        /**
         *
         * @param element
         * @param isEmpty
         * @private
         */

    }, {
        key: '_attachEventsElement',
        value: function _attachEventsElement(element, isEmpty) {
            if (!isEmpty) {
                element.setAttribute('draggable', 'true');
            }

            var self = this;

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

    }, {
        key: '_attachEventsEmptyElement',
        value: function _attachEventsEmptyElement() {
            var element = this._getElementFromMatrix(this.coordinatesEmptyElement);
            var self = this;

            this._attachEventsElement(element, true);
            element.classList.add('is-empty');
            element.addEventListener('drop', this._handleDrop.bind(self), false);
        }

        /**
         *
         * @private
         */

    }, {
        key: 'detachEvents',
        value: function detachEvents() {
            for (var i = 0; i < this.matrix.length; i++) {
                var cells = this.matrix[i];
                for (var j = 0; j < cells.length; j++) {
                    var cell = cells[j];
                    cell.removeAttribute('draggable');
                    cell.classList.remove('is-active');
                    cells[j] = cell.cloneNode(true);
                }
            }
        }

        /**
         *
         * @param row
         * @param column
         * @returns {*}
         * @private
         */

    }, {
        key: '_getElementFromMatrix',
        value: function _getElementFromMatrix(row, column) {
            if (Array.isArray(row)) {
                return this.matrix[row[0]][row[1]];
            }
            return this.matrix[row][column];
        }

        /**
         *
         * @param series
         * @returns {Array}
         */

    }, {
        key: '_createMatrix',
        value: function _createMatrix(series) {
            var matrix = [];
            var position = 0;
            for (var i = 0; i < ROW; i++) {
                matrix[i] = [];
                for (var j = 0; j < COLUMN; j++) {
                    var element = series[position];
                    matrix[i].push(this._createElement(element));
                    if (element == EMPTY) {
                        this.coordinatesEmptyElement = [i, j];
                    }
                    position++;
                }
            }
            return matrix;
        }

        /**
         *
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_checkForVictory',
        value: function _checkForVictory() {
            var series = [];
            this.matrix.forEach(function (row) {
                row.forEach(function (cell) {
                    series.push(cell.innerHTML);
                });
            });

            return this.winSeries.join('') === series.join('');
        }

        /**
         *
         * @param event
         * @private
         */

    }, {
        key: '_handleDragStart',
        value: function _handleDragStart(event) {
            var _this2 = this;

            this.dragElement = event.target;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('html', this.dragElement.innerHTML);
            event.dataTransfer.setData('classes', this.dragElement.getAttribute('class'));

            this.matrix.forEach(function (row, index) {
                var searchIndex = row.indexOf(_this2.dragElement);
                if (searchIndex >= 0) {
                    _this2.coordinatesDragElement = [index, searchIndex];
                }
            });
        }

        /**
         *
         * @param event
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_handleDragOver',
        value: function _handleDragOver(event) {
            event.preventDefault();
            return false;
        }

        /**
         *
         * @param event
         * @private
         */

    }, {
        key: '_handlerDragEnter',
        value: function _handlerDragEnter(event) {
            event.preventDefault();
            event.target.classList.add('is-active');
        }

        /**
         *
         * @param event
         * @private
         */

    }, {
        key: '_handleDragLeave',
        value: function _handleDragLeave(event) {
            event.preventDefault();
            event.target.classList.remove('is-active');
        }

        /**
         *
         * @param event
         * @private
         */

    }, {
        key: '_handlerDragEnd',
        value: function _handlerDragEnd(event) {
            event.preventDefault();
            this.matrix.forEach(function (row) {
                row.forEach(function (cell) {
                    cell.classList.remove('is-active');
                });
            });
        }

        /**
         *
         * @param event
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_handleDrop',
        value: function _handleDrop(event) {
            var _this3 = this;

            event.stopPropagation();

            var target = event.target;
            if (this.dragElement != target) {
                this.dragElement.innerHTML = target.innerHTML;
                this.dragElement.classList.add('is-empty');
                target.innerHTML = event.dataTransfer.getData('html');
                target.className = event.dataTransfer.getData('classes');

                this.coordinatesEmptyElement = this.coordinatesDragElement;

                setTimeout(function () {
                    _this3.detachEvents();

                    if (_this3._checkForVictory()) {
                        _this3.root.classList.add('is-win');
                    } else {
                        _this3.update();
                    }
                }, ANIMATE_DURATION);
            }

            return false;
        }

        /**
         *
         * @param shuffle
         * @returns {Array}
         */

    }], [{
        key: 'generateSeries',
        value: function generateSeries(shuffle) {
            var cells = [];
            for (var i = 1; i <= ROW * COLUMN; i++) {
                ROW * COLUMN === i ? cells.push(EMPTY) : cells.push(i);
            }
            return shuffle ? Puzzle.shuffle(cells) : cells;
        }

        /**
         *
         * @param array
         * @returns {*}
         */

    }, {
        key: 'shuffle',
        value: function shuffle(array) {
            var j = void 0,
                x = void 0,
                i = void 0;
            for (i = array.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = array[i - 1];
                array[i - 1] = array[j];
                array[j] = x;
            }
            return array;
        }
    }]);

    return Puzzle;
}();

//# sourceMappingURL=Puzzle-compiled.js.map