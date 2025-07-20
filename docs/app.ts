//23FI031　川口優里奈
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';


class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud: THREE.Points[];
    private particleVelocity: THREE.Vector3[][];
    private cylumes: THREE.Points[];
    private spotLight: THREE.SpotLight;
    private spotLight2: THREE.SpotLight;

    private colors: THREE.Color[]; // スポットライトの色
    private colorIndex: number = 0;
    private lastColorChangeTime: number = 0;
    private s: number = 1;
    private s2: number = -1;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        //renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        renderer.setClearColor(new THREE.Color(0x585454));

        //カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();
        const textureLoader = new THREE.TextureLoader();
        const texture = ["love.png"];//3種類のテクスチャを利用する
        const clock = new THREE.Clock();
        this.cloud = [];
        this.particleVelocity = [];
        let velocities: THREE.Vector3[] = [];

        let loadOBJ = (objFilePath: string, mtlFilePath: string) => {
            let object = new THREE.Object3D;
            const mtlLoader = new MTLLoader();
            mtlLoader.load(mtlFilePath, (material) => {
                material.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(material);
                objLoader.load(objFilePath, (obj) => {
                    obj.position.set(0, 0.85, -0.5);
                    object.add(obj);
                })
            })
            return object;
        }
        const mesh = loadOBJ("human.obj", "human.mtl")
        this.scene.add(mesh);


        let createParticles = (texture: THREE.Texture, index: number) => {
            //ジオメトリの作成
            const geometry = new THREE.BufferGeometry();

            //マテリアルの作成
            const material = new THREE.PointsMaterial({ size: 1, map: texture, blending: THREE.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.8, })

            //particleの作成
            const particleNum = 1000; // パーティクルの数
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;

            for (let i = 0; i < particleNum; i++) {
                positions[particleIndex++] = (Math.random() - 0.5) * 50; 
                positions[particleIndex++] = Math.random() * 10 + 20; 
                positions[particleIndex++] = (Math.random() - 0.5) * 90; 

                velocities.push(new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    -Math.random() * 0.1 - 0.05,
                    (Math.random() - 0.5) * 0.02
                ));
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));


            //THREE.Pointsの作成
            const points = new THREE.Points(geometry, material);
            this.cloud.push(points); //cloudに追加する
            this.particleVelocity.push(velocities);//particleVelocityに追加する

            //シーンへの追加
            this.scene.add(points);

        }
        for (let i = 0; i < texture.length; i++) {
            const path = texture[i];
            const textureload = textureLoader.load(path);
            createParticles(textureload, i);
        }

        let createStageObjects = () => {
            // 会場の壁と天井（箱状ステージ空間）

            const roomWidth = 100;
            const roomHeight = 30;
            const roomDepth = 100;
            const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });

            // 天井
            const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), wallMaterial);
            ceiling.rotation.x = Math.PI / 2;
            ceiling.position.y = roomHeight;
            this.scene.add(ceiling);

            // 奥の壁（Z-）
            const Wall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMaterial);
            Wall.rotation.y = Math.PI;
            Wall.position.set(0, roomHeight / 2, -roomDepth / 2);
            this.scene.add(Wall);

            // 前の壁（Z+）
            const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMaterial);
            frontWall.position.set(0, roomHeight / 2, roomDepth / 2);
            this.scene.add(frontWall);

            // 左の壁（X-）
            const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
            leftWall.rotation.y = Math.PI / 2;
            leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
            this.scene.add(leftWall);

            // 右の壁（X+）
            const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
            rightWall.rotation.y = -Math.PI / 2;
            rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
            this.scene.add(rightWall);


            // 会場の地面（ステージの前後左右を覆う広い床）
            const venueFloorMat = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide });
            const venueFloor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), venueFloorMat);
            venueFloor.rotation.x = -Math.PI / 2; // 水平に
            venueFloor.position.set(0, 0, 0);  // ステージ床より少し低めに設置
            venueFloor.receiveShadow = true;
            this.scene.add(venueFloor);

            // ステージ床
            //const floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
            const floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const floorHeight = 1;

            const floor = new THREE.Mesh(new THREE.BoxGeometry(40, floorHeight, 20), floorMat);
            floor.position.set(0, floorHeight / 2, -5);
            floor.castShadow = true;
            floor.receiveShadow = true;
            this.scene.add(floor);


            // 背景壁
            const wallMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const backWall = new THREE.Mesh(new THREE.BoxGeometry(30, 15, 1), wallMat);
            backWall.position.set(0, 7.5, -13);
            backWall.receiveShadow = true;
            this.scene.add(backWall);

            // スピーカー左
            const speakerMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
            const speakerLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), speakerMat);
            speakerLeft.position.set(-7, 1.5, -7);
            speakerLeft.castShadow = true;
            this.scene.add(speakerLeft);

            // スピーカー右
            const speakerRight = speakerLeft.clone();
            speakerRight.position.set(7, 1.5, -7);
            this.scene.add(speakerRight);

            // スポットライト
            this.spotLight = new THREE.SpotLight(0xff0000, 10);
            this.spotLight.position.set(10, 8, 5);
            this.spotLight.angle = Math.PI / 6;
            this.spotLight.penumbra = 0.2;
            this.spotLight.target.position.set(10, 0, 0);
            this.spotLight.castShadow = true;

            this.scene.add(this.spotLight);
            this.scene.add(this.spotLight.target);

            this.spotLight2 = new THREE.SpotLight(0x00ff00, 10);
            this.spotLight2.position.set(-10, 8, 5);
            this.spotLight2.angle = Math.PI / 6;
            this.spotLight2.penumbra = 0.2;
            this.spotLight2.target.position.set(-10, 0, 0);
            this.spotLight2.castShadow = true;

            this.scene.add(this.spotLight2);
            this.scene.add(this.spotLight2.target);

            const group = new THREE.Group();

            // マイクのヘッド（球体）
            const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const headMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 1.5;
            group.add(head);

            // マイクの持ち手（円柱）
            const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
            const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);
            handle.position.y = 0.75;
            group.add(handle);

            // スタンド（細長い棒）
            const standGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
            const standMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
            const stand = new THREE.Mesh(standGeometry, standMaterial);
            stand.position.y = -1;
            group.add(stand);

            // 全体位置（ステージの中心に置くなど）
            group.position.set(0, floorHeight * 2, 2);
            this.scene.add(group);
        }
        createStageObjects();



        let generateSprite = (Color: [number, string][]) => {
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
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        let createPoints = (geom: THREE.BufferGeometry, tex: THREE.Texture) => {
            let material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 1,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                map: tex
            });
            return new THREE.Points(geom, material);
        }

        // 棒状の点群ジオメトリ作成サンプル
        function createStickPoints(height: number, particleCount: number) {
            const positions = new Float32Array(particleCount * 3);
            let pointsIndex = 0;

            for (let i = 0; i < particleCount; i++) {
                // X,Zは0に固定、Yは棒の高さに均等配置
                positions[pointsIndex++] = 0;
                positions[pointsIndex++] = (i / (particleCount - 1)) * height;
                positions[pointsIndex++] = 0;
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            return geometry;
        }


        const stickGeometry = createStickPoints(1.5, 30);  // 高さ3、30点の棒状点群
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

                // Z位置で傾斜をつける
                const x = 20 + Math.random() * 10;
                const y = 2 + (x - 20) * 0.8 + Math.random();

                points.position.set(
                    x,  // 左端
                    y,
                    -10 + Math.random() * 50
                );

                this.scene.add(points);
                this.cylumes.push(points);
            }

            for (let i = 0; i < 100; i++) {
                let points = createPoints(stickGeometry, color.texture);
                points.rotation.z = Math.PI / 2;

                const x = -20 - Math.random() * 10;
                const y = 2 + (-x - 20) * 0.8 + Math.random();  // ← ここで傾斜反転

                points.position.set(
                    x,
                    y,
                    -10 + Math.random() * 50
                );

                this.scene.add(points);
                this.cylumes.push(points);
            }

            for (let i = 0; i < 100; i++) {
                let points = createPoints(stickGeometry, color.texture);

                const z = 40 + Math.random() * 9;  // z座標範囲修正

                const y = 2 + (z - 40) * 0.8 + Math.random();  // 傾斜計算

                points.position.set(
                    (Math.random() * 40) - 20,
                    y,
                    z
                );

                this.scene.add(points);
                this.cylumes.push(points);
            }


            for (let i = 0; i < numCylumes; i++) {
                let points = createPoints(stickGeometry, color.texture);

                // ランダム配置
                points.position.set(
                    (Math.random() * 40) - 20,    // X:
                    (Math.random() * -0.7) + 1,          // Y: 0〜1.5（床の上）
                    (Math.random() * 30) + 7       // Z: 
                );

                this.scene.add(points);
                this.cylumes.push(points);

            }
        }

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        this.colors = [
            new THREE.Color("red"),
            new THREE.Color("green"),
            new THREE.Color("blue"),
            new THREE.Color("magenta"),
        ];

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            const deltaTime = clock.getDelta();
            const speed = 50.0;

            for (let j = 0; j < this.cloud.length; j++) {
                const points = this.cloud[j];
                const velocities = this.particleVelocity[j];
                const geom = <THREE.BufferGeometry>points.geometry;
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
                        positions.setY(i,  Math.random() * 10 + 20);
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
                    } else if (cylume.rotation.z < -0.5) {
                        cylume.userData.rotationDirection = 1;
                    }
                }

                this.spotLight.position.x += 0.1 * this.s;
                this.spotLight.target.position.x += 0.1 * this.s;

                this.spotLight2.position.x += 0.1 * this.s2;
                this.spotLight2.target.position.x += 0.1 * this.s2;

                if (this.spotLight.position.x > 10) {
                    this.s = -1;
                } else if (this.spotLight.position.x < -10) {
                    this.s = 1;
                }

                if (this.spotLight2.position.x > 10) {
                    this.s2 = -1;
                } else if (this.spotLight2.position.x < -10) {
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
        }
        requestAnimationFrame(update);
    }

}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(10, 10, 30));
    document.body.appendChild(viewport);
}

