import express from "express";
import userRouter from "./user/userRouter";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    lng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}/.json",
      detection: {
        lookupHeader: "accept-language",
      },
    },
  });

const app = express();

// parse JSON
app.use(express.json());

// support i18
app.use(middleware.handle(i18next));

// routers
app.use("/api/1.0/users", userRouter);

export default app;
