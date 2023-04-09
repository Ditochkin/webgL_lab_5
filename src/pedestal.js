let gl = null;

function initWebGl(canvas)
{
    gl = canvas.getContext("webgl");

    if (!gl)
    {
        console.log("WebGL not supported")
        gl = canvas.getContext("experimental-webgl");
    }

    if (!gl)
    {
        alert("Your browser does not support WebGL");
    }

    gl.clearColor(0.95, 0.95, 0.95, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function loadShader(gl, type, source)
{
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error! Shader compile status ", gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

function initShaderProgram(gl, vsSource, fsSource)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        console.error("Error! Link program", gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.validateProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS))
    {
        console.error("Error! validate program", gl.getProgramInfoLog(shaderProgram));
        return;
    }

    return shaderProgram;
}

function initBuffersCube() 
{
	let squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	let vertices = 
    [ // X, Y, Z           R, G, B
		// Front
		-0.5, -0.5, -0.5,   0, 0, // 3
		-0.5, 0.5, -0.5,    0, 1, // 1
		0.5, 0.5, -0.5,     1, 1, // 2

        -0.5, -0.5, -0.5,   0, 0, // 3
		0.5, 0.5, -0.5,     1, 1, // 2
        0.5, -0.5, -0.5,     1, 0, // 4

        // Top
        -0.5, 0.5, -0.5,    0, 0, // 1
        -0.5, 0.5, 0.5,    0, 1, // 5
        0.5, 0.5, 0.5,     1, 1, // 6

        -0.5, 0.5, -0.5,    0, 0, // 1
        0.5, 0.5, -0.5,     1, 0, // 2
        0.5, 0.5, 0.5,     1, 1, // 6

        // Bottom
        -0.5, -0.5, -0.5,   0, 1, // 3
		0.5, -0.5, 0.5,     1, 0, // 8
        0.5, -0.5, -0.5,     1, 1, // 4

        -0.5, -0.5, -0.5,   0, 1, // 3
		0.5, -0.5, 0.5,     1, 0, // 8
        -0.5, -0.5, 0.5,   0, 0, // 7

        // Left
        -0.5, -0.5, -0.5,   1, 0, // 3
		-0.5, 0.5, -0.5,    1, 1, // 1
        -0.5, -0.5, 0.5,   0, 0, // 7

        -0.5, 0.5, 0.5,    0, 1, // 5
		-0.5, 0.5, -0.5,    1, 1, // 1
        -0.5, -0.5, 0.5,   0, 0, // 7

        //Right
        0.5, 0.5, -0.5,     0, 1, // 2
		0.5, -0.5, 0.5,     1, 0, // 8
        0.5, -0.5, -0.5,     0, 0, // 4

        0.5, 0.5, -0.5,     0, 1, // 2
		0.5, -0.5, 0.5,     1, 0, // 8
        0.5, 0.5, 0.5,     1, 1, // 6

        //Back
        -0.5, 0.5, 0.5,    1, 1, // 5
		0.5, 0.5, 0.5,     0, 1, // 6
        -0.5, -0.5, 0.5,   1, 0, // 7

        0.5, -0.5, 0.5,     0, 0, // 8
		0.5, 0.5, 0.5,     0, 1, // 6
        -0.5, -0.5, 0.5,   1, 0, // 7
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function enableVertexAttrib(shaderProgram, attributeName, size, stride, offset)
{
    let attribLocation = gl.getAttribLocation(shaderProgram, attributeName);
    gl.vertexAttribPointer(
        attribLocation,
        size,
        gl.FLOAT,
        false,
        stride * Float32Array.BYTES_PER_ELEMENT,
        offset * Float32Array.BYTES_PER_ELEMENT
    );

    return attribLocation;
}

const toRadians = (degree) =>
{
    return degree * (Math.PI / 180);
}

function creatingTexture(img)
{
    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    gl.texImage2D
    (
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        document.getElementById(img)
    );

    return boxTexture
}