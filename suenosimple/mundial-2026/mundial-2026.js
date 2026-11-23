document.addEventListener('DOMContentLoaded', () => {
  // 1. Selector de medidas en Oferta destacada
  const sizeButtons = document.querySelectorAll('.size-btn');
  const priceListEl = document.getElementById('priceList');
  const priceMainEl = document.getElementById('priceMain');
  const priceInstallmentEl = document.getElementById('priceInstallment');
  const selectedSummaryEl = document.getElementById('selectedSummary');
  const btnComprar = document.getElementById('btnComprar');

  let selectedSize = '1 plaza';
  let selectedPrice = '130.000';

  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      selectedSize = btn.dataset.size;
      selectedPrice = btn.dataset.price;

      priceListEl.textContent = `$ ${btn.dataset.list}`;
      priceMainEl.textContent = selectedPrice;
      priceInstallmentEl.textContent = btn.dataset.installment;
      selectedSummaryEl.innerHTML = `Medida seleccionada: <strong>${selectedSize}</strong> ($ ${selectedPrice})`;
    });
  });

  // Botón Comprar desplaza suavemente al formulario de reserva
  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      document.getElementById('reserva').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('nombre').focus();
    });
  }

  // 2. Acordeón de Preguntas Frecuentes
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-icon');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      questionBtn.setAttribute('aria-expanded', isOpen);
      icon.textContent = isOpen ? '−' : '+';
    });
  });

  // 3. Envío del formulario a Landing CRM (POST /api/landings/{id}/leads)
  const leadForm = document.getElementById('leadForm');
  const feedbackEl = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  // Cambiar este ID cuando Backend confirme el ID definitivo de Mundial 2026
  const LANDING_ID = 1;

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();

      feedbackEl.textContent = 'Enviando solicitud...';
      feedbackEl.className = 'form-feedback';
      submitBtn.disabled = true;

      try {
        const response = await fetch(`http://localhost:3000/api/landings/${LANDING_ID}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nombre,
            email: email,
            phone: whatsapp,
            message: `Match Sale Mundial 2026 - Colchón Económica Pro (${selectedSize})`
          })
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        feedbackEl.textContent = '¡Listo! Ya reservamos tu descuento del Match Sale. Te contactamos a la brevedad.';
        feedbackEl.classList.add('ok');
        leadForm.reset();
      } catch (error) {
        feedbackEl.textContent = 'No pudimos conectar con el servidor. Verificá que Landing CRM esté encendido en el puerto 3000.';
        feedbackEl.classList.add('error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});