/* eslint-disable @typescript-eslint/no-explicit-any */
export const tableResponse: any = {
  id: "12345",
  query: "When was the highest wind recorded?",
  messages: [
    {
      type: "User",
      id: "80411939-2ea8-4178-bd22-2a6f834556e7",
      query_id: "2663dacf-4c10-4351-b753-8cf78c8b16a6",
      conversation_id: "30fb6699-81de-42b1-a190-f74f5dd351f7",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["When was the highest wind recorded?"],
      },
    },
    {
      type: "text",
      id: "tex-87a426aa-b1f3-40a3-8bdd-91a843c06f9b",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "30fb6699-81de-42b1-a190-f74f5dd351f7",
      query_id: "2663dacf-4c10-4351-b753-8cf78c8b16a6",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now query the Weather collection to find the highest recorded wind speed.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-abb234dd-eafb-4bab-bf07-610bddb2ba5f",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "30fb6699-81de-42b1-a190-f74f5dd351f7",
      query_id: "2663dacf-4c10-4351-b753-8cf78c8b16a6",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will sort the weather data by wind speed in descending order and limit the results to the top entry to find the highest recorded wind speed and its date.",
          },
        ],
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "30fb6699-81de-42b1-a190-f74f5dd351f7",
      query_id: "2663dacf-4c10-4351-b753-8cf78c8b16a6",
      id: "res-c7373331-c3d8-44fc-a81c-dd4ed6dce383",
      payload: {
        type: "table",
        objects: [
          {
            humidity: 0.93,
            precip_Type: "rain",
            wind_Bearing_degrees: 279,
            categorisation: "Windy and Foggy",
            visibility_km: 0.7567,
            formatted_Date: "2015-05-14T01:00:00Z",
            apparent_Temperature_C: 15.094444444444449,
            temperature_C: 15.094444444444449,
            cloud_Cover: 0,
            pressure_millibars: 1011.67,
            wind_Speed_km_h: 46.6095,
            daily_Summary: "Mostly cloudy throughout the day.",
            uuid: "5f00dfe5-9974-5a3c-b10b-369c8d514f11",
            _REF_ID: "query_Weather_0_0",
          },
        ],
        metadata: {
          collection_name: "Weather",
          display_type: "table",
          needs_summarising: false,
          query_text: null,
          query_type: "filter_only",
          chunked: false,
          query_output: {
            target_collections: ["Weather"],
            search_type: "filter_only",
            search_query: null,
            sort_by: {
              property_name: "wind_Speed_km_h",
              direction: "descending",
            },
            filter_buckets: null,
            limit: 1,
          },
          code: {
            language: "python",
            title: "Query",
            text: "collection.query.fetch_objects(\n    limit=1,\n    sort=Sort.by_property(\n        'wind_Speed_km_h',\n        ascending=False\n    )\n)",
          },
        },
        code: {
          language: "python",
          title: "Query",
          text: "collection.query.fetch_objects(\n    limit=1,\n    sort=Sort.by_property(\n        'wind_Speed_km_h',\n        ascending=False\n    )\n)",
        },
      },
    },
    {
      type: "text",
      id: "tex-4fb0f6b1-188f-41b0-9623-5ba2c84d0c16",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "30fb6699-81de-42b1-a190-f74f5dd351f7",
      query_id: "2663dacf-4c10-4351-b753-8cf78c8b16a6",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I am now creating a summary of the highest recorded wind speed and its date.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-8ff90132-8223-4373-aeef-283fa64a085b",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "30fb6699-81de-42b1-a190-f74f5dd351f7",
      query_id: "2663dacf-4c10-4351-b753-8cf78c8b16a6",
      payload: {
        type: "text_with_citations",
        metadata: {
          title: "Highest Recorded Wind Speed",
        },
        objects: [
          {
            text: "The highest recorded wind speed was on 2015-05-14T01:00:00Z, with a wind speed of 46.6095 km/h.",
            ref_ids: ["query_Weather_0_0"],
          },
        ],
      },
    },
    {
      type: "suggestion",
      id: "dfcfff0e-1c11-44a7-b005-688480e2eff0",
      conversation_id: "30fb6699-81de-42b1-a190-f74f5dd351f7",
      query_id: "2663dacf-4c10-4351-b753-8cf78c8b16a6",
      user_id: "com-0946d7d3-1f4e-475f-a0ec-586bfc749cae",
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
    text: "What is Elysia?",
    noun_spans: [],
    entity_spans: [[8, 14]],
  },
  feedback: 0,
  index: 0,
};
