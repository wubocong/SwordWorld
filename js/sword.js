;(function init(posInit, directInit) {
  const isMobile = /(Mobile|Android|Nexus|i?Phone|Mac|Lumia)/i.test(navigator.userAgent);
  let pos = {},
    direct = {};
  Object.assign(pos, posInit, {});
  Object.assign(direct, directInit, {});
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('mainCanvas')
  });

  const scene = new THREE.Scene();

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(0, 100, 0);
  // scene.add(directionalLight);

  const camera = new THREE.PerspectiveCamera(80, document.body.clientWidth / document.body.clientHeight, 0.1, 10000);
  camera.position.set(pos.x, pos.y, pos.z);
  scene.add(camera);

  (function bindKey() {
    keyboardJS.bind('u', function() {
      pos.y++;
      camera.position.y = pos.y;
      renderer.render(scene, camera);
    });
    keyboardJS.bind('d', function() {
      pos.y--;
      camera.position.y = pos.y;
      renderer.render(scene, camera);
    });
    keyboardJS.watch();
  })();
  (function importModel() {
    let light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(100, 300, 50);
    scene.add(light);
    const loader = new THREE.JSONLoader();
    // load a resource
    loader.load(
      // resource URL
      './models/aventador/avent.js',
      // Function when resource is loaded
      function(geometry, materials) {
        const material = new THREE.MultiMaterial(materials);
        const object = new THREE.Mesh(geometry, material);
        object.position.set(100, 50, 0);
        object.scale.set(10, 10, 10);
        scene.add(object);
        renderer.render(scene, camera);
      }
    );
  })();
  (function drag() {
    let startX,
      startY;
    if (isMobile) {
      document.body.addEventListener('touchstart', viewChangeStart);
      document.body.addEventListener('touchmove', viewChangeMove);
    } else {
      let isMouseDown = false;
      document.body.addEventListener('mousedown', function(e) {
        viewChangeStart(e);
        isMouseDown = true;
      });
      document.body.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
          viewChangeMove(e);
        }
      });
      document.body.addEventListener('mouseup', function() {
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
      let midX,
        midY;
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
  Promise.all([
    async() => {
      loader.load('./img/grass-background/grasslight-big.jpg')
    },
    async() => {
      loader.load('./img/grass-background/grasslight-big-nm.jpg')
    }])
    .then(([textureDiffuse, textureNormal]) => {
      console.log(textureNormal);
      console.log(textureDiffuse);
      textureDiffuse.wrapS = textureDiffuse.wrapT = THREE.RepeatWrapping;
      textureNormal.wrapS = textureNormal.wrapT = THREE.RepeatWrapping;
      textureDiffuse.repeat.set(200, 200);
      textureNormal.repeat.set(200, 200);

      const floorMaterial = new THREE.MeshPhongMaterial({
        map: textureDiffuse,
        normalMap: textureNormal,
        normalScale: new THREE.Vector2(1, 1).multiplyScalar(0.5),
        color: 0x44FF44,
      });

      const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      // floor.position.y = 0;
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);
      renderer.render(scene, camera);
    });

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
}.call(this, {
  x: 0,
  y: 100,
  z: 0
}, {
  longitude: 0,
  latitude: -Math.PI / 2
}));