/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_loaders_MTLLoader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/loaders/MTLLoader.js */ "./node_modules/three/examples/jsm/loaders/MTLLoader.js");
/* harmony import */ var three_examples_jsm_loaders_OBJLoader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/loaders/OBJLoader.js */ "./node_modules/three/examples/jsm/loaders/OBJLoader.js");
//23FI031　川口優里奈




class ThreeJSContainer {
    scene;
    light;
    cloud;
    particleVelocity;
    cylumes;
    spotLight;
    spotLight2;
    colors; // スポットライトの色
    colorIndex = 0;
    lastColorChangeTime = 0;
    s = 1;
    s2 = -1;
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_3__.WebGLRenderer();
        renderer.setSize(width, height);
        //renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x585454));
        //カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_3__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_3__.Scene();
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_3__.TextureLoader();
        const texture = ["love.png"]; //テクスチャを利用する
        const clock = new three__WEBPACK_IMPORTED_MODULE_3__.Clock();
        this.cloud = [];
        this.particleVelocity = [];
        let velocities = [];
        let loadOBJ = (objFilePath, mtlFilePath) => {
            let object = new three__WEBPACK_IMPORTED_MODULE_3__.Object3D;
            const mtlLoader = new three_examples_jsm_loaders_MTLLoader_js__WEBPACK_IMPORTED_MODULE_1__.MTLLoader();
            mtlLoader.load(mtlFilePath, (material) => {
                material.preload();
                const objLoader = new three_examples_jsm_loaders_OBJLoader_js__WEBPACK_IMPORTED_MODULE_2__.OBJLoader();
                objLoader.setMaterials(material);
                objLoader.load(objFilePath, (obj) => {
                    obj.position.set(0, 0.85, -0.5);
                    object.add(obj);
                });
            });
            return object;
        };
        const mesh = loadOBJ("human.obj", "human.mtl");
        this.scene.add(mesh);
        let createParticles = (texture, index) => {
            //ジオメトリの作成
            const geometry = new three__WEBPACK_IMPORTED_MODULE_3__.BufferGeometry();
            //マテリアルの作成
            const material = new three__WEBPACK_IMPORTED_MODULE_3__.PointsMaterial({ size: 1, map: texture, blending: three__WEBPACK_IMPORTED_MODULE_3__.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.8, });
            //particleの作成
            const particleNum = 1000; // パーティクルの数
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;
            for (let i = 0; i < particleNum; i++) {
                positions[particleIndex++] = (Math.random() - 0.5) * 50;
                positions[particleIndex++] = Math.random() * 10 + 20;
                positions[particleIndex++] = (Math.random() - 0.5) * 90;
                velocities.push(new three__WEBPACK_IMPORTED_MODULE_3__.Vector3((Math.random() - 0.5) * 0.02, -Math.random() * 0.1 - 0.05, (Math.random() - 0.5) * 0.02));
            }
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_3__.BufferAttribute(positions, 3));
            //THREE.Pointsの作成
            const points = new three__WEBPACK_IMPORTED_MODULE_3__.Points(geometry, material);
            this.cloud.push(points); //cloudに追加する
            this.particleVelocity.push(velocities); //particleVelocityに追加する
            //シーンへの追加
            this.scene.add(points);
        };
        for (let i = 0; i < texture.length; i++) {
            const path = texture[i];
            const textureload = textureLoader.load(path);
            createParticles(textureload, i);
        }
        let createStageObjects = () => {
            // 会場の壁と天井
            const roomWidth = 100;
            const roomHeight = 30;
            const roomDepth = 100;
            const wallMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0x222222, side: three__WEBPACK_IMPORTED_MODULE_3__.DoubleSide });
            // 天井
            const ceiling = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.PlaneGeometry(roomWidth, roomDepth), wallMaterial);
            ceiling.rotation.x = Math.PI / 2;
            ceiling.position.y = roomHeight;
            this.scene.add(ceiling);
            // 奥の壁
            const Wall = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.PlaneGeometry(roomWidth, roomHeight), wallMaterial);
            Wall.rotation.y = Math.PI;
            Wall.position.set(0, roomHeight / 2, -roomDepth / 2);
            this.scene.add(Wall);
            // 前の壁
            const frontWall = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.PlaneGeometry(roomWidth, roomHeight), wallMaterial);
            frontWall.position.set(0, roomHeight / 2, roomDepth / 2);
            this.scene.add(frontWall);
            // 左の壁
            const leftWall = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
            leftWall.rotation.y = Math.PI / 2;
            leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
            this.scene.add(leftWall);
            // 右の壁
            const rightWall = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
            rightWall.rotation.y = -Math.PI / 2;
            rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
            this.scene.add(rightWall);
            // 会場の地面
            const venueFloorMat = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0x111111, side: three__WEBPACK_IMPORTED_MODULE_3__.DoubleSide });
            const venueFloor = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.PlaneGeometry(100, 100), venueFloorMat);
            venueFloor.rotation.x = -Math.PI / 2;
            venueFloor.position.set(0, 0, 0);
            venueFloor.receiveShadow = true;
            this.scene.add(venueFloor);
            // ステージ床
            //const floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
            const floorMat = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0xffffff });
            const floorHeight = 1;
            const floor = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.BoxGeometry(40, floorHeight, 20), floorMat);
            floor.position.set(0, floorHeight / 2, -5);
            floor.castShadow = true;
            floor.receiveShadow = true;
            this.scene.add(floor);
            // 背景壁
            const wallMat = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0x333333 });
            const backWall = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.BoxGeometry(30, 15, 1), wallMat);
            backWall.position.set(0, 7.5, -13);
            backWall.receiveShadow = true;
            this.scene.add(backWall);
            // スピーカー左
            const speakerMat = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0x111111 });
            const speakerLeft = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(new three__WEBPACK_IMPORTED_MODULE_3__.BoxGeometry(1, 3, 1), speakerMat);
            speakerLeft.position.set(-7, 1.5, -7);
            speakerLeft.castShadow = true;
            this.scene.add(speakerLeft);
            // スピーカー右
            const speakerRight = speakerLeft.clone();
            speakerRight.position.set(7, 1.5, -7);
            this.scene.add(speakerRight);
            // スポットライト
            this.spotLight = new three__WEBPACK_IMPORTED_MODULE_3__.SpotLight(0xff0000, 10);
            this.spotLight.position.set(10, 8, 5);
            this.spotLight.angle = Math.PI / 6;
            this.spotLight.penumbra = 0.2;
            this.spotLight.target.position.set(10, 0, 0);
            this.spotLight.castShadow = true;
            this.scene.add(this.spotLight);
            this.scene.add(this.spotLight.target);
            this.spotLight2 = new three__WEBPACK_IMPORTED_MODULE_3__.SpotLight(0x00ff00, 10);
            this.spotLight2.position.set(-10, 8, 5);
            this.spotLight2.angle = Math.PI / 6;
            this.spotLight2.penumbra = 0.2;
            this.spotLight2.target.position.set(-10, 0, 0);
            this.spotLight2.castShadow = true;
            this.scene.add(this.spotLight2);
            this.scene.add(this.spotLight2.target);
            const group = new three__WEBPACK_IMPORTED_MODULE_3__.Group();
            // マイクのヘッド（球体）
            const headGeometry = new three__WEBPACK_IMPORTED_MODULE_3__.SphereGeometry(0.3, 16, 16);
            const headMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0x444444 });
            const head = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(headGeometry, headMaterial);
            head.position.y = 1.5;
            group.add(head);
            // マイクの持ち手（円柱）
            const handleGeometry = new three__WEBPACK_IMPORTED_MODULE_3__.CylinderGeometry(0.1, 0.1, 1.5, 16);
            const handleMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0x222222 });
            const handle = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(handleGeometry, handleMaterial);
            handle.position.y = 0.75;
            group.add(handle);
            // スタンド（細長い棒）
            const standGeometry = new three__WEBPACK_IMPORTED_MODULE_3__.CylinderGeometry(0.05, 0.05, 2, 16);
            const standMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial({ color: 0x000000 });
            const stand = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(standGeometry, standMaterial);
            stand.position.y = -1;
            group.add(stand);

            group.position.set(0, floorHeight * 2, 2);
            this.scene.add(group);
        };
        createStageObjects();
        let generateSprite = (Color) => {
            //新しいキャンバスの作成
            let canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            //円形のグラデーションの作成
            let context = canvas.getContext('2d');
            let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            for (const [stop, color] of Color) {
                gradient.addColorStop(stop, color);
            }
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            //テクスチャの生成
            let texture = new three__WEBPACK_IMPORTED_MODULE_3__.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        };
        let createPoints = (geom, tex) => {
            let material = new three__WEBPACK_IMPORTED_MODULE_3__.PointsMaterial({
                color: 0xffffff,
                size: 1,
                transparent: true,
                blending: three__WEBPACK_IMPORTED_MODULE_3__.AdditiveBlending,
                depthWrite: false,
                map: tex
            });
            return new three__WEBPACK_IMPORTED_MODULE_3__.Points(geom, material);
        };
        // 棒状の点群ジオメトリ作成サンプル
        function createStickPoints(height, particleCount) {
            const positions = new Float32Array(particleCount * 3);
            let pointsIndex = 0;
            for (let i = 0; i < particleCount; i++) {
                // x,zは0に固定、yは棒の高さに均等配置
                positions[pointsIndex++] = 0;
                positions[pointsIndex++] = (i / (particleCount - 1)) * height;
                positions[pointsIndex++] = 0;
            }
            const geometry = new three__WEBPACK_IMPORTED_MODULE_3__.BufferGeometry();
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_3__.BufferAttribute(positions, 3));
            return geometry;
        }
        const stickGeometry = createStickPoints(1.5, 30);
        const numCylumes = 100;
        let red = generateSprite([[0, 'rgba(255,255,255,1)'], [0.2, 'rgb(255, 0, 0)'], [0.4, 'rgb(116, 11, 11)'], [1, 'rgba(0,0,0,1)']]);
        let green = generateSprite([[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(0,255,0,1)'], [0.4, 'rgb(11, 116, 46)'], [1, 'rgba(0,0,0,1)']]);
        let blue = generateSprite([[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(0,0,255,1)'], [0.4, 'rgba(0, 0,64,1)'], [1, 'rgba(0,0,0,1)']]);
        let pink = generateSprite([[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(255, 0, 144, 1)'], [0.4, 'rgba(81, 0, 57, 1)'], [1, 'rgba(0,0,0,1)']]);
        let yellow = generateSprite([[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(246, 255, 0, 1)'], [0.4, 'rgba(81, 77, 0, 1)'], [1, 'rgba(0,0,0,1)']]);
        const colors = [
            { name: "red", texture: red },
            { name: "green", texture: green },
            { name: "blue", texture: blue },
            { name: "pink", texture: pink },
            { name: "yellow", texture: yellow }
        ];
        this.cylumes = [];
        for (const color of colors) {
            for (let i = 0; i < 100; i++) {
                let points = createPoints(stickGeometry, color.texture);
                points.rotation.z = Math.PI / 2;
               
                const x = 20 + Math.random() * 10;
                const y = 2 + (x - 20) * 0.8 + Math.random();
                points.position.set(x, y, -10 + Math.random() * 50);
                this.scene.add(points);
                this.cylumes.push(points);
            }
            for (let i = 0; i < 100; i++) {
                let points = createPoints(stickGeometry, color.texture);
                points.rotation.z = Math.PI / 2;
                const x = -20 - Math.random() * 10;
                const y = 2 + (-x - 20) * 0.8 + Math.random();
                points.position.set(x, y, -10 + Math.random() * 50);
                this.scene.add(points);
                this.cylumes.push(points);
            }
            for (let i = 0; i < 100; i++) {
                let points = createPoints(stickGeometry, color.texture);
                const z = 40 + Math.random() * 9;
                const y = 2 + (z - 40) * 0.8 + Math.random();
                points.position.set((Math.random() * 40) - 20, y, z);
                this.scene.add(points);
                this.cylumes.push(points);
            }
            for (let i = 0; i < numCylumes; i++) {
                let points = createPoints(stickGeometry, color.texture);
                // ランダム配置
                points.position.set((Math.random() * 40) - 20,
                (Math.random() * -0.7) + 1,
                (Math.random() * 30) + 7  
                );
                this.scene.add(points);
                this.cylumes.push(points);
            }
        }
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        this.colors = [
            new three__WEBPACK_IMPORTED_MODULE_3__.Color("red"),
            new three__WEBPACK_IMPORTED_MODULE_3__.Color("green"),
            new three__WEBPACK_IMPORTED_MODULE_3__.Color("blue"),
            new three__WEBPACK_IMPORTED_MODULE_3__.Color("magenta"),
        ];
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            const deltaTime = clock.getDelta();
            const speed = 50.0;
            for (let j = 0; j < this.cloud.length; j++) {
                const points = this.cloud[j];
                const velocities = this.particleVelocity[j];
                const geom = points.geometry;
                const positions = geom.getAttribute('position'); // 座標データ
                const seconds = time / 1000;
                // this.cloud.position.y -=  speed * deltaTime;
                for (let i = 0; i < positions.count; i++) {
                    const vx = velocities[i].x;
                    const vy = velocities[i].y;
                    const vz = velocities[i].z;
                    const sin = Math.sin(time * 0.001 + i) * 0.02;
                    positions.setX(i, positions.getX(i) + (vx + sin) * deltaTime * speed);
                    positions.setY(i, positions.getY(i) + vy * deltaTime * speed);
                    positions.setZ(i, positions.getZ(i) + vz * deltaTime * speed);
                    //地面についたらまた降り注ぐ
                    if (positions.getY(i) < 0) {
                        positions.setY(i, Math.random() * 10 + 20);
                    }
                }
                for (let i = 0; i < this.cylumes.length; i++) {
                    const cylume = this.cylumes[i];
                    if (cylume.userData.rotationDirection === undefined) {
                        cylume.userData.rotationDirection = 1;
                    }
                    cylume.rotation.z += 0.05 * cylume.userData.rotationDirection;
                    if (cylume.rotation.z > 0.5) {
                        cylume.userData.rotationDirection = -1;
                    }
                    else if (cylume.rotation.z < -0.5) {
                        cylume.userData.rotationDirection = 1;
                    }
                }
                this.spotLight.position.x += 0.1 * this.s;
                this.spotLight.target.position.x += 0.1 * this.s;
                this.spotLight2.position.x += 0.1 * this.s2;
                this.spotLight2.target.position.x += 0.1 * this.s2;
                if (this.spotLight.position.x > 10) {
                    this.s = -1;
                }
                else if (this.spotLight.position.x < -10) {
                    this.s = 1;
                }
                if (this.spotLight2.position.x > 10) {
                    this.s2 = -1;
                }
                else if (this.spotLight2.position.x < -10) {
                    this.s2 = 1;
                }
                if (seconds - this.lastColorChangeTime > 2) {
                    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
                    const nextIndex = (this.colorIndex + 1) % this.colors.length;
                    this.spotLight.color = this.colors[this.colorIndex];
                    this.spotLight2.color = this.colors[nextIndex];
                    this.lastColorChangeTime = seconds;
                }
                positions.needsUpdate = true;
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(10, 10, 30));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js-node_modules_three_examples-5ef33c"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsSUFBSSwwQ0FBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxDQUFDOzs7Ozs7O1VDL2VEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vMjNGSTAzMeOAgOW3neWPo+WEqumHjOWliFxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgeyBNVExMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9NVExMb2FkZXIuanMnO1xuaW1wb3J0IHsgT0JKTG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvT0JKTG9hZGVyLmpzJztcblxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGNsb3VkOiBUSFJFRS5Qb2ludHNbXTtcbiAgICBwcml2YXRlIHBhcnRpY2xlVmVsb2NpdHk6IFRIUkVFLlZlY3RvcjNbXVtdO1xuICAgIHByaXZhdGUgY3lsdW1lczogVEhSRUUuUG9pbnRzW107XG4gICAgcHJpdmF0ZSBzcG90TGlnaHQ6IFRIUkVFLlNwb3RMaWdodDtcbiAgICBwcml2YXRlIHNwb3RMaWdodDI6IFRIUkVFLlNwb3RMaWdodDtcblxuICAgIHByaXZhdGUgY29sb3JzOiBUSFJFRS5Db2xvcltdOyAvLyDjgrnjg53jg4Pjg4jjg6njgqTjg4jjga7oibJcbiAgICBwcml2YXRlIGNvbG9ySW5kZXg6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBsYXN0Q29sb3JDaGFuZ2VUaW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgczogbnVtYmVyID0gMTtcbiAgICBwcml2YXRlIHMyOiBudW1iZXIgPSAtMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAvL3JlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NDk1ZWQpKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOyAvL+OCt+ODo+ODieOCpuODnuODg+ODl+OCkuacieWKueOBq+OBmeOCi1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDU4NTQ1NCkpO1xuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgICBjb25zdCB0ZXh0dXJlID0gW1wibG92ZS5wbmdcIl07Ly8z56iu6aGe44Gu44OG44Kv44K544OB44Oj44KS5Yip55So44GZ44KLXG4gICAgICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgICAgIHRoaXMuY2xvdWQgPSBbXTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5ID0gW107XG4gICAgICAgIGxldCB2ZWxvY2l0aWVzOiBUSFJFRS5WZWN0b3IzW10gPSBbXTtcblxuICAgICAgICBsZXQgbG9hZE9CSiA9IChvYmpGaWxlUGF0aDogc3RyaW5nLCBtdGxGaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEO1xuICAgICAgICAgICAgY29uc3QgbXRsTG9hZGVyID0gbmV3IE1UTExvYWRlcigpO1xuICAgICAgICAgICAgbXRsTG9hZGVyLmxvYWQobXRsRmlsZVBhdGgsIChtYXRlcmlhbCkgPT4ge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnByZWxvYWQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmpMb2FkZXIgPSBuZXcgT0JKTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgb2JqTG9hZGVyLnNldE1hdGVyaWFscyhtYXRlcmlhbCk7XG4gICAgICAgICAgICAgICAgb2JqTG9hZGVyLmxvYWQob2JqRmlsZVBhdGgsIChvYmopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLnNldCgwLCAwLjg1LCAtMC41KTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFkZChvYmopO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXNoID0gbG9hZE9CSihcImh1bWFuLm9ialwiLCBcImh1bWFuLm10bFwiKVxuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoKTtcblxuXG4gICAgICAgIGxldCBjcmVhdGVQYXJ0aWNsZXMgPSAodGV4dHVyZTogVEhSRUUuVGV4dHVyZSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgLy/jgrjjgqrjg6Hjg4jjg6rjga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG5cbiAgICAgICAgICAgIC8v44Oe44OG44Oq44Ki44Or44Gu5L2c5oiQXG4gICAgICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCh7IHNpemU6IDEsIG1hcDogdGV4dHVyZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsIGNvbG9yOiAweGZmZmZmZiwgZGVwdGhXcml0ZTogZmFsc2UsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjgsIH0pXG5cbiAgICAgICAgICAgIC8vcGFydGljbGXjga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpY2xlTnVtID0gMTAwMDsgLy8g44OR44O844OG44Kj44Kv44Or44Gu5pWwXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlTnVtICogMyk7XG4gICAgICAgICAgICBsZXQgcGFydGljbGVJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVOdW07IGkrKykge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogNTA7IFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gTWF0aC5yYW5kb20oKSAqIDEwICsgMjA7IFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogOTA7IFxuXG4gICAgICAgICAgICAgICAgdmVsb2NpdGllcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjAyLFxuICAgICAgICAgICAgICAgICAgICAtTWF0aC5yYW5kb20oKSAqIDAuMSAtIDAuMDUsXG4gICAgICAgICAgICAgICAgICAgIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDAuMDJcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUocG9zaXRpb25zLCAzKSk7XG5cblxuICAgICAgICAgICAgLy9USFJFRS5Qb2ludHPjga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IG5ldyBUSFJFRS5Qb2ludHMoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgIHRoaXMuY2xvdWQucHVzaChwb2ludHMpOyAvL2Nsb3Vk44Gr6L+95Yqg44GZ44KLXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlVmVsb2NpdHkucHVzaCh2ZWxvY2l0aWVzKTsvL3BhcnRpY2xlVmVsb2NpdHnjgavov73liqDjgZnjgotcblxuICAgICAgICAgICAgLy/jgrfjg7zjg7Pjgbjjga7ov73liqBcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHBvaW50cyk7XG5cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0ZXh0dXJlW2ldO1xuICAgICAgICAgICAgY29uc3QgdGV4dHVyZWxvYWQgPSB0ZXh0dXJlTG9hZGVyLmxvYWQocGF0aCk7XG4gICAgICAgICAgICBjcmVhdGVQYXJ0aWNsZXModGV4dHVyZWxvYWQsIGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyZWF0ZVN0YWdlT2JqZWN0cyA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIOS8muWgtOOBruWjgeOBqOWkqeS6le+8iOeuseeKtuOCueODhuODvOOCuOepuumWk++8iVxuXG4gICAgICAgICAgICBjb25zdCByb29tV2lkdGggPSAxMDA7XG4gICAgICAgICAgICBjb25zdCByb29tSGVpZ2h0ID0gMzA7XG4gICAgICAgICAgICBjb25zdCByb29tRGVwdGggPSAxMDA7XG4gICAgICAgICAgICBjb25zdCB3YWxsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgyMjIyMjIsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgfSk7XG5cbiAgICAgICAgICAgIC8vIOWkqeS6lVxuICAgICAgICAgICAgY29uc3QgY2VpbGluZyA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHJvb21XaWR0aCwgcm9vbURlcHRoKSwgd2FsbE1hdGVyaWFsKTtcbiAgICAgICAgICAgIGNlaWxpbmcucm90YXRpb24ueCA9IE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgY2VpbGluZy5wb3NpdGlvbi55ID0gcm9vbUhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKGNlaWxpbmcpO1xuXG4gICAgICAgICAgICAvLyDlpaXjga7lo4HvvIhaLe+8iVxuICAgICAgICAgICAgY29uc3QgV2FsbCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHJvb21XaWR0aCwgcm9vbUhlaWdodCksIHdhbGxNYXRlcmlhbCk7XG4gICAgICAgICAgICBXYWxsLnJvdGF0aW9uLnkgPSBNYXRoLlBJO1xuICAgICAgICAgICAgV2FsbC5wb3NpdGlvbi5zZXQoMCwgcm9vbUhlaWdodCAvIDIsIC1yb29tRGVwdGggLyAyKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKFdhbGwpO1xuXG4gICAgICAgICAgICAvLyDliY3jga7lo4HvvIhaK++8iVxuICAgICAgICAgICAgY29uc3QgZnJvbnRXYWxsID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkocm9vbVdpZHRoLCByb29tSGVpZ2h0KSwgd2FsbE1hdGVyaWFsKTtcbiAgICAgICAgICAgIGZyb250V2FsbC5wb3NpdGlvbi5zZXQoMCwgcm9vbUhlaWdodCAvIDIsIHJvb21EZXB0aCAvIDIpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoZnJvbnRXYWxsKTtcblxuICAgICAgICAgICAgLy8g5bem44Gu5aOB77yIWC3vvIlcbiAgICAgICAgICAgIGNvbnN0IGxlZnRXYWxsID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkocm9vbURlcHRoLCByb29tSGVpZ2h0KSwgd2FsbE1hdGVyaWFsKTtcbiAgICAgICAgICAgIGxlZnRXYWxsLnJvdGF0aW9uLnkgPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgIGxlZnRXYWxsLnBvc2l0aW9uLnNldCgtcm9vbVdpZHRoIC8gMiwgcm9vbUhlaWdodCAvIDIsIDApO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobGVmdFdhbGwpO1xuXG4gICAgICAgICAgICAvLyDlj7Pjga7lo4HvvIhYK++8iVxuICAgICAgICAgICAgY29uc3QgcmlnaHRXYWxsID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkocm9vbURlcHRoLCByb29tSGVpZ2h0KSwgd2FsbE1hdGVyaWFsKTtcbiAgICAgICAgICAgIHJpZ2h0V2FsbC5yb3RhdGlvbi55ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICAgICAgcmlnaHRXYWxsLnBvc2l0aW9uLnNldChyb29tV2lkdGggLyAyLCByb29tSGVpZ2h0IC8gMiwgMCk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChyaWdodFdhbGwpO1xuXG5cbiAgICAgICAgICAgIC8vIOS8muWgtOOBruWcsOmdou+8iOOCueODhuODvOOCuOOBruWJjeW+jOW3puWPs+OCkuimhuOBhuW6g+OBhOW6iu+8iVxuICAgICAgICAgICAgY29uc3QgdmVudWVGbG9vck1hdCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDExMTExMSwgc2lkZTogVEhSRUUuRG91YmxlU2lkZSB9KTtcbiAgICAgICAgICAgIGNvbnN0IHZlbnVlRmxvb3IgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxMDAsIDEwMCksIHZlbnVlRmxvb3JNYXQpO1xuICAgICAgICAgICAgdmVudWVGbG9vci5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyOyAvLyDmsLTlubPjgatcbiAgICAgICAgICAgIHZlbnVlRmxvb3IucG9zaXRpb24uc2V0KDAsIDAsIDApOyAgLy8g44K544OG44O844K45bqK44KI44KK5bCR44GX5L2O44KB44Gr6Kit572uXG4gICAgICAgICAgICB2ZW51ZUZsb29yLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQodmVudWVGbG9vcik7XG5cbiAgICAgICAgICAgIC8vIOOCueODhuODvOOCuOW6ilxuICAgICAgICAgICAgLy9jb25zdCBmbG9vck1hdCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmZmZiwgbWV0YWxuZXNzOiAwLjgsIHJvdWdobmVzczogMC4yIH0pO1xuICAgICAgICAgICAgY29uc3QgZmxvb3JNYXQgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZmZmZmYgfSk7XG4gICAgICAgICAgICBjb25zdCBmbG9vckhlaWdodCA9IDE7XG5cbiAgICAgICAgICAgIGNvbnN0IGZsb29yID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDQwLCBmbG9vckhlaWdodCwgMjApLCBmbG9vck1hdCk7XG4gICAgICAgICAgICBmbG9vci5wb3NpdGlvbi5zZXQoMCwgZmxvb3JIZWlnaHQgLyAyLCAtNSk7XG4gICAgICAgICAgICBmbG9vci5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIGZsb29yLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoZmxvb3IpO1xuXG5cbiAgICAgICAgICAgIC8vIOiDjOaZr+WjgVxuICAgICAgICAgICAgY29uc3Qgd2FsbE1hdCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDMzMzMzMyB9KTtcbiAgICAgICAgICAgIGNvbnN0IGJhY2tXYWxsID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDMwLCAxNSwgMSksIHdhbGxNYXQpO1xuICAgICAgICAgICAgYmFja1dhbGwucG9zaXRpb24uc2V0KDAsIDcuNSwgLTEzKTtcbiAgICAgICAgICAgIGJhY2tXYWxsLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoYmFja1dhbGwpO1xuXG4gICAgICAgICAgICAvLyDjgrnjg5Tjg7zjgqvjg7zlt6ZcbiAgICAgICAgICAgIGNvbnN0IHNwZWFrZXJNYXQgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgxMTExMTEgfSk7XG4gICAgICAgICAgICBjb25zdCBzcGVha2VyTGVmdCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxLCAzLCAxKSwgc3BlYWtlck1hdCk7XG4gICAgICAgICAgICBzcGVha2VyTGVmdC5wb3NpdGlvbi5zZXQoLTcsIDEuNSwgLTcpO1xuICAgICAgICAgICAgc3BlYWtlckxlZnQuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChzcGVha2VyTGVmdCk7XG5cbiAgICAgICAgICAgIC8vIOOCueODlOODvOOCq+ODvOWPs1xuICAgICAgICAgICAgY29uc3Qgc3BlYWtlclJpZ2h0ID0gc3BlYWtlckxlZnQuY2xvbmUoKTtcbiAgICAgICAgICAgIHNwZWFrZXJSaWdodC5wb3NpdGlvbi5zZXQoNywgMS41LCAtNyk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChzcGVha2VyUmlnaHQpO1xuXG4gICAgICAgICAgICAvLyDjgrnjg53jg4Pjg4jjg6njgqTjg4hcbiAgICAgICAgICAgIHRoaXMuc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodCgweGZmMDAwMCwgMTApO1xuICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQucG9zaXRpb24uc2V0KDEwLCA4LCA1KTtcbiAgICAgICAgICAgIHRoaXMuc3BvdExpZ2h0LmFuZ2xlID0gTWF0aC5QSSAvIDY7XG4gICAgICAgICAgICB0aGlzLnNwb3RMaWdodC5wZW51bWJyYSA9IDAuMjtcbiAgICAgICAgICAgIHRoaXMuc3BvdExpZ2h0LnRhcmdldC5wb3NpdGlvbi5zZXQoMTAsIDAsIDApO1xuICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuc3BvdExpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuc3BvdExpZ2h0LnRhcmdldCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3BvdExpZ2h0MiA9IG5ldyBUSFJFRS5TcG90TGlnaHQoMHgwMGZmMDAsIDEwKTtcbiAgICAgICAgICAgIHRoaXMuc3BvdExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTEwLCA4LCA1KTtcbiAgICAgICAgICAgIHRoaXMuc3BvdExpZ2h0Mi5hbmdsZSA9IE1hdGguUEkgLyA2O1xuICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQyLnBlbnVtYnJhID0gMC4yO1xuICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQyLnRhcmdldC5wb3NpdGlvbi5zZXQoLTEwLCAwLCAwKTtcbiAgICAgICAgICAgIHRoaXMuc3BvdExpZ2h0Mi5jYXN0U2hhZG93ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5zcG90TGlnaHQyKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuc3BvdExpZ2h0Mi50YXJnZXQpO1xuXG4gICAgICAgICAgICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gICAgICAgICAgICAvLyDjg57jgqTjgq/jga7jg5jjg4Pjg4nvvIjnkIPkvZPvvIlcbiAgICAgICAgICAgIGNvbnN0IGhlYWRHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjMsIDE2LCAxNik7XG4gICAgICAgICAgICBjb25zdCBoZWFkTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHg0NDQ0NDQgfSk7XG4gICAgICAgICAgICBjb25zdCBoZWFkID0gbmV3IFRIUkVFLk1lc2goaGVhZEdlb21ldHJ5LCBoZWFkTWF0ZXJpYWwpO1xuICAgICAgICAgICAgaGVhZC5wb3NpdGlvbi55ID0gMS41O1xuICAgICAgICAgICAgZ3JvdXAuYWRkKGhlYWQpO1xuXG4gICAgICAgICAgICAvLyDjg57jgqTjgq/jga7mjIHjgaHmiYvvvIjlhobmn7HvvIlcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4xLCAwLjEsIDEuNSwgMTYpO1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgyMjIyMjIgfSk7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBuZXcgVEhSRUUuTWVzaChoYW5kbGVHZW9tZXRyeSwgaGFuZGxlTWF0ZXJpYWwpO1xuICAgICAgICAgICAgaGFuZGxlLnBvc2l0aW9uLnkgPSAwLjc1O1xuICAgICAgICAgICAgZ3JvdXAuYWRkKGhhbmRsZSk7XG5cbiAgICAgICAgICAgIC8vIOOCueOCv+ODs+ODie+8iOe0sOmVt+OBhOajku+8iVxuICAgICAgICAgICAgY29uc3Qgc3RhbmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuMDUsIDAuMDUsIDIsIDE2KTtcbiAgICAgICAgICAgIGNvbnN0IHN0YW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwMDAgfSk7XG4gICAgICAgICAgICBjb25zdCBzdGFuZCA9IG5ldyBUSFJFRS5NZXNoKHN0YW5kR2VvbWV0cnksIHN0YW5kTWF0ZXJpYWwpO1xuICAgICAgICAgICAgc3RhbmQucG9zaXRpb24ueSA9IC0xO1xuICAgICAgICAgICAgZ3JvdXAuYWRkKHN0YW5kKTtcblxuICAgICAgICAgICAgLy8g5YWo5L2T5L2N572u77yI44K544OG44O844K444Gu5Lit5b+D44Gr572u44GP44Gq44Gp77yJXG4gICAgICAgICAgICBncm91cC5wb3NpdGlvbi5zZXQoMCwgZmxvb3JIZWlnaHQgKiAyLCAyKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKGdyb3VwKTtcbiAgICAgICAgfVxuICAgICAgICBjcmVhdGVTdGFnZU9iamVjdHMoKTtcblxuXG5cbiAgICAgICAgbGV0IGdlbmVyYXRlU3ByaXRlID0gKENvbG9yOiBbbnVtYmVyLCBzdHJpbmddW10pID0+IHtcbiAgICAgICAgICAgIC8v5paw44GX44GE44Kt44Oj44Oz44OQ44K544Gu5L2c5oiQXG4gICAgICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSAxNjtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSAxNjtcblxuICAgICAgICAgICAgLy/lhoblvaLjga7jgrDjg6njg4fjg7zjgrfjg6fjg7Pjga7kvZzmiJBcbiAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBsZXQgZ3JhZGllbnQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyLCAwLCBjYW52YXMud2lkdGggLyAyLCBjYW52YXMuaGVpZ2h0IC8gMiwgY2FudmFzLndpZHRoIC8gMik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgW3N0b3AsIGNvbG9yXSBvZiBDb2xvcikge1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBjb2xvcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICAvL+ODhuOCr+OCueODgeODo+OBrueUn+aIkFxuICAgICAgICAgICAgbGV0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpO1xuICAgICAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGV4dHVyZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcmVhdGVQb2ludHMgPSAoZ2VvbTogVEhSRUUuQnVmZmVyR2VvbWV0cnksIHRleDogVEhSRUUuVGV4dHVyZSkgPT4ge1xuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICBjb2xvcjogMHhmZmZmZmYsXG4gICAgICAgICAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtYXA6IHRleFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRIUkVFLlBvaW50cyhnZW9tLCBtYXRlcmlhbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmo5Lnirbjga7ngrnnvqTjgrjjgqrjg6Hjg4jjg6rkvZzmiJDjgrXjg7Pjg5fjg6tcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlU3RpY2tQb2ludHMoaGVpZ2h0OiBudW1iZXIsIHBhcnRpY2xlQ291bnQ6IG51bWJlcikge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShwYXJ0aWNsZUNvdW50ICogMyk7XG4gICAgICAgICAgICBsZXQgcG9pbnRzSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIFgsWuOBrzDjgavlm7rlrprjgIFZ44Gv5qOS44Gu6auY44GV44Gr5Z2H562J6YWN572uXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zW3BvaW50c0luZGV4KytdID0gMDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnNbcG9pbnRzSW5kZXgrK10gPSAoaSAvIChwYXJ0aWNsZUNvdW50IC0gMSkpICogaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twb2ludHNJbmRleCsrXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUocG9zaXRpb25zLCAzKSk7XG4gICAgICAgICAgICByZXR1cm4gZ2VvbWV0cnk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IHN0aWNrR2VvbWV0cnkgPSBjcmVhdGVTdGlja1BvaW50cygxLjUsIDMwKTsgIC8vIOmrmOOBlTPjgIEzMOeCueOBruajkueKtueCuee+pFxuICAgICAgICBjb25zdCBudW1DeWx1bWVzID0gMTAwO1xuXG4gICAgICAgIGxldCByZWQgPSBnZW5lcmF0ZVNwcml0ZShbWzAsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJ10sIFswLjIsICdyZ2IoMjU1LCAwLCAwKSddLCBbMC40LCAncmdiKDExNiwgMTEsIDExKSddLCBbMSwgJ3JnYmEoMCwwLDAsMSknXV0pO1xuICAgICAgICBsZXQgZ3JlZW4gPSBnZW5lcmF0ZVNwcml0ZShbWzAsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJ10sIFswLjIsICdyZ2JhKDAsMjU1LDAsMSknXSwgWzAuNCwgJ3JnYigxMSwgMTE2LCA0NiknXSwgWzEsICdyZ2JhKDAsMCwwLDEpJ11dKTtcbiAgICAgICAgbGV0IGJsdWUgPSBnZW5lcmF0ZVNwcml0ZShbWzAsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJ10sIFswLjIsICdyZ2JhKDAsMCwyNTUsMSknXSwgWzAuNCwgJ3JnYmEoMCwgMCw2NCwxKSddLCBbMSwgJ3JnYmEoMCwwLDAsMSknXV0pO1xuICAgICAgICBsZXQgcGluayA9IGdlbmVyYXRlU3ByaXRlKFtbMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMSknXSwgWzAuMiwgJ3JnYmEoMjU1LCAwLCAxNDQsIDEpJ10sIFswLjQsICdyZ2JhKDgxLCAwLCA1NywgMSknXSwgWzEsICdyZ2JhKDAsMCwwLDEpJ11dKTtcbiAgICAgICAgbGV0IHllbGxvdyA9IGdlbmVyYXRlU3ByaXRlKFtbMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMSknXSwgWzAuMiwgJ3JnYmEoMjQ2LCAyNTUsIDAsIDEpJ10sIFswLjQsICdyZ2JhKDgxLCA3NywgMCwgMSknXSwgWzEsICdyZ2JhKDAsMCwwLDEpJ11dKTtcblxuICAgICAgICBjb25zdCBjb2xvcnMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6IFwicmVkXCIsIHRleHR1cmU6IHJlZCB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImdyZWVuXCIsIHRleHR1cmU6IGdyZWVuIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYmx1ZVwiLCB0ZXh0dXJlOiBibHVlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwicGlua1wiLCB0ZXh0dXJlOiBwaW5rIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwieWVsbG93XCIsIHRleHR1cmU6IHllbGxvdyB9XG5cbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLmN5bHVtZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbG9yIG9mIGNvbG9ycykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBwb2ludHMgPSBjcmVhdGVQb2ludHMoc3RpY2tHZW9tZXRyeSwgY29sb3IudGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgcG9pbnRzLnJvdGF0aW9uLnogPSBNYXRoLlBJIC8gMjtcblxuICAgICAgICAgICAgICAgIC8vIFrkvY3nva7jgaflgr7mlpzjgpLjgaTjgZHjgotcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gMjAgKyBNYXRoLnJhbmRvbSgpICogMTA7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IDIgKyAoeCAtIDIwKSAqIDAuOCArIE1hdGgucmFuZG9tKCk7XG5cbiAgICAgICAgICAgICAgICBwb2ludHMucG9zaXRpb24uc2V0KFxuICAgICAgICAgICAgICAgICAgICB4LCAgLy8g5bem56uvXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIC0xMCArIE1hdGgucmFuZG9tKCkgKiA1MFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChwb2ludHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3lsdW1lcy5wdXNoKHBvaW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRzID0gY3JlYXRlUG9pbnRzKHN0aWNrR2VvbWV0cnksIGNvbG9yLnRleHR1cmUpO1xuICAgICAgICAgICAgICAgIHBvaW50cy5yb3RhdGlvbi56ID0gTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gLTIwIC0gTWF0aC5yYW5kb20oKSAqIDEwO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSAyICsgKC14IC0gMjApICogMC44ICsgTWF0aC5yYW5kb20oKTsgIC8vIOKGkCDjgZPjgZPjgaflgr7mlpzlj43ou6JcblxuICAgICAgICAgICAgICAgIHBvaW50cy5wb3NpdGlvbi5zZXQoXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgIC0xMCArIE1hdGgucmFuZG9tKCkgKiA1MFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChwb2ludHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3lsdW1lcy5wdXNoKHBvaW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRzID0gY3JlYXRlUG9pbnRzKHN0aWNrR2VvbWV0cnksIGNvbG9yLnRleHR1cmUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeiA9IDQwICsgTWF0aC5yYW5kb20oKSAqIDk7ICAvLyB65bqn5qiZ56+E5Zuy5L+u5q2jXG5cbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gMiArICh6IC0gNDApICogMC44ICsgTWF0aC5yYW5kb20oKTsgIC8vIOWCvuaWnOioiOeul1xuXG4gICAgICAgICAgICAgICAgcG9pbnRzLnBvc2l0aW9uLnNldChcbiAgICAgICAgICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgKiA0MCkgLSAyMCxcbiAgICAgICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICAgICAgelxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChwb2ludHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3lsdW1lcy5wdXNoKHBvaW50cyk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1DeWx1bWVzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRzID0gY3JlYXRlUG9pbnRzKHN0aWNrR2VvbWV0cnksIGNvbG9yLnRleHR1cmUpO1xuXG4gICAgICAgICAgICAgICAgLy8g44Op44Oz44OA44Og6YWN572uXG4gICAgICAgICAgICAgICAgcG9pbnRzLnBvc2l0aW9uLnNldChcbiAgICAgICAgICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgKiA0MCkgLSAyMCwgICAgLy8gWDpcbiAgICAgICAgICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgKiAtMC43KSArIDEsICAgICAgICAgIC8vIFk6IDDjgJwxLjXvvIjluorjga7kuIrvvIlcbiAgICAgICAgICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgKiAzMCkgKyA3ICAgICAgIC8vIFo6IFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChwb2ludHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3lsdW1lcy5wdXNoKHBvaW50cyk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIGNvbnN0IGx2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIHRoaXMuY29sb3JzID0gW1xuICAgICAgICAgICAgbmV3IFRIUkVFLkNvbG9yKFwicmVkXCIpLFxuICAgICAgICAgICAgbmV3IFRIUkVFLkNvbG9yKFwiZ3JlZW5cIiksXG4gICAgICAgICAgICBuZXcgVEhSRUUuQ29sb3IoXCJibHVlXCIpLFxuICAgICAgICAgICAgbmV3IFRIUkVFLkNvbG9yKFwibWFnZW50YVwiKSxcbiAgICAgICAgXTtcblxuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIzmm7TmlrBcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhVGltZSA9IGNsb2NrLmdldERlbHRhKCk7XG4gICAgICAgICAgICBjb25zdCBzcGVlZCA9IDUwLjA7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jbG91ZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuY2xvdWRbal07XG4gICAgICAgICAgICAgICAgY29uc3QgdmVsb2NpdGllcyA9IHRoaXMucGFydGljbGVWZWxvY2l0eVtqXTtcbiAgICAgICAgICAgICAgICBjb25zdCBnZW9tID0gPFRIUkVFLkJ1ZmZlckdlb21ldHJ5PnBvaW50cy5nZW9tZXRyeTtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBnZW9tLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKTsgLy8g5bqn5qiZ44OH44O844K/XG4gICAgICAgICAgICAgICAgY29uc3Qgc2Vjb25kcyA9IHRpbWUgLyAxMDAwO1xuXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5jbG91ZC5wb3NpdGlvbi55IC09ICBzcGVlZCAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZ4ID0gdmVsb2NpdGllc1tpXS54O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2eSA9IHZlbG9jaXRpZXNbaV0ueTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdnogPSB2ZWxvY2l0aWVzW2ldLno7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHRpbWUgKiAwLjAwMSArIGkpICogMC4wMjtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFgoaSwgcG9zaXRpb25zLmdldFgoaSkgKyAodnggKyBzaW4pICogZGVsdGFUaW1lICogc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMuc2V0WShpLCBwb3NpdGlvbnMuZ2V0WShpKSArIHZ5ICogZGVsdGFUaW1lICogc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMuc2V0WihpLCBwb3NpdGlvbnMuZ2V0WihpKSArIHZ6ICogZGVsdGFUaW1lICogc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAvL+WcsOmdouOBq+OBpOOBhOOBn+OCieOBvuOBn+mZjeOCiuazqOOBkFxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zaXRpb25zLmdldFkoaSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMuc2V0WShpLCAgTWF0aC5yYW5kb20oKSAqIDEwICsgMjApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmN5bHVtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3lsdW1lID0gdGhpcy5jeWx1bWVzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjeWx1bWUudXNlckRhdGEucm90YXRpb25EaXJlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3lsdW1lLnVzZXJEYXRhLnJvdGF0aW9uRGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN5bHVtZS5yb3RhdGlvbi56ICs9IDAuMDUgKiBjeWx1bWUudXNlckRhdGEucm90YXRpb25EaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIGlmIChjeWx1bWUucm90YXRpb24ueiA+IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3lsdW1lLnVzZXJEYXRhLnJvdGF0aW9uRGlyZWN0aW9uID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3lsdW1lLnJvdGF0aW9uLnogPCAtMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeWx1bWUudXNlckRhdGEucm90YXRpb25EaXJlY3Rpb24gPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQucG9zaXRpb24ueCArPSAwLjEgKiB0aGlzLnM7XG4gICAgICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQudGFyZ2V0LnBvc2l0aW9uLnggKz0gMC4xICogdGhpcy5zO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQyLnBvc2l0aW9uLnggKz0gMC4xICogdGhpcy5zMjtcbiAgICAgICAgICAgICAgICB0aGlzLnNwb3RMaWdodDIudGFyZ2V0LnBvc2l0aW9uLnggKz0gMC4xICogdGhpcy5zMjtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNwb3RMaWdodC5wb3NpdGlvbi54ID4gMTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zID0gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNwb3RMaWdodC5wb3NpdGlvbi54IDwgLTEwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucyA9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3BvdExpZ2h0Mi5wb3NpdGlvbi54ID4gMTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zMiA9IC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zcG90TGlnaHQyLnBvc2l0aW9uLnggPCAtMTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zMiA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWNvbmRzIC0gdGhpcy5sYXN0Q29sb3JDaGFuZ2VUaW1lID4gMikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbG9ySW5kZXggPSAodGhpcy5jb2xvckluZGV4ICsgMSkgJSB0aGlzLmNvbG9ycy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRJbmRleCA9ICh0aGlzLmNvbG9ySW5kZXggKyAxKSAlIHRoaXMuY29sb3JzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcG90TGlnaHQuY29sb3IgPSB0aGlzLmNvbG9yc1t0aGlzLmNvbG9ySW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwb3RMaWdodDIuY29sb3IgPSB0aGlzLmNvbG9yc1tuZXh0SW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RDb2xvckNoYW5nZVRpbWUgPSBzZWNvbmRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH1cblxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDEwLCAxMCwgMzApKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiaXRDb250cm9sc19qcy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXMtNWVmMzNjXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9