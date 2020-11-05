import React,{ useState,createContext, useEffect } from 'react'
import { addMonths, getKeyArray } from '../helpers'
import Axios from 'axios'
import {Auth} from '../components/Pages/Auth'
export const TrendAnalysisFiltersContext = createContext()
export const TrendAnalysisContext = ({ children }) => {
  const [sources, setSources] = useState({});
  const [languages, setLanguages] = useState({});
  const [from, setFrom] = useState(addMonths(new Date(), -1));
  const [to, setTo] = useState(addMonths(new Date(), 0));

  let trendAnalysisFilters = {
      sources,
      setSources,
      languages,
      setLanguages,
      from,
      to,
      setFrom,
      setTo
  }

  useEffect(() => {
    Axios.post(
      process.env.REACT_APP_URL,
      {
        aggs: {
          "date-based-range": {
            date_range: {
              field: "CreatedAt",
              format: "dd-MM-yyyy",
              ranges: [{ from: from, to: to }],
            },
            aggs: {
              "per-day": {
                date_histogram: {
                  field: "CreatedAt",
                  calendar_interval: "day",
                },
                aggs: {
                  Source: {
                    terms: {
                      field: "Source.keyword",
                    },
                    aggs: {
                      Lang: {
                        terms: {
                          field: "predictedLang.keyword",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      Auth
    )
      .then((fetchedData) => {
        var sourceKeys, languageKeys;
        var uniqueSourceKeys = [];
        var uniqueLanguageKeys = [];
        var perDayBucket =
          fetchedData.data.aggregations["date-based-range"].buckets[0][
            "per-day"
          ].buckets;
        var perDayKeys = perDayBucket.map(
          (key) => key.key_as_string.split("T")[0]
        );
        perDayKeys.forEach((dayKey, i) => {
          let sourceBuckets = perDayBucket[i].Source.buckets;
          sourceKeys = getKeyArray(sourceBuckets);
          sourceKeys.forEach((source, j) => {
            if (!uniqueSourceKeys.includes(source)) {
              uniqueSourceKeys.push(source);
            }
            let languageBuckets = sourceBuckets[j].Lang.buckets;
            languageKeys = getKeyArray(languageBuckets);
            languageKeys.forEach((language, k) => {
              if (!uniqueLanguageKeys.includes(language)) {
                uniqueLanguageKeys.push(language);
              }
            });
          });
        });
        let availableLanguageKeys = {};
        uniqueLanguageKeys.forEach((lang) => {
          availableLanguageKeys[lang] = true;
        });
        setLanguages(availableLanguageKeys);

        let availableSourceKeys = {};
        uniqueSourceKeys.forEach((source) => {
          availableSourceKeys[source] = true;
        });
        setSources(availableSourceKeys);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  return(
      <TrendAnalysisFiltersContext.Provider value={trendAnalysisFilters} >
          { children }
      </TrendAnalysisFiltersContext.Provider>
  )
}