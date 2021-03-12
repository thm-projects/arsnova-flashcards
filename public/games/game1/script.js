// http://brm.io/matter-js/docs/index.html

(() => {
  const COLOR = {
    BACKGROUND: "#212529",
    OUTER: "#495057",
    INNER: "#15aabf",
    BUMPER: "#fab005",
    BUMPER_LIT: "#fff3bf",
    PINBALL: "#dee2e6"
  };

  const WORLD_SIZE = { x: 500, y: 2000 };
  const RENDER_SIZE = { x: 500, y: 800 };

  const GRAVITY = 1;
  const WIREFRAMES = false;
  const BUMPER_BOUNCE = 1;
  const MAX_VELOCITY = 30;

  const BUMPER_RADIUS = 10;
  const PINBALL_RADIUS = 20;
  
  // score html elements
  var $currentScore, $highScore;

  // shared variables
  var currentScore, highScore;
  var engine, world, render, pinball, stopperGroup;

  var crane;
  var craneSize = 50;
  var craneMovementOffset = 0;

  var pinballDropped = false;

  var bumperHitArray = Array();

  function load() {
    createHTMLBody();
    $(".button-start").prop("disabled", true);
    $(".button-reset").prop("disabled", true);

    createScene();
    createStaticBodies();
    createEvents();

    $(".button-start").prop("disabled", false);
  }

  function createHTMLBody() {
    // main container
    var container = document.createElement("div");
    container.className = "container";
    document.body.appendChild(container);

    // current score
    var current_score = document.createElement("div");
    current_score.className = "score current-score";

    current_score.appendChild(document.createTextNode("score"));
    current_score.appendChild(document.createElement("br"));
    current_score.appendChild(document.createElement("span"));

    container.appendChild(current_score);

    // high score
    var high_score = document.createElement("div");
    high_score.className = "score high-score";

    high_score.appendChild(document.createTextNode("high score"));
    high_score.appendChild(document.createElement("br"));
    high_score.appendChild(document.createElement("span"));

    container.appendChild(high_score);

    // start button
    var button_start = document.createElement("button");
    button_start.className = "button button-start";
    button_start.appendChild(document.createTextNode("Start"));

    container.appendChild(button_start);

    // reset button
    var button_reset = document.createElement("button");
    button_reset.className = "button button-reset";
    button_reset.appendChild(document.createTextNode("Reset"));

    container.appendChild(button_reset);
  }

  function createScene() {
    // engine (shared)
    engine = Matter.Engine.create();

    // world (shared)
    world = engine.world;
    world.bounds = {
      min: { x: 0, y: 0 },
      max: { x: WORLD_SIZE.x, y: WORLD_SIZE.y }
    };
    world.gravity.y = GRAVITY; // simulate rolling on a slanted table

    // render (shared)
    render = Matter.Render.create({
      element: $(".container")[0],
      engine: engine,
      options: {
        width: RENDER_SIZE.x,
        height: RENDER_SIZE.y,
        background: COLOR.BACKGROUND,
        wireframes: WIREFRAMES,
        //showAngleIndicator: true,
        //showVelocity: true,
        //showCollisions: true,
        hasBounds: true
      }
    });
    Matter.Render.run(render);

    // runner
    var runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // used for collision filtering on various bodies
    stopperGroup = Matter.Body.nextGroup(true);

    // html elements
    $currentScore = $(".current-score span");
    $highScore = $(".high-score span");

    // starting values
    currentScore = 0;
    highScore = 0;

    updateScore(0);
  }

  function createStaticBodies() {
    Matter.World.add(world, [
      // table boundaries (top, bottom, left, right)
      boundary(
        world.bounds.max.x / 2,
        world.bounds.min.y + 50,
        world.bounds.max.x,
        100
      ),
      boundary(
        world.bounds.max.x / 2,
        world.bounds.max.y - 10,
        world.bounds.max.x,
        20
      ),
      boundary(
        world.bounds.min.x + 10,
        world.bounds.max.y / 2,
        20,
        world.bounds.max.y
      ),
      boundary(
        world.bounds.max.x - 10,
        world.bounds.max.y / 2,
        20,
        world.bounds.max.y
      )
    ]);

    crane = Matter.Bodies.rectangle(world.bounds.max.x / 2, 125, craneSize, craneSize, {
      label: "crane",
      isStatic: true,
      chamfer: 10,
      render: {
        fillStyle: COLOR.INNER
      }
    });
    Matter.World.add(world, crane);

    pinball = Matter.Bodies.circle(crane.position.x, crane.bounds.max.y + PINBALL_RADIUS, PINBALL_RADIUS, {
      label: "pinball",
      isStatic: true,
      collisionFilter: {
        group: stopperGroup
      },
      render: {
        fillStyle: COLOR.PINBALL
      }
    });
    Matter.World.add(world, pinball);

    const max_bumper_per_row = 4;

    const bumper_x_step = 140;
    const bumper_y_step = 140; //90;

    const bumper_x_even = 40;
    const bumper_x_odd = bumper_x_even + bumper_x_step / 2;

    var bumper_y = 250;

    //*
    for (var i = 0; i < 6; i++) {
      // even bumper row
      for (var n = 0; n < max_bumper_per_row; n++) {
        Matter.World.add(
          world,
          bumper(bumper_x_even + n * bumper_x_step, bumper_y)
        );
      }

      bumper_y += bumper_y_step;

      // odd bumper row
      for (var n = 0; n < max_bumper_per_row - 1; n++) {
        Matter.World.add(
          world,
          bumper(bumper_x_odd + n * bumper_x_step, bumper_y)
        );
      }

      bumper_y += bumper_y_step;
    }
    //*/

    //*
    Matter.World.add(world, [
      finishLine(
        world.bounds.max.x / 2,
        world.bounds.max.y - 20,
        world.bounds.max.x - world.bounds.min.x - 40,
        1
      )
    ]);
    //*/
  }

  function createEvents() {
    // events for when the pinball hits stuff
    Matter.Events.on(engine, "collisionStart", function(event) {
      var pairs = event.pairs;
      pairs.forEach(function(pair) {
        //alert(pair.bodyA.label + ' --> ' + pair.bodyB.label);
        if (pair.bodyA.label === "pinball") {
          switch (pair.bodyB.label) {
            case "finishLine":
              //alert('score: ' + currentScore);
              //resetScene();
              break;
            case "bumper":
              pingBumper(pair.bodyB);
              break;
          }
        }
      });
    });

    // regulate pinball
    Matter.Events.on(engine, "beforeUpdate", function(event) {
      // bumpers can quickly multiply velocity, so keep that in check
      Matter.Body.setVelocity(pinball, {
        x: Math.max(Math.min(pinball.velocity.x, MAX_VELOCITY), -MAX_VELOCITY),
        y: Math.max(Math.min(pinball.velocity.y, MAX_VELOCITY), -MAX_VELOCITY)
      });

      if (!pinballDropped) {
        craneMovementOffset += 0.03;

        if (craneMovementOffset < 0) {
          return;
        }

        var px = 250 + 175 * Math.sin(craneMovementOffset);

        // body is static so must manually update velocity for friction to work
        Matter.Body.setVelocity(crane, { x: px - crane.position.x, y: 0 });
        Matter.Body.setPosition(crane, { x: px, y: crane.position.y });

        Matter.Body.setPosition(pinball, {
          x: crane.position.x,
          y: crane.bounds.max.y + PINBALL_RADIUS
        });
      } else {
        craneMovementOffset = 0;
        Matter.Body.setVelocity(crane, { x: 0, y: 0 });
      }
    });

    // use the engine tick event to control our view
    Matter.Events.on(engine, "beforeTick", function() {
      const bounds_center_y = (render.bounds.max.y - render.bounds.min.y) / 2;

      var new_pos_min_y = pinball.position.y - bounds_center_y;
      var new_pos_max_y = pinball.position.y + bounds_center_y;

      if (new_pos_min_y >= 0 && new_pos_max_y <= world.bounds.max.y) {
        render.bounds.min.y = new_pos_min_y;
        render.bounds.max.y = new_pos_max_y;
      }
    });

    // click/tap button events
    $(".button-start")
      //.on('mousedown touchstart', function(e) {
      //})
      .on("mouseup touchend", function(e) {
        dropPinball();
      });
    $(".button-reset")
      //.on('mousedown touchstart', function(e) {
      //})
      .on("mouseup touchend", function(e) {
        resetScene();
      });
  }

  function pingBumper(bumper) {
    if (!bumperHitArray.includes(bumper)) {
      bumperHitArray.push(bumper);
      bumper.render.fillStyle = COLOR.BUMPER_LIT;
      updateScore(currentScore + 10);
    }

    // flash color
    //bumper.render.fillStyle = COLOR.BUMPER_LIT;
    //setTimeout(function() {
    //	bumper.render.fillStyle = COLOR.BUMPER;
    //}, 100);
  }

  function dropPinball() {
    pinballDropped = true;
    Matter.Body.setStatic(pinball, false);
    $(".button-start").prop("disabled", true);
    $(".button-reset").prop("disabled", false);
  }

  function resetScene() {
    pinballDropped = false;
    Matter.Body.setStatic(pinball, true);
    resetBumper();
    updateScore(0);
    
    render.bounds.min.y = 0;
    render.bounds.max.y = RENDER_SIZE.y;
    
    $(".button-start").prop("disabled", false);
    $(".button-reset").prop("disabled", true);
  }

  function resetBumper() {
    bumperHitArray.forEach(function(bumper) {
      bumper.render.fillStyle = COLOR.BUMPER;
    });
    bumperHitArray = Array();
  }

  function updateScore(newCurrentScore) {
    currentScore = newCurrentScore;
    $currentScore.text(currentScore);

    highScore = Math.max(currentScore, highScore);
    $highScore.text(highScore);
  }

  // matter.js has a built in random range function, but it is deterministic
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  // outer edges of pinball table
  function boundary(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: COLOR.OUTER
      }
    });
  }

  /*
  // bodies created from SVG paths
  function path(x, y, path) {
    let vertices = Matter.Vertices.fromPath(path);
    return Matter.Bodies.fromVertices(x, y, vertices, {
      isStatic: true,
      render: {
        fillStyle: COLOR.OUTER,

        // add stroke and line width to fill in slight gaps between fragments
        strokeStyle: COLOR.OUTER,
        lineWidth: 1
      }
    });
  }
  */

  // round bodies that repel pinball
  function bumper(x, y) {
    var bumper = Matter.Bodies.circle(x, y, BUMPER_RADIUS, {
      label: "bumper",
      isStatic: true,
      render: {
        fillStyle: COLOR.BUMPER
      }
    });

    // for some reason, restitution is reset unless it's set after body creation
    bumper.restitution = BUMPER_BOUNCE;

    return bumper;
  }

  // contact with these bodies causes pinball to be relaunched
  function finishLine(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      label: "finishLine",
      isStatic: true,
      render: {
        fillStyle: "#fff"
      }
    });
  }

  window.addEventListener("load", load, false);
})();