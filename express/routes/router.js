const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const Ajv = require("ajv");
const ajvArticle = new Ajv();
const ajvFAQ = new Ajv();
const ajvBread = new Ajv();
const ajvLocalBusiness = new Ajv();
const ajvWeb = new Ajv();

const schemaLocalBusiness = {
  type: "object",
  properties: {
    "@context": { type: "string" },
    "@type": { type: "string" },
    "@id": { type: "string" },
    url: { type: "string" },
    address: {
      type: "object",
      properties: {
        "@type": { type: "string" },
        streetAddress: { type: "string" },
        addressLocality: { type: "string" },
        addressRegion: { type: "string" },
        postalCode: { type: "string" },
        addressCountry: { type: "string" },
      },
      required: ["@type", "streetAddress", "addressRegion", "postalCode"],
    },
    name: { type: "string" },
    telephone: { type: "string" },
    aggregateRating: {
      type: "object",
      properties: {
        "@type": { type: "string" },
        ratingValue: { type: "number" },
        reviewCount: { type: "integer" },
      },
      required: ["@type", "ratingValue", "reviewCount"],
    },
    image: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["@context", "address", "name"],
};

const schemaArticle = {
  type: "object",
  properties: {
    "@context": { type: "string" },
    "@type": { type: "string" },
    mainEntityOfPage: {
      type: "object",
      properties: {
        "@type": { type: "string" },
        "@id": { type: "string" },
      },
      required: ["@type", "@id"],
    },
    image: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["@context", "image", "@type"],
};

const schemaWeb = {
  type: "object",
  properties: {
    "@context": { type: "string" },
    "@type": { type: "string" },
    name: { type: "string" },
    image: { anyOf: [{ type: "string" }, { type: "object" }] },
    url: { type: "string" },
    description: { type: "string" },
    keywords: { type: "string" },
    copyrightHolder: { type: "string" },
    potentialAction: {
      type: "object",
      properties: {
        "@type": { type: "string" },
        target: { type: "string" },
        "query-input": { type: "string" },
      },
      required: ["@type"]
    },
  },
  required: ["@context", "@type"],
};

const schemaFAQ = {
  type: "object",
  properties: {
    "@context": { type: "string" },
    "@type": { type: "string" },
    mainEntity: {
      type: "array",
      items: {
        type: "object",
        properties: {
          "@type": { type: "string" },
          name: { type: "string" },
          acceptedAnswer: {
            type: "object",
            properties: {
              "@type": { type: "string" },
              text: { type: "string" },
            },
            required: ["@type", "text"],
          },
        },
        required: ["acceptedAnswer", "name", "@type"],
      },
    },
  },
  required: ["@context", "mainEntity", "@type"],
};

const schemaBread = {
  type: "object",
  properties: {
    "@type": {
      type: "string",
    },
    itemListElement: {
      type: "array",
      items: {
        type: "object",
        properties: {
          "@type": {
            type: "string",
          },
          position: {
            type: "integer",
          },
          item: {
            anyOf: [
              {
                type: "object",
                properties: {
                  "@id": {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  "@type": {
                    type: "string",
                  },
                },
                required: ["name"],
                additionalProperties: true,
              },
              {
                type: "string"
              }
            ],
          },
        },
        required: ["@type", "position", "item"],
      },
    },
    "@context": {
      type: "string",
    },
  },
  required: ["@context", "itemListElement", "@type"],
};

router.get('/', (req, res) => {
  res.json({ message: 'Hello World! ' });
});

router.get('/tdk', (req, res) => {
  res.json({ message: 'Hello World! This is TDK ' });
});

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.post('/tdk', async (req, res) => {
  requestedBody = Object.values(req.body)[0];

  crawl(requestedBody).then((value) => {
    res.send(value);
  });
});

router.get("/json", (req, res) => {
  res.send("Json ld pages is here");
});

router.post("/json", (req, res) => {
  requestedBody = Object.values(req.body)[0];
  requestNumber = Object.values(req.body)[1];

  crawlJson(requestedBody, requestNumber).then((value) => {
    res.send(value);
  });
});

const crawlJson = (url, requestNumber) => {
  const metaData = axios(url)
    .then((response) => {
      const htmlParser = response.data;
      const $ = cheerio.load(htmlParser);
      var title = $("title").text();
      var jsonStr = $('script[type="application/ld+json"]').text();
      let schemas = [];
      if (jsonStr == "") {
        schemas = [
          ...schemas,
          {
            name: "",
            isValid: null,
            errorMsg: "JSON LD無し",
          },
        ];

        let res = {
          url,
          schemas,
          title,
          requestNumber
        };
        return JSON.stringify(res);
      }
      var jsonLD = JSON.parse(jsonStr);
      const validateFAQ = ajvFAQ.compile(schemaFAQ);
      const validateBread = ajvBread.compile(schemaBread);
      const validateArticle = ajvArticle.compile(schemaArticle);
      const validateLocalBusiness =
        ajvLocalBusiness.compile(schemaLocalBusiness);
      const validateWeb = ajvWeb.compile(schemaWeb);

      jsonLD.forEach((element) => {
        if (element["@type"] === "FAQPage") {
          schemas = [
            ...schemas,
            {
              elements: element,
              name: element["@type"],
              isValid: validateFAQ(element),
              errorMsg: validateFAQ(element)
                ? null
                : `${JSON.stringify(validateFAQ.errors[0])};`,
            },
          ];
        } else if (element["@type"] === "BreadcrumbList") {
          schemas = [
            ...schemas,
            {
              elements: element,
              name: element["@type"],
              isValid: validateBread(element),
              errorMsg: validateBread(element)
                ? null
                : `${JSON.stringify(validateBread.errors[0])};`,
            },
          ];
        } else if (element["@type"] === "Article") {
          schemas = [
            ...schemas,
            {
              elements: element,
              name: element["@type"],
              isValid: validateArticle(element),
              errorMsg: validateArticle(element)
                ? null
                : `${JSON.stringify(validateArticle.errors[0])};`,
            },
          ];
        } else if (element["@type"] === "LocalBusiness") {
          schemas = [
            ...schemas,
            {
              elements: element,
              name: element["@type"],
              isValid: validateLocalBusiness(element),
              errorMsg: validateLocalBusiness(element)
                ? null
                : `${JSON.stringify(validateLocalBusiness.errors[0])};`,
            },
          ];
        } else if (element["@type"] === "WebSite") {
          schemas = [
            ...schemas,
            {
              elements: element,
              name: element["@type"],
              isValid: validateWeb(element),
              errorMsg: validateWeb(element)
                ? null
                : `${JSON.stringify(validateWeb.errors[0])};`,
            },
          ];
        } else {
          schemas = [
            ...schemas,
            {
              elements: null,
              name: element["@type"],
              isValid: null,
              errorMsg: null,
            },
          ];
        }
      });

      let res = {
        url,
        schemas,
        title,
        requestNumber
      };

      return JSON.stringify(res);
    })
    .catch((err) => {
      let message =
        typeof err.response !== "undefined"
          ? err.response.data.message
          : err.message;
      console.warn("error", message);

      const data = {
        url: url,
        jsonLD: "NOT FOUND",
      };
      return JSON.stringify(data);
    });
  return metaData;
};

const crawl = (url) => {
  const metaData = axios(url)
    .then((response) => {
      const htmlParser = response.data;
      const $ = cheerio.load(htmlParser);
      let hs = []
      $('h1, h2, h3, h4').each((i, e) => {
        hs[i] = { text: $(e).text().trim().replace(/[\t|\n]/," "), name: $(e)[0].name }
      })
      
      const data = {
        url,
        title: $("title").text(),
        description: $('meta[name="description"]').attr("content"),
        keywords: $('meta[name="keywords"]').attr("content"),
        hs,
        canonical: $('link[rel="canonical"]').attr("href"),
      };
      // console.log(JSON.stringify(data))
      return JSON.stringify(data);
    })
    .catch((err) => {
      let message =
        typeof err.response !== "undefined"
          ? err.response.data.message
          : err.message;
      console.warn("error", message);

      const data = {
        url: url,
        title: "NOT FOUND",
        description: "NOT FOUND",
        keywords: "NOT FOUND",
        hs: [],
        requestNumber: requestNumber
      };

      return JSON.stringify(data);
    });
  return metaData;
};

module.exports = router;