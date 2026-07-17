export const MAKE_OPTIONS = [
  "Aprilia", "Benelli", "Beta", "BMW", "Can-Am", "CFMoto", "Ducati",
  "Harley-Davidson", "Honda", "Husqvarna", "Indian", "Kawasaki", "KTM",
  "Moto Guzzi", "Royal Enfield", "Suzuki", "Triumph", "Yamaha", "Zero",
] as const;

export const MODELS_BY_MAKE: Record<string, string[]> = {
  "Aprilia":         ["RS 660", "Tuono 660", "RSV4", "Tuono V4", "Dorsoduro 900", "Shiver 900"],
  "Benelli":         ["TRK 502", "Leoncino 500", "752S", "302R", "TNT 600"],
  "Beta":            ["RR 125", "RR 250", "RR 300", "RR 350", "RR 430", "RR 480", "Xtrainer 300"],
  "BMW":             ["R 1250 GS", "R 1250 RT", "S 1000 RR", "S 1000 XR", "F 900 R", "F 900 XR", "F 850 GS", "G 310 R", "G 310 GS", "R nineT", "M 1000 RR", "K 1600 GT"],
  "Can-Am":          ["Ryker 600", "Ryker 900", "Spyder F3", "Spyder F3-S", "Spyder RT"],
  "CFMoto":          ["300NK", "400NK", "650NK", "650MT", "700CL-X", "800MT"],
  "Ducati":          ["Panigale V4", "Panigale V2", "Monster", "Multistrada V4", "Diavel V4", "Scrambler Icon", "SuperSport 950", "Hypermotard 950", "DesertX", "Streetfighter V4"],
  "Harley-Davidson": ["Street Glide", "Road King", "Road Glide", "Sportster S", "Iron 883", "Fat Boy", "Softail Standard", "Street Bob", "Low Rider S", "Pan America 1250", "Nightster", "Ultra Limited"],
  "Honda":           ["CBR600RR", "CBR1000RR-R", "CB500F", "CB650R", "CB1000R", "Africa Twin", "Gold Wing", "Rebel 500", "Rebel 1100", "NC750X", "CRF300L", "Shadow Phantom"],
  "Husqvarna":       ["Vitpilen 401", "Svartpilen 401", "Norden 901", "FC 250", "FC 350", "FC 450", "TC 250"],
  "Indian":          ["Scout", "Scout Bobber", "Chief", "Chief Bobber", "Challenger", "Pursuit", "Roadmaster", "Springfield", "FTR 1200"],
  "Kawasaki":        ["Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R", "Z400", "Z650", "Z900", "Versys 650", "Versys 1000", "KLR 650", "Vulcan 900", "Z125 Pro"],
  "KTM":             ["Duke 390", "Duke 790", "Duke 890", "Duke 1290 R", "RC 390", "Adventure 390", "Adventure 790", "Adventure 890", "Adventure 1290 S", "1290 Super Duke R"],
  "Moto Guzzi":      ["V7 Stone", "V7 Special", "V9 Bobber", "V9 Roamer", "V85 TT", "California 1400"],
  "Royal Enfield":   ["Bullet 350", "Classic 350", "Meteor 350", "Himalayan", "Interceptor 650", "Continental GT 650", "Hunter 350"],
  "Suzuki":          ["GSX-R600", "GSX-R750", "GSX-R1000", "GSX-S750", "GSX-S1000", "SV650", "V-Strom 650", "V-Strom 1050", "Hayabusa", "Boulevard M109R", "DR-Z400S"],
  "Triumph":         ["Street Triple R", "Street Triple RS", "Speed Triple 1200", "Tiger 900", "Tiger 1200", "Bonneville T100", "Bonneville T120", "Scrambler 900", "Scrambler 1200", "Rocket 3 R", "Trident 660"],
  "Yamaha":          ["YZF-R1", "YZF-R3", "YZF-R7", "MT-03", "MT-07", "MT-09", "MT-10", "Tenere 700", "Tracer 9", "VMAX", "V-Star 950", "Bolt"],
  "Zero":            ["SR/F", "SR/S", "FXE", "DSR/X", "S", "DS", "FX"],
};
