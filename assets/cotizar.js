document.addEventListener("DOMContentLoaded", function () {
  // Preseleccionar plan si viene en la URL (?plan=basico|plus|premium)
  var params = new URLSearchParams(window.location.search);
  var planParam = params.get("plan");
  if (planParam) {
    var radio = document.querySelector('input[name="plan"][value="' + planParam + '"]');
    if (radio) radio.checked = true;
  }

  var form = document.getElementById("cotizar-form");
  var msg = document.getElementById("form-msg");
  var submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    msg.className = "form-msg";
    msg.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      var data = new FormData(form);
      var nombre = (data.get("nombre") || "").trim();
      var telefono = (data.get("telefono") || "").trim();
      var whatsapp = (data.get("whatsapp") || "").trim() || telefono;
      var email = (data.get("email") || "").trim() || null;
      var ciudadOrigen = (data.get("ciudad_origen") || "").trim();
      var ciudadDestino = (data.get("ciudad_destino") || "").trim();
      var plan = data.get("plan") || null;
      var fechaEstimada = data.get("fecha_estimada") || null;
      var observaciones = (data.get("observaciones") || "").trim() || null;
      var autorizacion = data.get("autorizacion") === "on";

      if (!nombre || !telefono || !ciudadOrigen || !ciudadDestino) {
        throw new Error("Completa nombre, teléfono, ciudad de origen y ciudad de destino.");
      }
      if (!autorizacion) {
        throw new Error("Debes autorizar el tratamiento de datos personales para continuar.");
      }

      // Subir fotos (opcional)
      var fotosInput = document.getElementById("fotos-input");
      var rutasFotos = [];
      if (fotosInput && fotosInput.files.length) {
        var carpeta = crypto.randomUUID();
        for (var i = 0; i < fotosInput.files.length; i++) {
          var file = fotosInput.files[i];
          var ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          var ruta = carpeta + "/" + Date.now() + "-" + i + "." + ext;
          var up = await fetch(
            SUPABASE_URL + "/storage/v1/object/cotizaciones/" + ruta,
            {
              method: "POST",
              headers: {
                apikey: SUPABASE_PUBLISHABLE_KEY,
                Authorization: "Bearer " + SUPABASE_PUBLISHABLE_KEY,
                "Content-Type": file.type || "image/jpeg",
              },
              body: file,
            }
          );
          if (up.ok) rutasFotos.push(ruta);
        }
      }

      var payload = {
        nombre: nombre,
        telefono: telefono,
        whatsapp: whatsapp,
        email: email,
        origen: { ciudad: ciudadOrigen },
        destino: { ciudad: ciudadDestino },
        es_nacional: ciudadOrigen.toLowerCase() !== ciudadDestino.toLowerCase(),
        inventario: {},
        plan: plan,
        servicios_adicionales: data.getAll("servicios_adicionales"),
        fecha_estimada: fechaEstimada || null,
        horario_preferido: data.get("horario_preferido") || null,
        observaciones: observaciones,
        fotos: rutasFotos,
      };

      var res = await fetch(SUPABASE_URL + "/rest/v1/solicitudes_cotizacion", {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: "Bearer " + SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        var errText = await res.text();
        throw new Error("No se pudo enviar la solicitud (" + res.status + "). " + errText);
      }

      msg.className = "form-msg ok";
      msg.textContent = "¡Listo! Recibimos tu solicitud. Te contactaremos pronto. También puedes continuar por WhatsApp para agilizar la respuesta.";
      form.reset();
      submitBtn.textContent = "Enviar solicitud";
      submitBtn.disabled = false;

      var waBtn = document.getElementById("wa-continuar");
      if (waBtn) {
        var lineas = [
          "Hola TRANSMUDAR. Acabo de solicitar una cotización desde la página web.",
          "Nombre: " + nombre,
          "Origen: " + ciudadOrigen,
          "Destino: " + ciudadDestino,
          fechaEstimada ? "Fecha: " + fechaEstimada : null,
          "Quisiera recibir información sobre mi cotización.",
        ].filter(Boolean);
        waBtn.href = "https://wa.me/" + BRAND.whatsapp + "?text=" + encodeURIComponent(lineas.join("\n"));
        waBtn.style.display = "inline-flex";
      }
    } catch (err) {
      msg.className = "form-msg error";
      msg.textContent = err.message || "Ocurrió un error al enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar solicitud";
    }
  });
});
