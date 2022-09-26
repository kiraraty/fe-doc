const fs = require("fs");
const path = require("path");
var ans = []
function readDir(pathUrl, pathName) {
	fs.readdir(pathUrl, (err, fileName) => {
		if (err) {
			console.log('文件夹读取错误', err)
		} else {
			for (let i = 0; i < fileName.length; i++) {
				let filename = fileName[i].toString().replace(/\s*/g, "");
				if (filename.indexOf('.')>5) {
					filename = filename.replace(/^[0-9]+/, function (match, pos, orginText) {
						return match + '.'
					})
				}
				let name = filename.split('.md')[0]
				let oldPath = pathUrl + '/' + fileName[i];
				let newPath = pathUrl + '/' + filename;
				fs.renameSync(oldPath, newPath, function (err) {
					if (!err) {
					
					}
				})
			//	let str = `* [${name}](interview/${pathName}/${fileName[i]}) `;
				let str = `"/${pathName}/${fileName[i]}",`
				ans.push(str)
			}
		}
		/* ans.sort((b, a) => {
			let x = +a.split('[')[1].split('.')[0]
			let y = +b.split('[')[1].split('.')[0]
			return y - x
		}) */
		for (const item of ans) {
			console.log(`${item}`);
		}
	});

};
readDir('./interview','interview');
/* const fs = require("fs");
let path = '路径'
fs.readdir(path, function (err, files) {
	files.forEach(function (filename, index) {
		let oldPath = path + '/' + filename;
		let newPath = oldPath.replace(/\Y[0-9]*\_/g, 'Y1_')
		console.log(oldPath, '----------', newPath);
		fs.rename(oldPath, newPath, function (err) {
			if (!err) {
				console.log(filename + '修改完成!')
			}
		})
	})
}) */

/* //Dijkstra算法
let graph = [
	[0, 2, 4, 0, 0, 0],
	[0, 0, 2, 4, 2, 0],
	[0, 0, 0, 0, 3, 0],
	[0, 0, 0, 0, 0, 2],
	[0, 0, 0, 3, 0, 2],
	[0, 0, 0, 0, 0, 0]
];

let INF = Infinity

function minDistance(dist, visited) {
	let min = INF
	let minIndex = -1
	for (let i = 0; i < dist.length; i++) {
		if (!visited[i] && dist[i] < min) {
			minIndex = i
			min = dist[i]
		}
	}
	return minIndex
};

function dijkstra(src) {
	let dist = []
	let visited = []
	let length = graph.length
	for (let i = 0; i < length; i++) { /
		dist[i] = INF
		visited[i] = false
	}
	dist[src] = 0 // (2)
	for (let j = 0; j < length - 1; j++) { 
		let u = minDistance(dist, visited) 
		visited[u] = true 
		for (let v = 0; v < length; v++) {
			if (
				!visited[v] &&  
				dist[u] != INF && 
				graph[u][v] != 0 && 
				dist[u] + graph[u][v] < dist[v] 
			) {
				dist[v] = dist[u] + graph[u][v]
			}
		}
	}
	return dist 
};

// 求B点到其他个点的最短距离
const res = dijkstra(1);
// Infinity表示点B与点A不相邻，从上图可知A与B相邻，而B与A不相邻
// [ Infinity, 0, 2, 4, 2, 4 ] */