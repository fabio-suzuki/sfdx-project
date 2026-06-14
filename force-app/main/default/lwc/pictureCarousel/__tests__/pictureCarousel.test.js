import { createElement } from "lwc";
import PictureCarousel from "c/pictureCarousel";

const MOCK_SLIDES = [
  "https://example.com/img1.jpg",
  "https://example.com/img2.jpg",
  "https://example.com/img3.jpg"
];

describe("c-picture-carousel", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  function createComponent(slides = MOCK_SLIDES) {
    const element = createElement("c-picture-carousel", {
      is: PictureCarousel
    });
    element.slides = slides;
    document.body.appendChild(element);
    return element;
  }

  it("renders slides from the slides property", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const slides = element.shadowRoot.querySelectorAll(".slide");
      expect(slides.length).toBe(3);
    });
  });

  it("renders the gallery container", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const gallery = element.shadowRoot.querySelector(".gallery");
      expect(gallery).not.toBeNull();
    });
  });

  it("renders prev and next buttons", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const buttons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      expect(buttons.length).toBe(2);
    });
  });

  it("disables prev button at the first slide", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const buttons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      const prevButton = buttons[0];
      expect(prevButton.disabled).toBe(true);
    });
  });

  it("does not disable next button when more slides exist", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const buttons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      const nextButton = buttons[1];
      expect(nextButton.disabled).toBe(false);
    });
  });

  it("advances to the next slide on next click", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        buttons[1].click();
      })
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        const prevButton = buttons[0];
        expect(prevButton.disabled).toBe(false);
      });
  });

  it("goes back to the previous slide on prev click", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        buttons[1].click();
      })
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        buttons[0].click();
      })
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        expect(buttons[0].disabled).toBe(true);
      });
  });

  it("disables next button at the last slide", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        buttons[1].click();
      })
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        buttons[1].click();
      })
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        expect(buttons[1].disabled).toBe(true);
      });
  });

  it("does not advance past the last slide", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        buttons[1].click();
        buttons[1].click();
        buttons[1].click();
      })
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        expect(buttons[1].disabled).toBe(true);
      });
  });

  it("does not go before the first slide", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        buttons[0].click();
      })
      .then(() => {
        const buttons = element.shadowRoot.querySelectorAll(
          "lightning-button-icon"
        );
        expect(buttons[0].disabled).toBe(true);
      });
  });

  it("handles an empty slides array", () => {
    const element = createComponent([]);

    return Promise.resolve().then(() => {
      const slides = element.shadowRoot.querySelectorAll(".slide");
      expect(slides.length).toBe(0);
    });
  });

  it("handles a single slide", () => {
    const element = createComponent(["https://example.com/only.jpg"]);

    return Promise.resolve().then(() => {
      const slides = element.shadowRoot.querySelectorAll(".slide");
      expect(slides.length).toBe(1);

      const buttons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );
      expect(buttons[0].disabled).toBe(true);
      expect(buttons[1].disabled).toBe(true);
    });
  });

  it("renders the filmstrip container", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const filmstrip = element.shadowRoot.querySelector(".filmstrip");
      expect(filmstrip).not.toBeNull();
    });
  });
});
