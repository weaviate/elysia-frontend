/* eslint-disable @typescript-eslint/no-explicit-any */
export const productResponse: any = {
  id: "12345",
  query: "I'm looking for a white dress",
  messages: [
    {
      type: "User",
      id: "ea76b6e1-2649-4fb5-86f2-704ab4079c7c",
      query_id: "40607ece-baf3-42e4-b397-da5bdc00b229",
      conversation_id: "60552f05-f4ac-4bce-9065-3c61f03da3e8",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["I'm looking for a white dress"],
      },
    },
    {
      type: "text",
      id: "tex-5f7ad2fe-fc16-4337-9b71-1ddfb9a5b04b",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "60552f05-f4ac-4bce-9065-3c61f03da3e8",
      query_id: "40607ece-baf3-42e4-b397-da5bdc00b229",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now search the Ecommerce collection for dresses.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-0b1ee47f-698c-4859-9a4b-1fb52d572a8c",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "60552f05-f4ac-4bce-9065-3c61f03da3e8",
      query_id: "40607ece-baf3-42e4-b397-da5bdc00b229",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: 'I\'m performing a hybrid search on the `Ecommerce` collection for "white dress" within the description field.',
          },
        ],
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "60552f05-f4ac-4bce-9065-3c61f03da3e8",
      query_id: "40607ece-baf3-42e4-b397-da5bdc00b229",
      id: "res-e48c1c51-3231-4ab0-8d48-002b7279a8cf",
      payload: {
        type: "ecommerce",
        objects: [
          {
            collection: "Light Academia",
            tags: "['new in']",
            description:
              "Embrace the essence of optimism with our midi dress, embodying elegance through its flowing silhouette and ethereal ivory tone. Designed for those who cherish the beauty of learning and classical art, this piece features delicate pleating and a fabric belt to highlight an inspired and thoughtful life.",
            id: "87820e36-447a-4e17-9e98-9db02facb54b",
            price: 89.99,
            rating: 4.8,
            brand: "Nova Nest",
            name: "Seraphic Study Midi",
            subcategory: "Casual Dresses",
            reviews:
              "['Absolutely in love with the fabric and how it flows!', 'The perfect dress for a sunlit reading at the cafe. Felt very inspired and comfortable.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/87820e36-447a-4e17-9e98-9db02facb54b.png",
            category: "Dresses & Jumpsuits",
            colors: ["white"],
            uuid: "9a66d0eb-8fa0-5179-83f6-85c8ffb5d3f0",
          },
          {
            collection: "Light Academia",
            tags: "['sale']",
            description:
              "Evoke the spirit of intellectual pursuit with this refined, ivory silk gown adorned with subtle gold accents. Its elegant silhouette and detailed pleating pay homage to classical art and architecture, making it a timeless piece for any formal occasion.",
            id: "ec26ccc7-5c9b-4d81-a618-45fb1f33be0f",
            price: 299.99,
            rating: 4.8,
            brand: "Nova Nest",
            name: "Athena's Gown",
            subcategory: "Formal Dresses",
            reviews:
              "['Absolutely stunning and feels like it was made just for me!', 'The subtle gold accents add such a classical beauty to the dress.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/ec26ccc7-5c9b-4d81-a618-45fb1f33be0f.png",
            category: "Dresses & Jumpsuits",
            colors: ["white", "gold"],
            uuid: "e839a80b-ed33-5fb0-9541-0e94911fb55f",
          },
          {
            collection: "Light Academia",
            tags: "[]",
            description:
              "Embrace a world of elegance and intellect in our Ivory Parchment Gown. Crafted from luxurious fabric, this dress features a fitted bodice that flares into a full, flowing skirt, reminiscent of the timeless beauty found in the pages of classic literature. Exquisite lace detailing on the sleeves and hem adds a touch of romance, making it perfect for enlightened evenings.",
            id: "52436f10-8daa-4a1a-a7e2-d6a599aeda0b",
            price: 349.99,
            rating: 4.8,
            brand: "Nova Nest",
            name: "Ivory Parchment Gown",
            subcategory: "Formal Dresses",
            reviews:
              "['Stunning gown, I felt like a heroine from a classic novel!', 'Elegant and comfortable, received so many compliments.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/52436f10-8daa-4a1a-a7e2-d6a599aeda0b.png",
            category: "Dresses & Jumpsuits",
            colors: ["white"],
            uuid: "8f5ebb68-5c74-55c9-8ede-9e6eb59ed05e",
          },
          {
            collection: "Cottagecore",
            tags: "[]",
            description:
              "Embrace the simplicity of countryside charm with this light, airy dress. Tailored for comfort and designed for the romantic at heart, it features delicate fabric buttons and a softly flared skirt to whisk you away to a world of pastoral bliss. Perfect for sunny days in the garden or lazy afternoons beneath the shade of an old oak tree.",
            id: "a7dc7b63-ff5e-45c3-933d-55df2d29aba1",
            price: 58.99,
            rating: 4.7,
            brand: "Loom & Aura",
            name: "Breezy Bramble Dress",
            subcategory: "Casual Dresses",
            reviews:
              "['Absolutely in love with the fit and feel!', 'Perfect for my weekend getaways to the countryside.', 'Feels like a second skin, so soft and easy to wear.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/a7dc7b63-ff5e-45c3-933d-55df2d29aba1.png",
            category: "Dresses & Jumpsuits",
            colors: ["green", "white"],
            uuid: "cc5ac477-a2a8-54cb-8992-4ba3293b40ee",
          },
          {
            collection: "Cottagecore",
            tags: "[]",
            description:
              "Embrace the serenity of countryside elegance with this floor-length chiffon gown, detailed with a subtle v-neckline and soft, flowing sleeves. Perfect for twilight gatherings under the open sky, its lavender hue and delicate fabric embody the essence of pastoral serenity.",
            id: "e7690ae0-5a94-4ef5-b1d1-e95c0ad8607f",
            price: 189.99,
            rating: 4.8,
            brand: "Canvas & Co.",
            name: "Blossom Twilight Gown",
            subcategory: "Formal Dresses",
            reviews:
              "['Feels like a fairy tale wearing this dress!', 'The lavender color is just perfect for a garden wedding.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/e7690ae0-5a94-4ef5-b1d1-e95c0ad8607f.png",
            category: "Dresses & Jumpsuits",
            colors: ["purple"],
            uuid: "338b364b-3efc-5a59-bac0-8a5668c3f187",
          },
          {
            collection: "Cottagecore",
            tags: "[]",
            description:
              "A serene, pastel green fabric flows like a gentle stream, artfully tailored to evoke the timeless grace of a forest glen at dawn. Subtle sleeve ruffles dance like leaves in a soft breeze, inviting tales of yore and magic untold.",
            id: "1adae57c-bdcd-4f89-9e9c-e7f964723d44",
            price: 89,
            rating: 4.8,
            brand: "Canvas & Co.",
            name: "Mystwood Midi Dress",
            subcategory: "Casual Dresses",
            reviews:
              "['Feels like a dream, absolutely ethereal!', 'The color is so calming and fits wonderfully.', 'Truly a piece out of a storybook. Love it!']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/1adae57c-bdcd-4f89-9e9c-e7f964723d44.png",
            category: "Dresses & Jumpsuits",
            colors: ["green"],
            uuid: "c7c13f12-4182-5592-bac7-5e8e681fb4cc",
          },
          {
            collection: "Light Academia",
            tags: "[]",
            description:
              "An elegant, ivory-colored gown, capturing the essence of refined intellectualism with its subtle floral patterns and graceful silhouettes. Perfect for celebratory readings and cultured gatherings.",
            id: "ec1e0c6a-2474-408f-9f25-cec724f3abaf",
            price: 259.99,
            rating: 4.8,
            brand: "Loom & Aura",
            name: "Eloquence Gown",
            subcategory: "Formal Dresses",
            reviews:
              '["Absolutely stunning! It\'s elegant and makes me feel like I\'m in a classic novel.", "The detail is amazing. Very comfortable and perfect for my university\'s art gala."]',
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/ec1e0c6a-2474-408f-9f25-cec724f3abaf.png",
            category: "Dresses & Jumpsuits",
            colors: ["white"],
            uuid: "c3d496b4-2477-5f5f-854d-c1bf466a9512",
          },
          {
            collection: "Y2K",
            tags: "['sale', 'most loved']",
            description:
              "Dazzle under the disco ball in this twilight-inspired mini dress, featuring a sleek silhouette with a playful baby blue shimmer. The ultimate blend of flirt and sass for your next big night out.",
            id: "4976eabe-f52b-42e6-901f-6c836efa672f",
            price: 89.99,
            rating: 4.5,
            brand: "Vivid Verse",
            name: "Glitterati Twilight Mini",
            subcategory: "Casual Dresses",
            reviews:
              "['Absolutely in love with this dress!', 'The color pops and the fit is perfect. Felt like a star all night.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/4976eabe-f52b-42e6-901f-6c836efa672f.png",
            category: "Dresses & Jumpsuits",
            colors: ["blue"],
            uuid: "1e1649c9-fa2f-5183-9100-138939e88833",
          },
          {
            collection: "Y2K",
            tags: "[]",
            description:
              "Embrace the dawn of the millennium in this baby blue mini dress, featuring a shimmering iridescent finish and a flirtatiously flared skirt. Perfect for turning heads at any daytime soiree or nighttime bash.",
            id: "864c977c-1217-4547-b6ba-3eaa1732b473",
            price: 58.99,
            rating: 4.6,
            brand: "Vivid Verse",
            name: "Twilight Spark Mini Dress",
            subcategory: "Casual Dresses",
            reviews:
              "['Absolutely in love with the retro vibe!', 'The material catches the light beautifully. Got so many compliments.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/864c977c-1217-4547-b6ba-3eaa1732b473.png",
            category: "Dresses & Jumpsuits",
            colors: ["blue", "purple"],
            uuid: "eb619644-1bae-56fc-9fd2-7d8957b363ca",
          },
          {
            collection: "Cyberpunk",
            tags: "[]",
            description:
              "Sleek formal dress with holographic trim and asymmetric zipper. Perfect for traversing the twilight cityscapes.",
            id: "6e8e40e2-a318-4021-9348-fc0dc39e51b8",
            price: 89.99,
            rating: 4.7,
            brand: "Vivid Verse",
            name: "Eclipse Dress",
            subcategory: "Formal Dresses",
            reviews:
              "['Absolutely stunning and surprisingly comfortable!', 'The holographic trim catches the light beautifully. Perfect for a night out.']",
            image:
              "https://d3o574pyao1sq3.cloudfront.net/fashion/6e8e40e2-a318-4021-9348-fc0dc39e51b8.png",
            category: "Dresses & Jumpsuits",
            colors: ["black", "silver"],
            uuid: "85919daf-ef82-58bb-ac5d-e3e1cf36ed02",
          },
        ],
        metadata: {
          collection_name: "Ecommerce",
          display_type: "ecommerce",
          needs_summarising: false,
          query_text: "white dress",
          query_type: "hybrid",
          chunked: false,
          query_output: {
            target_collections: ["Ecommerce"],
            search_type: "hybrid",
            search_query: "white dress",
            sort_by: null,
            filter_buckets: null,
            limit: 10,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.hybrid(\n    query='white dress',\n    limit=10\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.hybrid(\n    query='white dress',\n    limit=10\n)",
        },
      },
    },
    {
      type: "text",
      id: "tex-d6a796e7-66be-4bb1-ab76-de01f9e884f0",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "60552f05-f4ac-4bce-9065-3c61f03da3e8",
      query_id: "40607ece-baf3-42e4-b397-da5bdc00b229",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now summarize the search results for white dresses from the Ecommerce collection.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-c6b3d2e1-433b-4a89-b012-d8a468ca4973",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "60552f05-f4ac-4bce-9065-3c61f03da3e8",
      query_id: "40607ece-baf3-42e4-b397-da5bdc00b229",
      payload: {
        type: "text_with_citations",
        metadata: {
          title: "White Dresses Available",
        },
        objects: [
          {
            text: 'Several white dresses are available in the Ecommerce collection, ranging from casual to formal styles. Many of the dresses are part of the "Light Academia" collection, known for its elegant and intellectual aesthetic.\n',
            ref_ids: [],
          },
          {
            text: 'For casual options, there\'s the "Seraphic Study Midi" dress, an ethereal ivory midi dress perfect for those who appreciate classical art and comfortable style. Another option is the "Breezy Bramble Dress", a light and airy dress suitable for countryside charm, though it is also available in green.\n',
            ref_ids: ["query_Ecommerce_0_0", "query_Ecommerce_0_3"],
          },
          {
            text: 'For formal occasions, consider "Athena\'s Gown", an ivory silk gown with gold accents, or the "Ivory Parchment Gown", featuring lace detailing and a flowing skirt. The "Eloquence Gown" is another elegant, ivory-colored option suitable for cultured gatherings.\n',
            ref_ids: [
              "query_Ecommerce_0_1",
              "query_Ecommerce_0_2",
              "query_Ecommerce_0_6",
            ],
          },
        ],
      },
    },
    {
      type: "suggestion",
      id: "7288e77e-ada2-4f1a-8c45-66125cf338e4",
      conversation_id: "60552f05-f4ac-4bce-9065-3c61f03da3e8",
      query_id: "40607ece-baf3-42e4-b397-da5bdc00b229",
      user_id: "com-f058bc92-fb59-4180-bafd-e013897ba2f7",
      payload: {
        error: "",
        suggestions: [],
      },
    },
  ],
  finished: true,
  query_start: new Date(),
  query_end: new Date(new Date().getTime() + 1000),
  NER: {
    text: "I'm looking for a white dress",
    noun_spans: [],
    entity_spans: [],
  },
  feedback: 1,
  index: 0,
};
