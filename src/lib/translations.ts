export type Translation = {
  categories: string;
  allDesigns: string;
  loadMore: string;
  showing: string;
  of: string;

  customizationDetails: string;
  woodType: string;
  woodPlaceholder: string;
  addToCart: string;
  addedToCart: string;
  customizationTitle: string;
  customizationHelp: string;
  customizationPlaceholder: string;

  checkout: {
    title: string;
    customerInfo: string;
    fullName: string;
    email: string;
    phone: string;

    deliveryMethod: string;
    shipping: string;

    shippingAddress: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;

    orderSummary: string;
    submit: string;

    errors: {
      contactInfo: string;
      shippingAddress: string;
      emptyCart: string;

      orderFailed: string;
      paymentFailed: string;
      generic: string;
    };

    pickup: {
      label: string;
      title: string;
      description: string;
      reno: string;
      mexico: string;
    };
  };
  success: {
    title: string;
    orderId: string;
    customerInfo: string;
    name: string;
    email: string;
    phone: string;
    delivery: string;
    shippingAddress: string;
    items: string;
    backHome: string;
    loading: string;
  };

  hero: {
  title: string;
  subtitle: string;
  description: string;
};

stats: {
  designs: string;
  categories: string;
  madeToOrder: string;
};

footer: {
  description: string;

  contact: string;
  whatsappLabel: string;
  orderHelp: string;

  policies: string;

  designDepositLabel: string;
  designDepositDetail: string;

  shippingLabel: string;
  shippingDetail: string;

  refundsLabel: string;
  refundsDetail: string;

  rights: string;
  builtBy: string;
};

cart: {
  title: string;
  subtitle: string;

  empty: string;
  browse: string;

  category: string;
  wood: string;
  finish: string;
  size: string;
  location: string;
  engraving: string;
  notes: string;

  remove: string;

  summaryItems: string;
  depositNote: string;

  checkout: string;
  continue: string;
};

carvingDetail: {
  back: string;

  woodType: string;
  finish: string;
  size: string;
  engraving: string;
  anythingElse: string;

  sizeHint: string;
  sizePlaceholder: string;
  engravingPlaceholder: string;
  notesPlaceholder: string;

  addedToCart: string;
  depositNote: string;
},

aboutPage: {
  title: string;
  story1: string;
  story2: string;
  story3: string;
};

howItWorks: {
  title: string;
  subtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  cta: string;
};
};

export const translations: Record<string, Translation> = {
  en: {
    categories: "Collections",
    allDesigns: "All Designs",
    loadMore: "Load More",
    showing: "Showing",
    of: "of",

    customizationDetails: "Customization Details",
    woodType: "Wood Type",
    woodPlaceholder: "e.g. Cherry, Maple, Walnut",

    addToCart: "Add to Cart",
    addedToCart: "Added to cart",
    customizationTitle: "Customization Details",
    customizationHelp:
      "What size would you like it? Not sure? Tell us where it will go and we can help. Want a specific finish, engraving, or custom message? Add it here.",
    customizationPlaceholder:
      "Example: 24x18 inches, for living room wall above couch, natural wood finish",

    checkout: {
      title: "Checkout",
      customerInfo: "Customer Information",

      fullName: "Full Name",
      email: "Email",
      phone: "Phone",

      deliveryMethod: "Delivery Method",
      shipping: "Ship To Your Home",

      shippingAddress: "Shipping Address",
      address1: "Address Line 1",
      address2: "Address Line 2 (optional)",
      city: "City",
      state: "State",
      zip: "ZIP / Postal Code",

      orderSummary: "Order Summary",
      submit: "Submit Design Request & Pay Deposit",

      errors: {
        contactInfo: "Please complete your name, email, and phone number.",
        shippingAddress: "Please complete your shipping address.",
        emptyCart: "Your cart is empty.",

        orderFailed: "Failed to create order. Please try again.",
        paymentFailed: "Payment setup failed. Please try again.",
        generic: "Something went wrong. Please try again.",
      },

      pickup: {
        label: "Local Pickup",
        title: "Pickup Location",
        description: "Choose where you'd like to pick up your order.",
        reno: "Reno, NV",
        mexico: "La Ribera, BCS, Mexico",
      },
    },

    success: {
      title: "Order Confirmed",
      orderId: "Order ID",
      customerInfo: "Customer Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      delivery: "Delivery",
      shippingAddress: "Shipping Address",
      items: "Items",
      backHome: "Back to Home",
      loading: "Loading order...",
    },

    hero: {
  title: "Custom Wood Signs & Carvings",
  subtitle: "Hundreds of designs made to order in solid wood",
  description:
    "Each piece is designed and crafted in-house. Browse designs below, save your favorites, and request a quote. Custom quotes include a $25 design deposit, credited toward your order.",
},

stats: {
  designs: "designs",
  categories: "categories",
  madeToOrder: "Made to order",
},

footer: {
  description:
    "Custom wood signs and carvings, designed and made to order. Every piece is carved in-house — built to last.",

  contact: "Contact",
  whatsappLabel: "WhatsApp Steve",
  orderHelp: "Questions about your order? Message us directly.",

  policies: "Policies",
  designDepositLabel: "Design deposit",
  designDepositDetail:
    "$25 is non-refundable if a quote is declined. If accepted, it is applied toward your final balance.",

  shippingLabel: "Shipping",
  shippingDetail:
    "Shipping costs are calculated by Steve and included in your custom quote.",

  refundsLabel: "Refunds",
  refundsDetail:
    "All pieces are made to order. Refunds are handled case by case — reach out via WhatsApp.",

  rights: "All rights reserved",
  builtBy: "Site built by"
},
cart: {
  title: "Your Cart",
  subtitle: "Review your selections before proceeding to checkout.",

  empty: "Nothing in your cart yet.",
  browse: "Browse designs",

  category: "Category",
  wood: "Wood",
  finish: "Finish",
  size: "Size",
  location: "Location",
  engraving: "Engraving",
  notes: "Notes",

  remove: "Remove",

  summaryItems: "item(s)",
  depositNote: "$25 deposit due at checkout",

  checkout: "Proceed to checkout",
  continue: "Continue browsing",
},

carvingDetail: {
  back: "Back",

  woodType: "Wood type",
  finish: "Finish",
  size: "Size",
  engraving: "Engraving or text",
  anythingElse: "Anything else?",

  sizeHint: "e.g. 12×18 inches or describe the space it needs to fit",
  sizePlaceholder: "Dimensions or space description",
  engravingPlaceholder: "e.g. The Smith Family · Est. 1960",
  notesPlaceholder: "Notes for Steve",

  addedToCart: "Added to your cart",
  depositNote: "You'll complete the $25 deposit at checkout"
},
aboutPage: {
  title: "About",
  story1: "Steve started woodworking as a personal craft and turned it into a small custom CNC shop focused on quality and detail.",
  story2: "Every piece is designed, cut, and finished in-house — no mass production, just custom work made one at a time.",
  story3: "The goal is simple: create wood pieces that feel personal, durable, and meaningful."
},

howItWorks: {
  title: "How it works",
  subtitle: "Simple steps from idea to finished piece",

  step1Title: "Choose a design",
  step1Desc: "Browse the catalog and pick a base design you like.",

  step2Title: "Customize it",
  step2Desc: "Add wood type, size, engraving, and special requests.",

  step3Title: "We review it",
  step3Desc: "Steve reviews your request and prepares a quote.",

  step4Title: "We build it",
  step4Desc: "Once approved, it’s carved, finished, and shipped.",

  cta: "Browse designs"
}
  },

  es: {
    categories: "Colecciones",
allDesigns: "Todos los Diseños",
    loadMore: "Cargar más",
    showing: "Mostrando",
    of: "de",

    customizationDetails: "Detalles de Personalización",
    woodType: "Tipo de Madera",
    woodPlaceholder: "ej. Cerezo, Arce, Nogal",

    addToCart: "Agregar al carrito",
    addedToCart: "Agregado al carrito",
    customizationTitle: "Detalles de Personalización",
    customizationHelp:
      "¿Qué tamaño te gustaría? ¿No estás seguro? Cuéntanos dónde irá y te ayudamos. ¿Quieres un acabado, grabado o mensaje personalizado? Escríbelo aquí.",
    customizationPlaceholder:
      "Ejemplo: 60x45 cm, para pared de sala sobre el sofá, acabado natural, estilo moderno limpio",

    checkout: {
      title: "Pago",
      customerInfo: "Información del Cliente",

      fullName: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Teléfono",

      deliveryMethod: "Método de Entrega",
      shipping: "Enviar a Casa",

      shippingAddress: "Dirección de Envío",
      address1: "Dirección Línea 1",
      address2: "Dirección Línea 2 (opcional)",
      city: "Ciudad",
      state: "Estado",
      zip: "Código Postal",

      orderSummary: "Resumen del Pedido",
      submit: "Enviar Diseño y Pagar Depósito",

      errors: {
        contactInfo: "Por favor completa tu nombre, correo y teléfono.",
        shippingAddress: "Por favor completa tu dirección de envío.",
        emptyCart: "Tu carrito está vacío.",

        orderFailed: "Error al crear el pedido. Intenta de nuevo.",
        paymentFailed: "Error al iniciar el pago. Intenta de nuevo.",
        generic: "Algo salió mal. Intenta de nuevo.",
      },

      pickup: {
        label: "Recogida Local",
        title: "Ubicación de Recogida",
        description: "Elige dónde quieres recoger tu pedido.",
        reno: "Reno, NV",
        mexico: "La Ribera, BCS, México",
      },
    },

    success: {
      title: "Pedido Confirmado 🎉",
      orderId: "ID del Pedido",
      customerInfo: "Información del Cliente",
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      delivery: "Entrega",
      shippingAddress: "Dirección de Envío",
      items: "Artículos",
      backHome: "Volver al Inicio",
      loading: "Cargando pedido...",
    },

    hero: {
  title: "Carteles y Grabados de Madera Personalizados",
  subtitle: "Cientos de diseños hechos a pedido en madera sólida",
  description:
    "Cada pieza es diseñada y elaborada en casa. Explora los diseños, guarda tus favoritos y solicita una cotización. Las cotizaciones incluyen un depósito de $25 acreditado a tu pedido.",
},

stats: {
  designs: "diseños",
  categories: "categorías",
  madeToOrder: "Hecho a pedido",
},

  footer: {
  description:
    "Carteles y grabados de madera personalizados, diseñados y hechos a pedido. Cada pieza se talla en nuestro taller — hecha para durar.",

  contact: "Contacto",
  whatsappLabel: "WhatsApp Steve",
  orderHelp: "¿Preguntas sobre tu pedido? Escríbenos directamente.",

  policies: "Políticas",
  designDepositLabel: "Depósito de diseño",
  designDepositDetail:
    "El depósito de $25 no es reembolsable si la cotización es rechazada. Si se acepta, se aplica al pago final.",

  shippingLabel: "Envío",
  shippingDetail:
    "Los costos de envío son calculados por Steve e incluidos en la cotización.",

  refundsLabel: "Reembolsos",
  refundsDetail:
    "Todos los productos se hacen a pedido. Los reembolsos se manejan caso por caso — contáctanos por WhatsApp.",

  rights: "Todos los derechos reservados",
  builtBy: "Sitio creado por"
},
cart: {
  title: "Tu Carrito",
  subtitle: "Revisa tus selecciones antes de continuar al pago.",

  empty: "Tu carrito está vacío.",
  browse: "Ver diseños",

  category: "Categoría",
  wood: "Madera",
  finish: "Acabado",
  size: "Tamaño",
  location: "Ubicación",
  engraving: "Grabado",
  notes: "Notas",

  remove: "Eliminar",

  summaryItems: "artículo(s)",
  depositNote: "Depósito de $25 requerido al finalizar",

  checkout: "Ir al pago",
  continue: "Seguir explorando",
},

carvingDetail: {
  back: "Atrás",

  woodType: "Tipo de madera",
  finish: "Acabado",
  size: "Tamaño",
  engraving: "Grabado o texto",
  anythingElse: "¿Algo más?",

  sizeHint: "ej. 30x45 cm o describe el espacio",
  sizePlaceholder: "Dimensiones o descripción del espacio",
  engravingPlaceholder: "ej. Familia Smith · Desde 1960",
  notesPlaceholder: "Notas para Steve",

  addedToCart: "Agregado al carrito",
  depositNote: "Pagarás el depósito de $25 en el checkout"
},

aboutPage: {
  title: "Acerca de",
  story1: "Steve comenzó trabajando la madera como un pasatiempo y lo convirtió en un pequeño taller CNC enfocado en calidad y detalle.",
  story2: "Cada pieza se diseña, corta y termina en casa — sin producción masiva, solo trabajo personalizado.",
  story3: "El objetivo es crear piezas de madera personales, duraderas y con significado."
},

howItWorks: {
  title: "Cómo funciona",
  subtitle: "Pasos simples de idea a producto final",

  step1Title: "Elige un diseño",
  step1Desc: "Explora el catálogo y selecciona un diseño base.",

  step2Title: "Personalízalo",
  step2Desc: "Agrega madera, tamaño, grabado y detalles especiales.",

  step3Title: "Lo revisamos",
  step3Desc: "Steve revisa tu solicitud y prepara una cotización.",

  step4Title: "Lo fabricamos",
  step4Desc: "Una vez aprobado, se talla, se termina y se envía.",

  cta: "Ver diseños"
}
  }
  
};
