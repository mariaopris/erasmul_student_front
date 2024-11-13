let design_frequency = 0; //freq
let no_turns = 0; //turns
let length_of_one_turn = 0; //nrwavel
let bending_radius = 0; //wrad
let conductor_diameter = 0 //wdiam
let width_height_ratio = 0 //ratio

// results
let wavelength = 0; //wavel
let compensated_wavelength = 0; //wavelc
let bending_correction = 0; //bcorr
let optimum_diameter = 0; //optdiam

//larger loop
let total_length = 0; //total1
let vertical_separator = 0; //vert1
let total_compensated_length = 0; //total1c
let compensated_vertical_separation = 0; //vert1c
let antenna_height = 0; //height1
let internal_diameter = 0; //idiam1
let horizontal_separator = 0; //rad1;
let compensated_horiz_separation = 0; //rad1c

//smaller loop
let total_length_sm = 0; //total2
let vertical_tube = 0; //vert2
let compensated_total_length = 0; //total2c
let compensated_vertical_tube = 0; //vert2c
let antenna_height_sm = 0; //height2
let internal_diameter_sm = 0; //idiam2
let horizontal_separator_sm = 0; //rad2;
let compensated_horiz_separation_sm = 0; //rad2c


function deltal(diam) {
  let tbl = [1.045, 1.053, 1.060, 1.064, 1.068, 1.070, 1.070, 1.071,
    1.071, 1.070, 1.070, 1.070, 1.070, 1.069, 1.069, 1.068,
    1.067];
  let intv = parseInt(diam);
  return (tbl[intv] + (tbl[intv+1]-tbl[intv])*(diam-intv))
}


function compute() {
  wavelength = 300000/design_frequency;
  // wavelength = parseInt(wavelength*10)/10;

  wd_eff = conductor_diameter;
  if(conductor_diameter > 15) {
    wd_eff = 15;
  }
  compensated_wavelength = wavelength * deltal(wd_eff);

  bending_correction = 2 * bending_radius - Math.PI * bending_radius/2;

  optimum_diameter = 0.0088 * compensated_wavelength;

  total_length = compensated_wavelength * 1.026;

  total_compensated_length = Number(total_length) + 4 * bending_correction;

  horizontal_separator = 0.5 * total_compensated_length /
    (1 + Math.sqrt(1/Math.pow(width_height_ratio,2) + Math.pow(no_turns*Math.PI,2)));

  vertical_separator = (total_compensated_length - 2 * horizontal_separator)/2;
  antenna_height = horizontal_separator / width_height_ratio;
  compensated_vertical_separation = vertical_separator-2*bending_radius;
  internal_diameter = horizontal_separator-conductor_diameter;
  compensated_horiz_separation = horizontal_separator-2*bending_radius;
  // document.getElementById('height1val').value = parseInt(height1*10)/10;

  total_length_sm = compensated_wavelength * 0.975;
  compensated_total_length = Number(total_length_sm) + 4*bending_correction;
  horizontal_separator_sm = 0.5 * compensated_total_length /
    (1 + Math.sqrt(1/Math.pow(width_height_ratio,2) + Math.pow(no_turns*Math.PI,2)));
  vertical_tube = (compensated_total_length - 2*horizontal_separator_sm)/2;
  antenna_height_sm = horizontal_separator_sm / width_height_ratio;
  compensated_horiz_separation_sm = horizontal_separator_sm-2*bending_radius;
  compensated_vertical_tube = vertical_tube-2*bending_radius;
  internal_diameter_sm = horizontal_separator_sm-conductor_diameter;
}
