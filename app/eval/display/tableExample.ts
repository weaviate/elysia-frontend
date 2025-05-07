/* eslint-disable @typescript-eslint/no-explicit-any */
export const tableResponse: any = {
  id: "12345",
  query: "When was the highest wind recorded?",
  messages: [
    {
      type: "User",
      id: "2dcc9a5d-d507-4d21-adf3-18d1687e1f67",
      query_id: "94570c95-1478-46de-acf2-324fdecff657",
      conversation_id: "368db6e7-849d-41a4-93e8-818dd368e9e0",
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
      conversation_id: "368db6e7-849d-41a4-93e8-818dd368e9e0",
      query_id: "94570c95-1478-46de-acf2-324fdecff657",
      id: "tex-767fde45-e051-4b5a-bffa-19c23bf784e4",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm initiating a search in the weather collection to find details about the highest wind speed recorded.",
          },
        ],
      },
    },
    {
      type: "text",
      conversation_id: "368db6e7-849d-41a4-93e8-818dd368e9e0",
      query_id: "94570c95-1478-46de-acf2-324fdecff657",
      id: "tex-dd8257ec-93fc-4bcb-a81e-7532290d438b",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm using an aggregation function to find the maximum wind speed recorded in the dataset.",
          },
        ],
      },
    },
    {
      type: "text",
      conversation_id: "368db6e7-849d-41a4-93e8-818dd368e9e0",
      query_id: "94570c95-1478-46de-acf2-324fdecff657",
      id: "tex-d41dbb3a-69e9-401e-ba41-a9cbbd65615a",
      payload: {
        type: "response",
        metadata: {},
        objects: [
          {
            text: "I'm grouping the results by date to identify the specific date when the highest wind speed occurred.",
          },
        ],
      },
    },
    {
      type: "result",
      conversation_id: "368db6e7-849d-41a4-93e8-818dd368e9e0",
      query_id: "94570c95-1478-46de-acf2-324fdecff657",
      id: "res-ce60a756-1243-44bf-906d-96fb737ffaf2",
      payload: {
        type: "aggregation",
        objects: [
          {
            weather: {
              date: {
                type: "text",
                values: [
                  {
                    value: 2,
                    field: "2023-11-26",
                    aggregation: "count",
                  },
                  {
                    value: 2,
                    field: "2023-11-08",
                    aggregation: "count",
                  },
                  {
                    value: 2,
                    field: "2023-05-02",
                    aggregation: "count",
                  },
                  {
                    value: 2,
                    field: "2023-12-13",
                    aggregation: "count",
                  },
                  {
                    value: 2,
                    field: "2023-11-17",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-11-22",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-12-08",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-06-16",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-04-30",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-05-12",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-10-13",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-01-22",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-09-20",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-08-06",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-09-10",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-09-04",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-04-11",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-03-25",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-08-04",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-03-14",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-02-09",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-03-09",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-03-13",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-08-23",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-03-06",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-08-12",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-04-01",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-08-13",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-10-01",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-10-11",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-01-19",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-03-12",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-02-24",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-09-06",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-09-15",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-02-02",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-01-11",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-02-04",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-12-06",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-03-22",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-02-19",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-01-13",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-10-17",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-08-18",
                    aggregation: "count",
                  },
                  {
                    value: 1,
                    field: "2023-10-08",
                    aggregation: "count",
                  },
                ],
                groups: {
                  "2023-11-26": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 89.6,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-11-08": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 91.5,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-05-02": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 93.5,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-12-13": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 91.1,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-11-17": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 12.6,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-11-22": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 24.8,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-12-08": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 12.2,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-06-16": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 30,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-04-30": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 14.6,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-05-12": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 56.1,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-10-13": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 53,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-01-22": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 12.4,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-09-20": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 30.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-08-06": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 85.5,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-09-10": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 36.2,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-09-04": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 94.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-04-11": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 34.2,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-03-25": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 41.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-08-04": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 44.5,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-03-14": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 55.7,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-02-09": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 19.6,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-03-09": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 73.8,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-03-13": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 72.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-08-23": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 44.3,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-03-06": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 38.4,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-08-12": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 62.5,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-04-01": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 72.7,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-08-13": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 69.7,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-10-01": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 35.8,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-10-11": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 49.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-01-19": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 26.7,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-03-12": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 87.5,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-02-24": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 73.2,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-09-06": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 54.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-09-15": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 84.7,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-02-02": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 24.8,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-01-11": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 23.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-02-04": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 54.4,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-12-06": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 69.3,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-03-22": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 17.7,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-02-19": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 93.5,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-01-13": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 69.9,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-10-17": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 30.4,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-08-18": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 74.1,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                  "2023-10-08": {
                    wind_speed: {
                      type: "number",
                      values: [
                        {
                          value: 36.6,
                          field: null,
                          aggregation: "maximum",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        ],
        metadata: {
          collection_name: "weather",
          description: [
            "Finding the maximum wind speed for each date in the weather data.",
          ],
          code: {
            language: "python",
            title: "Aggregation",
            text: 'collection.aggregate.over_all(\n    group_by=GroupByAggregate(prop="date"),\n    return_metrics=Metrics("wind_speed").number(maximum=True),\n)',
          },
        },
        code: {
          language: "python",
          title: "Aggregation",
          text: 'collection.aggregate.over_all(\n    group_by=GroupByAggregate(prop="date"),\n    return_metrics=Metrics("wind_speed").number(maximum=True),\n)',
        },
      },
    },
    {
      type: "text",
      conversation_id: "368db6e7-849d-41a4-93e8-818dd368e9e0",
      query_id: "94570c95-1478-46de-acf2-324fdecff657",
      id: "tex-99c85742-7f60-4386-9023-d41e1d68b9e0",
      payload: {
        type: "summary",
        metadata: {},
        objects: [
          {
            text: "The wind speed data reveals some remarkable meteorological moments in 2023. Among the recorded dates, the highest wind speed was **94.9 mph**, which occurred on **2023-09-04**. This represents an exceptionally strong wind event, likely categorized as a severe wind condition that could potentially cause significant environmental impact.",
            title: "Extreme Winds: Peak Velocity Revealed",
          },
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
  feedback: 0,
  index: 0,
};
