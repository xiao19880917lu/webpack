/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";
const SingleEntryDependency = require("./dependencies/SingleEntryDependency");

/** @typedef {import("./Compiler")} Compiler */

class SingleEntryPlugin {
	/**
	 * An entry plugin which will handle
	 * creation of the SingleEntryDependency
	 *
	 * @param {string} context context path
	 * @param {string} entry entry path
	 * @param {string} name entry key name
	 */
	constructor(context, entry, name) {
		this.context = context;
		this.entry = entry;
		this.name = name;
	}

	/**
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		/** luyongfang */
		/**
		 * 1. hooks.compilation调用 在 hooks.make之前
		 * 2. compilation.dependencyFactories.set 在 设置key: 类SingleEntryDependency， value：normalModuleFactory实例
		*/
		compiler.hooks.compilation.tap(
			"SingleEntryPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					SingleEntryDependency,
					normalModuleFactory
				);
			}
		);
		/** luyongfang */
		/**
		 * 0. webpack.config 配置plugins, EntryOptionPlugin在处理options时会调用 singleEntryPlugin生成实例。而singleEntryPlugin 中注入的hooks会在Compiler.compile的时候调用
		 * 1. SingleEntryPlugin应该是默认注册的一个Plugin
		 * 2. compiler.hooks.make在Compiler的时候会调用
		 * 3. 调用的时候，会根据传入的entry创建一个新的dep
		 * 4. 然后调用compilation.addEntry 走到正常的一个模块的解析, 编译过程
		 * 5. SingleEntryPlugin.createDependency(entry, name); 对于每一个entry 都会生成唯一的一个资源表示标, 唯一的request，identifier等
		 * 6. 然后真正走在第一次资源的编译 	compilation.addEntry
		 * 7. dep可以认为是：具有唯一标识别的资源request，identifier
		*/
		compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);
	}

	/**
	 * @param {string} entry entry request
	 * @param {string} name entry name
	 * @returns {SingleEntryDependency} the dependency
	 */
	static createDependency(entry, name) {
		const dep = new SingleEntryDependency(entry);
		dep.loc = { name };
		return dep;
	}
}

module.exports = SingleEntryPlugin;
