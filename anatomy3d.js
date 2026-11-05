/* AGOGI — 3D Muscle Atlas */
(async () => {
  const THREE = await import(
    "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
  );

  const muscles = [
    ["chest", "Chest"],
    ["shoulders", "Shoulders"],
    ["arms", "Arms"],
    ["abs", "Abs"],
    ["quads", "Quadriceps"],
    ["calves", "Calves"],
    ["back", "Back"],
    ["glutes", "Glutes"],
    ["hamstrings", "Hamstrings"]
  ];

  let currentViewer = null;

  function buildViewer() {
    const bodymap = document.querySelector(".bodymap");
    if (!bodymap || bodymap.dataset.agogi3d) return;

    bodymap.dataset.agogi3d = "true";
    bodymap.innerHTML = "";

    const container = document.createElement("div");
    container.id = "agogi-anatomy3d";
    container.style.cssText =
      "width:100%;height:430px;position:relative;" +
      "background:#111713;border-radius:18px;overflow:hidden;";

    bodymap.appendChild(container);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffdfaa, 0x202820, 2));

    const light = new THREE.DirectionalLight(0xffd48a, 3);
    light.position.set(3, 5, 5);
    scene.add(light);

    const figure = new THREE.Group();
    scene.add(figure);

    const parts = [];

    function addMuscle(group, x, y, z, sx, sy, sz) {
      const material = new THREE.MeshStandardMaterial({
        color: 0x75563a,
        metalness: 0.3,
        roughness: 0.5
      });

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 16),
        material
      );

      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.userData.group = group;
      figure.add(mesh);
      parts.push(mesh);
    }// Head and torso
    addMuscle("head", 0, 2.15, 0, 0.3, 0.38, 0.3);
    addMuscle("torso", 0, 1.1, 0, 0.65, 0.85, 0.32);
    addMuscle("hips", 0, 0.12, 0, 0.48, 0.3, 0.3);

    // Left and right muscle groups
    for (const side of [-1, 1]) {
      addMuscle("chest",
        side * 0.32, 1.48, 0.3,
        0.3, 0.24, 0.16);

      addMuscle("shoulders",
        side * 0.78, 1.65, 0,
        0.28, 0.3, 0.28);

      addMuscle("arms",
        side * 0.98, 1.02, 0,
        0.2, 0.48, 0.2);

      addMuscle("arms",
        side * 1.06, 0.37, 0,
        0.16, 0.36, 0.17);

      addMuscle("abs",
        side * 0.18, 0.85, 0.3,
        0.17, 0.32, 0.12);

      addMuscle("quads",
        side * 0.3, -0.65, 0.1,
        0.25, 0.68, 0.26);

      addMuscle("calves",
        side * 0.3, -1.8, 0.05,
        0.18, 0.5, 0.2);

      addMuscle("back",
        side * 0.3, 1.15, -0.28,
        0.3, 0.65, 0.15);

      addMuscle("glutes",
        side * 0.26, -0.1, -0.2,
        0.26, 0.28, 0.2);

      addMuscle("hamstrings",
        side * 0.3, -0.72, -0.17,
        0.22, 0.6, 0.16);
    }

    // Highlight selected muscles in Spartan gold
    function highlight(group) {
      parts.forEach(part => {
        const selected = part.userData.group === group;

        part.material.color.setHex(
          selected ? 0xf4c76a : 0x75563a
        );

        part.material.emissive.setHex(
          selected ? 0x49300b : 0x000000
        );
      });
    }

    highlight("chest");
    // Tap a muscle on the model to highlight it
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;

    const canvas = renderer.domElement;
    canvas.style.touchAction = "none";

    canvas.addEventListener("pointerdown", event => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", event => {
      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;

      figure.rotation.y += dx * 0.01;
      figure.rotation.x = Math.max(
        -0.4,
        Math.min(0.4, figure.rotation.x + dy * 0.005)
      );

      lastX = event.clientX;
      lastY = event.clientY;
    });

    canvas.addEventListener("pointerup", event => {
      dragging = false;
      if (moved) return;

      const rect = canvas.getBoundingClientRect();

      pointer.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointer.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObjects(parts);

      if (hits.length) {
        const group = hits[0].object.userData.group;

        highlight(group);

        const button = document.querySelector(
          `[data-muscle="${group}"]`
        );

        if (button) button.click();
      }
    });

    // Connect existing AGOGI muscle buttons
    const buttons = document.querySelectorAll("[data-muscle]");

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        highlight(button.dataset.muscle);
      });
    });

    // Front / Back controls
    const controls = document.createElement("div");
    controls.style.cssText =
      "display:flex;justify-content:center;" +
      "gap:12px;margin:12px 0;";

    function addButton(label, rotation) {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.cssText =
        "background:#222b24;color:#e9c77b;" +
        "border:1px solid #8b6b35;" +
        "border-radius:10px;padding:10px 20px;";

      button.onclick = () => {
        figure.rotation.y = rotation;
        figure.rotation.x = 0;
      };

      controls.appendChild(button);
    }

    addButton("FRONT", 0);
    addButton("BACK", Math.PI);

    container.after(controls);

    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();

    let animationId;

    function animate() {
      if (!container.isConnected) {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        return;
      }

      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

    currentViewer = { highlight };
  }

  // Detect when the Anatomy tab opens
  const observer = new MutationObserver(() => {
    buildViewer();
  });

  function initialize() {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    buildViewer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
