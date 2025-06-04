/* eslint-disable @typescript-eslint/no-explicit-any */
export const AggregationResponse: any = {
  id: "12345",
  query: "What is Elysia?",
  messages: [
    {
      type: "User",
      id: "9dd5f834-34a0-4a49-a502-0c6bc8eb7bda",
      query_id: "642635ba-8148-4f0a-94ad-2ac0d9eb9216",
      conversation_id: "b2e31a4a-8106-40dc-b02c-bc86dd97ed60",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        type: "text",
        metadata: {},
        code: {
          language: "",
          title: "",
          text: "",
        },
        objects: ["min and max temperature of weather"],
      },
    },
    {
      type: "text",
      id: "tex-6b5e3036-02f2-433b-a54b-320a61b1d9ca",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b2e31a4a-8106-40dc-b02c-bc86dd97ed60",
      query_id: "642635ba-8148-4f0a-94ad-2ac0d9eb9216",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I will now find the minimum and maximum temperatures from the weather data.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-e16594a6-0da2-400d-a2f0-166653afef02",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b2e31a4a-8106-40dc-b02c-bc86dd97ed60",
      query_id: "642635ba-8148-4f0a-94ad-2ac0d9eb9216",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm creating an aggregation query to find the minimum and maximum values of the `temperature_C` field in the `Weather` collection.",
          },
        ],
      },
    },
    {
      type: "result",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b2e31a4a-8106-40dc-b02c-bc86dd97ed60",
      query_id: "642635ba-8148-4f0a-94ad-2ac0d9eb9216",
      id: "res-f8638b7d-4589-41be-8886-0289628c95b3",
      payload: {
        type: "aggregation",
        objects: [
          {
            num_items: 19291,
            collections: [
              {
                Weather: {
                  temperature_C: {
                    type: "number",
                    values: [
                      {
                        value: 0,
                        field: null,
                        aggregation: "count",
                      },
                      {
                        value: 37.19444444444444,
                        field: null,
                        aggregation: "maximum",
                      },
                      {
                        value: 0,
                        field: null,
                        aggregation: "mean",
                      },
                      {
                        value: 0,
                        field: null,
                        aggregation: "median",
                      },
                      {
                        value: -13.066666666666666,
                        field: null,
                        aggregation: "minimum",
                      },
                      {
                        value: 0,
                        field: null,
                        aggregation: "mode",
                      },
                      {
                        value: 0,
                        field: null,
                        aggregation: "sum",
                      },
                    ],
                  },
                },
              },
            ],
            _REF_ID: "aggregate_Weather_0_0",
          },
        ],
        metadata: {
          collection_name: "Weather",
          aggregation_output: {
            target_collections: ["Weather"],
            search_query: null,
            search_type: null,
            filter_buckets: null,
            groupby_property: null,
            number_property_aggregations: [
              {
                property_name: "temperature_C",
                metrics: ["MIN", "MAX"],
              },
            ],
            text_property_aggregations: null,
            boolean_property_aggregations: null,
            date_property_aggregations: null,
            limit: 5,
          },
          code: {
            language: "python",
            title: "Aggregation",
            text: "collection.aggregate.over_all(\n    total_count=True,\n    return_metrics=[\n        Metrics('temperature_C').number(minimum=True, maximum=True)\n]\n)",
          },
        },
        code: {
          language: "python",
          title: "Aggregation",
          text: "collection.aggregate.over_all(\n    total_count=True,\n    return_metrics=[\n        Metrics('temperature_C').number(minimum=True, maximum=True)\n]\n)",
        },
      },
    },
    {
      type: "text",
      id: "tex-68bb57fa-5829-4e44-bbf6-a04a37b2da90",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b2e31a4a-8106-40dc-b02c-bc86dd97ed60",
      query_id: "642635ba-8148-4f0a-94ad-2ac0d9eb9216",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm providing a summary of the minimum and maximum temperatures found in the weather data.",
          },
        ],
      },
    },
    {
      type: "text",
      id: "tex-497b4d24-4941-4455-ad08-85e4f890e464",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      conversation_id: "b2e31a4a-8106-40dc-b02c-bc86dd97ed60",
      query_id: "642635ba-8148-4f0a-94ad-2ac0d9eb9216",
      payload: {
        type: "text_with_citations",
        metadata: {
          title: "Minimum and Maximum Temperatures",
        },
        objects: [
          {
            text: "The minimum temperature recorded is -13.07°C, and the maximum temperature recorded is 37.19°C.\n",
            ref_ids: ["aggregate_Weather_0_0"],
          },
        ],
      },
    },
    {
      type: "suggestion",
      id: "b7cae969-9100-4575-95f3-87e677a99531",
      conversation_id: "b2e31a4a-8106-40dc-b02c-bc86dd97ed60",
      query_id: "642635ba-8148-4f0a-94ad-2ac0d9eb9216",
      user_id: "c5163446-4eff-5c3f-b362-33932ca630d4",
      payload: {
        error: "",
        suggestions: [
          "What was the average humidity on the days with the highest temperatures?",
          "Can you show me weather on days matching specific Ecommerce product releases?",
        ],
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
  feedback: 2,
  index: 0,
};
