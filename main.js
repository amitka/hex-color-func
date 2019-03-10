
function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  //return "hsl(" + h + "," + s + "%," + l + "%)";
  return {"hue": h, "sat": s, "light": l};
}
function HSLToHex(h,s,l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}
//
const inp = document.querySelector("#hexInput");
const btn = document.querySelector("#calcBtn");
const out = document.querySelector(".output");
const r1 = document.querySelector("#radio1");
const r2 = document.querySelector("#radio2");
const amt = document.querySelector("#amount");
const colorFunc = {"lighten": true, "darken": false};
const steps = 10;

addColorItem = (hsl, hex) => {
  const el = document.createElement("div");
  el.className = "color-item";
  el.style.backgroundColor = hsl;
  el.innerHTML=`<span>${hsl}%</span><span>${hex}</span>`;
  out.appendChild(el);
}

genPalette = (val) => {
  // CLEAR ALL
  if (out.children.length > 0){
    out.innerHTML = '';
  }
  // CONVERT TO HSL
  const colorObj = hexToHSL(val);
  console.log(colorObj);
  // SELECT COLOR FUNC
  let _lightness = null;
  if (colorFunc.lighten){
    _lightness = Math.ceil(colorObj["light"] + (colorObj["light"] * (amt.value / 100)));
  }
  else{
    _lightness = Math.ceil(colorObj["light"] - (colorObj["light"] * (amt.value / 100)));
  }
  // NEW HSL COLOR
  let _color = "hsl(" + colorObj["hue"] + "," + colorObj["sat"] + "%," + _lightness + "%)";
  // GET ITS HEX VAL
  let _hex = HSLToHex(colorObj["hue"], colorObj["sat"], _lightness);
  console.log(_color);
  console.log(_hex);  

  addColorItem(_color, _hex);

  // const head = document.createElement("div");
  // head.innerHTML = "<span>Lightness</span><span>HEX</span>";
  // head.className = "color-item";
  // out.appendChild(head);

  // for(let i = 0; i < steps; i++){
  //   const el = document.createElement("div");
  //   const lightness = ( i + 1 ) * steps;
  //   let color = "hsl(" + colorObj["hue"] + "," + colorObj["sat"] + "%," + lightness + "%)";
  //   let hex = HSLToHex(colorObj["hue"], colorObj["sat"], lightness);
  //   el.innerHTML=`<span>${lightness}%</span><span>${hex}</span>`;
  //   el.style.backgroundColor = color;
  //   el.className = "color-item"
  //   out.appendChild(el);
  // }
}

switchColorFunc = (event) => {
  //console.log(event.target.value);
  switch (event.target.value){
    case"lighten":
      colorFunc.lighten = true;
      colorFunc.darken  = false;
    break;

    case "darken":
      colorFunc.lighten = false;
      colorFunc.darken  = true;
    break;

  }
}

btn.addEventListener("click", function(){
  const val = inp.value;
  if (val !== null && val !== ''){
    genPalette(val);
  }
});

r1.addEventListener("click", function (e){
  switchColorFunc(e);
})

r2.addEventListener("click", function (e){
  switchColorFunc(e);
})