attribute vec4 aPosition;
uniform mat4 t_matrix;
uniform mat4 r_matrix;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  mat4 u_matrix = r_matrix * t_matrix;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition.xy , 0.0, 1.0) * u_matrix;

  // vec3 tes2 = tes * aPosition.xyz;
  // vec3 position = tes * aPosition.xyz;
  // gl_Position =  vec4(position, 0, 1) ;
  // gl_Position =  aPosition + vec4(position,1) ;
  // vec4 newPos = vec4(+0.25, 0, 0, 0);
  // gl_Position =  t_matrix * aPosition;
  gl_PointSize = 10.0;
}
