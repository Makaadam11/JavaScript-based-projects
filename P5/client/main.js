let socket = io("ws://127.0.0.1:8080", {
  transports: ["websocket"],
  pingInterval: 30000,
  pingTimeout: 10000,
});

let light, temperature, humidity, co2;
let humiditySystem, co2System;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize particle systems
  humiditySystem = new ParticleSystem(createVector(width / 2, 0), color(0, 0, 255));
  co2System = new ParticleSystem(createVector(width / 2, height / 2), color(0, 255, 0));

  //socket receives data_array object from server
  socket.on("data_array", (values) => {
    try {
      // Combine elements in values array into a string and parse as JSON
      let string_obj = values.join(",");
      let obj = JSON.parse(string_obj);

      co2 = obj.rco2;
      console.log(co2);

      humidity = obj.rhum;
      console.log(humidity);

      light = obj.light;
      console.log(light);

      temperature = obj.atmp;
      console.log(temperature);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });
}

function draw() {
  displayLegend();

  let colorScale = [
    { temp: -50, col: color(0, 0, 255) }, // Deep blue
    { temp: -30, col: color(0, 0, 255) }, // Blue
    { temp: -10, col: color(0, 128, 128) }, // Blueish-green
    { temp: 0, col: color(0, 255, 0) }, // Green
    { temp: 10, col: color(173, 255, 47) }, // Yellowish-green
    { temp: 20, col: color(255, 255, 0) }, // Yellow
    { temp: 30, col: color(255, 165, 0) }, // Orange
    { temp: 40, col: color(255, 69, 0) }, // Red
    { temp: 60, col: color(139, 0, 0) }, // Deep red
  ];

  let low, high;
  for (let i = 0; i < colorScale.length - 1; i++) {
    if (temperature >= colorScale[i].temp && temperature <= colorScale[i + 1].temp) {
      low = colorScale[i];
      high = colorScale[i + 1];
      break;
    }
  }

  // Check if low and high are defined
  if (!low || !high) {
    return;
  }

  // Calculate the interpolation factor
  let t = map(temperature, low.temp, high.temp, 0, 1);
  // Interpolate the color
  let bgColor = lerpColor(low.col, high.col, t);

  colorMode(HSB);
  let h = hue(bgColor);
  let s = saturation(bgColor);
  let b = brightness(bgColor);

  // Map the light value to a small adjustment in brightness
  let lightAdjustment = map(light, 0, 255, -10, 10);

  // Adjust the brightness by a small amount based on the light value
  let newBrightness = constrain(b + lightAdjustment, 0, 1000);

  // Create a new color with the same hue and saturation, but with the new brightness
  let newColor = color(h, s, newBrightness);
  console.log(newColor);

  // Set the background color
  background(newColor);

  colorMode(RGB);
  // Use humidity to add rain particles
  for (let i = 0; i < humidity; i++) {
    humiditySystem.addParticleHumidity();
  }
  humiditySystem.run();

  // Use co2 to add green particles
  for (let i = 0; i < co2; i++) {
    co2System.addParticleCo2();
  }
  co2System.run();

  displayLegend();
}

function displayLegend() {
  fill(255);
  rect(10, 10, 300, 240, 10); // Background for the legend
  fill(0);
  textSize(12);
  textAlign(LEFT);
  text("Air Quality Legend", 110, 30);

  // Get the current date and time
  let now = new Date();

  // Format the date and time as a string
  let dateTimeString = now.toLocaleString();

  // Set the text size and color

  // Display the date and time on the canvas
  if (dateTimeString.length > 0) {
    text(`Date and time: ${dateTimeString}`, 20, 50);
  } else {
    text("Date: Loading data..", 10, 50);
  }
  if (co2 !== undefined) {
    // Set the fill color to green
    fill(0, 255, 0);

    // Display CO2 info
    text(`CO2: ${co2} ppm`, 20, 70);
    if (co2 < 1000) {
      text("Good: 400-1,000 ppm", 20, 90);
    } else if (co2 < 2000 && co2 >= 1000) {
      text("Moderate: 1,000-2,000 ppm", 20, 90);
    } else if (co2 >= 2000) {
      text("Poor: >2,000 ppm", 20, 90);
    }

    // Reset the fill color to white (or any other color you want)
  } else {
    text("CO2: Loading data..", 20, 70);
  }

  // Display Humidity info
  if (humidity !== undefined) {
    fill(0, 0, 255);

    text(`Humidity: ${humidity.toFixed(2)}%`, 20, 110);
    if (humidity < 30) {
      text("Too dry: <30%", 20, 130);
    } else if (humidity <= 50) {
      text("Comfortable: 30-50%", 20, 130);
    } else {
      text("High: >50%", 20, 130);
    }
  } else {
    text("Humidity: Loading data..", 20, 110);
  }

  if (light !== undefined) {
    fill(0, 0, 0);
    text(`Light: ${light} lux`, 20, 150);
    if (light > 0.0001 && light <= 1) {
      text("Moonlight: 0.0001 - 1 lux", 20, 170);
    } else if (light > 1 && light <= 10) {
      text("Dark room: 10 - 50 lux", 20, 170);
    } else if (light > 10 && light <= 50) {
      text("Living room: 50 - 300 lux", 20, 170);
    } else if (light > 50 && light <= 300) {
      text("Office: 300 - 500 lux", 20, 170);
    } else if (light > 300 && light <= 500) {
      text("Supermarket: 500 - 1,000 lux", 20, 170);
    } else if (light > 500 && light <= 1000) {
      text("Overcast day: 1,000 - 5,000 lux", 20, 170);
    } else if (light > 1000) {
      text("Very bright: > 1,000 lux", 20, 170);
    }
  } else if (light === undefined) {
    text("Light: Loading data..", 20, 150);
  }

  if (temperature !== undefined) {
    text("Temperature: " + temperature + "°C", 20, 190);
  } else if (temperature === undefined) {
    text("Temperature: Loading data..", 20, 190);
  }
  text("Particles amount is defined by parameter value.", 20, 210);
  text("Background colour is defined by temerature and light.", 20, 230);
}

class Particle {
  constructor(position, color) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255;
    this.color = color;
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }

  display() {
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

class ParticleSystem {
  constructor(position, color) {
    this.origin = position.copy();
    this.particles = [];
    this.color = color;
    this.counter = 0; // Add a counter
  }

  addParticleHumidity() {
    // Only add a new particle every 10th call to addParticle()
    if (this.counter % 100 === 0) {
      // Randomize the x-coordinate of the origin
      this.origin.x = random(0, width);
      // Set the y-coordinate to the top of the screen
      this.origin.y = 0;
      this.particles.push(new Particle(this.origin, this.color));
    }
    this.counter++;
  }

  addParticleCo2() {
    // Only add a new particle every 50th call to addParticle()
    if (this.counter % 1000 === 0) {
      // Randomize the x and y coordinates of the origin
      this.origin.x = random(0, width);
      this.origin.y = random(0, height);
      this.particles.push(new Particle(this.origin, this.color));
    }
    this.counter++;
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}
