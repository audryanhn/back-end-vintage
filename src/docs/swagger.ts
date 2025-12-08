import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "DOKUMENTASI API VINTAGE",
    description:
      "Dokumentasi API yang akan digunakan dalam pembuatan website Vintage",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development Server",
    },
    {
      url: "https://back-end-vintage.vercel.app/api",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      RegisterRequest: {
        fullName: "Ryan",
        username: "ryangeming",
        password: "12341234",
        confirmPassword: "12341234",
        email: "ryangeming@gmail.com",
      },

      LoginRequest: {
        identifier: "ryangeming",
        password: "12341234",
      },

      AddCartRequest: {
        items: [
          {
            productId: "69286f135b3d66f86f6d040f",
            qty: 1,
          },
        ],
      },
      ProductRegisterRequest: {
        brand: "NARA",
        category: "women-clothing",
        condition: "excellent",
        description: "Tas jinjing wanita dengan desain minimalis premium.",
        from: "Bandung",
        images: [
          "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
        ],
        price: 1350000,
        product_name: "NARA Tote Bag",
        shipping: 20000,
        size: "M",
        store_name: "NARA",
        like: [],
      },
    },
  },
};

const outputFile = "./src/docs/swagger-output.json";
const endspointsFile = ["./src/routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endspointsFile, doc);
