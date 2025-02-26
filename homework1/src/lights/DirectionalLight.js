class DirectionalLight {

    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2, 0));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate, scale) {
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // Model transform
        // let p2 = vec3.fromValues(-this.lightPos[0], -this.lightPos[1], -this.lightPos[2]);
        // mat4.translate(modelMatrix, modelMatrix, p2);
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.scale(modelMatrix, modelMatrix, scale);

        // View transform
        // let zDir = vec3.fromValues(-(this.focalPoint[0] - this.lightPos[0]), -(this.focalPoint[1], - this.lightPos[1]), -(this.focalPoint[2] - this.lightPos[2]));
        // vec3.normalize(zDir, zDir);

        // let yDir = vec3.fromValues(this.lightUp[0], this.lightUp[1], this.lightUp[2]);
        // vec3.normalize(yDir, yDir);

        // let xDir = vec3.create();
        // vec3.cross(xDir, yDir, zDir);
        // vec3.normalize(xDir, xDir);

        // vec3.cross(yDir, zDir, xDir);
        // vec3.normalize(yDir, yDir);

        
        // viewMatrix = mat4.fromValues(
        //     xDir[0], xDir[1], xDir[2], 0,
        //     yDir[0], yDir[1], yDir[2], 0,
        //     zDir[0], zDir[1], zDir[2], 0,
        //     0, 0, 0, 1
        // );

        // viewMatrix = mat4.fromValues(
        //     xDir[0], yDir[0], zDir[0], 0,
        //     xDir[1], yDir[1], zDir[1], 0,
        //     xDir[2], yDir[2], zDir[2], 0,
        //     0, 0, 0, 1
        // );

        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);

        // console.log(this.lightPos);
        // console.log(xDir);
        // console.log(yDir);
        // console.log(zDir);

   
        // Projection transform
        // mat4.perspective(projectionMatrix, Math.PI / 2, 1.0, 0.1, 500)

        mat4.ortho(projectionMatrix, -200, 200, -200, 200, 0.1, 300);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        console.log(lightMVP);


        return lightMVP;
    }
}
