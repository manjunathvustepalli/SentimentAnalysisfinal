import { getDatesArray } from './index'

var colors = {
    'joy':'#4C7A00',
    'sad':'#D8D8D8',
    'anger':'#FF5151',
    'anticipation':'#111D31',
    'disgust':'#D512CF',
    'surprise':'#FF6600',
    'fear':'#2000FF',
    'trust':'#0099FF',
    'positive':'#04E46C',
    'negative':'#CB0038',
    'neutral':'#FFC400'
  }

export const sentimentalAnalysisAreaChartFilter = (languages,sentiments,sources,subSources,data,from,to) => {
    let availableSubSources = []
    let languageList = Object.keys(languages)
    let languageFilteredData = []
    languageList.forEach(language =>{
        if(languages[language]){
            languageFilteredData.push(data[language])
        }
    })
    let sourceList = Object.keys(sources)
    let sourceFilteredData = []
    languageFilteredData.forEach(sourceData => {
        sourceList.forEach(source =>{
            if(sourceData && sources[source] && sourceData[source]){
                Object.keys(sourceData[source]).forEach(availableSubSource =>{
                    if(!availableSubSources.includes(availableSubSource)){
                        availableSubSources.push(availableSubSource)
                    }
                })
                sourceFilteredData.push(sourceData[source])
            }
        })
    })
    let subSourceList = Object.keys(subSources)
    let subSourceFilteredData = []
    sourceFilteredData.forEach(subSourceData =>{
        subSourceList.forEach(subSource => {
            if(subSources[subSource] && subSourceData[subSource]){
                subSourceFilteredData.push(subSourceData[subSource])
            }
        })
    })
    let dataArray = []
    subSourceFilteredData.forEach(item => {
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
    console.log(finalData)
    return [finalData,availableSubSources]
}

export const MoodAnalysisAreaChartFilter = (languages,moods,sources,subSources,data,from,to) => {
    let availableSubSources = []
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
            if(sourceData && sources[source] && sourceData[source]){
                Object.keys(sourceData[source]).forEach(availableSubSource =>{
                    if(!availableSubSources.includes(availableSubSource)){
                        availableSubSources.push(availableSubSource)
                    }
                })
                sourceFilteredData.push(sourceData[source])
            }
        })
    })
    let subSourceList = Object.keys(subSources)
    let subSourceFilteredData = []
    sourceFilteredData.forEach(subSourceData =>{
        subSourceList.forEach(subSource => {
            if(subSources[subSource] && subSourceData[subSource]){
                subSourceFilteredData.push(subSourceData[subSource])
            }
        })
    })
    let dataArray = []
    subSourceFilteredData.forEach(item => {
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
    return [finalData,availableSubSources]  
}

export const sentimentAnalysisPieChartFilter = (languages,sentiments,sources,data) => {
    let languageList = Object.keys(languages)
    let languageFilteredData = []
    languageList.forEach(language => {
        if(languages[language]){
            languageFilteredData.push(data[language])
        }
    })
    if(languageFilteredData[0]){
        let sourceFilteredData = {}
        languageFilteredData.forEach(sourceObj => {
            Object.keys(sourceObj).forEach(key => {
                if(sources[key]){
                    if(!sourceFilteredData[key]){
                        sourceFilteredData[key] = []
                        if(sentiments['negative']){
                            sourceFilteredData[key].push({name:'negative',y:sourceObj[key]['negative'] || 0,color:colors['negative']})
                        }
                        if(sentiments['positive']){
                            sourceFilteredData[key].push({name:'positive',y:sourceObj[key]['positive'] || 0,color:colors['positive']})
                        }
                        if(sentiments['neutral']){
                            sourceFilteredData[key].push({name:'neutral',y:sourceObj[key]['neutral'] || 0,color:colors['neutral']})
                        }
                    } else {
                        sourceFilteredData[key].forEach(obj =>{
                            if(obj['name'] === 'negative'){
                                obj.y = obj.y + sourceObj[key]['negative']
                            }
                            if(obj['name'] === 'positive'){
                                obj.y = obj.y + sourceObj[key]['positive']
                            }
                            if(obj['name'] === 'neutral'){
                                obj.y = obj.y + sourceObj[key]['neutral']
                            }
                        })
                    }
                }
            })
        })
        return sourceFilteredData
    }else {
        return []
    }
}

export const moodAnalysisPieChartFilter = (languages,moods,sources,data) =>{
    let languageList = Object.keys(languages)
    let languageFilteredData = []
    languageList.forEach(language => {
        if(languages[language]){
            languageFilteredData.push(data[language])
        }
    })
    if(languageFilteredData[0]){
        let sourceFilteredData = {}
        languageFilteredData.forEach(sourceObj =>{
            Object.keys(sourceObj).forEach(key => {
                if(sources[key]){
                    if(!sourceFilteredData[key]){
                        sourceFilteredData[key] = []
                        if(moods['joy']){
                            sourceFilteredData[key].push({name:'joy',y:sourceObj[key]['joy'] || 0})
                        }
                        if(moods['anticipation']){
                            sourceFilteredData[key].push({name:'anticipation',y:sourceObj[key]['anticipation'] || 0})
                        }
                        if(moods['fear']){
                            sourceFilteredData[key].push({name:'fear',y:sourceObj[key]['fear'] || 0})
                        }
                        if(moods['disgust']){
                            sourceFilteredData[key].push({name:'disgust',y:sourceObj[key]['disgust'] || 0})
                        }
                        if(moods['sad']){
                            sourceFilteredData[key].push({name:'sad',y:sourceObj[key]['sad'] || 0})
                        }
                        if(moods['surprise']){
                            sourceFilteredData[key].push({name:'surprise',y:sourceObj[key]['surprise'] || 0})
                        }
                        if(moods['trust']){
                            sourceFilteredData[key].push({name:'trust',y:sourceObj[key]['trust'] || 0})
                        }
                        if(moods['anger']){
                            sourceFilteredData[key].push({name:'anger',y:sourceObj[key]['anger'] || 0})
                        }
                        
                    } else {
                        sourceFilteredData[key].forEach(obj =>{
                            if(obj['name'] === 'joy'){
                                obj.y = obj.y + sourceObj[key]['joy']
                            }
                            if(obj['name'] === 'anticipation'){
                                obj.y = obj.y + sourceObj[key]['anticipation']
                            }
                            if(obj['name'] === 'fear'){
                                obj.y = obj.y + sourceObj[key]['fear']
                            }
                            if(obj['name'] === 'disgust'){
                                obj.y = obj.y + sourceObj[key]['disgust']
                            }
                            if(obj['name'] === 'sad'){
                                obj.y = obj.y + sourceObj[key]['sad']
                            }
                            if(obj['name'] === 'surprise'){
                                obj.y = obj.y + sourceObj[key]['surprise']
                            }
                            if(obj['name'] === 'trust'){
                                obj.y = obj.y + sourceObj[key]['trust']
                            }
                            if(obj['name'] === 'anger'){
                                obj.y = obj.y + sourceObj[key]['anger']
                            }
                        })
                    }
                }
            })
        })
        return sourceFilteredData
    } else {
        return []
    }
}

export const trendAnalysisBarGraphFilter = (languages,sources,sortedData) => {
    let sourceKeys = Object.keys(sources)
    let dates = Object.keys(sortedData)
    let series = []
    sourceKeys.forEach(source => {
        if(sources[source]){
            series.push({
                name:source,
                data:dates.map(date=>{
                    if(!sortedData[date][source]){
                        return 0
                    } else {
                        let langs = Object.keys(sortedData[date][source])
                        let sum = 0
                        langs.forEach(lang => {
                            if(languages[lang]){
                                sum = sum + sortedData[date][source][lang]
                            }
                        })
                        return sum
                    }
                })
            })
        }
    });
    return [series,dates]
}

export const TrendAnalysisLineChartFilter = (languages,sources,sortedData) => {
    let languageKeys = []
    Object.keys(languages).forEach(language => {
        if(languages[language]){
            languageKeys.push(language)
        }
    })
    let sourceKeys = Object.keys(sources)
    let dates = Object.keys(sortedData)
    let series = {}
    sourceKeys.forEach((source,i) => {
        if(sources[source]){
            series[source] = languageKeys.map(language => {
                return {
                    name:language,
                    data:dates.map(date =>{
                        if(!sortedData[date][source]){
                            return 0
                        } else {
                            if(!sortedData[date][source][language]){
                                return 0
                            } else {
                                return sortedData[date][source][language]
                            }
                        }
                    })
                }
            })
        }  
    })
    return [series,dates]
}

export const wordCloudSentimentFilter = (sources,subSources,sentiments,sortedData) => {
    let availableSubSources = []
    let filteredData = {}
    let languageKeys = Object.keys(sortedData)
    languageKeys.forEach(language => {
        filteredData[language] = []
        let sourceKeys = Object.keys(sortedData[language])
        sourceKeys.forEach(source => {
            if(sources[source]){
                let subSourceKeys = Object.keys(sortedData[language][source])
                subSourceKeys.forEach(subSource => {
                    if(subSources[subSource]){
                        if(!availableSubSources.includes(subSource)){
                            availableSubSources.push(subSource)
                        }
                        let sentimentKeys = Object.keys(sortedData[language][source][subSource])
                        sentimentKeys.forEach(sentiment => {
                            if(sentiments[sentiment]){
                                sortedData[language][source][subSource][sentiment] = sortedData[language][source][subSource][sentiment].sort((a,b)=>{
                                    return b.weight - a.weight
                                })
                                filteredData[language] = filteredData[language].concat(sortedData[language][source][subSource][sentiment])
                            }
                        })
                    }
                })
            }
        })
    })
    return filteredData
}

export const sentimentAnalysisLineChartFilter = (languages,subSources,sources,sentiments,sortedData,from,to) => {
    var uniqueSubSources = []
    var dataArray = []
    Object.keys(languages).forEach((language) =>{
        if(languages[language]){
            if(Object.keys(sortedData).length){
                Object.keys(sortedData[language]).forEach(source => {
                    if(sources[source])
                    Object.keys(sortedData[language][source]).forEach(subSource => {
                        if(!uniqueSubSources.includes(subSource)){
                            uniqueSubSources.push(subSource)
                        }
                        if(subSources[subSource]){
                            dataArray.push(sortedData[language][source][subSource])
                        }
                    })
                })
            }
        }
    })
    let allDates = getDatesArray(from,to)
    var negativeData = [];
    for (var i = 0; i < allDates.length; i++) negativeData[i] = 0;
    var positiveData = [...negativeData]
    var neutralData = [...negativeData]
        dataArray.forEach(item => {
            item.dates.forEach((date,i) => {
                let index = allDates.indexOf(date)
                if(sentiments['positive']){
                    positiveData[index] = positiveData[index] + item.positive[i]
                }
                if(sentiments['negative']){
                    negativeData[index] = negativeData[index] + item.negative[i]
                }
                if(sentiments['neutral']){
                    neutralData[index] = neutralData[index] + item.neutral[i]
                }
            })
        })
        let finalData = []
        if(sentiments['positive']){
            finalData.push({
                name:'positive',
                color:colors['positive'],
                data:positiveData
            })
        }
        if(sentiments['negative']){
            finalData.push({
                name:'negative',
                color:colors['negative'],
                data:negativeData
            })
        }
        if(sentiments['neutral']){
            finalData.push({
                name:'neutral',
                color:colors['neutral'],
                data:neutralData
            })
        }
        return[finalData,allDates,uniqueSubSources]
}

export const moodAnalysisLineChartFilter = (languages,subSources,sources,moods,sortedData,from,to) => {
    var uniqueSubSources = []
    var dataArray = []
    Object.keys(languages).forEach((language) =>{
        if(languages[language] && sortedData[language]){
            Object.keys(sortedData[language]).forEach(source => {
                if(sources[source])
                Object.keys(sortedData[language][source]).forEach(subSource => {
                    if(!uniqueSubSources.includes(subSource)){
                        uniqueSubSources.push(subSource)
                    }
                    if(subSources[subSource]){
                        dataArray.push(sortedData[language][source][subSource])
                    }
                })
            })
        }
    })
    let allDates = getDatesArray(from,to)
    var joyData = [];
    for (var i = 0; i < allDates.length; i++) joyData[i] = 0;
    var anticipationData = [...joyData]
    var fearData = [...joyData]
    var disgustData = [...joyData]
    var sadData = [...joyData]
    var surpriseData = [...joyData]
    var trustData = [...joyData]
    var angerData = [...joyData]
        dataArray.forEach(item => {
            item.dates.forEach((date,i) => {
                let index = allDates.indexOf(date)
                if(moods['joy']){
                    joyData[index] = joyData[index] + item.joy[i]
                }
                if(moods['anticipation']){
                    anticipationData[index] = anticipationData[index] + item.anticipation[i]
                }
                if(moods['fear']){
                    fearData[index] = fearData[index] + item.fear[i]
                }
                if(moods['disgust']){
                    disgustData[index] = disgustData[index] + item.disgust[i]
                }
                if(moods['sad']){
                    sadData[index] = sadData[index] + item.sad[i]
                }
                if(moods['surprise']){
                    surpriseData[index] = surpriseData[index] + item.surprise[i]
                }
                if(moods['trust']){
                    trustData[index] = trustData[index] + item.trust[i]
                }
                if(moods['anger']){
                    angerData[index] = angerData[index] + item.anger[i]
                }
            })
        })
        let finalData = []
        if(moods['joy']){
            finalData.push({
                name:'joy',
                color:colors['joy'],
                data:joyData
            })
        }
        if(moods['anticipation']){
            finalData.push({
                name:'anticipation',
                color:colors['anticipation'],
                data:anticipationData
            })
        }
        if(moods['fear']){
            finalData.push({
                name:'fear',
                color:colors['fear'],
                data:fearData
            })
        }
        if(moods['disgust']){
            finalData.push({
                name:'disgust',
                color:colors['disgust'],
                data:disgustData
            })
        }
        if(moods['sad']){
            finalData.push({
                name:'sad',
                color:colors['sad'],
                data:sadData
            })
        }
        if(moods['surprise']){
            finalData.push({
                name:'surprise',
                color:colors['surprise'],
                data:surpriseData
            })
        }
        if(moods['trust']){
            finalData.push({
                name:'trust',
                color:colors['trust'],
                data:trustData
            })
        }
        if(moods['anger']){
            finalData.push({
                name:'anger',
                color:colors['anger'],
                data:angerData
            })
        }
        return [finalData,allDates,uniqueSubSources] 
}
