import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let scene, camera, renderer;
let mercury, venus, earth, mars, sun;
let jupiter, saturn, uranus, neptune;
let orbit;

// Initialize Three.js scene
function init() {
  // Create a scene
  scene = new THREE.Scene();

  // Create a camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15000);
  camera.position.set(0, 500, 40);

  // Create a renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //Orbit Controls
  const controls = new OrbitControls( camera, renderer.domElement );
  const target = new THREE.Vector3(0, 0, 0);
  controls.target.copy(target);
  controls.update();


  // Load Shaders
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 }, // Uniform for time
      resolution: { value: new THREE.Vector2() }, // Uniform for resolution
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;

      void main() {
        // Normalized coordinates
        vec2 uv = vUv;

        // Scale and offset to cover the whole screen
        uv *= 2.0;
        uv -= 1.0;

        // // Add noise to create stars
        // float numStars = 10.0; // Adjust density of stars
        // float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 4375.5453);
        // noise = smoothstep(0.0, 0.02, noise); // Adjust the threshold for stars
        // float starField = floor(noise * numStars) / numStars;
        float numStars = 500.0; // Adjust density of stars

        float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 4375.5453);
        noise = smoothstep(0.0, 0.005, noise); // Adjust the threshold for stars (decrease this value for fewer stars)
        float starField = floor(noise * numStars) / numStars;


        //Invert colors
        starField = 1.0 - starField;

        // Output stars on the screen
        gl_FragColor = vec4(vec3(starField), 1.0);
      }
    `,
  });

  // Create a cube geometry for the background
  shaderMaterial.side = THREE.BackSide;
  const bgGeometry = new THREE.BoxGeometry(10000, 10000, 10000); // Cube dimensions
  const background = new THREE.Mesh(bgGeometry, shaderMaterial);
  scene.add(background);





  // Load your planet textures
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('./src/textures/sun.jpg');
  const sunMaterial = new THREE.MeshBasicMaterial({map : texture});
  const earthTexture = textureLoader.load('./src/textures/earth_texture.jpg');
  const earthMaterial = new THREE.MeshBasicMaterial({map : earthTexture});
  const marsTexture = textureLoader.load('./src/textures/mars_texture.jpg');
  const marsMaterial = new THREE.MeshBasicMaterial({map : marsTexture});
  const mercuryTexture = textureLoader.load('./src/textures/mercury_texture.jpg');
  const mercuryMaterial = new THREE.MeshBasicMaterial({map : mercuryTexture});
  const venusTexture = textureLoader.load('./src/textures/venus_texture.jpg');
  const venusMaterial = new THREE.MeshBasicMaterial({map : venusTexture});
  const jupiterTexture = textureLoader.load('./src/textures/jupiter.jpg');
  const jupiterMaterial = new THREE.MeshBasicMaterial({map : jupiterTexture});
  const saturnTexture = textureLoader.load('./src/textures/saturn.jpg');
  const saturnMaterial = new THREE.MeshBasicMaterial({map : saturnTexture});
  const uranusTexture = textureLoader.load('./src/textures/uranus.jpg');
  const uranusMaterial = new THREE.MeshBasicMaterial({map : uranusTexture});
  const neptuneTexture = textureLoader.load('./src/textures/neptune.jpg');
  const neptuneMaterial = new THREE.MeshBasicMaterial({map : neptuneTexture});
 
  // Radius Scale is 
  // Create the sun km to 1
  const sunGeometry = new THREE.SphereGeometry(30, 32, 32);//radius shouold be 109 
  //const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Create the planets (Mercury, Venus, Earth, Mars)
  const mGeometry = new THREE.SphereGeometry(1, 32, 32);
  mercury = new THREE.Mesh(mGeometry, mercuryMaterial);
  const vGeometry = new THREE.SphereGeometry(2.48, 32, 32);
  venus = new THREE.Mesh(vGeometry, venusMaterial);
  const eGeometry = new THREE.SphereGeometry(2.61, 32, 32);
  earth = new THREE.Mesh(eGeometry, earthMaterial);
  const marGeometry = new THREE.SphereGeometry(1.39, 32, 32);
  mars = new THREE.Mesh(marGeometry, marsMaterial);
  const jGeometry = new THREE.SphereGeometry(28, 32, 32);
  jupiter = new THREE.Mesh(jGeometry, jupiterMaterial);
  const sGeometry = new THREE.SphereGeometry(24, 32, 32);
  saturn = new THREE.Mesh(sGeometry, saturnMaterial);
  const uGeometry = new THREE.SphereGeometry(10.5, 32, 32);
  uranus = new THREE.Mesh(uGeometry, uranusMaterial);
  const nGeometry = new THREE.SphereGeometry(10, 32, 32);
  neptune = new THREE.Mesh(nGeometry, neptuneMaterial);

  // Set positions of planets
  mercury.position.set(4.6, 0, 0);
  venus.position.set(10.7, 0, 0);
  earth.position.set(14.7, 0, 0);
  mars.position.set(20.6, 0, 0);
  jupiter.position.set(74.1,0,0);
  saturn.position.set(135.0, 0, 0);
  uranus.position.set(274.0, 0, 0);
  neptune.position.set(446.0, 0, 0);
  // Add planets to the scene
  scene.add(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

  //Add orbit rings for planets (for visualization)
  const orbits = new THREE.RingGeometry(26, 29, 64);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  orbit = new THREE.Mesh(orbits, orbitMaterial);
  orbit.position.set(saturn.position.x,saturn.position.y,saturn.position.z)
  scene.add(orbit);

  //change camera target
  // Event listener for mouse clicks
  document.addEventListener('mousedown', function(event) {
    if (event.button === 2) {
      changeCameraFocus(); // Call the function to change camera focus
    }
  });

  //Orbit Paths
  createOrbitPaths();
}

function calculateEllipticalOrbit(perihelion , aphelion, period, time) {
  const a = (perihelion + aphelion) / 2; // Semi-major axis calculation
  const e = (aphelion - perihelion) / (aphelion + perihelion);
  const meanMotion = 2 * Math.PI / period; // Mean motion (angular velocity)
  const meanAnomaly = meanMotion * time; // Mean anomaly at time t

  // Eccentric anomaly calculation (approximation method)
  let eccentricAnomaly = meanAnomaly;
  const maxIterations = 1000; // Maximum iterations for convergence
  const epsilon = 1e-6; // Convergence criterion

  for (let i = 0; i < maxIterations; i++) {
    const delta = eccentricAnomaly - e * Math.sin(eccentricAnomaly) - meanAnomaly;
    eccentricAnomaly -= delta / (1 - e * Math.cos(eccentricAnomaly));
    if (Math.abs(delta) < epsilon) break; // Convergence achieved
  }

  const x = a * (Math.cos(eccentricAnomaly) - e);
  const y = a * Math.sqrt(1 - e**2) * Math.sin(eccentricAnomaly);

  return { x, y };
}

/*
Planet       | Perihelion               | Aphelion
------------------------------------------------------------
Mercury      | ~46 million km (28.6 mi) | ~70 million km (43.5 mi)
Venus        | ~107 million km (66.5 mi)| ~109 million km (67.7 mi)
Earth        | ~147 million km (91.4 mi)| ~152 million km (94.5 mi)
Mars         | ~206 million km (128 mi) | ~249 million km (154.8 mi)
Jupiter      | ~741 million km (460.2 mi)| ~817 million km (508.7 mi)
Saturn       | ~1.35 billion km (839 mi)| ~1.51 billion km (939 mi)
Uranus       | ~2.74 billion km (1.7 bi)| ~3 billion km (1.86 bi)
Neptune      | ~4.46 billion km (2.77 bi)| ~4.55 billion km (2.83 bi)
*/
//Orbit Scale is 10million km to 1

function movePlanets() {
  const time = Date.now() * 0.0001; // Adjust the speed of orbit here
  // Move planets
  let { x, y } = calculateEllipticalOrbit(46, 70, 1, time);
  mercury.position.set(x, 0, y);
  ({ x, y } = calculateEllipticalOrbit(107, 109, 2.56, time));
  venus.position.set(x,0,y);
  ({ x, y } = calculateEllipticalOrbit(147, 152, 4.15, time));
  earth.position.set(x,0,y);
  ({ x, y } = calculateEllipticalOrbit(206, 249, 7.80, time));
  mars.position.set(x,0,y);
  ({ x, y } = calculateEllipticalOrbit(817, 741, 50, time));
  jupiter.position.set(x,0,y);
  ({ x, y } = calculateEllipticalOrbit(1350, 1510, 122, time));
  saturn.position.set(x,0,y);
  ({ x, y } = calculateEllipticalOrbit(2740, 3000, 350, time));
  uranus.position.set(x,0,y);
  ({ x, y } = calculateEllipticalOrbit(4460, 4550, 685, time));
  neptune.position.set(x,0,y);
}

function ringPlanets(){
    orbit.position.set(saturn.position.x,saturn.position.y,saturn.position.z)
}

let currentPlanetIndex = 0; // Keeps track of the current focused planet

function changeCameraFocus() {
  // Increment the index to focus on the next planet
  currentPlanetIndex++;
  // Wrap around to the first planet if the index exceeds the number of planets
  if (currentPlanetIndex >= 9) {
    currentPlanetIndex = 0;
  }

  // Set the camera's focus to the position of the next planet
  const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, sun]; // Add sun as the last element
  const nextPlanet = planets[currentPlanetIndex];
  const distance = 50; // Set the distance from the planet to the camera (adjust as needed)
  const relativeCameraOffset = new THREE.Vector3(0, distance, distance); // Set the camera offset relative to the planet
  const cameraOffset = relativeCameraOffset.applyMatrix4(nextPlanet.matrixWorld);

  // Update the camera position and look at the next planet
  camera.position.copy(cameraOffset);
  camera.lookAt(nextPlanet.position);
}

function focusCamera(){
  if (currentPlanetIndex >= 9) {
    currentPlanetIndex = 0;
  }

  // Set the camera's focus to the position of the next planet
  const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, sun]; // Add sun as the last element
  const nextPlanet = planets[currentPlanetIndex];
  const distance = 50; // Set the distance from the planet to the camera (adjust as needed)
  const relativeCameraOffset = new THREE.Vector3(0, distance, distance); // Set the camera offset relative to the planet
  const cameraOffset = relativeCameraOffset.applyMatrix4(nextPlanet.matrixWorld);

  // Update the camera position and look at the next planet
  camera.position.copy(cameraOffset);
  camera.lookAt(nextPlanet.position);
}



function rotatePlanets(){
  const time = Date.now() * 0.0001; // Adjust the speed of orbit here
  // Rotate planets
  sun.rotation.y += 0.001;
  mercury.rotation.y += 0.01;
  venus.rotation.y -= 0.008;
  earth.rotation.y += 0.005;
  mars.rotation.y += 0.003;
}

// Create an array to store orbit paths
const orbitPaths = [];

// Function to create orbit paths for planets
function createOrbitPaths() {
  const orbitResolution = 360; // Number of vertices for the orbit path

  // Create orbit paths for each planet
  for (let i = 0; i < 9; i++) {
    const orbitPath = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    orbitPath.geometry.setFromPoints(Array(orbitResolution).fill(new THREE.Vector3()));
    scene.add(orbitPath);
    orbitPaths.push({ path: orbitPath, positions: [] });
  }
}

// Update orbit paths based on planet positions
function updateOrbitPaths() {
  orbitPaths.forEach((orbitPath, index) => {
    const planet = index === 8 ? sun : [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune][index];
    const positions = orbitPath.positions;

    // Store the current planet position for the orbit path
    positions.push(planet.position.clone());

    // Remove old positions to keep the trail length limited
    if (positions.length > 5000) {
      positions.shift();
    }

    // Update the geometry of the orbit path
    orbitPath.path.geometry.setFromPoints(positions);
  });
}








// Function to animate the scene
function animate() {
  requestAnimationFrame(animate);

  rotatePlanets();
  movePlanets();
  ringPlanets(); 
  //focusCamera();
  updateOrbitPaths();

  renderer.render(scene, camera);
}



// Initialize and start animation
init();
animate();




