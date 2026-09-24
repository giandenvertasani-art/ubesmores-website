/* The showroom is deliberately lazy: photos and ordering work without WebGL. */
(() => {
  "use strict";
  const flavors = [
    { id: "ube-smores", name: "UbeSmores Cookie", image: "ube", color: 0x815097, description: "Our signature purple cookie, finished with toasted marshmallows and a ribbon of caramel." },
    { id: "coffee-white-chocolate", name: "Coffee White Chocolate", image: "coffee", color: 0x80503a, description: "A rich coffee cookie dotted with creamy white chocolate. A little afternoon comfort." },
    { id: "salted-caramel", name: "Salted Caramel", image: "caramel", color: 0xb88039, description: "A golden cookie with soft caramel pieces, a glossy drizzle, and little flecks of sea salt." },
    { id: "biscoff-yema", name: "Biscoff Yema", image: "biscoff", color: 0xb87c3e, description: "Spiced biscuit, golden yema, and a cookie made for those slow, cozy moments." },
    { id: "buko-pandan", name: "Buko Pandan", image: "pandan", color: 0x709443, description: "A cheerful green pandan cookie with white chocolate and toasted coconut. A little taste of home." }
  ];
  const stage = document.getElementById("showroomStage");
  if (!stage) return;
  const container = document.getElementById("showroomCanvas");
  const poster = document.getElementById("showroomPoster");
  const loadButton = document.getElementById("loadShowroom");
  const controls = document.getElementById("viewerControls");
  const instruction = document.getElementById("viewerInstruction");
  const status = document.getElementById("showroomStatus");
  const rotateButton = document.getElementById("rotateCookie");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let selected = flavors[0].id;
  let viewer = null;
  let loading = false;

  function selectFlavor(id, announce = true) {
    const index = flavors.findIndex((flavor) => flavor.id === id);
    if (index < 0) return;
    const flavor = flavors[index];
    selected = id;
    document.getElementById("showroomNumber").textContent = String(index + 1).padStart(2, "0");
    document.getElementById("showroomName").textContent = flavor.name;
    document.getElementById("showroomDescription").textContent = flavor.description;
    document.getElementById("showroomOrder").dataset.menuFlavor = id;
    poster.querySelector("img").src = "./images/bakery/" + flavor.image + ".webp";
    poster.querySelector("img").alt = flavor.name + " product photo";
    document.querySelectorAll("[data-showroom-flavor]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.showroomFlavor === id));
    });
    if (viewer) viewer.select(id);
    if (announce) status.textContent = flavor.name + " selected.";
  }

  document.querySelectorAll("[data-showroom-flavor]").forEach((button) => {
    button.addEventListener("click", () => selectFlavor(button.dataset.showroomFlavor));
  });

  function showFallback(message) {
    if (viewer) viewer.dispose();
    viewer = null;
    container.replaceChildren();
    container.hidden = true;
    poster.hidden = false;
    controls.hidden = true;
    instruction.hidden = true;
    rotateButton.setAttribute("aria-pressed", "false");
    loadButton.disabled = false;
    loadButton.textContent = "Try 3D again ↗";
    stage.removeAttribute("aria-busy");
    status.textContent = message;
  }

  loadButton.addEventListener("click", async () => {
    if (loading || viewer) return;
    loading = true;
    loadButton.disabled = true;
    loadButton.textContent = "Opening the cabinet…";
    stage.setAttribute("aria-busy", "true");
    status.textContent = "Getting the 3D cookies ready…";
    let timer;
    try {
      const THREE = await Promise.race([
        import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Loading timed out")), 15000); })
      ]);
      container.hidden = false;
      viewer = createViewer(THREE);
      poster.hidden = true;
      controls.hidden = false;
      instruction.hidden = false;
      stage.removeAttribute("aria-busy");
      viewer.select(selected);
      viewer.canvas.focus({ preventScroll: true });
      status.textContent = "The cabinet is open. Drag left or right to turn a cookie, or use the arrow keys.";
    } catch (error) {
      showFallback("The 3D cabinet couldn't open on this device or connection. You can still browse all five photos and choose your cookies.");
    } finally {
      clearTimeout(timer);
      loading = false;
    }
  });

  rotateButton.addEventListener("click", () => {
    if (!viewer) return;
    const enabled = rotateButton.getAttribute("aria-pressed") !== "true";
    rotateButton.setAttribute("aria-pressed", String(enabled));
    viewer.autoRotate(enabled);
  });
  document.getElementById("zoomIn").addEventListener("click", () => viewer && viewer.zoom(.12));
  document.getElementById("zoomOut").addEventListener("click", () => viewer && viewer.zoom(-.12));
  document.getElementById("resetView").addEventListener("click", () => {
    if (viewer) viewer.reset();
    rotateButton.setAttribute("aria-pressed", "false");
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && viewer) {
      viewer.autoRotate(false);
      rotateButton.setAttribute("aria-pressed", "false");
    }
  });

  function createViewer(T) {
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-describedby", "viewerInstruction");
    container.append(canvas);

    const scene = new T.Scene();
    scene.background = new T.Color(0xead7bf);
    scene.fog = new T.Fog(0xead7bf, 17, 29);
    const camera = new T.PerspectiveCamera(39, 1, .1, 50);
    camera.position.set(0, 6.1, 10.8);
    camera.lookAt(0, .8, -.25);
    const hemi = new T.HemisphereLight(0xfff4df, 0x765238, 2.2);
    scene.add(hemi);
    const sunlight = new T.DirectionalLight(0xffe5be, 3.2);
    sunlight.position.set(-4, 8, 5);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    Object.assign(sunlight.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: .5, far: 22 });
    sunlight.shadow.bias = -.001;
    sunlight.shadow.normalBias = .035;
    scene.add(sunlight);
    const fill = new T.DirectionalLight(0xf0ddff, 1.4);
    fill.position.set(5, 4, -2);
    scene.add(fill);

    const material = (color, roughness = .84) => new T.MeshStandardMaterial({ color, roughness, metalness: 0 });
    const cream = material(0xfff0d9, .42);
    const wood = material(0xb58b60);
    const darkWood = material(0x936b48);
    const plaster = material(0xdec7ab);
    function mesh(geometry, mat, parent = scene) {
      const object = new T.Mesh(geometry, mat);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      return object;
    }

    const floor = mesh(new T.BoxGeometry(20, .3, 19), wood);
    floor.position.set(0, -.28, 0);
    const back = mesh(new T.BoxGeometry(20, 10, .25), plaster);
    back.position.set(0, 4.4, -4.8);
    // Arched wall niches and brass rails give the cookies a little room to live in.
    [-3.3, 0, 3.3].forEach((x) => {
      const niche = new T.Shape();
      niche.moveTo(-1.18, 0); niche.lineTo(1.18, 0); niche.lineTo(1.18, 2.5);
      niche.absarc(0, 2.5, 1.18, 0, Math.PI, false); niche.lineTo(-1.18, 0);
      const panel = mesh(new T.ShapeGeometry(niche), material(x === 0 ? 0xeadecf : 0xd0b99c));
      panel.position.set(x, .35, -4.62);
      panel.castShadow = false;
      const shelf = mesh(new T.BoxGeometry(2.6, .13, .55), darkWood);
      shelf.position.set(x, .36, -4.4);
    });
    const rail = mesh(new T.CylinderGeometry(.025, .025, 12, 10), material(0xa17a43, .4));
    rail.rotation.z = Math.PI / 2; rail.position.set(0, .1, -4);
    // Quiet board seams add warmth without an external texture download.
    const seamMat = material(0x9d7652);
    for (let i = -4; i <= 4; i++) {
      const seam = mesh(new T.BoxGeometry(.012, .005, 15), seamMat);
      seam.position.set(i * 1.4, -.125, 0); seam.castShadow = false;
    }

    const slots = [
      { x: 0, y: .05, z: 1.1, scale: 1.25 },
      { x: -3.0, y: .4, z: -.9, scale: .68 },
      { x: -1.5, y: 1.05, z: -2.35, scale: .68 },
      { x: 1.5, y: 1.05, z: -2.35, scale: .68 },
      { x: 3.0, y: .4, z: -.9, scale: .68 }
    ];
    slots.forEach((slot) => {
      if (slot.y > .1) {
        const pedestal = mesh(new T.CylinderGeometry(1.05, 1.12, slot.y + .14, 48), wood);
        pedestal.position.set(slot.x, (slot.y - .14) / 2, slot.z);
        for (let i = 0; i < 24; i++) {
          const angle = i / 24 * Math.PI * 2;
          const flute = mesh(new T.CylinderGeometry(.028, .028, slot.y + .12, 6), darkWood);
          flute.position.set(slot.x + Math.sin(angle) * 1.06, pedestal.position.y, slot.z + Math.cos(angle) * 1.06);
        }
      }
      const plate = mesh(new T.CylinderGeometry(slot.scale * 1.33, slot.scale * 1.26, .08, 64), cream);
      plate.position.set(slot.x, slot.y + .02, slot.z);
      const rim = mesh(new T.TorusGeometry(slot.scale * 1.27, .036, 8, 64), cream);
      rim.rotation.x = Math.PI / 2; rim.position.copy(plate.position); rim.position.y += .05;
    });

    const cookieGroups = flavors.map((flavor, index) => {
      const display = new T.Group();
      const cookie = makeCookie(T, flavor, index, mesh, material);
      display.add(cookie);
      display.userData.flavorId = flavor.id;
      display.userData.cookie = cookie;
      scene.add(display);
      return display;
    });
    let active = cookieGroups[0];
    let auto = false;
    let visible = true;
    let frame = 0;
    let lastTime = 0;
    let disposed = false;
    let pointer = null;
    const raycaster = new T.Raycaster();
    const cursor = new T.Vector2();

    function render(time = 0) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      if (auto) active.userData.cookie.rotation.y += Math.min((time - lastTime) / 1000 || 0, .04) * .35;
      lastTime = time;
      renderer.render(scene, camera);
      if (auto) requestRender();
    }
    function requestRender() {
      if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
    }
    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Keep the entire display in view on tall phone canvases.
      camera.fov = width < height * 1.05 ? 53 : 39;
      camera.position.z = width < height * 1.05 ? 12.8 : 10.8;
      camera.lookAt(0, .8, -.25);
      camera.updateProjectionMatrix();
      requestRender();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      requestRender();
    }, { rootMargin: "60px" });
    visibilityObserver.observe(stage);
    const onVisibility = () => requestRender();
    document.addEventListener("visibilitychange", onVisibility);

    function select(id) {
      const first = cookieGroups.find((group) => group.userData.flavorId === id);
      if (!first) return;
      active = first;
      const ordered = [first, ...cookieGroups.filter((group) => group !== first)];
      ordered.forEach((group, index) => {
        const slot = slots[index];
        group.position.set(slot.x, slot.y + .4 * slot.scale, slot.z);
        group.scale.setScalar(slot.scale);
        group.userData.cookie.rotation.set(0, index * .4, 0);
      });
      canvas.setAttribute("aria-label", flavors.find((flavor) => flavor.id === id).name + ", interactive 3D cookie display");
      requestRender();
    }
    function stopAuto() {
      auto = false;
      rotateButton.setAttribute("aria-pressed", "false");
    }
    function zoom(amount) {
      camera.zoom = T.MathUtils.clamp(camera.zoom + amount, .8, 1.6);
      camera.updateProjectionMatrix();
      requestRender();
    }
    function reset() {
      stopAuto(); camera.zoom = 1; camera.updateProjectionMatrix();
      active.userData.cookie.rotation.set(0, 0, 0); requestRender();
    }
    canvas.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
      stopAuto(); canvas.setPointerCapture(event.pointerId); canvas.classList.add("dragging");
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 6) pointer.moved = true;
      if (pointer.moved) {
        active.userData.cookie.rotation.y += dx * .012;
        active.userData.cookie.rotation.x = T.MathUtils.clamp(active.userData.cookie.rotation.x + dy * .006, -.32, .32);
        requestRender();
      }
      pointer.x = event.clientX; pointer.y = event.clientY;
    });
    function endPointer(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (event.type === "pointerup" && !pointer.moved) {
        const rect = canvas.getBoundingClientRect();
        cursor.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        raycaster.setFromCamera(cursor, camera);
        const hit = raycaster.intersectObjects(cookieGroups, true)[0];
        if (hit) {
          let target = hit.object;
          while (target && !target.userData.flavorId) target = target.parent;
          if (target) selectFlavor(target.userData.flavorId);
        }
      }
      pointer = null;
      canvas.classList.remove("dragging");
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    }
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);
    canvas.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home"].includes(event.key)) return;
      event.preventDefault(); stopAuto();
      if (event.key === "ArrowLeft") active.userData.cookie.rotation.y -= .18;
      if (event.key === "ArrowRight") active.userData.cookie.rotation.y += .18;
      if (event.key === "ArrowUp") active.userData.cookie.rotation.x = Math.max(-.32, active.userData.cookie.rotation.x - .08);
      if (event.key === "ArrowDown") active.userData.cookie.rotation.x = Math.min(.32, active.userData.cookie.rotation.x + .08);
      if (event.key === "+" || event.key === "=") zoom(.12);
      if (event.key === "-") zoom(-.12);
      if (event.key === "Home") reset();
      requestRender();
    });
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      showFallback("The 3D display paused on this device. Your cookie photos and ordering are still available.");
    });
    resize();
    return {
      canvas, select, zoom, reset,
      autoRotate(enabled) { auto = enabled; lastTime = performance.now(); requestRender(); },
      dispose() {
        disposed = true; cancelAnimationFrame(frame);
        resizeObserver.disconnect(); visibilityObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        const geometries = new Set(); const materials = new Set();
        scene.traverse((object) => {
          if (object.geometry) geometries.add(object.geometry);
          if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((mat) => materials.add(mat));
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((mat) => mat.dispose());
        renderer.dispose();
      }
    };
  }

  function makeCookie(T, flavor, index, mesh, material) {
    const group = new T.Group();
    let seed = 1234 + index * 137;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const dough = new T.SphereGeometry(1, 64, 28);
    const position = dough.attributes.position;
    const colors = [];
    const base = new T.Color(flavor.color);
    const color = new T.Color();
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
      const bump = 1 + Math.sin(x * 19 + z * 13) * .021 + Math.cos(z * 26 - x * 9) * .014;
      position.setXYZ(i, x * bump, y * .29 + Math.sin(x * 23 + z * 17) * .013, z * bump);
      color.copy(base).multiplyScalar(.82 + .21 * (y + 1) / 2 + random() * .15);
      colors.push(color.r, color.g, color.b);
    }
    dough.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
    dough.computeVertexNormals();
    const doughMat = material(0xffffff, .94); doughMat.vertexColors = true;
    mesh(dough, doughMat, group);
    // Instancing keeps the crumb detail light even with all five cookies visible.
    const crumbGeometry = new T.IcosahedronGeometry(1, 0);
    const crumbMat = material(flavor.color, .98);
    const crumbs = new T.InstancedMesh(crumbGeometry, crumbMat, 280);
    crumbs.castShadow = false; crumbs.receiveShadow = true;
    const dummy = new T.Object3D();
    for (let i = 0; i < 280; i++) {
      const radius = Math.sqrt(random()) * .98;
      const angle = random() * Math.PI * 2;
      const size = .018 + random() * .026;
      dummy.position.set(Math.cos(angle) * radius, .29 * Math.sqrt(1 - radius * radius) + .008, Math.sin(angle) * radius);
      dummy.scale.set(size * 1.4, size * .6, size);
      dummy.rotation.set(random() * 3, random() * 3, random() * 3);
      dummy.updateMatrix(); crumbs.setMatrixAt(i, dummy.matrix);
      color.copy(base).multiplyScalar(.7 + random() * .65); crumbs.setColorAt(i, color);
    }
    group.add(crumbs);
    const ivory = material(0xffe5bd, .56);
    const toasted = material(0xbe803f, .8);
    const caramel = material(index === 3 ? 0xe8aa41 : 0xbb6a22, .25);
    const topHeight = (x, z) => .29 * Math.sqrt(Math.max(0, 1 - x * x - z * z));
    const arrange = (count, radius, callback) => {
      for (let i = 0; i < count; i++) {
        const angle = i / count * Math.PI * 2 + random() * .3;
        const r = radius + (random() - .5) * .22;
        const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
        callback(x, z, topHeight(x, z), i);
      }
    };
    function drizzle(offset, width = .026) {
      const points = [];
      for (let j = 0; j <= 64; j++) {
        const x = - .78 + j / 64 * 1.56;
        const z = Math.sin(x * 12 + offset) * .37 + offset * .12;
        points.push(new T.Vector3(x, topHeight(x, z) + .035, z));
      }
      mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points), 70, width, 7, false), caramel, group);
    }
    function chip(x, z, y) {
      const points = [new T.Vector2(0, 0), new T.Vector2(.115, 0), new T.Vector2(.13, .035), new T.Vector2(.095, .095), new T.Vector2(.045, .15), new T.Vector2(.018, .205), new T.Vector2(0, .21)];
      const piece = mesh(new T.LatheGeometry(points, 12), ivory, group);
      piece.position.set(x, y - .01, z); piece.rotation.set((random() - .5) * .7, random() * 6, (random() - .5) * .7);
    }
    if (index === 0) {
      arrange(9, .58, (x, z, y) => {
        const marshmallow = mesh(new T.CapsuleGeometry(.11, .07, 5, 10), ivory, group);
        marshmallow.position.set(x, y + .09, z); marshmallow.rotation.z = (random() - .5) * .7;
        const toast = mesh(new T.SphereGeometry(.088, 12, 6), toasted, group);
        toast.scale.set(1, .14, 1); toast.position.set(x, y + .238, z);
      });
      drizzle(-.45); drizzle(.9, .02);
    } else if (index === 1 || index === 4) {
      arrange(10, .66, chip); arrange(3, .24, chip);
      if (index === 4) {
        const flakeGeo = new T.BoxGeometry(.018, .012, .13);
        const flakes = new T.InstancedMesh(flakeGeo, ivory, 55);
        for (let i = 0; i < 55; i++) {
          const angle = random() * Math.PI * 2, r = Math.sqrt(random()) * .88;
          const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
          dummy.position.set(x, topHeight(x, z) + .02, z); dummy.scale.setScalar(.7 + random());
          dummy.rotation.set(random() * .4, random() * 6, random() * .3); dummy.updateMatrix(); flakes.setMatrixAt(i, dummy.matrix);
        }
        group.add(flakes);
      }
    } else if (index === 2) {
      arrange(8, .59, (x, z, y) => {
        const chunk = mesh(new T.BoxGeometry(.21, .16, .19, 1, 1, 1), caramel, group);
        chunk.position.set(x, y + .035, z); chunk.rotation.set(random() * .3, random() * 5, random() * .3);
      });
      drizzle(-1); drizzle(.7);
      const salt = new T.InstancedMesh(new T.BoxGeometry(.025, .014, .035), ivory, 38);
      for (let i = 0; i < 38; i++) {
        const r = Math.sqrt(random()) * .92, a = random() * 6.28;
        const x = Math.cos(a) * r, z = Math.sin(a) * r;
        dummy.position.set(x, topHeight(x, z) + .045, z); dummy.scale.setScalar(.8 + random());
        dummy.rotation.set(0, random() * 6, 0); dummy.updateMatrix(); salt.setMatrixAt(i, dummy.matrix);
      }
      group.add(salt);
    } else if (index === 3) {
      const yema = mesh(new T.SphereGeometry(.7, 32, 16), caramel, group);
      yema.scale.set(1, .16, .9); yema.position.y = .27;
      const biscuit = new T.Group(); biscuit.position.set(.04, .41, -.1); biscuit.rotation.set(-.12, -.45, .2); group.add(biscuit);
      const biscuitMat = material(0x9d5829, .89);
      const biscuitBody = mesh(new T.BoxGeometry(.56, .14, 1.06, 3, 1, 5), biscuitMat, biscuit);
      const lineMat = material(0xc48c53);
      for (let i = -2; i <= 2; i++) {
        const ridge = mesh(new T.BoxGeometry(.48, .022, .022), lineMat, biscuit);
        ridge.position.set(0, .079, i * .16);
      }
      [-.22, .22].forEach((x) => {
        const edge = mesh(new T.BoxGeometry(.025, .025, .97), lineMat, biscuit);
        edge.position.set(x, .08, 0);
      });
      arrange(16, .71, (x, z, y) => {
        const chunk = mesh(new T.IcosahedronGeometry(.065 + random() * .04, 0), biscuitMat, group);
        chunk.position.set(x, y + .04, z); chunk.rotation.set(random() * 3, random() * 3, random() * 3);
      });
    }
    return group;
  }
})();
