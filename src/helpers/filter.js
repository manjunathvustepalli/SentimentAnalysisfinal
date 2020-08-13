
import { getDatesArray } from './index'
export const sentimentalAnalysisAreaChartFilter = (languages,sentiments,sources,data,from,to) => {
    let languageList = Object.keys(languages)
    let languageFilteredData = []
    languageList.forEach(language =>{
        if(languages[language]){
            languageFilteredData.push(data[language])
        }
    })
    let sourceList = Object.keys(sources)
    let sourceFilteredData = []
    languageFilteredData.forEach(sourceData =>{
        sourceList.forEach(source =>{
            if(sources[source] && sourceData[source]){
                sourceFilteredData.push(sourceData[source])
            }
        })
    })
    let dataArray = []
    sourceFilteredData.forEach(item => {
        let obj = {}
        obj['dates'] = item.dates
        if(sentiments['negative']){
            obj['negative'] = item.negative
        }
        if(sentiments['positive']){
            obj['positive'] = item.positive
        }
        if(sentiments['neutral']){
            obj['neutral'] = item.neutral
        }
        dataArray.push(obj)
    })
    let allDates = getDatesArray(from,to)
    let finalData = {}
    if(dataArray[0]){
        Object.keys(dataArray[0]).forEach(key =>{
            finalData[key] = []
        })
    }
    allDates.forEach(date => {
        dataArray.forEach(item => {
            if(item.dates.includes(date) && !finalData.dates.includes(date)){
                let index = item.dates.indexOf(date)
                Object.keys(item).forEach(key =>{
                    finalData[key].push(item[key][index])
                })
            } else if(item.dates.includes(date) && finalData.dates.includes(date)){
                let index = item.dates.indexOf(date)
                let finalIndex = finalData.dates.indexOf(date)
                Object.keys(item).forEach(key => {
                    if(key !== 'dates')
                    finalData[key][finalIndex] = finalData[key][finalIndex] + item[key][index]
                }) 
            }
        })
    })
    return finalData
}

export const MoodAnalysisAreaChartFilter = (languages,moods,sources,data,from,to) => {
    let languageList = Object.keys(languages)
    let languageFilteredData = []
    languageList.forEach(language =>{
        if(languages[language]){
            languageFilteredData.push(data[language])
        }
    })
    let sourceList = Object.keys(sources)
    let sourceFilteredData = []
    languageFilteredData.forEach(sourceData =>{
        sourceList.forEach(source =>{
            if(sources[source] && sourceData[source]){
                sourceFilteredData.push(sourceData[source])
            }
        })
    })
    let dataArray = []
    sourceFilteredData.forEach(item => {
        let obj = {}
        obj['dates'] = item.dates
        if(moods['joy']){
            obj['joy'] = item.joy
        }
        if(moods['anticipation']){
            obj['anticipation'] = item.anticipation
        }
        if(moods['fear']){
            obj['fear'] = item.fear
        }
        if(moods['disgust']){
            obj['disgust'] = item.disgust
        }
        if(moods['sad']){
            obj['sad'] = item.sad
        }
        if(moods['surprise']){
            obj['surprise'] = item.surprise
        }        
        if(moods['trust']){
            obj['trust'] = item.trust
        }
        if(moods['anger']){
            obj['anger'] = item.anger
        }
        dataArray.push(obj)
    })
    let allDates = getDatesArray(from,to)
    let finalData = {}
    if(dataArray[0]){
        Object.keys(dataArray[0]).forEach(key =>{
            finalData[key] = []
        })
    }
    allDates.forEach(date => {
        dataArray.forEach(item => {
            if(item.dates.includes(date) && !finalData.dates.includes(date)){
                let index = item.dates.indexOf(date)
                Object.keys(item).forEach(key =>{
                    finalData[key].push(item[key][index])
                })
            } else if(item.dates.includes(date) && finalData.dates.includes(date)){
                let index = item.dates.indexOf(date)
                let finalIndex = finalData.dates.indexOf(date)
                Object.keys(item).forEach(key => {
                    if(key !== 'dates')
                    finalData[key][finalIndex] = finalData[key][finalIndex] + item[key][index]
                }) 
            }
        })
    })
    return finalData  
}

export const MoodAnalysisPieChartFilter = (languages,sentiments,sources,data) => {
    let languageList = Object.keys(languages)
    let languageFilteredData = []
    languageList.forEach(language => {
        if(languages[language]){
            languageFilteredData.push(data[language])
        }
    })
    if(languageFilteredData[0]){
        let sourceList = Object.keys(sources)
        let sourceFilteredData = []
        languageFilteredData.forEach(sourceData =>{
            sourceList.forEach(source => {
                if(sources[source] && sourceData[source]){
                    sourceData[source]['source'] = source
                    sourceFilteredData.push(sourceData[source])
                }
            })
        })
        console.log(sourceFilteredData)
    }else {
        console.log('empty')
    }
}