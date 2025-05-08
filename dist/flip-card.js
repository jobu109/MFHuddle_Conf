(function () {
  window.createFlipCards = function (container, options = {}) {
    if (!container || !options.cards || !Array.isArray(options.cards)) return;

    const cards = options.cards;
    const selectedBaseJoin = options.selectedBaseJoin; // base digital input join for flipping
    const pressedBaseJoin = options.pressedBaseJoin;   // base digital output join for press

    container.classList.add('flip-cards-wrapper');

    const cardsHTML = cards.map((card, index) => `
      <div class="flip-card-container" data-card-index="${index}">
        <div class="flip-card">
          <div class="card-front">
            <figure>
              <img src="${card.image}" />
              <figcaption>${card.title}</figcaption>
            </figure>
          </div>
          <div class="card-back">
            <ul>
              <li>${card.description}</li>
            </ul>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = cardsHTML;

    const cardElements = container.querySelectorAll('.flip-card-container');

    cardElements.forEach((cardEl, index) => {
      // Flip on click and send digital output
      cardEl.addEventListener('click', () => {
        cardEl.classList.toggle('flipped');

        if (pressedBaseJoin) {
          const join = parseInt(pressedBaseJoin, 10) + index;
          CrComLib.publishEvent('b', join.toString(), true);
          setTimeout(() => {
            CrComLib.publishEvent('b', join.toString(), false);
          }, 100);
        }
      });

      // Listen for digital input (selected)
      if (selectedBaseJoin) {
        const join = parseInt(selectedBaseJoin, 10) + index;
        CrComLib.subscribeState('b', join.toString(), (value) => {
          if (value) {
            cardEl.classList.add('flipped');
          } else {
            cardEl.classList.remove('flipped');
          }
        });
      }
    });
  };
})();
