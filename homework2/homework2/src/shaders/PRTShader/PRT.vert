attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute mat3 aPrecomputeLT;


uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uPrecomputeLR;
uniform mat3 uPrecomputeLG;
uniform mat3 uPrecomputeLB;

varying vec3 vColor;
varying vec3 vNormal;

void main(void) {

  vNormal = (uModelMatrix * vec4(aNormalPosition, 0.0)).xyz;

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *
    vec4(aVertexPosition, 1.0);

  float r = dot(aPrecomputeLT[0], uPrecomputeLR[0]) + dot(aPrecomputeLT[1], uPrecomputeLR[1]) + dot(aPrecomputeLT[2], uPrecomputeLR[2]);
  float g = dot(aPrecomputeLT[0], uPrecomputeLG[0]) + dot(aPrecomputeLT[1], uPrecomputeLG[1]) + dot(aPrecomputeLT[2], uPrecomputeLG[2]);
  float b = dot(aPrecomputeLT[0], uPrecomputeLB[0]) + dot(aPrecomputeLT[1], uPrecomputeLB[1]) + dot(aPrecomputeLT[2], uPrecomputeLB[2]);
  vColor = vec3(r, g, b);
  // vColor = vec3(1.0, 1.0, 1.0);
}