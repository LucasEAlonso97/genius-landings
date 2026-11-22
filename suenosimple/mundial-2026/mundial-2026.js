// 1. Contador regresivo simple para el "Match Sale"
function iniciarContador() {
  const elementoContador = document.getElementById('countdown');
  if (!elementoContador) return;

  // Simulamos 2 días y 14 horas desde que el usuario entra
  let segundosRestantes = (2 * 86400) + (14 * 3600) + (35 * 60);

  setInterval(() => {
    if (segundosRestantes <= 0) return;
    segundosRestantes--;

    const dias = Math.floor(segundosRestantes / 86400);
    const horas = Math.floor((segundosRestantes % 86400) / 3600);
    const minutos = Math.floor((segundosRestantes % 3600) / 60);
    const segundos = segundosRestantes % 60;

    elementoContador.textContent = 
      `${String(dias).padStart(2, '0')}d : ${String(horas).padStart(2, '0')}h : ${String(minutos).padStart(2, '0')}m : ${String(segundos).padStart(2, '0')}s`;
  }, 1000);
}

// 2. Conexión del formulario con Landing CRM (Node/Express en puerto 3000)
const form = document.getElementById('lead-form');
const feedback = document.getElementById('form-feedback');
const submitBtn = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    // Validación mínima antes de enviar
    if (!nombre || !email.includes('@') || whatsapp.length < 8) {
      feedback.style.color = '#dc2626';
      feedback.textContent = 'Por favor completá todos los campos con datos válidos.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      // IMPORTANTE: Confirmar con Backend en Swagger (localhost:3000/api-docs)
      // la ruta exacta y si el campo teléfono se llama "whatsapp" o "telefono".
      const response = await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          telefono: whatsapp,
          cliente: 'SueñoSimple',
          campana: 'Mundial 2026'
        })
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      feedback.style.color = '#16a34a';
      feedback.textContent = '¡Listo! Ya tenés acceso anticipado a las ofertas del Match Sale.';
      form.reset();
    } catch (error) {
      feedback.style.color = '#dc2626';
      feedback.textContent = 'No pudimos registrar tu solicitud ahora. Probá de nuevo en unos minutos.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Quiero mi descuento mundial';
    }
  });
}

iniciarContador();