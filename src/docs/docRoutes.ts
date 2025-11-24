import { Express } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";

export default function docs(app: Express) {
  //   const css = fs.readFileSync(
  //     path.resolve(__dirname, "../../node_modules/swagger-ui-dist/index.css"),
  //     "utf-8"
  //   );
  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerOutput, {
      customCss: "../../node_modules/swagger-ui-dist/index.css",
    })
  );

  //   app.use(
  //     "/api-docs",
  //     express.static(path.join(__dirname, "../../node_modules/swagger-ui-dist"))
  //   );
}
