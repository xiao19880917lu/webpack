/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";
const Dependency = require("../Dependency");

class ModuleDependency extends Dependency {
	/**
	 * @param {string} request request path which needs resolving
	 */
	constructor(request) {
		super();
		this.request = request;
		this.userRequest = request;
	}
	/** luyongfang */
	/**
	 * 1. 创建一个模块的dep, 包含了这个模块的request唯一识别
	 * 2. 一个dep 代表了一个identifier
	*/
	getResourceIdentifier() {
		return `module${this.request}`;
	}
}

module.exports = ModuleDependency;
