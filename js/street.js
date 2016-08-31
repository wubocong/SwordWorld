; (function init(posInit, directInit) {
  const isMobile = /(Mobile|Android|Nexus|i?Phone|Mac|Lumia)/i.test(navigator.userAgent);
  let pos = {}, direct = {};
  Object.assign(pos, posInit, {});
  Object.assign(direct, directInit, {});
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('mainCanvas')
  });

  const scene = new THREE.Scene();

  // following code from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap.html
  const urls = [
    './img/pos-x.png',
    './img/neg-x.png',
    './img/pos-y.png',
    './img/neg-y.png',
    './img/pos-z.png',
    './img/neg-z.png'
  ];
  const textureCubeLoader = new THREE.CubeTextureLoader();
  const cubemap = textureCubeLoader.load(urls, function () {
    cubemap.format = THREE.RGBFormat;
    scene.background = cubemap;
    renderer.render(scene, camera);
  });

  // const light = new THREE.AmbientLight(0xffffff);
  // scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 100, 0);
  scene.add(directionalLight);

  const camera = new THREE.PerspectiveCamera(80, document.body.clientWidth / document.body.clientHeight, 0.1, 10000);
  camera.position.set(pos.x, pos.y, pos.z);
  scene.add(camera);

  (function bindKey() {
    keyboardJS.bind('u', function () {
      pos.y++;
      camera.position.y = pos.y;
      renderer.render(scene, camera);
    });
    keyboardJS.bind('d', function () {
      pos.y--;
      camera.position.y = pos.y;
      renderer.render(scene, camera);
    });
    keyboardJS.watch();
  })();
  (function drag() {
    let startX, startY;
    if (isMobile) {
      document.body.addEventListener('touchstart', viewChangeStart);
      document.body.addEventListener('touchmove', viewChangeMove);
    } else {
      let isMouseDown = false;
      document.body.addEventListener('mousedown', function (e) {
        viewChangeStart(e);
        isMouseDown = true;
      });
      document.body.addEventListener('mousemove', function (e) {
        if (isMouseDown) {
          viewChangeMove(e);
        }
      });
      document.body.addEventListener('mouseup', function () {
        isMouseDown = false;
      });
    }
    function viewChangeStart(e) {
      if (isMobile) {
        startX = e.targetTouches[0].pageX;
        startY = e.targetTouches[0].pageY;
      } else {
        startX = e.pageX;
        startY = e.pageY;
      }
    }
    function viewChangeMove(e) {
      let midX, midY;
      if (isMobile) {
        midX = e.targetTouches[0].pageX;
        midY = e.targetTouches[0].pageY;
      } else {
        midX = e.pageX;
        midY = e.pageY;
      }
      const longDelta = (startX - midX) / document.body.clientWidth * 2 * Math.PI;
      const latDelta = (startY - midY) / document.body.clientHeight * Math.PI;
      direct.longitude += longDelta;
      direct.latitude += latDelta;
      if (direct.latitude > Math.PI / 2) {
        direct.latitude = Math.PI / 2;
      } else if (direct.latitude < -Math.PI / 2) {
        direct.latitude = -Math.PI / 2;
      }
      let {x, y, z} = pos;
      z += 1 * Math.cos(direct.latitude) * Math.cos(direct.longitude);
      x += 1 * Math.cos(direct.latitude) * Math.sin(direct.longitude);
      y += 1 * Math.sin(direct.latitude);
      camera.lookAt(new THREE.Vector3(x, y, z));
      renderer.render(scene, camera);
      startX = midX;
      startY = midY;
    }
  })();

  const loader = new THREE.TextureLoader();
  loader.load(
    // resource URL
    './img/road-texture.jpg',
    // Function when resource is loaded
    function (texture) {
      // do something with the texture
      const floorMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10000 / 128, 10000 / 128);
      const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = 0;
      // scene.add(floor);
      renderer.render(scene, camera);
    },
    // Function called when download progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Function called when download errors
    function (xhr) {
      console.log('An error happened');
    }
  );
  const geometry = new THREE.SphereGeometry(5, 512, 64);
  const material = new THREE.MeshLambertMaterial({
    color: 0x2194ce,
    emissive: 0x000000,
    fog: true,
    reflectivity: 1,
    refractionRatio: 0.98
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(0, 5, 0);
  scene.add(sphere);

  camera.lookAt(scene.position);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.render(scene, camera);

  this.renderer = renderer;
  this.scene = scene;
  this.camera = camera;
}.call(this, { x: 0, y: 100, z: 0 }, { longitude: 0, latitude: -Math.PI / 2 }));