const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');

// Emulador exacto y matemático de Python Turtle
class PythonTurtle {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;
        this.y = 0;
        this.heading = 0; // 0 grados = Este
        this.penDown = true;
        this.penColor = "#ffd700";
        this.fillColor = "brown";
    }

    // Convierte las coordenadas matemáticas (X derecha, Y arriba) a la pantalla del navegador
    cX(x) { return this.width / 2 + x; }
    cY(y) { return this.height / 2 - y; }

    goto(x, y) {
        if (this.penDown) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.cX(this.x), this.cY(this.y));
            this.ctx.lineTo(this.cX(x), this.cY(y));
            this.ctx.strokeStyle = this.penColor;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        this.x = x;
        this.y = y;
    }

    rt(angle) { this.heading -= angle; }
    lt(angle) { this.heading += angle; }
    penup() { this.penDown = false; }
    pendown() { this.penDown = true; }
    color(c) { this.penColor = c; }
    fillcolor(c) { this.fillColor = c; }
    setheading(h) { this.heading = h; }

    circle(radius, extent = 360) {
        let rad = this.heading * Math.PI / 180;
        // Calcula el centro geométrico según la lógica exacta de Python Turtle
        let cx = this.x + radius * Math.cos(rad + Math.PI / 2);
        let cy = this.y + radius * Math.sin(rad + Math.PI / 2);

        let startAngle = Math.atan2(this.y - cy, this.x - cx);
        let extentRad = extent * Math.PI / 180;
        
        // Aproximación de dibujo paso a paso idéntica a Python
        let steps = Math.max(15, Math.floor(Math.abs(extent) / 2)); 
        let stepExtent = extentRad / steps;
        
        if (this.penDown) this.ctx.beginPath();
        if (this.penDown) this.ctx.moveTo(this.cX(this.x), this.cY(this.y));
        
        for (let k = 1; k <= steps; k++) {
            let currentAngle = radius > 0 ? startAngle + stepExtent * k : startAngle - stepExtent * k;
            let nextX = cx + Math.abs(radius) * Math.cos(currentAngle);
            let nextY = cy + Math.abs(radius) * Math.sin(currentAngle);
            if (this.penDown) this.ctx.lineTo(this.cX(nextX), this.cY(nextY));
        }
        
        if (this.penDown) {
            this.ctx.strokeStyle = this.penColor;
            this.ctx.stroke();
        }
        
        // Actualiza matemáticamente la posición y dirección final
        this.x = cx + Math.abs(radius) * Math.cos(radius > 0 ? startAngle + extentRad : startAngle - extentRad);
        this.y = cy + Math.abs(radius) * Math.sin(radius > 0 ? startAngle + extentRad : startAngle - extentRad);
        
        // AQUÍ ESTABA EL ERROR: Ahora suma correctamente el ángulo
        this.heading += (radius > 0 ? extent : -extent); 
    }

    stamp() {
        this.ctx.save();
        this.ctx.translate(this.cX(this.x), this.cY(this.y));
        this.ctx.rotate(-this.heading * Math.PI / 180);
        this.ctx.fillStyle = this.fillColor;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.rect(-4, -4, 8, 8);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
}

// Inicializar la tortuga de Python en el lienzo
let t = new PythonTurtle(canvas);

// --- TU CÓDIGO EXACTO EN PYTHON ---
t.goto(0, -40);

let i = 0;
let j = 0;
let drawingCenter = false;
let centerIndex = 0;

function runPythonCode() {
    if (!drawingCenter) {
        if (i < 16) {
            for (let step = 0; step < 6 && j < 300; step++) {
                t.color("#ffd700");
                t.rt(90);
                t.circle(150 - j * 6, 90);
                t.lt(90);
                t.circle(150 - j * 6, 90);
                t.rt(180);
                j++;
            }
            if (j >= 18) {
                t.circle(40, 24);
                j = 0;
                i++;
            }
            requestAnimationFrame(runPythonCode);
        } else {
            t.color("black");
            t.fillcolor("brown");
            drawingCenter = true;
            requestAnimationFrame(runPythonCode);
        }
    } else {
        const phi = 137.508 * (Math.PI / 180.0);

        if (centerIndex < 200) {
            for (let step = 0; step < 6 && centerIndex < 200; step++) {
                let r = 4 * Math.sqrt(centerIndex);
                let theta = centerIndex * phi;
                let x = r * Math.cos(theta);
                let y = r * Math.sin(theta);
                t.penup();
                t.goto(x, y);
                t.setheading(centerIndex * 137.508);
                t.pendown();
                t.stamp();
                centerIndex++;
            }
            requestAnimationFrame(runPythonCode);
        }
    }
}


// Iniciar la animación
requestAnimationFrame(runPythonCode);