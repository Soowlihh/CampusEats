(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

/*(() => {
  'use strict';

  const attachValidation = () => {
    const forms = document.querySelectorAll('.validated-form');
    console.log('[validateForms] found forms:', forms.length);

    forms.forEach((form) => {
      // avoid double-binding if the script runs twice
      if (form.dataset.validationBound === 'true') return;
      form.dataset.validationBound = 'true';

      form.addEventListener('submit', (event) => {
        const ok = form.checkValidity();
        console.log('[validateForms] submit fired. valid?', ok);

        if (!ok) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, true); // capture phase to beat other handlers
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachValidation);
  } else {
    attachValidation();
  }
})();*/



