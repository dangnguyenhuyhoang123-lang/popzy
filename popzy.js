const arr_btn = $$(".btn");

function Modal(options = {}) {
  this.opt = Object.assign(
    {
      templateId: null,
      closeMethod: ["button", "overlay", "escape"],
      destroyOnClose: true,
      footer: false,
      cssClass: [],
      // onOpen,
      // onClose,
    },
    options
  );
  this.template = document.querySelector(`#${this.opt.templateId}`);

  if (!this.template) {
    console.error("Not exists");
    return;
  }
  this._allowBackdropClose = this.opt.closeMethod.includes("overlay");
  this._allowButtonClose = this.opt.closeMethod.includes("button");
  this._allowEscapeClose = this.opt.closeMethod.includes("escape");

  Modal.prototype._build = function () {
    const content = this.template.content.cloneNode(true);
    const modal_content = document.createElement("div");
    modal_content.className = "modal-content";

    const modal_container = document.createElement("div");
    modal_container.className = "modal-container";
    this.opt.cssClass.forEach((element) => {
      if (typeof element === "string") modal_container.classList.add(element);
    });

    this._modal_backdrop = document.createElement("div");
    this._modal_backdrop.className = "modal-backdrop";
    this._modal_backdrop.id = this.opt.templateId;

    if (this._allowButtonClose) {
      const modal_close = document.createElement("button");
      modal_close.className = "modal-close";
      modal_close.innerHTML = "&times;";
      modal_container.append(modal_close);
      modal_close.onclick = () => this.close();
    }

    modal_content.append(content);
    modal_container.append(modal_content);
    this._modal_backdrop.append(modal_container);

    if (this.opt.footer) {
      this._modalFooter = document.createElement("div");
      this._modalFooter.className = "modal-footer";

      if (this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
      }
      this._footerButtons.forEach((button) => {
        this._modalFooter.append(button);
      });
      modal_container.append(this._modalFooter);
    }
    document.body.append(this._modal_backdrop);
  };
  Modal.prototype.setFooterContent = function (html) {
    if (this._modalFooter) this._modalFooter.innerHTML = html;
  };
  Modal.prototype.open = function () {
    if (!this._modal_backdrop) {
      this._build();
    }
    setTimeout(() => {
      this._modal_backdrop.classList.add("show");
      document.body.classList.add("padding-right");
    }, 0);

    if (this._allowEscapeClose) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close(this._modal_backdrop);
        }
      });
    }

    if (this._allowBackdropClose) {
      this._modal_backdrop.onclick = (e) => {
        if (e.target === this._modal_backdrop) {
          this.close(this._modal_backdrop);
        }
      };
    }

    this._ontransitionEnd(() => {
      if (typeof this.opt.onOpen === "function") this.opt.onOpen();
    });

    //Disable Scrolling
    document.body.classList.add("no-scroll");
    return this._modal_backdrop;
  };
  Modal.prototype._ontransitionEnd = function (callback) {
    this._modal_backdrop.ontransitionend = function (e) {
      if (e.propertyName !== "transform") {
        return;
      }
      if (typeof callback === "function") callback();
    };
  };
  Modal.prototype.close = function (destroy = this.opt.destroyOnClose) {
    this._modal_backdrop.classList.remove("show");
    this._ontransitionEnd(() => {
      if (destroy && this._modal_backdrop) {
        this._modal_backdrop.remove();
        this._modal_backdrop = null;
        this._modalFooter = null;
      }
      document.body.classList.remove("no-scroll");
      document.body.classList.remove("padding-right");

      if (typeof this.opt.onClose === "function") this.opt.onClose();
    });
  };
  Modal.prototype._footerButtons = [];
  Modal.prototype.addFooterButton = function (title, cssClass, callback) {
    const button = document.createElement("button");
    button.className = cssClass;
    button.innerHTML = title;

    button.onclick = callback;
    this._footerButtons.push(button);
  };
  Modal.prototype.destroy = () => {
    this.close(true);
  };
}
