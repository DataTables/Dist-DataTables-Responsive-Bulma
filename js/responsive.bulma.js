/*! Responsive Bulma styling 4.1.0 for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

(function(factory){
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['datatables.net-bm', 'datatables.net-responsive'], function (dt) {
			return factory(window, document, dt);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		var cjsRequires = function (root) {
			if (! root.DataTable) {
				require('datatables.net-bm')(root);
			}

			if (! window.DataTable.Responsive) {
				require('datatables.net-responsive')(root);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root) {
				if (! root) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				cjsRequires(root);
				return factory(root, root.document, root.DataTable);
			};
		}
		else {
			cjsRequires(window);
			module.exports = factory(window, window.document, window.DataTable);
		}
	}
	else {
		// Browser
		factory(window, document, window.DataTable);
	}
}(function(window, document, DataTable) {
'use strict';



var Dom = DataTable.Dom;
var _display = DataTable.Responsive.display;
var _modal;

function getModelEl() {
	if (!_modal) {
		_modal = Dom
			.c('div')
			.classAdd('modal DTED')
			.append(Dom.c('div').classAdd('modal-background'))
			.append(
				Dom
					.c('div')
					.classAdd('modal-content')
					.append(Dom.c('div').classAdd('modal-header'))
					.append(Dom.c('div').classAdd('modal-body'))
			)
			.append(
				Dom
					.c('button')
					.attr('type', 'button')
					.attr('aria-label', 'Close')
					.classAdd('modal-close is-large')
			);
	}

	return _modal;
}

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		var rendered = render();
		var modal = getModelEl();

		if (rendered === false) {
			return false;
		}

		if (!update) {
			if (options && options.header) {
				var header = modal.find('div.modal-header');
				header.find('button').detach();

				header
					.empty()
					.append(
						Dom
							.c('h4')
							.classAdd('modal-title subtitle')
							.html(options.header(row))
					);
			}

			modal.find('div.modal-body').empty().append(rendered);

			modal.attr('data-dtr-index', row.index()).appendTo('body');

			modal.classAdd('is-active is-clipped');

			Dom.s('.modal-close').one('click', function () {
				modal.classRemove('is-active is-clipped');
				closeCallback();
			});

			Dom.s('.modal-background').one('click', function () {
				modal.classRemove('is-active is-clipped');
				closeCallback();
			});
		}
		else {
			if (
				modal.isAttached() &&
				row.index() === modal.attr('data-dtr-index')
			) {
				modal.find('div.modal-body').empty().append(rendered);
			}
			else {
				// Modal not shown - do nothing
				return null;
			}
		}

		return true;
	};
};


return DataTable;
}));
