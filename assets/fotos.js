// Fotos temporales (marcador de posición) mientras se suben las fotos reales.
// Reemplaza estas URLs por rutas reales, por ejemplo "assets/fotos/mi-foto.webp",
// cuando tengas las fotografías del servicio.
function placeholderFoto(categoria, indice) {
  var colores = ["cbd5e1", "bae6fd", "fde68a", "fecaca", "bbf7d0"];
  var color = colores[indice % colores.length];
  var texto = encodeURIComponent(categoria + " " + (indice + 1));
  return "https://placehold.co/800x600/" + color + "/334155?text=" + texto;
}

var FOTOS = [
  { url: placeholderFoto("Proteccion", 0), alt: "Operario de TRANSMUDAR junto a muebles embalados con vinipel antes del traslado", categoria: "Protección" },
  { url: placeholderFoto("Proteccion", 1), alt: "Sofá protegido con plástico vinipel y esquineros durante una mudanza", categoria: "Protección" },
  { url: placeholderFoto("Cargue", 2), alt: "Muebles embalados y apilados de forma organizada para el cargue", categoria: "Cargue" },
  { url: placeholderFoto("Proteccion", 3), alt: "Sofás y sillas protegidos con papel kraft en la sala de un apartamento", categoria: "Protección" },
  { url: placeholderFoto("Proteccion", 4), alt: "Sala completa con muebles protegidos y listos para la mudanza", categoria: "Protección" },
  { url: placeholderFoto("Embalaje", 5), alt: "Silla de comedor embalada y marcada para identificarla en el traslado", categoria: "Embalaje" },
  { url: placeholderFoto("Embalaje", 6), alt: "Mesa de comedor protegida con plástico vinipel sobre el piso", categoria: "Embalaje" },
  { url: placeholderFoto("Embalaje", 7), alt: "Mesa embalada junto al rollo de vinipel usado para protegerla", categoria: "Embalaje" },
  { url: placeholderFoto("Delicados", 8), alt: "Caja de cartón marcada como frágil para transportar un cuadro", categoria: "Muebles delicados" },
  { url: placeholderFoto("Delicados", 9), alt: "Objeto delicado protegido con plástico burbuja dentro de una caja", categoria: "Muebles delicados" },
  { url: placeholderFoto("Delicados", 10), alt: "Elemento frágil envuelto en plástico burbuja y empacado en caja", categoria: "Muebles delicados" },
  { url: placeholderFoto("Transporte", 11), alt: "Furgones acondicionados de TRANSMUDAR listos para una mudanza", categoria: "Transporte" },
];

var FOTO_HERO = FOTOS[0];
var FOTO_CTA = FOTOS[4];
