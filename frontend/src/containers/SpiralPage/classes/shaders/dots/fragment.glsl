void main(){
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;
    strength = step(0.01, strength);
    gl_FragColor = vec4(212./255., 152./255., 53./255., strength);
  }