
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';



const baseUrl = 'https://whispering-chamber-09886.herokuapp.com';
// http://localhost:3000
const form = document.querySelector("#comment-form");
const setUsernameForm = document.querySelector("#set-username");
const comment = document.querySelector("#messages");
const refreshBtn = document.querySelector("#refresh");
const usersList = document.querySelector("#list-unstyled-users");
const listHistory = document.querySelector(".list-history");
const members = document.querySelector(".members");
const chatroomWrapper = document.querySelector(".chatroom-wrapper");
const login = document.querySelector(".login");
const ctaBtn = document.querySelector(".cta-button");
const titleChat = document.querySelector(".title-chat");
const terrienGroup = document.querySelector(".terriens");
const marsiensGroup = document.querySelector(".marsiens");
const messagesContainer = document.getElementById("user-mess-wrapper");
const safeZone = document.querySelector(".safe-zone");
const messages = []
let users = []
let placeholder = document.querySelector("#your-message");
let userRoom = "general";
const socket = io(baseUrl);

placeholder.attributes.placeholder.value = "Envoyer un message dans @safe-zone";

socket.on("connect", () => {
  socket.emit("getMessages");
  socket.emit("getUsers");

  // send message to server

})

// setInterval(() => { socket.emit("message", "je suis le roi du monde!"); }, 4000)

// get user message
socket.on("message", receivedMessage);

// get list of connected
socket.on("users", (utilisateurs) => {
  const arraySlice = utilisateurs
  const filtered = arraySlice.filter((username) => username.name !== "Anonymous");
  console.log(filtered.length);
  members.innerHTML = `Membres-${arraySlice.length}`;
  users.push(filtered)
  utilisateurs.forEach((user) => {
    const userList = `
     <div class="users-list">
       <img src="images/Avatar-Profile-Vector-PNG-File.png" alt="avatar" class="avatar">
        <li>${user.name}</li>
     </div>
      `;
    usersList.insertAdjacentHTML("beforeend", userList);
  })
});

// get history of messages
socket.on("messages", (messages) => {

  const ArraySlice = messages
  ArraySlice.forEach((message) => {
    const messageDate = new Date(message.time).toDateString();;
    const messHystory = `<li>${message.value} (posted <span class ="date">${messageDate} ago</span>) by ${message.user.name}</li>`;
    listHistory.insertAdjacentHTML("beforeend", messHystory);
  })
});




// const clearMessages = () => {

//   let child = messagesContainer.lastElementChild;
//   while (child) {
//     console.log(child);
//     // messagesContainer.removeChild(child);
//     // child = messagesContainer.lastElementChild;
//   }
// }
// groupes Management
safeZone.addEventListener("click", () => {
  socket.emit("joinRoom", "general");
  userRoom = "general"
  safeZone.classList.add("group-name");
  terrienGroup.classList.remove("group-name");
  marsiensGroup.classList.remove("group-name");
});

terrienGroup.addEventListener("click", () => {

  socket.emit("joinRoom", "Terriens");
  userRoom = "Terriens"
  terrienGroup.classList.add("group-name");
  safeZone.classList.remove("group-name");
  marsiensGroup.classList.remove("group-name");
  placeholder.attributes.placeholder.value = "Envoyer un message aux @Terriens";


})
marsiensGroup.addEventListener("click", () => {
  socket.emit("joinRoom", "Marsiens");
  userRoom = "Marsiens"
  marsiensGroup.classList.add("group-name");
  terrienGroup.classList.remove("group-name");
  safeZone.classList.remove("group-name");
  placeholder.attributes.placeholder.value = "Envoyer un message aux @Marsiens";
})

//change username

// refresh page to get new messages
function receivedMessage(message) {
  messages.push(message)
  let messReceived;
  const messageDate = new Date(message.time)
  const messHour = messageDate.getHours();
  const messMin = messageDate.getMinutes();
  if (message.room === userRoom) {
    messReceived =
      `
<div id="user-mess-wrapper">
  <div class="text-chatleft">
    <img src="images/Avatar-Profile-Vector-PNG-File.png" alt="avatar" class="avatar">
    <div class="user-message">
      <p class = "user-name">${message.user.name}</p>
      <p>${message.value} </p>
    </div>
  </div>
  <span class="time">${messHour}h${messMin}</span>
</div>
`;
    comment.insertAdjacentHTML("beforeend", messReceived);
  }
}
// en attendant

// change placeholder text



// send message with socket io
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageValue = document.querySelector("#your-message").value;
  const words = messageValue.split(" ")
  if (words.includes("/confetis")) {
    const confetis = document.querySelector("#lottie-confetis");
    confetis.style.width = "886px";

    setTimeout(lottieAnim('#lottie-confetis', 'https://assets7.lottiefiles.com/packages/lf20_s1ewowgl.json', false), 300);
    confetis.style.display = 'block';
  }

  const message = { type: "", value: messageValue, room: userRoom }
  console.log(message);
  socket.emit("message", message);

  document.querySelector("#your-message").value = "";
});

function handleUsername() {
  const username = document.querySelector(".set-name-input").value;
  console.log(username);
  socket.emit("setUsername", username);
  const updateUsername = (user) => {

    // set prev username to new username
    users.map((user) => {
      if (user.id === socket.id) {
        user.name = username;
      }
    })
  }
  socket.on("updateUsername", (user) => updateUsername(user));
}
// Animations

gsap.set(chatroomWrapper, { scaleX: 0, scaleY: 0, transformOrigin: "center" })

ctaBtn.addEventListener("click", (e) => {

  handleUsername(e);

  gsap.to(chatroomWrapper, { duration: 1, scaleX: 1, scaleY: 1, ease: "power4.out" });
  gsap.to(login, { duration: 1, scaleX: 0, scaleY: 0, ease: "power4.out" });
  titleChat.style.display = "none";
});


lottieAnim('#lottie-animation', 'https://assets5.lottiefiles.com/packages/lf20_bqmgf5tx.json', false)
// lottie Animations

function lottieAnim(target, path, loop) {
  // Start animation
  const element = document.querySelector(target);
  const animation = lottie.loadAnimation({
    container: element, // the dom element that will contain the animation
    renderer: 'svg',
    loop: loop,
    autoplay: false,
    path: path, // the path to the animation json
    preserveAspectRatio: 'xMidYMid meet',
  });

  animation.play();
  element.style.opacity = 1;


  // on animation end
  animation.addEventListener('complete', () => {
    element.style.display = 'none';
    // animation.destroy();
  });
}


// THREE.js
// Canvas


const clock = new THREE.Clock()
const elapsedTime = clock.getElapsedTime()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('textures/particles/9.png')

// Particles/*  */
// const ParticlesGeometry = new THREE.SphereBufferGeometry(1,32,32)
const Color = ["red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "black", "white"]
const randomColor = () => {
  return Color[Math.floor(Math.random() * Color.length)]
}


const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color(randomColor())
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particlesTexture
// particlesMaterial.alphaTest = 0.001
// // draw the particles and dont care what is behind and front
// particlesMaterial.depthTest = false
// to avoid that we use
particlesMaterial.depthWrite = false
// pour une meilleur illumination
particlesMaterial.blending = THREE.AdditiveBlending
// active multiple color
particlesMaterial.vertexColors = true
// const particles = new THREE.Points(ParticlesGeometry,particlesMaterial)
// scene.add(particles)

// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 1000

const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
const colors = new Float32Array(count * 3) // Multiply by 3 because each color is composed of 3 values (r, g, b)

for (let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
{
  positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  colors[i] = Math.random()

}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

// earth and sun
const sunTexture = textureLoader.load('/textures/lava/8k_sun.jpg')
const earthTexture = textureLoader.load('/textures/lava/8k_earth_daymap.jpg')
// const displacementTexture = textureLoader.load('/textures/lava/Lava_005_DISP.png')
// const maskTexture = textureLoader.load('/textures/lava/Lava_005_MASK.jpg')
// const normalTexture = textureLoader.load('/textures/lava/Lava_005_NORM.jpg')
// const ambientOcclusonTexture = textureLoader.load('/textures/lava/Lava_005_OCC.jpg')
// const roughnessTexture = textureLoader.load('/textures/lava/Lava_005_ROUGH.jpg')


/**
 * Base
 */
// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)
//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 2, 23)
scene.add(directionalLight)


/**
 * Object
 */
// sphere geometry

const sphereGeometry = new THREE.SphereGeometry(0.4, 64, 64)
sphereGeometry.center()
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture })
const sun = new THREE.Mesh(sphereGeometry, sunMaterial)
scene.add(sun)
let orbitRadius = 1.5
const circleGeometry = new THREE.BufferGeometry().setFromPoints(
  new THREE.Path().absarc(0, 0, orbitRadius, 0, Math.PI * 2).getSpacedPoints(200)
)
circleGeometry.center()
const circleMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
circleMaterial.transparent = true
circleMaterial.opacity = 0.3
const circle = new THREE.LineLoop(circleGeometry, circleMaterial)
circle.rotation.x = Math.PI / 2
circleMaterial.wireframe = true

const earthGeometry = new THREE.SphereGeometry(0.1, 64, 64)
earthGeometry.center()
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture })
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
earth.position.set(Math.cos(elapsedTime) * orbitRadius, 0, Math.sin(elapsedTime) * orbitRadius)
scene.add(earth)
// remove vertice
// circleGeometry.vertices.shift()

// get closet circle
scene.add(circle);
const orbit = new THREE.Group()
orbit.add(earth, circle)
orbit.rotation.x = Math.PI * 0.08


scene.add(orbit)
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
// remove control rotation
// controls.enableRotate = false
// controls.enablePan = false




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()
  // Update particles
  particles.rotation.y = elapsedTime * 0.02

  earth.rotation.y += 0.02
  sun.rotation.y -= 0.02
  orbit.rotation.y += 0.02

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()