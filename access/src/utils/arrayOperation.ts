/**
 * 判断两数组字符串是否相同（用于按钮权限验证），数组字符串中存在相同时会自动去重（按钮权限标识不会重复）
 * @param news 新数据
 * @param old 源数据
 * @returns 两数组相同返回 `true`，反之则反
 */
export function judementSameArr(newArr: unknown[] | string[], oldArr: string[]): boolean {
	const news = removeDuplicate(newArr);
	const olds = removeDuplicate(oldArr);
	let count = 0;
	const leng = news.length;
	for (let i in olds) {
		for (let j in news) {
			if (olds[i] === news[j]) count++;
		}
	}
	return count === leng ? true : false;
}

/**
 * 判断两个对象是否相同
 * @param a 要比较的对象一
 * @param b 要比较的对象二
 * @returns 相同返回 true，反之则反
 */
export function isObjectValueEqual<T>(a: T, b: T): boolean {
	if (!a || !b) return false;
	let aProps = Object.getOwnPropertyNames(a);
	let bProps = Object.getOwnPropertyNames(b);
	if (aProps.length != bProps.length) return false;
	for (let i = 0; i < aProps.length; i++) {
		let propName = aProps[i];
		let propA = a[propName];
		let propB = b[propName];
		if (!b.hasOwnProperty(propName)) return false;
		if (propA instanceof Object) {
			if (!isObjectValueEqual(propA, propB)) return false;
		} else if (propA !== propB) {
			return false;
		}
	}
	return true;
}

/**
 * 数组、数组对象去重
 * @param arr 数组内容
 * @param attr 需要去重的键值（数组对象）
 * @returns
 */
export function removeDuplicate(arr: EmptyArrayType, attr?: string) {
	if (!Object.keys(arr).length) {
		return arr;
	} else {
		if (attr) {
			const obj: EmptyObjectType = {};
			return arr.reduce((cur: EmptyArrayType[], item: EmptyArrayType) => {
				obj[item[attr]] ? '' : (obj[item[attr]] = true && item[attr] && cur.push(item));
				return cur;
			}, []);
		} else {
			return [...new Set(arr)];
		}
	}
}

/**
 *  限制数据展示的层级
 * @param tree 数组内容
 * @param maxLevel 层级（1,2,3,4）
 * @returns
 */

export function filterTree(tree: EmptyArrayType, maxLevel: Number) {
	return tree.map((node: any) => {
		let newNode = { ...node } as any;
		if (newNode.children && newNode.level < maxLevel) {
			newNode.children = filterTree(newNode.children, maxLevel);
		} else {
			newNode.children = []; // 移除超过层级的子节点
		}
		return newNode;
	});
}

/**
 *  遍历给定的数组并找到具有特定value的children
 * @param nodes 数组内容
 * @param targetValue 对比值
 * @returns
 */

export function findChildrenByValue(nodes: EmptyArrayType, targetValue: string) {
	for (let node of nodes) {
		if (node.value === targetValue) {
			return node.children;
		}
		if (node.children && node.children.length > 0) {
			const result = findChildrenByValue(node.children, targetValue) as any;
			if (result) {
				return result;
			}
		}
	}
	return null; // 如果没有找到匹配的节点，则返回 null
}

/**
 *  遍历给定的数组并找到具有特定value的整个对象
 * @param nodes 数组内容
 * @param targetValue 对比值
 * @param key 对比属性
 * @returns
 */

export function findObjectByValue(nodes: EmptyArrayType, targetValue: any, key: string) {
	for (let node of nodes) {
		if (node[key] === targetValue) {
			return node;
		}
		if (node.children && node.children.length > 0) {
			const result = findObjectByValue(node.children, targetValue, key) as any;
			if (result) {
				return result;
			}
		} else if (node.child && node.child.length > 0) {
			const result = findObjectByValue(node.child, targetValue, key) as any;
			if (result) {
				return result;
			}
		}
	}
	return null; // 如果没有找到匹配的节点，则返回 null
}

/**
 *  在将数据传递给组件之前，添加 level 属性
 * @param data 数组内容
 * @param level 层级
 * @returns
 */

export function addLevels(data, level = 1) {
	return data.map((node) => {
		let newNode = { ...node, level };
		if (newNode.children) {
			newNode.children = addLevels(newNode.children, level + 1);
		}
		return newNode;
	});
}

/**
 *  根据key值匹配合并数组对象
 * @param first 第一个数组的内容
 * @param second 第二个数组的内容
 * @param key 匹配判断值
 * @returns
 */

export function mergeAndUpdateArrays(first, second, key) {
	// 创建一个新的数组来存储合并后的结果
	// 遍历第二个数组
	for (const item2 of second) {
		// 在第一个数组中寻找具有相同 publicKey 的对象
		const item1Index = first.findIndex((item) => item[key] === item2[key]);
		if (item1Index !== -1) {
			// 如果找到了，更新该对象的 publicValue
			first[item1Index].publicValue = item2.publicValue;
		} else {
			// 如果没有找到，你可以选择将第二个数组中的对象添加到合并后的数组中
			first.push({
				...item2, // 复制item2的所有属性
				// 这里可以添加其他默认属性，如果需要的话，比如publicId, publicName等（但这些可能需要根据实际情况生成或留空）
			});
		}
	}

	return first;
}
/**
 *  表单数据结构转换
 * @param obj 内容
 * @returns
 */

export function transformObject(obj: any, type) {
	const result = [];
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			console.log(isNumber(key), key);
			result.push({
				publicKey: key,
				publicValue: key == 'PORTAL_CSS_SCRIPT' || key == 'LOGIN_CSS_SCRIPT' ? JSON.stringify(obj[key]) : obj[key] +'',
				validateCode: type,
			});
		}
	}
	return result;
}

function isNumber(value) {
	return typeof value === 'number';
}

/**
 *  图片展示区分前端地址和后端返回地址
 * @param url 图片地址
 * @returns
 */

export function getImgUrl(url: string) {
	return url.includes('assets') ? url : import.meta.env.VITE_API_URL + url;
}

function isJSON(str:string) {
    try {
        JSON.parse(str);
        return true; // 如果解析成功，返回 true
    } catch (e) {
        return false; // 如果解析失败，返回 false
    }
}
//根据配置设置门户页样式
export function setCssConfig  (templateScript:string) {
	if(!templateScript) return 

	console.log(templateScript,6666)
	let cssText = ''
	if(!isJSON(templateScript)) {
		cssText = templateScript;
	}else {
		cssText = JSON.parse(templateScript);
	}
	// 正则表达式匹配类选择器及其对应的样式块
	const stylesRegex = /\.(\w[-_\w]*)\s*{([^{}]*)}/g;
	const styles = {};
	let match;

	// 使用exec方法在循环中查找所有匹配项
	while ((match = stylesRegex.exec(cssText)) !== null) {
		// match[1] 是类名，match[2] 是样式块内容
		const className = match[1];
		const styleBlock = match[2].trim(); // 去掉样式块前后的空白字符
		styles[className] = styleBlock;
	}

	console.log(styles);

	// 遍历页面上的所有元素
	document.querySelectorAll('*').forEach((element) => {
		// 遍历元素的类名
		// console.log('element.classList',element.classList)
		element.classList.forEach((className) => {
			// console.log('className',className)
			// 检查类名是否存在于样式对象中
			if (styles[className]) {
				console.log(77777, styles[className]);
				// 如果存在，则应用样式
				// 注意：这里我们不能直接使用parseCSSString的结果，因为它不适用于内联样式
				// 相反，我们需要将CSS字符串设置为元素的内联样式
				// 但是，由于CSS字符串可能包含多个属性，我们需要先将其拆分为单个属性
				const cssProperties = styles[className]
					.split(';')
					.filter((prop) => prop.trim())
					.map((prop) => {
						const [key, value] = prop.split(':').map((part) => part.trim());
						return { key, value };
					});

				// 应用每个属性到元素的内联样式上
				cssProperties.forEach(({ key, value }) => {
					element.style[key] = value;
				});
			}
		});
	});
}

// 递归函数
export function getCheckedIds(nodes: any, idName: any) {
	let checkedIds = [] as any;

	nodes.forEach((node: any) => {
		if (node.checked === 1) {
			checkedIds.push(node[idName]);
		}
		if (node.children && node.children.length > 0) {
			checkedIds = checkedIds.concat(getCheckedIds(node.children, idName));
		}
	});

	return checkedIds;
}
// 生成一个自定义长度的随机数
export function generateRandomNumberString(length: number) {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += Math.floor(Math.random() * 10); // 生成0到9之间的随机整数
	}
	return result;
}
