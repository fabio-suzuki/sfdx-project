import { createElement } from "lwc";
import PictureGalleryCard from "c/pictureGalleryCard";

function findButtonByIcon(root, iconName) {
  const buttons = root.querySelectorAll("lightning-button-icon");
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].iconName === iconName) {
      return buttons[i];
    }
  }
  return null;
}

describe("c-picture-gallery-card", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  function createComponent() {
    const element = createElement("c-picture-gallery-card", {
      is: PictureGalleryCard
    });
    document.body.appendChild(element);
    return element;
  }

  it("renders the lightning-card with correct title", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const card = element.shadowRoot.querySelector("lightning-card");
      expect(card).not.toBeNull();
      expect(card.title).toBe("Picture Gallery");
    });
  });

  it("renders the lightning-card with correct icon", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const card = element.shadowRoot.querySelector("lightning-card");
      expect(card.iconName).toBe("utility:image");
    });
  });

  it("renders the picture carousel child component", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const carousel = element.shadowRoot.querySelector("c-picture-carousel");
      expect(carousel).not.toBeNull();
    });
  });

  it("passes default slides to the carousel", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const carousel = element.shadowRoot.querySelector("c-picture-carousel");
      expect(carousel.slides.length).toBe(3);
      expect(carousel.slides[0]).toContain("living_room.jpg");
      expect(carousel.slides[1]).toContain("eatinkitchen.jpg");
      expect(carousel.slides[2]).toContain("kitchen.jpg");
    });
  });

  it("does not show modal by default", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const modal = element.shadowRoot.querySelector(".slds-modal");
      expect(modal).toBeNull();
    });
  });

  it("shows modal when fullscreen button is clicked", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const expandButton = findButtonByIcon(
          element.shadowRoot,
          "utility:expand"
        );
        expandButton.click();
      })
      .then(() => {
        const modal = element.shadowRoot.querySelector(".slds-modal");
        expect(modal).not.toBeNull();
      });
  });

  it("renders a second carousel inside the modal", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const expandButton = findButtonByIcon(
          element.shadowRoot,
          "utility:expand"
        );
        expandButton.click();
      })
      .then(() => {
        const carousels =
          element.shadowRoot.querySelectorAll("c-picture-carousel");
        expect(carousels.length).toBe(2);
      });
  });

  it("closes modal when close button is clicked", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const expandButton = findButtonByIcon(
          element.shadowRoot,
          "utility:expand"
        );
        expandButton.click();
      })
      .then(() => {
        const closeButton = findButtonByIcon(
          element.shadowRoot,
          "utility:close"
        );
        closeButton.click();
      })
      .then(() => {
        const modal = element.shadowRoot.querySelector(".slds-modal");
        expect(modal).toBeNull();
      });
  });

  it("shows the backdrop when fullscreen is active", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const expandButton = findButtonByIcon(
          element.shadowRoot,
          "utility:expand"
        );
        expandButton.click();
      })
      .then(() => {
        const backdrop = element.shadowRoot.querySelector(".slds-backdrop");
        expect(backdrop).not.toBeNull();
      });
  });

  it("hides the backdrop when fullscreen is closed", () => {
    const element = createComponent();

    return Promise.resolve()
      .then(() => {
        const expandButton = findButtonByIcon(
          element.shadowRoot,
          "utility:expand"
        );
        expandButton.click();
      })
      .then(() => {
        const closeButton = findButtonByIcon(
          element.shadowRoot,
          "utility:close"
        );
        closeButton.click();
      })
      .then(() => {
        const backdrop = element.shadowRoot.querySelector(".slds-backdrop");
        expect(backdrop).toBeNull();
      });
  });

  it("renders the expand button", () => {
    const element = createComponent();

    return Promise.resolve().then(() => {
      const expandButton = findButtonByIcon(
        element.shadowRoot,
        "utility:expand"
      );
      expect(expandButton).not.toBeNull();
    });
  });
});
